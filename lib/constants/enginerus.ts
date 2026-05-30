import {
  Activity,
  BarChart3,
  Bell,
  Boxes,
  ClipboardList,
  Gauge,
  History,
  LayoutDashboard,
  ListChecks,
  PackageSearch,
  ScrollText,
  Settings,
  ShoppingBag,
  Stethoscope,
  Users,
  Wrench,
} from "lucide-react";

export const appName = "EngineRus OS";
export const primaryColor = "#782324";
export const accentColor = "#ffcc00";

export const roles = [
  "Administrator",
  "Service Advisor",
  "Mechanic",
  "Dyno Technician",
  "Inventory Personnel",
  "Management",
] as const;

export const jobOrderStatuses = [
  "Pending",
  "Queued",
  "In Progress",
  "Waiting Parts",
  "For Approval",
  "Completed",
  "Released",
  "Cancelled",
] as const;

export const serviceTypes = [
  "PMS",
  "Diagnostics",
  "Dyno Tuning",
  "ECU Remapping",
  "Engine Repair",
  "Tire Services",
  "Electrical Services",
] as const;

export const bookingTypes = ["Walk-in", "Scheduled", "Online"] as const;

export const recordTypes = [
  "PMS",
  "Repair",
  "Diagnostics",
  "Inspection",
  "Dyno",
  "ECU",
  "Parts Replacement",
  "Performance Upgrade",
] as const;

export const maintenanceTypes = [
  "Oil Change",
  "CVT Cleaning",
  "Valve Adjustment",
  "Brake Service",
  "Coolant Replacement",
  "Tire Replacement",
  "Registration Renewal",
] as const;

export const movementTypes = ["Receive", "Transfer", "Adjustment", "Usage", "Return"] as const;

export const productCategories = [
  "Performance Parts",
  "Engine Components",
  "Tires",
  "Lubricants",
  "Accessories",
  "Safety Gear",
] as const;

export const engineRusNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/service-operations", label: "Service Operations", icon: ClipboardList },
  { href: "/dashboard/job-orders", label: "Job Orders", icon: Wrench },
  { href: "/dashboard/service-queue", label: "Service Queue", icon: ListChecks },
  { href: "/dashboard/dyno-management", label: "Dyno Management", icon: Gauge },
  { href: "/dashboard/motorcycle-registry", label: "Motorcycle Registry", icon: PackageSearch },
  { href: "/dashboard/health-records", label: "Health Records", icon: Stethoscope },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/marketplace-sync", label: "Marketplace Sync", icon: ShoppingBag },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/audit-trail", label: "Audit Trail", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export const sampleCustomers = [
  { customer_number: "CUS-2026-001", full_name: "Marco Reyes", mobile_number: "0917 410 8821", email: "marco.reyes@example.com", address: "Cebu City", vip: true, visits: 18, spend: "PHP 148,500" },
  { customer_number: "CUS-2026-002", full_name: "Alyssa Tan", mobile_number: "0922 714 4488", email: "alyssa.tan@example.com", address: "Mandaue City", vip: false, visits: 7, spend: "PHP 54,250" },
  { customer_number: "CUS-2026-003", full_name: "Jerome Uy", mobile_number: "0915 227 9011", email: "jerome.uy@example.com", address: "Talisay City", vip: true, visits: 23, spend: "PHP 215,900" },
] as const;

export const sampleMotorcycles = [
  { motorcycle_code: "MOTO-00182", customer: "Marco Reyes", plate_number: "13A-904", brand: "Yamaha", model: "NMAX", variant: "155 ABS", year_model: 2023, mileage: 18420, health: "Good" },
  { motorcycle_code: "MOTO-00214", customer: "Alyssa Tan", plate_number: "09C-117", brand: "Honda", model: "Click", variant: "160", year_model: 2024, mileage: 9200, health: "Due PMS" },
  { motorcycle_code: "MOTO-00277", customer: "Jerome Uy", plate_number: "17D-620", brand: "Yamaha", model: "Aerox", variant: "155", year_model: 2022, mileage: 30110, health: "Performance" },
] as const;

export const sampleBookings = [
  { booking_number: "BKG-260530-001", customer: "Marco Reyes", motorcycle: "Yamaha NMAX", service_type: "PMS", booking_type: "Scheduled", scheduled_date: "2026-05-30 09:00", status: "Confirmed", source: "Service Advisor" },
  { booking_number: "BKG-260530-002", customer: "Alyssa Tan", motorcycle: "Honda Click", service_type: "Diagnostics", booking_type: "Walk-in", scheduled_date: "2026-05-30 10:30", status: "Checked In", source: "Walk-in" },
  { booking_number: "BKG-260531-001", customer: "Jerome Uy", motorcycle: "Yamaha Aerox", service_type: "Dyno Tuning", booking_type: "Online", scheduled_date: "2026-05-31 14:00", status: "Pending", source: "Visayas Moto Hub" },
] as const;

