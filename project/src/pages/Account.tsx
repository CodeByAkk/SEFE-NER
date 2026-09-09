import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { friendlyAuthError, useAuth } from '../auth/AuthContext';

export function ProfilePage() {
  const { user, profile, refreshProfile, notify } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [file, setFile] = useState<File | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setMsg('');
    if (!user) return;
    setBusy(true);
    try {
      let avatar_url = profile?.avatar_url || null;
      if (file) {
        const path = `${user.id}/avatar-${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from('evidence').upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('evidence').getPublicUrl(path);
        avatar_url = data.publicUrl;
      }
      const { error } = await supabase.from('profiles').update({ full_name: name.trim(), phone: phone.trim() || null, avatar_url }).eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      setMsg('Profile updated.');
      notify('Profile updated', 'ok');
    } catch (ex) { setErr(friendlyAuthError(ex instanceof Error ? ex.message : String(ex))); }
    finally { setBusy(false); }
  }

  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <div className="card" style={{ maxWidth: 620 }}>
        <h3>My Profile</h3>
        <p className="sub">{profile?.email} · <span className="badge b-info">{profile?.role}</span></p>
        {err && <div className="alert err">{err}</div>}
        {msg && <div className="alert ok">{msg}</div>}
        <form onSubmit={save}>
          <div className="field"><label>Full name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field"><label>Phone</label><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="field"><label>State / District (managed by admin)</label>
            <input className="input" disabled value={`${profile?.state || ''} / ${profile?.district || ''}`} /></div>
          <div className="field"><label>Avatar image</label><input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
        </form>
      </div>
    </div>
  );
}

export function ChangePwPage() {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setMsg('');
    if (pw.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (pw !== pw2) { setErr('Passwords do not match.'); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      setMsg('Password changed successfully.'); setPw(''); setPw2('');
    } catch (ex) { setErr(friendlyAuthError(ex instanceof Error ? ex.message : String(ex))); }
    finally { setBusy(false); }
  }
  return (
    <div className="auth-wrap"><div className="card auth-card">
      <h3>Change Password</h3>
      <p className="sub">Passwords are managed securely by Supabase Auth.</p>
      {err && <div className="alert err">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}
      <form onSubmit={save}>
        <div className="field"><label>New password</label><input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
        <div className="field"><label>Confirm new password</label><input className="input" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Updating...' : 'Update password'}</button>
      </form>
    </div></div>
  );
}
