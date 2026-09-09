import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  };

  const borders = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
    warning: 'border-yellow-500/30',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-3 bg-navy-800 border ${borders[toast.type]} rounded-lg shadow-lg animate-slide-in`}
        >
          {icons[toast.type]}
          <p className="text-sm text-navy-100 flex-1">{toast.message}</p>
          <button onClick={() => dismissToast(toast.id)} className="text-navy-500 hover:text-navy-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
