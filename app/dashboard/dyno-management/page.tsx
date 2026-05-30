import { ModuleHeader } from "@/components/cards/module-header";
import { QuickCreateCard } from "@/components/forms/quick-create-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { moduleSummaries } from "@/lib/constants/enginerus";
import { createDynoSession } from "@/services/actions";
import { getDynoSessions } from "@/services/operations";

export default async function DynoManagementPage() {
  const summary = moduleSummaries["dyno-management"];
  const sessions = await getDynoSessions();
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Create dyno session" />
      <QuickCreateCard
        title="Dyno session"
        action={createDynoSession}
        fields={[
          { name: "session_number", label: "Session number", required: true, defaultValue: `DYN-${Date.now()}` },
          { name: "dyno_type", label: "Dyno type", required: true, defaultValue: "Baseline" },
          { name: "session_date", label: "Session date", type: "datetime-local", required: true },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />
      <SimpleTable rows={sessions} columns={["session_number", "customer", "motorcycle", "technician", "dyno_type", "session_date", "notes"]} />
    </div>
  );
}
