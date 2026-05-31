"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Heart, Menu, Search, UserRound, X } from "lucide-react";
import { marketplaceNav } from "@/constants/navigation";
import { Button } from "@/components/ui/button";

export function MarketplaceHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-screen max-w-full overflow-hidden border-b border-[#dfcfb7] bg-[#fff8ea]/96 text-black backdrop-blur-xl">
      <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[auto_auto] items-center justify-between gap-3 px-4 sm:px-6 lg:h-[72px] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6">
        <Link href="/" className="relative block h-12 w-28 shrink-0 sm:w-36 lg:w-40" aria-label="Visayas Moto Hub home">
          <Image src="/visayas-moto-hub-logo.svg" alt="Visayas Moto Hub" fill className="object-contain object-left" priority />
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-1 lg:flex">
          {marketplaceNav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition xl:px-4 ${
                  isActive ? "bg-black text-white" : "text-black/60 hover:bg-black/8 hover:text-black"
                }`}
              >
                {item.href === "/" ? "Home" : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <Link href="/shop" aria-label="Search marketplace" className="grid h-10 w-10 place-items-center rounded-full text-black transition hover:bg-black/8">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/favorites" aria-label="Favorites" className="hidden h-10 w-10 place-items-center rounded-full text-black transition hover:bg-black/8 sm:grid">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/customer/login" className="hidden xl:block">
            <Button variant="outline" className="h-10 rounded-full border-black/15 bg-white/60 px-5 text-black shadow-none hover:bg-black hover:text-white">
              <UserRound className="h-4 w-4" />
              Customer Login
            </Button>
          </Link>
          <Link href="/login" className="hidden xl:block">
            <Button variant="outline" className="h-10 rounded-full border-[#ff5a1f]/40 bg-transparent px-5 text-xs uppercase tracking-[0.1em] text-[#cf4315] shadow-none hover:bg-[#ff5a1f] hover:text-white">
              <BriefcaseBusiness className="h-4 w-4" />
              Staff OS
            </Button>
          </Link>
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <details className="group relative lg:hidden">
      <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-black/12 bg-white/60 text-black transition hover:bg-black hover:text-white [&::-webkit-details-marker]:hidden">
        <Menu className="h-5 w-5 group-open:hidden" />
        <X className="hidden h-5 w-5 group-open:block" />
        <span className="sr-only">Open navigation menu</span>
      </summary>
      <div className="absolute right-0 top-12 w-[min(88vw,340px)] border border-[#dfcfb7] bg-[#fff8ea] p-3 shadow-[0_22px_60px_rgba(40,25,8,0.18)]">
        <nav className="grid gap-1">
          {marketplaceNav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-md px-4 py-3 text-sm font-black uppercase tracking-[0.12em] ${
                  isActive ? "bg-black text-white" : "text-black/68 hover:bg-black/8 hover:text-black"
                }`}
              >
                {item.href === "/" ? "Home" : item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-3 grid gap-2 border-t border-black/10 pt-3">
          <Link href="/customer/login">
            <Button variant="outline" className="h-11 w-full rounded-full border-black/15 bg-white/60 text-black shadow-none hover:bg-black hover:text-white">
              <UserRound className="h-4 w-4" />
              Customer Login
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="h-11 w-full rounded-full border-[#ff5a1f]/40 bg-transparent text-xs uppercase tracking-[0.1em] text-[#cf4315] shadow-none hover:bg-[#ff5a1f] hover:text-white">
              <BriefcaseBusiness className="h-4 w-4" />
              Staff OS
            </Button>
          </Link>
        </div>
      </div>
    </details>
  );
}
