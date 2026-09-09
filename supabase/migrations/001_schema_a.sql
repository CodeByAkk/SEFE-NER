-- =====================================================================
-- NER-SAFE 001_schema.sql — core tables, constraints, indexes, triggers
-- Run FIRST in Supabase SQL Editor.
-- =====================================================================

-- ---------- helpers ----------
create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role text not null default 'citizen'
    check (role in ('admin','district_officer','field_officer','citizen')),
  state text,
  district text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_district_idx on public.profiles(district);
create index if not exists profiles_email_idx on public.profiles(email);

-- ---------- districts ----------
create table if not exists public.districts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null,
  created_at timestamptz not null default now(),
  unique (name, state)
);

-- ---------- incidents ----------
create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  reported_by uuid references public.profiles(id) on delete set null,
  assigned_field_officer uuid references public.profiles(id) on delete set null,
  district_officer_id uuid references public.profiles(id) on delete set null,
  title text,
  description text,
  latitude numeric,
  longitude numeric,
  location_name text,
  risk_level text check (risk_level in ('low','moderate','high','critical')),
  status text not null default 'reported'
    check (status in ('reported','under_review','field_verification','verified','resolved','false_alarm')),
  ai_probability numeric check (ai_probability is null or (ai_probability >= 0 and ai_probability <= 100)),
  verified boolean not null default false,
  verified_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists incidents_status_idx on public.incidents(status);
create index if not exists incidents_risk_idx on public.incidents(risk_level);
create index if not exists incidents_location_idx on public.incidents(location_name);
create index if not exists incidents_assigned_idx on public.incidents(assigned_field_officer);
