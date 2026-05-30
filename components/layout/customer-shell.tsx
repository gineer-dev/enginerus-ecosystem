import Link from "next/link";
import { Bell, Bike, CalendarClock, FileText, Gauge, HeartPulse, History, LogOut, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const customerNav = [
  { href: "/customer/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/customer/my-garage", label: "My Garage", icon: Bike },
  { href: "/customer/service-requests", label: "Service Requests", icon: Wrench },
];

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7efe0] text-black">
      <header className="sticky top-0 z-40 border-b border-[#dfceb3] bg-[#fff8ea]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/customer/dashboard" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center bg-black text-xl font-black text-[#ff5a1f]">E</span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.22em]">Dr. Engine R&apos;us</span>
              <span className="block text-xs font-black uppercase tracking-[0.22em] text-[#ff5a1f]">Customer Portal</span>
            </span>
          </Link>
          <nav className="order-3 flex w-full gap-2 overflow-x-auto pt-2 md:order-none md:w-auto md:items-center md:overflow-visible md:pt-0">
            {customerNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-10 items-center gap-2 rounded-none px-4 text-xs font-black uppercase tracking-[0.18em] text-[#5f5649] transition hover:bg-black hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action="/customer/signout" method="post">
            <Button className="h-11 rounded-none bg-black px-4 text-white shadow-none hover:bg-[#ff5a1f]" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </form>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 border border-[#dfceb3] bg-[#fff8ea] p-4 md:grid-cols-4">
          {[
            { icon: HeartPulse, label: "Health Records" },
            { icon: CalendarClock, label: "PMS Reminders" },
            { icon: History, label: "Dyno / ECU History" },
            { icon: Bell, label: "Customer Notifications" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 border border-[#dfceb3] bg-white px-4 py-3">
                <Icon className="h-5 w-5 text-[#ff5a1f]" />
                <span className="text-xs font-black uppercase tracking-[0.16em]">{item.label}</span>
              </div>
            );
          })}
        </section>
        {children}
      </main>

      <div className="fixed bottom-4 right-4 hidden rounded-full border border-[#dfceb3] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow lg:block">
        <FileText className="mr-2 inline h-4 w-4 text-[#ff5a1f]" />
        Motorcycle health file
      </div>
    </div>
  );
}
