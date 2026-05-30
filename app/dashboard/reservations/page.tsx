export const dynamic = "force-dynamic";

import { DataTable } from "@/components/tables/data-table";
import { reservationColumns } from "@/components/tables/columns";
import { reservations } from "@/constants/sample-data";

export default function DashboardReservationsPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Reservation Management</h1>
      <DataTable columns={reservationColumns} data={reservations} />
    </div>
  );
}
