import Image from "next/image";
import Link from "next/link";
import { Bike, CalendarCheck, Gauge, MapPin, MoveRight, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { MotorcycleCard } from "@/components/marketplace/motorcycle-card";
import { Button } from "@/components/ui/button";
import { getMotorcyclesForSale } from "@/services/catalog";

const currency = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export async function MarketplaceView() {
  const motorcycles = await getMotorcyclesForSale();
  const featured = motorcycles[0];
  const secondary = motorcycles[1] ?? featured;
  const brandCount = new Set(motorcycles.map((motorcycle) => motorcycle.brand)).size;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7efdf] text-black">
      <MarketplaceHeader />
      <main id="main-content" className="mx-auto w-full max-w-[100vw] px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
        <section className="max-w-full overflow-hidden border border-[#ddcbb1] bg-[#fff8ea] shadow-[0_24px_70px_rgba(59,37,12,0.10)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_430px]">
            <div className="min-w-0 p-6 sm:p-9 lg:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 bg-[#ff5a1f] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                  Brand-new motorcycles only
                </span>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-black/50">Cebu / Visayas</span>
              </div>

              <h1 className="mt-7 max-w-full text-[2.55rem] font-black uppercase leading-[0.9] tracking-normal sm:max-w-4xl sm:text-6xl lg:text-7xl">
                Find your new ride.
              </h1>
              <p className="mt-6 max-w-full break-words text-base leading-8 text-black/64 sm:max-w-2xl sm:text-lg">
                Visayas Moto Hub publishes only brand-new units from EngineRus-connected showroom inventory, with release assistance, warranty support, and service handover for every rider.
              </p>

              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                <Link href="/shop" className="block min-w-0">
                  <Button className="h-12 w-full rounded-none bg-[#ff5a1f] px-7 text-xs font-black uppercase tracking-[0.14em] text-white shadow-none hover:bg-black sm:w-auto">
                    Shop New Units <MoveRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/service" className="block min-w-0">
                  <Button variant="outline" className="h-12 w-full rounded-none border-[#d9c7ab] bg-white/55 px-7 text-xs font-black uppercase tracking-[0.14em] text-black shadow-none hover:bg-black hover:text-white sm:w-auto">
                    Book Service
                  </Button>
                </Link>
                <Link href="/customer/login" className="block min-w-0">
                  <Button variant="outline" className="h-12 w-full rounded-none border-[#d9c7ab] bg-transparent px-7 text-xs font-black uppercase tracking-[0.14em] text-black shadow-none hover:bg-black hover:text-white sm:w-auto">
                    Customer Garage
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <HeroMetric label="Live Stock" value={motorcycles.length.toString()} />
                <HeroMetric label="Condition" value="New" />
                <HeroMetric label="Brands Live" value={brandCount ? brandCount.toString() : "Soon"} />
              </div>
            </div>

            <aside className="relative min-h-[420px] overflow-hidden bg-[#10100f] text-white">
              {featured?.imageUrl ? (
                <Image src={featured.imageUrl} alt={featured.name} fill className="object-cover" sizes="430px" priority />
              ) : (
                <ShowroomScene />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb18f]">Featured unit</p>
                <h2 className="mt-2 text-3xl font-black uppercase leading-none">{featured?.name ?? "Inventory opening soon"}</h2>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/78">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {featured?.location ?? "Visayas Moto Hub Showroom"}
                  </span>
                  <span>{featured ? currency.format(featured.price) : "Publish stock from EngineRus OS"}</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <LandingFeature href="/shop" icon={Bike} title="Shop brand-new units" text="Browse live showroom stock once products are published by EngineRus OS." />
          <LandingFeature href="/service" icon={Wrench} title="Book service" text="Send PMS, dyno, ECU, repair, and inspection requests to the service team." />
          <LandingFeature href="/customer/login" icon={CalendarCheck} title="Customer garage" text="Track motorcycle health records, PMS schedules, and service readiness." />
        </section>

        <section className="mt-5 grid overflow-hidden border border-[#ddcbb1] bg-white lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="border-b border-[#ddcbb1] bg-[#fff8ea] p-7 lg:border-b-0 lg:border-r">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ef5b22]">Live shop</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92]">Featured motorcycles</h2>
            <p className="mt-5 text-sm leading-6 text-black/58">
              Dynamic listings come directly from EngineRus OS inventory. No second-hand units are shown here.
            </p>
            <Link href="/shop" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] hover:text-[#ef5b22]">
              See all bikes <MoveRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid min-w-0 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {motorcycles.slice(0, 3).map((motorcycle) => (
              <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
            ))}
            {motorcycles.length === 0 ? <EmptyInventoryCard /> : null}
          </div>
        </section>

        <section className="grid overflow-hidden border-x border-b border-[#ddcbb1] bg-[#10100f] text-white lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-72 bg-[#181715]">
            {secondary?.imageUrl ? (
              <Image src={secondary.imageUrl} alt={secondary.name} fill className="object-cover" sizes="50vw" />
            ) : (
              <ShowroomScene compact />
            )}
          </div>
          <div className="bg-[#ff5a1f] p-8 lg:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/72">Showroom promise</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-black uppercase leading-none sm:text-5xl">Ride with checked, release-ready machines.</h2>
            <div className="mt-9 grid gap-5 text-sm font-bold sm:grid-cols-3">
              <span><Gauge className="mb-3 h-6 w-6" /> Specs reviewed</span>
              <span><Wrench className="mb-3 h-6 w-6" /> Service handover</span>
              <span><ShieldCheck className="mb-3 h-6 w-6" /> Warranty assist</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#ddcbb1] bg-white/68 p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-black/44">{label}</p>
      <p className="mt-2 text-3xl font-black uppercase leading-none">{value}</p>
    </div>
  );
}

function LandingFeature({ href, icon: Icon, title, text }: { href: string; icon: typeof Bike; title: string; text: string }) {
  return (
    <Link href={href} className="group border border-[#ddcbb1] bg-[#fff8ea] p-6 transition hover:-translate-y-0.5 hover:border-black hover:shadow-[0_18px_45px_rgba(59,37,12,0.10)]">
      <span className="grid h-11 w-11 place-items-center bg-black text-[#ff5a1f] transition group-hover:bg-[#ff5a1f] group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-xl font-black uppercase leading-none">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-black/58">{text}</p>
    </Link>
  );
}

function EmptyInventoryCard() {
  return (
    <div className="border border-dashed border-[#d6c3a8] bg-[#fff8ea] p-6 sm:col-span-2 xl:col-span-3">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ef5b22]">No live inventory yet</p>
      <h3 className="mt-3 text-2xl font-black uppercase leading-none">Ready for showroom stock</h3>
      <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-black/58">
        Add brand-new motorcycles in EngineRus OS to publish dynamic listings here. This page will update from Supabase when stock is available.
      </p>
    </div>
  );
}

