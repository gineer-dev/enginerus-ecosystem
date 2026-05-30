export const dynamic = "force-dynamic";

import Link from "next/link";
import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/constants/sample-data";
import { MoveRight } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#161616] text-black">
      <MarketplaceHeader />
      <main className="mx-auto max-w-7xl bg-[#f4eadc] px-4 py-10 shadow-[0_40px_100px_rgba(0,0,0,0.36)] sm:px-6">
        <div className="border border-black/15 bg-[#f7ecdc] p-6 text-black sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ef5b22]">Visayas Moto Hub</p>
          <h1 className="mt-2 text-5xl font-black uppercase leading-none tracking-normal">Brand-new showroom</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Browse brand-new motorcycle units by brand and riding category. No second-hand listings.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`}>
              <Card className="rounded-none border-black/15 bg-white text-black shadow-none transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#161616]">
                <CardContent className="p-6">
                  <h2 className="text-lg font-black">{category}</h2>
                  <p className="mt-2 min-h-12 text-sm text-muted-foreground">Browse brand-new showroom units, availability, and release assistance.</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#ef5b22]">
                    Explore <MoveRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
