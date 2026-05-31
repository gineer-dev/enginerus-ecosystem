"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  authSchema,
  customerAccountCreateSchema,
  customerGarageMotorcycleSchema,
  customerPortalRegisterSchema,
  customerPortalServiceRequestSchema,
  customerSetupPasswordSchema,
  customerSchema,
  internalAccountCreateSchema,
  internalAccountUpdateSchema,
  internalSetupPasswordSchema,
  inquirySchema,
  jobOrderSchema,
  motorcycleSchema,
  publicServiceRequestSchema,
  reservationSchema,
  serviceBookingSchema,
} from "@/lib/validations/forms";
import { productSchema } from "@/lib/validations/product";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  auditCustomerAccount,
  generateTemporaryPassword,
  generateUsername,
  getCustomerAccountByAuthUserId,
  hashPassword,
  verifyPassword,
} from "@/services/customer-accounts";
import {
  auditInternalAccount,
  firstAllowedDashboardPath,
  generateTemporaryPassword as generateInternalTemporaryPassword,
  generateUsername as generateInternalUsername,
  getInternalAccountByAuthUserId,
  hashPassword as hashInternalPassword,
  verifyPassword as verifyInternalPassword,
} from "@/services/internal-accounts";

function formObject(formData: FormData) {
  return Object.fromEntries([...formData.entries()].filter(([, value]) => value !== ""));
}

async function setCustomerAccountCredentialFlash(payload: { type: "created" | "reset"; username?: string; temporaryPassword: string }) {
  const cookieStore = await cookies();
  cookieStore.set("customer_account_credentials", JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/dashboard/account-management",
    maxAge: 300,
  });
}

async function setInternalAccountCredentialFlash(payload: { type: "created" | "reset"; username?: string; temporaryPassword: string }) {
  const cookieStore = await cookies();
  cookieStore.set("internal_account_credentials", JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/dashboard/account-management",
    maxAge: 300,
  });
}

