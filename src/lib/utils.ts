import { clsx, type ClassValue } from 'clsx';

/** Merge class names — thin wrapper around clsx */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format relative time (e.g., "2h ago", "3d ago") */
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return 'baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}j`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}h`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}bln`;
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear}th`;
}

/** Format number with compact notation (e.g., 1.2k, 3.5m) */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

/** Debounce utility */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Format a date string into an Indonesian localized date (e.g., "12 Agustus 2026") */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
