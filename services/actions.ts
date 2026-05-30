"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  authSchema,
  customerGarageMotorcycleSchema,
  customerPortalRegisterSchema,
  customerPortalServiceRequestSchema,
  customerSchema,
  inquirySchema,
  jobOrderSchema,
  motorcycleSchema,
  publicServiceRequestSchema,
  reservationSchema,
  serviceBookingSchema,
} from "@/lib/validations/forms";
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

async function ensureCustomerAccount(payload: { full_name?: string | null; email: string; contact_number?: string | null; address?: string | null }) {
  const supabase = createAdminClient();
  const { data: existingCustomer, error: lookupError } = await supabase
    .from("customers")
    .select("id")
    .eq("email", payload.email)
    .maybeSingle();

  if (lookupError) throw new Error(lookupError.message);
  if (existingCustomer?.id) return existingCustomer.id;

  const customerNumber = `CUS-${Date.now()}`;
  const { data: customer, error } = await supabase
    .from("customers")
    .insert({
      customer_number: customerNumber,
      customer_id: customerNumber,
      full_name: payload.full_name ?? payload.email.split("@")[0],
      contact_number: payload.contact_number,
      mobile_number: payload.contact_number,
      email: payload.email,
      address: payload.address ?? "Customer Portal",
      customer_type: "Motorcycle Owner",
      notes: "Created from Dr. Engine R'us Customer Portal",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return customer.id;
}

async function isStaffAccount(userId: string, email?: string | null) {
  const supabase = createAdminClient();
  const filters = [`id.eq.${userId}`, `user_id.eq.${userId}`];
  if (email) filters.push(`email.eq.${email}`);

  const { data, error } = await supabase.from("profiles").select("id").or(filters.join(",")).limit(1);
  if (error) throw new Error(error.message);
  return Boolean(data?.length);
}

export async function customerSignIn(formData: FormData) {
  const payload = authSchema.parse(formObject(formData));
  const redirectTo = formData.get("redirectTo");
  const nextPath = typeof redirectTo === "string" && redirectTo.startsWith("/customer") ? redirectTo : "/customer/dashboard";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(payload);
  if (error) redirect(`/customer/login?error=${encodeURIComponent(error.message)}`);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && (await isStaffAccount(user.id, user.email))) {
    await supabase.auth.signOut();
    redirect("/customer/login?error=This email belongs to an EngineRus OS staff account. Use the internal login instead.");
  }
  await ensureCustomerAccount({ email: payload.email });
  revalidatePath("/customer", "layout");
  redirect(nextPath);
}

export async function customerSignUp(formData: FormData) {
  const payload = customerPortalRegisterSchema.parse(formObject(formData));
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.full_name,
        portal: "customer",
      },
    },
  });
  if (error) redirect(`/customer/register?error=${encodeURIComponent(error.message)}`);
  await ensureCustomerAccount(payload);
  revalidatePath("/customer", "layout");
  redirect("/customer/login?message=Check your email to confirm your customer account, then sign in.");
}

export async function customerResetPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) redirect(`/customer/forgot-password?error=${encodeURIComponent(error.message)}`);
  redirect("/customer/login?message=Password reset instructions have been sent to your email.");
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
    const supabase = createAdminClient();
    const customerId = await ensureCustomerAccount({
      full_name: payload.full_name,
      email: payload.email,
      contact_number: payload.contact_number,
      address: "Marketplace inquiry",
    });
    const { error } = await supabase.from("inquiries").insert({
      product_id: payload.product_id,
      customer_id: customerId,
      full_name: payload.full_name,
      email: payload.email,
      contact_number: payload.contact_number,
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
    const supabase = createAdminClient();
    const customerId = await ensureCustomerAccount({
      full_name: payload.full_name,
      email: payload.email,
      address: "Marketplace reservation",
    });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const { error } = await supabase.from("reservations").insert({
      product_id: payload.product_id,
      customer_id: customerId,
      reservation_fee: payload.reservation_fee,
      expiry_date: expiryDate.toISOString(),
      status: "Pending",
      notes: payload.notes,
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

export async function createCustomerGarageMotorcycle(formData: FormData) {
  const payload = customerGarageMotorcycleSchema.parse(formObject(formData));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/customer/login?redirectTo=/customer/my-garage");

  const customerId = await ensureCustomerAccount({ email: user.email, full_name: user.user_metadata?.full_name });

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const admin = createAdminClient();
    const motorcycleCode = `DER-MOTO-${Date.now()}`;
    const { data: motorcycle, error } = await admin
      .from("motorcycles")
      .insert({
        ...payload,
        motorcycle_code: motorcycleCode,
        customer_id: customerId,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    await admin.from("motorcycle_ownership_records").insert({
      motorcycle_id: motorcycle.id,
      owner_id: customerId,
      ownership_type: "Owner",
      remarks: "Added by customer through Dr. Engine R'us Customer Portal",
    });
  }

  revalidatePath("/customer/my-garage");
  redirect("/customer/my-garage");
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

export async function createCustomerPortalServiceRequest(formData: FormData) {
  const payload = customerPortalServiceRequestSchema.parse(formObject(formData));
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/customer/login?redirectTo=/customer/service-requests");

  const customerId = await ensureCustomerAccount({ email: user.email, full_name: user.user_metadata?.full_name });
  const admin = createAdminClient();
  const { data: motorcycle, error: motorcycleError } = await admin
    .from("motorcycles")
    .select("id")
    .eq("id", payload.motorcycle_id)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (motorcycleError) throw new Error(motorcycleError.message);
  if (!motorcycle?.id) throw new Error("Motorcycle not found for this customer account.");

  const { error } = await admin.from("service_bookings").insert({
    booking_number: `DER-SVC-${Date.now()}`,
    customer_id: customerId,
    motorcycle_id: payload.motorcycle_id,
    service_type: payload.service_type,
    booking_type: "Online",
    scheduled_date: payload.scheduled_date,
    status: "Pending",
    source: "Dr. Engine R'us Customer Portal",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/customer/dashboard");
  revalidatePath("/customer/service-requests");
  redirect("/customer/service-requests?submitted=true");
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
