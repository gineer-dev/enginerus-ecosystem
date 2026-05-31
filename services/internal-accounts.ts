import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { canAccessDashboardPath } from "@/lib/permissions/rbac";
import type { UserRole } from "@/types/domain";
import { generateTemporaryPassword, generateUsername, hashPassword, verifyPassword } from "@/services/customer-accounts";

type AnyRow = Record<string, unknown>;

export const internalRoles = ["Super Admin", "Admin", "Staff", "Service Advisor", "Mechanic", "Dyno Technician", "Inventory Personnel", "Management"] as const;
export type InternalRole = (typeof internalRoles)[number];
export type InternalAccountStatus = "Active" | "Disabled";

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

export function isInternalRole(value: string): value is InternalRole {
  return internalRoles.includes(value as InternalRole);
}

export function roleForProfile(role?: string | null): InternalRole {
  if (role === "Administrator") return "Super Admin";
  if (role && isInternalRole(role)) return role;
  return "Staff";
}

export function firstAllowedDashboardPath(role: string) {
  if (role === "Mechanic") return "/dashboard/job-orders";
  if (role === "Dyno Technician") return "/dashboard/dyno-management";
  if (role === "Inventory Personnel") return "/dashboard/inventory";
  if (role === "Management") return "/dashboard/reports";
  if (role === "Staff" || role === "Service Advisor") return "/dashboard/service-operations";
  return "/dashboard";
}

export async function auditInternalAccount(action: string, recordId: string, oldValue?: unknown, newValue?: unknown) {
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
    module: "Internal User Management",
    entity_type: "internal_accounts",
    record_id: recordId,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
  });
}

export async function getInternalAccountByAuthUserId(authUserId: string) {
  const { data, error } = await createAdminClient()
    .from("internal_accounts")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function ensureInternalAccountForUser(user: User, profile: { id: string; role?: string | null; status?: string | null }) {
  const existing = await getInternalAccountByAuthUserId(user.id);
  if (existing?.id) return existing;

  const admin = createAdminClient();
  const role = roleForProfile(profile.role);
  const email = user.email ?? "";
  const fullName = String(user.user_metadata?.full_name ?? email.split("@")[0] ?? "EngineRus User");
  const username = generateUsername(fullName, user.phone);

  const { data, error } = await admin
    .from("internal_accounts")
    .insert({
      profile_id: profile.id,
      auth_user_id: user.id,
      full_name: fullName,
      email,
      mobile_number: user.phone ?? null,
      username,
      account_status: profile.status === "Inactive" || profile.status === "Suspended" ? "Disabled" : "Active",
      role_name: role,
      is_first_login: false,
      must_change_password: false,
      password_changed_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function currentInternalAccount(options: { allowPasswordSetup?: boolean; pathname?: string } = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/login?redirectTo=/dashboard");
  const account = await getInternalAccountByAuthUserId(user.id);
  if (!account?.id) redirect("/login?error=No internal EngineRus OS account is linked to this login.");

  if (account.account_status === "Disabled") {
    await supabase.auth.signOut();
    redirect("/login?error=Your EngineRus OS account is disabled. Contact an administrator.");
  }

  if (!options.allowPasswordSetup && (account.is_first_login || account.must_change_password)) {
    redirect("/dashboard/setup-password");
  }

  if (options.pathname && !canAccessDashboardPath([account.role_name as UserRole], options.pathname)) {
    await auditInternalAccount("Unauthorized Access Attempt", account.id, null, { pathname: options.pathname, role_name: account.role_name });
    redirect("/dashboard/access-denied");
  }

  return { user, account };
}

export async function getInternalAccounts(filters?: { status?: string; role?: string; q?: string }) {
  let query = createAdminClient().from("internal_accounts").select("*").order("created_at", { ascending: false }).limit(200);

  if (filters?.status === "Active" || filters?.status === "Disabled") query = query.eq("account_status", filters.status);
  if (filters?.status === "First Login Pending") query = query.or("is_first_login.eq.true,must_change_password.eq.true");
  if (filters?.status === "Password Updated") query = query.eq("is_first_login", false).eq("must_change_password", false);
  if (filters?.status === "Never Logged In") query = query.is("last_login_at", null);
  if (filters?.role && isInternalRole(filters.role)) query = query.eq("role_name", filters.role);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  if (!filters?.q) return rows;

  const q = filters.q.trim().toLowerCase();
  return rows.filter((row: AnyRow) => [row.full_name, row.email, row.mobile_number, row.username, row.role_name].some((value) => String(value ?? "").toLowerCase().includes(q)));
}

export async function getInternalAccountRows(filters?: { status?: string; role?: string; q?: string }) {
  const rows = await getInternalAccounts(filters);
  return rows.map((row: AnyRow) => ({
    id: String(row.id),
    full_name: text(row.full_name),
    email: text(row.email),
    mobile_number: text(row.mobile_number),
    username: text(row.username),
    role_name: text(row.role_name),
    account_status: text(row.account_status),
    first_login_status: row.is_first_login || row.must_change_password ? "Pending" : "Password Updated",
    date_created: dateText(row.created_at),
    last_login: dateText(row.last_login_at),
  }));
}

export async function getInternalAccountMetrics() {
  const accounts = await getInternalAccounts();
  return {
    total: accounts.length,
    active: accounts.filter((account) => account.account_status === "Active").length,
    disabled: accounts.filter((account) => account.account_status === "Disabled").length,
    pendingFirstLogin: accounts.filter((account) => account.is_first_login || account.must_change_password).length,
    neverLoggedIn: accounts.filter((account) => !account.last_login_at).length,
  };
}

export { generateTemporaryPassword, generateUsername, hashPassword, verifyPassword };
