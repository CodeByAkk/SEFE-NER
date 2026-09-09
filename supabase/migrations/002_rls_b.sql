-- =====================================================================
-- NER-SAFE 002 RLS part B: incidents / field_reports / alerts /
-- citizen_reports / audit_logs. Run AFTER 002_rls_a.sql.
-- =====================================================================

-- ---------------- incidents ----------------
drop policy if exists p_inc_read on public.incidents;
create policy p_inc_read on public.incidents for select using (
  public.is_admin()
  or reported_by = auth.uid()
  or assigned_field_officer = auth.uid()
  or district_officer_id = auth.uid()
  or location_name = public.my_district()
);

drop policy if exists p_inc_insert on public.incidents;
create policy p_inc_insert on public.incidents for insert with check (
  reported_by = auth.uid()
  or public.is_admin()
  or public.my_role() in ('district_officer','field_officer')
);

drop policy if exists p_inc_update on public.incidents;
create policy p_inc_update on public.incidents for update using (
  public.is_admin()
  or assigned_field_officer = auth.uid()
  or district_officer_id = auth.uid()
  or (location_name = public.my_district() and public.my_role() = 'district_officer')
  or reported_by = auth.uid()
);

-- ---------------- field_reports ----------------
drop policy if exists p_fr_read on public.field_reports;
create policy p_fr_read on public.field_reports for select using (
  public.is_admin()
  or field_officer_id = auth.uid()
  or exists (select 1 from public.incidents i
      where i.id = field_reports.incident_id
      and (i.assigned_field_officer = auth.uid()
        or i.district_officer_id = auth.uid()
        or i.reported_by = auth.uid()
        or i.location_name = public.my_district()))
);

drop policy if exists p_fr_insert on public.field_reports;
create policy p_fr_insert on public.field_reports for insert with check (
  public.is_admin()
  or (field_officer_id = auth.uid() and public.my_role() in ('field_officer','district_officer','admin'))
);

-- ---------------- alerts ----------------
-- Citizens see active public alerts; officers/admins see all.
drop policy if exists p_alerts_read on public.alerts;
create policy p_alerts_read on public.alerts for select using (
  (is_active = true)
  or public.is_admin()
  or public.my_role() in ('district_officer','field_officer')
);

drop policy if exists p_alerts_write on public.alerts;
create policy p_alerts_write on public.alerts for insert with check (
  public.is_admin() or public.my_role() = 'district_officer'
);
drop policy if exists p_alerts_update on public.alerts;
create policy p_alerts_update on public.alerts for update using (
  public.is_admin() or public.my_role() = 'district_officer'
);

-- ---------------- citizen_reports ----------------
drop policy if exists p_cr_read on public.citizen_reports;
create policy p_cr_read on public.citizen_reports for select using (
  citizen_id = auth.uid()
  or public.is_admin()
  or (public.my_role() = 'district_officer')
  or exists (select 1 from public.incidents i
      where i.id = citizen_reports.incident_id
      and (i.assigned_field_officer = auth.uid() or i.district_officer_id = auth.uid()))
);

drop policy if exists p_cr_insert on public.citizen_reports;
create policy p_cr_insert on public.citizen_reports for insert with check (
  citizen_id = auth.uid()
);

drop policy if exists p_cr_update on public.citizen_reports;
create policy p_cr_update on public.citizen_reports for update using (
  public.is_admin()
  or (citizen_id = auth.uid())
);

-- ---------------- audit_logs (admin read + system inserts) ----------------
drop policy if exists p_audit_read on public.audit_logs;
create policy p_audit_read on public.audit_logs
for select using (public.is_admin());

drop policy if exists p_audit_insert on public.audit_logs;
create policy p_audit_insert on public.audit_logs
for insert with check (auth.uid() = user_id or public.is_admin());

-- ---------------- storage: evidence bucket ----------------
-- Create bucket + policies via dashboard or SQL (storage schema):
-- insert into storage.buckets (id, name, public) values ('evidence','evidence', true)
-- on conflict (id) do nothing;
--
-- Citizens upload to evidence/<their-uid>/* ; officers read district evidence.
-- Simplest secure-enough policy set (adjust prefix rules as needed):
--
-- create policy "evidence upload own folder" on storage.objects for insert to authenticated
--   with check (bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text);
-- create policy "evidence read own or officer" on storage.objects for select to authenticated
--   using (bucket_id = 'evidence' and (
--     (storage.foldername(name))[1] = auth.uid()::text
--     or public.is_admin()
--     or public.my_role() in ('district_officer','field_officer')));
