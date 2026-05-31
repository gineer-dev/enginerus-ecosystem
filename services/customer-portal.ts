import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { currentCustomerAccount } from "@/services/customer-accounts";

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

async function currentCustomer() {
  const { user, account } = await currentCustomerAccount();
  const admin = createAdminClient();
  const { data: customer, error } = await admin
    .from("customers")
    .select("id, customer_number, full_name, email, mobile_number, contact_number, address, customer_type")
    .eq("id", account.customer_id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (!customer?.id) redirect("/customer/login?error=Your customer record is missing. Please contact Dr. Engine R'us.");
  return { user, customer };
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
