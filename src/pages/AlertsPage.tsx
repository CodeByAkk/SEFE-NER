import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Radio,
  CheckCircle2,
  Clock,
  PhoneCall,
  Send,
  Volume2,
  Filter,
  Search,
  Plus,
  Share2,
  Info,
} from 'lucide-react';
import { Card, CardHeader, KpiCard, Modal } from '@/components/ui';
import { AlertLevelBadge } from '@/components/ui/Badge';
import { alerts as initialAlerts, locations } from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import type { Alert, AlertLevel } from '@/types';

export function AlertsPage() {
  const { user, showToast } = useApp();
  const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // New alert form
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<AlertLevel>('CRITICAL');
  const [locationId, setLocationId] = useState(locations[0].id);
  const [impact, setImpact] = useState('');
  const [action, setAction] = useState('');

  const criticalCount = alertList.filter((a) => a.level === 'CRITICAL').length;
  const warningCount = alertList.filter((a) => a.level === 'WARNING').length;
  const unacknowledgedCount = alertList.filter((a) => !a.acknowledged).length;

  const filteredAlerts = alertList.filter((a) => {
    const matchesLevel = levelFilter === 'All' || a.level === levelFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.potentialImpact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleAcknowledge = (id: string) => {
    setAlertList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              acknowledged: true,
              assignedTeam: user?.name ? `Acknowledged by ${user.name}` : 'Acknowledged by Field Command',
            }
          : a
      )
    );
    showToast(`Alert #${id} acknowledged and logged in duty registry`, 'success');
  };

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !impact.trim()) {
      showToast('Please provide a title and impact description', 'error');
      return;
    }
    const loc = locations.find((l) => l.id === locationId) || locations[0];
    const newAlert: Alert = {
      id: 'alert-' + (alertList.length + 1),
      level,
      title,
      locationId: loc.id,
      locationName: `${loc.name} (${loc.district})`,
      probability: level === 'CRITICAL' ? 92 : level === 'WARNING' ? 82 : 65,
      expectedWindow: level === 'CRITICAL' ? 'Immediate / Next 2–4 hours' : 'Next 12–24 hours',
      cause: 'Heavy monsoon storm convergence detected by satellite radar',
      potentialImpact: impact,
      recommendedAction: action || 'Follow local administration evacuation orders immediately.',
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };
    setAlertList([newAlert, ...alertList]);
    setIsBroadcastModalOpen(false);
    setTitle('');
    setImpact('');
    setAction('');
    showToast('🚨 EMERGENCY WARNING BROADCAST! CAP-CP sirens & SMS dispatched.', 'warning');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
            <Volume2 className="w-4 h-4 animate-pulse" /> Emergency Early Warning Dispatch
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            Hazard Bulletins & Mass Public Alerts
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Common Alerting Protocol (CAP-CP) broadcast network delivering life-saving warnings to citizens, NDRF & district authorities
          </p>
        </div>

        <button
          onClick={() => setIsBroadcastModalOpen(true)}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Issue Early Warning Bulletin
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Critical Red Alerts"
          value={criticalCount}
          color="red"
          trend="Aizawl & Gangtok imminent"
          icon={<ShieldAlert className="w-6 h-6" />}
        />
        <KpiCard
          label="High Risk Warnings"
          value={warningCount}
          color="orange"
          trend="Kohima & Shillong Corridors"
          icon={<AlertTriangle className="w-6 h-6" />}
        />
        <KpiCard
          label="Unacknowledged"
          value={unacknowledgedCount}
          color="yellow"
          trend="Requires field officer sign-off"
          icon={<Clock className="w-6 h-6" />}
        />
        <KpiCard
          label="CAP Broadcast Mesh"
          value="100% Active"
          color="green"
          trend="SMS, Sirens & Radio operational"
          icon={<Radio className="w-6 h-6" />}
        />
      </div>

      {/* 2 Column Layout: Alerts Feed + Emergency Hotlines & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Alerts Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              {['All', 'CRITICAL', 'WARNING', 'WATCH', 'INFO'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    levelFilter === lvl
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
              <input
                type="text"
                placeholder="Search alert bulletins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-900 border border-navy-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-navy-100 placeholder-navy-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`p-4 space-y-3 border transition-all ${
                  alert.level === 'CRITICAL'
                    ? 'border-red-500/40 bg-red-950/10'
                    : alert.level === 'WARNING'
                    ? 'border-orange-500/40 bg-orange-950/10'
                    : 'border-navy-700/60 bg-navy-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertLevelBadge level={alert.level} />
                      <span className="text-xs text-navy-400 font-semibold">{alert.locationName}</span>
                    </div>
                    <h3 className="font-bold text-navy-100 text-base mt-1.5">{alert.title}</h3>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] text-navy-400 block flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-navy-500" />
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] text-amber-400 font-medium mt-0.5 block">
                      Threat Window: {alert.expectedWindow}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50">
                    <span className="text-[10px] text-navy-400 uppercase font-semibold block">
                      Hazard Trigger & Causes
                    </span>
                    <p className="text-navy-200 mt-0.5">{alert.cause}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50">
                    <span className="text-[10px] text-navy-400 uppercase font-semibold block">
                      Threatened Corridors & Settlements
                    </span>
                    <p className="text-navy-200 mt-0.5">{alert.potentialImpact}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30">
                    <span className="text-[10px] text-red-400 uppercase font-bold block flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Mandatory Safety Action Directive
                    </span>
                    <p className="text-navy-200 mt-0.5 font-medium">{alert.recommendedAction}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-navy-700/50 text-xs">
                  <div>
                    {alert.acknowledged ? (
                      <span className="text-green-400 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {alert.assignedTeam || 'Officer Verified & Acknowledged'}
                      </span>
                    ) : (
                      <span className="text-amber-400 text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Field Acknowledgement
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`${alert.title} - ${alert.potentialImpact}`);
                        showToast('Alert details copied to clipboard!', 'info');
                      }}
                      className="p-1.5 rounded bg-navy-800 hover:bg-navy-700 text-navy-300 border border-navy-700 transition-all"
                      title="Share alert"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
                      >
                        Acknowledge & Dispatch
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Col: Emergency Hotlines & Citizen Protocols */}
        <div className="space-y-4">
          {/* Emergency Hotlines */}
          <Card className="p-4 space-y-3 border-blue-500/30">
            <div className="flex items-center gap-2 pb-2 border-b border-navy-700/60">
              <PhoneCall className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-navy-100 text-sm">Emergency Disaster Hotlines</h3>
                <p className="text-[11px] text-navy-400">24x7 Direct Response Call Centers</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-100">NDRF Disaster Control</p>
                  <span className="text-[10px] text-navy-400">National Disaster Response Force</span>
                </div>
                <a
                  href="tel:1078"
                  className="px-3 py-1 rounded bg-red-600/20 text-red-300 border border-red-500/30 font-bold text-xs hover:bg-red-600/30 transition-colors"
                >
                  1078
                </a>
              </div>

              <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-100">State Disaster Management (SDMA)</p>
                  <span className="text-[10px] text-navy-400">North Eastern State Emergency Ops</span>
                </div>
                <a
                  href="tel:1070"
                  className="px-3 py-1 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold text-xs hover:bg-blue-600/30 transition-colors"
                >
                  1070
                </a>
              </div>

              <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-100">Ambulance & Trauma Lifeline</p>
                  <span className="text-[10px] text-navy-400">Emergency Medical Service</span>
                </div>
                <a
                  href="tel:108"
                  className="px-3 py-1 rounded bg-green-600/20 text-green-300 border border-green-500/30 font-bold text-xs hover:bg-green-600/30 transition-colors"
                >
                  108
                </a>
              </div>

              <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-100">National Emergency Integrated</p>
                  <span className="text-[10px] text-navy-400">Police, Fire & Rescue</span>
                </div>
                <a
                  href="tel:112"
                  className="px-3 py-1 rounded bg-amber-600/20 text-amber-300 border border-amber-500/30 font-bold text-xs hover:bg-amber-600/30 transition-colors"
                >
                  112
                </a>
              </div>
            </div>
          </Card>

          {/* Citizen Landslide Action Guidelines */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-navy-700/60">
              <Info className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-navy-100 text-sm">Community Survival Protocols</h3>
                <p className="text-[11px] text-navy-400">Standard Operating Procedures</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-navy-300">
              <div className="p-2 rounded bg-navy-800/60 border border-navy-700/40">
                <span className="font-semibold text-red-300 block mb-1">During Torrential Monsoon Downpours:</span>
                Stay alert for unusual rumbling sounds, sudden muddy stream discharge, or jamming doors/windows indicating hillside creep.
              </div>

              <div className="p-2 rounded bg-navy-800/60 border border-navy-700/40">
                <span className="font-semibold text-amber-300 block mb-1">Evacuation Precaution:</span>
                Move perpendicular away from the path of debris flow. Never seek shelter under highway rock overhangs or near steep scarp edges.
              </div>

              <div className="p-2 rounded bg-navy-800/60 border border-navy-700/40">
                <span className="font-semibold text-cyan-300 block mb-1">Emergency Kit essentials:</span>
                Keep identification, battery-powered radio, dry rations, flashlight, whistle, and essential prescription medications packed.
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Broadcast Early Warning */}
      <Modal open={isBroadcastModalOpen} onClose={() => setIsBroadcastModalOpen(false)} title="Broadcast CAP-CP Emergency Alert">
        <form onSubmit={handleBroadcastAlert} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Alert Title</label>
            <input
              type="text"
              placeholder="e.g. Critical Slope Movement & Debris Evacuation Warning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Alert Severity Level</label>
            <div className="grid grid-cols-4 gap-2">
              {(['CRITICAL', 'WARNING', 'WATCH', 'INFO'] as AlertLevel[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`py-1.5 rounded-lg border text-center font-bold text-xs ${
                    level === lvl
                      ? lvl === 'CRITICAL'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-blue-600 text-white border-blue-500'
                      : 'bg-navy-900 text-navy-400 border-navy-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Target Sector / District</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.district} ({loc.state})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Potential Impact & Threatened Communities</label>
            <textarea
              rows={2}
              placeholder="Specify highway blockages, threatened villages, or critical facilities..."
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Recommended Action for Citizens & Emergency Responders</label>
            <textarea
              rows={2}
              placeholder="e.g. Evacuate immediately to community shelter; avoid NH-6 corridor..."
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsBroadcastModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-navy-800 text-navy-300 hover:bg-navy-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-500/20"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Emergency Broadcast
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
