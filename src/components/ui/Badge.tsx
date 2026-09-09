import type { RiskLevel, AlertLevel, SensorStatus } from '@/types';
import { getRiskBgClass } from '@/services/riskEngine';

export function RiskBadge({ level, size = 'sm' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const cls = getRiskBgClass(level);
  const sizeCls = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 ${cls} ${sizeCls} rounded-full border font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        level === 'LOW' ? 'bg-green-400' : level === 'MODERATE' ? 'bg-yellow-400' : level === 'HIGH' ? 'bg-orange-400' : 'bg-red-400'
      }`} />
      {level}
    </span>
  );
}

export function AlertLevelBadge({ level }: { level: AlertLevel }) {
  const cls = {
    INFO: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    WATCH: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    WARNING: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/30',
  }[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full border font-semibold ${cls}`}>
      {level}
    </span>
  );
}

export function SensorStatusBadge({ status }: { status: SensorStatus }) {
  const cls = {
    ONLINE: 'bg-green-500/10 text-green-400 border-green-500/30',
    OFFLINE: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    WARNING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/30',
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full border font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'ONLINE' ? 'bg-green-400' : status === 'OFFLINE' ? 'bg-gray-400' : status === 'WARNING' ? 'bg-yellow-400' : 'bg-red-400'} ${status === 'ONLINE' || status === 'CRITICAL' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls = {
    Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Verified: 'bg-green-500/10 text-green-400 border-green-500/30',
    Rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
    Resolved: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Available: 'bg-green-500/10 text-green-400 border-green-500/30',
    Deployed: 'bg-red-500/10 text-red-400 border-red-500/30',
    'On Standby': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Returning: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Completed: 'bg-green-500/10 text-green-400 border-green-500/30',
  }[status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border font-semibold ${cls}`}>
      {status}
    </span>
  );
}
