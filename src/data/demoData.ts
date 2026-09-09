import type {
  Location,
  RiskZone,
  RiskScore,
  RainfallRecord,
  WeatherForecast,
  SoilSensor,
  TerrainData,
  HistoricalLandslide,
  IncidentReport,
  Road,
  Village,
  Hospital,
  Bridge,
  Alert,
  EmergencyTeam,
  EmergencyPriority,
  ForecastPoint,
  User,
  ImageAnalysis,
  FieldOfficer,
  Shelter,
  EvacuationRoute,
  Escalation,
} from '@/types';

export const demoUsers: User[] = [
  { id: 'u1', name: 'Rajesh Kumar', role: 'ADMIN', email: 'admin@nersafe.gov.in', avatar: 'RK' },
  { id: 'u2', name: 'Priya Devi', role: 'DISTRICT_OFFICER', email: 'officer@nersafe.gov.in', district: 'Aizawl District', districtId: 'dist-aizawl', avatar: 'PD' },
  { id: 'u3', name: 'Arun Singh', role: 'FIELD_OFFICER', email: 'field@nersafe.gov.in', district: 'Aizawl District', districtId: 'dist-aizawl', avatar: 'AS' },
  { id: 'u4', name: 'Lalruatfeli', role: 'CITIZEN', email: 'citizen@nersafe.gov.in', district: 'Aizawl District', districtId: 'dist-aizawl', avatar: 'L' },
  { id: 'u5', name: 'David Lianzuala', role: 'FIELD_OFFICER', email: 'david@nersafe.gov.in', district: 'Aizawl District', districtId: 'dist-aizawl', avatar: 'DL' },
  { id: 'u6', name: 'Sarah Chhakchhuak', role: 'FIELD_OFFICER', email: 'sarah@nersafe.gov.in', district: 'Aizawl District', districtId: 'dist-aizawl', avatar: 'SC' },
  { id: 'u7', name: 'Vanlalhriata', role: 'FIELD_OFFICER', email: 'vanlal@nersafe.gov.in', district: 'Aizawl District', districtId: 'dist-aizawl', avatar: 'VH' },
  { id: 'u8', name: 'Zothanpuii', role: 'FIELD_OFFICER', email: 'zothan@nersafe.gov.in', district: 'Aizawl District', districtId: 'dist-aizawl', avatar: 'ZT' },
];

