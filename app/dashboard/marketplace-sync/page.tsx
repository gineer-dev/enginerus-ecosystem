import { RefreshCw } from "lucide-react";
import { ModuleHeader } from "@/components/cards/module-header";
import { QuickCreateCard } from "@/components/forms/quick-create-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { Button } from "@/components/ui/button";
import { moduleSummaries } from "@/lib/constants/enginerus";
import { getMarketplaceListings } from "@/services/operations";

export default async function MarketplaceSyncPage() {
  const summary = moduleSummaries["marketplace-sync"];
  const listings = await getMarketplaceListings();
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Publish item" />
      <QuickCreateCard title="Listing editor" fields={["Inventory item", "Listing title", "Description", "Price", "Photos", "Availability", "Sync status"]} />
      <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-primary">
        External sync is now isolated behind this backend-backed listing module. The next step is replacing the manual sync action with the real Visayas Moto Hub API client.
        <Button className="ml-0 mt-3 sm:ml-3 sm:mt-0" type="button"><RefreshCw className="h-4 w-4" /> Sync listings</Button>
      </div>
      <SimpleTable rows={listings} columns={["sku", "listing_type", "title", "price", "availability", "sync_status"]} />
    </div>
  );
}
