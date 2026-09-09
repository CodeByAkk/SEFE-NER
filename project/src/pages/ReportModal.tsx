import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { aiEstimateDemo } from '../lib/demo';

export function ReportModal({ uid, district, onClose, onDone, notify }: {
  uid: string; district: string; onClose: () => void; onDone: () => void;
  notify: (t: string, k?: 'ok' | 'err' | 'info') => void;
}) {
  const [loc, setLoc] = useState('');
  const [desc, setDesc] = useState('');
  const [sev, setSev] = useState('moderate');
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (desc.trim().length < 10) { notify('Please describe what you observed (min 10 chars).', 'err'); return; }
    if (!loc.trim()) { notify('Please enter the location.', 'err'); return; }
    setBusy(true);
    try {
      let image_url: string | null = null;
      if (photo) {
        const path = `${uid}/${Date.now()}-${photo.name}`;
        const { error } = await supabase.storage.from('evidence').upload(path, photo);
        if (error) throw new Error('Photo upload failed: ' + error.message);
        image_url = supabase.storage.from('evidence').getPublicUrl(path).data.publicUrl;
      }
      const est = aiEstimateDemo(sev, !!photo);
      const { data: inc, error: e1 } = await supabase.from('incidents').insert({
        reported_by: uid, title: `Citizen report: ${loc}`.slice(0, 120),
        description: desc, location_name: district || loc,
        risk_level: est.risk, status: 'reported', ai_probability: est.prob, verified: false
      }).select('id').single();
      if (e1) throw e1;
      const iid = (inc as { id: string }).id;
      const { error: e2 } = await supabase.from('citizen_reports').insert({
        citizen_id: uid, incident_id: iid, description: desc, image_url, status: 'submitted'
      });
      if (e2) throw e2;
      await supabase.from('audit_logs').insert({ action: 'citizen_report_submitted', entity_type: 'incident', entity_id: iid, details: { ai: est.prob } });
      notify(`Report submitted. AI Risk Estimate: ${est.prob}% (${est.risk}).`, 'ok');
      onDone();
    } catch (e) { notify(e instanceof Error ? e.message : 'Submit failed', 'err'); }
    finally { setBusy(false); }
  }

  return (
    <div className="modal-bg" onClick={() => !busy && onClose()}>
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <h3>Report Landslide</h3>
        <p className="sub">Report goes to the database, gets an AI risk estimate, then district + field verification.</p>
        <form onSubmit={submit}>
          <div className="field"><label>Location</label><input className="input" value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Village / road / landmark" /></div>
          <div className="field"><label>Description</label><textarea className="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div className="field"><label>Severity</label>
            <select className="select" value={sev} onChange={(e) => setSev(e.target.value)}>
              <option value="minor">minor</option><option value="moderate">moderate</option><option value="severe">severe</option>
            </select></div>
          <div className="field"><label>Photo</label><input className="input" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} /></div>
          <div className="btn-row">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
            <button className="btn btn-primary" style={{ width: 'auto' }} disabled={busy}>{busy ? (<><span className="spin" /> Submitting...</>) : 'Submit report'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
