import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mountain } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { friendlyAuthError } from '../auth/AuthContext';
import { validEmail } from '../components/TopBar';

export function ForgotPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function send(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setMsg('');
    if (!validEmail(email)) { setErr('Please enter a valid email address.'); return; }
    if (!isSupabaseConfigured) { setErr('Supabase is not configured yet.'); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${import.meta.env.VITE_APP_URL || window.location.origin}/change-password`
      });
      if (error) throw error;
      setMsg('Sending verification email... If the address exists, a reset link was sent.');
    } catch (ex) { setErr(friendlyAuthError(ex instanceof Error ? ex.message : String(ex))); }
    finally { setBusy(false); }
  }
  return (
    <div className="auth-wrap"><div className="card auth-card">
      <div className="auth-head"><div className="brand-badge"><Mountain size={28} /></div>
        <h2>Reset password</h2><p>We will email you a secure reset link.</p></div>
      {err && <div className="alert err">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}
      <form onSubmit={send}>
        <div className="field"><label>Email</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
        <button className="btn btn-primary" disabled={busy}>{busy ? (<><span className="spin" /> Sending...</>) : 'Send reset link'}</button>
      </form>
      <p className="small muted"><Link to="/login">Back to login</Link></p>
    </div></div>
  );
}

export function VerifyPage() {
  const loc = useLocation() as { state?: { email?: string } };
  return (
    <div className="auth-wrap"><div className="card auth-card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 46 }}>📧</div>
      <h2>Check your email</h2>
      <p className="muted">We sent a verification link to <b>{loc.state?.email || 'your email address'}</b>.
        Click the link, then log in to reach your Citizen Dashboard.</p>
      <div className="alert info">Email verification is required before login (when enabled in Supabase Auth settings).</div>
      <Link className="btn btn-primary" to="/login">Go to Login</Link>
    </div></div>
  );
}
