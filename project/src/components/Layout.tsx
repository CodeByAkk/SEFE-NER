import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Brain, TrendingUp, FileText, ScanEye,
  Route, Bell, Siren, BarChart3, Radio, Settings, User,
  Menu, X, LogOut, Wifi, WifiOff, Globe, ShieldAlert, ChevronRight,
} from 'lucide-react';
import { useApp, hasAccess } from '@/context/AppContext';
import type { UserRole } from '@/types';

interface NavItem {
  path: string;
  label: string;
  labelKey: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { path: 'dashboard', label: 'Dashboard', labelKey: 'nav.dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: 'risk-map', label: 'Risk Map', labelKey: 'nav.riskMap', icon: <Map className="w-5 h-5" /> },
  { path: 'risk-prediction', label: 'Risk Prediction', labelKey: 'nav.riskPrediction', icon: <Brain className="w-5 h-5" /> },
  { path: 'risk-forecast', label: 'Risk Forecast', labelKey: 'nav.riskForecast', icon: <TrendingUp className="w-5 h-5" /> },
  { path: 'incident-reports', label: 'Incident Reports', labelKey: 'nav.incidentReports', icon: <FileText className="w-5 h-5" /> },
  { path: 'ai-image-analysis', label: 'AI Image Analysis', labelKey: 'nav.aiImageAnalysis', icon: <ScanEye className="w-5 h-5" /> },
  { path: 'infrastructure', label: 'Roads & Infrastructure', labelKey: 'nav.infrastructure', icon: <Route className="w-5 h-5" /> },
  { path: 'alerts', label: 'Alerts', labelKey: 'nav.alerts', icon: <Bell className="w-5 h-5" /> },
  { path: 'emergency-response', label: 'Emergency Response', labelKey: 'nav.emergencyResponse', icon: <Siren className="w-5 h-5" /> },
  { path: 'historical-analysis', label: 'Historical Analysis', labelKey: 'nav.historicalAnalysis', icon: <BarChart3 className="w-5 h-5" /> },
  { path: 'sensor-monitoring', label: 'Sensor Monitoring', labelKey: 'nav.sensorMonitoring', icon: <Radio className="w-5 h-5" /> },
  { path: 'settings', label: 'Settings', labelKey: 'nav.settings', icon: <Settings className="w-5 h-5" /> },
  { path: 'profile', label: 'Profile', labelKey: 'nav.profile', icon: <User className="w-5 h-5" /> },
];

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout, t, online, toggleOnline, pendingReports, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const role = user?.role ?? 'CITIZEN';
  const accessibleItems = navItems.filter((item) => hasAccess(role, item.path));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = (
    <aside className="w-64 bg-navy-900 border-r border-navy-700/50 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-navy-100 text-lg leading-none">NER-SAFE</h1>
            <p className="text-[10px] text-navy-500 mt-0.5">Landslide Warning System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {accessibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={`/${item.path}`}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border-r-2 border-blue-500'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-navy-100'
              }`
            }
          >
            {item.icon}
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="p-3 border-t border-navy-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-navy-700 flex items-center justify-center text-sm font-semibold text-navy-200">
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-navy-100 truncate">{user?.name}</p>
            <p className="text-xs text-navy-500 truncate">{user?.role.replace('_', ' ')}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 hover:bg-navy-700 rounded-lg transition-colors" title="Logout">
            <LogOut className="w-4 h-4 text-navy-400" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">{Sidebar}</div>

      {/* Mobile sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 animate-slide-in">{Sidebar}</div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-navy-900 border-b border-navy-700/50 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-1.5 hover:bg-navy-800 rounded-lg"
            >
              <Menu className="w-5 h-5 text-navy-300" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-navy-500">NER-SAFE</span>
              <ChevronRight className="w-3 h-3 text-navy-600" />
              <span className="text-xs text-navy-300">AI Landslide Early Warning System</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language selector */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-navy-800 rounded-lg transition-colors text-sm text-navy-300"
              title="Switch Language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">{language === 'en' ? 'EN' : 'हि'}</span>
            </button>

            {/* Online/Offline toggle */}
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-sm ${
                online
                  ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
              }`}
              title={online ? 'Online — click to simulate offline' : 'Offline — click to reconnect'}
            >
              {online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-xs font-medium hidden sm:inline">
                {online ? 'Online' : `${t('offline.mode')} (${pendingReports.length})`}
              </span>
            </button>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-xs font-semibold text-navy-200">
              {user?.avatar}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-navy-950">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-8 bg-navy-900 border-t border-navy-700/50 flex items-center justify-between px-4 text-[10px] text-navy-500 flex-shrink-0">
          <span>NER-SAFE | AI-Assisted Disaster Preparedness & Response</span>
          <span>© 2026 NER-SAFE | Prototype for Hackathon Demonstration</span>
        </footer>
      </div>
    </div>
  );
}
