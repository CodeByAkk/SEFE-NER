import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Bell,
  Radio,
  Cpu,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  Shield,
  Volume2,
  Wifi,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui';
import { useApp } from '@/context/AppContext';

export function SettingsPage() {
  const { showToast } = useApp();

  // Settings states
  const [rainThreshold, setRainThreshold] = useState(120);
  const [soilThreshold, setSoilThreshold] = useState(75);
  const [inclinometerThreshold, setInclinometerThreshold] = useState(5);
  const [aiConfidenceFloor, setAiConfidenceFloor] = useState(85);
  const [autoSiren, setAutoSiren] = useState(false);
  const [smsGateway, setSmsGateway] = useState(true);
  const [capBroadcast, setCapBroadcast] = useState(true);
  const [radioMesh, setRadioMesh] = useState(true);
  const [citizenReportThreshold, setCitizenReportThreshold] = useState(3);
  const [offlineCacheEnabled, setOfflineCacheEnabled] = useState(true);

  const handleSaveSettings = () => {
    showToast('Platform configuration saved successfully! Telemetry engine re-calibrated.', 'success');
  };

  const handleResetDefaults = () => {
    setRainThreshold(120);
    setSoilThreshold(75);
    setInclinometerThreshold(5);
    setAiConfidenceFloor(85);
    setAutoSiren(false);
    setSmsGateway(true);
    setCapBroadcast(true);
    setRadioMesh(true);
    setCitizenReportThreshold(3);
    setOfflineCacheEnabled(true);
    showToast('Settings reset to GSI / NDMA national disaster baseline.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <SettingsIcon className="w-4 h-4" /> System Governance & Telemetry Tuning
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            Hazard Thresholds & Platform Configuration
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Configure automated alarm thresholds, multi-channel alerting gateways, and AI computer vision model parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 border border-navy-700 text-navy-300 flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Geotechnical Hazard Alarm Thresholds */}
        <Card className="p-5 space-y-4">
          <CardHeader
            title="Early Warning Sensor Trigger Thresholds"
            subtitle="Parameters that automatically trip early warning bulletins when breached"
            icon={<Sliders className="w-5 h-5 text-blue-400" />}
          />

          <div className="space-y-4 pt-2 text-xs">
            {/* 24h Rain Threshold */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-navy-200">24-Hour Cumulative Rainfall Threshold</span>
                <span className="font-mono font-bold text-blue-400 text-sm">{rainThreshold} mm</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="5"
                value={rainThreshold}
                onChange={(e) => setRainThreshold(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-[10px] text-navy-500 block">
                NDMA standard trigger: 120mm in high slope terrain.
              </span>
            </div>

            {/* Soil Moisture Threshold */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-navy-200">Soil Pore Saturation Warning Limit</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{soilThreshold}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="1"
                value={soilThreshold}
                onChange={(e) => setSoilThreshold(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-[10px] text-navy-500 block">
                Clay-shale liquid limit transition occurs at ~75% saturation.
              </span>
            </div>

            {/* Inclinometer Displacement Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-navy-200">Borehole Inclinometer Displacement Velocity</span>
                <span className="font-mono font-bold text-orange-400 text-sm">{inclinometerThreshold} mm/hr</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={inclinometerThreshold}
                onChange={(e) => setInclinometerThreshold(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-[10px] text-navy-500 block">
                Continuous acceleration &gt; 5mm/hr indicates tertiary creep preceding catastrophic failure.
              </span>
            </div>
          </div>
        </Card>

        {/* Section 2: Alert Dispatch & Broadcast Channels */}
        <Card className="p-5 space-y-4">
          <CardHeader
            title="Multi-Channel Alerting & Public Notification"
            subtitle="Automated dissemination to citizens and emergency personnel"
            icon={<Bell className="w-5 h-5 text-red-400" />}
          />

          <div className="space-y-3 pt-2 text-xs">
            {/* CAP-CP Cell Broadcast */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-navy-800/80 border border-navy-700/50">
              <div>
                <span className="font-bold text-navy-100 block">CAP-CP Cell Broadcast</span>
                <p className="text-[11px] text-navy-400">Direct tone & message pop-up on all cellular handsets in hazard geo-fence</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={capBroadcast}
                  onChange={(e) => setCapBroadcast(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-navy-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* SMS Gateway */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-navy-800/80 border border-navy-700/50">
              <div>
                <span className="font-bold text-navy-100 block">Bulk Citizen SMS Gateway</span>
                <p className="text-[11px] text-navy-400">Automated multi-lingual text alerts in English, Hindi, and regional tongues</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsGateway}
                  onChange={(e) => setSmsGateway(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-navy-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Radio Mesh */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-navy-800/80 border border-navy-700/50">
              <div>
                <span className="font-bold text-navy-100 block">LoRa Mesh Radio Relays</span>
                <p className="text-[11px] text-navy-400">Fallback emergency relay when cellular infrastructure collapses</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={radioMesh}
                  onChange={(e) => setRadioMesh(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-navy-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Outdoor Sirens */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-navy-800/80 border border-navy-700/50">
              <div>
                <span className="font-bold text-navy-100 block">Direct Acoustic Sirens</span>
                <p className="text-[11px] text-navy-400">Automatic activation of hill station acoustic sirens upon Level 4 red alert</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSiren}
                  onChange={(e) => setAutoSiren(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-navy-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Section 3: AI Model Engine Controls */}
        <Card className="p-5 space-y-4">
          <CardHeader
            title="AI Model & Geotechnical Kinematics Engine"
            subtitle="Machine learning hyperparameters and computer vision confidence tuning"
            icon={<Cpu className="w-5 h-5 text-cyan-400" />}
          />

          <div className="space-y-4 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-navy-800/60 border border-navy-700/50 flex justify-between items-center">
              <div>
                <span className="font-bold text-navy-100 block">Core Model</span>
                <span className="text-[11px] text-blue-400 font-semibold">ResNet-101 + NER-GeoFissure v2.4</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">
                GPU Accelerated
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-navy-200">Computer Vision Confidence Threshold</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{aiConfidenceFloor}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                step="1"
                value={aiConfidenceFloor}
                onChange={(e) => setAiConfidenceFloor(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-[10px] text-navy-500 block">
                Detections below this confidence level are routed for human field officer verification.
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-navy-200">Crowdsource Auto-Escalation Quorum</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{citizenReportThreshold} Reports</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={citizenReportThreshold}
                onChange={(e) => setCitizenReportThreshold(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] text-navy-500 block">
                Number of corroborating citizen reports required to elevate local risk status automatically.
              </span>
            </div>
          </div>
        </Card>

        {/* Section 4: Offline Resilience & Cache Management */}
        <Card className="p-5 space-y-4">
          <CardHeader
            title="Offline Operation & Field Database Cache"
            subtitle="Ensures continuity of operations when mountain connectivity is lost"
            icon={<Database className="w-5 h-5 text-green-400" />}
          />

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-navy-800/60 border border-navy-700/50 flex justify-between items-center">
              <div>
                <span className="font-bold text-navy-100 block">IndexedDB Client Cache</span>
                <span className="text-[11px] text-navy-400">GIS Topo Maps & District Sensors Cached</span>
              </div>
              <span className="font-mono text-xs text-green-400 font-bold">14.8 MB Stored</span>
            </div>

            <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-navy-100 block">Store Offline Reports Locally</span>
                <p className="text-[11px] text-navy-400">Queue citizen reports and sync automatically when 4G/Wi-Fi reconnects</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineCacheEnabled}
                  onChange={(e) => setOfflineCacheEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-navy-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast('Offline database purged and freshly re-indexed.', 'info')}
                className="w-full py-2 px-3 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 border border-navy-700 font-semibold transition-all text-xs"
              >
                Clear & Re-Download Offline GIS Tiles
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
