import { FilterBar } from "@/components/marketplace/filter-bar";
import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { MotorcycleCard } from "@/components/marketplace/motorcycle-card";
import { getMotorcyclesForSale } from "@/services/catalog";

type ShopFilters = {
  q?: string;
  brand?: string;
  status?: string;
  location?: string;
};

export async function ShopView({ filters }: { filters: ShopFilters }) {
  const motorcycles = await getMotorcyclesForSale(filters);

  return (
    <div className="min-h-screen bg-[#f4eadc] text-black">
      <MarketplaceHeader />
      <main id="main-content" className="mx-auto max-w-7xl bg-[#f4eadc] px-4 py-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] sm:px-6">
        <section className="border border-black/15 bg-[#f7ecdc] p-6 text-black sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ef5b22]">Visayas Moto Hub Shop</p>
              <h1 className="mt-2 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl lg:text-6xl">Brand-new motorcycles</h1>
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
          {motorcycles.length === 0 ? (
            <div className="border border-black/15 bg-white p-8 text-sm font-semibold text-muted-foreground sm:col-span-2 xl:col-span-3">
              No live motorcycle listings match this view yet. Add product records in EngineRus OS to publish inventory here.
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
