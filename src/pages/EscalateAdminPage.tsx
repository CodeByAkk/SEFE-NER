import { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Send,
  History,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardHeader, Modal } from '@/components/ui';
import { demoEscalations, riskZones, locations, incidentReports } from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import { filterByDistrict, isDistrictOfficer } from '@/context/AppContext';
import type { RiskZone, Location, IncidentReport } from '@/types';

export function EscalateAdminPage() {
  const { user, showToast } = useApp();
  const districtEscalations = filterByDistrict(demoEscalations, user);
  const districtZones = filterByDistrict(riskZones, user);
  const districtLocations = filterByDistrict(locations, user);
  const districtIncidents = filterByDistrict(incidentReports, user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [escalateType, setEscalateType] = useState<'zone' | 'incident'>('zone');
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');

  const criticalZones = districtZones.filter((z) => z.risk === 'CRITICAL');

  const handleEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !targetId) {
      showToast('Please select target and provide a reason', 'error');
      return;
    }
    showToast('Issue escalated to Admin successfully.', 'success');
    setIsModalOpen(false);
    setReason('');
    setTargetId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> Admin Escalation Portal
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            Escalate Critical Issues to State Admin
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Flag critical zones and incidents requiring higher-level intervention
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all self-start md:self-auto"
        >
          <AlertTriangle className="w-4 h-4" /> Escalate Issue
        </button>
      </div>

      {/* Quick Escalation Panel for Critical Zones */}
      <Card className="p-4">
        <CardHeader
          title="Critical Zones Requiring Escalation"
          subtitle="One-click escalation for high-priority issues"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {criticalZones.map((zone) => {
            const loc = districtLocations.find((l) => l.id === zone.locationId);
            return (
              <div key={zone.locationId} className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-navy-100 text-sm">{loc?.name || zone.locationId}</h4>
                  <span className="text-xs font-bold text-red-400">Score: {zone.score}/100</span>
                </div>
                <button
                  onClick={() => {
                    setEscalateType('zone');
                    setTargetId(zone.locationId);
                    setReason(`Critical risk score of ${zone.score}/100 — requires state-level intervention`);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-1.5 px-3 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <ArrowUpRight className="w-3 h-3" /> Escalate to Admin
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Escalation History */}
      <Card className="p-0">
        <CardHeader
          title="Escalation History"
          subtitle="Previously escalated items and Admin responses"
          icon={<History className="w-5 h-5" />}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-800/80 text-navy-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50 text-navy-200">
              {districtEscalations.map((esc) => (
                <tr key={esc.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-blue-400">{esc.id}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      esc.type === 'zone' ? 'bg-purple-500/20 text-purple-300' : 'bg-orange-500/20 text-orange-300'
                    }`}>
                      {esc.type === 'zone' ? 'Risk Zone' : 'Incident'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{esc.targetName}</td>
                  <td className="py-3 px-4 text-navy-400 max-w-xs truncate">{esc.reason}</td>
                  <td className="py-3 px-4 text-navy-500">{new Date(esc.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      esc.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                      esc.status === 'Reviewed' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                    {esc.status}
                  </span>
                  </td>
                  <td className="py-3 px-4 text-navy-300">{esc.adminResponse || 'Awaiting review'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Escalation Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Escalate to Admin">
        <form onSubmit={handleEscalate} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Escalation Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEscalateType('zone')}
                className={`flex-1 py-2 rounded-lg border text-center font-semibold ${
                  escalateType === 'zone' ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' : 'bg-navy-900 text-navy-400 border-navy-700'
                }`}
              >
                Risk Zone
              </button>
              <button
                type="button"
                onClick={() => setEscalateType('incident')}
                className={`flex-1 py-2 rounded-lg border text-center font-semibold ${
                  escalateType === 'incident' ? 'bg-orange-600/20 text-orange-300 border-orange-500/30' : 'bg-navy-900 text-navy-400 border-navy-700'
                }`}
              >
                Incident Report
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">
              {escalateType === 'zone' ? 'Select Risk Zone' : 'Select Incident'}
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
              required
            >
              <option value="">Select...</option>
              {escalateType === 'zone'
                ? criticalZones.map((zone) => {
                    const loc = districtLocations.find((l) => l.id === zone.locationId);
                    return (
                      <option key={zone.locationId} value={zone.locationId}>
                        {loc?.name || zone.locationId} — Score: {zone.score}
                      </option>
                    );
                  })
                : districtIncidents.map((inc) => (
                    <option key={inc.id} value={inc.id}>
                      {inc.type} — {inc.locationName} — {inc.severity}
                    </option>
                  ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Reason for Escalation</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why this requires state-level intervention..."
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-navy-800 text-navy-300 hover:bg-navy-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-500/20"
            >
              <Send className="w-3.5 h-3.5" /> Escalate to Admin
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
