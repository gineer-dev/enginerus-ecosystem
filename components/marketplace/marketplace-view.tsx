import Image from "next/image";
import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { MotorcycleCard } from "@/components/marketplace/motorcycle-card";
import { getMotorcyclesForSale } from "@/services/catalog";
import { Button } from "@/components/ui/button";
import { Gauge, MapPin, MoveRight, ShieldCheck, Wrench } from "lucide-react";

const currency = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export async function MarketplaceView() {
  const motorcycles = await getMotorcyclesForSale();
  const featured = motorcycles[0];
  const secondary = motorcycles[1] ?? featured;

  return (
    <div className="min-h-screen bg-[#161616] text-black">
      <MarketplaceHeader />
      <main className="mx-auto max-w-7xl bg-[#f4eadc] px-4 py-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_40px_100px_rgba(0,0,0,0.36)] sm:px-6 lg:px-8">
        <section className="grid overflow-hidden border border-black/15 bg-[#f7ecdc] lg:grid-cols-[190px_minmax(0,1fr)]">
          <aside className="hidden border-r border-black/15 p-7 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ef5b22]">Cebu / Visayas</p>
              <h2 className="mt-8 text-3xl font-black uppercase leading-[0.9] tracking-normal">
                Brand-new units. Showroom ready.
              </h2>
            </div>
            <div>
              <a href="/shop" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] hover:text-[#ef5b22]">
                Browse stock <MoveRight className="h-4 w-4" />
              </a>
              <div className="mt-12 grid gap-2 text-xs font-black uppercase">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white">fb</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white">ig</span>
              </div>
            </div>
          </aside>

          <div className="min-w-0 p-5 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/20 pb-5">
              <div className="text-3xl font-black italic leading-none tracking-normal sm:text-4xl lg:text-5xl">Visayas Moto Hub</div>
              <nav className="flex rounded-full bg-black p-1 text-xs font-black uppercase text-white">
                <a href="/shop" className="rounded-full bg-white px-4 py-2 text-black">Shop</a>
                <a href="/categories" className="rounded-full px-4 py-2">Parts</a>
                <a href="/login" className="rounded-full px-4 py-2">Staff</a>
              </nav>
            </div>

            <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0">
                <p className="inline-flex bg-[#ff5a1f] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                  Brand-new motorcycles only
                </p>
                <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.88] tracking-normal sm:text-6xl lg:text-7xl xl:text-8xl">
                  Choose your new ride
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-black/66">
                  Brand-new CFMOTO, ZEEHO, Lambretta, Italjet, and Ducati motorcycles curated for Visayas riders with showroom release support.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="/shop">
                    <Button className="h-12 rounded-none bg-[#ff5a1f] px-7 text-xs font-black uppercase tracking-[0.12em] text-white shadow-none hover:bg-black">
                      Shop Now <MoveRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="/categories">
                    <Button variant="outline" className="h-12 rounded-none border-black bg-transparent px-7 text-xs font-black uppercase tracking-[0.12em] text-black shadow-none hover:bg-black hover:text-white">
                      View Brands
                    </Button>
                  </a>
                  <a href="/service">
                    <Button variant="outline" className="h-12 rounded-none border-black bg-transparent px-7 text-xs font-black uppercase tracking-[0.12em] text-black shadow-none hover:bg-black hover:text-white">
                      Book Service
                    </Button>
                  </a>
                </div>

                {featured ? (
                  <div className="mt-8 max-w-3xl border border-black/15 bg-[#ede0cd]">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image src={featured.imageUrl} alt={featured.name} fill className="object-cover mix-blend-multiply" sizes="50vw" priority />
                    </div>
                  </div>
                ) : null}
              </div>

              <aside className="grid min-w-0 gap-4 self-start">
                <div className="border border-black/20 bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ef5b22]">Featured</p>
                  <h2 className="mt-3 text-2xl font-black uppercase leading-none sm:text-3xl">{featured?.name ?? "Featured Ride"}</h2>
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {featured?.location ?? "Cebu City"}
                  </p>
                  <p className="mt-5 text-3xl font-black sm:text-4xl">{featured ? currency.format(featured.price) : "Inquire"}</p>
                </div>
                <div className="grid grid-cols-2 border border-black/20 bg-white">
                  <div className="border-r border-black/20 p-5">
                    <p className="text-xs font-black uppercase text-black/45">Stock</p>
                    <p className="mt-2 text-5xl font-black">{motorcycles.length}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-black uppercase text-black/45">Condition</p>
                    <p className="mt-2 text-3xl font-black uppercase">New</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="grid border-x border-b border-black/15 bg-white lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid sm:grid-cols-[0.95fr_1.05fr]">
            <div className="p-8">
              <h2 className="text-5xl font-black uppercase leading-[0.86]">Explore our store</h2>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">Brand-new motorcycles only: showroom units, release assistance, warranty processing, and rider-ready handover.</p>
              <a href="/shop" className="mt-8 inline-flex h-12 items-center gap-2 bg-[#ff5a1f] px-6 text-xs font-black uppercase tracking-[0.12em] text-white hover:bg-black">
                Shop Now <MoveRight className="h-4 w-4" />
              </a>
            </div>
            {secondary ? (
              <div className="relative min-h-72 bg-[#f4eadc]">
                <Image src={secondary.imageUrl} alt={secondary.name} fill className="object-cover" sizes="40vw" />
              </div>
            ) : null}
          </div>
          <div className="border-t border-black/15 bg-[#ff5a1f] p-8 text-white lg:border-l lg:border-t-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Showroom promise</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none">No second-hand units. Brand-new only.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div><Gauge className="mb-3 h-6 w-6" /> New unit specs</div>
              <div><Wrench className="mb-3 h-6 w-6" /> Release support</div>
              <div><ShieldCheck className="mb-3 h-6 w-6" /> Warranty assist</div>
            </div>
          </div>
        </section>

        <section className="grid border-x border-b border-black/15 bg-[#f7ecdc] lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="border-b border-black/15 p-6 lg:border-b-0 lg:border-r xl:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ef5b22]">Live shop</p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-none xl:text-4xl">Featured new units</h2>
            <a href="/shop" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] hover:text-[#ef5b22]">
              See all bikes <MoveRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid min-w-0 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {motorcycles.slice(0, 3).map((motorcycle) => <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
