alter function public.touch_updated_at() set search_path = public, pg_temp;
alter function public.is_admin() set search_path = public, auth, pg_temp;
alter function public.has_branch_access(uuid) set search_path = public, auth, pg_temp;
alter function public.handle_new_enginerus_user() set search_path = public, auth, pg_temp;

revoke execute on function public.handle_new_enginerus_user() from public, anon, authenticated;

create index if not exists customers_branch_id_idx on public.customers(branch_id);
create index if not exists customers_profile_id_idx on public.customers(profile_id);
create index if not exists motorcycles_customer_id_fk_idx on public.motorcycles(customer_id);
create index if not exists motorcycle_ownership_records_motorcycle_id_idx on public.motorcycle_ownership_records(motorcycle_id);
create index if not exists motorcycle_ownership_records_owner_id_idx on public.motorcycle_ownership_records(owner_id);
create index if not exists service_bookings_motorcycle_id_idx on public.service_bookings(motorcycle_id);
create index if not exists service_bookings_created_by_idx on public.service_bookings(created_by);
create index if not exists job_orders_booking_id_idx on public.job_orders(booking_id);
create index if not exists job_orders_customer_id_fk_idx on public.job_orders(customer_id);
create index if not exists job_orders_motorcycle_id_fk_idx on public.job_orders(motorcycle_id);
create index if not exists service_queue_job_order_id_idx on public.service_queue(job_order_id);
create index if not exists dyno_sessions_motorcycle_id_fk_idx on public.dyno_sessions(motorcycle_id);
create index if not exists dyno_sessions_customer_id_fk_idx on public.dyno_sessions(customer_id);
create index if not exists dyno_results_dyno_session_id_idx on public.dyno_results(dyno_session_id);
create index if not exists ecu_maps_dyno_session_id_idx on public.ecu_maps(dyno_session_id);
create index if not exists ecu_maps_motorcycle_id_idx on public.ecu_maps(motorcycle_id);
create index if not exists motorcycle_health_records_motorcycle_id_idx on public.motorcycle_health_records(motorcycle_id);
create index if not exists motorcycle_health_records_technician_id_idx on public.motorcycle_health_records(technician_id);
create index if not exists maintenance_schedules_motorcycle_id_idx on public.maintenance_schedules(motorcycle_id);
create index if not exists marketplace_listings_product_id_idx on public.marketplace_listings(product_id);
create index if not exists stock_movements_created_by_idx on public.stock_movements(created_by);
