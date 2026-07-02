import type { ReactNode } from 'react';
import { MessageSquare } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-ink-400 mb-3">
        {icon || <MessageSquare className="h-10 w-10" />}
      </div>
      <h3 className="text-base font-medium text-ink-950 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ink-600 max-w-sm mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
