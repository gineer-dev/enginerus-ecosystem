import { ModuleHeader } from "@/components/cards/module-header";
import { QuickCreateCard } from "@/components/forms/quick-create-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { jobOrderStatuses, moduleSummaries, serviceTypes } from "@/lib/constants/enginerus";
import { createJobOrder } from "@/services/actions";
import { getJobOrders } from "@/services/operations";

export default async function JobOrdersPage() {
  const summary = moduleSummaries["job-orders"];
  const jobOrders = await getJobOrders();
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Create job order" />
      <QuickCreateCard
        title="Job order form"
        action={createJobOrder}
        fields={[
          { name: "job_order_number", label: "Job order number", required: true, defaultValue: `JO-${Date.now()}` },
          { name: "service_type", label: "Service type", type: "select", options: serviceTypes, required: true },
          { name: "priority_level", label: "Priority level", type: "select", options: ["Low", "Normal", "High", "Urgent"], defaultValue: "Normal", required: true },
          { name: "estimated_completion", label: "Estimated completion", type: "datetime-local" },
          { name: "status", label: "Status", type: "select", options: jobOrderStatuses, defaultValue: "Pending", required: true },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />
      <SimpleTable rows={jobOrders} columns={["job_order_number", "customer", "motorcycle", "service_type", "mechanic", "priority_level", "status", "estimated_completion"]} />
    </div>
  );
}
