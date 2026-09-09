-- =====================================================================
-- NER-SAFE 001_schema (part B): field_reports, alerts, citizen_reports,
-- audit_logs, updated_at triggers, auto-profile trigger. Run AFTER part A.
-- =====================================================================

create table if not exists public.field_reports (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid references public.incidents(id) on delete cascade,
  field_officer_id uuid references public.profiles(id) on delete set null,
  observations text,
  risk_assessment text,
  weather_conditions text,
  ground_conditions text,
  recommendation text,
  created_at timestamptz not null default now()
);
create index if not exists field_reports_incident_idx on public.field_reports(incident_id);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid references public.incidents(id) on delete set null,
  title text,
  message text,
  severity text check (severity in ('low','moderate','high','critical')),
  target_district text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true
);
create index if not exists alerts_active_idx on public.alerts(is_active, created_at desc);
create index if not exists alerts_district_idx on public.alerts(target_district);

create table if not exists public.citizen_reports (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid references public.profiles(id) on delete cascade,
  incident_id uuid references public.incidents(id) on delete set null,
  description text,
  latitude numeric,
  longitude numeric,
  image_url text,
  video_url text,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);
create index if not exists citizen_reports_citizen_idx on public.citizen_reports(citizen_id);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text,
  entity_type text,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_action_idx on public.audit_logs(action, created_at desc);

-- ---------- updated_at ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();
drop trigger if exists trg_incidents_touch on public.incidents;
create trigger trg_incidents_touch before update on public.incidents
for each row execute function public.touch_updated_at();

-- ---------- auto-create profile on signup (role ALWAYS citizen) ----------
-- SECURITY: ignores any client-supplied role; public signups can never
-- escalate to admin/officer through this path.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, phone, role, state, district, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    'citizen',
    new.raw_user_meta_data->>'state',
    new.raw_user_meta_data->>'district',
    true
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    updated_at = now();
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
