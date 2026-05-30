import { createAdminClient } from "@/lib/supabase/admin";

export type TableRow = Record<string, string | number | boolean | null | undefined>;
type AnyRow = Record<string, unknown>;
export type DashboardChartSeries = {
  serviceVolume: Array<{ day: string; PMS: number; Diagnostics: number; Dyno: number }>;
  jobStatus: Array<{ name: string; value: number }>;
  inventoryMovement: Array<{ day: string; Receive: number; Usage: number }>;
  dynoTrend: Array<{ month: string; sessions: number }>;
};

function text(value: unknown) {
  if (typeof value === "string" && value.length > 0) return value;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  return "-";
}

function num(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function dateText(value: unknown) {
  if (typeof value !== "string" || !value) return "-";
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function money(value: unknown) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(amount);
}

function obj(value: unknown): AnyRow {
  return value && typeof value === "object" ? (value as AnyRow) : {};
}

async function list<T>(query: PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDashboardMetrics() {
  const admin = createAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    jobsToday,
    activeJobs,
    completedServices,
    lowStock,
    dynoSessions,
    returningCustomers,
    notifications,
    revenue,
  ] = await Promise.all([
    admin.from("job_orders").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    admin.from("job_orders").select("id", { count: "exact", head: true }).in("status", ["Queued", "In Progress", "Waiting Parts", "For Approval"]),
    admin.from("job_orders").select("id", { count: "exact", head: true }).in("status", ["Completed", "Released"]),
    admin.from("products").select("id", { count: "exact", head: true }).filter("quantity", "lte", "reorder_point"),
    admin.from("dyno_sessions").select("id", { count: "exact", head: true }),
    admin.from("customers").select("id", { count: "exact", head: true }),
    admin.from("notifications").select("id", { count: "exact", head: true }).or("is_read.eq.false,read_at.is.null"),
    admin.from("sales_orders").select("total_amount"),
  ]);

  const revenueTotal = (revenue.data ?? []).reduce((sum, row) => sum + Number(row.total_amount ?? 0), 0);

  return {
    jobsToday: jobsToday.count ?? 0,
    activeJobs: activeJobs.count ?? 0,
    completedServices: completedServices.count ?? 0,
    averageCompletionTime: "0h",
    lowStockItems: lowStock.count ?? 0,
    dynoSessions: dynoSessions.count ?? 0,
    returningCustomers: returningCustomers.count ?? 0,
    openNotifications: notifications.count ?? 0,
    revenue: revenueTotal,
  };
}

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
}

function dateKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

export async function getDashboardChartSeries(): Promise<DashboardChartSeries> {
  const admin = createAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 5);

  const monthStart = new Date(today);
  monthStart.setMonth(today.getMonth() - 4, 1);

  const [bookings, jobOrders, stockMovements, dynoSessions] = await Promise.all([
    list(admin.from("service_bookings").select("service_type, scheduled_date").gte("scheduled_date", weekStart.toISOString())),
    list(admin.from("job_orders").select("status").gte("created_at", weekStart.toISOString())),
    list(admin.from("stock_movements").select("movement_type, quantity, created_at").gte("created_at", weekStart.toISOString())),
    list(admin.from("dyno_sessions").select("session_date").gte("session_date", monthStart.toISOString())),
  ]);

  const days = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });

  const serviceVolume = days.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const dayBookings = bookings.filter((booking: AnyRow) => typeof booking.scheduled_date === "string" && dateKey(booking.scheduled_date) === key);
    return {
      day: dayLabel(date),
      PMS: dayBookings.filter((booking: AnyRow) => booking.service_type === "PMS").length,
      Diagnostics: dayBookings.filter((booking: AnyRow) => booking.service_type === "Diagnostics").length,
      Dyno: dayBookings.filter((booking: AnyRow) => String(booking.service_type ?? "").includes("Dyno")).length,
    };
  });

  const jobStatus = ["Queued", "In Progress", "Waiting Parts", "For Approval", "Completed"].map((status) => ({
    name: status,
    value: jobOrders.filter((job: AnyRow) => job.status === status).length,
  }));

  const inventoryMovement = days.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const movements = stockMovements.filter((movement: AnyRow) => typeof movement.created_at === "string" && dateKey(movement.created_at) === key);
    return {
      day: dayLabel(date),
      Receive: movements.filter((movement: AnyRow) => movement.movement_type === "Receive").reduce((sum, movement: AnyRow) => sum + num(movement.quantity), 0),
      Usage: movements.filter((movement: AnyRow) => movement.movement_type === "Usage").reduce((sum, movement: AnyRow) => sum + num(movement.quantity), 0),
    };
  });

  const months = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(monthStart);
    date.setMonth(monthStart.getMonth() + index);
    return date;
  });

  const dynoTrend = months.map((date) => ({
    month: monthLabel(date),
    sessions: dynoSessions.filter((session: AnyRow) => {
      if (typeof session.session_date !== "string") return false;
      const sessionDate = new Date(session.session_date);
      return sessionDate.getFullYear() === date.getFullYear() && sessionDate.getMonth() === date.getMonth();
    }).length,
  }));

  return { serviceVolume, jobStatus, inventoryMovement, dynoTrend };
}

