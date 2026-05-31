export const dynamic = "force-dynamic";

import { MarketplaceView } from "@/components/marketplace/marketplace-view";
import { visayasMotoHubMetadata } from "@/lib/metadata";

export const metadata = visayasMotoHubMetadata;

export default function HomePage() {
  return <MarketplaceView />;
}
