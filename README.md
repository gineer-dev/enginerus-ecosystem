# EngineRus OS

EngineRus OS is an internal motorcycle commerce and service operations platform for Dr. Engine R'us, integrated with Visayas Moto Hub.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS, shadcn-style primitives
- Supabase Auth, PostgreSQL, Storage, and Row Level Security
- React Hook Form, Zod, TanStack Table, Recharts, Sonner
- PWA manifest, service worker, app icon, and offline fallback

## Environment

Copy `.env.example` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is also supported for newer Supabase key formats.

## Routes

- Auth: `/login`, `/forgot-password`
- Dashboard: `/dashboard`
- Operations: `/dashboard/service-operations`, `/dashboard/job-orders`, `/dashboard/service-queue`
- Moto records: `/dashboard/dyno-management`, `/dashboard/motorcycle-registry`, `/dashboard/health-records`
- Business: `/dashboard/customers`, `/dashboard/inventory`, `/dashboard/marketplace-sync`, `/dashboard/reports`
- Controls: `/dashboard/notifications`, `/dashboard/audit-trail`, `/dashboard/settings`

## Supabase

Apply migrations in order:

1. `supabase/migrations/202605290001_init_vendora.sql`
2. `supabase/migrations/202605300001_enginerus_os.sql`

The EngineRus migration adds motorcycle registry, bookings, job orders, queue, dyno sessions, health records, maintenance schedules, inventory extensions, marketplace listings, notifications, audit logs, storage buckets, and role-based RLS policies.

## Development

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```
