import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { ZoomIn, ZoomOut, Layers, Search, MapPin, Crosshair, Satellite } from 'lucide-react';
import L from 'leaflet';
import { riskZones, locations, incidentReports, roads, villages, hospitals, soilSensors } from '@/data/demoData';
import { getRiskColor } from '@/services/riskEngine';
import type { RiskLevel } from '@/types';

// Fix default marker icon paths in Leaflet with bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapLayer {
  id: string;
  label: string;
  icon: ReactNode;
  visible: boolean;
}

interface NerMapProps {
  selectedLocationId?: string;
  onSelectLocation?: (locationId: string) => void;
  height?: string;
  showLayerControl?: boolean;
  showSearch?: boolean;
}

// NER India bounding box
const NER_BOUNDS = {
  minLng: 88.0,
  maxLng: 97.5,
  minLat: 21.9,
  maxLat: 28.5,
};

// NASA GIBS tile layers
const NASA_TILE_LAYERS = {
  'MODIS Terra': 'MODIS_Terra_CorrectedReflectance_TrueColor',
  'VIIRS Day': 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
  'MODIS LST': 'MODIS_Terra_Land_Surface_Temp_Day',
  'MODIS NDVI': 'MODIS_Terra_NDVI_8Day',
};

const stateShapes: Record<string, { name: string; path: string }> = {
  sikkim: { name: 'Sikkim', path: 'M 80 180 L 120 160 L 140 175 L 135 210 L 110 220 L 85 205 Z' },
  arunachal: { name: 'Arunachal Pradesh', path: 'M 350 80 L 580 75 L 620 110 L 590 145 L 500 150 L 420 140 L 370 120 Z' },
  assam: { name: 'Assam', path: 'M 200 150 L 370 140 L 420 140 L 460 160 L 440 195 L 350 205 L 280 200 L 220 190 L 200 170 Z' },
  nagaland: { name: 'Nagaland', path: 'M 460 165 L 510 160 L 530 185 L 520 210 L 490 215 L 465 200 Z' },
  manipur: { name: 'Manipur', path: 'M 430 195 L 490 200 L 500 225 L 470 245 L 435 240 L 420 220 Z' },
  mizoram: { name: 'Mizoram', path: 'M 330 250 L 400 245 L 420 270 L 410 300 L 370 310 L 335 295 L 320 275 Z' },
  meghalaya: { name: 'Meghalaya', path: 'M 170 170 L 220 165 L 240 190 L 225 215 L 185 215 L 165 195 Z' },
  tripura: { name: 'Tripura', path: 'M 240 230 L 280 225 L 290 250 L 275 275 L 245 270 L 235 250 Z' },
};

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

function MapClickHandler({ onSelectLocation }: { onSelectLocation?: (id: string) => void }) {
  useMapEvents({
    click(e) {
      if (!onSelectLocation) return;
      const { lat, lng } = e.latlng;
      const clicked = locations.find((loc) => {
        const dLat = Math.abs(loc.lat - lat);
        const dLng = Math.abs(loc.lng - lng);
        return dLat < 0.15 && dLng < 0.15;
      });
      if (clicked) onSelectLocation(clicked.id);
    },
  });
  return null;
}

