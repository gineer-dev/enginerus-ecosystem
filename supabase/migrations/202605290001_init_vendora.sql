create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  contact_number text,
  avatar_url text,
  default_branch_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  branch_id uuid,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  contact_number text,
  manager_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.profiles add constraint profiles_default_branch_id_fkey foreign key (default_branch_id) references public.branches(id);
alter table public.user_roles add constraint user_roles_branch_id_fkey foreign key (branch_id) references public.branches(id);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id),
  name text not null,
  slug text not null unique,
  description text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  product_id text generated always as ('PRD-' || upper(substr(id::text, 1, 8))) stored,
  sku text not null unique,
  name text not null,
  category_id uuid references public.categories(id),
  brand text,
  model text,
  serial_number text,
  description text,
  supplier text,
  acquisition_date date,
  acquisition_cost numeric(14,2) not null default 0,
  cost_price numeric(14,2) not null default 0,
  markup numeric(8,2) not null default 0,
  selling_price numeric(14,2) not null default 0,
  quantity integer not null default 1 check (quantity >= 0),
  available_quantity integer not null default 1 check (available_quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  location text,
  branch_id uuid references public.branches(id),
  status text not null default 'Draft' check (status in ('Draft','Inspection','Maintenance','Ready','Reserved','Sold','Archived')),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.product_conditions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  condition_type text not null check (condition_type in ('Operational','Maintenance','Cosmetic','Component Status','Compliance')),
  condition_name text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  bucket text not null default 'vendora-media',
  path text not null,
  media_type text not null check (media_type in ('image','video')),
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.product_documents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  bucket text not null default 'vendora-media',
  path text not null,
  document_type text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null unique,
  profile_id uuid references public.profiles(id),
  full_name text not null,
  contact_number text,
  email text,
  address text,
  customer_type text,
  notes text,
  branch_id uuid references public.branches(id),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id),
  customer_id uuid references public.customers(id),
  full_name text,
  email text,
  contact_number text,
  message text not null,
  status text not null default 'New',
  branch_id uuid references public.branches(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table public.inspection_templates (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.inspection_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.inspection_templates(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  required boolean not null default true
);

create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id),
  inspector_id uuid references public.profiles(id),
  template_id uuid references public.inspection_templates(id),
  checklist jsonb not null default '[]'::jsonb,
  result text not null check (result in ('Passed','Conditional','Failed')),
  notes text,
  photos jsonb not null default '[]'::jsonb,
  inspection_date date not null default current_date,
  branch_id uuid references public.branches(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.maintenance_work_orders (
  id uuid primary key default gen_random_uuid(),
  work_order_number text not null unique,
  product_id uuid not null references public.products(id),
  assigned_staff_id uuid references public.profiles(id),
  maintenance_type text not null,
  description text,
  cost numeric(14,2) not null default 0,
  status text not null default 'Pending' check (status in ('Pending','In Progress','Completed','Cancelled')),
  start_date date,
  completion_date date,
  notes text,
  attachments jsonb not null default '[]'::jsonb,
  branch_id uuid references public.branches(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_number text not null unique default ('RSV-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(gen_random_uuid()::text, 1, 6))),
  product_id uuid not null references public.products(id),
  customer_id uuid references public.customers(id),
  reservation_fee numeric(14,2) not null default 0,
  expiry_date timestamptz,
  status text not null default 'Pending' check (status in ('Pending','Confirmed','Expired','Cancelled','Converted To Sale')),
  notes text,
  branch_id uuid references public.branches(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.sales_orders (
  id uuid primary key default gen_random_uuid(),
  so_number text not null unique,
  customer_id uuid references public.customers(id),
  payment_status text not null default 'Unpaid',
  order_status text not null default 'Draft' check (order_status in ('Draft','Confirmed','Paid','Delivered','Completed')),
  subtotal numeric(14,2) not null default 0,
  discount numeric(14,2) not null default 0,
  tax numeric(14,2) not null default 0,
  total_amount numeric(14,2) not null default 0,
  branch_id uuid references public.branches(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.sales_order_items (
  id uuid primary key default gen_random_uuid(),
  sales_order_id uuid not null references public.sales_orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null default 1,
  price numeric(14,2) not null default 0,
  discount numeric(14,2) not null default 0,
  tax numeric(14,2) not null default 0,
  total_amount numeric(14,2) not null default 0
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Maintenance','Marketing','Salaries','Utilities','Logistics','Other')),
  product_id uuid references public.products(id),
  branch_id uuid references public.branches(id),
  amount numeric(14,2) not null,
  description text,
  expense_date date not null default current_date,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  sales_order_id uuid references public.sales_orders(id),
  reservation_id uuid references public.reservations(id),
  amount numeric(14,2) not null,
  payment_method text,
  payment_status text not null default 'Pending',
  paid_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  event_type text not null,
  title text not null,
  body text,
  channel text not null default 'in_app',
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_value jsonb,
  new_value jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security invoker
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = (select auth.uid())
      and r.name = 'administrator'
  );
$$;

create or replace function public.has_branch_access(target_branch uuid)
returns boolean
language sql
security invoker
stable
as $$
  select target_branch is null
    or public.is_admin()
    or exists (
      select 1 from public.user_roles ur
      where ur.user_id = (select auth.uid())
        and ur.branch_id = target_branch
    );
$$;

create trigger touch_profiles before update on public.profiles for each row execute function public.touch_updated_at();
create trigger touch_branches before update on public.branches for each row execute function public.touch_updated_at();
create trigger touch_categories before update on public.categories for each row execute function public.touch_updated_at();
create trigger touch_products before update on public.products for each row execute function public.touch_updated_at();
create trigger touch_customers before update on public.customers for each row execute function public.touch_updated_at();
create trigger touch_inquiries before update on public.inquiries for each row execute function public.touch_updated_at();
create trigger touch_reservations before update on public.reservations for each row execute function public.touch_updated_at();
create trigger touch_sales_orders before update on public.sales_orders for each row execute function public.touch_updated_at();
create trigger touch_expenses before update on public.expenses for each row execute function public.touch_updated_at();

create index products_branch_status_idx on public.products (branch_id, status) where deleted_at is null;
create index products_category_idx on public.products (category_id) where deleted_at is null;
create index reservations_product_status_idx on public.reservations (product_id, status) where deleted_at is null;
create index inquiries_status_idx on public.inquiries (status) where deleted_at is null;
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.branches enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_conditions enable row level security;
alter table public.product_media enable row level security;
alter table public.product_documents enable row level security;
alter table public.customers enable row level security;
alter table public.inquiries enable row level security;
alter table public.favorites enable row level security;
alter table public.inspection_templates enable row level security;
alter table public.inspection_items enable row level security;
alter table public.inspections enable row level security;
alter table public.maintenance_work_orders enable row level security;
alter table public.reservations enable row level security;
alter table public.sales_orders enable row level security;
alter table public.sales_order_items enable row level security;
alter table public.expenses enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "public ready products" on public.products for select to anon, authenticated using (deleted_at is null and status in ('Ready','Reserved'));
create policy "staff manage products" on public.products for all to authenticated using (public.has_branch_access(branch_id)) with check (public.has_branch_access(branch_id));

create policy "categories readable" on public.categories for select to anon, authenticated using (deleted_at is null);
create policy "admins manage categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "own profile read" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_admin());
create policy "own profile update" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "roles admin read" on public.roles for select to authenticated using (public.is_admin());
create policy "permissions admin read" on public.permissions for select to authenticated using (public.is_admin());
create policy "user roles admin manage" on public.user_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "branches scoped read" on public.branches for select to authenticated using (public.has_branch_access(id));
create policy "branches admin manage" on public.branches for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "customers scoped" on public.customers for all to authenticated using (public.has_branch_access(branch_id)) with check (public.has_branch_access(branch_id));
create policy "inquiries insert public" on public.inquiries for insert to anon, authenticated with check (true);
create policy "inquiries scoped staff" on public.inquiries for select to authenticated using (public.has_branch_access(branch_id));
create policy "inquiries update staff" on public.inquiries for update to authenticated using (public.has_branch_access(branch_id)) with check (public.has_branch_access(branch_id));

create policy "favorites own" on public.favorites for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "reservations insert public" on public.reservations for insert to anon, authenticated with check (true);
create policy "reservations scoped staff" on public.reservations for select to authenticated using (public.has_branch_access(branch_id));
create policy "reservations update staff" on public.reservations for update to authenticated using (public.has_branch_access(branch_id)) with check (public.has_branch_access(branch_id));

create policy "media public read" on public.product_media for select to anon, authenticated using (deleted_at is null);
create policy "documents staff read" on public.product_documents for select to authenticated using (true);
create policy "product asset staff manage" on public.product_media for all to authenticated using (true) with check (true);
create policy "product document staff manage" on public.product_documents for all to authenticated using (true) with check (true);
create policy "conditions public read" on public.product_conditions for select to anon, authenticated using (true);
create policy "conditions staff manage" on public.product_conditions for all to authenticated using (true) with check (true);

create policy "inspection staff" on public.inspections for all to authenticated using (public.has_branch_access(branch_id)) with check (public.has_branch_access(branch_id));
create policy "inspection templates staff" on public.inspection_templates for all to authenticated using (true) with check (true);
create policy "inspection items staff" on public.inspection_items for all to authenticated using (true) with check (true);
create policy "work orders staff" on public.maintenance_work_orders for all to authenticated using (public.has_branch_access(branch_id)) with check (public.has_branch_access(branch_id));
create policy "sales scoped staff" on public.sales_orders for all to authenticated using (public.has_branch_access(branch_id)) with check (public.has_branch_access(branch_id));
create policy "sales items staff" on public.sales_order_items for all to authenticated using (true) with check (true);
create policy "expenses finance" on public.expenses for all to authenticated using (public.has_branch_access(branch_id)) with check (public.has_branch_access(branch_id));
create policy "payments finance" on public.payments for all to authenticated using (true) with check (true);
create policy "notifications own" on public.notifications for all to authenticated using (user_id = (select auth.uid()) or public.is_admin()) with check (user_id = (select auth.uid()) or public.is_admin());
create policy "audit admins" on public.audit_logs for select to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vendora-media',
  'vendora-media',
  false,
  26214400,
  array['image/png','image/jpeg','image/webp','video/mp4','application/pdf']
)
on conflict (id) do nothing;

create policy "authenticated upload media" on storage.objects for insert to authenticated with check (bucket_id = 'vendora-media');
create policy "authenticated read media" on storage.objects for select to authenticated using (bucket_id = 'vendora-media');
create policy "authenticated update media" on storage.objects for update to authenticated using (bucket_id = 'vendora-media') with check (bucket_id = 'vendora-media');
create policy "authenticated delete media" on storage.objects for delete to authenticated using (bucket_id = 'vendora-media');
