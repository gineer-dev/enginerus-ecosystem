import Link from "next/link";
import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { marketplaceNav } from "@/constants/navigation";
import { Button } from "@/components/ui/button";

export function MarketplaceHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f4eadc]/92 text-black backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-sm font-black tracking-tight text-black">
          <span className="grid h-9 w-9 place-items-center bg-black text-lg font-black text-[#ff5a1f]">V</span>
          <span className="leading-none">
            <span className="block text-base uppercase tracking-[0.18em]">Visayas</span>
            <span className="block text-xs uppercase tracking-[0.28em] text-[#ef5b22]">Moto Hub</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-[11px] font-black uppercase tracking-[0.14em] md:flex">
          {marketplaceNav.map((item) => (
            <Link key={item.href} href={item.href} className="relative text-black/62 hover:text-[#ef5b22]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/shop" aria-label="Search marketplace" className="rounded-full p-2 text-black hover:bg-black/8">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/favorites" aria-label="Favorites" className="rounded-full p-2 text-black hover:bg-black/8">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/login">
            <Button variant="outline" className="hidden rounded-full border-black/20 bg-transparent text-black shadow-none hover:bg-black hover:text-white sm:inline-flex">
              <UserRound className="h-4 w-4" />
              Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="hidden h-10 rounded-full bg-[#ff5a1f] px-5 text-xs uppercase tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(239,91,34,0.25)] hover:bg-black sm:inline-flex">
              <ShoppingBag className="h-4 w-4" />
              Business
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