export const locations: Location[] = [
  { id: 'loc-aizawl', name: 'Aizawl', district: 'Aizawl District', districtId: 'dist-aizawl', state: 'Mizoram', lat: 23.7271, lng: 92.7176, elevation: 1132 },
  { id: 'loc-shillong', name: 'Shillong', district: 'East Khasi Hills', districtId: 'dist-shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, elevation: 1496 },
  { id: 'loc-kohima', name: 'Kohima', district: 'Kohima District', districtId: 'dist-kohima', state: 'Nagaland', lat: 25.6751, lng: 94.1086, elevation: 1444 },
  { id: 'loc-imphal', name: 'Imphal', district: 'Imphal West', districtId: 'dist-imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368, elevation: 786 },
  { id: 'loc-itanagar', name: 'Itanagar', district: 'Papum Pare', districtId: 'dist-itanagar', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053, elevation: 440 },
  { id: 'loc-guwahati', name: 'Guwahati', district: 'Kamrup Metro', districtId: 'dist-guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, elevation: 55 },
  { id: 'loc-tura', name: 'Tura', district: 'West Garo Hills', districtId: 'dist-tura', state: 'Meghalaya', lat: 25.5117, lng: 90.2200, elevation: 358 },
  { id: 'loc-champhai', name: 'Champhai', district: 'Champhai District', districtId: 'dist-champhai', state: 'Mizoram', lat: 23.4567, lng: 93.3293, elevation: 1678 },
  { id: 'loc-mokokchung', name: 'Mokokchung', district: 'Mokokchung District', districtId: 'dist-mokokchung', state: 'Nagaland', lat: 26.3267, lng: 94.5167, elevation: 1325 },
  { id: 'loc-ukhrul', name: 'Ukhrul', district: 'Ukhrul District', districtId: 'dist-ukhrul', state: 'Manipur', lat: 25.0903, lng: 94.3623, elevation: 1845 },
  { id: 'loc-tezu', name: 'Tezu', district: 'Lohit District', districtId: 'dist-tezu', state: 'Arunachal Pradesh', lat: 27.9266, lng: 96.1697, elevation: 248 },
  { id: 'loc-agartala', name: 'Agartala', district: 'West Tripura', districtId: 'dist-agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868, elevation: 48 },
  { id: 'loc-gangtok', name: 'Gangtok', district: 'East Sikkim', districtId: 'dist-gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065, elevation: 1650 },
  { id: 'loc-dibrugarh', name: 'Dibrugarh', district: 'Dibrugarh District', districtId: 'dist-dibrugarh', state: 'Assam', lat: 27.4728, lng: 94.9120, elevation: 118 },
  { id: 'loc-silchar', name: 'Silchar', district: 'Cachar District', districtId: 'dist-silchar', state: 'Assam', lat: 24.8333, lng: 92.7789, elevation: 35 },
  { id: 'loc-aizawl-south', name: 'Lunglei', district: 'Lunglei District', districtId: 'dist-lunglei', state: 'Mizoram', lat: 22.8819, lng: 92.7389, elevation: 1022 },
];

export const riskZones: RiskZone[] = [
  { locationId: 'loc-aizawl', center: { lat: 23.7271, lng: 92.7176 }, radius: 12000, risk: 'CRITICAL', score: 87 },
  { locationId: 'loc-shillong', center: { lat: 25.5788, lng: 91.8933 }, radius: 10000, risk: 'CRITICAL', score: 88 },
  { locationId: 'loc-kohima', center: { lat: 25.6751, lng: 94.1086 }, radius: 9000, risk: 'HIGH', score: 81 },
  { locationId: 'loc-imphal', center: { lat: 24.8170, lng: 93.9368 }, radius: 8000, risk: 'HIGH', score: 73 },
  { locationId: 'loc-itanagar', center: { lat: 27.0844, lng: 93.6053 }, radius: 8500, risk: 'HIGH', score: 68 },
  { locationId: 'loc-guwahati', center: { lat: 26.1445, lng: 91.7362 }, radius: 7000, risk: 'MODERATE', score: 42 },
  { locationId: 'loc-tura', center: { lat: 25.5117, lng: 90.2200 }, radius: 7500, risk: 'HIGH', score: 76 },
  { locationId: 'loc-champhai', center: { lat: 23.4567, lng: 93.3293 }, radius: 6500, risk: 'HIGH', score: 79 },
  { locationId: 'loc-mokokchung', center: { lat: 26.3267, lng: 94.5167 }, radius: 6000, risk: 'MODERATE', score: 48 },
  { locationId: 'loc-ukhrul', center: { lat: 25.0903, lng: 94.3623 }, radius: 7000, risk: 'HIGH', score: 72 },
  { locationId: 'loc-tezu', center: { lat: 27.9266, lng: 96.1697 }, radius: 5500, risk: 'MODERATE', score: 38 },
  { locationId: 'loc-agartala', center: { lat: 23.8315, lng: 91.2868 }, radius: 5000, risk: 'LOW', score: 18 },
  { locationId: 'loc-gangtok', center: { lat: 27.3389, lng: 88.6065 }, radius: 8000, risk: 'CRITICAL', score: 91 },
  { locationId: 'loc-dibrugarh', center: { lat: 27.4728, lng: 94.9120 }, radius: 6000, risk: 'MODERATE', score: 45 },
  { locationId: 'loc-silchar', center: { lat: 24.8333, lng: 92.7789 }, radius: 5500, risk: 'MODERATE', score: 39 },
  { locationId: 'loc-aizawl-south', center: { lat: 22.8819, lng: 92.7389 }, radius: 7000, risk: 'HIGH', score: 74 },
];

export const riskScores: RiskScore[] = [
  {
    locationId: 'loc-aizawl', score: 87, level: 'CRITICAL', probability: 87,
    factors: [
      { name: 'Heavy Rainfall', contribution: 28, description: '142mm in 24h, exceeding critical threshold' },
      { name: 'Soil Moisture', contribution: 22, description: '81% saturation, near field capacity' },
      { name: 'Steep Slope', contribution: 18, description: '38° average slope angle' },
      { name: 'Historical Events', contribution: 12, description: '12 prior landslides in zone' },
      { name: 'Terrain Vulnerability', contribution: 7, description: 'High road-cutting exposure' },
    ],
    rainfall: 142, soilMoisture: 81, slope: 38, elevation: 1132, historicalLandslides: 12,
    riskWindow: 'Next 6–12 hours', recommendedAction: 'Immediate field inspection and emergency preparedness',
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-shillong', score: 88, level: 'CRITICAL', probability: 88,
    factors: [
      { name: 'Heavy Rainfall', contribution: 26, description: '138mm in 24h' },
      { name: 'Soil Moisture', contribution: 20, description: '78% saturation' },
      { name: 'Steep Slope', contribution: 16, description: '35° slope angle' },
      { name: 'Historical Events', contribution: 14, description: '15 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 12, description: 'High road-cutting exposure' },
    ],
    rainfall: 138, soilMoisture: 78, slope: 35, elevation: 1496, historicalLandslides: 15,
    riskWindow: 'Next 6–12 hours', recommendedAction: 'Bridge inspection and evacuation preparedness',
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-kohima', score: 81, level: 'HIGH', probability: 81,
    factors: [
      { name: 'Heavy Rainfall', contribution: 24, description: '125mm in 24h' },
      { name: 'Soil Moisture', contribution: 18, description: '72% saturation' },
      { name: 'Steep Slope', contribution: 20, description: '40° slope angle' },
      { name: 'Historical Events', contribution: 10, description: '8 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 9, description: 'Road blockage risk' },
    ],
    rainfall: 125, soilMoisture: 72, slope: 40, elevation: 1444, historicalLandslides: 8,
    riskWindow: 'Next 12–24 hours', recommendedAction: 'Road closure preparation and monitoring',
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-imphal', score: 73, level: 'HIGH', probability: 73,
    factors: [
      { name: 'Heavy Rainfall', contribution: 22, description: '110mm in 24h' },
      { name: 'Soil Moisture', contribution: 16, description: '68% saturation' },
      { name: 'Steep Slope', contribution: 14, description: '30° slope angle' },
      { name: 'Historical Events', contribution: 11, description: '9 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 10, description: 'Soil movement indicators' },
    ],
    rainfall: 110, soilMoisture: 68, slope: 30, elevation: 786, historicalLandslides: 9,
    riskWindow: 'Next 12–24 hours', recommendedAction: 'Continuous monitoring and field verification',
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-gangtok', score: 91, level: 'CRITICAL', probability: 91,
    factors: [
      { name: 'Heavy Rainfall', contribution: 30, description: '156mm in 24h, extreme rainfall' },
      { name: 'Soil Moisture', contribution: 24, description: '85% saturation' },
      { name: 'Steep Slope', contribution: 18, description: '42° slope angle' },
      { name: 'Historical Events', contribution: 12, description: '18 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 7, description: 'High elevation terrain' },
    ],
    rainfall: 156, soilMoisture: 85, slope: 42, elevation: 1650, historicalLandslides: 18,
    riskWindow: 'Next 3–6 hours', recommendedAction: 'Immediate evacuation and emergency team deployment',
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-tura', score: 76, level: 'HIGH', probability: 76,
    factors: [
      { name: 'Heavy Rainfall', contribution: 22, description: '118mm in 24h' },
      { name: 'Soil Moisture', contribution: 18, description: '74% saturation' },
      { name: 'Steep Slope', contribution: 16, description: '33° slope angle' },
      { name: 'Historical Events', contribution: 12, description: '10 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 8, description: 'Rockfall indicators' },
    ],
    rainfall: 118, soilMoisture: 74, slope: 33, elevation: 358, historicalLandslides: 10,
    riskWindow: 'Next 12–24 hours', recommendedAction: 'Field inspection and sensor verification',
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-champhai', score: 79, level: 'HIGH', probability: 79,
    factors: [
      { name: 'Heavy Rainfall', contribution: 24, description: '122mm in 24h' },
      { name: 'Soil Moisture', contribution: 18, description: '70% saturation' },
      { name: 'Steep Slope', contribution: 16, description: '36° slope angle' },
      { name: 'Historical Events', contribution: 11, description: '7 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 10, description: 'High elevation terrain' },
    ],
    rainfall: 122, soilMoisture: 70, slope: 36, elevation: 1678, historicalLandslides: 7,
    riskWindow: 'Next 12–24 hours', recommendedAction: 'Continuous monitoring and road inspection',
    updatedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-itanagar', score: 68, level: 'HIGH', probability: 68,
    factors: [
      { name: 'Heavy Rainfall', contribution: 20, description: '95mm in 24h' },
      { name: 'Soil Moisture', contribution: 16, description: '65% saturation' },
      { name: 'Steep Slope', contribution: 14, description: '28° slope angle' },
      { name: 'Historical Events', contribution: 10, description: '6 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 8, description: 'Moderate road-cutting' },
    ],
    rainfall: 95, soilMoisture: 65, slope: 28, elevation: 440, historicalLandslides: 6,
    riskWindow: 'Next 24–48 hours', recommendedAction: 'Monitoring and field verification',
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-ukhrul', score: 72, level: 'HIGH', probability: 72,
    factors: [
      { name: 'Heavy Rainfall', contribution: 21, description: '105mm in 24h' },
      { name: 'Soil Moisture', contribution: 17, description: '69% saturation' },
      { name: 'Steep Slope', contribution: 18, description: '37° slope angle' },
      { name: 'Historical Events', contribution: 9, description: '5 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 7, description: 'High elevation terrain' },
    ],
    rainfall: 105, soilMoisture: 69, slope: 37, elevation: 1845, historicalLandslides: 5,
    riskWindow: 'Next 12–24 hours', recommendedAction: 'Field inspection and community alert',
    updatedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-aizawl-south', score: 74, level: 'HIGH', probability: 74,
    factors: [
      { name: 'Heavy Rainfall', contribution: 22, description: '115mm in 24h' },
      { name: 'Soil Moisture', contribution: 18, description: '71% saturation' },
      { name: 'Steep Slope', contribution: 16, description: '34° slope angle' },
      { name: 'Historical Events', contribution: 10, description: '8 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 8, description: 'Road-cutting vulnerability' },
    ],
    rainfall: 115, soilMoisture: 71, slope: 34, elevation: 1022, historicalLandslides: 8,
    riskWindow: 'Next 12–24 hours', recommendedAction: 'Continuous monitoring and road inspection',
    updatedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-guwahati', score: 42, level: 'MODERATE', probability: 42,
    factors: [
      { name: 'Moderate Rainfall', contribution: 14, description: '52mm in 24h' },
      { name: 'Soil Moisture', contribution: 10, description: '48% saturation' },
      { name: 'Gentle Slope', contribution: 6, description: '12° slope angle' },
      { name: 'Historical Events', contribution: 7, description: '4 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 5, description: 'Low road-cutting' },
    ],
    rainfall: 52, soilMoisture: 48, slope: 12, elevation: 55, historicalLandslides: 4,
    riskWindow: 'Next 48 hours', recommendedAction: 'Routine monitoring',
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-mokokchung', score: 48, level: 'MODERATE', probability: 48,
    factors: [
      { name: 'Moderate Rainfall', contribution: 15, description: '62mm in 24h' },
      { name: 'Soil Moisture', contribution: 12, description: '55% saturation' },
      { name: 'Moderate Slope', contribution: 10, description: '25° slope angle' },
      { name: 'Historical Events', contribution: 6, description: '3 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 5, description: 'Moderate terrain' },
    ],
    rainfall: 62, soilMoisture: 55, slope: 25, elevation: 1325, historicalLandslides: 3,
    riskWindow: 'Next 24–48 hours', recommendedAction: 'Routine monitoring',
    updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-tezu', score: 38, level: 'MODERATE', probability: 38,
    factors: [
      { name: 'Moderate Rainfall', contribution: 12, description: '45mm in 24h' },
      { name: 'Soil Moisture', contribution: 9, description: '42% saturation' },
      { name: 'Gentle Slope', contribution: 7, description: '15° slope angle' },
      { name: 'Historical Events', contribution: 6, description: '2 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 4, description: 'Low terrain vulnerability' },
    ],
    rainfall: 45, soilMoisture: 42, slope: 15, elevation: 248, historicalLandslides: 2,
    riskWindow: 'Next 48 hours', recommendedAction: 'Routine monitoring',
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-agartala', score: 18, level: 'LOW', probability: 18,
    factors: [
      { name: 'Light Rainfall', contribution: 6, description: '18mm in 24h' },
      { name: 'Soil Moisture', contribution: 4, description: '32% saturation' },
      { name: 'Flat Terrain', contribution: 2, description: '5° slope angle' },
      { name: 'Historical Events', contribution: 4, description: '1 prior landslide' },
      { name: 'Terrain Vulnerability', contribution: 2, description: 'Very low vulnerability' },
    ],
    rainfall: 18, soilMoisture: 32, slope: 5, elevation: 48, historicalLandslides: 1,
    riskWindow: 'No immediate risk', recommendedAction: 'No action required',
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-dibrugarh', score: 45, level: 'MODERATE', probability: 45,
    factors: [
      { name: 'Moderate Rainfall', contribution: 14, description: '58mm in 24h' },
      { name: 'Soil Moisture', contribution: 11, description: '50% saturation' },
      { name: 'Gentle Slope', contribution: 7, description: '14° slope angle' },
      { name: 'Historical Events', contribution: 8, description: '5 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 5, description: 'Brahmaputra floodplain edge' },
    ],
    rainfall: 58, soilMoisture: 50, slope: 14, elevation: 118, historicalLandslides: 5,
    riskWindow: 'Next 48 hours', recommendedAction: 'Routine monitoring',
    updatedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    locationId: 'loc-silchar', score: 39, level: 'MODERATE', probability: 39,
    factors: [
      { name: 'Moderate Rainfall', contribution: 13, description: '48mm in 24h' },
      { name: 'Soil Moisture', contribution: 10, description: '45% saturation' },
      { name: 'Gentle Slope', contribution: 6, description: '10° slope angle' },
      { name: 'Historical Events', contribution: 6, description: '3 prior landslides' },
      { name: 'Terrain Vulnerability', contribution: 4, description: 'Low vulnerability' },
    ],
    rainfall: 48, soilMoisture: 45, slope: 10, elevation: 35, historicalLandslides: 3,
    riskWindow: 'Next 48 hours', recommendedAction: 'Routine monitoring',
    updatedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
];

export const rainfallRecords: RainfallRecord[] = locations.map((loc) => {
  const score = riskScores.find((r) => r.locationId === loc.id);
  const r = score?.rainfall ?? 30;
  let intensity: RainfallRecord['intensity'] = 'Light';
  if (r > 150) intensity = 'Extreme';
  else if (r > 115) intensity = 'Very Heavy';
  else if (r > 64) intensity = 'Heavy';
  else if (r > 35) intensity = 'Moderate';
  return {
    locationId: loc.id,
    current: Math.round(r * 0.15),
    sixHour: Math.round(r * 0.4),
    twentyFourHour: r,
    fortyEightHour: Math.round(r * 1.3),
    intensity,
    condition: r > 100 ? 'Heavy Rain' : r > 50 ? 'Rain' : r > 20 ? 'Light Rain' : 'Cloudy',
    forecastTrend: r > 80 ? 'Increasing' : r > 40 ? 'Stable' : 'Decreasing',
  };
});

export const weatherForecasts: WeatherForecast[] = locations.map((loc) => {
  const score = riskScores.find((r) => r.locationId === loc.id);
  const r = score?.rainfall ?? 30;
  const forecast = Array.from({ length: 12 }, (_, i) => ({
    hour: `+${(i + 1) * 2}h`,
    rainfall: Math.max(0, Math.round(r * (0.8 + Math.sin(i / 2) * 0.3 + i * 0.02))),
    risk: Math.min(100, Math.round((score?.score ?? 30) + i * 2 - Math.abs(i - 6) * 3)),
  }));
  return {
    locationId: loc.id,
    condition: r > 100 ? 'Heavy Rainfall' : r > 50 ? 'Rainy' : 'Cloudy',
    temperature: Math.round(20 + Math.random() * 8),
    humidity: Math.round(60 + (r / 200) * 35),
    windSpeed: Math.round(8 + Math.random() * 15),
    windDirection: ['NE', 'SW', 'S', 'SE'][Math.floor(Math.random() * 4)],
    visibility: r > 100 ? 2 : r > 50 ? 5 : 10,
    forecast,
  };
});

export const soilSensors: SoilSensor[] = [
  { id: 'SM-104', locationId: 'loc-aizawl', locationName: 'Aizawl', lat: 23.7271, lng: 92.7176, soilMoisture: 82, temperature: 28, battery: 87, lastUpdated: '2 min ago', status: 'CRITICAL' },
  { id: 'SM-221', locationId: 'loc-shillong', locationName: 'Shillong', lat: 25.5788, lng: 91.8933, soilMoisture: 67, temperature: 24, battery: 92, lastUpdated: '1 min ago', status: 'WARNING' },
  { id: 'SM-305', locationId: 'loc-kohima', locationName: 'Kohima', lat: 25.6751, lng: 94.1086, soilMoisture: 72, temperature: 22, battery: 78, lastUpdated: '3 min ago', status: 'WARNING' },
  { id: 'SM-108', locationId: 'loc-imphal', locationName: 'Imphal', lat: 24.8170, lng: 93.9368, soilMoisture: 68, temperature: 26, battery: 85, lastUpdated: '2 min ago', status: 'WARNING' },
  { id: 'SM-412', locationId: 'loc-gangtok', locationName: 'Gangtok', lat: 27.3389, lng: 88.6065, soilMoisture: 85, temperature: 19, battery: 91, lastUpdated: '1 min ago', status: 'CRITICAL' },
  { id: 'SM-501', locationId: 'loc-tura', locationName: 'Tura', lat: 25.5117, lng: 90.2200, soilMoisture: 74, temperature: 27, battery: 65, lastUpdated: '5 min ago', status: 'WARNING' },
  { id: 'SM-603', locationId: 'loc-champhai', locationName: 'Champhai', lat: 23.4567, lng: 93.3293, soilMoisture: 70, temperature: 21, battery: 88, lastUpdated: '3 min ago', status: 'WARNING' },
  { id: 'SM-707', locationId: 'loc-itanagar', locationName: 'Itanagar', lat: 27.0844, lng: 93.6053, soilMoisture: 65, temperature: 28, battery: 73, lastUpdated: '4 min ago', status: 'WARNING' },
  { id: 'SM-809', locationId: 'loc-guwahati', locationName: 'Guwahati', lat: 26.1445, lng: 91.7362, soilMoisture: 48, temperature: 30, battery: 95, lastUpdated: '1 min ago', status: 'ONLINE' },
  { id: 'SM-901', locationId: 'loc-mokokchung', locationName: 'Mokokchung', lat: 26.3267, lng: 94.5167, soilMoisture: 55, temperature: 23, battery: 81, lastUpdated: '2 min ago', status: 'ONLINE' },
  { id: 'SM-915', locationId: 'loc-ukhrul', locationName: 'Ukhrul', lat: 25.0903, lng: 94.3623, soilMoisture: 69, temperature: 20, battery: 70, lastUpdated: '6 min ago', status: 'WARNING' },
  { id: 'SM-922', locationId: 'loc-aizawl-south', locationName: 'Lunglei', lat: 22.8819, lng: 92.7389, soilMoisture: 71, temperature: 25, battery: 84, lastUpdated: '3 min ago', status: 'WARNING' },
  { id: 'SM-930', locationId: 'loc-agartala', locationName: 'Agartala', lat: 23.8315, lng: 91.2868, soilMoisture: 32, temperature: 31, battery: 99, lastUpdated: '1 min ago', status: 'ONLINE' },
  { id: 'SM-941', locationId: 'loc-dibrugarh', locationName: 'Dibrugarh', lat: 27.4728, lng: 94.9120, soilMoisture: 50, temperature: 29, battery: 90, lastUpdated: '2 min ago', status: 'ONLINE' },
  { id: 'SM-955', locationId: 'loc-silchar', locationName: 'Silchar', lat: 24.8333, lng: 92.7789, soilMoisture: 45, temperature: 30, battery: 86, lastUpdated: '2 min ago', status: 'ONLINE' },
  { id: 'SM-960', locationId: 'loc-tezu', locationName: 'Tezu', lat: 27.9266, lng: 96.1697, soilMoisture: 42, temperature: 28, battery: 0, lastUpdated: '45 min ago', status: 'OFFLINE' },
];

export const terrainData: TerrainData[] = locations.map((loc) => {
  const score = riskScores.find((r) => r.locationId === loc.id);
  return {
    locationId: loc.id,
    slope: score?.slope ?? 15,
    elevation: loc.elevation,
    landCover: loc.elevation > 1000 ? 'Forest/Mixed' : loc.elevation > 300 ? 'Scrubland' : 'Agricultural',
    terrainVulnerability: Math.round((score?.score ?? 30) * 0.8),
    roadCuttingVulnerability: Math.round((score?.score ?? 30) * 0.6),
    satelliteChangeIndicator: Math.round((score?.score ?? 30) * 0.4),
  };
});

export const historicalLandslides: HistoricalLandslide[] = [
  { id: 'hl-1', locationId: 'loc-aizawl', date: '2024-07-15', severity: 'CRITICAL', fatalities: 3, affectedPopulation: 1200, description: 'Major landslide on NH-6 near Aizawl, blocking traffic for 3 days' },
  { id: 'hl-2', locationId: 'loc-aizawl', date: '2023-08-22', severity: 'HIGH', fatalities: 1, affectedPopulation: 450, description: 'Slope failure near Sairang village' },
  { id: 'hl-3', locationId: 'loc-aizawl', date: '2023-06-10', severity: 'HIGH', fatalities: 0, affectedPopulation: 300, description: 'Road blockage on Aizawl-Lunglei highway' },
  { id: 'hl-4', locationId: 'loc-shillong', date: '2024-06-28', severity: 'CRITICAL', fatalities: 5, affectedPopulation: 2000, description: 'Bridge collapse on Shillong-Tura road' },
  { id: 'hl-5', locationId: 'loc-shillong', date: '2023-07-14', severity: 'HIGH', fatalities: 2, affectedPopulation: 800, description: 'Landslide near Cherrapunji' },
  { id: 'hl-6', locationId: 'loc-kohima', date: '2024-08-03', severity: 'HIGH', fatalities: 1, affectedPopulation: 600, description: 'Road blockage on Kohima-Dimapur highway' },
  { id: 'hl-7', locationId: 'loc-kohima', date: '2023-09-18', severity: 'MODERATE', fatalities: 0, affectedPopulation: 200, description: 'Minor slope failure near Kohima village' },
  { id: 'hl-8', locationId: 'loc-imphal', date: '2024-07-20', severity: 'HIGH', fatalities: 0, affectedPopulation: 500, description: 'Soil movement on Imphal-Ukhrul road' },
  { id: 'hl-9', locationId: 'loc-gangtok', date: '2024-06-15', severity: 'CRITICAL', fatalities: 7, affectedPopulation: 3000, description: 'Major landslide on Gangtok-Nathula highway' },
  { id: 'hl-10', locationId: 'loc-gangtok', date: '2023-08-10', severity: 'CRITICAL', fatalities: 4, affectedPopulation: 1500, description: 'Multiple landslides in East Sikkim' },
  { id: 'hl-11', locationId: 'loc-tura', date: '2024-07-30', severity: 'HIGH', fatalities: 2, affectedPopulation: 700, description: 'Rockfall on Tura-Williamnagar road' },
  { id: 'hl-12', locationId: 'loc-champhai', date: '2023-08-05', severity: 'HIGH', fatalities: 1, affectedPopulation: 400, description: 'Landslide near Champhai town' },
  { id: 'hl-13', locationId: 'loc-ukhrul', date: '2024-08-12', severity: 'HIGH', fatalities: 0, affectedPopulation: 350, description: 'Slope failure near Ukhrul town' },
  { id: 'hl-14', locationId: 'loc-aizawl-south', date: '2023-07-25', severity: 'HIGH', fatalities: 1, affectedPopulation: 500, description: 'Landslide on Lunglei-Aizawl road' },
  { id: 'hl-15', locationId: 'loc-itanagar', date: '2023-06-18', severity: 'MODERATE', fatalities: 0, affectedPopulation: 150, description: 'Minor landslide near Itanagar' },
  { id: 'hl-16', locationId: 'loc-dibrugarh', date: '2023-07-08', severity: 'MODERATE', fatalities: 0, affectedPopulation: 200, description: 'Embankment failure near Dibrugarh' },
];

export const incidentReports: IncidentReport[] = [
  { id: 'inc-1', type: 'Crack', locationId: 'loc-aizawl', locationName: 'Aizawl', lat: 23.7271, lng: 92.7176, description: 'Large slope crack visible near NH-6, approximately 2 meters wide', severity: 'CRITICAL', reporterType: 'Citizen', reporterName: 'Lalruatfeli', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), hasImage: true, imageAnalysisId: 'ia-1', status: 'Verified' },
  { id: 'inc-2', type: 'Road Blockage', locationId: 'loc-kohima', locationName: 'Kohima', lat: 25.6751, lng: 94.1086, description: 'Road blocked by fallen rocks on Kohima-Dimapur highway', severity: 'HIGH', reporterType: 'Field Officer', reporterName: 'Arun Singh', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), hasImage: true, imageAnalysisId: 'ia-2', status: 'Pending' },
  { id: 'inc-3', type: 'Soil Movement', locationId: 'loc-shillong', locationName: 'Shillong', lat: 25.5788, lng: 91.8933, description: 'Slow soil movement observed near bridge foundation', severity: 'HIGH', reporterType: 'Field Officer', reporterName: 'Arun Singh', timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), hasImage: false, status: 'Pending' },
  { id: 'inc-4', type: 'Landslide', locationId: 'loc-gangtok', locationName: 'Gangtok', lat: 27.3389, lng: 88.6065, description: 'Small landslide on Gangtok-Nathula road, partial blockage', severity: 'CRITICAL', reporterType: 'Citizen', reporterName: 'Tashi', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), hasImage: true, imageAnalysisId: 'ia-3', status: 'Verified' },
  { id: 'inc-5', type: 'Rockfall', locationId: 'loc-tura', locationName: 'Tura', lat: 25.5117, lng: 90.2200, description: 'Rockfall near Tura-Williamnagar road, debris on road', severity: 'HIGH', reporterType: 'Citizen', reporterName: 'Sangma', timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(), hasImage: false, status: 'Pending' },
  { id: 'inc-6', type: 'Crack', locationId: 'loc-champhai', locationName: 'Champhai', lat: 23.4567, lng: 93.3293, description: 'Cracks appearing on hillside above Champhai town', severity: 'MODERATE', reporterType: 'Citizen', reporterName: 'Zorampari', timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(), hasImage: false, status: 'Pending' },
  { id: 'inc-7', type: 'Flooding', locationId: 'loc-guwahati', locationName: 'Guwahati', lat: 26.1445, lng: 91.7362, description: 'Road flooding near Bharalu river crossing', severity: 'MODERATE', reporterType: 'Citizen', reporterName: 'Bora', timestamp: new Date(Date.now() - 200 * 60 * 1000).toISOString(), hasImage: false, status: 'Resolved' },
];

export const imageAnalyses: ImageAnalysis[] = [
  { id: 'ia-1', incidentId: 'inc-1', crackDetected: true, slopeDamage: 'HIGH', instabilityIndicators: 3, severity: 78, confidence: 91, recommendedAction: 'Field inspection required', detectedFeatures: ['Wide slope crack', 'Soil displacement', 'Vegetation disturbance'], timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString() },
  { id: 'ia-2', incidentId: 'inc-2', crackDetected: false, slopeDamage: 'HIGH', instabilityIndicators: 2, severity: 65, confidence: 84, recommendedAction: 'Road clearance and slope assessment', detectedFeatures: ['Rock debris', 'Road surface damage'], timestamp: new Date(Date.now() - 58 * 60 * 1000).toISOString() },
  { id: 'ia-3', incidentId: 'inc-4', crackDetected: true, slopeDamage: 'CRITICAL', instabilityIndicators: 4, severity: 89, confidence: 95, recommendedAction: 'Immediate evacuation and road closure', detectedFeatures: ['Active landslide mass', 'Slope failure scarp', 'Debris flow channel', 'Blocked drainage'], timestamp: new Date(Date.now() - 43 * 60 * 1000).toISOString() },
];

export const roads: Road[] = [
  { id: 'r1', name: 'NH-6', type: 'National Highway', risk: 'CRITICAL', riskProbability: 84, connectivity: 'Major', villagesIsolated: 4, alternativeRoute: true, alternativeRouteName: 'Via Sairang–Lengpui', condition: 'Poor', locationId: 'loc-aizawl', length: 42 },
  { id: 'r2', name: 'NH-44', type: 'National Highway', risk: 'HIGH', riskProbability: 76, connectivity: 'Major', villagesIsolated: 3, alternativeRoute: true, alternativeRouteName: 'Via Jowai bypass', condition: 'Fair', locationId: 'loc-shillong', length: 55 },
  { id: 'r3', name: 'NH-29', type: 'National Highway', risk: 'HIGH', riskProbability: 72, connectivity: 'Major', villagesIsolated: 2, alternativeRoute: false, condition: 'Fair', locationId: 'loc-kohima', length: 38 },
  { id: 'r4', name: 'NH-37', type: 'National Highway', risk: 'MODERATE', riskProbability: 48, connectivity: 'Major', villagesIsolated: 1, alternativeRoute: true, alternativeRouteName: 'Via Nagaon', condition: 'Good', locationId: 'loc-guwahati', length: 60 },
  { id: 'r5', name: 'NH-10', type: 'National Highway', risk: 'CRITICAL', riskProbability: 89, connectivity: 'Major', villagesIsolated: 5, alternativeRoute: false, condition: 'Blocked', locationId: 'loc-gangtok', length: 35 },
  { id: 'r6', name: 'SH-1 (Tura-Williamnagar)', type: 'State Highway', risk: 'HIGH', riskProbability: 71, connectivity: 'Moderate', villagesIsolated: 3, alternativeRoute: true, alternativeRouteName: 'Via Rongram', condition: 'Poor', locationId: 'loc-tura', length: 28 },
  { id: 'r7', name: 'Aizawl-Lunglei Road', type: 'State Highway', risk: 'HIGH', riskProbability: 74, connectivity: 'Major', villagesIsolated: 4, alternativeRoute: false, condition: 'Fair', locationId: 'loc-aizawl-south', length: 45 },
  { id: 'r8', name: 'Imphal-Ukhrul Road', type: 'State Highway', risk: 'HIGH', riskProbability: 68, connectivity: 'Moderate', villagesIsolated: 2, alternativeRoute: true, alternativeRouteName: 'Via Phungyar', condition: 'Fair', locationId: 'loc-ukhrul', length: 32 },
  { id: 'r9', name: 'Itanagar-Pakke Road', type: 'State Highway', risk: 'MODERATE', riskProbability: 45, connectivity: 'Moderate', villagesIsolated: 1, alternativeRoute: true, alternativeRouteName: 'Via Bhalukpong', condition: 'Good', locationId: 'loc-itanagar', length: 25 },
  { id: 'r10', name: 'Champhai-Aizawl Road', type: 'State Highway', risk: 'HIGH', riskProbability: 70, connectivity: 'Major', villagesIsolated: 3, alternativeRoute: false, condition: 'Fair', locationId: 'loc-champhai', length: 40 },
];

export const villages: Village[] = [
  { id: 'v1', name: 'Sairang', locationId: 'loc-aizawl', population: 1200, risk: 'CRITICAL', distanceToHazard: 0.8, evacuationRoute: 'Via NH-6 east' },
  { id: 'v2', name: 'Sihphir', locationId: 'loc-aizawl', population: 850, risk: 'HIGH', distanceToHazard: 1.5, evacuationRoute: 'Via Aizawl bypass' },
  { id: 'v3', name: 'Durtlang', locationId: 'loc-aizawl', population: 600, risk: 'HIGH', distanceToHazard: 1.2, evacuationRoute: 'Via Sairang road' },
  { id: 'v4', name: 'Tuirial', locationId: 'loc-aizawl', population: 450, risk: 'MODERATE', distanceToHazard: 3.0, evacuationRoute: 'Via NH-6' },
  { id: 'v5', name: 'Mawphlang', locationId: 'loc-shillong', population: 700, risk: 'CRITICAL', distanceToHazard: 0.5, evacuationRoute: 'Via Shillong bypass' },
  { id: 'v6', name: 'Cherrapunji', locationId: 'loc-shillong', population: 1100, risk: 'HIGH', distanceToHazard: 1.0, evacuationRoute: 'Via NH-44' },
  { id: 'v7', name: 'Jotsoma', locationId: 'loc-kohima', population: 500, risk: 'HIGH', distanceToHazard: 1.3, evacuationRoute: 'Via Kohima-Dimapur' },
  { id: 'v8', name: 'Tseminyu', locationId: 'loc-kohima', population: 650, risk: 'MODERATE', distanceToHazard: 2.5, evacuationRoute: 'Via NH-29' },
  { id: 'v9', name: 'Nathula', locationId: 'loc-gangtok', population: 300, risk: 'CRITICAL', distanceToHazard: 0.3, evacuationRoute: 'Immediate evacuation' },
  { id: 'v10', name: 'Rongli', locationId: 'loc-gangtok', population: 800, risk: 'CRITICAL', distanceToHazard: 0.7, evacuationRoute: 'Via Gangtok-Siliguri' },
  { id: 'v11', name: 'Williamnagar', locationId: 'loc-tura', population: 900, risk: 'HIGH', distanceToHazard: 1.1, evacuationRoute: 'Via SH-1' },
  { id: 'v12', name: 'Phungyar', locationId: 'loc-ukhrul', population: 550, risk: 'HIGH', distanceToHazard: 1.4, evacuationRoute: 'Via Imphal-Ukhrul' },
];

export const hospitals: Hospital[] = [
  { id: 'h1', name: 'Aizawl Civil Hospital', locationId: 'loc-aizawl', lat: 23.7271, lng: 92.7176, beds: 200, emergencyCapacity: 45, distanceToHazard: 18 },
  { id: 'h2', name: 'NEIGRIHMS Shillong', locationId: 'loc-shillong', lat: 25.5788, lng: 91.8933, beds: 500, emergencyCapacity: 80, distanceToHazard: 22 },
  { id: 'h3', name: 'Kohima Civil Hospital', locationId: 'loc-kohima', lat: 25.6751, lng: 94.1086, beds: 150, emergencyCapacity: 30, distanceToHazard: 15 },
  { id: 'h4', name: 'STNM Hospital Gangtok', locationId: 'loc-gangtok', lat: 27.3389, lng: 88.6065, beds: 350, emergencyCapacity: 60, distanceToHazard: 12 },
  { id: 'h5', name: 'Tura Civil Hospital', locationId: 'loc-tura', lat: 25.5117, lng: 90.2200, beds: 120, emergencyCapacity: 25, distanceToHazard: 20 },
  { id: 'h6', name: 'Imphal Hospital', locationId: 'loc-imphal', lat: 24.8170, lng: 93.9368, beds: 250, emergencyCapacity: 50, distanceToHazard: 25 },
];

export const bridges: Bridge[] = [
  { id: 'b1', name: 'Tlawng River Bridge', locationId: 'loc-aizawl', type: ' RCC', risk: 'CRITICAL', condition: 'Poor' },
  { id: 'b2', name: 'Umiam Bridge', locationId: 'loc-shillong', type: 'RCC', risk: 'HIGH', condition: 'Fair' },
  { id: 'b3', name: 'Doyang Bridge', locationId: 'loc-kohima', type: 'Steel', risk: 'MODERATE', condition: 'Fair' },
  { id: 'b4', name: 'Rani Khola Bridge', locationId: 'loc-gangtok', type: 'RCC', risk: 'CRITICAL', condition: 'Critical' },
  { id: 'b5', name: 'Jinari Bridge', locationId: 'loc-tura', type: 'Steel', risk: 'HIGH', condition: 'Poor' },
  { id: 'b6', name: 'Imphal River Bridge', locationId: 'loc-imphal', type: 'RCC', risk: 'MODERATE', condition: 'Good' },
];

export const alerts: Alert[] = [
  {
    id: 'alert-1', level: 'CRITICAL', title: 'Critical Landslide Warning',
    locationId: 'loc-aizawl', locationName: 'Aizawl District',
    probability: 89, expectedWindow: 'Next 6–12 hours',
    cause: 'Heavy rainfall + high soil moisture + steep terrain',
    potentialImpact: 'NH-6 + 4 villages (Sairang, Sihphir, Durtlang, Tuirial)',
    recommendedAction: 'Immediate inspection and emergency preparedness',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert-2', level: 'CRITICAL', title: 'Critical Landslide Warning',
    locationId: 'loc-gangtok', locationName: 'Gangtok (East Sikkim)',
    probability: 91, expectedWindow: 'Next 3–6 hours',
    cause: 'Extreme rainfall + saturated soil + steep slope',
    potentialImpact: 'NH-10 + 5 villages, STNM Hospital access at risk',
    recommendedAction: 'Immediate evacuation and emergency team deployment',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert-3', level: 'WARNING', title: 'High Landslide Risk',
    locationId: 'loc-kohima', locationName: 'Kohima District',
    probability: 81, expectedWindow: 'Next 12–24 hours',
    cause: 'Heavy rainfall + steep terrain + road blockage reported',
    potentialImpact: 'NH-29 + 2 villages',
    recommendedAction: 'Road closure preparation and monitoring',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    acknowledged: true, assignedTeam: 'Team Alpha',
  },
  {
    id: 'alert-4', level: 'WARNING', title: 'Bridge Stability Risk',
    locationId: 'loc-shillong', locationName: 'Shillong (East Khasi Hills)',
    probability: 88, expectedWindow: 'Next 6–12 hours',
    cause: 'Soil movement near bridge foundation + heavy rainfall',
    potentialImpact: 'Umiam Bridge + 2 villages',
    recommendedAction: 'Bridge inspection and evacuation preparedness',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    acknowledged: true, assignedTeam: 'Team Bravo',
  },
  {
    id: 'alert-5', level: 'WATCH', title: 'Elevated Landslide Risk',
    locationId: 'loc-tura', locationName: 'Tura (West Garo Hills)',
    probability: 76, expectedWindow: 'Next 12–24 hours',
    cause: 'Heavy rainfall + rockfall reported on SH-1',
    potentialImpact: 'SH-1 + 3 villages',
    recommendedAction: 'Field inspection and sensor verification',
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert-6', level: 'WATCH', title: 'Elevated Landslide Risk',
    locationId: 'loc-champhai', locationName: 'Champhai District',
    probability: 79, expectedWindow: 'Next 12–24 hours',
    cause: 'Heavy rainfall + cracks reported on hillside',
    potentialImpact: 'Champhai-Aizawl Road + 3 villages',
    recommendedAction: 'Continuous monitoring and road inspection',
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert-7', level: 'INFO', title: 'Routine Monitoring Advisory',
    locationId: 'loc-guwahati', locationName: 'Guwahati (Kamrup Metro)',
    probability: 42, expectedWindow: 'Next 48 hours',
    cause: 'Moderate rainfall in low-slope area',
    potentialImpact: 'No immediate infrastructure risk',
    recommendedAction: 'Continue routine monitoring',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    acknowledged: true,
  },
];

export const emergencyTeams: EmergencyTeam[] = [
  { id: 'team-1', name: 'Team Alpha', type: 'Rescue', status: 'Deployed', location: 'Kohima', districtId: 'dist-kohima', personnelCount: 12, currentAssignment: 'NH-29 road blockage' },
  { id: 'team-2', name: 'Team Bravo', type: 'Engineering', status: 'Deployed', location: 'Shillong', districtId: 'dist-shillong', personnelCount: 8, currentAssignment: 'Umiam Bridge inspection' },
  { id: 'team-3', name: 'Team Charlie', type: 'Medical', status: 'On Standby', location: 'Aizawl', districtId: 'dist-aizawl', personnelCount: 6 },
  { id: 'team-4', name: 'Team Delta', type: 'Evacuation', status: 'Available', location: 'Gangtok', districtId: 'dist-gangtok', personnelCount: 15 },
  { id: 'team-5', name: 'Team Echo', type: 'Reconnaissance', status: 'Available', location: 'Aizawl', districtId: 'dist-aizawl', personnelCount: 4 },
  { id: 'team-6', name: 'Team Foxtrot', type: 'Rescue', status: 'On Standby', location: 'Tura', districtId: 'dist-tura', personnelCount: 10 },
  { id: 'team-7', name: 'Team Golf', type: 'Engineering', status: 'Returning', location: 'Imphal', districtId: 'dist-imphal', personnelCount: 7, currentAssignment: 'Returning from Ukhrul inspection' },
];

export const emergencyPriorities: EmergencyPriority[] = [
  {
    id: 'ep-1', locationId: 'loc-gangtok', locationName: 'Gangtok',
    risk: 91, populationImpact: 95, infrastructureImpact: 90, connectivityImpact: 95, timeSensitivity: 98,
    priorityScore: 94, recommendedAction: 'Immediate evacuation and emergency team deployment',
    threatenedInfrastructure: ['NH-10', 'Rani Khola Bridge', 'STNM Hospital access', '5 villages'],
    villagesAtRisk: 5,
  },
  {
    id: 'ep-2', locationId: 'loc-aizawl', locationName: 'Aizawl',
    risk: 87, populationImpact: 80, infrastructureImpact: 85, connectivityImpact: 88, timeSensitivity: 90,
    priorityScore: 86, recommendedAction: 'Immediate field inspection and emergency preparedness',
    threatenedInfrastructure: ['NH-6', 'Tlawng River Bridge', '4 villages'],
    villagesAtRisk: 4,
  },
  {
    id: 'ep-3', locationId: 'loc-shillong', locationName: 'Shillong',
    risk: 88, populationImpact: 85, infrastructureImpact: 82, connectivityImpact: 80, timeSensitivity: 85,
    priorityScore: 84, recommendedAction: 'Bridge inspection and evacuation preparedness',
    threatenedInfrastructure: ['NH-44', 'Umiam Bridge', '2 villages'],
    villagesAtRisk: 2,
  },
  {
    id: 'ep-4', locationId: 'loc-kohima', locationName: 'Kohima',
    risk: 81, populationImpact: 65, infrastructureImpact: 70, connectivityImpact: 78, timeSensitivity: 75,
    priorityScore: 74, recommendedAction: 'Road closure preparation and monitoring',
    threatenedInfrastructure: ['NH-29', '2 villages'],
    villagesAtRisk: 2,
  },
  {
    id: 'ep-5', locationId: 'loc-champhai', locationName: 'Champhai',
    risk: 79, populationImpact: 60, infrastructureImpact: 65, connectivityImpact: 70, timeSensitivity: 72,
    priorityScore: 69, recommendedAction: 'Continuous monitoring and road inspection',
    threatenedInfrastructure: ['Champhai-Aizawl Road', '3 villages'],
    villagesAtRisk: 3,
  },
  {
    id: 'ep-6', locationId: 'loc-tura', locationName: 'Tura',
    risk: 76, populationImpact: 55, infrastructureImpact: 60, connectivityImpact: 62, timeSensitivity: 68,
    priorityScore: 64, recommendedAction: 'Field inspection and sensor verification',
    threatenedInfrastructure: ['SH-1', 'Jinari Bridge', '3 villages'],
    villagesAtRisk: 3,
  },
  {
    id: 'ep-7', locationId: 'loc-ukhrul', locationName: 'Ukhrul',
    risk: 72, populationImpact: 50, infrastructureImpact: 55, connectivityImpact: 58, timeSensitivity: 65,
    priorityScore: 60, recommendedAction: 'Field inspection and community alert',
    threatenedInfrastructure: ['Imphal-Ukhrul Road', '2 villages'],
    villagesAtRisk: 2,
  },
  {
    id: 'ep-8', locationId: 'loc-aizawl-south', locationName: 'Lunglei',
    risk: 74, populationImpact: 48, infrastructureImpact: 52, connectivityImpact: 55, timeSensitivity: 62,
    priorityScore: 58, recommendedAction: 'Continuous monitoring and road inspection',
    threatenedInfrastructure: ['Aizawl-Lunglei Road', '4 villages'],
    villagesAtRisk: 4,
  },
];

export const forecastData: Record<string, ForecastPoint[]> = {
  'loc-aizawl': [
    { hour: 'Now', risk: 62, rainfall: 142, soilMoisture: 81 },
    { hour: '+6h', risk: 74, rainfall: 165, soilMoisture: 85 },
    { hour: '+12h', risk: 89, rainfall: 180, soilMoisture: 88 },
    { hour: '+24h', risk: 92, rainfall: 155, soilMoisture: 84 },
    { hour: '+48h', risk: 76, rainfall: 95, soilMoisture: 72 },
  ],
  'loc-shillong': [
    { hour: 'Now', risk: 58, rainfall: 138, soilMoisture: 78 },
    { hour: '+6h', risk: 70, rainfall: 155, soilMoisture: 82 },
    { hour: '+12h', risk: 85, rainfall: 170, soilMoisture: 85 },
    { hour: '+24h', risk: 88, rainfall: 140, soilMoisture: 80 },
    { hour: '+48h', risk: 68, rainfall: 85, soilMoisture: 68 },
  ],
  'loc-gangtok': [
    { hour: 'Now', risk: 72, rainfall: 156, soilMoisture: 85 },
    { hour: '+6h', risk: 88, rainfall: 185, soilMoisture: 90 },
    { hour: '+12h', risk: 95, rainfall: 195, soilMoisture: 92 },
    { hour: '+24h', risk: 91, rainfall: 160, soilMoisture: 86 },
    { hour: '+48h', risk: 72, rainfall: 98, soilMoisture: 74 },
  ],
  'loc-kohima': [
    { hour: 'Now', risk: 55, rainfall: 125, soilMoisture: 72 },
    { hour: '+6h', risk: 68, rainfall: 145, soilMoisture: 78 },
    { hour: '+12h', risk: 81, rainfall: 160, soilMoisture: 82 },
    { hour: '+24h', risk: 84, rainfall: 130, soilMoisture: 76 },
    { hour: '+48h', risk: 62, rainfall: 75, soilMoisture: 65 },
  ],
};

export const monthlyLandslideData = [
  { month: 'Jan', landslides: 2, rainfall: 45 },
  { month: 'Feb', landslides: 1, rainfall: 38 },
  { month: 'Mar', landslides: 3, rainfall: 65 },
  { month: 'Apr', landslides: 5, rainfall: 120 },
  { month: 'May', landslides: 12, rainfall: 280 },
  { month: 'Jun', landslides: 28, rainfall: 420 },
  { month: 'Jul', landslides: 35, rainfall: 510 },
  { month: 'Aug', landslides: 31, rainfall: 480 },
  { month: 'Sep', landslides: 22, rainfall: 350 },
  { month: 'Oct', landslides: 8, rainfall: 180 },
  { month: 'Nov', landslides: 3, rainfall: 70 },
  { month: 'Dec', landslides: 1, rainfall: 40 },
];

export const districtLandslideData = [
  { district: 'Aizawl', landslides: 18 },
  { district: 'East Khasi Hills', landslides: 15 },
  { district: 'East Sikkim', landslides: 22 },
  { district: 'Kohima', landslides: 12 },
  { district: 'Imphal West', landslides: 8 },
  { district: 'West Garo Hills', landslides: 10 },
  { district: 'Champhai', landslides: 7 },
  { district: 'Ukhrul', landslides: 6 },
];

export const yearlyRiskTrend = [
  { year: '2020', risk: 45, incidents: 42 },
  { year: '2021', risk: 52, incidents: 58 },
  { year: '2022', risk: 48, incidents: 51 },
  { year: '2023', risk: 61, incidents: 72 },
  { year: '2024', risk: 68, incidents: 85 },
  { year: '2025', risk: 72, incidents: 91 },
];

export const incidentSeverityData = [
  { severity: 'Low', count: 45 },
  { severity: 'Moderate', count: 38 },
  { severity: 'High', count: 28 },
  { severity: 'Critical', count: 12 },
];

export const demoFieldOfficers: FieldOfficer[] = [
  { id: 'fo-1', name: 'Arun Singh', email: 'arun@nersafe.gov.in', phone: '+91-9876543210', districtId: 'dist-aizawl', assignedZones: ['loc-aizawl', 'loc-aizawl-south'], status: 'Active', lastCheckIn: new Date(Date.now() - 10 * 60 * 1000).toISOString(), reportsThisWeek: 4, reportsThisMonth: 12, avatar: 'AS' },
  { id: 'fo-2', name: 'David Lianzuala', email: 'david@nersafe.gov.in', phone: '+91-9876543211', districtId: 'dist-aizawl', assignedZones: ['loc-aizawl'], status: 'Active', lastCheckIn: new Date(Date.now() - 25 * 60 * 1000).toISOString(), reportsThisWeek: 3, reportsThisMonth: 9, avatar: 'DL' },
  { id: 'fo-3', name: 'Sarah Chhakchhuak', email: 'sarah@nersafe.gov.in', phone: '+91-9876543212', districtId: 'dist-aizawl', assignedZones: ['loc-aizawl-south'], status: 'On Task', lastCheckIn: new Date(Date.now() - 45 * 60 * 1000).toISOString(), reportsThisWeek: 2, reportsThisMonth: 7, avatar: 'SC' },
  { id: 'fo-4', name: 'Vanlalhriata', email: 'vanlal@nersafe.gov.in', phone: '+91-9876543213', districtId: 'dist-aizawl', assignedZones: ['loc-aizawl', 'loc-champhai'], status: 'Active', lastCheckIn: new Date(Date.now() - 5 * 60 * 1000).toISOString(), reportsThisWeek: 5, reportsThisMonth: 14, avatar: 'VH' },
  { id: 'fo-5', name: 'Zothanpuii', email: 'zothan@nersafe.gov.in', phone: '+91-9876543214', districtId: 'dist-aizawl', assignedZones: ['loc-aizawl'], status: 'Offline', lastCheckIn: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), reportsThisWeek: 0, reportsThisMonth: 4, avatar: 'ZT' },
  { id: 'fo-6', name: 'Rochungnunga', email: 'rochung@nersafe.gov.in', phone: '+91-9876543215', districtId: 'dist-aizawl', assignedZones: ['loc-aizawl-south'], status: 'Active', lastCheckIn: new Date(Date.now() - 15 * 60 * 1000).toISOString(), reportsThisWeek: 2, reportsThisMonth: 6, avatar: 'RC' },
];

export const demoShelters: Shelter[] = [
  { id: 'sh-1', name: 'Aizawl Government College Shelter', locationId: 'loc-aizawl', district: 'Aizawl District', capacity: 500, currentOccupancy: 320, status: 'Open', lat: 23.7271, lng: 92.7176 },
  { id: 'sh-2', name: 'Kulikawn Community Hall', locationId: 'loc-aizawl', district: 'Aizawl District', capacity: 200, currentOccupancy: 180, status: 'Full', lat: 23.7350, lng: 92.7250 },
  { id: 'sh-3', name: 'Sairang School Shelter', locationId: 'loc-aizawl', district: 'Aizawl District', capacity: 150, currentOccupancy: 45, status: 'Open', lat: 23.7500, lng: 92.7000 },
  { id: 'sh-4', name: 'Lunglei District HQ Shelter', locationId: 'loc-aizawl-south', district: 'Lunglei District', capacity: 300, currentOccupancy: 210, status: 'Open', lat: 22.8819, lng: 92.7389 },
  { id: 'sh-5', name: 'Champhai Town Hall', locationId: 'loc-champhai', district: 'Champhai District', capacity: 180, currentOccupancy: 0, status: 'Closed', lat: 23.4567, lng: 93.3293 },
];

export const demoEvacuationRoutes: EvacuationRoute[] = [
  { id: 'er-1', name: 'NH-6 East Corridor', district: 'Aizawl District', affectedZones: ['loc-aizawl'], status: 'Blocked', lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: 'er-2', name: 'Aizawl Bypass Route', district: 'Aizawl District', affectedZones: ['loc-aizawl', 'loc-aizawl-south'], status: 'Clear', lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'er-3', name: 'Lunglei-Aizawl Road', district: 'Lunglei District', affectedZones: ['loc-aizawl-south'], status: 'Blocked', lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: 'er-4', name: 'Champhai Town Evacuation', district: 'Champhai District', affectedZones: ['loc-champhai'], status: 'Clear', lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
];

export const demoEscalations: Escalation[] = [
  { id: 'esc-1', districtId: 'dist-aizawl', type: 'zone', targetId: 'loc-aizawl', targetName: 'Aizawl Central Zone', reason: 'Risk score exceeded 85 with multiple villages at risk', escalatedBy: 'u2', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), adminResponse: 'NDRF Team Alpha deployed', status: 'Actioned' },
  { id: 'esc-2', districtId: 'dist-aizawl', type: 'incident', targetId: 'inc-1', targetName: 'Large slope crack near NH-6', reason: 'Critical infrastructure threat requiring immediate admin attention', escalatedBy: 'u2', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), status: 'Reviewed' },
  { id: 'esc-3', districtId: 'dist-aizawl', type: 'zone', targetId: 'loc-aizawl-south', targetName: 'Lunglei Zone', reason: 'Evacuation route blocked, need alternate route approval', escalatedBy: 'u2', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), adminResponse: 'Alternate route via Sairang approved', status: 'Actioned' },
];
