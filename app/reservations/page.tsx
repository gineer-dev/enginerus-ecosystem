export const dynamic = "force-dynamic";

import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { ReservationForm } from "@/components/forms/reservation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReservationsPage() {
  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Card>
          <CardHeader><CardTitle>Reservation Form</CardTitle></CardHeader>
          <CardContent><ReservationForm /></CardContent>
        </Card>
      </main>
    </>
  );
}
