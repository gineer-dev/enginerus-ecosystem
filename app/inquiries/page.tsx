export const dynamic = "force-dynamic";

import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InquiriesPage() {
  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Card>
          <CardHeader><CardTitle>Inquiry Form</CardTitle></CardHeader>
          <CardContent><InquiryForm /></CardContent>
        </Card>
      </main>
    </>
  );
}
