import type { ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useUIStore, type Toast as ToastType } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const icons: Record<ToastType['variant'], ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-signal-green-600" />,
  error: <AlertCircle className="h-4 w-4 text-signal-red-600" />,
  info: <Info className="h-4 w-4 text-accent-600" />,
};

function ToastItem({ id, message, variant }: ToastType) {
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border border-line-200 bg-paper-0 px-4 py-3 shadow-lg',
        'animate-in slide-in-from-right-5 fade-in',
      )}
      role="alert"
    >
      {icons[variant]}
      <p className="text-sm text-ink-950 flex-1">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="text-ink-400 hover:text-ink-950 transition-colors"
        aria-label="Tutup notifikasi"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}

/** Hook to show toasts easily */
export function useToast() {
  const addToast = useUIStore((s) => s.addToast);

  return {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  };
}
