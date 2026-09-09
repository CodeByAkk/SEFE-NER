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
    } catch (e) {}
    return demoUsers[0];
  });
  const [language, setLanguage] = useState<Language>('en');
  const [online, setOnline] = useState(true);
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [simulationActive, setSimulationActive] = useState(false);

  const login = useCallback((role: UserRole) => {
    const u = demoUsers.find((d) => d.role === role);
    if (u) {
      setUser(u);
      try {
        localStorage.setItem('nersafe_user', JSON.stringify(u));
      } catch (e) {}
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('nersafe_user');
    } catch (e) {}
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

  return (
    <AppContext.Provider value={{
      user, login, logout,
      language, setLanguage, t,
      online, toggleOnline,
      pendingReports, addPendingReport, syncReports,
      toasts, showToast, dismissToast,
      simulationActive, setSimulationActive,
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
