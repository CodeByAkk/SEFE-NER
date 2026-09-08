export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type UserRole = 'ADMIN' | 'DISTRICT_OFFICER' | 'FIELD_OFFICER' | 'CITIZEN';

export type AlertLevel = 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';

export type SensorStatus = 'ONLINE' | 'OFFLINE' | 'WARNING' | 'CRITICAL';

export type IncidentType =
  | 'Landslide'
  | 'Crack'
  | 'Soil Movement'
  | 'Rockfall'
  | 'Road Blockage'
  | 'Flooding'
  | 'Other';

export type ReporterType = 'Citizen' | 'Field Officer';

export type Language = 'en' | 'hi';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  district?: string;
  avatar?: string;
}

export interface Location {
  id: string;
  name: string;
  district: string;
  state: NERState;
  lat: number;
  lng: number;
  elevation: number;
}

export type NERState =
  | 'Assam'
  | 'Arunachal Pradesh'
  | 'Manipur'
  | 'Meghalaya'
  | 'Mizoram'
  | 'Nagaland'
  | 'Tripura'
  | 'Sikkim';

export interface RiskFactor {
  name: string;
  contribution: number;
  description: string;
}

export interface RiskScore {
  locationId: string;
  score: number;
  level: RiskLevel;
  probability: number;
  factors: RiskFactor[];
  rainfall: number;
  soilMoisture: number;
  slope: number;
  elevation: number;
  historicalLandslides: number;
  riskWindow: string;
  recommendedAction: string;
  updatedAt: string;
}

export interface RainfallRecord {
  locationId: string;
  current: number;
  sixHour: number;
  twentyFourHour: number;
  fortyEightHour: number;
  intensity: 'Light' | 'Moderate' | 'Heavy' | 'Very Heavy' | 'Extreme';
  condition: string;
  forecastTrend: 'Increasing' | 'Stable' | 'Decreasing';
}

export interface WeatherForecast {
  locationId: string;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  forecast: { hour: string; rainfall: number; risk: number }[];
}

export interface SoilSensor {
  id: string;
  locationId: string;
  locationName: string;
  lat: number;
  lng: number;
  soilMoisture: number;
  temperature: number;
  battery: number;
  lastUpdated: string;
  status: SensorStatus;
}

export interface TerrainData {
  locationId: string;
  slope: number;
  elevation: number;
  landCover: string;
  terrainVulnerability: number;
  roadCuttingVulnerability: number;
  satelliteChangeIndicator: number;
}

export interface HistoricalLandslide {
  id: string;
  locationId: string;
  date: string;
  severity: RiskLevel;
  fatalities: number;
  affectedPopulation: number;
  description: string;
}

export interface IncidentReport {
  id: string;
  type: IncidentType;
  locationId: string;
  locationName: string;
  lat: number;
  lng: number;
  description: string;
  severity: RiskLevel;
  reporterType: ReporterType;
  reporterName: string;
  timestamp: string;
  hasImage: boolean;
  imageUrl?: string;
  imageAnalysisId?: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'Resolved';
  pendingSync?: boolean;
}

export interface ImageAnalysis {
  id: string;
  incidentId: string;
  crackDetected: boolean;
  slopeDamage: RiskLevel;
  instabilityIndicators: number;
  severity: number;
  confidence: number;
  recommendedAction: string;
  detectedFeatures: string[];
  timestamp: string;
}

export type RoadCondition = 'Good' | 'Fair' | 'Poor' | 'Blocked';

export interface Road {
  id: string;
  name: string;
  type: 'National Highway' | 'State Highway' | 'Major Road' | 'Rural Road';
  risk: RiskLevel;
  riskProbability: number;
  connectivity: 'Major' | 'Moderate' | 'Minor';
  villagesIsolated: number;
  alternativeRoute: boolean;
  alternativeRouteName?: string;
  condition: RoadCondition;
  locationId: string;
  length: number;
}

export interface Village {
  id: string;
  name: string;
  locationId: string;
  population: number;
  risk: RiskLevel;
  distanceToHazard: number;
  evacuationRoute: string;
}

export interface Hospital {
  id: string;
  name: string;
  locationId: string;
  lat: number;
  lng: number;
  beds: number;
  emergencyCapacity: number;
  distanceToHazard: number;
}

export interface Bridge {
  id: string;
  name: string;
  locationId: string;
  type: string;
  risk: RiskLevel;
  condition: 'Good' | 'Fair' | 'Poor' | 'Critical';
}

export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  locationId: string;
  locationName: string;
  probability: number;
  expectedWindow: string;
  cause: string;
  potentialImpact: string;
  recommendedAction: string;
  timestamp: string;
  acknowledged: boolean;
  assignedTeam?: string;
}

export interface EmergencyTeam {
  id: string;
  name: string;
  type: 'Rescue' | 'Medical' | 'Engineering' | 'Evacuation' | 'Reconnaissance';
  status: 'Available' | 'Deployed' | 'On Standby' | 'Returning';
  location: string;
  personnelCount: number;
  currentAssignment?: string;
}

export interface ResponseAction {
  id: string;
  alertId: string;
  action: string;
  priority: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedTeam?: string;
  timestamp: string;
}

export interface EmergencyPriority {
  id: string;
  locationId: string;
  locationName: string;
  risk: number;
  populationImpact: number;
  infrastructureImpact: number;
  connectivityImpact: number;
  timeSensitivity: number;
  priorityScore: number;
  recommendedAction: string;
  threatenedInfrastructure: string[];
  villagesAtRisk: number;
}

export interface ForecastPoint {
  hour: string;
  risk: number;
  rainfall: number;
  soilMoisture: number;
}

export interface RiskZone {
  locationId: string;
  center: { lat: number; lng: number };
  radius: number;
  risk: RiskLevel;
  score: number;
}

export interface RiskTimelineEvent {
  time: string;
  event: string;
  risk: number;
  type: 'initial' | 'report' | 'analysis' | 'update' | 'alert';
}

export interface SimulationStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}
