export const dynamic = "force-dynamic";

import { DataTable } from "@/components/tables/data-table";
import { reservationColumns } from "@/components/tables/columns";
import { getDashboardReservations } from "@/services/catalog";

export default async function DashboardReservationsPage() {
  const reservations = await getDashboardReservations();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Reservation Management</h1>
      {reservations.length > 0 ? (
        <DataTable columns={reservationColumns} data={reservations} />
      ) : (
        <div className="rounded-xl border bg-card p-6 text-sm font-semibold text-muted-foreground">No live reservations yet.</div>
      )}
    </div>
  );
}
