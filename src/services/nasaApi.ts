import type { WeatherForecast, RainfallRecord, ForecastPoint } from '@/types';

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || '';
const NASA_POWER_BASE = 'https://power.larc.nasa.gov/api/temporal/daily/point';
const NASA_FIRMS_BASE = 'https://firms.modaps.eosdis.nasa.gov/api/active_fire';
const NASA_GIBS_BASE = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';

export interface NASALocation {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

const nercLocations: NASALocation[] = [
  { id: 'loc-aizawl', name: 'Aizawl', district: 'Aizawl', state: 'Mizoram', lat: 23.7271, lng: 92.7176 },
  { id: 'loc-shillong', name: 'Shillong', district: 'East Khasi Hills', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },
  { id: 'loc-guwahati', name: 'Guwahati', district: 'Kamrup', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { id: 'loc-imphal', name: 'Imphal', district: 'Imphal West', state: 'Manipur', lat: 24.817, lng: 93.9368 },
  { id: 'loc-kohima', name: 'Kohima', district: 'Kohima', state: 'Nagaland', lat: 25.6586, lng: 94.1103 },
  { id: 'loc-agartala', name: 'Agartala', district: 'West Tripura', state: 'Tripura', lat: 23.8315, lng: 91.2868 },
  { id: 'loc-itanagar', name: 'Itanagar', district: 'Papum Pare', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053 },
  { id: 'loc-gangtok', name: 'Gangtok', district: 'East Sikkim', state: 'Sikkim', lat: 27.3389, lng: 88.6065 },
];

export async function fetchNASAPowerDaily(lat: number, lng: number, start: string, end: string) {
  const url = new URL(NASA_POWER_BASE);
  url.searchParams.set('parameters', 'PRECTOTCORR,T2M,TS,RH2M');
  url.searchParams.set('community', 'AG');
  url.searchParams.set('longitude', String(lng));
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('start', start);
  url.searchParams.set('end', end);
  url.searchParams.set('format', 'JSON');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('NASA POWER request failed');
  return res.json();
}

export async function fetchNASAPowerForecast(lat: number, lng: number): Promise<ForecastPoint[]> {
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + 7);

  const startStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const endStr = end.toISOString().slice(0, 10).replace(/-/g, '');

  const data = await fetchNASAPowerDaily(lat, lng, startStr, endStr);
  const property = data?.properties?.parameter;
  if (!property) return [];

  const dates = Object.keys(property.PRECTOTCORR || {});
  return dates.slice(0, 72).map((date) => {
    const precip = property.PRECTOTCORR[date] ?? 0;
    const temp = property.T2M[date] ?? 25;
    const rh = property.RH2M[date] ?? 70;
    const soil = Math.min(100, Math.max(0, rh - (temp - 20) * 0.5 + precip * 2));
    const risk = Math.min(100, Math.max(0, precip * 1.8 + soil * 0.6 + (temp > 30 ? 5 : 0)));

    return {
      hour: date,
      risk: Number(risk.toFixed(2)),
      rainfall: Number(precip.toFixed(2)),
      soilMoisture: Number(soil.toFixed(2)),
    };
  });
}

export async function fetchNASAActiveFires(lat: number, lng: number, radiusKm = 100) {
  const url = new URL(`${NASA_FIRMS_BASE}/country/csv/${NASA_API_KEY}/MODIS_NRT/IND/7`);
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const text = await res.text();
  const lines = text.trim().split('\n');
  if (lines.length <= 1) return [];

  return lines.slice(1).map((line) => {
    const cols = line.split(',');
    const latitude = Number(cols[0]);
    const longitude = Number(cols[1]);
    const distance = haversineKm(lat, lng, latitude, longitude);
    return {
      lat: latitude,
      lng: longitude,
      confidence: Number(cols[8]),
      distance,
    };
  }).filter((f) => f.distance <= radiusKm);
}

export async function fetchNASASatelliteImagery(lat: number, lng: number, layer = 'MODIS_Terra_CorrectedReflectance_TrueColor') {
  const url = new URL(NASA_GIBS_BASE);
  url.searchParams.set('service', 'WMS');
  url.searchParams.set('version', '1.3.0');
  url.searchParams.set('request', 'GetMap');
  url.searchParams.set('layers', layer);
  url.searchParams.set('styles', '');
  url.searchParams.set('crs', 'EPSG:4326');
  url.searchParams.set('bbox', `${lng - 0.5},${lat - 0.5},${lng + 0.5},${lat + 0.5}`);
  url.searchParams.set('width', '512');
  url.searchParams.set('height', '512');
  url.searchParams.set('format', 'image/png');
  url.searchParams.set('transparent', 'true');
  return url.toString();
}

export function getNASALocations(): NASALocation[] {
  return nercLocations;
}

export function getNASALocationById(id: string): NASALocation | undefined {
  return nercLocations.find((l) => l.id === id);
}

export function getNASALocationByCoords(lat: number, lng: number): NASALocation | undefined {
  return nercLocations.find((l) => Math.abs(l.lat - lat) < 0.1 && Math.abs(l.lng - lng) < 0.1);
}

export function computeTerrainRisk(lat: number, lng: number): number {
  const base = 30;
  const slopeFactor = (Math.sin((lat * 180) / Math.PI) * 40);
  const elevationFactor = ((lng % 10) * 3);
  const moistureFactor = ((lat % 5) * 2.5);
  return Number(Math.min(100, Math.max(0, base + slopeFactor + elevationFactor + moistureFactor)).toFixed(2));
}

export async function fetchNASAWeatherForLocation(lat: number, lng: number): Promise<WeatherForecast | undefined> {
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + 3);

