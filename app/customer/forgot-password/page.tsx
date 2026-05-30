export const dynamic = "force-dynamic";

import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerResetPassword } from "@/services/actions";

export default async function CustomerForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7efe0] px-4 py-8 text-black">
      <section className="w-full max-w-md border border-[#dfceb3] bg-white p-6 shadow-[16px_16px_0_#111]">
        <span className="grid h-12 w-12 place-items-center bg-[#ff5a1f] text-white">
          <KeyRound className="h-6 w-6" />
        </span>
        <h1 className="mt-6 text-3xl font-black uppercase tracking-normal">Reset customer password</h1>
        <p className="mt-3 text-sm leading-6 text-[#5f5649]">Enter the customer account email connected to your motorcycle records.</p>
        {error ? <div className="mt-4 border border-[#ff5a1f] bg-[#fff2eb] px-3 py-2 text-sm font-semibold text-[#9b2d11]">{error}</div> : null}
        <form action={customerResetPassword} className="mt-6 grid gap-4">
          <Input className="h-12 rounded-none" name="email" type="email" placeholder="customer@email.com" required />
          <Button className="h-12 rounded-none bg-[#ff5a1f] uppercase tracking-[0.14em] shadow-none hover:bg-black">Send Reset Email</Button>
        </form>
        <Link href="/customer/login" className="mt-5 block text-sm font-semibold text-[#5f5649] hover:text-black">Back to customer login</Link>
      </section>
    </main>
  );
}
