import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-20 w-20 text-2xl',
};

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export default function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full overflow-hidden bg-paper-100 shrink-0',
        sizeStyles[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback to initial on load error
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.textContent = getInitial(alt);
            }
          }}
        />
      ) : (
        <span className="font-medium text-ink-600">{getInitial(alt)}</span>
      )}
    </div>
  );
}
