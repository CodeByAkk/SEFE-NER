import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, ROLE_HOME } from '../auth/AuthContext';
import type { Role } from '../types';

export function ProtectedRoute({ allow }: { allow: Role[] }) {
  const { user, profile, role, loading, configured } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="page-spin"><span className="spin big" /><p>Loading dashboard...</p></div>;
  if (!configured) return <Navigate to="/setup" replace />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  // Profile still resolving (e.g. RLS-blocked or trigger lag): wait briefly, then guide.
  if (!profile || !role) return <div className="page-spin"><span className="spin big" /><p>Loading your profile...</p></div>;
  if (profile.is_active === false) {
    return (
      <div className="auth-wrap"><div className="card auth-card">
        <h3>Account disabled</h3>
        <p className="muted">Your account has been disabled. Please contact the administrator.</p>
        <a className="btn btn-ghost" href="/login">Back to login</a>
      </div></div>
    );
  }
  if (!allow.includes(role)) {
    return (
      <div className="auth-wrap"><div className="card auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 44 }}>⛔</div>
        <h3>Access denied</h3>
        <p className="muted">You don&apos;t have permission to access this page.</p>
        <a className="btn btn-primary" href={ROLE_HOME[role]}>Go to my dashboard</a>
      </div></div>
    );
  }
  return <Outlet />;
}

export function PublicOnly() {
  const { user, role, loading, configured } = useAuth();
  if (loading) return <div className="page-spin"><span className="spin big" /></div>;
  if (user && role && configured) return <Navigate to={ROLE_HOME[role]} replace />;
  return <Outlet />;
}
