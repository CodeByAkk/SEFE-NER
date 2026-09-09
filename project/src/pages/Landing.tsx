import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Mountain, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DEMO_ALERTS, DEMO_INCIDENTS } from '../lib/demo';
import { Empty, RiskBadge, StatusBadge, fmtDate } from '../components/ui';
import type { AlertItem, Incident } from '../types';

function usePublicAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.from('alerts').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { if (data && data.length) setAlerts(data as AlertItem[]); });
  }, []);
  return alerts;
}

export function LandingPage() {
  const { user, role } = useAuth();
  const live = usePublicAlerts();
  const dash = role === 'admin' ? '/admin' : role === 'district_officer' ? '/district-officer' : role === 'field_officer' ? '/field-officer' : role === 'citizen' ? '/citizen' : '/login';
  return (
    <div className="shell" style={{ paddingBottom: 10 }}>
      <div className="hero">
        <span className="badge b-info">North Eastern India · Disaster Management</span>
        <h2>NER-SAFE <span className="grad">Landslide Early Warning</span></h2>
        <p>AI-assisted landslide risk monitoring, citizen reporting, field verification and emergency alerts — with secure role-based access for Admins, District Officers, Field Officers and Citizens.</p>
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: 20 }}>
          {!user ? (<><Link className="btn btn-primary" style={{ width: 'auto' }} to="/login">Login with Email</Link><Link className="btn btn-ghost" to="/signup">Create Account</Link></>)
            : (<Link className="btn btn-primary" style={{ width: 'auto' }} to={dash}>Go to my dashboard</Link>)}
        </div>
      </div>
      <div className="grid three" style={{ marginTop: 26 }}>
        <div className="card"><div className="kpi-icon"><Mountain size={20} /></div><h3>Report a landslide</h3><p className="sub">Citizens submit geo-tagged reports with photos. AI risk estimate attached — always verified by officers.</p></div>
        <div className="card"><div className="kpi-icon"><ShieldCheck size={20} /></div><h3>Verify in the field</h3><p className="sub">Field officers submit verification reports; district officers coordinate response and alerts.</p></div>
        <div className="card"><div className="kpi-icon"><AlertTriangle size={20} /></div><h3>Critical alerts</h3><p className="sub">Severity-graded public warnings with district targeting and expiry.</p></div>
      </div>
      <div className="grid two" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="row-between"><h3>Active public alerts</h3><span className="small muted">demo + live</span></div>
          <p className="sub">CRITICAL alerts are shown prominently with AI risk estimate.</p>
          {live.map((a) => (
            <div key={a.id} className="card" style={{ marginBottom: 10, borderColor: '#ef444466' }}>
              <RiskBadge level={a.severity} />
              <h3 style={{ marginTop: 8 }}>{a.title}</h3>
              <p className="small muted">{a.message}</p>
              <p className="small">District: <b>{a.target_district || '—'}</b> · Updated: {fmtDate(a.created_at)}</p>
            </div>
          ))}
          {DEMO_ALERTS.map((a) => (
            <div key={a.id} className="card" style={{ marginBottom: 10, borderColor: a.id === 'a1' ? '#ef444466' : undefined }}>
              <span className="badge b-neutral">demo data</span>{' '}
              <RiskBadge level={a.id === 'a1' ? 'critical' : 'high'} />
              <h3 style={{ marginTop: 8 }}>{a.title}</h3>
              <p className="small">District: <b>{a.district}</b></p>
              <p className="small muted">AI Risk Estimate: {a.prob}% · Status: {a.status} · Last Updated: {a.updated}</p>
              <p className="small muted">AI-assisted prediction. Final assessment should be verified by authorized personnel.</p>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="row-between"><h3>Recent incidents</h3><Users size={18} /></div>
          <p className="sub">Illustrative demo data. Live incidents appear after Supabase is connected.</p>
          <LiveIncidents />
          {DEMO_INCIDENTS.map((i) => (
            <div key={i.id} className="card" style={{ marginBottom: 10 }}>
              <div className="row-between"><b>{i.title}</b><RiskBadge level={i.risk} /></div>
              <p className="small muted">{i.district} · AI {i.prob}% · <StatusBadge status={i.status} /> · {i.updated} · demo data</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveIncidents() {
  const [rows, setRows] = useState<Incident[]>([]);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.from('incidents').select('*').order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setRows(data as Incident[]); });
  }, []);
  if (!rows.length) return <Empty title="No live incidents yet" hint="Connect Supabase and submit a citizen report to see data here." />;
  return (
    <div style={{ marginBottom: 10 }}>
      {rows.map((r) => (
        <div key={r.id} className="card" style={{ marginBottom: 8 }}>
          <div className="row-between"><b>{r.title}</b><RiskBadge level={r.risk_level} /></div>
          <p className="small muted">{r.location_name} · AI {r.ai_probability ?? '—'}% · <StatusBadge status={r.status} /></p>
        </div>
      ))}
    </div>
  );
}
