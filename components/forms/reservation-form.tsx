import { createReservation } from "@/services/actions";
import { products } from "@/constants/sample-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ReservationForm({ productId }: { productId?: string }) {
  return (
    <form action={createReservation} className="grid gap-4">
      <Select name="product_id" defaultValue={productId ?? products[0].id} required>
        {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
      </Select>
      <Input name="full_name" placeholder="Full name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="reservation_fee" type="number" min="1" placeholder="Reservation fee" required />
      <Textarea name="notes" placeholder="Reservation notes" />
      <Button type="submit">Reserve Product</Button>
    </form>
  );
}
