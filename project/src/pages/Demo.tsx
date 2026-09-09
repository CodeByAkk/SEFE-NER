import { Link, useParams } from 'react-router-dom';
import { DEMO_ALERTS, DEMO_INCIDENTS } from '../lib/demo';
import { DEMO_MODE } from '../components/TopBar';
import { RiskBadge } from '../components/ui';

export function DemoRolePage() {
  const { role } = useParams();
  if (!DEMO_MODE) {
    return (
      <div className="auth-wrap"><div className="card auth-card" style={{ textAlign: 'center' }}>
        <h3>Demo access disabled</h3>
        <p className="muted">This deployment runs with production authentication only.</p>
        <Link className="btn btn-primary" to="/login">Go to Login</Link>
      </div></div>
    );
  }
  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <span className="badge b-info">demo data · read-only preview</span>
      <h2 style={{ textTransform: 'capitalize' }}>{(role || 'demo').replace('_', ' ')} demo dashboard</h2>
      <p className="muted">This preview uses mock data and grants no real access. <Link to="/login">Login with a real account</Link> for live data.</p>
      <div className="grid two" style={{ marginTop: 14 }}>
        <div className="card"><h3>Demo alerts</h3>
          {DEMO_ALERTS.map((a) => (
            <div key={a.id} className="card" style={{ marginBottom: 8 }}>
              <RiskBadge level={a.id === 'a1' ? 'critical' : 'high'} />
              <div style={{ fontWeight: 800, marginTop: 6 }}>{a.title}</div>
              <div className="small muted">{a.district} · AI {a.prob}% · {a.updated}</div>
            </div>
          ))}
        </div>
        <div className="card"><h3>Demo incidents</h3>
          {DEMO_INCIDENTS.map((i) => (
            <div key={i.id} className="card" style={{ marginBottom: 8 }}>
              <div className="row-between"><b>{i.title}</b><RiskBadge level={i.risk} /></div>
              <div className="small muted">{i.district} · demo data</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
