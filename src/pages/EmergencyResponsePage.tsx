import { useState } from 'react';
import {
  Siren,
  Users,
  Shield,
  Truck,
  Activity,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  Radio,
  RefreshCw,
  Plus,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, KpiCard, Modal } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import { emergencyTeams as initialTeams, emergencyPriorities, locations } from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import type { EmergencyTeam } from '@/types';

export function EmergencyResponsePage() {
  const { showToast } = useApp();
  const [teams, setTeams] = useState<EmergencyTeam[]>(initialTeams);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedTeamToDeploy, setSelectedTeamToDeploy] = useState<EmergencyTeam | null>(null);
  const [targetLocation, setTargetLocation] = useState(locations[0].name);
  const [assignmentMission, setAssignmentMission] = useState('');

  const totalPersonnel = teams.reduce((acc, t) => acc + t.personnelCount, 0);
  const deployedCount = teams.filter((t) => t.status === 'Deployed').length;
  const standbyCount = teams.filter((t) => t.status === 'On Standby').length;
  const availableCount = teams.filter((t) => t.status === 'Available').length;

  const handleToggleStatus = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const nextStatus =
            t.status === 'Deployed'
              ? 'Returning'
              : t.status === 'Returning'
              ? 'Available'
              : t.status === 'Available'
              ? 'On Standby'
              : 'Deployed';
          showToast(`${t.name} status transitioned to ${nextStatus}`, 'info');
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleConfirmDeployment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamToDeploy || !assignmentMission.trim()) {
      showToast('Please provide an assignment description', 'error');
      return;
    }
    setTeams((prev) =>
      prev.map((t) =>
        t.id === selectedTeamToDeploy.id
          ? {
              ...t,
              status: 'Deployed',
              location: targetLocation,
              currentAssignment: assignmentMission,
            }
          : t
      )
    );
    setIsDeployModalOpen(false);
    showToast(`🚨 ${selectedTeamToDeploy.name} deployed to ${targetLocation}!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
            <Siren className="w-4 h-4 animate-bounce" /> NDRF & Multi-Agency Incident Command
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            Emergency Disaster Response & Resource Deployment
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Real-time rescue team dispatch, geotechnical engineering assets, and prioritized evacuation corridors across the North East
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const freeTeam = teams.find((t) => t.status === 'Available' || t.status === 'On Standby') || teams[0];
              setSelectedTeamToDeploy(freeTeam);
              setIsDeployModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Dispatch Emergency Team
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Deployed Incident Units"
          value={`${deployedCount} Units`}
          color="red"
          trend="Active on NH-29 & Umiam Bridge"
          icon={<Siren className="w-6 h-6" />}
        />
        <KpiCard
          label="Trained First Responders"
          value={`${totalPersonnel} Personnel`}
          color="blue"
          trend="NDRF, SDRF & BRO Engineers"
          icon={<Users className="w-6 h-6" />}
        />
        <KpiCard
          label="Quick Reaction Standby"
          value={`${standbyCount} Units`}
          color="yellow"
          trend="Ready for 15-min air/road launch"
          icon={<Clock className="w-6 h-6" />}
        />
        <KpiCard
          label="Available Reserves"
          value={`${availableCount} Teams`}
          color="green"
          trend="Aizawl & Gangtok Base Camps"
          icon={<Shield className="w-6 h-6" />}
        />
      </div>

      {/* Main Grid: Priority Dispatch Board + Teams Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Emergency Priorities Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden">
            <CardHeader
              title="Prioritized Emergency Evacuation & Rescue Targets"
              subtitle="Algorithmically ranked by landslide failure probability, population density, and infrastructure exposure"
              icon={<Activity className="w-5 h-5 text-red-400" />}
            />

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-800/90 text-navy-400 uppercase font-semibold border-b border-navy-700/60">
                  <tr>
                    <th className="py-3 px-4">Priority Rank</th>
                    <th className="py-3 px-4">Sector Location</th>
                    <th className="py-3 px-4">Threatened Infrastructure</th>
                    <th className="py-3 px-4">Urgency Index</th>
                    <th className="py-3 px-4">Mandated Action</th>
                    <th className="py-3 px-4 text-right">Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/50 text-navy-200">
                  {emergencyPriorities.map((ep, idx) => (
                    <tr key={ep.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            idx === 0
                              ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                              : idx === 1
                              ? 'bg-orange-600 text-white'
                              : idx === 2
                              ? 'bg-amber-600 text-white'
                              : 'bg-navy-800 text-navy-300 border border-navy-700'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-navy-100 text-sm">{ep.locationName}</span>
                        <p className="text-[10px] text-red-400 mt-0.5">{ep.villagesAtRisk} Villages At Immediate Risk</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {ep.threatenedInfrastructure.map((inf, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-navy-800 text-navy-300 border border-navy-700 text-[10px]"
                            >
                              {inf}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-navy-400">Score</span>
                            <span className="font-bold text-red-400">{ep.priorityScore}/100</span>
                          </div>
                          <div className="w-20 bg-navy-950 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-red-500 h-full rounded-full"
                              style={{ width: `${ep.priorityScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-navy-300 text-[11px] max-w-xs">
                        {ep.recommendedAction}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            const freeTeam = teams.find((t) => t.status === 'Available') || teams[0];
                            setSelectedTeamToDeploy(freeTeam);
                            setTargetLocation(ep.locationName);
                            setAssignmentMission(ep.recommendedAction);
                            setIsDeployModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-[11px] font-semibold transition-all whitespace-nowrap"
                        >
                          Mobilize
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Relief Camp & Logistics Operations */}
          <Card className="p-4 space-y-3 border-blue-500/20">
            <CardHeader
              title="Relief Logistics & Inter-Agency Coordination"
              subtitle="Supply line status, airlift clearance and civil shelter capacities"
              icon={<Truck className="w-5 h-5 text-cyan-400" />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/60">
                <span className="text-navy-400 text-[10px] block">Emergency Relief Shelters</span>
                <span className="text-xl font-bold text-navy-100 mt-1 block">24 Active</span>
                <span className="text-[10px] text-green-400">Total capacity: 14,500 people</span>
              </div>
              <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/60">
                <span className="text-navy-400 text-[10px] block">IAF Helicopter Air-Drop</span>
                <span className="text-xl font-bold text-blue-300 mt-1 block">Clearance Green</span>
                <span className="text-[10px] text-navy-400">Helipads at Aizawl & Gangtok ready</span>
              </div>
              <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/60">
                <span className="text-navy-400 text-[10px] block">Satellite Comm Terminals</span>
                <span className="text-xl font-bold text-cyan-300 mt-1 block">12 / 12 Online</span>
                <span className="text-[10px] text-green-400">ISRO GSAT Emergency Mesh</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Teams Roster & Readiness */}
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-navy-700/60">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-navy-100 text-sm">Disaster Response Units</h3>
                  <p className="text-[11px] text-navy-400">{teams.length} Specialized Teams</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-[640px] overflow-y-auto">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="p-3 rounded-xl bg-navy-800/80 border border-navy-700/60 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-navy-100 text-sm">{team.name}</h4>
                      <p className="text-[10px] text-blue-400 font-semibold uppercase">{team.type} Unit</p>
                    </div>
                    <StatusBadge status={team.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-navy-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{team.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-navy-400" />
                      <span>{team.personnelCount} Personnel</span>
                    </div>
                  </div>

                  {team.currentAssignment && (
                    <div className="p-2 rounded bg-navy-900 border border-navy-700/50 text-[11px]">
                      <span className="text-navy-400 block text-[10px]">Current Mission:</span>
                      <span className="text-navy-200 font-medium">{team.currentAssignment}</span>
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleStatus(team.id)}
                      className="text-[11px] text-navy-400 hover:text-navy-200 flex items-center gap-1"
                      title="Cycle status for testing"
                    >
                      <RefreshCw className="w-3 h-3 text-navy-500" /> Cycle Status
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTeamToDeploy(team);
                        setIsDeployModalOpen(true);
                      }}
                      className="px-3 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold"
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Deploy Emergency Team */}
      <Modal open={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} title="Mobilize Emergency Response Team">
        <form onSubmit={handleConfirmDeployment} className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-between">
            <div>
              <span className="text-navy-400 text-[10px] uppercase font-bold block">Selected Unit</span>
              <p className="font-bold text-navy-100 text-sm mt-0.5">{selectedTeamToDeploy?.name}</p>
              <p className="text-[11px] text-blue-400">{selectedTeamToDeploy?.type} • {selectedTeamToDeploy?.personnelCount} Specialists</p>
            </div>
            <StatusBadge status={selectedTeamToDeploy?.status ?? 'Available'} />
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Deployment Destination / Sector</label>
            <select
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}, {loc.district} ({loc.state})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Mission Directive & Operational Orders</label>
            <textarea
              rows={3}
              placeholder="e.g. Conduct search and rescue in Sairang sector; secure alternative bypass route..."
              value={assignmentMission}
              onChange={(e) => setAssignmentMission(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDeployModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-navy-800 text-navy-300 hover:bg-navy-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-500/20"
            >
              <Send className="w-3.5 h-3.5" /> Confirm & Issue Dispatch Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
