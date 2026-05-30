export const dynamic = "force-dynamic";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerSignUp } from "@/services/actions";

export default async function CustomerRegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f7efe0] px-4 py-8 text-black">
      <section className="mx-auto max-w-4xl border border-[#dfceb3] bg-[#fff8ea] p-6 sm:p-10">
        <Link href="/customer/login" className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Customer Login</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <span className="grid h-14 w-14 place-items-center bg-black text-[#ff5a1f]">
              <UserPlus className="h-7 w-7" />
            </span>
            <h1 className="mt-8 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl">Create customer portal access.</h1>
            <p className="mt-5 text-[#5f5649]">
              For Dr. Engine R&apos;us motorcycle owners who need garage, PMS, service, dyno, ECU, and maintenance tracking.
            </p>
          </div>
          <form action={customerSignUp} className="grid gap-4 border border-[#dfceb3] bg-white p-5">
            {error ? <div className="border border-[#ff5a1f] bg-[#fff2eb] px-3 py-2 text-sm font-semibold text-[#9b2d11]">{error}</div> : null}
            <Input className="h-12 rounded-none" name="full_name" placeholder="Full name" required />
            <Input className="h-12 rounded-none" name="email" type="email" placeholder="Email" required />
            <Input className="h-12 rounded-none" name="contact_number" placeholder="Mobile number" required />
            <Input className="h-12 rounded-none" name="address" placeholder="Address" required />
            <Input className="h-12 rounded-none" name="password" type="password" placeholder="Password" required />
            <Button className="h-12 rounded-none bg-[#ff5a1f] uppercase tracking-[0.14em] shadow-none hover:bg-black">Create Account</Button>
            <p className="text-xs leading-5 text-[#5f5649]">
              This does not create an EngineRus OS staff account. Staff users continue to use the internal login.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
