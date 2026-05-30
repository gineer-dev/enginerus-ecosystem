import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCustomerGarageMotorcycle } from "@/services/actions";

export function CustomerMotorcycleForm() {
  return (
    <form action={createCustomerGarageMotorcycle} className="grid gap-3 border border-[#dfceb3] bg-white p-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Add Bike</p>
        <h2 className="text-2xl font-black uppercase tracking-normal">Register motorcycle</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input className="h-11 rounded-none" name="brand" placeholder="Brand" required />
        <Input className="h-11 rounded-none" name="model" placeholder="Model" required />
        <Input className="h-11 rounded-none" name="variant" placeholder="Variant" />
        <Input className="h-11 rounded-none" name="year_model" type="number" placeholder="Year model" />
        <Input className="h-11 rounded-none" name="plate_number" placeholder="Plate number" />
        <Input className="h-11 rounded-none" name="color" placeholder="Color" />
        <Input className="h-11 rounded-none" name="engine_number" placeholder="Engine number" />
        <Input className="h-11 rounded-none" name="chassis_number" placeholder="Chassis number" />
        <Input className="h-11 rounded-none" name="mileage" type="number" placeholder="Current mileage" defaultValue="0" />
      </div>
      <Button className="h-12 rounded-none bg-black uppercase tracking-[0.14em] text-white shadow-none hover:bg-[#ff5a1f]">
        Save Motorcycle
      </Button>
    </form>
  );
}