export async function getServiceBookings(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("service_bookings")
      .select("booking_number, service_type, booking_type, scheduled_date, status, source, customers(full_name), motorcycles(brand, model)")
      .order("scheduled_date", { ascending: false })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    booking_number: text(row.booking_number),
    customer: text(obj(row.customers).full_name),
    motorcycle: [obj(row.motorcycles).brand, obj(row.motorcycles).model].filter(Boolean).join(" ") || "-",
    service_type: text(row.service_type),
    booking_type: text(row.booking_type),
    scheduled_date: dateText(row.scheduled_date),
    status: text(row.status),
    source: text(row.source),
  }));
}

export async function getJobOrders(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("job_orders")
      .select("job_order_number, service_type, priority_level, estimated_completion, status, notes, customers(full_name), motorcycles(brand, model), profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    job_order_number: text(row.job_order_number),
    customer: text(obj(row.customers).full_name),
    motorcycle: [obj(row.motorcycles).brand, obj(row.motorcycles).model].filter(Boolean).join(" ") || "-",
    service_type: text(row.service_type),
    mechanic: text(obj(row.profiles).full_name),
    priority_level: text(row.priority_level),
    status: text(row.status),
    estimated_completion: dateText(row.estimated_completion),
  }));
}

export async function getServiceQueue(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("service_queue")
      .select("bay_number, queue_position, priority_level, status, started_at, completed_at, job_orders(job_order_number, service_type), profiles(full_name)")
      .order("queue_position", { ascending: true })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    job_order: text(obj(row.job_orders).job_order_number),
    service_type: text(obj(row.job_orders).service_type),
    bay_number: text(row.bay_number),
    queue_position: text(row.queue_position),
    priority_level: text(row.priority_level),
    assigned_to: text(obj(row.profiles).full_name),
    status: text(row.status),
  }));
}

export async function getDynoSessions(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("dyno_sessions")
      .select("session_number, dyno_type, session_date, notes, customers(full_name), motorcycles(brand, model), profiles(full_name)")
      .order("session_date", { ascending: false })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    session_number: text(row.session_number),
    customer: text(obj(row.customers).full_name),
    motorcycle: [obj(row.motorcycles).brand, obj(row.motorcycles).model].filter(Boolean).join(" ") || "-",
    technician: text(obj(row.profiles).full_name),
    dyno_type: text(row.dyno_type),
    session_date: dateText(row.session_date),
    notes: text(row.notes),
  }));
}

export async function getMotorcycles(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("motorcycles")
      .select("motorcycle_code, plate_number, brand, model, variant, year_model, color, mileage, customers(full_name)")
      .order("created_at", { ascending: false })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    motorcycle_code: text(row.motorcycle_code),
    customer: text(obj(row.customers).full_name),
    plate_number: text(row.plate_number),
    brand: text(row.brand),
    model: text(row.model),
    variant: text(row.variant),
    year_model: text(row.year_model),
    mileage: num(row.mileage),
  }));
}

