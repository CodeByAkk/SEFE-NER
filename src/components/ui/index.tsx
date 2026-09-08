import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={`card ${onClick ? 'card-hover cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon, action }: { title: string; subtitle?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between p-4 border-b border-navy-700/50">
      <div className="flex items-center gap-3">
        {icon && <div className="text-blue-400">{icon}</div>}
        <div>
          <h3 className="font-semibold text-navy-100">{title}</h3>
          {subtitle && <p className="text-xs text-navy-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function KpiCard({
  label, value, icon, color = 'blue', trend, onClick,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: 'blue' | 'red' | 'orange' | 'yellow' | 'green' | 'purple';
  trend?: string;
  onClick?: () => void;
}) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10',
    red: 'text-red-400 bg-red-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    green: 'text-green-400 bg-green-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };
  return (
    <Card className="p-4" onClick={onClick ? undefined : undefined}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-navy-400 uppercase tracking-wide font-medium">{label}</p>
          <p className="text-2xl font-bold text-navy-100 mt-1">{value}</p>
          {trend && <p className="text-xs text-navy-500 mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const barColor = color ?? (pct > 75 ? 'bg-red-500' : pct > 50 ? 'bg-orange-500' : pct > 25 ? 'bg-yellow-500' : 'bg-green-500');
  return (
    <div className="w-full bg-navy-900 rounded-full h-2 overflow-hidden">
      <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; maxWidth?: string }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`relative card max-w-lg w-full ${maxWidth} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-navy-700/50 sticky top-0 bg-navy-800/95 backdrop-blur-sm z-10">
          <h2 className="text-lg font-semibold text-navy-100">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-navy-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-navy-400" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-navy-600 mb-3">{icon}</div>
      <h3 className="text-navy-300 font-medium">{title}</h3>
      <p className="text-navy-500 text-sm mt-1">{description}</p>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-2 border-navy-700 border-t-blue-500 rounded-full animate-spin`} />
    </div>
  );
}

export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-900 text-navy-100 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {text}
      </div>
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-navy-700/50 text-navy-400 border border-navy-600/50 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      Demo Data
    </span>
  );
}

export function Disclaimer({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-navy-900/50 border border-navy-700/50 rounded-lg text-xs text-navy-400">
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
      <span>{text}</span>
    </div>
  );
}
