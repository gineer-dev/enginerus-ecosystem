import { FilterBar } from "@/components/marketplace/filter-bar";
import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { MotorcycleCard } from "@/components/marketplace/motorcycle-card";
import { getMotorcyclesForSale } from "@/services/catalog";

type ShopFilters = {
  q?: string;
};

export async function ShopView({ filters }: { filters: ShopFilters }) {
  const motorcycles = await getMotorcyclesForSale(filters);

  return (
    <div className="min-h-screen bg-[#161616] text-black">
      <MarketplaceHeader />
      <main className="mx-auto max-w-7xl bg-[#f4eadc] px-4 py-8 shadow-[0_40px_100px_rgba(0,0,0,0.36)] sm:px-6">
        <section className="border border-black/15 bg-[#f7ecdc] p-6 text-black sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ef5b22]">Visayas Moto Hub Shop</p>
              <h1 className="mt-2 text-6xl font-black uppercase leading-[0.86] tracking-normal">Brand-new motorcycles</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Search brand-new CFMOTO, ZEEHO, Lambretta, Italjet, and Ducati units available for showroom inquiry.
              </p>
            </div>
            <div className="bg-black px-6 py-5 text-white">
              <p className="text-xs font-black uppercase text-white/60">Live cards</p>
              <p className="text-3xl font-black">{motorcycles.length}</p>
            </div>
          </div>
          <div className="mt-6">
            <FilterBar action="/shop" hideCategory />
          </div>
        </section>

        <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {motorcycles.map((motorcycle) => <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />)}
        </section>
      </main>
    </div>
  );
}
