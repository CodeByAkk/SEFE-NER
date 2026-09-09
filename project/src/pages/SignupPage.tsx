import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mountain } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { friendlyAuthError } from '../auth/AuthContext';
import { validEmail } from '../components/TopBar';
import { NE_STATES, NE_DISTRICTS } from '../lib/demo';

export function SignupPage() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', pw: '', pw2: '', state: 'Meghalaya', district: 'East Khasi Hills', phone: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    if (f.name.trim().length < 2) { setErr('Please enter your full name.'); return; }
    if (!validEmail(f.email)) { setErr('Please enter a valid email address.'); return; }
    if (f.pw.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (f.pw !== f.pw2) { setErr('Passwords do not match.'); return; }
    if (!f.district) { setErr('Please select your district.'); return; }
    if (!isSupabaseConfigured) { setErr('Supabase is not configured yet. Open /setup.'); return; }
    setBusy(true);
    try {
      // SECURITY: role is ALWAYS citizen here; DB trigger + CHECK constraint enforce it.
      const { data, error } = await supabase.auth.signUp({
        email: f.email.trim(),
        password: f.pw,
        options: {
          data: { full_name: f.name.trim(), state: f.state, district: f.district, phone: f.phone.trim() || null, role: 'citizen' },
          emailRedirectTo: `${import.meta.env.VITE_APP_URL || window.location.origin}/login`
        }
      });
      if (error) throw error;
      if (!data.user) throw new Error('Signup failed. Please try again.');
      // Upsert profile (trigger normally creates it; this backfills metadata safely).
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id, full_name: f.name.trim(), email: f.email.trim().toLowerCase(),
          phone: f.phone.trim() || null, role: 'citizen', state: f.state, district: f.district, is_active: true
        }, { onConflict: 'id' });
      } catch { /* trigger covers this */ }
      nav('/verify-email', { state: { email: f.email.trim() }, replace: true });
    } catch (ex) { setErr(friendlyAuthError(ex instanceof Error ? ex.message : String(ex))); }
    finally { setBusy(false); }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card wide">
        <div className="auth-head">
          <div className="brand-badge"><Mountain size={28} /></div>
          <h2>Create citizen account</h2>
          <p>Public registration always creates a <b>citizen</b> account. Officer accounts are created by an admin.</p>
        </div>
        {err && <div className="alert err">{err}</div>}
        <form onSubmit={onSubmit}>
          <div className="grid two">
            <div className="field"><label>Full name</label><input className="input" value={f.name} onChange={set('name')} placeholder="Aiban Mawrie" /></div>
            <div className="field"><label>Phone (optional)</label><input className="input" value={f.phone} onChange={set('phone')} placeholder="+91 ..." /></div>
          </div>
          <div className="field"><label>Email</label><input className="input" type="email" value={f.email} onChange={set('email')} placeholder="you@example.com" /></div>
          <div className="grid two">
            <div className="field"><label>Password</label><input className="input" type="password" autoComplete="new-password" value={f.pw} onChange={set('pw')} placeholder="Min 8 characters" /></div>
            <div className="field"><label>Confirm password</label><input className="input" type="password" autoComplete="new-password" value={f.pw2} onChange={set('pw2')} /></div>
          </div>
          <div className="grid two">
            <div className="field"><label>State</label>
              <select className="select" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value, district: NE_DISTRICTS[e.target.value][0] })}>
                {NE_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field"><label>District</label>
              <select className="select" value={f.district} onChange={set('district')}>
                {(NE_DISTRICTS[f.state] || []).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" disabled={busy}>{busy ? (<><span className="spin" /> Creating account...</>) : 'Create Account'}</button>
        </form>
        <p className="small muted" style={{ marginTop: 12 }}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
