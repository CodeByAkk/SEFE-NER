import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Brain, Map, ScanEye, Bell, Siren, ArrowRight, Activity } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { UserRole } from '@/types';

const roles: { role: UserRole; labelKey: string; defaultLabel: string; description: string; icon: typeof ShieldAlert }[] = [
  { role: 'ADMIN', labelKey: 'login.admin', defaultLabel: 'Admin', description: 'Full system access', icon: ShieldAlert },
  { role: 'DISTRICT_OFFICER', labelKey: 'login.districtOfficer', defaultLabel: 'District Officer', description: 'District-level management', icon: Map },
  { role: 'FIELD_OFFICER', labelKey: 'login.fieldOfficer', defaultLabel: 'Field Officer', description: 'Field reporting & verification', icon: ScanEye },
  { role: 'CITIZEN', labelKey: 'login.citizen', defaultLabel: 'Citizen', description: 'View warnings & report incidents', icon: Bell },
];

const workflowSteps = [
  { icon: Activity, label: 'Predict', color: 'text-blue-400' },
  { icon: Brain, label: 'Monitor', color: 'text-cyan-400' },
  { icon: ScanEye, label: 'Verify', color: 'text-yellow-400' },
  { icon: Bell, label: 'Alert', color: 'text-orange-400' },
  { icon: Siren, label: 'Respond', color: 'text-red-400' },
];

export function Login() {
  const { login, t } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col lg:flex-row">
      {/* Left side — Branding & workflow */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" className="text-blue-500" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy-100 tracking-tight">NER-SAFE</h1>
              <p className="text-sm text-navy-400">North Eastern Region — Landslide Early Warning</p>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-semibold text-navy-100 mb-3 leading-tight">
            AI-Powered Landslide Early Warning<br />& Emergency Response
          </h2>
          <p className="text-navy-400 mb-8 leading-relaxed">
            A decision-support platform that combines multi-source environmental data, AI risk prediction,
            citizen verification, and dynamic risk updates to protect communities across North Eastern India.
          </p>

          {/* Workflow visualization */}
          <div className="card p-5 mb-6">
            <p className="text-xs text-navy-500 uppercase tracking-wide font-medium mb-4">Closed-Loop Workflow</p>
            <div className="flex items-center justify-between gap-1">
              {workflowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center ${step.color}`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-navy-300 font-medium">{step.label}</span>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-navy-600 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-navy-500 leading-relaxed">
            {t('disclaimer')}
          </p>
        </div>
      </div>

      {/* Right side — Login */}
      <div className="lg:w-[440px] bg-navy-900 border-l border-navy-700/50 flex flex-col justify-center px-8 py-12">
        <div className="max-w-sm w-full mx-auto">
          <h3 className="text-xl font-semibold text-navy-100 mb-1">{t('login.selectRole')}</h3>
          <p className="text-sm text-navy-400 mb-6">Choose a demo role to explore the platform</p>

          <div className="flex flex-col gap-3">
            {roles.map(({ role, defaultLabel, description, icon: Icon }) => (
              <button
                key={role}
                onClick={() => handleLogin(role)}
                className="group flex items-center gap-4 p-4 card card-hover text-left"
              >
                <div className="w-11 h-11 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-navy-100">{defaultLabel}</p>
                  <p className="text-xs text-navy-500">{description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-navy-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-navy-700/50">
            <p className="text-xs text-navy-500 text-center">
              Demo accounts for hackathon evaluation. No registration required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
