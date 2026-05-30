"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authSchema, customerSchema, inquirySchema, jobOrderSchema, motorcycleSchema, publicServiceRequestSchema, reservationSchema, serviceBookingSchema } from "@/lib/validations/forms";
import { productSchema } from "@/lib/validations/product";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function formObject(formData: FormData) {
  return Object.fromEntries([...formData.entries()].filter(([, value]) => value !== ""));
}

export async function signIn(formData: FormData) {
  const payload = authSchema.parse(formObject(formData));
  const redirectTo = formData.get("redirectTo");
  const nextPath = typeof redirectTo === "string" && redirectTo.startsWith("/") ? redirectTo : "/dashboard";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(payload);
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function signUp(formData: FormData) {
  const payload = authSchema.parse(formObject(formData));
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(payload);
  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function createProduct(formData: FormData) {
  const payload = productSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").insert({
      sku: payload.sku,
      name: payload.name,
      brand: payload.brand,
      model: payload.model,
      serial_number: payload.serial_number,
      description: payload.description,
      acquisition_cost: payload.acquisition_cost,
      cost_price: payload.cost_price,
      selling_price: payload.selling_price,
      quantity: payload.quantity,
      available_quantity: payload.quantity,
      reorder_point: Number(formData.get("reorder_point") ?? 0),
      critical_stock_level: Number(formData.get("critical_stock_level") ?? 0),
      marketplace_enabled: formData.get("marketplace_enabled") === "on",
      location: payload.location,
      status: payload.status,
      branch_id: payload.branch_id,
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function createInquiry(formData: FormData) {
  const payload = inquirySchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { error } = await supabase.from("inquiries").insert({
      product_id: payload.product_id,
      message: payload.message,
      status: "New",
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/inquiries");
  redirect("/inquiries?submitted=true");
}

export async function createReservation(formData: FormData) {
  const payload = reservationSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { error } = await supabase.from("reservations").insert({
      product_id: payload.product_id,
      reservation_fee: payload.reservation_fee,
      status: "Pending",
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/reservations");
  redirect("/reservations?submitted=true");
}

export async function createCustomer(formData: FormData) {
  const payload = customerSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const customer_number = `CUS-${Date.now()}`;
    const { error } = await supabase.from("customers").insert({
      ...payload,
      customer_number,
      customer_id: customer_number,
      contact_number: payload.contact_number ?? payload.mobile_number,
      mobile_number: payload.mobile_number ?? payload.contact_number,
      customer_type: payload.customer_type ?? "Retail",
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function createMotorcycle(formData: FormData) {
  const payload = motorcycleSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("motorcycles").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/motorcycle-registry");
  redirect("/dashboard/motorcycle-registry");
}

export async function createServiceBooking(formData: FormData) {
  const payload = serviceBookingSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("service_bookings").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/service-operations");
  redirect("/dashboard/service-operations");
}

export async function createPublicServiceRequest(formData: FormData) {
  const payload = publicServiceRequestSchema.parse(formObject(formData));
  const bookingNumber = `VMH-SVC-${Date.now()}`;
  const customerNumber = `CUS-${Date.now()}`;
  const motorcycleCode = `VMH-MOTO-${Date.now()}`;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();

    const { data: existingCustomer, error: customerLookupError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", payload.email)
      .maybeSingle();

    if (customerLookupError) throw new Error(customerLookupError.message);

    let customerId = existingCustomer?.id;
    if (!customerId) {
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({
          customer_number: customerNumber,
          customer_id: customerNumber,
          full_name: payload.full_name,
          contact_number: payload.contact_number,
          mobile_number: payload.contact_number,
          email: payload.email,
          address: payload.address ?? "Submitted via Visayas Moto Hub",
          customer_type: "Service Lead",
          notes: payload.notes,
        })
        .select("id")
        .single();

      if (customerError) throw new Error(customerError.message);
      customerId = customer.id;
    }

    const { data: motorcycle, error: motorcycleError } = await supabase
      .from("motorcycles")
      .insert({
        motorcycle_code: motorcycleCode,
        customer_id: customerId,
        plate_number: payload.plate_number,
        brand: payload.brand,
        model: payload.model,
        variant: payload.variant,
        year_model: payload.year_model,
        mileage: 0,
      })
      .select("id")
      .single();

    if (motorcycleError) throw new Error(motorcycleError.message);

    const { error: bookingError } = await supabase.from("service_bookings").insert({
      booking_number: bookingNumber,
      customer_id: customerId,
      motorcycle_id: motorcycle.id,
      service_type: payload.service_type,
      booking_type: "Online",
      scheduled_date: payload.scheduled_date,
      status: "Pending",
      source: "Visayas Moto Hub Service",
    });

    if (bookingError) throw new Error(bookingError.message);
  }

  revalidatePath("/service");
  revalidatePath("/dashboard/service-operations");
  redirect("/service?submitted=true");
}

export async function createJobOrder(formData: FormData) {
  const payload = jobOrderSchema.parse(formObject(formData));
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("job_orders").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/dashboard/job-orders");
  revalidatePath("/dashboard/service-queue");
  redirect("/dashboard/job-orders");
}

export async function createDynoSession(formData: FormData) {
  const payload = formObject(formData);
  const supabase = createAdminClient();
  const { error } = await supabase.from("dyno_sessions").insert({
    session_number: String(payload.session_number),
    dyno_type: String(payload.dyno_type),
    session_date: String(payload.session_date),
    notes: payload.notes ? String(payload.notes) : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/dyno-management");
  redirect("/dashboard/dyno-management");
}

export async function createNotification(formData: FormData) {
  const payload = formObject(formData);
  const supabase = createAdminClient();
  const { error } = await supabase.from("notifications").insert({
    title: String(payload.title),
    message: String(payload.message),
    type: String(payload.type),
    event_type: String(payload.type),
    body: String(payload.message),
    channel: String(payload.channel ?? "In-app"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/notifications");
  redirect("/dashboard/notifications");
}
