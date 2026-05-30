import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(2),
  name: z.string().min(2),
  category_id: z.string().uuid().optional(),
  brand: z.string().min(1),
  model: z.string().min(1),
  serial_number: z.string().optional(),
  description: z.string().min(10),
  supplier: z.string().optional(),
  acquisition_date: z.string().optional(),
  acquisition_cost: z.coerce.number().nonnegative(),
  cost_price: z.coerce.number().nonnegative(),
  markup: z.coerce.number().nonnegative(),
  selling_price: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().int().nonnegative(),
  location: z.string().min(1),
  branch_id: z.string().uuid().optional(),
  status: z.enum(["Draft", "Inspection", "Maintenance", "Ready", "Reserved", "Sold", "Archived"]),
});

export type ProductInput = z.infer<typeof productSchema>;
