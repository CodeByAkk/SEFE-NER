-- =====================================================================
-- NER-SAFE 003_seed_demo.sql (OPTIONAL DEMO DATA — clearly marked).
-- Run AFTER schema + RLS, while logged in as the admin user, OR replace
-- the auth.users()-dependent parts. Districts/alerts insert directly;
-- profiles/incidents need real auth user ids — see README.
-- Safe part (no auth dependency): districts + public demo alerts.
-- =====================================================================

insert into public.districts (name, state) values
  ('East Khasi Hills','Meghalaya'),
  ('Dima Hasao','Assam'),
  ('Aizawl','Mizoram'),
  ('Kohima','Nagaland'),
  ('Gangtok','Sikkim'),
  ('Imphal West','Manipur'),
  ('Tawang','Arunachal Pradesh'),
  ('West Tripura','Tripura')
on conflict (name, state) do nothing;

-- Demo alerts (clearly marked DEMO in title/message)
insert into public.alerts (title, message, severity, target_district, is_active, expires_at)
values
  ('[DEMO] CRITICAL LANDSLIDE RISK — East Khasi Hills',
   'DEMO DATA: AI Risk Estimate 87%. Status: Field Verification Required. AI-assisted prediction — verify by authorized personnel.',
   'critical','East Khasi Hills', true, now() + interval '2 days'),
  ('[DEMO] HIGH RAINFALL ADVISORY — Dima Hasao',
   'DEMO DATA: Heavy overnight rainfall. Monitoring; avoid unstable slopes.',
   'high','Dima Hasao', true, now() + interval '2 days')
on conflict do nothing;
