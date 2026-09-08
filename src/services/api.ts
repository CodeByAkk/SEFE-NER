import type {
  WeatherForecast,
  RainfallRecord,
  SoilSensor,
  IncidentReport,
  ImageAnalysis,
  Alert,
  Road,
  Village,
  Hospital,
  Bridge,
  EmergencyPriority,
  EmergencyTeam,
  ForecastPoint,
  HistoricalLandslide,
  RiskZone,
  Location,
} from '@/types';
import {
  weatherForecasts,
  rainfallRecords,
  soilSensors,
  incidentReports,
  imageAnalyses,
  alerts,
  roads,
  villages,
  hospitals,
  bridges,
  emergencyPriorities,
  emergencyTeams,
  forecastData,
  historicalLandslides,
  riskZones,
  locations,
} from '@/data/demoData';

// ─── Risk Zones API ──────────────────────────────────────────────
export const riskApi = {
  getZones: async (): Promise<RiskZone[]> => riskZones,
  getLocations: async (): Promise<Location[]> => locations,
  getForecast: async (locationId: string): Promise<ForecastPoint[]> =>
    forecastData[locationId] ?? forecastData['loc-aizawl'],
};

// ─── Weather / Rainfall API ──────────────────────────────────────
export const weatherApi = {
  getWeather: async (locationId: string): Promise<WeatherForecast | undefined> =>
    weatherForecasts.find((w) => w.locationId === locationId),
  getRainfall: async (locationId: string): Promise<RainfallRecord | undefined> =>
    rainfallRecords.find((r) => r.locationId === locationId),
  getAllRainfall: async (): Promise<RainfallRecord[]> => rainfallRecords,
};

// ─── Sensor API ──────────────────────────────────────────────────
export const sensorApi = {
  getSensors: async (): Promise<SoilSensor[]> => soilSensors,
  getSensor: async (id: string): Promise<SoilSensor | undefined> =>
    soilSensors.find((s) => s.id === id),
  // POST /api/sensors/data — for future real IoT integration
  submitSensorData: async (data: Partial<SoilSensor>): Promise<{ success: boolean }> => {
    return { success: true };
  },
};

// ─── Incident Reports API ────────────────────────────────────────
export const incidentApi = {
  getIncidents: async (): Promise<IncidentReport[]> => incidentReports,
  getIncident: async (id: string): Promise<IncidentReport | undefined> =>
    incidentReports.find((i) => i.id === id),
  // POST /api/incidents
  createIncident: async (data: Partial<IncidentReport>): Promise<IncidentReport> => {
    const incident: IncidentReport = {
      id: `inc-${Date.now()}`,
      type: data.type ?? 'Other',
      locationId: data.locationId ?? 'loc-aizawl',
      locationName: data.locationName ?? 'Unknown',
      lat: data.lat ?? 0,
      lng: data.lng ?? 0,
      description: data.description ?? '',
      severity: data.severity ?? 'MODERATE',
      reporterType: data.reporterType ?? 'Citizen',
      reporterName: data.reporterName ?? 'Anonymous',
      timestamp: new Date().toISOString(),
      hasImage: data.hasImage ?? false,
      status: 'Pending',
      pendingSync: data.pendingSync,
    };
    return incident;
  },
};

// ─── Image Analysis API ──────────────────────────────────────────
export const imageAnalysisApi = {
  getAnalysis: async (incidentId: string): Promise<ImageAnalysis | undefined> =>
    imageAnalyses.find((a) => a.incidentId === incidentId),
  // POST /api/image-analysis — simulated computer vision
  analyzeImage: async (incidentType: string): Promise<ImageAnalysis> => {
    const severityMap: Record<string, number> = {
      'Landslide': 85,
      'Crack': 78,
      'Soil Movement': 72,
      'Rockfall': 68,
      'Road Blockage': 65,
      'Flooding': 55,
      'Other': 50,
    };
    const severity = severityMap[incidentType] ?? 50;
    const featuresByType: Record<string, string[]> = {
      'Crack': ['Wide slope crack detected', 'Soil displacement visible', 'Vegetation disturbance'],
      'Landslide': ['Active landslide mass', 'Slope failure scarp', 'Debris flow channel', 'Blocked drainage'],
      'Rockfall': ['Rock debris on road', 'Slope face instability', 'Vegetation removal'],
      'Soil Movement': ['Soil creep indicators', 'Surface cracking', 'Tree tilt'],
      'Road Blockage': ['Debris accumulation', 'Road surface damage', 'Partial blockage'],
    };
    return {
      id: `ia-${Date.now()}`,
      incidentId: `inc-${Date.now()}`,
      crackDetected: incidentType === 'Crack' || incidentType === 'Landslide',
      slopeDamage: severity > 75 ? 'CRITICAL' : severity > 50 ? 'HIGH' : 'MODERATE',
      instabilityIndicators: (featuresByType[incidentType] ?? ['Unknown feature']).length,
      severity,
      confidence: Math.round(80 + Math.random() * 18),
      recommendedAction: severity > 75 ? 'Immediate field inspection required' : 'Field verification recommended',
      detectedFeatures: featuresByType[incidentType] ?? ['Anomaly detected'],
      timestamp: new Date().toISOString(),
    };
  },
};

// ─── Infrastructure API ──────────────────────────────────────────
export const infrastructureApi = {
  getRoads: async (): Promise<Road[]> => roads,
  getVillages: async (): Promise<Village[]> => villages,
  getHospitals: async (): Promise<Hospital[]> => hospitals,
  getBridges: async (): Promise<Bridge[]> => bridges,
};

// ─── Alerts API ───────────────────────────────────────────────────
export const alertApi = {
  getAlerts: async (): Promise<Alert[]> => alerts,
  // POST /api/alerts
  createAlert: async (data: Partial<Alert>): Promise<Alert> => {
    return {
      id: `alert-${Date.now()}`,
      level: data.level ?? 'WARNING',
      title: data.title ?? 'Landslide Risk Alert',
      locationId: data.locationId ?? '',
      locationName: data.locationName ?? '',
      probability: data.probability ?? 0,
      expectedWindow: data.expectedWindow ?? 'Next 12 hours',
      cause: data.cause ?? '',
      potentialImpact: data.potentialImpact ?? '',
      recommendedAction: data.recommendedAction ?? '',
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };
  },
};

// ─── Emergency Response API ───────────────────────────────────────
export const emergencyApi = {
  getPriorities: async (): Promise<EmergencyPriority[]> => emergencyPriorities,
  getTeams: async (): Promise<EmergencyTeam[]> => emergencyTeams,
};

// ─── Historical API ───────────────────────────────────────────────
export const historicalApi = {
  getLandslides: async (): Promise<HistoricalLandslide[]> => historicalLandslides,
  getLandslidesByLocation: async (locationId: string): Promise<HistoricalLandslide[]> =>
    historicalLandslides.filter((h) => h.locationId === locationId),
};
