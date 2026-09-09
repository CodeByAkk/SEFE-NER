import { useState } from 'react';
import {
  Radio,
  Activity,
  Battery,
  BatteryCharging,
  Thermometer,
  Droplets,
  RefreshCw,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  WifiOff,
  Sliders,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, KpiCard, Modal } from '@/components/ui';
import { SensorStatusBadge } from '@/components/ui/Badge';
import { soilSensors as initialSensors, locations } from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import { filterByDistrict, isDistrictOfficer } from '@/context/AppContext';
import type { SoilSensor, SensorStatus } from '@/types';

export function SensorMonitoringPage() {
  const { user, showToast } = useApp();
  const [sensors, setSensors] = useState<SoilSensor[]>(initialSensors);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newSensorId, setNewSensorId] = useState('');
  const [newLocationId, setNewLocationId] = useState(locations[0].id);
  const [newStatus, setNewStatus] = useState<SensorStatus>('ONLINE');

  const districtSensors = filterByDistrict(sensors, user);

  const onlineCount = districtSensors.filter((s) => s.status === 'ONLINE').length;
  const warningCount = districtSensors.filter((s) => s.status === 'WARNING').length;
  const criticalCount = districtSensors.filter((s) => s.status === 'CRITICAL').length;
  const offlineCount = districtSensors.filter((s) => s.status === 'OFFLINE').length;

  const filteredSensors = districtSensors.filter((s) => {
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handlePingSensor = (id: string) => {
    setSensors((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              lastUpdated: 'Just now',
              soilMoisture: Math.min(100, Math.max(10, s.soilMoisture + Math.floor(Math.random() * 5 - 2))),
            }
          : s
      )
    );
    showToast(`Telemetry beacon received from Sensor Node ${id}`, 'success');
  };

  const handleToggleState = (id: string) => {
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next: SensorStatus =
            s.status === 'ONLINE' ? 'WARNING' : s.status === 'WARNING' ? 'CRITICAL' : s.status === 'CRITICAL' ? 'OFFLINE' : 'ONLINE';
          showToast(`Sensor ${s.id} transitioned to ${next}`, 'info');
          return { ...s, status: next };
        }
        return s;
      })
    );
  };

  const handleAddSensor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSensorId.trim()) {
      showToast('Please enter a Sensor Node ID', 'error');
      return;
    }
    const loc = locations.find((l) => l.id === newLocationId) || locations[0];
    const newSensor: SoilSensor = {
      id: newSensorId.toUpperCase(),
      locationId: loc.id,
      locationName: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      soilMoisture: 65,
      temperature: 24,
      battery: 98,
      lastUpdated: 'Just now',
      status: newStatus,
    };
    setSensors([newSensor, ...sensors]);
    setIsAddModalOpen(false);
    setNewSensorId('');
    showToast(`Sensor ${newSensor.id} registered into LoRaWAN mesh!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-green-400 uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" /> IoT Geotechnical Telemetry Mesh
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            {isDistrictOfficer(user) ? `${user?.district || 'District'} Sensor Monitoring` : 'Real-Time Ground Moisture & Pore Pressure Monitoring'}
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            {isDistrictOfficer(user)
              ? 'District IoT sensor telemetry and device health status'
              : 'Low-power LoRaWAN wireless sensor network monitoring subsurface water saturation, tilt, and slope temperature'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Provision Sensor Node
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Online Telemetry Nodes"
          value={`${onlineCount} Nodes`}
          color="green"
          trend="Transmitting every 60 seconds"
          icon={<Radio className="w-6 h-6" />}
        />
        <KpiCard
          label="Pore Saturation Warnings"
          value={`${warningCount + criticalCount} Sensors`}
          color="orange"
          trend="Exceeding 70% liquid limit"
          icon={<Droplets className="w-6 h-6" />}
        />
        <KpiCard
          label="Critical Liquefaction"
          value={`${criticalCount} Probes`}
          color="red"
          trend="SM-104 (Aizawl) & SM-412 (Gangtok)"
          icon={<AlertTriangle className="w-6 h-6" />}
        />
        <KpiCard
          label="Packet Delivery Ratio"
          value="98.4%"
          color="blue"
          trend="LoRaWAN 868MHz Mesh Link"
          icon={<Wifi className="w-6 h-6" />}
        />
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {['All', 'CRITICAL', 'WARNING', 'ONLINE', 'OFFLINE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
          <input
            type="text"
            placeholder="Search sensor node ID or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-navy-100 placeholder-navy-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSensors.map((sensor) => (
          <Card
            key={sensor.id}
            className={`p-4 space-y-3 border transition-all ${
              sensor.status === 'CRITICAL'
                ? 'border-red-500/40 bg-red-950/15'
                : sensor.status === 'WARNING'
                ? 'border-orange-500/40 bg-orange-950/15'
                : 'border-navy-700/60 bg-navy-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 tracking-wider">
                  {sensor.id}
                </span>
                <h3 className="font-bold text-navy-100 text-sm mt-0.5">{sensor.locationName}</h3>
                <p className="text-[10px] text-navy-500">
                  Lat: {sensor.lat.toFixed(2)}° • Lng: {sensor.lng.toFixed(2)}°
                </p>
              </div>
              <SensorStatusBadge status={sensor.status} />
            </div>

            {/* Metrics */}
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-navy-800/80 border border-navy-700/50">
                <div className="flex justify-between text-navy-400 text-[11px] mb-1">
                  <span>Soil Saturation:</span>
                  <span
                    className={`font-bold font-mono ${
                      sensor.soilMoisture > 75
                        ? 'text-red-400'
                        : sensor.soilMoisture > 60
                        ? 'text-amber-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {sensor.soilMoisture}%
                  </span>
                </div>
                <div className="w-full bg-navy-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      sensor.soilMoisture > 75
                        ? 'bg-red-500'
                        : sensor.soilMoisture > 60
                        ? 'bg-amber-500'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${sensor.soilMoisture}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-navy-800/60 border border-navy-700/40">
                  <span className="text-navy-400 text-[10px] block">Temperature</span>
                  <span className="font-bold text-navy-100 mt-0.5 block">{sensor.temperature}°C</span>
                </div>
                <div className="p-2 rounded bg-navy-800/60 border border-navy-700/40">
                  <span className="text-navy-400 text-[10px] block">Battery</span>
                  <span
                    className={`font-bold mt-0.5 block ${
                      sensor.battery < 20 ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {sensor.battery}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-navy-700/50 flex items-center justify-between text-[10px] text-navy-400">
              <span>Ping: {sensor.lastUpdated}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleState(sensor.id)}
                  className="px-1.5 py-0.5 rounded bg-navy-800 hover:bg-navy-700 text-navy-300 border border-navy-700"
                  title="Toggle status"
                >
                  Status
                </button>
                <button
                  onClick={() => handlePingSensor(sensor.id)}
                  className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Ping
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sensor Mesh Architecture Specifications */}
      <Card className="p-4 space-y-3 border-blue-500/20">
        <CardHeader
          title="IoT Wireless Telemetry Mesh Specifications"
          subtitle="Ruggedized field deployment architecture designed for Himalayan and North Eastern topography"
          icon={<Sliders className="w-5 h-5 text-blue-400" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-navy-300">
          <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/50 space-y-1">
            <span className="font-bold text-navy-100 block">RF Sub-GHz LoRaWAN</span>
            <p className="text-[11px] text-navy-400">
              868 MHz band with up to 15 km non-line-of-sight propagation across deep valleys and dense forest canopy.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/50 space-y-1">
            <span className="font-bold text-navy-100 block">Pore Water Pressure Transducers</span>
            <p className="text-[11px] text-navy-400">
              Vibrating wire piezometers bored to 8m depth measuring active hydrostatic head pressure preceding slope shear.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/50 space-y-1">
            <span className="font-bold text-navy-100 block">Solar MPPT + LiFePO4 Backup</span>
            <p className="text-[11px] text-navy-400">
              Continuous 30-day operation in overcast monsoon conditions without direct solar illumination.
            </p>
          </div>
        </div>
      </Card>

      {/* Modal: Provision Sensor Node */}
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Provision New Geotechnical Sensor Node">
        <form onSubmit={handleAddSensor} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Sensor Node Identifier (EUI)</label>
            <input
              type="text"
              placeholder="e.g. SM-1002"
              value={newSensorId}
              onChange={(e) => setNewSensorId(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100 font-mono uppercase"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Deployment Sector</label>
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
            <label className="text-navy-300 font-semibold">Initial Telemetry State</label>
            <div className="grid grid-cols-4 gap-2">
              {(['ONLINE', 'WARNING', 'CRITICAL', 'OFFLINE'] as SensorStatus[]).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setNewStatus(st)}
                  className={`py-1.5 rounded-lg border text-center font-bold text-xs ${
                    newStatus === st
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-navy-900 text-navy-400 border-navy-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-navy-800 text-navy-300 hover:bg-navy-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20"
            >
              Register Node in Mesh
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
