import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { Product } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const currency = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_16px_30px_rgba(30,38,43,0.14)] transition hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(30,38,43,0.2)]">
      <Link href={`/marketplace/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#d8d4cc]">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="grid h-full place-items-center bg-[#181818] px-6 text-center text-2xl font-black uppercase leading-none text-white">
              {product.brand}
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_48%,rgba(0,0,0,0.62)_100%)]" />
          <Badge className="absolute left-4 top-4 border-white/40 bg-white/82 text-[10px] uppercase tracking-[0.14em] text-black backdrop-blur">{product.category}</Badge>
          <Badge className="absolute bottom-4 left-4 border-[#ef6b21]/40 bg-[#ef6b21] text-white">{product.status}</Badge>
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-black leading-tight">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.brand} {product.model}</p>
          </div>
          <button aria-label="Save favorite" className="rounded-full border bg-white p-2 shadow-sm hover:bg-[#fff8e1]">
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {product.location}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-black text-foreground">{currency.format(product.price)}</p>
          <span className="text-xs font-bold uppercase text-[#ef6b21]">{product.condition}</span>
        </div>
        <Link href={`/marketplace/${product.id}`}>
          <Button className="w-full rounded-full bg-black text-white shadow-none hover:bg-[#ef6b21]">View Details</Button>
        </Link>
      </div>
    </article>
  );
}
