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
  UserCog,
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
  { href: "/dashboard/account-management", label: "Account Management", icon: UserCog },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/marketplace-sync", label: "Marketplace Sync", icon: ShoppingBag },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/audit-trail", label: "Audit Trail", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

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
    description: "Publish inventory items, manage marketplace listings, photos, availability, and external sync state.",
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
  "account-management": {
    title: "Customer Account Management",
    eyebrow: "Portal access",
    description: "Create customer portal accounts, track first-time login status, enforce password setup, reset temporary passwords, and audit account activities.",
    actions: ["Customer accounts", "Create account", "Account status", "Password reset requests"],
    icon: UserCog,
  },
};
