import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import { Empty, RiskBadge, StatusBadge, fmtDate } from '../components/ui';
import type { CitizenReport, Incident, Profile } from '../types';

export function useAdminStats() {
  const [stats, setStats] = useState({ users: 0, incidents: 0, high: 0, alerts: 0, districts: 0, officers: 0 });
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  useEffect(() => {
    (async () => {
      const [u, i, a, d] = await Promise.all([
        supabase.from('profiles').select('id,role', { count: 'exact' }),
        supabase.from('incidents').select('*').order('created_at', { ascending: false }).limit(8),
        supabase.from('alerts').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('districts').select('id', { count: 'exact' })
      ]);
      const list = (i.data as Incident[]) || [];
      setIncidents(list);
      setStats({
        users: u.count || 0, incidents: list.length,
        high: list.filter((x) => x.risk_level === 'high' || x.risk_level === 'critical').length,
        alerts: a.count || 0, districts: d.count || 0,
        officers: (u.data || []).filter((x: Partial<Profile>) => x.role === 'field_officer' || x.role === 'district_officer').length
      });
      const { data: rep } = await supabase.from('citizen_reports').select('*').order('created_at', { ascending: false }).limit(6);
      setReports((rep as CitizenReport[]) || []);
    })();
  }, []);
  return { stats, incidents, reports };
}

export function AdminDash() {
  const { profile, notify } = useAuth();
  const { stats, incidents, reports } = useAdminStats();
  const cards = [
    { l: 'Total users', v: stats.users }, { l: 'Total incidents', v: stats.incidents },
    { l: 'High-risk incidents', v: stats.high }, { l: 'Critical alerts', v: stats.alerts },
    { l: 'Active districts', v: stats.districts }, { l: 'Field officers', v: stats.officers }
  ];
  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <h2>Admin Dashboard</h2>
      <p className="muted">Welcome, {profile?.full_name} · full system access.</p>
      <div className="grid kpi">
        {cards.map((c) => (<div key={c.l} className="card"><div className="kpi-label">{c.l}</div><div className="kpi-num">{c.v}</div></div>))}
      </div>
      <div className="grid two" style={{ marginTop: 16 }}>
        <div className="card"><h3>Recent incidents</h3>
          {incidents.length === 0 && <Empty title="No incidents yet" hint="Seed demo data or wait for citizen reports." />}
          {incidents.map((i) => (
            <div key={i.id} className="card" style={{ marginBottom: 8 }}>
              <div className="row-between"><b>{i.title}</b><RiskBadge level={i.risk_level} /></div>
              <div className="small muted"><StatusBadge status={i.status} /> · {i.location_name} · AI {i.ai_probability ?? '-'}% · {fmtDate(i.created_at)}</div>
            </div>
          ))}
        </div>
        <div className="card"><h3>Recent citizen reports</h3>
          {reports.length === 0 && <Empty title="No citizen reports" />}
          {reports.map((r) => (
            <div key={r.id} className="card" style={{ marginBottom: 8 }}>
              <div className="small">{r.description}</div>
              <div className="small muted"><StatusBadge status={r.status} /> · {fmtDate(r.created_at)}</div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={() => notify('Audit export queued (demo).', 'ok')}>Export activity (demo)</button>
        </div>
      </div>
    </div>
  );
}
