export const dynamic = "force-dynamic";

import { DataTable } from "@/components/tables/data-table";
import { inquiryColumns } from "@/components/tables/columns";
import { getDashboardInquiries } from "@/services/catalog";

export default async function DashboardInquiriesPage() {
  const inquiries = await getDashboardInquiries();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Inquiry Management</h1>
      {inquiries.length > 0 ? (
        <DataTable columns={inquiryColumns} data={inquiries} />
      ) : (
        <div className="rounded-xl border bg-card p-6 text-sm font-semibold text-muted-foreground">No live inquiries yet.</div>
      )}
    </div>
  );
}
