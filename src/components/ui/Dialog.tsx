import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Close on ESC is handled natively by <dialog>
  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={cn(
        'backdrop:bg-ink-950/50 backdrop:backdrop-blur-sm',
        'bg-transparent p-0 m-auto',
        'open:animate-in open:fade-in',
        className,
      )}
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div className="bg-paper-0 rounded-md border border-line-200 shadow-lg w-full max-w-md p-0">
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-line-200">
            <h2 id="dialog-title" className="text-base font-medium text-ink-950">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-ink-400 hover:text-ink-950 transition-colors p-1"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="px-4 py-4">{children}</div>
      </div>
    </dialog>
  );
}

/* ── Confirm Dialog (shorthand) ── */

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'primary' | 'destructive';
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  loading,
  variant = 'primary',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <p className="text-sm text-ink-600 mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
