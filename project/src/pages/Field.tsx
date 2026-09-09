import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import { Empty, RiskBadge, StatusBadge, fmtDate } from '../components/ui';
import type { FieldReport, Incident } from '../types';

export function FieldDash() {
  const { user, notify } = useAuth();
  const [rows, setRows] = useState<Incident[]>([]);
  const [sel, setSel] = useState('');
  const [frep, setFrep] = useState<FieldReport[]>([]);
  const [form, setForm] = useState({ obs: '', risk: 'moderate', weather: '', ground: '', rec: '' });
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!user) return;
    const { data } = await supabase.from('incidents').select('*').eq('assigned_field_officer', user.id).order('created_at', { ascending: false });
    const list = (data as Incident[]) || [];
    setRows(list);
    if (!sel && list.length) setSel(list[0].id);
  }
  useEffect(() => { load(); }, [user?.id]);
  useEffect(() => {
    if (!sel) return;
    supabase.from('field_reports').select('*').eq('incident_id', sel).order('created_at', { ascending: false })
      .then(({ data }) => setFrep((data as FieldReport[]) || []));
  }, [sel]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sel || !user) return;
    if (form.obs.trim().length < 10) { notify('Describe observations (min 10 chars).', 'err'); return; }
    setBusy(true);
    try {
      const { error } = await supabase.from('field_reports').insert({
        incident_id: sel, field_officer_id: user.id, observations: form.obs,
        risk_assessment: form.risk, weather_conditions: form.weather,
        ground_conditions: form.ground, recommendation: form.rec
      });
      if (error) throw error;
      await supabase.from('incidents').update({ status: 'verified', verified: true, verified_by: user.id }).eq('id', sel);
      await supabase.from('audit_logs').insert({ action: 'incident_verified', entity_type: 'incident', entity_id: sel, details: { risk: form.risk } });
      notify('Verification report submitted', 'ok');
      setForm({ obs: '', risk: 'moderate', weather: '', ground: '', rec: '' });
    } catch (e) { notify(e instanceof Error ? e.message : 'Submit failed', 'err'); }
    finally { setBusy(false); }
  }

  const cur = rows.find((r) => r.id === sel);
  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <h2>Field Officer Dashboard</h2>
      <p className="muted">Assigned incidents and verification reports.</p>
      <div className="grid kpi">
        <div className="card"><div className="kpi-label">Assigned</div><div className="kpi-num">{rows.length}</div></div>
        <div className="card"><div className="kpi-label">Pending</div><div className="kpi-num">{rows.filter((r) => r.status !== 'verified' && r.status !== 'resolved').length}</div></div>
        <div className="card"><div className="kpi-label">Current risk</div><div className="kpi-num"><RiskBadge level={cur?.risk_level} /></div></div>
        <div className="card"><div className="kpi-label">Status</div><div className="kpi-num"><StatusBadge status={cur?.status} /></div></div>
      </div>
      <div className="grid two" style={{ marginTop: 16 }}>
        <div className="card"><h3>Assigned incidents</h3>
          {rows.length === 0 && <Empty title="No assigned incidents" hint="District officers assign verification tasks here." />}
          {rows.map((r) => (
            <button key={r.id} onClick={() => setSel(r.id)} className="demo-btn" style={{ width: '100%', marginBottom: 8, borderStyle: sel === r.id ? 'solid' : 'dashed' }}>
              <div className="row-between"><b>{r.title}</b><RiskBadge level={r.risk_level} /></div>
              <div className="small muted">{r.location_name}</div>
            </button>
          ))}
        </div>
        <div className="card"><h3>Verification report</h3>
          {!cur && <p className="muted">Select an incident.</p>}
          {cur && (
            <form onSubmit={submit}>
              <div className="alert info">AI Risk Estimate: <b>{cur.ai_probability ?? '-'}%</b>. AI-assisted prediction — verify on site.</div>
              <div className="field"><label>Observations</label><textarea className="textarea" value={form.obs} onChange={(e) => setForm({ ...form, obs: e.target.value })} /></div>
              <div className="field"><label>Risk assessment</label>
                <select className="select" value={form.risk} onChange={(e) => setForm({ ...form, risk: e.target.value })}>
                  <option>low</option><option>moderate</option><option>high</option><option>critical</option>
                </select></div>
              <div className="field"><label>Weather</label><input className="input" value={form.weather} onChange={(e) => setForm({ ...form, weather: e.target.value })} /></div>
              <div className="field"><label>Ground</label><input className="input" value={form.ground} onChange={(e) => setForm({ ...form, ground: e.target.value })} /></div>
              <div className="field"><label>Recommendation</label><textarea className="textarea" value={form.rec} onChange={(e) => setForm({ ...form, rec: e.target.value })} /></div>
              <button className="btn btn-primary" disabled={busy}>{busy ? 'Submitting...' : 'Submit report'}</button>
            </form>
          )}
          {frep.map((r) => (<div key={r.id} className="card" style={{ marginTop: 8 }}><div className="small">{r.observations}</div><div className="small muted">{fmtDate(r.created_at)}</div></div>))}
        </div>
      </div>
    </div>
  );
}
