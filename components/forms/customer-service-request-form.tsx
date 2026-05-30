import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCustomerPortalServiceRequest } from "@/services/actions";
import { motorcycleName } from "@/services/customer-portal";

type Motorcycle = Record<string, string | number | null | undefined>;

const serviceTypes = ["PMS", "Diagnostics", "Dyno Tuning", "ECU Remapping", "Engine Repair", "Tire Services", "Electrical Services"];

export function CustomerServiceRequestForm({ motorcycles }: { motorcycles: Motorcycle[] }) {
  return (
    <form action={createCustomerPortalServiceRequest} className="grid gap-3 border border-[#dfceb3] bg-white p-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Service Bay</p>
        <h2 className="text-2xl font-black uppercase tracking-normal">Book service request</h2>
      </div>
      <Select name="motorcycle_id" required defaultValue="">
        <option value="" disabled>Select motorcycle</option>
        {motorcycles.map((motorcycle) => (
          <option key={String(motorcycle.id)} value={String(motorcycle.id)}>
            {motorcycleName(motorcycle)}
          </option>
        ))}
      </Select>
      <Select name="service_type" required defaultValue="PMS">
        {serviceTypes.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </Select>
      <Input className="h-11 rounded-none" name="scheduled_date" type="datetime-local" required />
      <Textarea className="min-h-28 rounded-none" name="notes" placeholder="Symptoms, requests, PMS notes, ECU/dyno goals, or service concerns" />
      <Button disabled={motorcycles.length === 0} className="h-12 rounded-none bg-[#ff5a1f] uppercase tracking-[0.14em] shadow-none hover:bg-black">
        Send to EngineRus Service
      </Button>
      {motorcycles.length === 0 ? <p className="text-xs font-semibold text-[#5f5649]">Add a motorcycle in My Garage before booking service.</p> : null}
    </form>
  );
}
