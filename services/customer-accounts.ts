import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type AnyRow = Record<string, unknown>;

export type CustomerAccountStatus = "Active" | "Disabled";

function text(value: unknown) {
  if (typeof value === "string" && value.length > 0) return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return "-";
}

function dateText(value: unknown) {
  if (typeof value !== "string" || !value) return "Never";
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function obj(value: unknown): AnyRow {
  return value && typeof value === "object" ? (value as AnyRow) : {};
}

export function generateTemporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const body = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `ERus@${body}7`;
}

export function generateUsername(fullName: string, mobileNumber?: string | null) {
  const base = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\\.|\\.$)/g, "")
    .slice(0, 24) || "customer";
  const suffix = mobileNumber?.replace(/\\D/g, "").slice(-4) || String(Date.now()).slice(-4);
  return `${base}.${suffix}`;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash?: string | null) {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export async function auditCustomerAccount(action: string, recordId: string, oldValue?: unknown, newValue?: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  let profileId: string | null = null;
  if (user?.id) {
    const { data: profile } = await admin.from("profiles").select("id").or(`id.eq.${user.id},user_id.eq.${user.id}`).maybeSingle();
    profileId = profile?.id ?? null;
  }

  await admin.from("audit_logs").insert({
    user_id: profileId,
    action,
    module: "Customer Account Management",
    entity_type: "customer_accounts",
    record_id: recordId,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
  });
}

export async function getCustomerAccountByAuthUserId(authUserId: string) {
  const { data, error } = await createAdminClient()
    .from("customer_accounts")
    .select("*, customers(customer_number, full_name, email, mobile_number, contact_number)")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function currentCustomerAccount(options: { allowPasswordSetup?: boolean } = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/customer/login?redirectTo=/customer/dashboard");

  const account = await getCustomerAccountByAuthUserId(user.id);
  if (!account?.id) {
    redirect("/customer/login?error=No customer portal account is linked to this login yet. Please contact Dr. Engine R'us.");
  }

  if (account.account_status === "Disabled") {
    await supabase.auth.signOut();
    redirect("/customer/login?error=Your customer portal account is disabled. Please contact Dr. Engine R'us.");
  }

  if (!options.allowPasswordSetup && (account.is_first_login || account.must_change_password)) {
    redirect("/customer/setup-password");
  }

  return { user, account };
}

export async function getCustomerAccounts(filters?: { status?: string; q?: string }) {
  let query = createAdminClient()
    .from("customer_accounts")
    .select("*, customers(customer_number, full_name, mobile_number, contact_number)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filters?.status === "Active" || filters?.status === "Disabled") query = query.eq("account_status", filters.status);
  if (filters?.status === "First Login Pending") query = query.or("is_first_login.eq.true,must_change_password.eq.true");
  if (filters?.status === "Password Updated") query = query.eq("is_first_login", false).eq("must_change_password", false);
  if (filters?.status === "Never Logged In") query = query.is("last_login_at", null);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  if (!filters?.q) return rows;

  const q = filters.q.trim().toLowerCase();
  return rows.filter((row: AnyRow) => {
    const customer = obj(row.customers);
    return [row.email, row.username, row.mobile_number, customer.full_name, customer.customer_number, customer.mobile_number, customer.contact_number]
      .some((value) => String(value ?? "").toLowerCase().includes(q));
  });
}

export async function getCustomerAccountRows(filters?: { status?: string; q?: string }) {
  const rows = await getCustomerAccounts(filters);
  return rows.map((row: AnyRow) => {
    const customer = obj(row.customers);
    return {
      id: String(row.id),
      customer_id: text(customer.customer_number),
      full_name: text(customer.full_name),
      email: text(row.email),
      mobile_number: text(row.mobile_number ?? customer.mobile_number ?? customer.contact_number),
      username: text(row.username),
      account_status: text(row.account_status),
      first_login_status: row.is_first_login || row.must_change_password ? "Pending" : "Password Updated",
      date_created: dateText(row.created_at),
      last_login: dateText(row.last_login_at),
    };
  });
}

export async function getCustomerAccountMetrics() {
  const accounts = await getCustomerAccounts();
  return {
    total: accounts.length,
    active: accounts.filter((account) => account.account_status === "Active").length,
    disabled: accounts.filter((account) => account.account_status === "Disabled").length,
    pendingFirstLogin: accounts.filter((account) => account.is_first_login || account.must_change_password).length,
    neverLoggedIn: accounts.filter((account) => !account.last_login_at).length,
    passwordUpdated: accounts.filter((account) => !account.is_first_login && !account.must_change_password).length,
  };
}
