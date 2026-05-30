import { ModuleHeader } from "@/components/cards/module-header";
import { SimpleTable } from "@/components/tables/simple-table";
import { moduleSummaries } from "@/lib/constants/enginerus";
import { getAuditLogs } from "@/services/operations";

export default async function AuditTrailPage() {
  const summary = moduleSummaries["audit-trail"];
  const auditLogs = await getAuditLogs();
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Export audit log" />
      <SimpleTable rows={auditLogs} columns={["user", "action", "module", "record", "timestamp", "previous_value", "new_value"]} />
    </div>
  );
}
