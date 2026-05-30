create extension if not exists "pgcrypto";

create schema if not exists private;

do $$ begin
  create type public.app_role as enum ('Administrator','Service Advisor','Mechanic','Dyno Technician','Inventory Personnel','Management');
exception when duplicate_object then null;
end $$;

alter table public.branches add column if not exists is_active boolean not null default true;

alter table public.profiles add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.profiles add column if not exists role public.app_role not null default 'Service Advisor';
alter table public.profiles add column if not exists branch_id uuid references public.branches(id);
alter table public.profiles add column if not exists status text not null default 'Active' check (status in ('Active','Inactive','Suspended'));
update public.profiles set user_id = id where user_id is null;
create unique index if not exists profiles_user_id_key on public.profiles(user_id);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_branch_id_idx on public.profiles(branch_id);

alter table public.customers add column if not exists customer_number text;
alter table public.customers add column if not exists mobile_number text;
update public.customers set customer_number = coalesce(customer_number, customer_id) where customer_number is null;
update public.customers set mobile_number = coalesce(mobile_number, contact_number) where mobile_number is null;
create unique index if not exists customers_customer_number_key on public.customers(customer_number);

create table if not exists public.motorcycles (
  id uuid primary key default gen_random_uuid(),
  motorcycle_code text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  plate_number text,
  engine_number text,
  chassis_number text,
  brand text not null,
  model text not null,
  variant text,
  year_model integer,
  color text,
  mileage integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.motorcycle_ownership_records (
  id uuid primary key default gen_random_uuid(),
  motorcycle_id uuid not null references public.motorcycles(id) on delete cascade,
  owner_id uuid not null references public.customers(id) on delete cascade,
  purchase_date date,
  ownership_type text not null default 'Owner',
  remarks text,
  created_at timestamptz not null default now()
);

create table if not exists public.service_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  motorcycle_id uuid references public.motorcycles(id) on delete set null,
  service_type text not null check (service_type in ('PMS','Diagnostics','Dyno Tuning','ECU Remapping','Engine Repair','Tire Services','Electrical Services')),
  booking_type text not null check (booking_type in ('Walk-in','Scheduled','Online')),
  scheduled_date timestamptz not null,
  status text not null default 'Pending',
  source text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_orders (
  id uuid primary key default gen_random_uuid(),
  job_order_number text not null unique,
  booking_id uuid references public.service_bookings(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  motorcycle_id uuid references public.motorcycles(id) on delete set null,
  service_type text not null,
  assigned_mechanic_id uuid references public.profiles(id),
  priority_level text not null default 'Normal',
  estimated_completion timestamptz,
  status text not null default 'Pending' check (status in ('Pending','Queued','In Progress','Waiting Parts','For Approval','Completed','Released','Cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_queue (
  id uuid primary key default gen_random_uuid(),
  job_order_id uuid not null references public.job_orders(id) on delete cascade,
  bay_number text,
  queue_position integer,
  priority_level text not null default 'Normal',
  status text not null default 'Queued',
  assigned_to uuid references public.profiles(id),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dyno_sessions (
  id uuid primary key default gen_random_uuid(),
  session_number text not null unique,
  motorcycle_id uuid references public.motorcycles(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  technician_id uuid references public.profiles(id),
  dyno_type text not null,
  session_date timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dyno_results (
  id uuid primary key default gen_random_uuid(),
  dyno_session_id uuid not null references public.dyno_sessions(id) on delete cascade,
  horsepower numeric(10,2),
  torque numeric(10,2),
  rpm_range text,
  afr_data jsonb not null default '[]'::jsonb,
  peak_torque numeric(10,2),
  peak_power numeric(10,2),
  graph_url text,
  report_url text,
  video_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.ecu_maps (
  id uuid primary key default gen_random_uuid(),
  dyno_session_id uuid references public.dyno_sessions(id) on delete set null,
  motorcycle_id uuid references public.motorcycles(id) on delete cascade,
  ecu_version text,
  map_version text,
  map_type text,
  tuning_notes text,
  backup_file_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.motorcycle_health_records (
  id uuid primary key default gen_random_uuid(),
  motorcycle_id uuid not null references public.motorcycles(id) on delete cascade,
  record_type text not null check (record_type in ('PMS','Repair','Diagnostics','Inspection','Dyno','ECU','Parts Replacement','Performance Upgrade')),
  title text not null,
  description text,
  mileage integer,
  technician_id uuid references public.profiles(id),
  service_date date not null default current_date,
  attachment_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.maintenance_schedules (
  id uuid primary key default gen_random_uuid(),
  motorcycle_id uuid not null references public.motorcycles(id) on delete cascade,
  maintenance_type text not null check (maintenance_type in ('Oil Change','CVT Cleaning','Valve Adjustment','Brake Service','Coolant Replacement','Tire Replacement','Registration Renewal')),
  due_date date,
  due_mileage integer,
  status text not null default 'Pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

alter table public.products add column if not exists reorder_point integer not null default 0;
alter table public.products add column if not exists critical_stock_level integer not null default 0;
alter table public.products add column if not exists batch_number text;
alter table public.products add column if not exists marketplace_enabled boolean not null default false;

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  movement_type text not null check (movement_type in ('Receive','Transfer','Adjustment','Usage','Return')),
  quantity integer not null,
  reference_number text,
  remarks text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_person text,
  contact_number text,
  email text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  listing_type text not null default 'Visayas Moto Hub',
  title text not null,
  description text,
  price numeric(14,2) not null default 0,
  photos jsonb not null default '[]'::jsonb,
  availability text not null default 'Available',
  sync_status text not null default 'Draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  channel text not null default 'In-app',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  module text not null,
  record_id text,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create index if not exists motorcycles_customer_id_idx on public.motorcycles(customer_id);
create index if not exists service_bookings_customer_id_idx on public.service_bookings(customer_id);
create index if not exists job_orders_assigned_mechanic_id_idx on public.job_orders(assigned_mechanic_id);
create index if not exists service_queue_assigned_to_idx on public.service_queue(assigned_to);
create index if not exists dyno_sessions_technician_id_idx on public.dyno_sessions(technician_id);
create index if not exists stock_movements_product_id_idx on public.stock_movements(product_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists audit_logs_user_id_idx on public.audit_logs(user_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_motorcycles on public.motorcycles;
create trigger touch_motorcycles before update on public.motorcycles for each row execute function public.touch_updated_at();
drop trigger if exists touch_service_bookings on public.service_bookings;
create trigger touch_service_bookings before update on public.service_bookings for each row execute function public.touch_updated_at();
drop trigger if exists touch_job_orders on public.job_orders;
create trigger touch_job_orders before update on public.job_orders for each row execute function public.touch_updated_at();
drop trigger if exists touch_service_queue on public.service_queue;
create trigger touch_service_queue before update on public.service_queue for each row execute function public.touch_updated_at();
drop trigger if exists touch_dyno_sessions on public.dyno_sessions;
create trigger touch_dyno_sessions before update on public.dyno_sessions for each row execute function public.touch_updated_at();
drop trigger if exists touch_maintenance_schedules on public.maintenance_schedules;
create trigger touch_maintenance_schedules before update on public.maintenance_schedules for each row execute function public.touch_updated_at();
drop trigger if exists touch_suppliers on public.suppliers;
create trigger touch_suppliers before update on public.suppliers for each row execute function public.touch_updated_at();
drop trigger if exists touch_marketplace_listings on public.marketplace_listings;
create trigger touch_marketplace_listings before update on public.marketplace_listings for each row execute function public.touch_updated_at();

insert into public.inventory_categories (name, description) values
  ('Performance Parts','Power, driveline, suspension, and tuning parts'),
  ('Engine Components','Internal and external engine service parts'),
  ('Tires','Motorcycle tires and valve accessories'),
  ('Lubricants','Oils, coolants, fluids, and cleaners'),
  ('Accessories','Motorcycle accessories and convenience items'),
  ('Safety Gear','Rider safety equipment')
on conflict (name) do nothing;

create or replace function private.current_profile_role()
returns public.app_role
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where user_id = (select auth.uid()) limit 1
$$;

create or replace function private.current_profile_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select id from public.profiles where user_id = (select auth.uid()) limit 1
$$;

revoke all on function private.current_profile_role() from public;
revoke all on function private.current_profile_id() from public;
grant execute on function private.current_profile_role() to authenticated;
grant execute on function private.current_profile_id() to authenticated;

alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.motorcycles enable row level security;
alter table public.motorcycle_ownership_records enable row level security;
alter table public.service_bookings enable row level security;
alter table public.job_orders enable row level security;
alter table public.service_queue enable row level security;
alter table public.dyno_sessions enable row level security;
alter table public.dyno_results enable row level security;
alter table public.ecu_maps enable row level security;
alter table public.motorcycle_health_records enable row level security;
alter table public.maintenance_schedules enable row level security;
alter table public.inventory_categories enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;
alter table public.suppliers enable row level security;
alter table public.marketplace_listings enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated
using ((select auth.uid()) = user_id or (select private.current_profile_role()) in ('Administrator','Management'));
create policy "profiles_update_admin" on public.profiles for update to authenticated
using ((select private.current_profile_role()) = 'Administrator')
with check ((select private.current_profile_role()) = 'Administrator');

create policy "admin_manage_branches" on public.branches for all to authenticated
using ((select private.current_profile_role()) = 'Administrator')
with check ((select private.current_profile_role()) = 'Administrator');
create policy "staff_view_branches" on public.branches for select to authenticated
using ((select auth.uid()) is not null);

create policy "service_roles_manage_customers" on public.customers for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Service Advisor','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor'));

create policy "staff_view_motorcycles" on public.motorcycles for select to authenticated
using ((select auth.uid()) is not null);
create policy "service_roles_manage_motorcycles" on public.motorcycles for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Service Advisor','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor'));

create policy "service_roles_manage_bookings" on public.service_bookings for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Service Advisor','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor'));

create policy "job_orders_staff_view" on public.job_orders for select to authenticated
using (
  (select private.current_profile_role()) in ('Administrator','Service Advisor','Management')
  or assigned_mechanic_id = (select private.current_profile_id())
);
create policy "job_orders_service_create" on public.job_orders for insert to authenticated
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor'));
create policy "job_orders_progress_update" on public.job_orders for update to authenticated
using (
  (select private.current_profile_role()) in ('Administrator','Service Advisor')
  or assigned_mechanic_id = (select private.current_profile_id())
)
with check (
  (select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic')
);

create policy "queue_staff_view" on public.service_queue for select to authenticated
using ((select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic','Management'));
create policy "queue_service_update" on public.service_queue for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic'))
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic'));

create policy "dyno_staff_manage_sessions" on public.dyno_sessions for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Dyno Technician','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Dyno Technician'));
create policy "dyno_staff_manage_results" on public.dyno_results for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Dyno Technician','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Dyno Technician'));
create policy "dyno_staff_manage_ecu" on public.ecu_maps for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Dyno Technician','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Dyno Technician'));

create policy "staff_view_health" on public.motorcycle_health_records for select to authenticated
using ((select auth.uid()) is not null);
create policy "tech_manage_health" on public.motorcycle_health_records for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic','Dyno Technician'))
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic','Dyno Technician'));

create policy "staff_view_maintenance" on public.maintenance_schedules for select to authenticated
using ((select auth.uid()) is not null);
create policy "service_manage_maintenance" on public.maintenance_schedules for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic'))
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic'));

create policy "inventory_manage_categories" on public.inventory_categories for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Inventory Personnel','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Inventory Personnel'));
create policy "inventory_manage_products" on public.products for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Inventory Personnel','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Inventory Personnel'));
create policy "inventory_manage_stock" on public.stock_movements for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Inventory Personnel','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Inventory Personnel'));
create policy "inventory_manage_suppliers" on public.suppliers for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Inventory Personnel','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Inventory Personnel'));

create policy "marketplace_manage_listings" on public.marketplace_listings for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Inventory Personnel','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Inventory Personnel'));

create policy "notifications_own_or_management" on public.notifications for select to authenticated
using (user_id = (select private.current_profile_id()) or (select private.current_profile_role()) in ('Administrator','Management'));
create policy "notifications_manage" on public.notifications for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Service Advisor','Management'))
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor','Management'));

create policy "audit_management_read" on public.audit_logs for select to authenticated
using ((select private.current_profile_role()) in ('Administrator','Management'));
create policy "audit_admin_insert" on public.audit_logs for insert to authenticated
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic','Dyno Technician','Inventory Personnel','Management'));

create policy "ownership_staff_view" on public.motorcycle_ownership_records for select to authenticated
using ((select auth.uid()) is not null);
create policy "ownership_service_manage" on public.motorcycle_ownership_records for all to authenticated
using ((select private.current_profile_role()) in ('Administrator','Service Advisor'))
with check ((select private.current_profile_role()) in ('Administrator','Service Advisor'));

insert into storage.buckets (id, name, public) values
  ('dyno-graphs','dyno-graphs', false),
  ('dyno-reports','dyno-reports', false),
  ('session-videos','session-videos', false),
  ('ecu-backups','ecu-backups', false),
  ('service-attachments','service-attachments', false),
  ('marketplace-photos','marketplace-photos', false)
on conflict (id) do nothing;

create policy "engineRus_storage_read" on storage.objects for select to authenticated
using (bucket_id in ('dyno-graphs','dyno-reports','session-videos','ecu-backups','service-attachments','marketplace-photos'));
create policy "engineRus_storage_insert" on storage.objects for insert to authenticated
with check (
  bucket_id in ('dyno-graphs','dyno-reports','session-videos','ecu-backups','service-attachments','marketplace-photos')
  and (select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic','Dyno Technician','Inventory Personnel')
);
create policy "engineRus_storage_update" on storage.objects for update to authenticated
using (
  bucket_id in ('dyno-graphs','dyno-reports','session-videos','ecu-backups','service-attachments','marketplace-photos')
  and (select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic','Dyno Technician','Inventory Personnel')
)
with check (
  bucket_id in ('dyno-graphs','dyno-reports','session-videos','ecu-backups','service-attachments','marketplace-photos')
  and (select private.current_profile_role()) in ('Administrator','Service Advisor','Mechanic','Dyno Technician','Inventory Personnel')
);
