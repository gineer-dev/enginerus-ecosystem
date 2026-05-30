import { ModuleHeader } from "@/components/cards/module-header";
import { QuickCreateCard } from "@/components/forms/quick-create-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { moduleSummaries } from "@/lib/constants/enginerus";
import { createMotorcycle } from "@/services/actions";
import { getMotorcycles } from "@/services/operations";

export default async function MotorcycleRegistryPage() {
  const summary = moduleSummaries["motorcycle-registry"];
  const motorcycles = await getMotorcycles();
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Add motorcycle" />
      <QuickCreateCard
        title="Motorcycle profile"
        action={createMotorcycle}
        fields={[
          { name: "motorcycle_code", label: "Motorcycle code", required: true, defaultValue: `MOTO-${Date.now()}` },
          { name: "plate_number", label: "Plate number" },
          { name: "engine_number", label: "Engine number" },
          { name: "chassis_number", label: "Chassis number" },
          { name: "brand", label: "Brand", required: true },
          { name: "model", label: "Model", required: true },
          { name: "variant", label: "Variant" },
          { name: "year_model", label: "Year model", type: "number" },
          { name: "color", label: "Color" },
          { name: "mileage", label: "Mileage", type: "number", defaultValue: 0 },
        ]}
      />
      <SimpleTable rows={motorcycles} columns={["motorcycle_code", "customer", "plate_number", "brand", "model", "variant", "year_model", "mileage"]} />
    </div>
  );
}
