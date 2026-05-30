import Link from "next/link";
import { Bell, ChevronsUpDown, Gauge, LogOut, Menu, Search, UserRound } from "lucide-react";
import { engineRusNav } from "@/lib/constants/enginerus";
import { Button } from "@/components/ui/button";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background p-3 lg:p-5">
      <aside className="fixed inset-y-5 left-5 z-40 hidden w-72 overflow-hidden rounded-[20px] border-2 border-[#d17e1d]/70 bg-white/95 shadow-[0_18px_34px_rgba(52,18,18,0.16)] backdrop-blur-xl lg:block">
        <div className="flex h-20 items-center border-b border-[#d17e1d]/25 px-5">
          <Link href="/dashboard" className="flex items-center gap-3 text-sm font-black tracking-tight text-foreground">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-[#ef6b21] shadow-[0_12px_22px_rgba(120,35,36,0.16)] ring-2 ring-[#ffcc00]">
              <Gauge className="h-7 w-7" />
            </span>
            <span>
              <span className="brand-wordmark block text-lg italic">EngineRus OS</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Powered by Dynolab</span>
            </span>
          </Link>
        </div>
        <nav className="h-[calc(100vh-8.5rem)] overflow-y-auto px-4 py-5">
          {engineRusNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="mb-1 flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-semibold text-muted-foreground transition hover:bg-[#fff2c2] hover:text-foreground"
              >
                <Icon className="h-4 w-4 text-[#ef6b21]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-xl border border-[#d17e1d]/35 bg-[#fff8e1] p-4 text-black">
          <div className="tach-arc mb-3 h-8 w-16" />
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Visayas Moto Hub</p>
          <p className="mt-2 text-sm font-bold">Marketplace sync prepared for API integration.</p>
        </div>
      </aside>
      <div className="lg:pl-80">
        <header className="sticky top-3 z-30 mb-5 flex h-20 items-center justify-between rounded-[20px] border-2 border-[#d17e1d]/55 bg-white/95 px-4 shadow-[0_14px_28px_rgba(52,18,18,0.10)] backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="px-2 lg:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-black">Unleash shop-floor performance</p>
              <p className="text-xs text-muted-foreground">Dyno, service, registry, inventory, CRM, and audit command center</p>
            </div>
          </div>
          <div className="hidden h-11 min-w-72 items-center gap-2 rounded-lg border border-[#d17e1d]/25 bg-[#fff8e1] px-4 text-sm text-muted-foreground md:flex">
            <Search className="h-4 w-4 text-[#ef6b21]" />
            Search job orders, motorcycles, customers, inventory
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden h-12 gap-2 px-3 md:inline-flex" aria-label="Select branch">
              Cebu Main <ChevronsUpDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-12 w-12 px-0" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="hidden h-12 gap-2 px-3 md:inline-flex" aria-label="User profile">
              <UserRound className="h-4 w-4" /> Admin
            </Button>
            <form action="/auth/signout" method="post">
              <Button variant="secondary" className="h-12 w-12 px-0" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </header>
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">EngineRus OS / Powered by Dynolab / Operations</div>
        <main id="main-content" className="engine-frame p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
