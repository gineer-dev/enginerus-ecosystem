import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ensureProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { drEngineRusMetadata } from "@/lib/metadata";
import { ensureInternalAccountForUser, currentInternalAccount } from "@/services/internal-accounts";

export const dynamic = "force-dynamic";
export const metadata = drEngineRusMetadata;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  const profile = await ensureProfile(user);
  const account = await ensureInternalAccountForUser(user, profile);
  await currentInternalAccount({ allowPasswordSetup: true });

  return <DashboardShell role={account.role_name} fullName={account.full_name}>{children}</DashboardShell>;
}
