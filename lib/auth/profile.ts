import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export async function ensureProfile(user: User) {
  const admin = createAdminClient();
  const email = user.email ?? "";
  const fullName = String(user.user_metadata?.full_name ?? email.split("@")[0] ?? "EngineRus User");

  const [{ count }, { data: existing, error: existingError }] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id, role, branch_id").eq("user_id", user.id).maybeSingle(),
  ]);

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    return existing;
  }

  const role = count === 0 ? "Administrator" : "Service Advisor";
  const { data, error } = await admin
    .from("profiles")
    .insert({
      id: user.id,
      user_id: user.id,
      email,
      full_name: fullName,
      role,
      status: "Active",
    })
    .select("id, role, branch_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
