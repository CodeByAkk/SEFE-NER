export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  country: string;
  countryCode: string;
  state: string;
  adminLevel?: string;
  timezone: string;
  population?: number;
}

export interface CurrentWeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  weatherCode: number;
  elevation: number;
}

export interface HourlyData {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitation: number[];
  soilMoisture: number[];
  soilTemperature: number[];
  windSpeed: number[];
  pressure: number[];
  weatherCode: number[];
}

export interface RainfallAccumulation {
  oneHour: number;
  threeHour: number;
  sixHour: number;
  twentyFourHour: number;
  threeDay: number;
  sevenDay: number;
}

export interface WeatherData {
  location: GeocodingResult;
  current: CurrentWeatherData;
  hourly: HourlyData;
  rainfallAccumulation: RainfallAccumulation;
  lastUpdated: string;
}

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';

export const WMO_WEATHER_CODES: Record<number, { description: string; emoji: string }> = {
  0: { description: 'Clear sky', emoji: '\u2600\ufe0f' },
  1: { description: 'Mainly clear', emoji: '\u26C5' },
  2: { description: 'Partly cloudy', emoji: '\u2600\ufe0f\u2600\ufe0f' },
  3: { description: 'Overcast', emoji: '\u2600\ufe0f' },
  45: { description: 'Fog', emoji: '\uD83C\uDF2B' },
  48: { description: 'Depositing rime fog', emoji: '\uD83C\uDF2B' },
  51: { description: 'Light drizzle', emoji: '\uD83D\uDC99' },
  53: { description: 'Moderate drizzle', emoji: '\uD83D\uDC99' },
  55: { description: 'Dense drizzle', emoji: '\uD83D\uDC99' },
  56: { description: 'Light freezing drizzle', emoji: '\uD83D\uDC99' },
  57: { description: 'Dense freezing drizzle', emoji: '\uD83D\uDC99' },
  61: { description: 'Slight rain', emoji: '\uD83D\uDCA7' },
  63: { description: 'Moderate rain', emoji: '\uD83D\uDCA7' },
  65: { description: 'Heavy rain', emoji: '\uD83D\uDCA7' },
  66: { description: 'Light freezing rain', emoji: '\uD83D\uDCA7' },
  67: { description: 'Heavy freezing rain', emoji: '\uD83D\uDCA7' },
  71: { description: 'Slight snow fall', emoji: '\u2744\ufe0f' },
  73: { description: 'Moderate snow fall', emoji: '\u2744\ufe0f' },
  75: { description: 'Heavy snow fall', emoji: '\u2744\ufe0f' },
  77: { description: 'Snow grains', emoji: '\u2744\ufe0f' },
  80: { description: 'Slight rain showers', emoji: '\uD83D\uDCA7' },
  81: { description: 'Moderate rain showers', emoji: '\uD83D\uDCA7' },
  82: { description: 'Violent rain showers', emoji: '\uD83D\uDCA7' },
  85: { description: 'Slight snow showers', emoji: '\u2744\ufe0f' },
  86: { description: 'Heavy snow showers', emoji: '\u2744\ufe0f' },
  95: { description: 'Thunderstorm', emoji: '\u26A1\uD83D\uDEAA' },
  96: { description: 'Thunderstorm with slight hail', emoji: '\u26A1' },
  99: { description: 'Thunderstorm with heavy hail', emoji: '\u26A1' },
};

const WMO_EMOJI_MAP: Record<number, string> = {
  0: '\u2600\ufe0f',
  1: '\u26C5',
  2: '\u2600\ufe0f\u2600\ufe0f',
  3: '\u2600\ufe0f',
  45: '\uD83C\uDF2B',
  48: '\uD83C\uDF2B',
  51: '\uD83D\uDC99',
  53: '\uD83D\uDC99',
  55: '\uD83D\uDC99',
  56: '\uD83D\uDC99',
  57: '\uD83D\uDC99',
  61: '\uD83D\uDCA7',
  63: '\uD83D\uDCA7',
  65: '\uD83D\uDCA7',
  66: '\uD83D\uDCA7',
  67: '\uD83D\uDCA7',
  71: '\u2744\ufe0f',
  73: '\u2744\ufe0f',
  75: '\u2744\ufe0f',
  77: '\u2744\ufe0f',
  80: '\uD83D\uDCA7',
  81: '\uD83D\uDCA7',
  82: '\uD83D\uDCA7',
  85: '\u2744\ufe0f',
  86: '\u2744\ufe0f',
  95: '\u26A1\uD83D\uDEAA',
  96: '\u26A1',
  99: '\u26A1',
};

