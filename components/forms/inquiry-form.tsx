import { createInquiry } from "@/services/actions";
import { products } from "@/constants/sample-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function InquiryForm({ productId }: { productId?: string }) {
  return (
    <form action={createInquiry} className="grid gap-4">
      <Select name="product_id" defaultValue={productId ?? products[0].id} required>
        {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
      </Select>
      <Input name="full_name" placeholder="Full name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="contact_number" placeholder="Contact number" required />
      <Textarea name="message" placeholder="How can our sales team help?" required />
      <Button type="submit">Send Inquiry</Button>
    </form>
  );
}
