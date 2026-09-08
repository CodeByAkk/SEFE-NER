import { useState } from 'react';
import {
  Route,
  AlertTriangle,
  Home,
  HeartPulse,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Plus,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, KpiCard, Modal } from '@/components/ui';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import { roads as initialRoads, bridges, villages, hospitals, locations } from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import type { Road, RoadCondition, RiskLevel } from '@/types';

export function InfrastructurePage() {
  const { showToast } = useApp();
  const [roads, setRoads] = useState<Road[]>(initialRoads);
  const [conditionFilter, setConditionFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'roads' | 'bridges' | 'settlements' | 'hospitals'>('roads');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New report form state
  const [newRoadName, setNewRoadName] = useState('');
  const [newCondition, setNewCondition] = useState<RoadCondition>('Blocked');
  const [newLocationId, setNewLocationId] = useState(locations[0].id);
  const [newDetour, setNewDetour] = useState('');

  const blockedRoads = roads.filter((r) => r.condition === 'Blocked').length;
  const criticalBridges = bridges.filter((b) => b.risk === 'CRITICAL' || b.condition === 'Critical').length;
  const totalIsolated = roads.reduce((acc, r) => acc + (r.condition === 'Blocked' ? r.villagesIsolated : 0), 0);
  const totalTraumaUnits = hospitals.reduce((acc, h) => acc + h.emergencyCapacity, 0);

  const filteredRoads = roads.filter((road) => {
    const matchesCondition = conditionFilter === 'All' || road.condition === conditionFilter;
    const loc = locations.find((l) => l.id === road.locationId);
    const locName = loc ? `${loc.name} ${loc.state}` : '';
    const matchesSearch =
      road.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      road.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCondition && matchesSearch;
  });

  const toggleRoadCondition = (id: string) => {
    setRoads((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextCondition: RoadCondition =
            r.condition === 'Blocked' ? 'Fair' : r.condition === 'Poor' ? 'Blocked' : 'Poor';
          showToast(`Highway ${r.name} status updated to ${nextCondition}`, 'info');
          return { ...r, condition: nextCondition };
        }
        return r;
      })
    );
  };

  const handleCreateRoadIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoadName.trim()) {
      showToast('Please enter the road or highway name', 'error');
      return;
    }
    const loc = locations.find((l) => l.id === newLocationId) || locations[0];
    const newEntry: Road = {
      id: 'road-' + (roads.length + 1),
      name: newRoadName,
      type: 'State Highway',
      risk: newCondition === 'Blocked' ? 'CRITICAL' : 'HIGH',
      riskProbability: newCondition === 'Blocked' ? 88 : 72,
      connectivity: 'Major',
      villagesIsolated: newCondition === 'Blocked' ? 3 : 0,
      alternativeRoute: !!newDetour,
      alternativeRouteName: newDetour || 'No direct bypass',
      condition: newCondition,
      locationId: loc.id,
      length: 30,
    };
    setRoads([newEntry, ...roads]);
    setIsModalOpen(false);
    setNewRoadName('');
    setNewDetour('');
    showToast(`Road advisory logged for ${newEntry.name}! Emergency crews notified.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Route className="w-4 h-4" /> Strategic Lifeline Infrastructure
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            Road Corridors, Bridges & Settlement Isolation
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Real-time multi-hazard highway surveillance, bypass routing, and critical infrastructure resilience for the North East
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Report Highway Hazard
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Severed Corridors"
          value={`${blockedRoads} Blocked`}
          color="red"
          trend="NH-10 & NH-6 Disrupted"
          icon={<ShieldAlert className="w-6 h-6" />}
        />
        <KpiCard
          label="High-Risk Bridges"
          value={`${criticalBridges} of ${bridges.length}`}
          color="orange"
          trend="Rani Khola & Tlawng Critical"
          icon={<AlertTriangle className="w-6 h-6" />}
        />
        <KpiCard
          label="Isolated Villages"
          value={`${totalIsolated} Settlements`}
          color="yellow"
          trend="Air-drop supply lines on alert"
          icon={<Home className="w-6 h-6" />}
        />
        <KpiCard
          label="Trauma Bed Capacity"
          value={`${totalTraumaUnits} Units`}
          color="green"
          trend="6 Civil & Regional Hospitals"
          icon={<HeartPulse className="w-6 h-6" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-700/60 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('roads')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'roads'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
          }`}
        >
          <Route className="w-4 h-4" /> Highway Corridors ({roads.length})
        </button>
        <button
          onClick={() => setActiveTab('bridges')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'bridges'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
          }`}
        >
          <Compass className="w-4 h-4" /> Bridges & River Crossings ({bridges.length})
        </button>
        <button
          onClick={() => setActiveTab('settlements')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'settlements'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
          }`}
        >
          <Home className="w-4 h-4" /> Vulnerable Villages ({villages.length})
        </button>
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'hospitals'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
          }`}
        >
          <HeartPulse className="w-4 h-4" /> Emergency Hospitals ({hospitals.length})
        </button>
      </div>

      {/* Tab 1: Highway Corridors */}
      {activeTab === 'roads' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              {['All', 'Blocked', 'Poor', 'Fair', 'Good'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setConditionFilter(cond)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    conditionFilter === cond
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
              <input
                type="text"
                placeholder="Search highways, states or sectors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-900 border border-navy-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-navy-100 placeholder-navy-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-800/90 text-navy-400 uppercase font-semibold border-b border-navy-700/60">
                  <tr>
                    <th className="py-3 px-4">Highway / Route</th>
                    <th className="py-3 px-4">Sector Location</th>
                    <th className="py-3 px-4">Geotechnical Hazard</th>
                    <th className="py-3 px-4">Passability Status</th>
                    <th className="py-3 px-4">Isolated Villages</th>
                    <th className="py-3 px-4">Designated Detour / Bypass</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/50 text-navy-200">
                  {filteredRoads.map((road) => {
                    const loc = locations.find((l) => l.id === road.locationId);
                    return (
                      <tr key={road.id} className="hover:bg-navy-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-navy-100 text-sm">{road.name}</div>
                          <span className="text-[10px] text-navy-400">{road.type} • {road.length} km</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-navy-300 font-medium">
                            {loc ? `${loc.name}, ${loc.state}` : 'NER Sector'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <RiskBadge level={road.risk} />
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1 ${
                              road.condition === 'Blocked'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : road.condition === 'Poor'
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                : road.condition === 'Fair'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                : 'bg-green-500/20 text-green-300 border border-green-500/30'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              road.condition === 'Blocked' ? 'bg-red-400 animate-ping' : road.condition === 'Poor' ? 'bg-orange-400' : 'bg-green-400'
                            }`} />
                            {road.condition}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {road.villagesIsolated > 0 ? (
                            <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {road.villagesIsolated} Villages Cut Off
                            </span>
                          ) : (
                            <span className="text-navy-500">Accessible</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {road.alternativeRoute ? (
                            <span className="text-cyan-300 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3 text-cyan-500" />
                              {road.alternativeRouteName}
                            </span>
                          ) : (
                            <span className="text-red-400/80 font-medium">No direct bypass available</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => toggleRoadCondition(road.id)}
                            className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 border border-navy-700 text-[11px] font-semibold text-navy-200 transition-all inline-flex items-center gap-1"
                            title="Toggle status for simulation"
                          >
                            <RefreshCw className="w-3 h-3 text-blue-400" /> Toggle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Bridges */}
      {activeTab === 'bridges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bridges.map((bridge) => {
            const loc = locations.find((l) => l.id === bridge.locationId);
            return (
              <Card key={bridge.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">
                      Bridge Asset #{bridge.id}
                    </span>
                    <h3 className="font-bold text-navy-100 text-sm mt-0.5">{bridge.name}</h3>
                    <p className="text-xs text-navy-400 mt-0.5">
                      {loc ? `${loc.name}, ${loc.state}` : 'North East Corridor'}
                    </p>
                  </div>
                  <RiskBadge level={bridge.risk} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-navy-800/60 border border-navy-700/50">
                    <span className="text-navy-400 text-[10px] block">Superstructure</span>
                    <span className="font-semibold text-navy-100 mt-0.5 block">{bridge.type}</span>
                  </div>
                  <div className="p-2 rounded bg-navy-800/60 border border-navy-700/50">
                    <span className="text-navy-400 text-[10px] block">Piers & Foundation</span>
                    <span
                      className={`font-semibold mt-0.5 block ${
                        bridge.condition === 'Critical'
                          ? 'text-red-400'
                          : bridge.condition === 'Poor'
                          ? 'text-orange-400'
                          : 'text-green-400'
                      }`}
                    >
                      {bridge.condition}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-navy-800/40 border border-navy-700/40 text-xs text-navy-300">
                  <span className="text-[10px] text-navy-500 block uppercase font-bold">Inspection Advisory</span>
                  Scour monitoring active; sensors monitoring pier tilt and riverbed erosion velocity.
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab 3: Vulnerable Villages */}
      {activeTab === 'settlements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {villages.map((v) => {
            const loc = locations.find((l) => l.id === v.locationId);
            return (
              <Card key={v.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                      Village Settlement
                    </span>
                    <h3 className="font-bold text-navy-100 text-sm mt-0.5">{v.name}</h3>
                    <p className="text-xs text-navy-400 mt-0.5">
                      Sector: {loc?.name} ({loc?.state})
                    </p>
                  </div>
                  <RiskBadge level={v.risk} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-navy-800/60 border border-navy-700/50">
                    <span className="text-navy-400 text-[10px] block">Registered Population</span>
                    <span className="font-semibold text-blue-300 mt-0.5 block">{v.population} Residents</span>
                  </div>
                  <div className="p-2 rounded bg-navy-800/60 border border-navy-700/50">
                    <span className="text-navy-400 text-[10px] block">Proximity to Hazard Scarp</span>
                    <span className="font-semibold text-red-400 mt-0.5 block">{v.distanceToHazard} km</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-navy-800/40 border border-navy-700/40 text-xs">
                  <span className="text-[10px] text-navy-500 block uppercase font-bold">Designated Evacuation Corridor</span>
                  <span className="text-cyan-300 font-medium">{v.evacuationRoute}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab 4: Emergency Hospitals */}
      {activeTab === 'hospitals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((h) => {
            const loc = locations.find((l) => l.id === h.locationId);
            return (
              <Card key={h.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-green-400 tracking-wider">
                      Medical Lifeline
                    </span>
                    <h3 className="font-bold text-navy-100 text-sm mt-0.5">{h.name}</h3>
                    <p className="text-xs text-navy-400 mt-0.5">{loc?.name}, {loc?.state}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                    Operational
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded bg-navy-800/60 border border-navy-700/50 text-center">
                    <span className="text-navy-400 text-[10px] block">Total Beds</span>
                    <span className="font-bold text-navy-100 text-sm mt-0.5 block">{h.beds}</span>
                  </div>
                  <div className="p-2 rounded bg-navy-800/60 border border-navy-700/50 text-center">
                    <span className="text-navy-400 text-[10px] block">Trauma Units</span>
                    <span className="font-bold text-red-400 text-sm mt-0.5 block">{h.emergencyCapacity}</span>
                  </div>
                  <div className="p-2 rounded bg-navy-800/60 border border-navy-700/50 text-center">
                    <span className="text-navy-400 text-[10px] block">Disaster Dist.</span>
                    <span className="font-bold text-cyan-300 text-sm mt-0.5 block">{h.distanceToHazard} km</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-navy-800/40 border border-navy-700/40 text-xs text-navy-300">
                  <span className="text-[10px] text-navy-500 block uppercase font-bold">Emergency Preparedness</span>
                  Dedicated helipad available • 48h diesel backup generator active • Blood bank restocked.
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Report Road Hazard */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Highway Obstruction or Hazard">
        <form onSubmit={handleCreateRoadIncident} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Highway / Road Name</label>
            <input
              type="text"
              placeholder="e.g. NH-6 Km 44 Sector"
              value={newRoadName}
              onChange={(e) => setNewRoadName(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Affected Sector / District</label>
            <select
              value={newLocationId}
              onChange={(e) => setNewLocationId(e.target.value)}
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
            <label className="text-navy-300 font-semibold">Passability Condition</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Blocked', 'Poor', 'Fair', 'Good'] as RoadCondition[]).map((cond) => (
                <button
                  type="button"
                  key={cond}
                  onClick={() => setNewCondition(cond)}
                  className={`py-1.5 rounded-lg border text-center font-bold text-xs ${
                    newCondition === cond
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-navy-900 text-navy-400 border-navy-700'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Alternative Bypass Route</label>
            <input
              type="text"
              placeholder="e.g. Via Sairang old bypass corridor"
              value={newDetour}
              onChange={(e) => setNewDetour(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
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
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20"
            >
              Save Highway Advisory
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
