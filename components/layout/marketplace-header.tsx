import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, Heart, Search, UserRound } from "lucide-react";
import { marketplaceNav } from "@/constants/navigation";
import { Button } from "@/components/ui/button";

export function MarketplaceHeader() {
  return (
    <header className="sticky top-0 z-40 max-w-[100vw] overflow-x-hidden border-b border-[#dfcfb7] bg-[#fff8ea]/94 text-black backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6">
        <Link href="/" className="relative block h-14 w-44 shrink-0 overflow-hidden sm:w-52" aria-label="Visayas Moto Hub home">
          <Image src="/visayas-moto-hub-logo.svg" alt="Visayas Moto Hub" fill className="object-contain object-left" priority />
        </Link>
        <nav className="order-3 col-span-2 flex max-w-full min-w-0 gap-2 overflow-x-auto border-t border-black/10 pt-3 text-[11px] font-black uppercase tracking-[0.14em] lg:order-none lg:col-span-1 lg:justify-center lg:overflow-visible lg:border-t-0 lg:pt-0 lg:text-[10px] lg:tracking-[0.12em] xl:text-[11px]">
          {marketplaceNav.map((item) => (
            <Link key={item.href} href={item.href} className="relative shrink-0 rounded-full px-3 py-2 text-black/62 transition hover:bg-black hover:text-white lg:shrink lg:px-2 xl:px-3">
              {item.href === "/" ? "Home" : item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/shop" aria-label="Search marketplace" className="rounded-full p-2 text-black transition hover:bg-black/8">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/favorites" aria-label="Favorites" className="rounded-full p-2 text-black transition hover:bg-black/8">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/customer/login" aria-label="Customer login" className="hidden sm:block">
            <Button variant="outline" className="h-10 rounded-full border-black/15 bg-white/50 px-3 text-black shadow-none hover:bg-black hover:text-white sm:px-5">
              <UserRound className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </Link>
          <Link href="/login" className="hidden sm:block">
            <Button className="h-10 rounded-full bg-[#ff5a1f] px-3 text-xs uppercase tracking-[0.08em] text-white shadow-none hover:bg-black sm:px-5">
              <BriefcaseBusiness className="h-4 w-4" />
              <span className="hidden sm:inline">Business</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