function ShowroomScene({ compact = false }: { compact?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_12%,rgba(255,90,31,0.30),transparent_30%),linear-gradient(135deg,#171412,#060606)]">
      <div className="absolute inset-x-8 top-10 h-px bg-white/20" />
      <div className="absolute left-8 top-14 text-xs font-black uppercase tracking-[0.22em] text-white/45">Visayas Moto Hub</div>
      <div className="absolute bottom-16 left-8 right-8 h-px bg-white/18" />
      <div className={`absolute ${compact ? "bottom-16 left-[18%] h-24 w-[64%]" : "bottom-24 left-[12%] h-32 w-[76%]"} rounded-[999px] border-[18px] border-white/12`} />
      <div className={`absolute ${compact ? "bottom-20 left-[24%] h-14 w-14" : "bottom-24 left-[18%] h-20 w-20"} rounded-full border-[14px] border-[#ff5a1f] bg-black shadow-[0_0_0_10px_rgba(255,255,255,0.08)]`} />
      <div className={`absolute ${compact ? "bottom-20 right-[24%] h-14 w-14" : "bottom-24 right-[18%] h-20 w-20"} rounded-full border-[14px] border-[#ff5a1f] bg-black shadow-[0_0_0_10px_rgba(255,255,255,0.08)]`} />
      <div className={`absolute ${compact ? "bottom-36 left-[35%] h-16 w-[32%]" : "bottom-48 left-[33%] h-20 w-[34%]"} skew-x-[-18deg] bg-white/14`} />
      <div className={`absolute ${compact ? "bottom-48 right-[27%] h-2 w-16" : "bottom-64 right-[24%] h-2 w-24"} rotate-[-12deg] bg-[#ff5a1f]`} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:80px_100%]" />
    </div>
  );
}
