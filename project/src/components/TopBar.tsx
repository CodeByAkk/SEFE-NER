import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mountain } from 'lucide-react';
import { ROLE_HOME, useAuth } from '../auth/AuthContext';

export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE ?? 'true') !== 'false';
export function validEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

export function TopBar() {
  const { user, profile, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const initial = (profile?.full_name || profile?.email || 'U').trim().charAt(0).toUpperCase();
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand" style={{ color: '#fff' }}>
          <span className="brand-badge"><Mountain size={22} /></span>
          <span><h1>NER-SAFE</h1><small>AI Early Warning and Emergency Response</small></span>
        </Link>
        <nav className="nav-links">
          {role === 'admin' && (<><Link to="/admin">Admin</Link><Link to="/admin/users">Users</Link><Link to="/admin/audit">Audit</Link></>)}
          {role === 'district_officer' && <Link to="/district-officer">District</Link>}
          {role === 'field_officer' && <Link to="/field-officer">Field</Link>}
          {role === 'citizen' && <Link to="/citizen">Citizen</Link>}
        </nav>
        <div className="topbar-spacer" />
        {!user ? (
          <div className="btn-row">
            <Link className="btn btn-ghost btn-sm" to="/login">Login</Link>
            <Link className="btn btn-primary btn-sm" style={{ width: 'auto' }} to="/signup">Create Account</Link>
          </div>
        ) : (
          <div className="profile-menu">
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen((o) => !o)}>
              <span className="avatar" style={{ width: 26, height: 26, fontSize: 13 }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : initial}
              </span>
              <span>{profile?.full_name || 'Account'}</span>
            </button>
            {open && (
              <div className="menu" onMouseLeave={() => setOpen(false)}>
                <div style={{ padding: '8px 11px' }}>
                  <div style={{ fontWeight: 800 }}>{profile?.full_name}</div>
                  <div className="small muted">{profile?.email}</div>
                  <div className="small muted" style={{ marginTop: 4 }}>
                    <span className="badge b-info">{role}</span>
                    {profile?.district ? ` ${profile.district}` : ''}
                  </div>
                </div>
                <Link to={role ? ROLE_HOME[role] : '/'} onClick={() => setOpen(false)}>My Dashboard</Link>
                <Link to="/profile" onClick={() => setOpen(false)}>My Profile</Link>
                <Link to="/change-password" onClick={() => setOpen(false)}>Change Password</Link>
                <button onClick={async () => { await signOut(); setOpen(false); nav('/login', { replace: true }); }}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
