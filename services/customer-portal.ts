import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type AnyRow = Record<string, unknown>;

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(value));
}

function dateValue(value?: string | null) {
  return value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
}

function motorcycleName(motorcycle?: AnyRow | null) {
  if (!motorcycle) return "Motorcycle";
  return [motorcycle.year_model, motorcycle.brand, motorcycle.model, motorcycle.variant].filter(Boolean).join(" ");
}

async function isStaffAccount(userId: string, email?: string | null) {
  const admin = createAdminClient();
  const filters = [`id.eq.${userId}`, `user_id.eq.${userId}`];
  if (email) filters.push(`email.eq.${email}`);

  const { data, error } = await admin.from("profiles").select("id").or(filters.join(",")).limit(1);
  if (error) throw new Error(error.message);
  return Boolean(data?.length);
}

async function currentCustomer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/customer/login?redirectTo=/customer/dashboard");
  if (await isStaffAccount(user.id, user.email)) {
    await supabase.auth.signOut();
    redirect("/customer/login?error=This email belongs to an EngineRus OS staff account. Use the internal login instead.");
  }

  const admin = createAdminClient();
  const { data: customer, error } = await admin
    .from("customers")
    .select("id, customer_number, full_name, email, mobile_number, contact_number, address, customer_type")
    .eq("email", user.email)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (customer?.id) {
    return { user, customer };
  }

  const customerNumber = `CUS-${Date.now()}`;
  const { data: createdCustomer, error: createError } = await admin
    .from("customers")
    .insert({
      customer_number: customerNumber,
      customer_id: customerNumber,
      full_name: user.user_metadata?.full_name ?? user.email.split("@")[0],
      email: user.email,
      address: "Customer Portal",
      customer_type: "Motorcycle Owner",
      notes: "Created automatically from Dr. Engine R'us Customer Portal",
    })
    .select("id, customer_number, full_name, email, mobile_number, contact_number, address, customer_type")
    .single();

  if (createError) throw new Error(createError.message);
  return { user, customer: createdCustomer };
}

export async function getCustomerPortalDashboard() {
  const { customer } = await currentCustomer();
  const admin = createAdminClient();

  const [motorcycles, bookings, jobOrders, healthRecords, schedules, dynoSessions, ecuMaps] = await Promise.all([
    admin.from("motorcycles").select("*").eq("customer_id", customer.id).order("created_at", { ascending: false }),
    admin.from("service_bookings").select("*, motorcycles(brand, model, variant, year_model, plate_number)").eq("customer_id", customer.id).order("scheduled_date", { ascending: false }),
    admin.from("job_orders").select("*, motorcycles(brand, model, variant, year_model, plate_number)").eq("customer_id", customer.id).order("created_at", { ascending: false }),
    admin
      .from("motorcycle_health_records")
      .select("*, motorcycles!inner(id, customer_id, brand, model, variant, year_model, plate_number)")
      .eq("motorcycles.customer_id", customer.id)
      .order("service_date", { ascending: false }),
    admin
      .from("maintenance_schedules")
      .select("*, motorcycles!inner(id, customer_id, brand, model, variant, year_model, plate_number)")
      .eq("motorcycles.customer_id", customer.id)
      .order("due_date", { ascending: true }),
    admin.from("dyno_sessions").select("*, motorcycles(brand, model, variant, year_model, plate_number)").eq("customer_id", customer.id).order("session_date", { ascending: false }),
    admin
      .from("ecu_maps")
      .select("*, motorcycles!inner(id, customer_id, brand, model, variant, year_model, plate_number)")
      .eq("motorcycles.customer_id", customer.id)
      .order("created_at", { ascending: false }),
  ]);

  const errors = [motorcycles.error, bookings.error, jobOrders.error, healthRecords.error, schedules.error, dynoSessions.error, ecuMaps.error].filter(Boolean);
  if (errors[0]) throw new Error(errors[0].message);

  const garage = motorcycles.data ?? [];
  const serviceBookings = bookings.data ?? [];
  const jobs = jobOrders.data ?? [];
  const health = healthRecords.data ?? [];
  const maintenance = schedules.data ?? [];
  const dyno = dynoSessions.data ?? [];
  const ecu = ecuMaps.data ?? [];
  const activeStatuses = ["Pending", "Queued", "In Progress", "Waiting Parts", "For Approval"];
  const upcomingPms = maintenance.filter((item) => item.status !== "Completed").sort((a, b) => dateValue(a.due_date) - dateValue(b.due_date));

  const notifications = [
    ...upcomingPms.slice(0, 3).map((item) => ({
      title: `${item.maintenance_type} due`,
      body: `${motorcycleName(item.motorcycles)} needs attention by ${formatDate(item.due_date)}.`,
      tone: "warning",
    })),
    ...jobs
      .filter((job) => activeStatuses.includes(job.status))
      .slice(0, 3)
      .map((job) => ({
        title: `${job.service_type} is ${job.status}`,
        body: `${motorcycleName(job.motorcycles)} is being handled by Dr. Engine R'us service operations.`,
        tone: "info",
      })),
    ...serviceBookings
      .filter((booking) => booking.status === "Pending")
      .slice(0, 3)
      .map((booking) => ({
        title: "Service request received",
        body: `${booking.service_type} request for ${motorcycleName(booking.motorcycles)} is awaiting advisor review.`,
        tone: "info",
      })),
  ];

  return {
    customer,
    motorcycles: garage,
    serviceBookings,
    jobOrders: jobs,
    healthRecords: health,
    maintenanceSchedules: maintenance,
    dynoSessions: dyno,
    ecuMaps: ecu,
    notifications,
    metrics: {
      motorcycles: garage.length,
      activeRequests: serviceBookings.filter((booking) => booking.status !== "Completed" && booking.status !== "Cancelled").length,
      activeJobs: jobs.filter((job) => activeStatuses.includes(job.status)).length,
      completedServices: jobs.filter((job) => ["Completed", "Released"].includes(job.status)).length,
      upcomingPms: upcomingPms.length,
      dynoSessions: dyno.length,
    },
  };
}

export async function getCustomerGarage() {
  const dashboard = await getCustomerPortalDashboard();
  return {
    customer: dashboard.customer,
    motorcycles: dashboard.motorcycles,
    maintenanceSchedules: dashboard.maintenanceSchedules,
    healthRecords: dashboard.healthRecords,
  };
}

export async function getCustomerServiceRequests() {
  const dashboard = await getCustomerPortalDashboard();
  return {
    customer: dashboard.customer,
    motorcycles: dashboard.motorcycles,
    serviceBookings: dashboard.serviceBookings,
    jobOrders: dashboard.jobOrders,
  };
}

export async function getCustomerMotorcycleDetail(id: string) {
  const dashboard = await getCustomerPortalDashboard();
  const motorcycle = dashboard.motorcycles.find((item) => item.id === id);
  if (!motorcycle) redirect("/customer/my-garage");

  return {
    customer: dashboard.customer,
    motorcycle,
    serviceBookings: dashboard.serviceBookings.filter((item) => item.motorcycle_id === id),
    jobOrders: dashboard.jobOrders.filter((item) => item.motorcycle_id === id),
    healthRecords: dashboard.healthRecords.filter((item) => item.motorcycle_id === id),
    maintenanceSchedules: dashboard.maintenanceSchedules.filter((item) => item.motorcycle_id === id),
    dynoSessions: dashboard.dynoSessions.filter((item) => item.motorcycle_id === id),
    ecuMaps: dashboard.ecuMaps.filter((item) => item.motorcycle_id === id),
  };
}

export { formatDate, motorcycleName };