export const sampleJobOrders = [
  { job_order_number: "JO-260530-001", customer: "Marco Reyes", motorcycle: "Yamaha NMAX", service_type: "PMS", mechanic: "R. Dela Cruz", priority_level: "Normal", status: "In Progress", eta: "Today 12:30" },
  { job_order_number: "JO-260530-002", customer: "Alyssa Tan", motorcycle: "Honda Click", service_type: "Diagnostics", mechanic: "M. Torres", priority_level: "High", status: "Waiting Parts", eta: "Today 16:00" },
  { job_order_number: "JO-260529-006", customer: "Jerome Uy", motorcycle: "Yamaha Aerox", service_type: "ECU Remapping", mechanic: "J. Santos", priority_level: "High", status: "For Approval", eta: "Tomorrow 11:00" },
] as const;

export const queueColumns = [
  { title: "Pending queue", status: "Queued", items: ["JO-260530-004", "JO-260530-005"] },
  { title: "In progress", status: "In Progress", items: ["JO-260530-001", "JO-260529-008"] },
  { title: "Waiting parts", status: "Waiting Parts", items: ["JO-260530-002"] },
  { title: "For approval", status: "For Approval", items: ["JO-260529-006"] },
  { title: "Completed", status: "Completed", items: ["JO-260529-002", "JO-260529-003"] },
] as const;

export const sampleProducts = [
  { sku: "DER-OIL-10W40", name: "Dr. Engine 10W-40 Scooter Oil", category: "Lubricants", brand: "Dr. Engine R'us", quantity: 48, reorder_point: 20, critical_stock_level: 10, selling_price: 420, marketplace_enabled: true },
  { sku: "VMH-CVT-KIT-NMAX", name: "NMAX CVT Refresh Kit", category: "Performance Parts", brand: "Visayas Moto Hub", quantity: 9, reorder_point: 12, critical_stock_level: 5, selling_price: 2850, marketplace_enabled: true },
  { sku: "TIRE-PIRELLI-140", name: "Pirelli Angel Scooter 140/70", category: "Tires", brand: "Pirelli", quantity: 4, reorder_point: 8, critical_stock_level: 3, selling_price: 3950, marketplace_enabled: false },
] as const;

export const sampleDynoSessions = [
  { session_number: "DYN-260530-001", customer: "Jerome Uy", motorcycle: "Yamaha Aerox", technician: "L. Villanueva", dyno_type: "Baseline + ECU", peak_power: "18.7 hp", peak_torque: "15.2 Nm", status: "Report ready" },
  { session_number: "DYN-260529-003", customer: "Marco Reyes", motorcycle: "Yamaha NMAX", technician: "L. Villanueva", dyno_type: "Post service", peak_power: "16.4 hp", peak_torque: "14.1 Nm", status: "Archived" },
] as const;

export const healthTimeline = [
  { type: "PMS", title: "10,000 km PMS package", date: "2026-05-22", mileage: "18,100 km", technician: "R. Dela Cruz" },
  { type: "Dyno", title: "Baseline dyno and AFR check", date: "2026-04-18", mileage: "17,440 km", technician: "L. Villanueva" },
  { type: "Parts Replacement", title: "CVT belt and roller set", date: "2026-03-09", mileage: "16,820 km", technician: "M. Torres" },
] as const;

export const notifications = [
  { title: "Low stock alert", message: "Pirelli Angel Scooter 140/70 is below reorder point.", type: "Inventory", channel: "In-app", is_read: false },
  { title: "Service completion", message: "JO-260529-003 is ready for customer release.", type: "Service", channel: "SMS", is_read: false },
  { title: "PMS reminder", message: "Alyssa Tan's Honda Click is due for PMS in 400 km.", type: "Reminder", channel: "Email", is_read: true },
] as const;

export const auditLogs = [
  { user: "Admin User", action: "Created booking", module: "Service Operations", record: "BKG-260530-002", timestamp: "2026-05-30 08:42", previous: "-", next: "Checked In" },
  { user: "Inventory Lead", action: "Adjusted stock", module: "Inventory", record: "TIRE-PIRELLI-140", timestamp: "2026-05-30 08:12", previous: "6", next: "4" },
  { user: "Dyno Technician", action: "Uploaded report", module: "Dyno Management", record: "DYN-260530-001", timestamp: "2026-05-29 17:38", previous: "-", next: "PDF attached" },
] as const;

