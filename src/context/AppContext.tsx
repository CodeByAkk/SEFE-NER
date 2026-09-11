import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Language, UserRole } from '@/types';
import { demoUsers, locations } from '@/data/demoData';
import { translate } from '@/i18n/translations';
import type { GeocodingResult, WeatherData } from '@/services/openMeteo';
import { fetchWeatherData, fetchElevation, reverseGeocode } from '@/services/openMeteo';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface PendingReport {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface AppContextValue {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  online: boolean;
  toggleOnline: () => void;
  pendingReports: PendingReport[];
  addPendingReport: (report: PendingReport) => void;
  syncReports: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  simulationActive: boolean;
  setSimulationActive: (v: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedLocation: GeocodingResult | null;
  setSelectedLocation: (loc: GeocodingResult | null) => void;
  weatherData: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  lastUpdated: string | null;
  fetchWeather: (lat: number, lng: number, locName?: string) => Promise<void>;
  refreshData: () => Promise<void>;
  locateUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('nersafe_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) return parsed;
      }
    } catch { /* ignore read error */ }
    return demoUsers[0];
  });

  const [language, setLanguage] = useState<Language>('en');
  const [online, setOnline] = useState(true);
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [simulationActive, setSimulationActive] = useState(false);

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nersafe_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'dark';
  });

  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(() => {
    const saved = localStorage.getItem('nersafe_location');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore parse error */ }
    }
    return null;
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nersafe_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('nersafe_location', JSON.stringify(selectedLocation));
    }
  }, [selectedLocation]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const login = useCallback((role: UserRole) => {
    const u = demoUsers.find((d) => d.role === role);
    if (u) {
      setUser(u);
      try {
        localStorage.setItem('nersafe_user', JSON.stringify(u));
      } catch { /* ignore write error */ }
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('nersafe_user');
    } catch { /* ignore remove error */ }
  }, []);

  const t = useCallback((key: string) => translate(key, language), [language]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toggleOnline = useCallback(() => {
    setOnline((prev) => {
      const next = !prev;
      if (next && pendingReports.length > 0) {
        setTimeout(() => {
          showToast(`${pendingReports.length} ${t('online.synced')}`, 'success');
          setPendingReports([]);
        }, 1500);
      }
      return next;
    });
  }, [pendingReports, t, showToast]);

  const addPendingReport = useCallback((report: PendingReport) => {
    setPendingReports((prev) => [...prev, report]);
  }, []);

  const syncReports = useCallback(() => {
    if (pendingReports.length > 0) {
      showToast(`${pendingReports.length} ${t('online.synced')}`, 'success');
      setPendingReports([]);
    }
  }, [pendingReports, t, showToast]);

  const fetchWeather = useCallback(async (lat: number, lng: number, locName?: string) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await fetchWeatherData(lat, lng);
      if (locName && !data.location.name) {
        data.location.name = locName;
      }
      const elevation = await fetchElevation(lat, lng);
      data.current.elevation = elevation;
      setWeatherData(data);
      setLastUpdated(new Date().toLocaleString());
    } catch (e) {
      const msg = (e as Error)?.message ?? 'Failed to fetch weather data';
      setWeatherError(msg);
      showToast(msg, 'error');
    } finally {
      setWeatherLoading(false);
    }
  }, [showToast]);

  const refreshData = useCallback(async () => {
    if (!selectedLocation) return;
    await fetchWeather(selectedLocation.latitude, selectedLocation.longitude, selectedLocation.name);
  }, [selectedLocation, fetchWeather]);

  const locateUser = useCallback(async () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const geoLoc = await reverseGeocode(latitude, longitude);
      if (!geoLoc) {
        showToast('Unable to determine your location', 'error');
        return;
      }
      setSelectedLocation(geoLoc);
      await fetchWeather(latitude, longitude, geoLoc.name);
      showToast(`Location set to ${geoLoc.name}`, 'success');
    } catch {
      showToast('Location permission denied. Please search for a location manually.', 'error');
    }
  }, [fetchWeather, showToast]);

  useEffect(() => {
    if (selectedLocation) {
      fetchWeather(selectedLocation.latitude, selectedLocation.longitude, selectedLocation.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  useEffect(() => {
    if (!selectedLocation) return;
    const interval = setInterval(() => {
      fetchWeather(selectedLocation.latitude, selectedLocation.longitude, selectedLocation.name);
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedLocation, fetchWeather]);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      language, setLanguage, t,
      online, toggleOnline,
      pendingReports, addPendingReport, syncReports,
      toasts, showToast, dismissToast,
      simulationActive, setSimulationActive,
      theme, toggleTheme,
      selectedLocation, setSelectedLocation,
      weatherData, weatherLoading, weatherError, lastUpdated,
      fetchWeather, refreshData, locateUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function getDistrictId(user: User | null): string | undefined {
  return user?.districtId || user?.district;
}

export function isDistrictOfficer(user: User | null): boolean {
  return user?.role === 'DISTRICT_OFFICER';
}

export function filterByDistrict<T extends { locationId?: string; districtId?: string; district?: string }>(
  items: T[],
  user: User | null,
): T[] {
  const districtId = getDistrictId(user);
  if (!districtId || !isDistrictOfficer(user)) return items;
  return items.filter((item) => {
    if (item.districtId) return item.districtId === districtId;
    if (item.locationId) {
      const loc = locations.find((l) => l.id === item.locationId);
      return loc?.districtId === districtId;
    }
    if (item.district) return item.district === user?.district;
    return true;
  });
}

// Role-based access control
export const roleAccess: Record<UserRole, string[]> = {
  ADMIN: ['dashboard', 'risk-map', 'risk-prediction', 'risk-forecast', 'incident-reports', 'ai-image-analysis', 'infrastructure', 'alerts', 'emergency-response', 'historical-analysis', 'sensor-monitoring', 'field-team', 'reports', 'escalate', 'settings', 'profile'],
  DISTRICT_OFFICER: ['dashboard', 'risk-map', 'risk-prediction', 'risk-forecast', 'incident-reports', 'ai-image-analysis', 'alerts', 'emergency-response', 'infrastructure', 'historical-analysis', 'sensor-monitoring', 'field-team', 'reports', 'escalate', 'settings', 'profile'],
  FIELD_OFFICER: ['dashboard', 'risk-map', 'risk-prediction', 'risk-forecast', 'incident-reports', 'ai-image-analysis', 'infrastructure', 'alerts', 'sensor-monitoring', 'historical-analysis', 'profile'],
  CITIZEN: ['dashboard', 'risk-map', 'risk-forecast', 'incident-reports', 'ai-image-analysis', 'infrastructure', 'alerts', 'emergency-response', 'historical-analysis', 'profile'],
};

export function hasAccess(role: UserRole, path: string): boolean {
  return roleAccess[role].includes(path);
}
