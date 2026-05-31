export const dynamic = "force-dynamic";

import { ShopView } from "@/components/marketplace/shop-view";
import { visayasMotoHubPageMetadata } from "@/lib/metadata";

export const metadata = visayasMotoHubPageMetadata("Marketplace", "Browse brand-new Visayas Moto Hub motorcycle inventory.");

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return <ShopView filters={await searchParams} />;
}
