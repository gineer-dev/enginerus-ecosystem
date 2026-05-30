import { ModuleHeader } from "@/components/cards/module-header";
import { SimpleTable } from "@/components/tables/simple-table";
import { moduleSummaries, roles } from "@/lib/constants/enginerus";

const roleRows = roles.map((role) => ({
  role,
  dashboard: "Allowed",
  service: ["Administrator", "Service Advisor", "Mechanic", "Management"].includes(role) ? "Allowed" : "View only",
  dyno: ["Administrator", "Dyno Technician", "Management"].includes(role) ? "Allowed" : "Restricted",
  inventory: ["Administrator", "Inventory Personnel", "Management"].includes(role) ? "Allowed" : "Restricted",
}));

export default function SettingsPage() {
  const summary = moduleSummaries.settings;
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Invite user" />
      <SimpleTable rows={roleRows} />
    </div>
  );
}
