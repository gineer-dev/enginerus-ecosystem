import { ModuleHeader } from "@/components/cards/module-header";
import { QuickCreateCard } from "@/components/forms/quick-create-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { moduleSummaries } from "@/lib/constants/enginerus";
import { createNotification } from "@/services/actions";
import { getNotifications } from "@/services/operations";

export default async function NotificationsPage() {
  const summary = moduleSummaries.notifications;
  const notifications = await getNotifications();
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Create notification" />
      <QuickCreateCard
        title="Notification"
        action={createNotification}
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "message", label: "Message", type: "textarea", required: true },
          { name: "type", label: "Type", type: "select", options: ["Booking", "Service", "PMS", "Warranty", "Inventory"], required: true },
          { name: "channel", label: "Channel", type: "select", options: ["In-app", "SMS", "Email"], defaultValue: "In-app", required: true },
        ]}
      />
      <SimpleTable rows={notifications} columns={["title", "message", "type", "channel", "status", "created_at"]} />
    </div>
  );
}
