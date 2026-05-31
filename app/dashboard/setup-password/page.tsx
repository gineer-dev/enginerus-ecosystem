import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setupInternalPassword } from "@/services/actions";
import { currentInternalAccount } from "@/services/internal-accounts";

export const dynamic = "force-dynamic";

export default async function InternalSetupPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const { account } = await currentInternalAccount({ allowPasswordSetup: true });
  if (!account.is_first_login && !account.must_change_password) redirect("/dashboard");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center px-4 py-10">
      <form action={setupInternalPassword} className="w-full rounded-2xl border border-white/75 bg-white/95 p-7 shadow-[0_18px_34px_rgba(52,18,18,0.12)]">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#fff8e1] text-[#ef6b21]">
          <KeyRound className="h-6 w-6" />
        </span>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-primary">Mandatory password setup</p>
        <h1 className="mt-2 text-3xl font-black">Create your EngineRus OS password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Temporary passwords cannot access the dashboard. Set a new password to continue to your role-based workspace.</p>

        {error ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div> : null}

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">
            Current Temporary Password
            <Input name="current_password" type="password" required autoComplete="current-password" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            New Password
            <Input name="new_password" type="password" required autoComplete="new-password" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Confirm Password
            <Input name="confirm_password" type="password" required autoComplete="new-password" />
          </label>
        </div>

        <div className="mt-5 rounded-xl border bg-[#fff8e1] p-4 text-xs font-semibold text-muted-foreground">
          Use at least 8 characters with uppercase, lowercase, number, and special character. Example: EngineRus@2026
        </div>
        <Button type="submit" className="mt-6 w-full"><KeyRound className="h-4 w-4" /> Update Password</Button>
      </form>
    </div>
  );
}