export function getWeatherEmoji(code: number): string {
  return WMO_EMOJI_MAP[code] ?? WMO_EMOJI_MAP[0];
}

export function getWeatherDescription(code: number): string {
  return WMO_WEATHER_CODES[code]?.description ?? 'Unknown';
}

export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round((degrees % 360) / 22.5)];
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function searchLocations(
  query: string,
  callback: (results: GeocodingResult[], loading: boolean) => void,
): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (!query.trim() || query.length < 2) {
    callback([], false);
    return;
  }

  callback([], true);

  debounceTimer = setTimeout(async () => {
    try {
      const url = `${GEOCODING_BASE}?name=${encodeURIComponent(query)}&count=8&format=json&language=en&extratags=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Geocoding request failed');
      const data = await res.json();
      const results: GeocodingResult[] = (data.results ?? []).map((r: Record<string, unknown>) => {
        const rr = r as { place_id?: number; name?: string; latitude?: number; longitude?: number; elevation?: number; country?: string; country_code?: string; state?: string; admin_level?: string; timezone?: string; population?: number };
        return {
          id: rr.place_id ?? 0,
          name: rr.name ?? '',
          latitude: Number(rr.latitude ?? 0),
          longitude: Number(rr.longitude ?? 0),
          elevation: Number(rr.elevation ?? 0),
          country: rr.country ?? '',
          countryCode: rr.country_code ?? '',
          state: rr.state ?? '',
          adminLevel: rr.admin_level,
          timezone: rr.timezone ?? '',
          population: rr.population ?? 0,
        };
      });
      callback(results, false);
    } catch {
      callback([], false);
    }
  }, 350);
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
  const url = `https://api.bigdatacloud.net/data/reversegeocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    id: 0,
    name: data.city || data.town || data.village || data.locality || 'Unknown Location',
    latitude: lat,
    longitude: lng,
    elevation: 0,
    country: data.countryName || '',
    countryCode: data.country || '',
    state: data.principalSubdivision || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    population: 0,
  };
}

export async function fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
  const url = new URL(FORECAST_BASE);
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lng));
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m');
  url.searchParams.set('hourly', 'temperature_2m,relative_humidity_2m,precipitation,weather_code,soil_moisture_at_1_to_3cm,soil_temperature_at_0_to_7cm,wind_speed_10m,pressure_msl');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Open-Meteo forecast request failed');
  const data = await res.json();

  const current = data.current || {};
  const hourly = data.hourly || {};

  const precipitation: number[] = hourly.precipitation || [];

  const rainfallAccumulation: RainfallAccumulation = {
    oneHour: sumLastN(precipitation, 1),
    threeHour: sumLastN(precipitation, 3),
    sixHour: sumLastN(precipitation, 6),
    twentyFourHour: sumLastN(precipitation, 24),
    threeDay: sumLastN(precipitation, 72),
    sevenDay: sumLastN(precipitation, 168),
  };

  const result: WeatherData = {
    location: {
      id: 0,
      name: '',
      latitude: lat,
      longitude: lng,
      elevation: 0,
      country: '',
      countryCode: '',
      state: '',
      timezone: data.timezone || '',
      population: 0,
    },
    current: {
      temperature: Number(current.temperature_2m ?? 0),
      humidity: Number(current.relative_humidity_2m ?? 0),
      precipitation: Number(current.precipitation ?? 0),
      windSpeed: Number(current.wind_speed_10m ?? 0),
      windDirection: getWindDirection(Number(current.wind_direction_10m ?? 0)),
      pressure: Number(current.pressure_msl ?? 0),
      weatherCode: Number(current.weather_code ?? 0),
      elevation: 0,
    },
    hourly: {
      time: hourly.time || [],
      temperature: hourly.temperature_2m || [],
      humidity: hourly.relative_humidity_2m || [],
      precipitation,
      soilMoisture: hourly.soil_moisture_at_1_to_3cm || [],
      soilTemperature: hourly.soil_temperature_at_0_to_7cm || [],
      windSpeed: hourly.wind_speed_10m || [],
      pressure: hourly.pressure_msl || [],
      weatherCode: hourly.weather_code || [],
    },
    rainfallAccumulation,
    lastUpdated: new Date().toISOString(),
  };

  return result;
}

export async function fetchElevation(lat: number, lng: number): Promise<number> {
  const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`;
  const res = await fetch(url);
  if (!res.ok) return 0;
  const data = await res.json();
  return Number(data.elevation?.[0] ?? 0);
}

function sumLastN(values: number[], n: number): number {
  if (!values || values.length === 0) return 0;
  const start = Math.max(0, values.length - n);
  return values.slice(start).reduce((sum, v) => sum + (v || 0), 0);
}
