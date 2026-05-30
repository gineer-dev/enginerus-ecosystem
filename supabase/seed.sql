insert into public.roles (name, description) values
  ('customer', 'Marketplace customer'),
  ('sales_staff', 'Sales and lead operations'),
  ('inventory_manager', 'Inventory and product media operations'),
  ('maintenance_staff', 'Inspection and maintenance operations'),
  ('finance_staff', 'Finance, payments, and reporting'),
  ('administrator', 'Full system access')
on conflict (name) do nothing;

insert into public.permissions (key, description) values
  ('marketplace:read', 'Browse marketplace'),
  ('favorites:write', 'Save favorites'),
  ('inquiries:write', 'Create inquiries'),
  ('reservations:write', 'Create reservations'),
  ('leads:manage', 'Manage leads and customers'),
  ('inventory:manage', 'Manage products and inventory'),
  ('maintenance:manage', 'Manage inspections and work orders'),
  ('finance:manage', 'Manage payments and expenses'),
  ('reports:read', 'View reports'),
  ('users:manage', 'Manage users and roles'),
  ('settings:manage', 'Manage platform settings'),
  ('audit:read', 'View audit trail')
on conflict (key) do nothing;

insert into public.branches (name, address, contact_number) values
  ('North EDSA', 'Quezon City, Philippines', '+63 2 8000 1001'),
  ('Makati Central', 'Makati City, Philippines', '+63 2 8000 1002'),
  ('Cebu', 'Cebu City, Philippines', '+63 32 800 1003')
on conflict do nothing;

insert into public.categories (name, slug) values
  ('Vehicles', 'vehicles'),
  ('Motorcycles', 'motorcycles'),
  ('Real Estate', 'real-estate'),
  ('Electronics', 'electronics'),
  ('Furniture', 'furniture'),
  ('Appliances', 'appliances'),
  ('Machinery', 'machinery'),
  ('Equipment', 'equipment')
on conflict (slug) do nothing;

insert into public.customers (customer_id, full_name, contact_number, email, address, customer_type, notes)
values
  ('CUS-0001', 'Rafa Santos', '+63 917 000 1001', 'rafa@example.com', 'Quezon City', 'Retail', 'Interested in vehicles'),
  ('CUS-0002', 'Mika Reyes', '+63 917 000 1002', 'mika@example.com', 'Makati', 'Dealer', 'Prefers real estate'),
  ('CUS-0003', 'Northline Trading', '+63 917 000 1003', 'ops@northline.test', 'Cebu City', 'Corporate', 'Bulk electronics buyer')
on conflict (customer_id) do nothing;
