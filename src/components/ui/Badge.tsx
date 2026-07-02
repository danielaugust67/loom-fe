import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'accent' | 'red' | 'green';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-paper-100 text-ink-600',
  accent: 'bg-accent-50 text-accent-600',
  red: 'bg-signal-red-50 text-signal-red-600',
  green: 'bg-signal-green-50 text-signal-green-600',
};

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Tag (pill-shaped, for tags/labels) ── */

interface TagProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Tag({ children, active, onClick, className }: TagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-mono transition-colors',
        'border',
        active
          ? 'border-accent-600 bg-accent-50 text-accent-600'
          : 'border-line-200 bg-paper-0 text-ink-600 hover:bg-paper-100',
        onClick && 'cursor-pointer',
        !onClick && 'cursor-default',
        className,
      )}
    >
      {children}
    </button>
  );
}
