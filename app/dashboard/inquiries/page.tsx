export const dynamic = "force-dynamic";

import { DataTable } from "@/components/tables/data-table";
import { inquiryColumns } from "@/components/tables/columns";
import { inquiries } from "@/constants/sample-data";

export default function DashboardInquiriesPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Inquiry Management</h1>
      <DataTable columns={inquiryColumns} data={inquiries} />
    </div>
  );
}
