import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  /** Generate page numbers to show (with ellipsis logic) */
  function getPageNumbers(): (number | '...')[] {
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first, last, current, current ± 1
    pages.push(1);

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    if (rangeStart > 2) pages.push('...');

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (rangeEnd < totalPages - 1) pages.push('...');

    pages.push(totalPages);
    return pages;
  }

  const pages = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Navigasi halaman">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'inline-flex items-center justify-center h-8 w-8 rounded-sm text-sm',
          'text-ink-600 hover:bg-paper-100 transition-colors',
          'disabled:opacity-30 disabled:cursor-not-allowed',
        )}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex items-center justify-center h-8 w-8 text-xs text-ink-400 font-mono"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'inline-flex items-center justify-center h-8 w-8 rounded-sm text-sm font-mono transition-colors',
              page === currentPage
                ? 'bg-accent-50 text-accent-600 font-medium'
                : 'text-ink-600 hover:bg-paper-100',
            )}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'inline-flex items-center justify-center h-8 w-8 rounded-sm text-sm',
          'text-ink-600 hover:bg-paper-100 transition-colors',
          'disabled:opacity-30 disabled:cursor-not-allowed',
        )}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
