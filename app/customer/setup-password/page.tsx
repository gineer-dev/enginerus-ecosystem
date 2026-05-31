export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currentCustomerAccount } from "@/services/customer-accounts";
import { setupCustomerPassword } from "@/services/actions";

export default async function CustomerSetupPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const { account } = await currentCustomerAccount({ allowPasswordSetup: true });

  if (!account.is_first_login && !account.must_change_password) redirect("/customer/dashboard");

  return (
    <main className="min-h-screen bg-[#f7efe0] px-4 py-8 text-black">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden border border-[#dfceb3] bg-[#fff8ea] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border-b border-[#dfceb3] p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center bg-black text-[#ff5a1f]">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em]">Dr. Engine R&apos;us</p>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff5a1f]">Customer Portal Security</p>
            </div>
          </div>
          <h1 className="mt-12 text-4xl font-black uppercase leading-[0.9] sm:text-5xl">Set your permanent password.</h1>
          <p className="mt-6 text-sm leading-7 text-[#5f5649]">
            This step is required before accessing your motorcycle health records, PMS schedule, dyno history, ECU records, and service status.
          </p>
          <div className="mt-8 rounded-xl border border-[#dfceb3] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff5a1f]">Password rules</p>
            <ul className="mt-3 grid gap-2 text-sm text-[#5f5649]">
              <li>Minimum 8 characters</li>
              <li>Uppercase and lowercase letters</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>
        </div>

        <aside className="flex items-center justify-center p-6 lg:p-10">
          <form action={setupCustomerPassword} className="w-full max-w-md border border-[#dfceb3] bg-white p-6 shadow-[14px_14px_0_#111]">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center bg-[#ff5a1f] text-white">
                <KeyRound className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff5a1f]">Mandatory Setup</p>
                <h2 className="text-2xl font-black">Create New Password</h2>
              </div>
            </div>

            {error ? <div className="mb-4 border border-[#ff5a1f] bg-[#fff2eb] px-3 py-2 text-sm font-semibold text-[#9b2d11]">{error}</div> : null}

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em]">
                Current Temporary Password
                <span className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff5a1f]" />
                  <Input className="h-12 rounded-none pl-10" name="current_password" type="password" required />
                </span>
              </label>
              <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em]">
                New Password
                <span className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff5a1f]" />
                  <Input className="h-12 rounded-none pl-10" name="new_password" type="password" required />
                </span>
              </label>
              <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em]">
                Confirm Password
                <span className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff5a1f]" />
                  <Input className="h-12 rounded-none pl-10" name="confirm_password" type="password" required />
                </span>
              </label>
              <Button type="submit" className="h-12 rounded-none bg-[#ff5a1f] text-base uppercase tracking-[0.12em] shadow-none hover:bg-black">
                Save Password
              </Button>
            </div>
          </form>
        </aside>
      </section>
    </main>
  );
}
