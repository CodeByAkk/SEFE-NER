import { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  Route,
  Activity,
  FileText,
  RotateCcw,
  Sparkles,
  Satellite,
} from 'lucide-react';
import { NerMap } from '@/components/NerMap';
import { Card, CardHeader, KpiCard } from '@/components/ui';
import { RiskBadge, AlertLevelBadge, StatusBadge } from '@/components/ui/Badge';
import {
  riskZones,
  locations,
  incidentReports,
  alerts,
  roads,
  soilSensors,
  riskScores,
} from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import { fetchNASAPowerForecast, fetchNASARainfallForLocation, getNASALocationById } from '@/services/nasaApi';

export function Dashboard() {
  const { user, simulationActive, setSimulationActive, showToast } = useApp();
  const [selectedLocationId, setSelectedLocationId] = useState<string>('loc-aizawl');
  const [nasaForecast, setNasaForecast] = useState<{ rainfall: number; soilMoisture: number; risk: number } | null>(null);
  const [nasaLoading, setNasaLoading] = useState(false);

  const selectedLoc = locations.find((l) => l.id === selectedLocationId) || locations[0];
  const selectedZone = riskZones.find((z) => z.locationId === selectedLocationId);
  const selectedScore = riskScores.find((s) => s.locationId === selectedLocationId);

  const criticalZones = riskZones.filter((z) => z.risk === 'CRITICAL').length;
  const highRiskRoads = roads.filter((r) => r.risk === 'CRITICAL' || r.risk === 'HIGH').length;
  const activeAlerts = alerts.filter((a) => !a.acknowledged).length;
  const onlineSensors = soilSensors.filter((s) => s.status === 'ONLINE' || s.status === 'WARNING').length;

  const syncNASADashboard = async () => {
    setNasaLoading(true);
    try {
      const nasaLoc = getNASALocationById(selectedLocationId);
      if (!nasaLoc) {
        showToast('No NASA coordinates mapped for this location', 'error');
        setNasaLoading(false);
        return;
      }
      const forecast = await fetchNASAPowerForecast(nasaLoc.lat, nasaLoc.lng);
      if (forecast.length > 0) {
        const latest = forecast[forecast.length - 1];
        setNasaForecast({
          rainfall: Number(latest.rainfall.toFixed(1)),
          soilMoisture: Number(latest.soilMoisture.toFixed(1)),
          risk: Number(latest.risk.toFixed(1)),
        });
        showToast('NASA POWER data synced successfully', 'success');
      }
    } catch (e) {
      showToast('Failed to sync NASA data', 'error');
    } finally {
      setNasaLoading(false);
    }
  };

  const toggleSimulation = () => {
    const next = !simulationActive;
    setSimulationActive(next);
    if (next) {
      showToast('⚠️ Monsoon Disaster Simulation Activated — Sensor thresholds simulated!', 'warning');
    } else {
      showToast('Simulation reset to real-time normal telemetry.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / System Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
              Live Monitoring Active — NER Satellite & IoT Mesh
            </span>
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            North Eastern Region Landslide Warning System
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Real-time multi-hazard telemetry for Assam, Meghalaya, Mizoram, Nagaland, Sikkim & NE States
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={toggleSimulation}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 border shadow-sm ${
              simulationActive
                ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                : 'bg-navy-800 text-navy-200 border-navy-700 hover:bg-navy-700'
            }`}
          >
            {simulationActive ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" /> Reset Simulation
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Run Disaster Simulation
              </>
            )}
          </button>
          <button
            onClick={syncNASADashboard}
            disabled={nasaLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 flex items-center gap-1.5 disabled:opacity-50"
            title="Sync NASA POWER satellite weather data"
          >
            <Satellite className="w-3.5 h-3.5" />
            {nasaLoading ? 'Syncing...' : 'NASA Live'}
          </button>
          <div className="px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-xs text-navy-300 flex items-center gap-2">
            <span className="text-navy-400">Role:</span>
            <span className="font-semibold text-blue-400">{user?.role ?? 'ADMIN'}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Critical Risk Zones"
          value={simulationActive ? criticalZones + 2 : criticalZones}
          color="red"
          trend="Highest in Aizawl & Gangtok"
          icon={<ShieldAlert className="w-6 h-6" />}
        />
        <KpiCard
          label="Vulnerable Corridors"
          value={`${highRiskRoads} / ${roads.length}`}
          color="orange"
          trend="NH-6 & NH-10 Critical"
          icon={<Route className="w-6 h-6" />}
        />
        <KpiCard
          label="Active Alerts"
          value={activeAlerts}
          color="yellow"
          trend="3 Evacuation Warnings"
          icon={<AlertTriangle className="w-6 h-6" />}
        />
        <KpiCard
          label="Telemetry Mesh Health"
          value={`${onlineSensors}/${soilSensors.length} Online`}
          color="green"
          trend="LoRaWAN 98.4% uptime"
          icon={<Radio className="w-6 h-6" />}
        />
      </div>

      {/* Main Grid: Interactive Map + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: GIS Interactive Map */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden">
            <CardHeader
              title="Geospatial Landslide Risk Map (NER India)"
              subtitle="Click any zone, road, or sensor to inspect telemetry"
              icon={<Activity className="w-5 h-5" />}
              action={
                <div className="flex items-center gap-2">
                  <span className="text-xs text-navy-400 hidden sm:inline">Selected:</span>
                  <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {selectedLoc.name}, {selectedLoc.state}
                  </span>
                </div>
              }
            />
            <div className="p-4">
              <NerMap
                selectedLocationId={selectedLocationId}
                onSelectLocation={(id) => setSelectedLocationId(id)}
                height="460px"
              />
            </div>
          </Card>

          {/* Critical Roads & Corridors Table */}
          <Card className="p-0">
            <CardHeader
              title="Critical Road Corridors & Blockage Status"
              subtitle="Real-time connectivity and bypass routing for emergency supply lines"
              icon={<Route className="w-5 h-5" />}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-800/80 text-navy-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Highway / Road</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4">Risk Level</th>
                    <th className="py-3 px-4">Road Status</th>
                    <th className="py-3 px-4">Isolated Villages</th>
                    <th className="py-3 px-4">Alternative Bypass Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/50 text-navy-200">
                  {roads.map((road) => (
                    <tr key={road.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-navy-100">{road.name}</td>
                      <td className="py-3 px-4 text-navy-400">
                        {locations.find((l) => l.id === road.locationId)?.name ?? 'NER Region'}
                      </td>
                      <td className="py-3 px-4">
                        <RiskBadge level={road.risk} />
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                            road.condition === 'Blocked'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : road.condition === 'Poor'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}
                        >
                          {road.condition}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-navy-300">
                        {road.villagesIsolated > 0 ? (
                          <span className="text-amber-400 font-bold">{road.villagesIsolated} villages</span>
                        ) : (
                          'None'
                        )}
                      </td>
                      <td className="py-3 px-4 text-navy-400">
                        {road.alternativeRoute ? road.alternativeRouteName : 'No detour available'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Col: Location Telemetry Inspector & Live Alerts */}
        <div className="space-y-4">
          {/* Selected Location Details Card */}
          <Card className="p-4 space-y-4 border-blue-500/20">
            <div className="flex items-start justify-between border-b border-navy-700/60 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  Telemetry Inspector
                </span>
                <h3 className="text-lg font-bold text-navy-100">{selectedLoc.name}</h3>
                <p className="text-xs text-navy-400">
                  {selectedLoc.district}, {selectedLoc.state}
                </p>
              </div>
              {selectedZone && <RiskBadge level={selectedZone.risk} size="md" />}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50">
                <span className="text-navy-400 block">Rainfall (24h)</span>
                <span className="text-lg font-bold text-blue-300 mt-0.5 block">
                  {nasaForecast ? `${nasaForecast.rainfall} mm` : `${selectedScore?.rainfall ?? 142} mm`}
                </span>
                <span className="text-[10px] text-amber-400">Threshold: 120 mm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50">
                <span className="text-navy-400 block">Soil Saturation</span>
                <span className="text-lg font-bold text-cyan-300 mt-0.5 block">
                  {nasaForecast ? `${nasaForecast.soilMoisture}%` : `${selectedScore?.soilMoisture ?? 78}%`}
                </span>
                <span className="text-[10px] text-red-400">Critical &gt; 75%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50">
                <span className="text-navy-400 block">Slope Angle</span>
                <span className="text-lg font-bold text-navy-100 mt-0.5 block">
                  {selectedScore?.slope ?? 42}°
                </span>
                <span className="text-[10px] text-navy-500">Steep terrain</span>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/50">
                <span className="text-navy-400 block">Failure Probability</span>
                <span className="text-lg font-bold text-red-400 mt-0.5 block">
                  {nasaForecast ? `${nasaForecast.risk}%` : `${selectedScore?.probability ?? 82}%`}
                </span>
                <span className="text-[10px] text-red-400">High vulnerability</span>
              </div>
            </div>

            {/* AI Warning Advisory */}
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-xs">
              <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
                <AlertTriangle className="w-4 h-4" /> AI Early Warning Advisory
              </div>
              <p className="text-navy-300 leading-relaxed">
                {selectedScore?.recommendedAction ??
                  'Maintain continuous monitoring. Restrict heavy traffic on NH corridors.'}
              </p>
            </div>
          </Card>

          {/* Live Incident Reports Feed */}
          <Card className="p-0">
            <CardHeader
              title="Citizen & Field Reports"
              subtitle="Crowdsourced and officer observations"
              icon={<FileText className="w-5 h-5" />}
            />
            <div className="divide-y divide-navy-700/50 max-h-72 overflow-y-auto">
              {incidentReports.map((report) => (
                <div key={report.id} className="p-3 hover:bg-navy-800/40 transition-colors text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-navy-100">{report.type}</span>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-navy-300 line-clamp-2">{report.description}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-navy-400">
                    <span>
                      {report.locationName} • by {report.reporterName} ({report.reporterType})
                    </span>
                    <span>{new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Broadcast Bulletins */}
          <Card className="p-0">
            <CardHeader
              title="Active Early Warning Alerts"
              subtitle="NDRF & State Disaster Management alerts"
              icon={<AlertTriangle className="w-5 h-5" />}
            />
            <div className="p-3 space-y-2.5 max-h-64 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <AlertLevelBadge level={alert.level} />
                    <span className="text-[10px] text-navy-400">{alert.locationName}</span>
                  </div>
                  <h4 className="text-xs font-bold text-navy-100">{alert.title}</h4>
                  <p className="text-[11px] text-navy-300 line-clamp-2">{alert.potentialImpact}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
