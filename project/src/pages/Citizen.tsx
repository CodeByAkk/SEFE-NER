import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import { RiskBadge, StatusBadge, fmtDate } from '../components/ui';
import { ReportModal } from './ReportModal';
import type { AlertItem, CitizenReport } from '../types';

export function CitizenDash() {
  const { user, profile, notify } = useAuth();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [mine, setMine] = useState<CitizenReport[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const { data: a } = await supabase.from('alerts').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(8);
    setAlerts((a as AlertItem[]) || []);
    if (user) {
      const { data: m } = await supabase.from('citizen_reports').select('*').eq('citizen_id', user.id).order('created_at', { ascending: false });
      setMine((m as CitizenReport[]) || []);
    }
  }
  useEffect(() => { load(); }, [user?.id]);

  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <div className="row-between">
        <div><h2>Citizen Dashboard</h2><p className="muted">Namaste, {profile?.full_name} · {profile?.district}</p></div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setOpen(true)}>Report Landslide</button>
      </div>
      <div className="grid two" style={{ marginTop: 14 }}>
        <div className="card"><h3>Active warnings</h3>
          {alerts.length === 0 && <p className="muted">No active alerts right now.</p>}
          {alerts.map((a) => (
            <div key={a.id} className="card" style={{ marginBottom: 8 }}>
              <RiskBadge level={a.severity} />
              <div style={{ fontWeight: 800, marginTop: 6 }}>{a.title}</div>
              <div className="small muted">{a.message}</div>
              <div className="small muted">{a.target_district} · {fmtDate(a.created_at)}</div>
            </div>
          ))}
          <div className="alert warn">Emergency: dial 112 (India). Move away from cracks or subsiding ground.</div>
        </div>
        <div className="card"><h3>My reports</h3>
          {mine.length === 0 && <p className="muted">No reports yet — use “Report Landslide”.</p>}
          {mine.map((r) => (
            <div key={r.id} className="card" style={{ marginBottom: 8 }}>
              <div className="small">{r.description}</div>
              {r.image_url && (<a className="small" href={r.image_url} target="_blank" rel="noreferrer">View evidence photo</a>)}
              <div className="small muted"><StatusBadge status={r.status} /> · {fmtDate(r.created_at)}</div>
            </div>
          ))}
        </div>
      </div>
      {open && user && (
        <ReportModal uid={user.id} district={profile?.district || ''} notify={notify}
          onClose={() => setOpen(false)} onDone={() => { setOpen(false); load(); }} />
      )}
    </div>
  );
}
