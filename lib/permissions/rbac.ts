import type { UserRole } from "@/types/domain";

export type Permission =
  | "dashboard:read"
  | "service:manage"
  | "jobs:manage"
  | "jobs:assigned"
  | "dyno:manage"
  | "registry:manage"
  | "health:manage"
  | "customers:manage"
  | "inventory:manage"
  | "marketplace:sync"
  | "notifications:manage"
  | "reports:read"
  | "users:manage"
  | "settings:manage"
  | "audit:read";

export const rolePermissions: Record<UserRole, Permission[]> = {
  "Super Admin": [
    "dashboard:read",
    "service:manage",
    "jobs:manage",
    "jobs:assigned",
    "dyno:manage",
    "registry:manage",
    "health:manage",
    "customers:manage",
    "inventory:manage",
    "marketplace:sync",
    "notifications:manage",
    "reports:read",
    "users:manage",
    "settings:manage",
    "audit:read",
  ],
  Admin: [
    "dashboard:read",
    "service:manage",
    "jobs:manage",
    "registry:manage",
    "health:manage",
    "customers:manage",
    "notifications:manage",
    "reports:read",
    "users:manage",
    "audit:read",
  ],
  Staff: ["dashboard:read", "service:manage", "jobs:manage", "registry:manage", "customers:manage", "notifications:manage"],
  Administrator: [
    "dashboard:read",
    "service:manage",
    "jobs:manage",
    "jobs:assigned",
    "dyno:manage",
    "registry:manage",
    "health:manage",
    "customers:manage",
    "inventory:manage",
    "marketplace:sync",
    "notifications:manage",
    "reports:read",
    "users:manage",
    "settings:manage",
    "audit:read",
  ],
  "Service Advisor": ["dashboard:read", "service:manage", "jobs:manage", "registry:manage", "health:manage", "customers:manage", "notifications:manage"],
  Mechanic: ["dashboard:read", "jobs:assigned", "health:manage"],
  "Dyno Technician": ["dashboard:read", "dyno:manage", "health:manage"],
  "Inventory Personnel": ["dashboard:read", "inventory:manage", "marketplace:sync", "notifications:manage"],
  Management: ["dashboard:read", "reports:read", "audit:read"],
};

export function hasPermission(roles: UserRole[], permission: Permission) {
  return roles.some((role) => rolePermissions[role]?.includes(permission));
}

export const dashboardRoutePermissions: Array<{ prefix: string; permission: Permission }> = [
  { prefix: "/dashboard/account-management", permission: "users:manage" },
  { prefix: "/dashboard/users", permission: "users:manage" },
  { prefix: "/dashboard/customers", permission: "customers:manage" },
  { prefix: "/dashboard/service-operations", permission: "service:manage" },
  { prefix: "/dashboard/service-queue", permission: "service:manage" },
  { prefix: "/dashboard/job-orders", permission: "jobs:manage" },
  { prefix: "/dashboard/dyno-management", permission: "dyno:manage" },
  { prefix: "/dashboard/inventory", permission: "inventory:manage" },
  { prefix: "/dashboard/products", permission: "inventory:manage" },
  { prefix: "/dashboard/marketplace-sync", permission: "marketplace:sync" },
  { prefix: "/dashboard/reports", permission: "reports:read" },
  { prefix: "/dashboard/audit", permission: "audit:read" },
  { prefix: "/dashboard/settings", permission: "settings:manage" },
  { prefix: "/dashboard/motorcycle-registry", permission: "registry:manage" },
  { prefix: "/dashboard/health-records", permission: "health:manage" },
  { prefix: "/dashboard/notifications", permission: "notifications:manage" },
];

export function canAccessDashboardPath(roles: UserRole[], pathname: string) {
  if (pathname === "/dashboard" || pathname === "/dashboard/access-denied" || pathname === "/dashboard/setup-password") return true;
  const rule = dashboardRoutePermissions.find((item) => pathname.startsWith(item.prefix));
  if (!rule) return hasPermission(roles, "dashboard:read");
  if (rule.permission === "jobs:manage" && hasPermission(roles, "jobs:assigned")) return true;
  return hasPermission(roles, rule.permission);
}
