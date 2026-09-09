import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import { Empty, RiskBadge, StatusBadge, fmtDate } from '../components/ui';
import type { CitizenReport, Incident, Profile } from '../types';

export function DistrictDash() {
  const { profile, notify } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [officers, setOfficers] = useState<Profile[]>([]);
  const [assign, setAssign] = useState<Record<string, string>>({});

  async function load() {
    if (!profile?.district) return;
    const { data: all } = await supabase.from('incidents').select('*').order('created_at', { ascending: false }).limit(60);
    const list = ((all as Incident[]) || []).filter((x) => !profile.district || (x.location_name || '').includes(profile.district.split(' ')[0]));
    setIncidents(list);
    const { data: fo } = await supabase.from('profiles').select('*').eq('role', 'field_officer').eq('district', profile.district);
    setOfficers((fo as Profile[]) || []);
    const { data: rep } = await supabase.from('citizen_reports').select('*').order('created_at', { ascending: false }).limit(20);
    setReports((rep as CitizenReport[]) || []);
  }
  useEffect(() => { load(); }, [profile?.district]);

  async function assignOfficer(incidentId: string) {
    const oid = assign[incidentId];
    if (!oid) { notify('Select a field officer first.', 'err'); return; }
    const { error } = await supabase.from('incidents').update({ assigned_field_officer: oid, status: 'field_verification' }).eq('id', incidentId);
    if (error) notify(error.message, 'err');
    else {
      await supabase.from('audit_logs').insert({ action: 'incident_assigned', entity_type: 'incident', entity_id: incidentId, details: { officer: oid } });
      notify('Field officer assigned', 'ok'); load();
    }
  }

  const pending = incidents.filter((i) => i.status === 'reported' || i.status === 'under_review').length;
  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <h2>District Dashboard — {profile?.district}</h2>
      <p className="muted">Only your district data is visible to this role.</p>
      <div className="grid kpi">
        <div className="card"><div className="kpi-label">Active incidents</div><div className="kpi-num">{incidents.length}</div></div>
        <div className="card"><div className="kpi-label">Pending verification</div><div className="kpi-num">{pending}</div></div>
        <div className="card"><div className="kpi-label">Field officers</div><div className="kpi-num">{officers.length}</div></div>
        <div className="card"><div className="kpi-label">Citizen reports</div><div className="kpi-num">{reports.length}</div></div>
      </div>
      <div className="grid two" style={{ marginTop: 16 }}>
        <div className="card"><h3>Incidents · assign field verification</h3>
          {incidents.length === 0 && <Empty title="No district incidents" />}
          {incidents.map((i) => (
            <div key={i.id} className="card" style={{ marginBottom: 8 }}>
              <div className="row-between"><b>{i.title}</b><RiskBadge level={i.risk_level} /></div>
              <div className="small muted"><StatusBadge status={i.status} /> · AI {i.ai_probability ?? '-'}% · {fmtDate(i.created_at)}</div>
              <div className="btn-row" style={{ marginTop: 8 }}>
                <select className="select" style={{ maxWidth: 240 }} value={assign[i.id] || ''} onChange={(e) => setAssign({ ...assign, [i.id]: e.target.value })}>
                  <option value="">Select field officer</option>
                  {officers.map((o) => <option key={o.id} value={o.id}>{o.full_name}</option>)}
                </select>
                <button className="btn btn-ghost btn-sm" onClick={() => assignOfficer(i.id)}>Assign</button>
              </div>
            </div>
          ))}
        </div>
        <div className="card"><h3>Recent citizen reports</h3>
          {reports.map((r) => (
            <div key={r.id} className="card" style={{ marginBottom: 8 }}>
              <div className="small">{r.description}</div>
              <div className="small muted">{fmtDate(r.created_at)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
