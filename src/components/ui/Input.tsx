import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-950">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-sm border bg-paper-0 px-3 py-2 text-sm text-ink-950 placeholder:text-ink-400',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600',
            error
              ? 'border-signal-red-600 focus:ring-signal-red-600/30 focus:border-signal-red-600'
              : 'border-line-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-signal-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-ink-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
