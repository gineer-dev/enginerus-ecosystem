import { Crown, Warehouse } from "lucide-react";
import { QuickCreateCard } from "@/components/forms/quick-create-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCustomer } from "@/services/actions";
import { getCustomers, getMotorcycles } from "@/services/operations";

export default async function CustomersPage() {
  const [customers, motorcycles] = await Promise.all([getCustomers(), getMotorcycles()]);
  return (
    <div className="space-y-6">
      <section className="reference-surface p-6 lg:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">CRM / Customers</p>
        <h1 className="mt-2 text-3xl font-black">Customer garage and service relationship center</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Customer list, profiles, garage, service reminders, loyalty points, VIP status, total spend placeholder, and visit count.</p>
      </section>
      <QuickCreateCard
        title="Customer profile form"
        action={createCustomer}
        fields={[
          { name: "full_name", label: "Full name", required: true },
          { name: "mobile_number", label: "Mobile number", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "address", label: "Address", required: true },
          { name: "customer_type", label: "Customer type", defaultValue: "Retail" },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />
      <SimpleTable rows={customers} columns={["customer_number", "full_name", "mobile_number", "email", "address", "customer_type"]} />
      <div className="grid gap-4 lg:grid-cols-3">
        {customers.slice(0, 3).map((customer, index) => (
          <Card key={String(customer.customer_number)} className="border-white/75 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {index === 0 ? <Crown className="h-5 w-5 text-[#c18b35]" /> : <Warehouse className="h-5 w-5 text-primary" />}
                {customer.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{motorcycles[index]?.brand ?? "No motorcycle linked yet"} {motorcycles[index]?.model ?? ""}</p>
              <p className="mt-2">Service visit count: pending analytics</p>
              <p>Total spend: calculated from sales orders</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
