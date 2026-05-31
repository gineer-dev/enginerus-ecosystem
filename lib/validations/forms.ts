import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const customerPortalRegisterSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  contact_number: z.string().min(7),
  address: z.string().min(4),
  password: z.string().min(8),
});

export const customerGarageMotorcycleSchema = z.object({
  plate_number: z.string().optional(),
  engine_number: z.string().optional(),
  chassis_number: z.string().optional(),
  brand: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().optional(),
  year_model: z.coerce.number().int().min(1900).optional(),
  color: z.string().optional(),
  mileage: z.coerce.number().int().nonnegative().default(0),
});

export const inquirySchema = z.object({
  product_id: z.string().min(1),
  full_name: z.string().min(2),
  email: z.string().email(),
  contact_number: z.string().min(7),
  message: z.string().min(10),
});

export const reservationSchema = z.object({
  product_id: z.string().min(1),
  full_name: z.string().min(2),
  email: z.string().email(),
  reservation_fee: z.coerce.number().positive(),
  notes: z.string().optional(),
});

export const customerSchema = z.object({
  full_name: z.string().min(2),
  contact_number: z.string().min(7).optional(),
  mobile_number: z.string().min(7).optional(),
  email: z.string().email(),
  address: z.string().min(4),
  customer_type: z.string().min(2).optional(),
  notes: z.string().optional(),
});

export const motorcycleSchema = z.object({
  motorcycle_code: z.string().min(3),
  customer_id: z.string().uuid().optional(),
  plate_number: z.string().optional(),
  engine_number: z.string().optional(),
  chassis_number: z.string().optional(),
  brand: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().optional(),
  year_model: z.coerce.number().int().min(1900).optional(),
  color: z.string().optional(),
  mileage: z.coerce.number().int().nonnegative().default(0),
});

export const serviceBookingSchema = z.object({
  booking_number: z.string().min(3),
  customer_id: z.string().uuid().optional(),
  motorcycle_id: z.string().uuid().optional(),
  service_type: z.enum(["PMS", "Diagnostics", "Dyno Tuning", "ECU Remapping", "Engine Repair", "Tire Services", "Electrical Services"]),
  booking_type: z.enum(["Walk-in", "Scheduled", "Online"]),
  scheduled_date: z.string().min(1),
  status: z.string().min(1).default("Pending"),
  source: z.string().optional(),
});

export const publicServiceRequestSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  contact_number: z.string().min(7),
  address: z.string().min(4).optional(),
  brand: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().optional(),
  year_model: z.coerce.number().int().min(1900).optional(),
  plate_number: z.string().optional(),
  service_type: z.enum(["PMS", "Diagnostics", "Dyno Tuning", "ECU Remapping", "Engine Repair", "Tire Services", "Electrical Services"]),
  scheduled_date: z.string().min(1),
  notes: z.string().optional(),
});

export const customerPortalServiceRequestSchema = z.object({
  motorcycle_id: z.string().uuid(),
  service_type: z.enum(["PMS", "Diagnostics", "Dyno Tuning", "ECU Remapping", "Engine Repair", "Tire Services", "Electrical Services"]),
  scheduled_date: z.string().min(1),
  notes: z.string().optional(),
});

export const customerAccountCreateSchema = z.object({
  full_name: z.string().min(2),
  mobile_number: z.string().min(7),
  email: z.string().email(),
  username: z.string().min(3).optional(),
  temporary_password: z.string().min(8).optional(),
  account_status: z.enum(["Active", "Disabled"]).default("Active"),
});

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character.");

export const internalAccountCreateSchema = z.object({
  full_name: z.string().min(2),
  mobile_number: z.string().min(7),
  email: z.string().email(),
  username: z.string().min(3).optional(),
  temporary_password: z.string().min(8).optional(),
  role_name: z.enum(["Super Admin", "Admin", "Staff", "Service Advisor", "Mechanic", "Dyno Technician", "Inventory Personnel", "Management"]),
  account_status: z.enum(["Active", "Disabled"]).default("Active"),
});

export const internalAccountUpdateSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(2),
  mobile_number: z.string().min(7),
  email: z.string().email(),
  username: z.string().min(3),
  role_name: z.enum(["Super Admin", "Admin", "Staff", "Service Advisor", "Mechanic", "Dyno Technician", "Inventory Personnel", "Management"]),
  account_status: z.enum(["Active", "Disabled"]),
});

export const customerSetupPasswordSchema = z
  .object({
    current_password: z.string().min(8),
    new_password: strongPassword,
    confirm_password: z.string().min(8),
  })
  .refine((payload) => payload.new_password === payload.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export const internalSetupPasswordSchema = customerSetupPasswordSchema;

export const jobOrderSchema = z.object({
  job_order_number: z.string().min(3),
  booking_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  motorcycle_id: z.string().uuid().optional(),
  service_type: z.string().min(1),
  assigned_mechanic_id: z.string().uuid().optional(),
  priority_level: z.string().min(1).default("Normal"),
  estimated_completion: z.string().optional(),
  status: z.enum(["Pending", "Queued", "In Progress", "Waiting Parts", "For Approval", "Completed", "Released", "Cancelled"]).default("Pending"),
  notes: z.string().optional(),
});
