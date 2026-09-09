import { useState } from 'react';
import {
  TrendingUp,
  CloudRain,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  MapPin,
  Compass,
  Wind,
  Droplets,
  Thermometer,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import { Card, CardHeader } from '@/components/ui';
import { RiskBadge } from '@/components/ui/Badge';
import { locations, forecastData, riskZones } from '@/data/demoData';

export function RiskForecastPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('loc-aizawl');

  const selectedLoc = locations.find((l) => l.id === selectedLocationId) || locations[0];
  const selectedZone = riskZones.find((z) => z.locationId === selectedLocationId);
  const forecastPoints = forecastData[selectedLocationId] || forecastData['loc-aizawl'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> 72-Hour Predictive Timeline
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            Monsoon & Landslide Hazard Forecasting
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Coupled atmospheric weather forecast & geotechnical slope stability trajectory across the North East
          </p>
        </div>

        {/* Selected Sector Details */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-xs flex items-center gap-2">
            <span className="text-navy-400">Peak Threat Window:</span>
            <span className="font-bold text-red-400">+12h to +24h</span>
          </div>
        </div>
      </div>

      {/* Location Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-navy-400 font-medium whitespace-nowrap">Target Sector:</span>
        {locations.map((loc) => {
          const isSelected = loc.id === selectedLocationId;
          const zone = riskZones.find((z) => z.locationId === loc.id);
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocationId(loc.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-navy-900 border-navy-700/60 text-navy-300 hover:bg-navy-800'
              }`}
            >
              <span>{loc.name}</span>
              {zone && <RiskBadge level={zone.risk} size="sm" />}
            </button>
          );
        })}
      </div>

      {/* Forecast Chart Card */}
      <Card className="p-5">
        <CardHeader
          title={`72-Hour Precipitation & Landslide Hazard Projections — ${selectedLoc.name}`}
          subtitle="Simulated rainfall threshold vs geotechnical pore pressure accumulation"
          icon={<CloudRain className="w-5 h-5 text-blue-400" />}
          action={
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-3 h-1 bg-blue-500 rounded" /> Rainfall (mm)
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-3 h-1 bg-red-500 rounded" /> Risk Probability (%)
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-3 h-1 bg-cyan-500 rounded" /> Soil Saturation (%)
              </span>
            </div>
          }
        />

        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastPoints} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" textAnchor="middle" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="rainfall"
                name="Rainfall (mm)"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRain)"
              />
              <Area
                type="monotone"
                dataKey="risk"
                name="Risk Score (%)"
                stroke="#ef4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRisk)"
              />
              <Area
                type="monotone"
                dataKey="soilMoisture"
                name="Soil Saturation (%)"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSoil)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Hourly Trajectory Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {forecastPoints.map((pt, idx) => (
          <Card
            key={idx}
            className={`p-4 border ${
              pt.risk >= 85
                ? 'bg-red-950/20 border-red-500/40'
                : pt.risk >= 70
                ? 'bg-orange-950/20 border-orange-500/30'
                : 'bg-navy-900 border-navy-700/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-navy-100 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> {pt.hour}
              </span>
              <RiskBadge
                level={pt.risk >= 80 ? 'CRITICAL' : pt.risk >= 65 ? 'HIGH' : 'MODERATE'}
                size="sm"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-navy-300">
                <span>Rainfall:</span>
                <span className="font-bold text-blue-400">{pt.rainfall} mm</span>
              </div>
              <div className="flex justify-between text-navy-300">
                <span>Risk Index:</span>
                <span className="font-bold text-red-400">{pt.risk}/100</span>
              </div>
              <div className="flex justify-between text-navy-300">
                <span>Soil Moisture:</span>
                <span className="font-bold text-cyan-400">{pt.soilMoisture}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Micro-Climate Atmospheric Indices */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-navy-400 uppercase tracking-wide">Surface Temp</span>
            <p className="text-xl font-bold text-navy-100 mt-0.5">24.2°C</p>
            <p className="text-[10px] text-navy-500">High humidity condensation</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-navy-400 uppercase tracking-wide">Atmospheric Humidity</span>
            <p className="text-xl font-bold text-cyan-300 mt-0.5">94%</p>
            <p className="text-[10px] text-red-400">Pore saturation imminent</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-navy-400 uppercase tracking-wide">Wind Velocity</span>
            <p className="text-xl font-bold text-navy-100 mt-0.5">38 km/h</p>
            <p className="text-[10px] text-navy-500">Gusts up to 55 km/h</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-navy-400 uppercase tracking-wide">Forecast Advisory</span>
            <p className="text-sm font-bold text-red-300 mt-0.5">Evacuation Standby</p>
            <p className="text-[10px] text-navy-400">Heavy monsoon convergence</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
