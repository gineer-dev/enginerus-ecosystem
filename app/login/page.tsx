export const dynamic = "force-dynamic";

import Link from "next/link";
import { Cpu, Gauge, Handshake, LockKeyhole, Mail, Wrench } from "lucide-react";
import { signIn } from "@/services/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function authMessage(error?: string) {
  if (!error) return null;
  if (error === "Invalid login credentials") {
    return "That email and password do not match an existing account. Create an account first if you have not signed up yet.";
  }
  if (error.includes("For security purposes")) {
    return "Supabase is cooling down auth requests. Wait about one minute, then try again once.";
  }
  return error;
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirectTo?: string; error?: string }> }) {
  const { redirectTo = "/dashboard", error } = await searchParams;
  const message = authMessage(error);

  return (
    <main className="min-h-screen bg-white p-3 sm:p-5">
      <section className="engine-frame mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden lg:grid-cols-[1.18fr_0.82fr]">
        <div className="relative z-10 flex flex-col p-6 sm:p-9 lg:p-12">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="brand-plus text-5xl font-black leading-none">+</span>
              <div>
                <div className="brand-wordmark text-3xl italic leading-none sm:text-4xl">EngineRus</div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Dr. Engine R&apos;us / Powered by Dynolab</p>
              </div>
            </div>
            <div className="text-sm font-semibold text-foreground">
              <p>Powered by <span className="font-black">Dynolab</span></p>
              <p className="text-muted-foreground">Trusted Automotive Care.</p>
            </div>
          </header>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h1 className="max-w-2xl text-5xl font-black uppercase leading-[0.98] tracking-normal text-black sm:text-6xl">
                Unleash the power of your engine
              </h1>
              <p className="mt-10 text-2xl font-bold leading-tight text-black sm:text-3xl">
                Dyno-Tuned Performance. <br /> Trusted Automotive Care.
              </p>
            </div>
            <div className="dyno-lab-panel min-h-[310px] border border-white/80 shadow-[0_22px_45px_rgba(0,0,0,0.18)]">
              <div className="dyno-machine" aria-hidden="true">
                <span className="dyno-bay-frame" />
                <span className="dyno-monitor" />
                <span className="dyno-engine" />
                <span className="dyno-floor" />
              </div>
              <div className="absolute right-6 top-6 rounded-lg bg-white/82 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow">
                EngineRus OS
              </div>
              <div className="power-quote absolute bottom-8 left-6 right-6 z-10 flex h-16 items-center justify-center gap-3 rounded-lg px-5 text-lg font-black uppercase tracking-normal">
                <Gauge className="h-8 w-8" /> Staff Operations Login
              </div>
            </div>
          </div>

          <div className="mt-auto grid gap-5 border-t border-border pt-8 md:grid-cols-3">
            {[
              { icon: Gauge, title: "Advanced Dyno Testing", text: "Session capture, graphs, reports, and motorcycle dyno history." },
              { icon: Cpu, title: "ECU Re-Calibration", text: "ECU map records, backup files, and tuning notes." },
              { icon: Handshake, title: "Service Consultation", text: "Bookings, CRM, reminders, and job order approvals." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border-4 border-black bg-white text-[#ef6b21]">
                    <Icon className="h-8 w-8" />
                  </span>
                  <h2 className="mt-3 text-base font-black">{item.title}</h2>
                  <p className="mx-auto mt-1 max-w-56 text-xs leading-5 text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="flex items-center justify-center bg-[#fbf8f2] px-4 py-8 lg:bg-white/70 lg:px-8">
          <Card className="w-full max-w-md rounded-xl border-[#d17e1d]/40 bg-white/95 shadow-[0_24px_60px_rgba(0,0,0,0.14)]">
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-accent">
                  <Wrench className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Internal Platform</p>
                  <p className="font-black">EngineRus OS</p>
                </div>
              </div>
              <CardTitle className="text-2xl font-black text-black">Login to the command center</CardTitle>
              <p className="text-sm text-muted-foreground">Use your Supabase Auth staff account to access service, dyno, inventory, CRM, and audit operations.</p>
            </CardHeader>
            <CardContent>
              {message ? (
                <div className="mb-4 rounded-lg border border-[#d17e1d]/40 bg-[#fff8e1] px-3 py-2 text-sm font-semibold text-primary">
                  {message}
                </div>
              ) : null}
              <form action={signIn} className="grid gap-4">
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <label className="grid gap-2 text-sm font-semibold">
                  Email
                  <span className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <Input className="pl-10" name="email" type="email" placeholder="advisor@drenginerus.ph" required />
                  </span>
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Password
                  <span className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <Input className="pl-10" name="password" type="password" placeholder="Password" required />
                  </span>
                </label>
                <Button type="submit" className="h-12 text-base uppercase tracking-normal">Get access</Button>
              </form>
              <Link
                href="/register"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#d17e1d]/40 bg-white px-5 text-sm font-black uppercase tracking-normal text-primary transition hover:bg-[#fff8e1]"
              >
                Create account
              </Link>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Protected staff portal</span>
                <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">Forgot password?</Link>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
