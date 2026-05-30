import { createProduct } from "@/services/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm() {
  return (
    <form action={createProduct} className="grid gap-4 md:grid-cols-2">
      <Input name="sku" placeholder="SKU" required />
      <Input name="name" placeholder="Product name" required />
      <Input name="brand" placeholder="Brand" required />
      <Input name="model" placeholder="Model" required />
      <Input name="serial_number" placeholder="Serial number" />
      <Input name="supplier" placeholder="Supplier" />
      <Input name="acquisition_date" type="date" />
      <Input name="acquisition_cost" type="number" placeholder="Acquisition cost" required />
      <Input name="cost_price" type="number" placeholder="Cost price" required />
      <Input name="markup" type="number" placeholder="Markup" required />
      <Input name="selling_price" type="number" placeholder="Selling price" required />
      <Input name="quantity" type="number" placeholder="Quantity" required />
      <Input name="location" placeholder="Location" required />
      <Select name="status" defaultValue="Draft">
        {["Draft", "Inspection", "Maintenance", "Ready", "Reserved", "Sold", "Archived"].map((status) => <option key={status}>{status}</option>)}
      </Select>
      <Textarea name="description" placeholder="Description" className="md:col-span-2" required />
      <div className="md:col-span-2">
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
}
