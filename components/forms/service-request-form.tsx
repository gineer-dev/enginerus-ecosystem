import { createPublicServiceRequest } from "@/services/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const serviceTypes = ["PMS", "Diagnostics", "Dyno Tuning", "ECU Remapping", "Engine Repair", "Tire Services", "Electrical Services"];

export function ServiceRequestForm() {
  return (
    <form action={createPublicServiceRequest} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="full_name" placeholder="Full name" required className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
        <Input name="contact_number" placeholder="Contact number" required className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
        <Input name="email" type="email" placeholder="Email" required className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
        <Input name="address" placeholder="City / address" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="brand" placeholder="Motorcycle brand" required className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
        <Input name="model" placeholder="Model" required className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
        <Input name="variant" placeholder="Variant" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
        <Input name="year_model" type="number" min="1900" placeholder="Year model" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
        <Input name="plate_number" placeholder="Plate number, if available" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
        <Select name="service_type" required defaultValue="" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none">
          <option value="" disabled>Service needed</option>
          {serviceTypes.map((type) => <option key={type}>{type}</option>)}
        </Select>
      </div>

      <Input name="scheduled_date" type="datetime-local" required className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
      <Textarea name="notes" placeholder="Tell EngineRus what you need checked, tuned, repaired, or prepared." className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />

      <Button type="submit" className="h-12 rounded-none bg-[#ff5a1f] px-7 text-xs font-black uppercase tracking-[0.12em] text-white shadow-none hover:bg-black">
        Send Service Request
      </Button>
    </form>
  );
}
