import { useAuth } from '../auth/AuthContext';

export function Toasts() {
  const { toasts } = useAuth();
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind === 'ok' ? 'ok' : t.kind === 'err' ? 'err' : ''}`}>{t.text}</div>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <div className="shell"><div className="footer">
      NER-SAFE · AI-assisted prediction. Final assessment should be verified by authorized personnel. · North Eastern India
    </div></div>
  );
}

export function RiskBadge({ level }: { level: string | null | undefined }) {
  const l = (level || 'low').toLowerCase();
  const cls = l === 'critical' ? 'b-critical' : l === 'high' ? 'b-high' : l === 'moderate' ? 'b-moderate' : l === 'low' ? 'b-low' : 'b-neutral';
  return <span className={`badge ${cls}`}>{level || '—'}</span>;
}

export function StatusBadge({ status }: { status: string | null | undefined }) {
  return <span className="badge b-neutral">{(status || '—').replace(/_/g, ' ')}</span>;
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 28 }}>
      <div style={{ fontSize: 34 }}>🗂️</div>
      <h3 style={{ marginTop: 8 }}>{title}</h3>
      {hint && <p className="sub">{hint}</p>}
    </div>
  );
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }); }
  catch { return iso; }
}
