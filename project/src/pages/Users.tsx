import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import type { Profile } from '../types';

export function UsersPage() {
  const { notify } = useAuth();
  const [rows, setRows] = useState<Profile[]>([]);
  const [busy, setBusy] = useState('');
  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(200);
    setRows((data as Profile[]) || []);
  }
  useEffect(() => { load(); }, []);
  async function setActive(id: string, active: boolean) {
    setBusy(id);
    try {
      const { error } = await supabase.from('profiles').update({ is_active: active }).eq('id', id);
      if (error) throw error;
      await supabase.from('audit_logs').insert({ action: active ? 'account_enabled' : 'account_disabled', entity_type: 'profile', entity_id: id, details: {} });
      notify(active ? 'Account enabled' : 'Account disabled', 'ok');
      await load();
    } catch (e) { notify(e instanceof Error ? e.message : 'Update failed', 'err'); }
    finally { setBusy(''); }
  }
  return (
    <div className="shell" style={{ paddingTop: 26, paddingBottom: 30 }}>
      <h2>User management</h2>
      <p className="muted">Public signup is citizen-only. Officers are created below by admins.</p>
      <div className="card"><div className="table-wrap"><table className="tbl">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>District</th><th>Active</th><th>Action</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id}>
            <td>{r.full_name}</td><td className="muted">{r.email}</td>
            <td><span className="badge b-info">{r.role}</span></td>
            <td>{r.district || '-'}</td><td>{r.is_active ? 'Yes' : 'No'}</td>
            <td><button className="btn btn-ghost btn-sm" disabled={busy === r.id} onClick={() => setActive(r.id, !r.is_active)}>
              {busy === r.id ? 'Saving...' : r.is_active ? 'Disable' : 'Enable'}</button></td>
          </tr>
        ))}</tbody>
      </table></div></div>
      <CreateOfficer onDone={load} />
    </div>
  );
}

function CreateOfficer({ onDone }: { onDone: () => void }) {
  const { notify } = useAuth();
  const [f, setF] = useState({ name: 'Rahul Sharma', email: 'rahul@example.com', role: 'field_officer', state: 'Meghalaya', district: 'East Khasi Hills', pw: '' });
  const [busy, setBusy] = useState(false);
  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (f.pw.length < 8) { notify('Set a temporary password of at least 8 characters.', 'err'); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: f.email.trim(), password: f.pw,
        options: { data: { full_name: f.name, role: 'citizen', state: f.state, district: f.district } }
      });
      if (error) throw error;
      const uid = data.user?.id;
      if (!uid) throw new Error('Officer signup did not return a user.');
      const { error: upErr } = await supabase.from('profiles').update({
        full_name: f.name, role: f.role, state: f.state, district: f.district, is_active: true
      }).eq('id', uid);
      if (upErr) throw new Error('Auth user created, but role assignment was blocked by RLS. Assign role in Supabase dashboard (profiles table).');
      await supabase.from('audit_logs').insert({ action: 'officer_created', entity_type: 'profile', entity_id: uid, details: { role: f.role, district: f.district } });
      notify('Officer account created. They can now log in.', 'ok');
      onDone();
    } catch (e) { notify(e instanceof Error ? e.message : 'Creation failed', 'err'); }
    finally { setBusy(false); }
  }
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3>Create officer account</h3>
      <p className="sub">Admin assigns role + state + district. Officer logs in with email + password.</p>
      <form onSubmit={create}>
        <div className="grid three">
          <div className="field"><label>Name</label><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="field"><label>Email</label><input className="input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div className="field"><label>Temp password</label><input className="input" type="password" value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} /></div>
        </div>
        <div className="grid three">
          <div className="field"><label>Role</label>
            <select className="select" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
              <option value="field_officer">field_officer</option>
              <option value="district_officer">district_officer</option>
            </select></div>
          <div className="field"><label>State</label><input className="input" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })} /></div>
          <div className="field"><label>District</label><input className="input" value={f.district} onChange={(e) => setF({ ...f, district: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} disabled={busy}>{busy ? 'Creating...' : 'Create officer'}</button>
      </form>
    </div>
  );
}
