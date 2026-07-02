import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, maxLength, showCount, className, id, value, ...props }, ref) => {
    const inputId = id || props.name;
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-950">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          className={cn(
            'w-full rounded-sm border bg-paper-0 px-3 py-2 text-sm text-ink-950 placeholder:text-ink-400',
            'transition-colors resize-y min-h-[80px]',
            'focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600',
            error
              ? 'border-signal-red-600 focus:ring-signal-red-600/30 focus:border-signal-red-600'
              : 'border-line-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <div className="flex justify-between">
          {error && (
            <p id={`${inputId}-error`} className="text-xs text-signal-red-600">
              {error}
            </p>
          )}
          {!error && <span />}
          {showCount && maxLength && (
            <p className="text-xs text-ink-400 tabular-nums">
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
export default Textarea;
