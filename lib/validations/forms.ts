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
