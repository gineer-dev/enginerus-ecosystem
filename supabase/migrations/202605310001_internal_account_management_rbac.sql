alter type public.app_role add value if not exists 'Super Admin';
alter type public.app_role add value if not exists 'Admin';
alter type public.app_role add value if not exists 'Staff';

create table if not exists public.internal_accounts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  email text not null unique,
  mobile_number text unique,
  username text not null unique,
  temporary_password_hash text,
  is_first_login boolean not null default true,
  must_change_password boolean not null default true,
  password_changed_at timestamptz,
  last_login_at timestamptz,
  credentials_last_sent_at timestamptz,
  reset_requested_at timestamptz,
  account_status text not null default 'Active' check (account_status in ('Active', 'Disabled')),
  role_name text not null check (role_name in ('Super Admin', 'Admin', 'Staff', 'Service Advisor', 'Mechanic', 'Dyno Technician', 'Inventory Personnel', 'Management')),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists internal_accounts_role_name_idx on public.internal_accounts(role_name);
create index if not exists internal_accounts_status_idx on public.internal_accounts(account_status);
create index if not exists internal_accounts_first_login_idx on public.internal_accounts(is_first_login, must_change_password);

alter table public.internal_accounts enable row level security;

drop policy if exists "internal_accounts_staff_manage" on public.internal_accounts;
create policy "internal_accounts_staff_manage" on public.internal_accounts
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.user_id = (select auth.uid()) and p.status = 'Active'))
  with check (exists (select 1 from public.profiles p where p.user_id = (select auth.uid()) and p.status = 'Active'));

drop policy if exists "internal_accounts_own_select" on public.internal_accounts;
create policy "internal_accounts_own_select" on public.internal_accounts
  for select to authenticated
  using (auth_user_id = (select auth.uid()));

drop policy if exists "internal_accounts_own_update" on public.internal_accounts;
create policy "internal_accounts_own_update" on public.internal_accounts
  for update to authenticated
  using (auth_user_id = (select auth.uid()))
  with check (auth_user_id = (select auth.uid()));

create or replace function public.touch_internal_accounts_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_internal_accounts_updated_at on public.internal_accounts;
create trigger touch_internal_accounts_updated_at
before update on public.internal_accounts
for each row execute function public.touch_internal_accounts_updated_at();

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (role_id, permission_id)
);

alter table public.role_permissions enable row level security;

drop policy if exists "role_permissions_staff_read" on public.role_permissions;
create policy "role_permissions_staff_read" on public.role_permissions
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.user_id = (select auth.uid()) and p.status = 'Active'));

insert into public.roles (name, description) values
  ('Super Admin', 'Full access to every EngineRus OS module and setting.'),
  ('Admin', 'Can manage customers, users, service records, job orders, and reports.'),
  ('Staff', 'Can support customer registration, service bookings, job orders, and service updates.'),
  ('Service Advisor', 'Can manage service bookings, job orders, customer registration, and service updates.'),
  ('Mechanic', 'Can access assigned jobs, service progress updates, and diagnostics notes.'),
  ('Dyno Technician', 'Can access dyno sessions, dyno results, and ECU remapping records.'),
  ('Inventory Personnel', 'Can manage inventory, receiving, transfers, adjustments, and low stock alerts.'),
  ('Management', 'Can access dashboards, reports, analytics, customer metrics, and service performance.')
on conflict (name) do update set description = excluded.description, updated_at = now();

insert into public.permissions (key, description) values
  ('dashboard:read', 'View dashboard and summary metrics.'),
  ('users:manage', 'Create, update, disable, and reset internal users.'),
  ('customers:manage', 'Manage customer records and customer portal accounts.'),
  ('service:manage', 'Manage service bookings and service operations.'),
  ('jobs:manage', 'Manage all job orders.'),
  ('jobs:assigned', 'View and update assigned job orders.'),
  ('dyno:manage', 'Manage dyno sessions, dyno results, and ECU maps.'),
  ('inventory:manage', 'Manage inventory, receiving, transfers, adjustments, and alerts.'),
  ('registry:manage', 'Manage motorcycle registry records.'),
  ('health:manage', 'Manage motorcycle health and diagnostics records.'),
  ('marketplace:sync', 'Publish and sync marketplace inventory.'),
  ('notifications:manage', 'Manage notifications.'),
  ('reports:read', 'View reports and analytics.'),
  ('settings:manage', 'Manage system settings.'),
  ('audit:read', 'View audit logs.')
on conflict (key) do update set description = excluded.description;

with role_permission_map(role_name, permission_key) as (
  values
    ('Super Admin','dashboard:read'),('Super Admin','users:manage'),('Super Admin','customers:manage'),('Super Admin','service:manage'),('Super Admin','jobs:manage'),('Super Admin','jobs:assigned'),('Super Admin','dyno:manage'),('Super Admin','inventory:manage'),('Super Admin','registry:manage'),('Super Admin','health:manage'),('Super Admin','marketplace:sync'),('Super Admin','notifications:manage'),('Super Admin','reports:read'),('Super Admin','settings:manage'),('Super Admin','audit:read'),
    ('Admin','dashboard:read'),('Admin','users:manage'),('Admin','customers:manage'),('Admin','service:manage'),('Admin','jobs:manage'),('Admin','registry:manage'),('Admin','health:manage'),('Admin','reports:read'),('Admin','notifications:manage'),('Admin','audit:read'),
    ('Staff','dashboard:read'),('Staff','customers:manage'),('Staff','service:manage'),('Staff','jobs:manage'),('Staff','registry:manage'),('Staff','notifications:manage'),
    ('Service Advisor','dashboard:read'),('Service Advisor','customers:manage'),('Service Advisor','service:manage'),('Service Advisor','jobs:manage'),('Service Advisor','registry:manage'),('Service Advisor','health:manage'),('Service Advisor','notifications:manage'),
    ('Mechanic','dashboard:read'),('Mechanic','jobs:assigned'),('Mechanic','health:manage'),
    ('Dyno Technician','dashboard:read'),('Dyno Technician','dyno:manage'),('Dyno Technician','health:manage'),
    ('Inventory Personnel','dashboard:read'),('Inventory Personnel','inventory:manage'),('Inventory Personnel','marketplace:sync'),('Inventory Personnel','notifications:manage'),
    ('Management','dashboard:read'),('Management','reports:read'),('Management','audit:read')
)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from role_permission_map m
join public.roles r on r.name = m.role_name
join public.permissions p on p.key = m.permission_key
on conflict (role_id, permission_id) do nothing;
