import { useState } from 'react';
import {
  Map as MapIcon,
  Layers,
  MapPin,
  AlertTriangle,
  Radio,
  Route,
  Home,
  HeartPulse,
  Search,
  Crosshair,
  Maximize2,
  Filter,
  Satellite,
} from 'lucide-react';
import { NerMap } from '@/components/NerMap';
import { Card, CardHeader } from '@/components/ui';
import { RiskBadge, SensorStatusBadge } from '@/components/ui/Badge';
import {
  locations,
  riskZones,
  riskScores,
  soilSensors,
  villages,
  hospitals,
  roads,
} from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import { filterByDistrict, isDistrictOfficer } from '@/context/AppContext';
import type { NERState } from '@/types';
import type { GeocodingResult } from '@/services/openMeteo';

const nerStates: (NERState | 'All')[] = [
  'All',
  'Assam',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Sikkim',
  'Manipur',
  'Arunachal Pradesh',
  'Tripura',
];

export function RiskMapPage() {
  const { user, selectedLocation } = useApp();
  const [selectedState, setSelectedState] = useState<NERState | 'All'>('All');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(() => {
    const districtLocs = filterByDistrict(locations, user);
    return districtLocs[0]?.id || 'loc-aizawl';
  });
  const [searchQuery, setSearchQuery] = useState('');

  const districtLocations = filterByDistrict(locations, user);
  const districtLocIds = new Set(districtLocations.map((l) => l.id));

  const filteredLocations = districtLocations.filter((loc) => {
    const matchesState = selectedState === 'All' || loc.state === selectedState;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  const selectedLoc = districtLocations.find((l) => l.id === selectedLocationId) || districtLocations[0] || locations[0];
  const selectedZone = riskZones.find((z) => z.locationId === selectedLocationId);
  const selectedScore = riskScores.find((s) => s.locationId === selectedLocationId);
  const nearbySensors = soilSensors.filter((s) => districtLocIds.has(s.locationId) && s.locationId === selectedLocationId);
  const nearbyVillages = villages.filter((v) => districtLocIds.has(v.locationId) && v.locationId === selectedLocationId);
  const nearbyHospitals = hospitals.filter((h) => districtLocIds.has(h.locationId) && h.locationId === selectedLocationId);
  const nearbyRoads = roads.filter((r) => districtLocIds.has(r.locationId) && r.locationId === selectedLocationId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <MapIcon className="w-4 h-4" /> GIS Geospatial Intelligence
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            {isDistrictOfficer(user) ? `${user?.district || 'District'} — Risk Map` : 'North-East Landslide Hazard & Risk Map'}
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            {isDistrictOfficer(user)
              ? 'District-bounded topological surveillance with sensor telemetry, roads, and village isolation mapping'
              : 'Multi-layered topological surveillance with sensor telemetry, roads, and village isolation mapping'}
          </p>
        </div>

        {/* State Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {nerStates.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                selectedState === st
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-navy-800 text-navy-400 hover:text-navy-200 border border-navy-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Telemetry Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Section (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-0 overflow-hidden">
            <div className="p-3 bg-navy-800/80 border-b border-navy-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-navy-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-400" /> Active GIS Layers:
                </span>
                <span className="text-navy-400">Landslide Hazard Zones • IoT Soil Sensors • NH Corridors • Settlements</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-navy-400">Focus:</span>
                <span className="font-bold text-blue-400">
                  {selectedLoc.name} ({selectedLoc.district}, {selectedLoc.state})
                </span>
              </div>
            </div>

            <div className="p-4">
              <NerMap
                selectedLocationId={selectedLocationId}
                onSelectLocation={(id) => setSelectedLocationId(id)}
                height="560px"
                searchLocation={selectedLocation ? {
                  lat: selectedLocation.latitude,
                  lng: selectedLocation.longitude,
                  name: selectedLocation.name,
                  risk: riskZones.find((z) => z.locationId === selectedLocationId)?.risk,
                } : null}
              />
            </div>
          </Card>

          {/* District Quick Select Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {(isDistrictOfficer(user) ? districtLocations : locations).map((loc) => {
              const zone = riskZones.find((z) => z.locationId === loc.id);
              const isSelected = loc.id === selectedLocationId;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocationId(loc.id)}
                  className={`p-2 rounded-lg text-left transition-all border ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-navy-900 border-navy-700/60 hover:bg-navy-800'
                  }`}
                >
                  <p className="font-semibold text-xs text-navy-100 truncate">{loc.name}</p>
                  <p className="text-[10px] text-navy-400 truncate">{loc.state}</p>
                  <div className="mt-1">
                    {zone && <RiskBadge level={zone.risk} size="sm" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Details & Critical Factors Drawer (1 Column) */}
        <div className="space-y-4">
          <Card className="p-4 border-blue-500/30">
            <div className="flex items-start justify-between border-b border-navy-700/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">
                  Location Intelligence
                </span>
                <h2 className="text-xl font-bold text-navy-100">{selectedLoc.name}</h2>
                <p className="text-xs text-navy-400">
                  {selectedLoc.district}, {selectedLoc.state}
                </p>
                <p className="text-[11px] text-navy-500 mt-0.5">
                  Lat: {selectedLoc.lat.toFixed(4)}°N • Lng: {selectedLoc.lng.toFixed(4)}°E • Elevation: {selectedLoc.elevation}m
                </p>
              </div>
              {selectedZone && <RiskBadge level={selectedZone.risk} size="md" />}
            </div>

            {/* Risk Probability & Advisory */}
            <div className="mt-3 space-y-3">
              <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/50">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-navy-400">Failure Probability</span>
                  <span className="font-bold text-red-400">{selectedScore?.probability ?? 82}%</span>
                </div>
                <div className="w-full bg-navy-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 h-full rounded-full"
                    style={{ width: `${selectedScore?.probability ?? 82}%` }}
                  />
                </div>
                <p className="text-[10px] text-navy-400 mt-1.5">
                  Critical window: <span className="text-amber-400 font-semibold">{selectedScore?.riskWindow ?? 'Next 12–24h'}</span>
                </p>
              </div>

              {/* Environmental Sensor Telemetry */}
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-navy-200 text-xs uppercase tracking-wide">
                  Topological Factors
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-navy-800/50 border border-navy-700/40">
                    <span className="text-navy-400 text-[10px] block">24h Rainfall</span>
                    <span className="font-bold text-blue-300 text-sm">{selectedScore?.rainfall ?? 142} mm</span>
                  </div>
                  <div className="p-2 rounded bg-navy-800/50 border border-navy-700/40">
                    <span className="text-navy-400 text-[10px] block">Soil Saturation</span>
                    <span className="font-bold text-cyan-300 text-sm">{selectedScore?.soilMoisture ?? 78}%</span>
                  </div>
                  <div className="p-2 rounded bg-navy-800/50 border border-navy-700/40">
                    <span className="text-navy-400 text-[10px] block">Slope Gradient</span>
                    <span className="font-bold text-navy-100 text-sm">{selectedScore?.slope ?? 42}°</span>
                  </div>
                  <div className="p-2 rounded bg-navy-800/50 border border-navy-700/40">
                    <span className="text-navy-400 text-[10px] block">Historical Events</span>
                    <span className="font-bold text-navy-100 text-sm">{selectedScore?.historicalLandslides ?? 8} recorded</span>
                  </div>
                </div>
              </div>

              {/* Nearest Settlements & Infrastructure */}
              <div className="space-y-2 pt-2 border-t border-navy-700/50 text-xs">
                <h4 className="font-semibold text-navy-200 text-xs uppercase tracking-wide">
                  Exposed Infrastructure
                </h4>

                {nearbyVillages.length > 0 && (
                  <div className="p-2 rounded bg-navy-800/50 border border-navy-700/40">
                    <div className="flex items-center gap-1.5 text-navy-300 font-semibold mb-1">
                      <Home className="w-3.5 h-3.5 text-amber-400" /> Vulnerable Villages ({nearbyVillages.length})
                    </div>
                    {nearbyVillages.map((v) => (
                      <div key={v.id} className="text-[11px] text-navy-400 flex justify-between">
                        <span>{v.name} (Pop. {v.population})</span>
                        <span className="text-red-400">{v.distanceToHazard}km from scarp</span>
                      </div>
                    ))}
                  </div>
                )}

                {nearbyRoads.length > 0 && (
                  <div className="p-2 rounded bg-navy-800/50 border border-navy-700/40">
                    <div className="flex items-center gap-1.5 text-navy-300 font-semibold mb-1">
                      <Route className="w-3.5 h-3.5 text-blue-400" /> Corridors ({nearbyRoads.length})
                    </div>
                    {nearbyRoads.map((r) => (
                      <div key={r.id} className="text-[11px] text-navy-400 flex justify-between">
                        <span>{r.name}</span>
                        <span className={r.condition === 'Blocked' ? 'text-red-400 font-bold' : 'text-orange-400'}>
                          {r.condition}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {nearbyHospitals.length > 0 && (
                  <div className="p-2 rounded bg-navy-800/50 border border-navy-700/40">
                    <div className="flex items-center gap-1.5 text-navy-300 font-semibold mb-1">
                      <HeartPulse className="w-3.5 h-3.5 text-green-400" /> Emergency Facility
                    </div>
                    {nearbyHospitals.map((h) => (
                      <div key={h.id} className="text-[11px] text-navy-400">
                        <p className="text-navy-200 font-medium">{h.name}</p>
                        <p className="text-[10px] text-navy-500">{h.beds} Beds • {h.emergencyCapacity} Emergency Trauma Units</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
