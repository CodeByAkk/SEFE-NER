-- =====================================================================
-- NER-SAFE 002_rls.sql — Row Level Security. Run AFTER 001 parts.
-- Role is ALWAYS read from public.profiles (server side), never trusted
-- from client input. Helper functions are SECURITY DEFINER with
-- fixed search_path to avoid hijack.
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.districts enable row level security;
alter table public.incidents enable row level security;
alter table public.field_reports enable row level security;
alter table public.alerts enable row level security;
alter table public.citizen_reports enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.my_district()
returns text language sql stable security definer set search_path = public as $$
  select district from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and is_active);
$$;

-- ---------------- profiles ----------------
drop policy if exists p_profiles_self_read on public.profiles;
create policy p_profiles_self_read on public.profiles
for select using (auth.uid() = id or public.is_admin());

drop policy if exists p_profiles_self_update on public.profiles;
create policy p_profiles_self_update on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (
  -- non-admins may not change their own role/state/district/active flag
  public.is_admin() or (
    role = (select role from public.profiles where id = auth.uid())
    and is_active = (select is_active from public.profiles where id = auth.uid())
  )
);

drop policy if exists p_profiles_admin_all on public.profiles;
create policy p_profiles_admin_all on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

-- ---------------- districts (read: all authenticated; write: admin) ----------------
drop policy if exists p_districts_read on public.districts;
create policy p_districts_read on public.districts
for select to authenticated using (true);

drop policy if exists p_districts_admin on public.districts;
create policy p_districts_admin on public.districts
for all using (public.is_admin()) with check (public.is_admin());
