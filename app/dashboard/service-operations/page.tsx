import { ModuleHeader } from "@/components/cards/module-header";
import { QuickCreateCard } from "@/components/forms/quick-create-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { bookingTypes, moduleSummaries, serviceTypes } from "@/lib/constants/enginerus";
import { createServiceBooking } from "@/services/actions";
import { getServiceBookings } from "@/services/operations";

export default async function ServiceOperationsPage() {
  const summary = moduleSummaries["service-operations"];
  const bookings = await getServiceBookings();
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Create booking" />
      <QuickCreateCard
        title="Booking intake"
        action={createServiceBooking}
        fields={[
          { name: "booking_number", label: "Booking number", required: true, defaultValue: `BKG-${Date.now()}` },
          { name: "service_type", label: "Service type", type: "select", options: serviceTypes, required: true },
          { name: "booking_type", label: "Booking type", type: "select", options: bookingTypes, required: true },
          { name: "scheduled_date", label: "Scheduled date", type: "datetime-local", required: true },
          { name: "status", label: "Status", defaultValue: "Pending", required: true },
          { name: "source", label: "Source", defaultValue: "Walk-in" },
        ]}
      />
      <SimpleTable rows={bookings} columns={["booking_number", "customer", "motorcycle", "service_type", "booking_type", "scheduled_date", "status", "source"]} />
    </div>
  );
}