export function NerMap({
  selectedLocationId,
  onSelectLocation,
  height: containerHeight = '500px',
  showLayerControl = true,
  showSearch = true,
}: NerMapProps) {
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'risk', label: 'Landslide Risk', icon: <MapPin className="w-4 h-4" />, visible: true },
    { id: 'incidents', label: 'Citizen Reports', icon: <MapPin className="w-4 h-4" />, visible: true },
    { id: 'sensors', label: 'Sensors', icon: <Crosshair className="w-4 h-4" />, visible: true },
    { id: 'roads', label: 'Roads', icon: <MapPin className="w-4 h-4" />, visible: false },
    { id: 'villages', label: 'Villages', icon: <MapPin className="w-4 h-4" />, visible: false },
    { id: 'hospitals', label: 'Hospitals', icon: <MapPin className="w-4 h-4" />, visible: false },
    { id: 'nasa-imagery', label: 'NASA Satellite', icon: <Satellite className="w-4 h-4" />, visible: false },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof locations>([]);
  const [showLayers, setShowLayers] = useState(false);
  const [nasaLayer, setNasaLayer] = useState<keyof typeof NASA_TILE_LAYERS>('MODIS Terra');
  const [mapKey, setMapKey] = useState(0);

  const center: [number, number] = [25.0, 92.5];
  const zoom = 7;

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = locations.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.district.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q),
    );
    setSearchResults(results);
  }, [searchQuery]);

  const toggleLayer = (id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  };

  const resetView = () => {
    setMapKey((k) => k + 1);
  };

  const visibleIncidents = useMemo(() => layers.find((l) => l.id === 'incidents')?.visible ? incidentReports : [], [layers]);
  const visibleSensors = useMemo(() => layers.find((l) => l.id === 'sensors')?.visible ? soilSensors : [], [layers]);
  const visibleVillages = useMemo(() => layers.find((l) => l.id === 'villages')?.visible ? villages : [], [layers]);
  const visibleHospitals = useMemo(() => layers.find((l) => l.id === 'hospitals')?.visible ? hospitals : [], [layers]);
  const visibleRoads = useMemo(() => layers.find((l) => l.id === 'roads')?.visible ? roads : [], [layers]);
  const showNasa = layers.find((l) => l.id === 'nasa-imagery')?.visible ?? false;

  const nasaTileUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?service=WMS&version=1.3.0&request=GetMap&layers=${NASA_TILE_LAYERS[nasaLayer]}&styles=&crs=EPSG:4326&bbox={bbox-epsg-3857}&width=256&height=256&format=image/png&transparent=true`;

  return (
    <div className="relative" style={{ height: containerHeight }}>
      {/* Search bar */}
      {showSearch && (
        <div className="absolute top-3 left-3 z-20 w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
            <input
              type="text"
              placeholder="Search district / village / road"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-800/90 backdrop-blur-sm border border-navy-700 rounded-lg pl-9 pr-3 py-2 text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-blue-500 shadow-lg"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-navy-800 border border-navy-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-30">
                {searchResults.map((loc) => {
                  const zone = riskZones.find((z) => z.locationId === loc.id);
                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation?.(loc.id);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-navy-700 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-navy-100">{loc.name}</p>
                        <p className="text-xs text-navy-500">{loc.district}, {loc.state}</p>
                      </div>
                      {zone && (
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getRiskColor(zone.risk) }} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Layer control */}
      {showLayerControl && (
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={() => setShowLayers(!showLayers)}
            className="bg-navy-800/90 backdrop-blur-sm border border-navy-700 rounded-lg p-2 text-navy-200 hover:text-white shadow-lg"
            title="Map Layers"
          >
            <Layers className="w-4 h-4" />
          </button>
          {showLayers && (
            <div className="absolute top-full mt-1 right-0 bg-navy-800 border border-navy-700 rounded-lg shadow-xl p-2 w-56 z-30">
              <p className="text-xs text-navy-400 font-semibold mb-2 px-1">Map Layers</p>
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-navy-700 rounded transition-colors text-sm"
                >
                  <span className={`w-4 h-4 rounded border ${layer.visible ? 'bg-blue-500 border-blue-500' : 'border-navy-600'} flex items-center justify-center`}>
                    {layer.visible && <span className="w-2 h-2 bg-white rounded-sm" />}
                  </span>
                  <span className="text-navy-200">{layer.label}</span>
                </button>
              ))}

              {showNasa && (
                <div className="mt-2 pt-2 border-t border-navy-700">
                  <p className="text-xs text-navy-400 font-semibold mb-1 px-1">NASA Satellite Layer</p>
                  <select
                    value={nasaLayer}
                    onChange={(e) => setNasaLayer(e.target.value as keyof typeof NASA_TILE_LAYERS)}
                    className="w-full bg-navy-900 border border-navy-700 rounded px-2 py-1 text-xs text-navy-200"
                  >
                    {Object.keys(NASA_TILE_LAYERS).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1">
        <button onClick={() => {}} className="bg-navy-800/90 backdrop-blur-sm border border-navy-700 rounded-lg p-2 text-navy-200 hover:text-white shadow-lg" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => {}} className="bg-navy-800/90 backdrop-blur-sm border border-navy-700 rounded-lg p-2 text-navy-200 hover:text-white shadow-lg" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={resetView} className="bg-navy-800/90 backdrop-blur-sm border border-navy-700 rounded-lg p-2 text-navy-200 hover:text-white shadow-lg" title="Reset View">
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        key={mapKey}
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-xl overflow-hidden border border-navy-700/50"
        zoomControl={false}
        attributionControl={false}
      >
        <MapController center={center} zoom={zoom} />
        <MapClickHandler onSelectLocation={onSelectLocation} />

        {/* Base map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={showNasa ? 0.4 : 0.9}
        />

        {/* NASA GIBS Satellite overlay */}
        {showNasa && (
          <TileLayer
            url={nasaTileUrl}
            opacity={0.7}
            zIndex={10}
          />
        )}

        {/* Risk Zones */}
        {layers.find((l) => l.id === 'risk')?.visible &&
          riskZones.map((zone) => {
            const loc = locations.find((l) => l.id === zone.locationId);
            if (!loc) return null;
            const color = getRiskColor(zone.risk);
            const isSelected = selectedLocationId === zone.locationId;
            const radius = (zone.radius / 15000) * 20 * (isSelected ? 1.3 : 1);

            return (
              <Marker key={zone.locationId} position={[loc.lat, loc.lng]}>
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold text-navy-100">{loc.name}</p>
                    <p className="text-navy-400">{loc.district}, {loc.state}</p>
                    <p className="mt-1 font-semibold" style={{ color }}>Risk: {zone.risk} ({zone.score}/100)</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Incidents */}
        {visibleIncidents.map((inc) => (
          <Marker key={inc.id} position={[inc.lat, inc.lng]}>
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-navy-100">{inc.type}</p>
                <p className="text-navy-400">{inc.description}</p>
                <p className="text-[10px] text-navy-500 mt-1">{inc.locationName} • {new Date(inc.timestamp).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Sensors */}
        {visibleSensors.map((sensor) => {
          const color = sensor.status === 'CRITICAL' ? '#ef4444' : sensor.status === 'WARNING' ? '#eab308' : sensor.status === 'OFFLINE' ? '#627d98' : '#22c55e';
          return (
            <Marker key={sensor.id} position={[sensor.lat, sensor.lng]}>
              <Popup>
                <div className="text-xs">
                  <p className="font-bold text-navy-100">{sensor.id}</p>
                  <p className="text-navy-400">{sensor.locationName}</p>
                  <p className="text-[10px] text-navy-500 mt-1">
                    Moisture: {sensor.soilMoisture}% • Temp: {sensor.temperature}°C • Battery: {sensor.battery}%
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Villages */}
        {visibleVillages.map((v) => {
          const loc = locations.find((l) => l.id === v.locationId);
          if (!loc) return null;
          return (
            <Marker key={v.id} position={[loc.lat + 0.01, loc.lng - 0.01]}>
              <Popup>
                <div className="text-xs">
                  <p className="font-bold text-navy-100">{v.name}</p>
                  <p className="text-navy-400">Pop: {v.population}</p>
                  <p className="text-[10px] text-red-400">{v.distanceToHazard}km from hazard</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Hospitals */}
        {visibleHospitals.map((h) => (
          <Marker key={h.id} position={[h.lat, h.lng]}>
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-navy-100">{h.name}</p>
                <p className="text-navy-400">{h.beds} Beds • {h.emergencyCapacity} Emergency</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-navy-900/90 backdrop-blur-sm border border-navy-700/50 rounded-lg p-2 shadow-lg">
        <div className="flex flex-col gap-1">
          {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getRiskColor(level) }} />
              <span className="text-xs text-navy-300">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected zone indicator */}
      {selectedLocationId && (() => {
        const zone = riskZones.find((z) => z.locationId === selectedLocationId);
        const loc = locations.find((l) => l.id === selectedLocationId);
        if (!zone || !loc) return null;
        return (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-navy-800/90 backdrop-blur-sm border border-navy-600 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(zone.risk) }} />
            <span className="text-sm text-navy-100 font-medium">
              {loc.name} — Risk: {zone.score}/100
            </span>
          </div>
        );
      })()}
    </div>
  );
}
