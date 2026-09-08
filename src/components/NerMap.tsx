import { useState, useRef, useEffect, useMemo, type ReactNode } from 'react';
import { ZoomIn, ZoomOut, Layers, Search, MapPin, Crosshair } from 'lucide-react';
import { riskZones, locations, incidentReports, roads, villages, hospitals, soilSensors } from '@/data/demoData';
import { getRiskColor, getRiskLevel } from '@/services/riskEngine';
import type { RiskLevel } from '@/types';

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

// NER India bounding box (approx)
const NER_BOUNDS = {
  minLng: 88.0,
  maxLng: 97.5,
  minLat: 21.9,
  maxLat: 28.5,
};

// State boundary polygons (simplified approximations for visual representation)
const stateShapes: Record<string, { name: string; path: string }> = {
  sikkim: {
    name: 'Sikkim',
    path: 'M 80 180 L 120 160 L 140 175 L 135 210 L 110 220 L 85 205 Z',
  },
  arunachal: {
    name: 'Arunachal Pradesh',
    path: 'M 350 80 L 580 75 L 620 110 L 590 145 L 500 150 L 420 140 L 370 120 Z',
  },
  assam: {
    name: 'Assam',
    path: 'M 200 150 L 370 140 L 420 140 L 460 160 L 440 195 L 350 205 L 280 200 L 220 190 L 200 170 Z',
  },
  nagaland: {
    name: 'Nagaland',
    path: 'M 460 165 L 510 160 L 530 185 L 520 210 L 490 215 L 465 200 Z',
  },
  manipur: {
    name: 'Manipur',
    path: 'M 430 195 L 490 200 L 500 225 L 470 245 L 435 240 L 420 220 Z',
  },
  mizoram: {
    name: 'Mizoram',
    path: 'M 330 250 L 400 245 L 420 270 L 410 300 L 370 310 L 335 295 L 320 275 Z',
  },
  meghalaya: {
    name: 'Meghalaya',
    path: 'M 170 170 L 220 165 L 240 190 L 225 215 L 185 215 L 165 195 Z',
  },
  tripura: {
    name: 'Tripura',
    path: 'M 240 230 L 280 225 L 290 250 L 275 275 L 245 270 L 235 250 Z',
  },
};

// Convert lat/lng to SVG coordinates
function project(lat: number, lng: number, width: number, height: number) {
  const x = ((lng - NER_BOUNDS.minLng) / (NER_BOUNDS.maxLng - NER_BOUNDS.minLng)) * width;
  const y = ((NER_BOUNDS.maxLat - lat) / (NER_BOUNDS.maxLat - NER_BOUNDS.minLat)) * height;
  return { x, y };
}