  const startStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const endStr = end.toISOString().slice(0, 10).replace(/-/g, '');

  try {
    const data = await fetchNASAPowerDaily(lat, lng, startStr, endStr);
    const property = data?.properties?.parameter;
    if (!property) return undefined;

    const dates = Object.keys(property.PRECTOTCORR || {}).slice(0, 24);
    const forecast = dates.map((date) => {
      const precip = property.PRECTOTCORR[date] ?? 0;
      const temp = property.T2M[date] ?? 25;
      const rh = property.RH2M[date] ?? 70;
      const risk = Math.min(100, Math.max(0, precip * 1.8 + rh * 0.3 + (temp > 30 ? 5 : 0)));
      return {
        hour: new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        rainfall: Number(precip.toFixed(2)),
        risk: Number(risk.toFixed(2)),
      };
    });

    const currentTemp = property.T2M[dates[0]] ?? 25;
    const currentHumidity = property.RH2M[dates[0]] ?? 70;
    const currentPrecip = property.PRECTOTCORR[dates[0]] ?? 0;

    return {
      locationId: `loc-${lat.toFixed(2)}-${lng.toFixed(2)}`,
      condition: currentPrecip > 5 ? 'Heavy Rainfall' : currentPrecip > 1 ? 'Moderate Rainfall' : 'Clear',
      temperature: Number(currentTemp.toFixed(1)),
      humidity: Number(currentHumidity.toFixed(0)),
      windSpeed: 12,
      windDirection: 'NE',
      visibility: 8,
      forecast,
    };
  } catch (e) {
    return undefined;
  }
}

export async function fetchNASARainfallForLocation(lat: number, lng: number): Promise<RainfallRecord | undefined> {
  const today = new Date();
  const sixHoursAgo = new Date(today);
  sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

  const startStr = sixHoursAgo.toISOString().slice(0, 10).replace(/-/g, '');
  const endStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  try {
    const data = await fetchNASAPowerDaily(lat, lng, startStr, endStr);
    const property = data?.properties?.parameter;
    if (!property) return undefined;

    const dates = Object.keys(property.PRECTOTCORR || {});
    const current = property.PRECTOTCORR[dates[dates.length - 1]] ?? 0;
    const sixHour = dates.slice(-6).reduce((sum, d) => sum + (property.PRECTOTCORR[d] ?? 0), 0);
    const twentyFourHour = dates.slice(-24).reduce((sum, d) => sum + (property.PRECTOTCORR[d] ?? 0), 0);
    const fortyEightHour = dates.slice(-48).reduce((sum, d) => sum + (property.PRECTOTCORR[d] ?? 0), 0);

    return {
      locationId: `loc-${lat.toFixed(2)}-${lng.toFixed(2)}`,
      current: Number(current.toFixed(2)),
      sixHour: Number(sixHour.toFixed(2)),
      twentyFourHour: Number(twentyFourHour.toFixed(2)),
      fortyEightHour: Number(fortyEightHour.toFixed(2)),
      intensity: current > 10 ? 'Very Heavy' : current > 5 ? 'Heavy' : current > 2 ? 'Moderate' : 'Light',
      condition: current > 5 ? 'Active monsoon rainfall' : current > 1 ? 'Intermittent showers' : 'Dry spell',
      forecastTrend: current > 5 ? 'Increasing' : current > 0 ? 'Stable' : 'Decreasing',
    };
  } catch (e) {
    return undefined;
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
