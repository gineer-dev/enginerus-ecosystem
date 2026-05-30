export const dynamic = "force-dynamic";

import { ShopView } from "@/components/marketplace/shop-view";

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return <ShopView filters={await searchParams} />;
}
