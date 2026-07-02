import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export default function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={cn(
        'w-full pb-20 md:pb-6', // Extra bottom padding for mobile nav
        className,
      )}
    >
      {children}
    </main>
  );
}
