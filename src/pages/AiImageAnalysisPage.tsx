import { useState } from 'react';
import {
  ScanEye,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  FileCheck,
  Send,
  RefreshCw,
  Image as ImageIcon,
  Crosshair,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui';
import { RiskBadge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';

interface SampleImage {
  id: string;
  title: string;
  location: string;
  type: string;
  url: string;
  crackDetected: boolean;
  slopeDamage: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  severity: number;
  confidence: number;
  features: string[];
  recommendation: string;
}

const sampleImages: SampleImage[] = [
  {
    id: 'sample-1',
    title: 'Aizawl Hillside Tension Crack',
    location: 'Aizawl South Ridge, Mizoram',
    type: 'Tension Crack',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    crackDetected: true,
    slopeDamage: 'HIGH',
    severity: 82,
    confidence: 94,
    features: ['Continuous transverse crack (1.8m depth)', 'Unconsolidated clay slip plane', 'Active slope creep'],
    recommendation: 'Immediate evacuation of downhill dwellings; seal cracks with waterproof tarpaulin.',
  },
  {
    id: 'sample-2',
    title: 'NH-10 Gangtok Mudslide & Rockfall',
    location: 'Teesta Valley Corridor, Sikkim',
    type: 'Debris Flow',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    crackDetected: true,
    slopeDamage: 'CRITICAL',
    severity: 93,
    confidence: 97,
    features: ['Active scarp rupture', 'Overburden rock debris blocking corridor', 'Saturated talus cone'],
    recommendation: 'Complete corridor closure. Deploy heavy earthmovers and geogrid stabilization.',
  },
  {
    id: 'sample-3',
    title: 'Cherrapunji Escarpment Subsidence',
    location: 'East Khasi Hills, Meghalaya',
    type: 'Soil Movement',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    crackDetected: false,
    slopeDamage: 'MODERATE',
    severity: 58,
    confidence: 88,
    features: ['Minor surface gullying', 'Vegetation displacement', 'Surface drainage pooling'],
    recommendation: 'Install weep holes and vegetative bio-engineering slope reinforcement.',
  },
];

export function AiImageAnalysisPage() {
  const { showToast } = useApp();
  const [selectedSample, setSelectedSample] = useState<SampleImage>(sampleImages[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SampleImage | null>(sampleImages[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult(selectedSample);
      showToast(`AI Computer Vision Analysis complete (${selectedSample.confidence}% confidence)`, 'success');
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImageUrl(url);
      const customResult: SampleImage = {
        id: 'custom-' + Date.now(),
        title: file.name,
        location: 'Field Photo (Local Upload)',
        type: 'Slope Rupture',
        url,
        crackDetected: true,
        slopeDamage: 'CRITICAL',
        severity: 88,
        confidence: 92,
        features: [
          'High shear strain identified in mid-slope',
          'Tension cracks extending > 12 meters',
          'Signs of subsurface water saturation',
        ],
        recommendation: 'Elevate to District Disaster Management Officer; dispatch on-site field team.',
      };
      setSelectedSample(customResult);
      setAnalysisResult(customResult);
      showToast('Image uploaded. Click "Run AI Inference" to scan for hazards.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <ScanEye className="w-4 h-4" /> Deep Learning Computer Vision
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            AI Landslide & Crack Detection Workbench
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Automated image inference detecting tension fissures, slip planes, displacement vectors, and structural failure
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-navy-200 border border-navy-700 flex items-center gap-2 transition-all">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Upload Field Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning Image...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Run AI Inference
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Reference Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sampleImages.map((sample) => (
          <button
            key={sample.id}
            onClick={() => {
              setSelectedSample(sample);
              setAnalysisResult(sample);
            }}
            className={`p-3 rounded-xl text-left transition-all border flex items-center gap-3 ${
              selectedSample.id === sample.id
                ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
                : 'bg-navy-900 border-navy-700/60 hover:bg-navy-800'
            }`}
          >
            <img
              src={sample.url}
              alt={sample.title}
              className="w-16 h-16 rounded-lg object-cover border border-navy-700 flex-shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-blue-400">{sample.type}</span>
              <p className="font-semibold text-xs text-navy-100 truncate">{sample.title}</p>
              <p className="text-[11px] text-navy-400 truncate">{sample.location}</p>
              <div className="mt-1">
                <RiskBadge level={sample.slopeDamage} size="sm" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Analysis Inspection View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Image Preview with AI Bounding Radar Overlay */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden relative">
            <CardHeader
              title={selectedSample.title}
              subtitle={selectedSample.location}
              icon={<Crosshair className="w-5 h-5 text-blue-400" />}
              action={
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-navy-800 border border-navy-700 text-navy-300">
                  Model: ResNet-101 + NER-GeoFissure v2.4
                </span>
              }
            />

            <div className="relative bg-black flex items-center justify-center min-h-[420px] max-h-[520px] overflow-hidden">
              <img
                src={customImageUrl || selectedSample.url}
                alt="Analyzed subject"
                className="w-full h-full object-cover max-h-[500px]"
              />

              {/* Radar scanner animation overlay while analyzing */}
              {analyzing && (
                <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-xs flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-2 border-blue-400 border-t-transparent animate-spin mb-3" />
                  <p className="text-sm font-bold text-blue-200 animate-pulse">
                    Computing Tensor Embeddings & Discontinuity Vector...
                  </p>
                </div>
              )}

              {/* Bounding box simulation overlays */}
              {!analyzing && analysisResult && (
                <>
                  <div className="absolute top-1/4 left-1/3 w-48 h-32 border-2 border-red-500 bg-red-500/15 rounded pointer-events-none animate-pulse">
                    <span className="absolute -top-5 left-0 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Scarp Fracture #{analysisResult.severity}%
                    </span>
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 w-36 h-24 border-2 border-amber-400 bg-amber-400/10 rounded pointer-events-none">
                    <span className="absolute -top-5 left-0 bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Debris Slip Fan
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="p-3 bg-navy-900 border-t border-navy-700/60 flex items-center justify-between text-xs text-navy-400">
              <span>Resolution: 4K UHD Orthophoto</span>
              <span>Inference Time: 340ms • Hardware: GPU Tensor Core</span>
            </div>
          </Card>
        </div>

        {/* Right Col: AI Inference Diagnostics */}
        <div className="space-y-4">
          <Card className="p-4 space-y-4 border-blue-500/20">
            <div className="border-b border-navy-700/60 pb-3">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                Inference Results
              </span>
              <h3 className="text-lg font-bold text-navy-100">Slope Instability Assessment</h3>
            </div>

            {/* Severity and Confidence Gauges */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/60">
                <span className="text-navy-400 text-[10px] block">Instability Score</span>
                <span className="text-2xl font-bold text-red-400 mt-1 block">
                  {analysisResult?.severity ?? 85}/100
                </span>
                <RiskBadge level={analysisResult?.slopeDamage ?? 'CRITICAL'} size="sm" />
              </div>

              <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/60">
                <span className="text-navy-400 text-[10px] block">Model Confidence</span>
                <span className="text-2xl font-bold text-green-400 mt-1 block">
                  {analysisResult?.confidence ?? 94}%
                </span>
                <span className="text-[10px] text-navy-400">High Precision Match</span>
              </div>
            </div>

            {/* Detected Geotechnical Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-navy-200 uppercase tracking-wide">
                Detected Features & Anomalies
              </h4>
              <div className="space-y-1.5">
                {analysisResult?.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded bg-navy-800/50 border border-navy-700/40 text-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-navy-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mitigation Advisory */}
            <div className="p-3.5 rounded-lg bg-navy-800/80 border border-navy-700/60 space-y-2">
              <h4 className="text-xs font-bold text-navy-100 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-400" /> Actionable Mitigation Strategy
              </h4>
              <p className="text-xs text-navy-300 leading-relaxed">
                {analysisResult?.recommendation}
              </p>
            </div>

            {/* Dispatch Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() =>
                  showToast('Incident elevated to District Early Warning Alert Bulletin!', 'warning')
                }
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast Emergency Hazard Alert
              </button>
              <button
                onClick={() =>
                  showToast('NDRF Field Engineering unit assigned for ground inspection.', 'success')
                }
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-navy-200 border border-navy-700 transition-all flex items-center justify-center gap-2"
              >
                <FileCheck className="w-3.5 h-3.5 text-blue-400" /> Dispatch Ground Verification Team
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
