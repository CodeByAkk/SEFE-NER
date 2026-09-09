import { useState, useMemo } from 'react';
import {
  Brain,
  Sliders,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  Activity,
  Layers,
  MapPin,
  CheckCircle2,
  Satellite,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui';
import { RiskBadge } from '@/components/ui/Badge';
import { locations } from '@/data/demoData';
import { calculateRiskScore, getRiskInputsForLocation } from '@/services/riskEngine';
import { fetchNASAPowerForecast, fetchNASARainfallForLocation, getNASALocationById } from '@/services/nasaApi';
import type { Location } from '@/types';

export function RiskPredictionPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);
  const [nasaLoading, setNasaLoading] = useState(false);
  const [nasaError, setNasaError] = useState<string | null>(null);
  const [lastNasaSync, setLastNasaSync] = useState<string | null>(null);

  // Initial inputs from selected location
  const initialInputs = useMemo(
    () => getRiskInputsForLocation(selectedLocation),
    [selectedLocation]
  );

  const [rainfall, setRainfall] = useState<number>(initialInputs.rainfall);
  const [rainfallForecast, setRainfallForecast] = useState<number>(initialInputs.rainfallForecast);
  const [soilMoisture, setSoilMoisture] = useState<number>(initialInputs.soilMoisture);
  const [slope, setSlope] = useState<number>(initialInputs.slope);
  const [roadCutting, setRoadCutting] = useState<number>(initialInputs.roadCuttingVulnerability);
  const [historicalFrequency, setHistoricalFrequency] = useState<number>(initialInputs.historicalFrequency);
  const [citizenReports, setCitizenReports] = useState<number>(initialInputs.citizenReports);

  const syncNASAData = async () => {
    setNasaLoading(true);
    setNasaError(null);
    try {
      const nasaLoc = getNASALocationById(selectedLocation.id) || getNASALocationByCoords(selectedLocation.lat, selectedLocation.lng);
      if (!nasaLoc) {
        setNasaError('No NASA coordinates mapped for this location');
        setNasaLoading(false);
        return;
      }

      const [forecast, rainfallData] = await Promise.all([
        fetchNASAPowerForecast(nasaLoc.lat, nasaLoc.lng),
        fetchNASARainfallForLocation(nasaLoc.lat, nasaLoc.lng),
      ]);

      if (forecast.length > 0) {
        const latest = forecast[forecast.length - 1];
        setRainfall(Number(latest.rainfall.toFixed(1)));
        setSoilMoisture(Number(latest.soilMoisture.toFixed(1)));
        setRainfallForecast(Number((latest.rainfall * 1.2).toFixed(1)));
      }

      if (rainfallData) {
        setRainfall(Number(rainfallData.current.toFixed(1)));
      }

      setLastNasaSync(new Date().toLocaleTimeString());
    } catch (e) {
      setNasaError('Failed to fetch NASA data. Please try again.');
    } finally {
      setNasaLoading(false);
    }
  };

  function getNASALocationByCoords(lat: number, lng: number) {
    const locs = [
      { id: 'loc-aizawl', name: 'Aizawl', district: 'Aizawl', state: 'Mizoram', lat: 23.7271, lng: 91.7176 },
      { id: 'loc-shillong', name: 'Shillong', district: 'East Khasi Hills', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },
      { id: 'loc-guwahati', name: 'Guwahati', district: 'Kamrup', state: 'Assam', lat: 26.1445, lng: 91.7362 },
      { id: 'loc-imphal', name: 'Imphal', district: 'Imphal West', state: 'Manipur', lat: 24.817, lng: 93.9368 },
      { id: 'loc-kohima', name: 'Kohima', district: 'Kohima', state: 'Nagaland', lat: 25.6586, lng: 94.1103 },
      { id: 'loc-agartala', name: 'Agartala', district: 'West Tripura', state: 'Tripura', lat: 23.8315, lng: 91.2868 },
      { id: 'loc-itanagar', name: 'Itanagar', district: 'Papum Pare', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053 },
      { id: 'loc-gangtok', name: 'Gangtok', district: 'East Sikkim', state: 'Sikkim', lat: 27.3389, lng: 88.6065 },
    ];
    return locs.find((l) => Math.abs(l.lat - lat) < 0.1 && Math.abs(l.lng - lng) < 0.1);
  }

  // Live calculated risk score
  const computedScore = useMemo(() => {
    return calculateRiskScore({
      locationId: selectedLocation.id,
      rainfall,
      rainfallForecast,
      soilMoisture,
      slope,
      elevation: selectedLocation.elevation,
      terrainVulnerability: initialInputs.terrainVulnerability,
      landCover: initialInputs.landCover,
      historicalFrequency,
      roadCuttingVulnerability: roadCutting,
      satelliteChangeIndicator: initialInputs.satelliteChangeIndicator,
      citizenReports,
      fieldOfficerReports: initialInputs.fieldOfficerReports,
    });
  }, [
    selectedLocation,
    rainfall,
    rainfallForecast,
    soilMoisture,
    slope,
    roadCutting,
    historicalFrequency,
    citizenReports,
    initialInputs,
  ]);

  const loadScenario = (preset: 'monsoon' | 'dry' | 'roadcut' | 'extreme') => {
    switch (preset) {
      case 'monsoon':
        setRainfall(185);
        setRainfallForecast(220);
        setSoilMoisture(86);
        setSlope(44);
        setRoadCutting(65);
        setCitizenReports(6);
        break;
      case 'dry':
        setRainfall(15);
        setRainfallForecast(20);
        setSoilMoisture(32);
        setSlope(25);
        setRoadCutting(20);
        setCitizenReports(0);
        break;
      case 'roadcut':
        setRainfall(95);
        setRainfallForecast(110);
        setSoilMoisture(68);
        setSlope(48);
        setRoadCutting(90);
        setCitizenReports(3);
        break;
      case 'extreme':
        setRainfall(260);
        setRainfallForecast(290);
        setSoilMoisture(96);
        setSlope(52);
        setRoadCutting(85);
        setCitizenReports(12);
        break;
    }
  };

  const resetToLocationDefaults = () => {
    const fresh = getRiskInputsForLocation(selectedLocation);
    setRainfall(fresh.rainfall);
    setRainfallForecast(fresh.rainfallForecast);
    setSoilMoisture(fresh.soilMoisture);
    setSlope(fresh.slope);
    setRoadCutting(fresh.roadCuttingVulnerability);
    setHistoricalFrequency(fresh.historicalFrequency);
    setCitizenReports(fresh.citizenReports);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Brain className="w-4 h-4" /> Predictive Geotechnical Modeling
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            AI Landslide Risk Prediction Sandbox
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Multi-parametric machine learning engine modeling pore water pressure, slope kinematics, and precipitation thresholds
          </p>
        </div>

        {/* Preset buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-navy-400 font-medium">Scenarios:</span>
          <button
            onClick={() => loadScenario('monsoon')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-blue-300 border border-navy-700"
          >
            🌧️ Monsoon Surge
          </button>
          <button
            onClick={() => loadScenario('extreme')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-950/60 text-red-300 border border-red-500/30"
          >
            ⚠️ Cloudburst Disaster
          </button>
          <button
            onClick={() => loadScenario('roadcut')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-amber-300 border border-navy-700"
          >
            🚜 Road Cutting Stress
          </button>
          <button
            onClick={() => loadScenario('dry')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-green-300 border border-navy-700"
          >
            ☀️ Dry Baseline
          </button>
          <button
            onClick={resetToLocationDefaults}
            className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-400 border border-navy-700"
            title="Reset to location values"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={syncNASAData}
            disabled={nasaLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 flex items-center gap-1.5 disabled:opacity-50"
            title="Sync real NASA POWER weather data"
          >
            <Satellite className="w-3.5 h-3.5" />
            {nasaLoading ? 'Syncing...' : 'NASA Live Data'}
          </button>
          {lastNasaSync && (
            <span className="text-[10px] text-navy-500">Last sync: {lastNasaSync}</span>
          )}
          {nasaError && (
            <span className="text-[10px] text-red-400">{nasaError}</span>
          )}
        </div>
      </div>

      {/* Target Location Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-navy-400 font-medium whitespace-nowrap">Selected Sector:</span>
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => {
              setSelectedLocation(loc);
              const fresh = getRiskInputsForLocation(loc);
              setRainfall(fresh.rainfall);
              setRainfallForecast(fresh.rainfallForecast);
              setSoilMoisture(fresh.soilMoisture);
              setSlope(fresh.slope);
              setRoadCutting(fresh.roadCuttingVulnerability);
              setHistoricalFrequency(fresh.historicalFrequency);
              setCitizenReports(fresh.citizenReports);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              selectedLocation.id === loc.id
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-navy-900 border-navy-700/60 text-navy-300 hover:bg-navy-800'
            }`}
          >
            {loc.name}, {loc.state}
          </button>
        ))}
      </div>

      {/* 2-Column Grid: Sliders on Left, Live Model Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-5">
            <CardHeader
              title="Environmental & Topological Controls"
              subtitle="Modify variables in real time to simulate geotechnical slope stress"
              icon={<Sliders className="w-5 h-5" />}
            />

            {/* Slider: 24h Rainfall */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-navy-200">24-Hour Precipitation</span>
                <span className="font-mono font-bold text-blue-400 text-sm">{rainfall} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-navy-500">
                <span>0 mm (Normal)</span>
                <span>120 mm (Hazard Threshold)</span>
                <span>300 mm (Torrential)</span>
              </div>
            </div>

            {/* Slider: Soil Saturation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-navy-200">Soil Saturation / Pore Moisture</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{soilMoisture}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-navy-500">
                <span>0% (Dry)</span>
                <span>70% (Liquid Limit Warning)</span>
                <span>100% (Complete Liquefaction)</span>
              </div>
            </div>

            {/* Slider: Slope Angle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-navy-200">Terrain Slope Gradient</span>
                <span className="font-mono font-bold text-navy-100 text-sm">{slope}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="65"
                value={slope}
                onChange={(e) => setSlope(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-navy-500">
                <span>5° (Gentle)</span>
                <span>35° (Angle of Repose)</span>
                <span>65° (Precipitous Cliff)</span>
              </div>
            </div>

            {/* Slider: Road Cutting Vulnerability */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-navy-200">Road Cutting & Excavation Disturbance</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{roadCutting} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={roadCutting}
                onChange={(e) => setRoadCutting(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-navy-500">
                <span>Natural Untouched Hillside</span>
                <span>Moderate Widening</span>
                <span>Extensive Toe Excavation</span>
              </div>
            </div>

            {/* Slider: Citizen Reports */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-navy-200">Field / Citizen Incident Reports</span>
                <span className="font-mono font-bold text-red-400 text-sm">{citizenReports} Active</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={citizenReports}
                onChange={(e) => setCitizenReports(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-navy-500">
                <span>0 reports</span>
                <span>5 cracks sighted</span>
                <span>15 active slide reports</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Model Output (1 Col) */}
        <div className="space-y-4">
          <Card className="p-4 space-y-4 border-blue-500/30">
            <div className="flex items-start justify-between border-b border-navy-700/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">
                  Real-Time AI Output
                </span>
                <h3 className="text-xl font-bold text-navy-100">{selectedLocation.name}</h3>
                <p className="text-xs text-navy-400">{selectedLocation.district}, {selectedLocation.state}</p>
              </div>
              <RiskBadge level={computedScore.level} size="md" />
            </div>

            {/* Composite Risk Score Gauge */}
            <div className="p-4 rounded-xl bg-navy-800/80 border border-navy-700/60 text-center">
              <span className="text-xs text-navy-400 uppercase font-semibold">
                Computed Hazard Index
              </span>
              <div className="my-2">
                <span className="text-5xl font-extrabold text-navy-100 tracking-tight font-mono">
                  {computedScore.score}
                </span>
                <span className="text-sm font-semibold text-navy-400"> / 100</span>
              </div>
              <div className="w-full bg-navy-900 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    computedScore.level === 'CRITICAL'
                      ? 'bg-red-500'
                      : computedScore.level === 'HIGH'
                      ? 'bg-orange-500'
                      : computedScore.level === 'MODERATE'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${computedScore.score}%` }}
                />
              </div>
              <p className="text-xs text-navy-300">
                Failure Probability: <span className="font-bold text-red-400">{computedScore.probability}%</span>
              </p>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-navy-200 uppercase tracking-wide">
                Component Contributions
              </h4>
              <div className="space-y-2 text-xs">
                {computedScore.factors.map((factor, idx) => (
                  <div key={idx} className="p-2 rounded bg-navy-800/50 border border-navy-700/40">
                    <div className="flex justify-between font-medium text-navy-200">
                      <span>{factor.name}</span>
                      <span className="text-blue-400 font-bold">+{factor.contribution} pts</span>
                    </div>
                    <p className="text-[10px] text-navy-400 mt-0.5">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advisory */}
            <div className="p-3.5 rounded-lg bg-navy-800/80 border border-navy-700/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4" /> AI Emergency Directive
              </div>
              <p className="text-xs text-navy-300 leading-relaxed">
                {computedScore.recommendedAction}
              </p>
              <p className="text-[10px] text-navy-400 pt-1">
                Risk Horizon: <span className="font-semibold text-navy-200">{computedScore.riskWindow}</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
