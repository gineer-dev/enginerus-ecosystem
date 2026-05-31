import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseBrowserEnv } from "@/lib/supabase/env";
import { canAccessDashboardPath } from "@/lib/permissions/rbac";
import type { UserRole } from "@/types/domain";

const protectedPrefixes = ["/dashboard", "/customer/dashboard", "/customer/my-garage", "/customer/motorcycles", "/customer/service-requests", "/customer/setup-password"];

async function fetchInternalAccount(authUserId: string) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { url } = getSupabaseBrowserEnv();
  if (!serviceRoleKey) return null;

  const params = new URLSearchParams({
    auth_user_id: `eq.${authUserId}`,
    select: "id,account_status,is_first_login,must_change_password,role_name",
  });
  const response = await fetch(`${url}/rest/v1/internal_accounts?${params}`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ id: string; account_status: string; is_first_login: boolean; must_change_password: boolean; role_name: string }>;
  return rows[0] ?? null;
}

async function auditUnauthorizedAccess(accountId: string, pathname: string, roleName: string) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { url } = getSupabaseBrowserEnv();
  if (!serviceRoleKey) return;

  await fetch(`${url}/rest/v1/audit_logs`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      action: "Unauthorized Access Attempt",
      module: "Role-Based Access Control",
      entity_type: "internal_accounts",
      record_id: accountId,
      new_value: { pathname, role_name: roleName },
    }),
  });
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key } = getSupabaseBrowserEnv();

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));

  if (!data?.claims && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = request.nextUrl.pathname.startsWith("/customer") ? "/customer/login" : "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (data?.claims?.sub && request.nextUrl.pathname.startsWith("/dashboard")) {
    const account = await fetchInternalAccount(String(data.claims.sub));
    if (account?.account_status === "Disabled") {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("error", "Your EngineRus OS account is disabled. Contact an administrator.");
      return NextResponse.redirect(loginUrl);
    }

    if (account?.id) {
      const isSetupPath = request.nextUrl.pathname.startsWith("/dashboard/setup-password");
      if (!isSetupPath && (account.is_first_login || account.must_change_password)) {
        const setupUrl = request.nextUrl.clone();
        setupUrl.pathname = "/dashboard/setup-password";
        setupUrl.search = "";
        return NextResponse.redirect(setupUrl);
      }
      if (!canAccessDashboardPath([account.role_name as UserRole], request.nextUrl.pathname)) {
        await auditUnauthorizedAccess(account.id, request.nextUrl.pathname, account.role_name);
        const deniedUrl = request.nextUrl.clone();
        deniedUrl.pathname = "/dashboard/access-denied";
        deniedUrl.search = "";
        return NextResponse.redirect(deniedUrl);
      }
    }
  }

  return response;
}
