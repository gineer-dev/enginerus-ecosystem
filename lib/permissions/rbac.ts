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
