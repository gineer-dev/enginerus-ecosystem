export const dynamic = "force-dynamic";

import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { ProductCard } from "@/components/marketplace/product-card";
import { getFavoriteProducts } from "@/services/catalog";

export default async function FavoritesPage() {
  const products = await getFavoriteProducts();

  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-3xl font-bold">Favorites</h1>
        <p className="mt-2 text-muted-foreground">Saved listings from your Supabase account.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
          {products.length === 0 ? (
            <div className="rounded-lg border bg-white p-6 text-sm font-semibold text-muted-foreground sm:col-span-2 lg:col-span-3">
              No saved listings yet. Sign in and save live inventory to see favorites here.
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
