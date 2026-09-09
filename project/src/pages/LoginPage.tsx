import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mountain } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { friendlyAuthError, useAuth, ROLE_HOME } from '../auth/AuthContext';
import { validEmail, DEMO_MODE } from '../components/TopBar';

export function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const { notify } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [gBusy, setGBusy] = useState(false);

  async function afterAuth(userId: string) {
    const { data: prof, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error || !prof) throw new Error('Unable to load your profile. Please try again.');
    if (prof.is_active === false) { await supabase.auth.signOut(); throw new Error('Your account has been disabled. Please contact the administrator.'); }
    try { await supabase.from('audit_logs').insert({ user_id: userId, action: 'login', entity_type: 'session', entity_id: null, details: {} }); } catch { /* noop */ }
    const dest = loc.state?.from && loc.state.from !== '/login' ? loc.state.from : ROLE_HOME[prof.role as keyof typeof ROLE_HOME];
    nav(dest || '/citizen', { replace: true });
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    if (!validEmail(email)) { setErr('Please enter a valid email address.'); return; }
    if (!pw) { setErr('Please enter your password.'); return; }
    if (!isSupabaseConfigured) { setErr('Supabase is not configured yet. Open /setup for instructions.'); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
      if (error) throw error;
      await afterAuth(data.user!.id);
      notify('Welcome back!', 'ok');
    } catch (ex) { setErr(friendlyAuthError(ex instanceof Error ? ex.message : String(ex))); }
    finally { setBusy(false); }
  }

  async function onGoogle() {
    setErr('');
    if (!isSupabaseConfigured) { setErr('Supabase is not configured yet. Open /setup.'); return; }
    setGBusy(true);
    try {
      const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${appUrl}/citizen` } });
      if (error) throw error;
    } catch (ex) { setErr(friendlyAuthError(ex instanceof Error ? ex.message : String(ex))); setGBusy(false); }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="auth-head">
          <div className="brand-badge"><Mountain size={28} /></div>
          <h2>Welcome to NER-SAFE</h2>
          <p>AI-Powered Landslide Early Warning &amp; Emergency Response</p>
        </div>
        {!isSupabaseConfigured && <div className="alert warn">Supabase is not connected yet. See <Link to="/setup">setup</Link>.</div>}
        {err && <div className="alert err">{err}</div>}
        <form onSubmit={onLogin}>
          <div className="field"><label>Email</label>
            <input className="input" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field"><label>Password</label>
            <div className="pw-wrap">
              <input className="input" style={{ paddingRight: 44 }} type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="........" value={pw} onChange={(e) => setPw(e.target.value)} />
              <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
          </div>
          <button className="btn btn-primary" disabled={busy}>{busy ? (<><span className="spin" /> Signing in...</>) : 'Login'}</button>
        </form>
        <div className="row-between" style={{ marginTop: 12 }}>
          <Link to="/forgot-password" className="small">Forgot Password?</Link>
          <Link to="/signup" className="small">Create Account</Link>
        </div>
        <div className="divider">OR</div>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onGoogle} disabled={gBusy}>
          {gBusy ? (<><span className="spin" /> Connecting...</>) : 'G  Continue with Google'}
        </button>
        {DEMO_MODE && (
          <>
            <div className="divider">DEMO ACCESS</div>
            <div className="demo-grid">
              {(['admin', 'district_officer', 'field_officer', 'citizen'] as const).map((r) => (
                <button key={r} className="demo-btn" onClick={() => nav(`/demo/${r}`)}>
                  <div style={{ fontWeight: 800, textTransform: 'capitalize' }}>{r.replace('_', ' ')} Demo</div>
                  <div className="small muted">Preview dashboard</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
