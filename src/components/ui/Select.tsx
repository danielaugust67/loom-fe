import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-ink-950">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-sm border bg-paper-0 px-3 py-2 pr-8 text-sm text-ink-950',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600',
              error
                ? 'border-signal-red-600 focus:ring-signal-red-600/30 focus:border-signal-red-600'
                : 'border-line-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className,
            )}
            aria-invalid={error ? true : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        </div>
        {error && (
          <p id={`${selectId}-error`} className="text-xs text-signal-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
export default Select;
