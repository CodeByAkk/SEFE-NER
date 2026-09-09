import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import { RiskBadge, fmtDate } from '../components/ui';
import type { AlertItem, AuditLog } from '../types';

export function AuditPage() {
  const [rows, setRows] = useState<AuditLog[]>([]);
  useEffect(() => {
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setRows((data as AuditLog[]) || []));
  }, []);
  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <h2>System audit logs</h2>
      <div className="card"><div className="table-wrap"><table className="tbl">
        <thead><tr><th>Time</th><th>Action</th><th>Entity</th><th>User</th><th>Details</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id}><td className="small">{fmtDate(r.created_at)}</td>
            <td><span className="badge b-neutral">{r.action}</span></td>
            <td className="small">{r.entity_type}</td>
            <td className="small muted">{r.user_id?.slice(0, 8) || '-'}</td>
            <td className="small muted">{JSON.stringify(r.details || {})}</td></tr>
        ))}</tbody>
      </table></div></div>
    </div>
  );
}

export function AlertsAdmin() {
  const { notify } = useAuth();
  const [rows, setRows] = useState<AlertItem[]>([]);
  const [f, setF] = useState({ title: '', message: '', severity: 'high', target_district: 'East Khasi Hills' });
  async function load() {
    const { data } = await supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(50);
    setRows((data as AlertItem[]) || []);
  }
  useEffect(() => { load(); }, []);
  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('alerts').insert({
      title: f.title, message: f.message, severity: f.severity,
      target_district: f.target_district, is_active: true,
      expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
    });
    if (error) notify(error.message, 'err');
    else { notify('Alert published', 'ok'); setF({ ...f, title: '', message: '' }); load(); }
  }
  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <h2>Alerts</h2>
      <div className="grid two">
        <div className="card"><h3>Create alert</h3>
          <form onSubmit={create}>
            <div className="field"><label>Title</label><input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="CRITICAL LANDSLIDE RISK" /></div>
            <div className="field"><label>Message</label><textarea className="textarea" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
            <div className="field"><label>Severity</label>
              <select className="select" value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })}>
                <option>low</option><option>moderate</option><option>high</option><option>critical</option>
              </select></div>
            <div className="field"><label>Target district</label><input className="input" value={f.target_district} onChange={(e) => setF({ ...f, target_district: e.target.value })} /></div>
            <button className="btn btn-primary">Publish alert</button>
          </form>
        </div>
        <div className="card"><h3>Recent alerts</h3>
          {rows.map((a) => (<div key={a.id} className="card" style={{ marginBottom: 8 }}>
            <div className="row-between"><b>{a.title}</b><RiskBadge level={a.severity} /></div>
            <div className="small muted">{a.target_district} · {fmtDate(a.created_at)}</div>
          </div>))}
        </div>
      </div>
    </div>
  );
}