export async function signIn(formData: FormData) {
  const payload = authSchema.parse(formObject(formData));
  const redirectTo = formData.get("redirectTo");
  const nextPath = typeof redirectTo === "string" && redirectTo.startsWith("/") ? redirectTo : "/dashboard";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(payload);
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id) {
    const admin = createAdminClient();
    const { data: account, error: accountError } = await admin
      .from("internal_accounts")
      .select("id, account_status, is_first_login, must_change_password, role_name")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (accountError) throw new Error(accountError.message);
    if (account?.account_status === "Disabled") {
      await supabase.auth.signOut();
      redirect("/login?error=Your EngineRus OS account is disabled. Contact an administrator.");
    }
    if (account?.id) {
      await admin.from("internal_accounts").update({ last_login_at: new Date().toISOString() }).eq("id", account.id);
      if (account.is_first_login || account.must_change_password) redirect("/dashboard/setup-password");
      revalidatePath("/", "layout");
      redirect(firstAllowedDashboardPath(account.role_name));
    }
  }
  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function signUp(formData: FormData) {
  const payload = authSchema.parse(formObject(formData));
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(payload);
  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

async function ensureCustomerAccount(payload: { full_name?: string | null; email: string; contact_number?: string | null; address?: string | null }) {
  const supabase = createAdminClient();
  const { data: existingCustomer, error: lookupError } = await supabase
    .from("customers")
    .select("id")
    .eq("email", payload.email)
    .maybeSingle();

  if (lookupError) throw new Error(lookupError.message);
  if (existingCustomer?.id) return existingCustomer.id;

  const customerNumber = `CUS-${Date.now()}`;
  const { data: customer, error } = await supabase
    .from("customers")
    .insert({
      customer_number: customerNumber,
      customer_id: customerNumber,
      full_name: payload.full_name ?? payload.email.split("@")[0],
      contact_number: payload.contact_number,
      mobile_number: payload.contact_number,
      email: payload.email,
      address: payload.address ?? "Customer Portal",
      customer_type: "Motorcycle Owner",
      notes: "Created from Dr. Engine R'us Customer Portal",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return customer.id;
}

async function isStaffAccount(userId: string, email?: string | null) {
  const supabase = createAdminClient();
  const filters = [`id.eq.${userId}`, `user_id.eq.${userId}`];
  if (email) filters.push(`email.eq.${email}`);

  const { data, error } = await supabase.from("profiles").select("id").or(filters.join(",")).limit(1);
  if (error) throw new Error(error.message);
  return Boolean(data?.length);
}

export async function customerSignIn(formData: FormData) {
  const payload = authSchema.parse(formObject(formData));
  const redirectTo = formData.get("redirectTo");
  const nextPath = typeof redirectTo === "string" && redirectTo.startsWith("/customer") ? redirectTo : "/customer/dashboard";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(payload);
  if (error) redirect(`/customer/login?error=${encodeURIComponent(error.message)}`);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && (await isStaffAccount(user.id, user.email))) {
    await supabase.auth.signOut();
    redirect("/customer/login?error=This email belongs to an EngineRus OS staff account. Use the internal login instead.");
  }
  const admin = createAdminClient();
  const { data: account, error: accountError } = await admin
    .from("customer_accounts")
    .select("id, account_status, is_first_login, must_change_password")
    .eq("auth_user_id", user?.id)
    .maybeSingle();

  if (accountError) throw new Error(accountError.message);
  if (account?.account_status === "Disabled") {
    await supabase.auth.signOut();
    redirect("/customer/login?error=Your customer portal account is disabled. Please contact Dr. Engine R'us.");
  }
  if (!account?.id) {
    await supabase.auth.signOut();
    redirect("/customer/login?error=No customer portal account is linked to this login yet. Please contact Dr. Engine R'us.");
  }

  await ensureCustomerAccount({ email: payload.email });
  await admin.from("customer_accounts").update({ last_login_at: new Date().toISOString() }).eq("id", account.id);

  revalidatePath("/customer", "layout");
  if (account?.is_first_login || account?.must_change_password) redirect("/customer/setup-password");
  redirect(nextPath);
}

export async function customerSignUp(formData: FormData) {
  const payload = customerPortalRegisterSchema.parse(formObject(formData));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.full_name,
        portal: "customer",
      },
    },
  });
  if (error) redirect(`/customer/register?error=${encodeURIComponent(error.message)}`);
  const customerId = await ensureCustomerAccount(payload);
  if (data.user?.id) {
    const admin = createAdminClient();
    const { data: existingAccount, error: lookupError } = await admin
      .from("customer_accounts")
      .select("id")
      .or(`auth_user_id.eq.${data.user.id},email.eq.${payload.email}`)
      .maybeSingle();
    if (lookupError) throw new Error(lookupError.message);
    if (!existingAccount?.id) {
      const tempHash = await hashPassword(payload.password);
      const { error: accountError } = await admin.from("customer_accounts").insert({
        customer_id: customerId,
        auth_user_id: data.user.id,
        username: generateUsername(payload.full_name, payload.contact_number),
        email: payload.email,
        mobile_number: payload.contact_number,
        temporary_password_hash: tempHash,
        account_status: "Active",
        is_first_login: true,
        must_change_password: true,
      });
      if (accountError) throw new Error(accountError.message);
    }
  }
  revalidatePath("/customer", "layout");
  redirect("/customer/login?message=Check your email to confirm your customer account, then sign in.");
}

export async function customerResetPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) redirect(`/customer/forgot-password?error=${encodeURIComponent(error.message)}`);
  redirect("/customer/login?message=Password reset instructions have been sent to your email.");
}

