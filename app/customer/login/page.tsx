export const dynamic = "force-dynamic";

import Link from "next/link";
import { Bike, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerSignIn } from "@/services/actions";

function authMessage(message?: string) {
  if (!message) return null;
  if (message === "Invalid login credentials") return "That email and password do not match a customer account yet.";
  if (message.includes("For security purposes")) return "Supabase is cooling down auth requests. Wait about one minute, then try again.";
  return message;
}

export default async function CustomerLoginPage({ searchParams }: { searchParams: Promise<{ redirectTo?: string; error?: string; message?: string }> }) {
  const { redirectTo = "/customer/dashboard", error, message } = await searchParams;
  const errorMessage = authMessage(error);

  return (
    <main className="min-h-screen bg-[#f7efe0] px-4 py-8 text-black">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden border border-[#dfceb3] bg-[#fff8ea] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex flex-col justify-between border-b border-[#dfceb3] p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center bg-black text-2xl font-black text-[#ff5a1f]">E</span>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em]">Dr. Engine R&apos;us</p>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff5a1f]">Customer Portal</p>
              </div>
            </div>
            <h1 className="mt-12 max-w-2xl text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl lg:text-6xl">
              Your motorcycle health record.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#5f5649]">
              Track owned motorcycles, PMS schedules, service status, dyno runs, ECU maps, and maintenance history with Dr. Engine R&apos;us.
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {["Garage", "PMS", "Service Status"].map((item) => (
              <div key={item} className="border border-[#dfceb3] bg-white p-4 text-sm font-black uppercase tracking-[0.16em]">
                {item}
              </div>
            ))}
          </div>
        </div>
        <aside className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md border border-[#dfceb3] bg-white p-6 shadow-[10px_10px_0_#111] sm:shadow-[16px_16px_0_#111]">
            <div className="mb-8 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center bg-[#ff5a1f] text-white">
                <Bike className="h-7 w-7" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Motorcycle Owner</p>
                <h2 className="text-2xl font-black">Customer Login</h2>
              </div>
            </div>
            {message ? <div className="mb-4 border border-[#dfceb3] bg-[#fff8ea] px-3 py-2 text-sm font-semibold">{message}</div> : null}
            {errorMessage ? <div className="mb-4 border border-[#ff5a1f] bg-[#fff2eb] px-3 py-2 text-sm font-semibold text-[#9b2d11]">{errorMessage}</div> : null}
            <form action={customerSignIn} className="grid gap-4">
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em]">
                Email
                <span className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff5a1f]" />
                  <Input className="h-12 rounded-none pl-10" name="email" type="email" placeholder="customer@email.com" required />
                </span>
              </label>
              <label className="grid gap-2 text-sm font-black uppercase tracking-[0.12em]">
                Password
                <span className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff5a1f]" />
                  <Input className="h-12 rounded-none pl-10" name="password" type="password" placeholder="Password" required />
                </span>
              </label>
              <Button type="submit" className="h-12 rounded-none bg-[#ff5a1f] text-base uppercase tracking-[0.12em] shadow-none hover:bg-black">
                Open My Garage
              </Button>
            </form>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
              <Link href="/customer/register" className="text-[#ff5a1f] hover:text-black">Create customer account</Link>
              <Link href="/customer/forgot-password" className="text-[#5f5649] hover:text-black">Forgot password?</Link>
            </div>
            <Link href="/login" className="mt-8 block border-t border-[#dfceb3] pt-4 text-xs font-black uppercase tracking-[0.16em] text-[#5f5649] hover:text-black">
              Staff login remains separate
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
