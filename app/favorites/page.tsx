export const dynamic = "force-dynamic";

import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { ProductCard } from "@/components/marketplace/product-card";
import { products } from "@/constants/sample-data";

export default function FavoritesPage() {
  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-3xl font-bold">Favorites</h1>
        <p className="mt-2 text-muted-foreground">Saved listings are ready for Supabase-backed customer accounts.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 2).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </main>
    </>
  );
}
