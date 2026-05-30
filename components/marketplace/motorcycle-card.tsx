import Image from "next/image";
import Link from "next/link";
import { Gauge, MapPin, MoveRight, Settings2 } from "lucide-react";
import type { Product } from "@/types/domain";

const currency = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

function spec(product: Product, key: string) {
  return product.specs[key] ?? "-";
}

export function MotorcycleCard({ motorcycle }: { motorcycle: Product }) {
  return (
    <article className="grid overflow-hidden border border-black/15 bg-white transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#161616]">
      <Link href={`/marketplace/${motorcycle.id}`} className="relative block aspect-[5/3] overflow-hidden bg-[#f4eadc]">
        {motorcycle.imageUrl ? (
          <Image src={motorcycle.imageUrl} alt={motorcycle.name} fill className="object-cover transition duration-500 hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="grid h-full place-items-center bg-[#181818] px-6 text-center text-3xl font-black uppercase leading-none text-white">
            {motorcycle.brand}
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_52%,rgba(0,0,0,0.64)_100%)]" />
        <span className="absolute left-4 top-4 bg-[#ff5a1f] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
          {motorcycle.status}
        </span>
        <span className="absolute bottom-4 left-4 text-2xl font-black uppercase leading-none text-white">{motorcycle.brand}</span>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black uppercase leading-tight">{motorcycle.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {motorcycle.location}
            </p>
          </div>
          <p className="shrink-0 bg-[#ff5a1f] px-3 py-2 text-right text-base font-black text-white sm:text-lg">{currency.format(motorcycle.price)}</p>
        </div>

        <div className="mt-5 grid grid-cols-3 border border-black/15 text-center">
          <div className="p-3">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Engine</p>
            <p className="mt-1 text-sm font-black">{spec(motorcycle, "Engine")}</p>
          </div>
          <div className="border-x border-black/10 p-3">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Power</p>
            <p className="mt-1 text-sm font-black">{spec(motorcycle, "Power")}</p>
          </div>
          <div className="p-3">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Gearbox</p>
            <p className="mt-1 text-sm font-black">{spec(motorcycle, "Gearbox")}</p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{motorcycle.description}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 bg-[#f4eadc] px-3 py-2 text-xs font-black uppercase text-black">
            <Gauge className="h-4 w-4 text-[#ff5a1f]" /> {motorcycle.condition}
          </span>
          <Link href={`/marketplace/${motorcycle.id}`} className="inline-flex h-10 items-center gap-2 bg-black px-4 text-sm font-bold text-white hover:bg-[#ff5a1f]">
            View <MoveRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Settings2 className="h-4 w-4" />
          {motorcycle.features.slice(0, 2).join(" / ")}
        </div>
      </div>
    </article>
  );
}
