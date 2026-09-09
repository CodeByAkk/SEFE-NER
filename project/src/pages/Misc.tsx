import { Link } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export function SetupPage() {
  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <div className="card" style={{ maxWidth: 780 }}>
        <h2>Connect Supabase</h2>
        <p className="sub">Status: {isSupabaseConfigured ? 'configured ✓' : 'not configured yet'}</p>
        <ol className="small" style={{ lineHeight: 1.8 }}>
          <li>Create a project at <b>supabase.com</b> → copy <b>Project URL</b> and <b>anon public key</b>.</li>
          <li>Copy <code>project/.env.example</code> to <code>project/.env</code> and fill <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>. Never put the service-role key in the frontend.</li>
          <li>Supabase SQL Editor → run <code>supabase/migrations/001_schema.sql</code>, then <code>002_rls.sql</code>, then optionally <code>003_seed_demo.sql</code>.</li>
          <li>Auth → Providers → enable Email. For Google OAuth add Client ID/Secret and redirect URL <code>https://&lt;ref&gt;.supabase.co/auth/v1/callback</code>.</li>
          <li>Create the first admin via SQL (see <code>supabase/README_SUPABASE_SETUP.md</code>).</li>
          <li>Run <code>npm install; npm run dev</code> inside <code>project/</code>.</li>
        </ol>
        <Link className="btn btn-primary" style={{ width: 'auto' }} to="/login">Go to Login</Link>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="auth-wrap"><div className="card auth-card" style={{ textAlign: 'center' }}>
      <h2>Page not found</h2>
      <p className="muted">The page you requested does not exist.</p>
      <Link className="btn btn-primary" to="/">Go home</Link>
    </div></div>
  );
}