export function NerMap({
  selectedLocationId,
  onSelectLocation,
  height: containerHeight = '500px',
  showLayerControl = true,
  showSearch = true,
}: NerMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof locations>([]);
  const [showLayers, setShowLayers] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'risk', label: 'Landslide Risk', icon: <MapPin className="w-4 h-4" />, visible: true },
    { id: 'incidents', label: 'Citizen Reports', icon: <MapPin className="w-4 h-4" />, visible: true },
    { id: 'sensors', label: 'Sensors', icon: <Crosshair className="w-4 h-4" />, visible: true },
    { id: 'roads', label: 'Roads', icon: <MapPin className="w-4 h-4" />, visible: false },
    { id: 'villages', label: 'Villages', icon: <MapPin className="w-4 h-4" />, visible: false },
    { id: 'hospitals', label: 'Hospitals', icon: <MapPin className="w-4 h-4" />, visible: false },
    { id: 'nasa-imagery', label: 'NASA Satellite', icon: <Layers className="w-4 h-4" />, visible: false },
  ]);

  const width = 700;
  const height = 400;

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = locations.filter(
      (l) => l.name.toLowerCase().includes(q) || l.district.toLowerCase().includes(q) || l.state.toLowerCase().includes(q),
    );
    setSearchResults(results);
  }, [searchQuery]);

  const toggleLayer = (id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const transform = `translate(${width / 2 + pan.x}, ${height / 2 + pan.y}) scale(${zoom}) translate(${-width / 2}, ${-height / 2})`;

  const selectedZone = riskZones.find((z) => z.locationId === selectedLocationId);

  const visibleIncidents = useMemo(() => layers.find((l) => l.id === 'incidents')?.visible ? incidentReports : [], [layers]);
  const visibleSensors = useMemo(() => layers.find((l) => l.id === 'sensors')?.visible ? soilSensors : [], [layers]);
  const visibleVillages = useMemo(() => layers.find((l) => l.id === 'villages')?.visible ? villages : [], [layers]);
  const visibleHospitals = useMemo(() => layers.find((l) => l.id === 'hospitals')?.visible ? hospitals : [], [layers]);
  const visibleRoads = useMemo(() => layers.find((l) => l.id === 'roads')?.visible ? roads : [], [layers]);

  return (
    <div className="relative card overflow-hidden" style={{ height: containerHeight }}>
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
              className="input pl-9 text-sm"
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
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(zone.risk) }} />
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
            className="btn-secondary p-2 rounded-lg"
            title="Map Layers"
          >
            <Layers className="w-4 h-4" />
          </button>
          {showLayers && (
            <div className="absolute top-full mt-1 right-0 bg-navy-800 border border-navy-700 rounded-lg shadow-xl p-2 w-48 z-30">
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
            </div>
          )}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1">
        <button onClick={() => handleZoom(0.2)} className="btn-secondary p-2 rounded-lg" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => handleZoom(-0.2)} className="btn-secondary p-2 rounded-lg" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="btn-secondary p-2 rounded-lg" title="Reset View">
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Map */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full cursor-grab"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <radialGradient id="zoneGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={transform}>
          {/* Background */}
          <rect x="0" y="0" width={width} height={height} fill="#0a1929" />

          {/* NASA Satellite Imagery Layer */}
          {layers.find((l) => l.id === 'nasa-imagery')?.visible && (
            <image
              x="0"
              y="0"
              width={width}
              height={height}
              href="https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?service=WMS&version=1.3.0&request=GetMap&layers=MODIS_Terra_CorrectedReflectance_TrueColor&styles=&crs=EPSG:4326&bbox=88.0,21.9,97.5,28.5&width=700&height=400&format=image/png&transparent=true"
              preserveAspectRatio="xMidYMid slice"
              opacity="0.6"
            />
          )}

          {/* State boundaries */}
          {Object.entries(stateShapes).map(([key, state]) => (
            <path
              key={key}
              d={state.path}
              fill="#162d4a"
              fillOpacity="0.5"
              stroke="#243b53"
              strokeWidth="1"
              className="transition-all"
            />
          ))}

          {/* State labels */}
          {Object.entries(stateShapes).map(([key, state]) => {
            const loc = locations.find((l) => l.state === state.name);
            if (!loc) return null;
            const p = project(loc.lat, loc.lng, width, height);
            return (
              <text
                key={`label-${key}`}
                x={p.x}
                y={p.y - 15}
                textAnchor="middle"
                className="fill-navy-500 text-[8px] pointer-events-none font-medium"
              >
                {state.name}
              </text>
            );
          })}

          {/* Risk zones */}
          {layers.find((l) => l.id === 'risk')?.visible && riskZones.map((zone) => {
            const loc = locations.find((l) => l.id === zone.locationId);
            if (!loc) return null;
            const p = project(loc.lat, loc.lng, width, height);
            const color = getRiskColor(zone.risk);
            const isSelected = selectedLocationId === zone.locationId;
            const isHovered = hoveredLocation === zone.locationId;
            const radius = (zone.radius / 15000) * 20 * (isSelected ? 1.3 : isHovered ? 1.15 : 1);

            return (
              <g key={zone.locationId}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radius}
                  fill={color}
                  fillOpacity={isSelected ? 0.35 : 0.2}
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={isSelected ? 0.8 : 0.5}
                  className="cursor-pointer transition-all"
                  onClick={() => onSelectLocation?.(zone.locationId)}
                  onMouseEnter={() => setHoveredLocation(zone.locationId)}
                  onMouseLeave={() => setHoveredLocation(null)}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={color}
                  filter={zone.risk === 'CRITICAL' ? 'url(#glow)' : undefined}
                  className="cursor-pointer transition-all"
                  onClick={() => onSelectLocation?.(zone.locationId)}
                />
                {(isSelected || isHovered) && (
                  <text
                    x={p.x}
                    y={p.y - radius - 5}
                    textAnchor="middle"
                    className="fill-navy-100 text-[9px] pointer-events-none font-semibold"
                  >
                    {loc.name} ({zone.score})
                  </text>
                )}
              </g>
            );
          })}

          {/* Roads */}
          {visibleRoads.map((road) => {
            const loc = locations.find((l) => l.id === road.locationId);
            if (!loc) return null;
            const p = project(loc.lat, loc.lng, width, height);
            const color = road.risk === 'CRITICAL' ? '#ef4444' : road.risk === 'HIGH' ? '#f97316' : road.risk === 'MODERATE' ? '#eab308' : '#22c55e';
            return (
              <line
                key={road.id}
                x1={p.x - 10}
                y1={p.y + 8}
                x2={p.x + 10}
                y2={p.y + 8}
                stroke={color}
                strokeWidth="2"
                strokeDasharray="4 2"
                className="pointer-events-none"
              />
            );
          })}

          {/* Villages */}
          {visibleVillages.map((v) => {
            const loc = locations.find((l) => l.id === v.locationId);
            if (!loc) return null;
            const p = project(loc.lat + 0.01, loc.lng - 0.01, width, height);
            return (
              <g key={v.id}>
                <rect x={p.x - 3} y={p.y - 3} width="6" height="6" fill="#829ab1" fillOpacity="0.7" className="pointer-events-none" />
              </g>
            );
          })}

          {/* Hospitals */}
          {visibleHospitals.map((h) => {
            const p = project(h.lat + 0.02, h.lng + 0.02, width, height);
            return (
              <g key={h.id}>
                <rect x={p.x - 4} y={p.y - 4} width="8" height="8" fill="#06b6d4" fillOpacity="0.8" rx="1" className="pointer-events-none" />
                <text x={p.x} y={p.y + 3} textAnchor="middle" className="fill-white text-[7px] font-bold pointer-events-none">H</text>
              </g>
            );
          })}

          {/* Incident markers */}
          {visibleIncidents.map((inc) => {
            const p = project(inc.lat, inc.lng, width, height);
            return (
              <g key={inc.id}>
                <circle cx={p.x} cy={p.y} r="5" fill="#ef4444" fillOpacity="0.8" stroke="#fff" strokeWidth="1" className="cursor-pointer animate-pulse" />
                <circle cx={p.x} cy={p.y} r="3" fill="#fff" className="pointer-events-none" />
              </g>
            );
          })}

          {/* Sensor markers */}
          {visibleSensors.map((sensor) => {
            const p = project(sensor.lat, sensor.lng, width, height);
            const color = sensor.status === 'CRITICAL' ? '#ef4444' : sensor.status === 'WARNING' ? '#eab308' : sensor.status === 'OFFLINE' ? '#627d98' : '#22c55e';
            return (
              <g key={sensor.id}>
                <circle cx={p.x} cy={p.y} r="3" fill={color} fillOpacity="0.8" stroke="#0a1929" strokeWidth="0.5" className="pointer-events-none" />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-navy-900/80 backdrop-blur-sm border border-navy-700/50 rounded-lg p-2">
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
      {selectedZone && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-navy-800/90 backdrop-blur-sm border border-navy-600 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(selectedZone.risk) }} />
          <span className="text-sm text-navy-100 font-medium">
            {locations.find((l) => l.id === selectedZone.locationId)?.name} — Risk: {selectedZone.score}/100
          </span>
        </div>
      )}
    </div>
  );
}
