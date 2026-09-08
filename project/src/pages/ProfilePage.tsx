import { useState } from 'react';
import {
  User,
  Shield,
  MapPin,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  RefreshCw,
  Globe,
  Sliders,
  Bell,
  Key,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '@/components/ui';
import { demoUsers } from '@/data/demoData';
import { useApp, roleAccess } from '@/context/AppContext';
import type { UserRole } from '@/types';

export function ProfilePage() {
  const { user, login, logout, language, setLanguage, showToast } = useApp();
  const navigate = useNavigate();

  const handleSwitchRole = (role: UserRole) => {
    login(role);
    showToast(`Switched stakeholder profile to: ${role.replace('_', ' ')}`, 'success');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentUser = user ?? demoUsers[0];
  const userPermissions = roleAccess[currentUser.role] || [];

  const allSystemFeatures = [
    { key: 'dashboard', label: 'Real-Time Hazard Dashboard' },
    { key: 'risk-map', label: 'GIS Topological Multi-Layer Map' },
    { key: 'risk-prediction', label: 'AI Geotechnical Prediction Sandbox' },
    { key: 'risk-forecast', label: '72-Hour Monsoon & Landslide Forecast' },
    { key: 'incident-reports', label: 'Crowdsourced Field Incident Reports' },
    { key: 'ai-image-analysis', label: 'AI Computer Vision Crack Workbench' },
    { key: 'infrastructure', label: 'Roads, Bridges & Settlement Isolation' },
    { key: 'alerts', label: 'Early Warning Broadcasts & Hotlines' },
    { key: 'emergency-response', label: 'NDRF Rescue & Multi-Agency Dispatch' },
    { key: 'historical-analysis', label: 'Multi-Decadal Landslide Archives' },
    { key: 'sensor-monitoring', label: 'IoT Geotechnical Sensor Mesh' },
    { key: 'settings', label: 'System Governance & Alarm Thresholds' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <User className="w-4 h-4" /> Stakeholder Access & Identity Registry
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            User Profile & Role Authorization
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Manage your stakeholder credentials, test role permissions, and calibrate emergency communication preferences
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Stakeholder Switcher Banner */}
      <Card className="p-4 border-blue-500/30 bg-blue-950/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-navy-700/60">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
              ⚡ Instant Stakeholder Profile Switcher
            </span>
            <p className="text-xs text-navy-300 mt-0.5">
              Tap any role below to immediately test the platform from that stakeholder's viewpoint:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {demoUsers.map((u) => {
            const isCurrent = currentUser.role === u.role;
            return (
              <button
                key={u.role}
                onClick={() => handleSwitchRole(u.role)}
                className={`p-3 rounded-xl text-left transition-all border flex items-center gap-3 ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-navy-900 border-navy-700/60 text-navy-200 hover:bg-navy-800'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-navy-800 text-blue-400'
                  }`}
                >
                  {u.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs truncate">{u.name}</p>
                  <p className={`text-[11px] truncate ${isCurrent ? 'text-blue-100' : 'text-navy-400'}`}>
                    {u.role.replace('_', ' ')}
                  </p>
                  <span className={`text-[9px] uppercase font-semibold ${isCurrent ? 'text-white' : 'text-navy-500'}`}>
                    {u.district ? `${u.district} Sector` : 'All NE States'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Profile Details & Permissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Identity Card */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-navy-700/60">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xl font-extrabold text-white shadow-lg shadow-blue-500/20">
                {currentUser.avatar}
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-100">{currentUser.name}</h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-1">
                  {currentUser.role.replace('_', ' ')}
                </span>
                <p className="text-xs text-navy-400 mt-1">{currentUser.email}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-navy-300">
                <Building2 className="w-4 h-4 text-navy-500 flex-shrink-0" />
                <span>
                  {currentUser.role === 'ADMIN'
                    ? 'NER State Disaster Coordination Cell'
                    : currentUser.role === 'DISTRICT_OFFICER'
                    ? 'District Disaster Management Authority (DDMA)'
                    : currentUser.role === 'FIELD_OFFICER'
                    ? 'Geological Field Unit & Rapid Assessment Team'
                    : 'Community Disaster Preparedness Committee'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-navy-300">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>Jurisdiction: {currentUser.district ? `${currentUser.district} District` : 'All 8 North Eastern States'}</span>
              </div>

              <div className="flex items-center gap-2.5 text-navy-300">
                <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Security Clearance: Level {currentUser.role === 'ADMIN' ? '4 (Full Operational)' : currentUser.role === 'DISTRICT_OFFICER' ? '3 (District Command)' : '2 (Field Observation)'}</span>
              </div>
            </div>

            {/* Language Selection */}
            <div className="pt-3 border-t border-navy-700/50 space-y-2">
              <span className="text-xs font-semibold text-navy-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-400" /> Interface Language
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-2 rounded-lg font-semibold border transition-all ${
                    language === 'en'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-navy-900 text-navy-300 border-navy-700 hover:bg-navy-800'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`py-2 rounded-lg font-semibold border transition-all ${
                    language === 'hi'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-navy-900 text-navy-300 border-navy-700 hover:bg-navy-800'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2 Cols: Role Permissions Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <CardHeader
              title="Stakeholder Authorization & Access Matrix"
              subtitle={`Current privileges enabled for role: ${currentUser.role.replace('_', ' ')}`}
              icon={<Key className="w-5 h-5 text-amber-400" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              {allSystemFeatures.map((feat) => {
                const isAllowed = userPermissions.includes(feat.key);
                return (
                  <div
                    key={feat.key}
                    className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                      isAllowed
                        ? 'bg-navy-800/80 border-navy-700/60 text-navy-200'
                        : 'bg-navy-900/40 border-navy-800/40 text-navy-500'
                    }`}
                  >
                    <span className={isAllowed ? 'font-medium' : 'line-through'}>
                      {feat.label}
                    </span>
                    {isAllowed ? (
                      <span className="flex items-center gap-1 text-green-400 font-bold text-[10px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Enabled
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-navy-600 text-[10px]">
                        <XCircle className="w-3 h-3" /> Restricted
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Stakeholder Activity Audit Log */}
          <Card className="p-5 space-y-3">
            <CardHeader
              title="Recent Stakeholder Activity Log"
              subtitle="Auditable transactions and operational actions logged in NER-SAFE ledger"
              icon={<Clock className="w-5 h-5 text-cyan-400" />}
            />

            <div className="space-y-2 text-xs divide-y divide-navy-700/40">
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy-100">Telemetry Ingestion & Sensor Sync</p>
                  <p className="text-[10px] text-navy-400">Pore pressure packet verified for SM-104 (Aizawl)</p>
                </div>
                <span className="text-[10px] text-navy-500">2 min ago</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy-100">Disaster Simulation Execution</p>
                  <p className="text-[10px] text-navy-400">Monsoon surge stress scenario simulated</p>
                </div>
                <span className="text-[10px] text-navy-500">14 min ago</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy-100">Ground Incident Verification</p>
                  <p className="text-[10px] text-navy-400">Incident #inc-1 confirmed by Field Command</p>
                </div>
                <span className="text-[10px] text-navy-500">32 min ago</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