export async function getCustomers(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("customers")
      .select("customer_number, full_name, mobile_number, contact_number, email, address, customer_type, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    customer_number: text(row.customer_number),
    full_name: text(row.full_name),
    mobile_number: text(row.mobile_number ?? row.contact_number),
    email: text(row.email),
    address: text(row.address),
    customer_type: text(row.customer_type),
  }));
}

export async function getInventory(): Promise<{ products: TableRow[]; categories: TableRow[]; lowStock: TableRow[] }> {
  const admin = createAdminClient();
  const [products, categories] = await Promise.all([
    list(admin.from("products").select("sku, name, brand, quantity, reorder_point, critical_stock_level, selling_price, marketplace_enabled, categories:category_id(name)").order("created_at", { ascending: false }).limit(100)),
    list(admin.from("inventory_categories").select("name, description").order("name")),
  ]);

  const productRows = products.map((row: AnyRow) => ({
    sku: text(row.sku),
    name: text(row.name),
    category: text(obj(row.categories).name),
    brand: text(row.brand),
    quantity: num(row.quantity),
    reorder_point: num(row.reorder_point),
    critical_stock_level: num(row.critical_stock_level),
    selling_price: money(row.selling_price),
    marketplace_enabled: Boolean(row.marketplace_enabled),
  }));

  return {
    products: productRows,
    categories: categories.map((row: AnyRow) => ({ name: text(row.name), description: text(row.description) })),
    lowStock: productRows.filter((row) => Number(row.quantity) <= Number(row.reorder_point)),
  };
}

export async function getMarketplaceListings(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("marketplace_listings")
      .select("listing_type, title, price, availability, sync_status, products(sku)")
      .order("created_at", { ascending: false })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    sku: text(obj(row.products).sku),
    listing_type: text(row.listing_type),
    title: text(row.title),
    price: money(row.price),
    availability: text(row.availability),
    sync_status: text(row.sync_status),
  }));
}

export async function getHealthRecords(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("motorcycle_health_records")
      .select("record_type, title, description, mileage, service_date, motorcycles(motorcycle_code, brand, model), profiles(full_name)")
      .order("service_date", { ascending: false })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    motorcycle: [obj(row.motorcycles).motorcycle_code, obj(row.motorcycles).brand, obj(row.motorcycles).model].filter(Boolean).join(" ") || "-",
    record_type: text(row.record_type),
    title: text(row.title),
    mileage: text(row.mileage),
    technician: text(obj(row.profiles).full_name),
    service_date: text(row.service_date),
  }));
}

export async function getNotifications(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("notifications")
      .select("title, message, body, type, event_type, channel, is_read, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    title: text(row.title),
    message: text(row.message ?? row.body),
    type: text(row.type ?? row.event_type),
    channel: text(row.channel),
    status: row.is_read || row.read_at ? "Read" : "Unread",
    created_at: dateText(row.created_at),
  }));
}

export async function getAuditLogs(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("audit_logs")
      .select("action, module, entity_type, record_id, entity_id, previous_value, old_value, new_value, created_at, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(100),
  );

  return rows.map((row: AnyRow) => ({
    user: text(obj(row.profiles).full_name),
    action: text(row.action),
    module: text(row.module ?? row.entity_type),
    record: text(row.record_id ?? row.entity_id),
    timestamp: dateText(row.created_at),
    previous_value: row.previous_value || row.old_value ? "Stored JSON" : "-",
    new_value: row.new_value ? "Stored JSON" : "-",
  }));
}

export async function getInspectionTemplates(): Promise<TableRow[]> {
  const rows = await list(
    createAdminClient()
      .from("inspection_templates")
      .select("name, description, categories(name), created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  );

  return rows.map((row: AnyRow) => ({
    name: text(row.name),
    description: text(row.description),
    category: text(obj(row.categories).name),
    created_at: dateText(row.created_at),
  }));
}