export const dashboardSeries = {
  serviceVolume: [
    { day: "Mon", PMS: 14, Diagnostics: 6, Dyno: 3 },
    { day: "Tue", PMS: 18, Diagnostics: 8, Dyno: 5 },
    { day: "Wed", PMS: 12, Diagnostics: 10, Dyno: 4 },
    { day: "Thu", PMS: 20, Diagnostics: 7, Dyno: 6 },
    { day: "Fri", PMS: 22, Diagnostics: 9, Dyno: 8 },
    { day: "Sat", PMS: 26, Diagnostics: 11, Dyno: 7 },
  ],
  jobStatus: [
    { name: "Queued", value: 7 },
    { name: "In Progress", value: 6 },
    { name: "Waiting Parts", value: 3 },
    { name: "For Approval", value: 2 },
    { name: "Completed", value: 15 },
  ],
  inventoryMovement: [
    { day: "Mon", Receive: 38, Usage: 21 },
    { day: "Tue", Receive: 22, Usage: 25 },
    { day: "Wed", Receive: 45, Usage: 19 },
    { day: "Thu", Receive: 10, Usage: 31 },
    { day: "Fri", Receive: 28, Usage: 35 },
    { day: "Sat", Receive: 18, Usage: 29 },
  ],
  dynoTrend: [
    { month: "Jan", sessions: 18 },
    { month: "Feb", sessions: 21 },
    { month: "Mar", sessions: 19 },
    { month: "Apr", sessions: 28 },
    { month: "May", sessions: 34 },
  ],
};

export const moduleSummaries = {
  "service-operations": {
    title: "Service Operations",
    eyebrow: "Bookings and intake",
    description: "Create bookings, monitor scheduled and walk-in work, and convert approved bookings into job orders.",
    actions: ["Create booking", "View bookings", "Booking details", "Convert to job order"],
    icon: ClipboardList,
  },
  "job-orders": {
    title: "Job Orders",
    eyebrow: "Workshop execution",
    description: "Track repair work from intake through release with status badges, mechanic assignment, notes, parts, and attachments.",
    actions: ["Create job order", "Assign mechanic", "Edit status", "Add parts used", "Upload attachments"],
    icon: Wrench,
  },
  "dyno-management": {
    title: "Dyno Management",
    eyebrow: "Dynolab operations",
    description: "Manage dyno sessions, result capture, ECU maps, graph uploads, PDF reports, videos, and motorcycle dyno history.",
    actions: ["Create dyno session", "Add dyno result", "ECU remapping form", "Upload graph", "Upload report"],
    icon: Gauge,
  },
  "motorcycle-registry": {
    title: "Motorcycle Registry",
    eyebrow: "Garage identity",
    description: "Maintain motorcycle profiles, ownership records, warranty references, linked customer garage, and service history.",
    actions: ["Add motorcycle", "Edit details", "Ownership history", "Service timeline"],
    icon: PackageSearch,
  },
  "marketplace-sync": {
    title: "Marketplace Synchronization",
    eyebrow: "Visayas Moto Hub",
    description: "Publish inventory items, manage marketplace listings, photos, availability, and mocked external sync state.",
    actions: ["Publish item", "Manage listings", "Sync status", "Update availability"],
    icon: ShoppingBag,
  },
  reports: {
    title: "Reports and Analytics",
    eyebrow: "Management visibility",
    description: "Service, inventory, customer, and dyno analytics for daily operations and management reviews.",
    actions: ["Service analytics", "Inventory analytics", "Customer analytics", "Dyno analytics"],
    icon: BarChart3,
  },
  notifications: {
    title: "Notifications",
    eyebrow: "Operations alerts",
    description: "Centralized notification center for confirmations, service completion, PMS reminders, warranty, and low stock alerts.",
    actions: ["Booking confirmation", "Service completion", "PMS reminder", "Warranty expiration", "Low stock"],
    icon: Bell,
  },
  "audit-trail": {
    title: "Audit Trail",
    eyebrow: "Accountability",
    description: "Searchable operational log for users, actions, modules, record IDs, timestamps, and value changes.",
    actions: ["Search logs", "Filter by module", "Review changes"],
    icon: ScrollText,
  },
  settings: {
    title: "Settings",
    eyebrow: "System control",
    description: "Manage roles, branches, PWA metadata, storage buckets, marketplace sync settings, and future AI maintenance hooks.",
    actions: ["Role access", "Branch settings", "Storage buckets", "PWA settings"],
    icon: Settings,
  },
  "health-records": {
    title: "Motorcycle Health Records",
    eyebrow: "Digital service record",
    description: "Medical-record-style motorcycle history with service, dyno, ECU, maintenance, replacement, upgrade, and attachment timelines.",
    actions: ["Service history", "Dyno history", "ECU history", "Maintenance schedule", "Attachments"],
    icon: Activity,
  },
};
