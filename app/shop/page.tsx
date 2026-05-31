export const dynamic = "force-dynamic";

import { ShopView } from "@/components/marketplace/shop-view";
import { visayasMotoHubPageMetadata } from "@/lib/metadata";

export const metadata = visayasMotoHubPageMetadata("Shop", "Shop brand-new motorcycles from Visayas Moto Hub.");

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return <ShopView filters={await searchParams} />;
}