export async function createProduct(formData: FormData) {
  const payload = productSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").insert({
      sku: payload.sku,
      name: payload.name,
      brand: payload.brand,
      model: payload.model,
      serial_number: payload.serial_number,
      description: payload.description,
      acquisition_cost: payload.acquisition_cost,
      cost_price: payload.cost_price,
      selling_price: payload.selling_price,
      quantity: payload.quantity,
      available_quantity: payload.quantity,
      reorder_point: Number(formData.get("reorder_point") ?? 0),
      critical_stock_level: Number(formData.get("critical_stock_level") ?? 0),
      marketplace_enabled: formData.get("marketplace_enabled") === "on",
      location: payload.location,
      status: payload.status,
      branch_id: payload.branch_id,
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function createInquiry(formData: FormData) {
  const payload = inquirySchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const customerId = await ensureCustomerAccount({
      full_name: payload.full_name,
      email: payload.email,
      contact_number: payload.contact_number,
      address: "Marketplace inquiry",
    });
    const { error } = await supabase.from("inquiries").insert({
      product_id: payload.product_id,
      customer_id: customerId,
      full_name: payload.full_name,
      email: payload.email,
      contact_number: payload.contact_number,
      message: payload.message,
      status: "New",
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/inquiries");
  redirect("/inquiries?submitted=true");
}

export async function createReservation(formData: FormData) {
  const payload = reservationSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const customerId = await ensureCustomerAccount({
      full_name: payload.full_name,
      email: payload.email,
      address: "Marketplace reservation",
    });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const { error } = await supabase.from("reservations").insert({
      product_id: payload.product_id,
      customer_id: customerId,
      reservation_fee: payload.reservation_fee,
      expiry_date: expiryDate.toISOString(),
      status: "Pending",
      notes: payload.notes,
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/reservations");
  redirect("/reservations?submitted=true");
}

export async function createCustomer(formData: FormData) {
  const payload = customerSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const customer_number = `CUS-${Date.now()}`;
    const { error } = await supabase.from("customers").insert({
      ...payload,
      customer_number,
      customer_id: customer_number,
      contact_number: payload.contact_number ?? payload.mobile_number,
      mobile_number: payload.mobile_number ?? payload.contact_number,
      customer_type: payload.customer_type ?? "Retail",
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function createCustomerPortalAccount(formData: FormData) {
  const payload = customerAccountCreateSchema.parse(formObject(formData));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/dashboard/account-management/create-customer-account");

  const admin = createAdminClient();
  const email = payload.email.toLowerCase();
  const username = payload.username?.trim() || generateUsername(payload.full_name, payload.mobile_number);
  const temporaryPassword = payload.temporary_password?.trim() || generateTemporaryPassword();

  const [{ data: existingEmail }, { data: existingUsername }, { data: existingMobile }] = await Promise.all([
    admin.from("customer_accounts").select("id").eq("email", email).maybeSingle(),
    admin.from("customer_accounts").select("id").eq("username", username).maybeSingle(),
    admin.from("customer_accounts").select("id").eq("mobile_number", payload.mobile_number).maybeSingle(),
  ]);

  if (existingEmail?.id) redirect("/dashboard/account-management/create-customer-account?error=Email already has a customer portal account.");
  if (existingUsername?.id) redirect("/dashboard/account-management/create-customer-account?error=Username already exists.");
  if (existingMobile?.id) redirect("/dashboard/account-management/create-customer-account?error=Mobile number already has a customer portal account.");

  let customerId: string;
  const { data: existingCustomer, error: customerLookupError } = await admin
    .from("customers")
    .select("id")
    .or(`email.eq.${email},mobile_number.eq.${payload.mobile_number},contact_number.eq.${payload.mobile_number}`)
    .maybeSingle();
  if (customerLookupError) throw new Error(customerLookupError.message);

  if (existingCustomer?.id) {
    customerId = existingCustomer.id;
    await admin
      .from("customers")
      .update({ full_name: payload.full_name, email, mobile_number: payload.mobile_number, contact_number: payload.mobile_number })
      .eq("id", customerId);
  } else {
    const customerNumber = `CUS-${Date.now()}`;
    const { data: customer, error: customerError } = await admin
      .from("customers")
      .insert({
        customer_number: customerNumber,
        customer_id: customerNumber,
        full_name: payload.full_name,
        email,
        mobile_number: payload.mobile_number,
        contact_number: payload.mobile_number,
        address: "Created from Customer Account Management",
        customer_type: "Motorcycle Owner",
        created_by: user.id,
      })
      .select("id")
      .single();
    if (customerError) throw new Error(customerError.message);
    customerId = customer.id;
  }

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      full_name: payload.full_name,
      portal: "customer",
      username,
    },
  });

  if (authError) redirect(`/dashboard/account-management/create-customer-account?error=${encodeURIComponent(authError.message)}`);

  const { data: account, error: accountError } = await admin
    .from("customer_accounts")
    .insert({
      customer_id: customerId,
      auth_user_id: authUser.user.id,
      username,
      email,
      mobile_number: payload.mobile_number,
      temporary_password_hash: await hashPassword(temporaryPassword),
      account_status: payload.account_status,
      is_first_login: true,
      must_change_password: true,
      credentials_last_sent_at: new Date().toISOString(),
      created_by: user.id,
    })
    .select("id")
    .single();

  if (accountError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    throw new Error(accountError.message);
  }

  await auditCustomerAccount("Account Created", account.id, null, {
    email,
    username,
    account_status: payload.account_status,
    temporary_password_generated: true,
  });

  await setCustomerAccountCredentialFlash({ type: "created", username, temporaryPassword });
  revalidatePath("/dashboard/account-management");
  redirect(`/dashboard/account-management/customer-accounts?created=${account.id}`);
}

export async function updateCustomerAccountStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("account_status") ?? "");
  if (!id || !["Active", "Disabled"].includes(status)) throw new Error("Invalid account status.");

  const admin = createAdminClient();
  const { data: before, error: lookupError } = await admin.from("customer_accounts").select("*").eq("id", id).single();
  if (lookupError) throw new Error(lookupError.message);

  const { error } = await admin.from("customer_accounts").update({ account_status: status }).eq("id", id);
  if (error) throw new Error(error.message);

  await auditCustomerAccount(status === "Active" ? "Account Enabled" : "Account Disabled", id, before, { account_status: status });
  revalidatePath("/dashboard/account-management");
}

export async function resetCustomerPortalPassword(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing customer account.");

  const admin = createAdminClient();
  const { data: account, error: lookupError } = await admin.from("customer_accounts").select("id, auth_user_id, email").eq("id", id).single();
  if (lookupError) throw new Error(lookupError.message);
  if (!account.auth_user_id) throw new Error("Customer account is not linked to Supabase Auth.");

  const temporaryPassword = generateTemporaryPassword();
  const { error: authError } = await admin.auth.admin.updateUserById(account.auth_user_id, {
    password: temporaryPassword,
  });
  if (authError) throw new Error(authError.message);

  const { error } = await admin
    .from("customer_accounts")
    .update({
      temporary_password_hash: await hashPassword(temporaryPassword),
      is_first_login: true,
      must_change_password: true,
      password_changed_at: null,
      credentials_last_sent_at: new Date().toISOString(),
      reset_requested_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await admin.from("notifications").insert({
    title: "Customer password reset",
    message: `Temporary password regenerated for ${account.email}.`,
    type: "Account",
    event_type: "Password Reset",
    channel: "In-app",
  });
  await auditCustomerAccount("Password Reset", id, null, { temporary_password_generated: true });

  await setCustomerAccountCredentialFlash({ type: "reset", temporaryPassword });
  revalidatePath("/dashboard/account-management");
  redirect(`/dashboard/account-management/customer-accounts?reset=${id}`);
}

export async function resendCustomerCredentials(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing customer account.");
  const admin = createAdminClient();
  const { error } = await admin.from("customer_accounts").update({ credentials_last_sent_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  await auditCustomerAccount("Resend Credentials", id, null, { credentials_last_sent_at: new Date().toISOString() });
  revalidatePath("/dashboard/account-management");
}

export async function setupCustomerPassword(formData: FormData) {
  const payload = customerSetupPasswordSchema.safeParse(formObject(formData));
  if (!payload.success) {
    redirect(`/customer/setup-password?error=${encodeURIComponent(payload.error.issues[0]?.message ?? "Password validation failed.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/customer/login?redirectTo=/customer/setup-password");

  const account = await getCustomerAccountByAuthUserId(user.id);
  if (!account?.id) redirect("/customer/login?error=No customer portal account is linked to this login yet.");

  const tempMatches = await verifyPassword(payload.data.current_password, account.temporary_password_hash);
  if (!tempMatches) redirect("/customer/setup-password?error=Temporary password incorrect.");

  const { error: updateError } = await supabase.auth.updateUser({ password: payload.data.new_password });
  if (updateError) redirect(`/customer/setup-password?error=${encodeURIComponent(updateError.message)}`);

  const admin = createAdminClient();
  const { error } = await admin
    .from("customer_accounts")
    .update({
      temporary_password_hash: null,
      is_first_login: false,
      must_change_password: false,
      password_changed_at: new Date().toISOString(),
    })
    .eq("id", account.id);
  if (error) throw new Error(error.message);

  await auditCustomerAccount("First Password Change", account.id, { is_first_login: true, must_change_password: true }, { is_first_login: false, must_change_password: false });

  revalidatePath("/customer", "layout");
  redirect("/customer/dashboard");
}

export async function createInternalUserAccount(formData: FormData) {
  const payload = internalAccountCreateSchema.parse(formObject(formData));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/dashboard/account-management/create-internal-user");

  const admin = createAdminClient();
  const email = payload.email.toLowerCase();
  const username = payload.username?.trim() || generateInternalUsername(payload.full_name, payload.mobile_number);
  const temporaryPassword = payload.temporary_password?.trim() || generateInternalTemporaryPassword();

  const [{ data: existingEmail }, { data: existingUsername }, { data: existingMobile }] = await Promise.all([
    admin.from("internal_accounts").select("id").eq("email", email).maybeSingle(),
    admin.from("internal_accounts").select("id").eq("username", username).maybeSingle(),
    admin.from("internal_accounts").select("id").eq("mobile_number", payload.mobile_number).maybeSingle(),
  ]);

  if (existingEmail?.id) redirect("/dashboard/account-management/create-internal-user?error=Email already has an internal account.");
  if (existingUsername?.id) redirect("/dashboard/account-management/create-internal-user?error=Username already exists.");
  if (existingMobile?.id) redirect("/dashboard/account-management/create-internal-user?error=Mobile number already has an internal account.");

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      full_name: payload.full_name,
      portal: "internal",
      username,
      role: payload.role_name,
    },
    app_metadata: {
      account_type: "internal",
      role: payload.role_name,
    },
  });

  if (authError) redirect(`/dashboard/account-management/create-internal-user?error=${encodeURIComponent(authError.message)}`);

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .upsert({
      id: authUser.user.id,
      user_id: authUser.user.id,
      email,
      full_name: payload.full_name,
      contact_number: payload.mobile_number,
      role: payload.role_name,
      status: payload.account_status === "Active" ? "Active" : "Inactive",
    })
    .select("id")
    .single();

  if (profileError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    throw new Error(profileError.message);
  }

  const { data: role } = await admin.from("roles").select("id").eq("name", payload.role_name).maybeSingle();
  if (role?.id) await admin.from("user_roles").upsert({ user_id: profile.id, role_id: role.id });

  const { data: account, error: accountError } = await admin
    .from("internal_accounts")
    .insert({
      profile_id: profile.id,
      auth_user_id: authUser.user.id,
      full_name: payload.full_name,
      email,
      mobile_number: payload.mobile_number,
      username,
      temporary_password_hash: await hashInternalPassword(temporaryPassword),
      account_status: payload.account_status,
      role_name: payload.role_name,
      is_first_login: true,
      must_change_password: true,
      credentials_last_sent_at: new Date().toISOString(),
      created_by: user.id,
    })
    .select("id")
    .single();

  if (accountError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    throw new Error(accountError.message);
  }

  await auditInternalAccount("Internal User Created", account.id, null, {
    email,
    username,
    role_name: payload.role_name,
    account_status: payload.account_status,
    temporary_password_generated: true,
  });
  await setInternalAccountCredentialFlash({ type: "created", username, temporaryPassword });
  revalidatePath("/dashboard/account-management");
  redirect(`/dashboard/account-management/internal-users?created=${account.id}`);
}

export async function updateInternalUserAccount(formData: FormData) {
  const payload = internalAccountUpdateSchema.parse(formObject(formData));
  const admin = createAdminClient();
  const { data: before, error: lookupError } = await admin.from("internal_accounts").select("*").eq("id", payload.id).single();
  if (lookupError) throw new Error(lookupError.message);

  const { error } = await admin
    .from("internal_accounts")
    .update({
      full_name: payload.full_name,
      email: payload.email.toLowerCase(),
      mobile_number: payload.mobile_number,
      username: payload.username,
      role_name: payload.role_name,
      account_status: payload.account_status,
    })
    .eq("id", payload.id);
  if (error) throw new Error(error.message);

  if (before.auth_user_id) {
    await admin.auth.admin.updateUserById(String(before.auth_user_id), {
      email: payload.email.toLowerCase(),
      user_metadata: { full_name: payload.full_name, username: payload.username, role: payload.role_name },
      app_metadata: { account_type: "internal", role: payload.role_name },
    });
  }
  if (before.profile_id) {
    await admin.from("profiles").update({
      full_name: payload.full_name,
      email: payload.email.toLowerCase(),
      contact_number: payload.mobile_number,
      role: payload.role_name,
      status: payload.account_status === "Active" ? "Active" : "Inactive",
    }).eq("id", before.profile_id);
    const { data: role } = await admin.from("roles").select("id").eq("name", payload.role_name).maybeSingle();
    if (role?.id) {
      await admin.from("user_roles").delete().eq("user_id", before.profile_id);
      await admin.from("user_roles").insert({ user_id: before.profile_id, role_id: role.id });
    }
  }

  await auditInternalAccount(before.role_name !== payload.role_name ? "Role Changed" : "Internal User Updated", payload.id, before, payload);
  revalidatePath("/dashboard/account-management");
  redirect("/dashboard/account-management/internal-users");
}

export async function updateInternalAccountStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("account_status") ?? "");
  if (!id || !["Active", "Disabled"].includes(status)) throw new Error("Invalid account status.");

  const admin = createAdminClient();
  const { data: before, error: lookupError } = await admin.from("internal_accounts").select("*").eq("id", id).single();
  if (lookupError) throw new Error(lookupError.message);

  const { error } = await admin.from("internal_accounts").update({ account_status: status }).eq("id", id);
  if (error) throw new Error(error.message);
  if (before.profile_id) await admin.from("profiles").update({ status: status === "Active" ? "Active" : "Inactive" }).eq("id", before.profile_id);

  await auditInternalAccount(status === "Active" ? "Account Enabled" : "Account Disabled", id, before, { account_status: status });
  revalidatePath("/dashboard/account-management");
}

export async function resetInternalUserPassword(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing internal account.");

  const admin = createAdminClient();
  const { data: account, error: lookupError } = await admin.from("internal_accounts").select("id, auth_user_id, email").eq("id", id).single();
  if (lookupError) throw new Error(lookupError.message);
  if (!account.auth_user_id) throw new Error("Internal account is not linked to Supabase Auth.");

  const temporaryPassword = generateInternalTemporaryPassword();
  const { error: authError } = await admin.auth.admin.updateUserById(account.auth_user_id, { password: temporaryPassword });
  if (authError) throw new Error(authError.message);

  const { error } = await admin
    .from("internal_accounts")
    .update({
      temporary_password_hash: await hashInternalPassword(temporaryPassword),
      is_first_login: true,
      must_change_password: true,
      password_changed_at: null,
      credentials_last_sent_at: new Date().toISOString(),
      reset_requested_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await admin.from("notifications").insert({
    title: "Internal user password reset",
    message: `Temporary password regenerated for ${account.email}.`,
    type: "Account",
    event_type: "Password Reset",
    channel: "In-app",
  });
  await auditInternalAccount("Password Reset", id, null, { temporary_password_generated: true });
  await setInternalAccountCredentialFlash({ type: "reset", temporaryPassword });
  revalidatePath("/dashboard/account-management");
  redirect(`/dashboard/account-management/internal-users?reset=${id}`);
}

export async function resendInternalCredentials(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing internal account.");
  const admin = createAdminClient();
  const { error } = await admin.from("internal_accounts").update({ credentials_last_sent_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  await auditInternalAccount("Resend Credentials", id, null, { credentials_last_sent_at: new Date().toISOString() });
  revalidatePath("/dashboard/account-management");
}

export async function setupInternalPassword(formData: FormData) {
  const payload = internalSetupPasswordSchema.safeParse(formObject(formData));
  if (!payload.success) {
    redirect(`/dashboard/setup-password?error=${encodeURIComponent(payload.error.issues[0]?.message ?? "Password validation failed.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/dashboard/setup-password");

  const account = await getInternalAccountByAuthUserId(user.id);
  if (!account?.id) redirect("/login?error=No internal EngineRus OS account is linked to this login.");

  const tempMatches = await verifyInternalPassword(payload.data.current_password, account.temporary_password_hash);
  if (!tempMatches) redirect("/dashboard/setup-password?error=Temporary password incorrect.");

  const { error: updateError } = await supabase.auth.updateUser({ password: payload.data.new_password });
  if (updateError) redirect(`/dashboard/setup-password?error=${encodeURIComponent(updateError.message)}`);

  const admin = createAdminClient();
  const { error } = await admin
    .from("internal_accounts")
    .update({
      temporary_password_hash: null,
      is_first_login: false,
      must_change_password: false,
      password_changed_at: new Date().toISOString(),
    })
    .eq("id", account.id);
  if (error) throw new Error(error.message);

  await auditInternalAccount("First Password Update", account.id, { is_first_login: true, must_change_password: true }, { is_first_login: false, must_change_password: false });
  revalidatePath("/dashboard", "layout");
  redirect(firstAllowedDashboardPath(account.role_name));
}

export async function createMotorcycle(formData: FormData) {
  const payload = motorcycleSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("motorcycles").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/motorcycle-registry");
  redirect("/dashboard/motorcycle-registry");
}

export async function createCustomerGarageMotorcycle(formData: FormData) {
  const payload = customerGarageMotorcycleSchema.parse(formObject(formData));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/customer/login?redirectTo=/customer/my-garage");

  const customerId = await ensureCustomerAccount({ email: user.email, full_name: user.user_metadata?.full_name });

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const admin = createAdminClient();
    const motorcycleCode = `DER-MOTO-${Date.now()}`;
    const { data: motorcycle, error } = await admin
      .from("motorcycles")
      .insert({
        ...payload,
        motorcycle_code: motorcycleCode,
        customer_id: customerId,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    await admin.from("motorcycle_ownership_records").insert({
      motorcycle_id: motorcycle.id,
      owner_id: customerId,
      ownership_type: "Owner",
      remarks: "Added by customer through Dr. Engine R'us Customer Portal",
    });
  }

  revalidatePath("/customer/my-garage");
  redirect("/customer/my-garage");
}

export async function createServiceBooking(formData: FormData) {
  const payload = serviceBookingSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("service_bookings").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/service-operations");
  redirect("/dashboard/service-operations");
}

export async function createPublicServiceRequest(formData: FormData) {
  const payload = publicServiceRequestSchema.parse(formObject(formData));
  const bookingNumber = `VMH-SVC-${Date.now()}`;
  const customerNumber = `CUS-${Date.now()}`;
  const motorcycleCode = `VMH-MOTO-${Date.now()}`;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();

    const { data: existingCustomer, error: customerLookupError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", payload.email)
      .maybeSingle();

    if (customerLookupError) throw new Error(customerLookupError.message);

    let customerId = existingCustomer?.id;
    if (!customerId) {
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({
          customer_number: customerNumber,
          customer_id: customerNumber,
          full_name: payload.full_name,
          contact_number: payload.contact_number,
          mobile_number: payload.contact_number,
          email: payload.email,
          address: payload.address ?? "Submitted via Visayas Moto Hub",
          customer_type: "Service Lead",
          notes: payload.notes,
        })
        .select("id")
        .single();

      if (customerError) throw new Error(customerError.message);
      customerId = customer.id;
    }

    const { data: motorcycle, error: motorcycleError } = await supabase
      .from("motorcycles")
      .insert({
        motorcycle_code: motorcycleCode,
        customer_id: customerId,
        plate_number: payload.plate_number,
        brand: payload.brand,
        model: payload.model,
        variant: payload.variant,
        year_model: payload.year_model,
        mileage: 0,
      })
      .select("id")
      .single();

    if (motorcycleError) throw new Error(motorcycleError.message);

    const { error: bookingError } = await supabase.from("service_bookings").insert({
      booking_number: bookingNumber,
      customer_id: customerId,
      motorcycle_id: motorcycle.id,
      service_type: payload.service_type,
      booking_type: "Online",
      scheduled_date: payload.scheduled_date,
      status: "Pending",
      source: "Visayas Moto Hub Service",
    });

    if (bookingError) throw new Error(bookingError.message);
  }

  revalidatePath("/service");
  revalidatePath("/dashboard/service-operations");
  redirect("/service?submitted=true");
}

export async function createCustomerPortalServiceRequest(formData: FormData) {
  const payload = customerPortalServiceRequestSchema.parse(formObject(formData));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/customer/login?redirectTo=/customer/service-requests");

  const customerId = await ensureCustomerAccount({ email: user.email, full_name: user.user_metadata?.full_name });
  const admin = createAdminClient();
  const { data: motorcycle, error: motorcycleError } = await admin
    .from("motorcycles")
    .select("id")
    .eq("id", payload.motorcycle_id)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (motorcycleError) throw new Error(motorcycleError.message);
  if (!motorcycle?.id) throw new Error("Motorcycle not found for this customer account.");

  const { error } = await admin.from("service_bookings").insert({
    booking_number: `DER-SVC-${Date.now()}`,
    customer_id: customerId,
    motorcycle_id: payload.motorcycle_id,
    service_type: payload.service_type,
    booking_type: "Online",
    scheduled_date: payload.scheduled_date,
    status: "Pending",
    source: "Dr. Engine R'us Customer Portal",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/customer/dashboard");
  revalidatePath("/customer/service-requests");
  redirect("/customer/service-requests?submitted=true");
}

export async function createJobOrder(formData: FormData) {
  const payload = jobOrderSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("job_orders").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/job-orders");
  revalidatePath("/dashboard/service-queue");
  redirect("/dashboard/job-orders");
}

export async function createDynoSession(formData: FormData) {
  const payload = formObject(formData);
  const supabase = createAdminClient();
  const { error } = await supabase.from("dyno_sessions").insert({
    session_number: String(payload.session_number),
    dyno_type: String(payload.dyno_type),
    session_date: String(payload.session_date),
    notes: payload.notes ? String(payload.notes) : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/dyno-management");
  redirect("/dashboard/dyno-management");
}

export async function createNotification(formData: FormData) {
  const payload = formObject(formData);
  const supabase = createAdminClient();
  const { error } = await supabase.from("notifications").insert({
    title: String(payload.title),
    message: String(payload.message),
    type: String(payload.type),
    event_type: String(payload.type),
    body: String(payload.message),
    channel: String(payload.channel ?? "In-app"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/notifications");
  redirect("/dashboard/notifications");
}
