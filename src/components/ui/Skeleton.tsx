import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-shimmer rounded-sm', className)}
      aria-hidden="true"
    />
  );
}

/** Preset: Thread card skeleton */
export function ThreadCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 border border-line-200 rounded-md bg-paper-0">
      {/* Vote control skeleton */}
      <div className="flex flex-col items-center gap-1 shrink-0 w-10">
        <Skeleton className="h-5 w-5 rounded-sm" />
        <Skeleton className="h-4 w-6 rounded-sm" />
        <Skeleton className="h-5 w-5 rounded-sm" />
      </div>
      {/* Content skeleton */}
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-20 rounded-sm" /> {/* Category badge */}
        <Skeleton className="h-5 w-3/4 rounded-sm" /> {/* Title */}
        <Skeleton className="h-3 w-40 rounded-sm" /> {/* Meta */}
        <Skeleton className="h-3 w-full rounded-sm" /> {/* Excerpt line 1 */}
        <Skeleton className="h-3 w-2/3 rounded-sm" /> {/* Excerpt line 2 */}
      </div>
    </div>
  );
}

/** Preset: Comment skeleton */
export function CommentSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-3 w-24 rounded-sm" />
        <Skeleton className="h-3 w-full rounded-sm" />
        <Skeleton className="h-3 w-3/4 rounded-sm" />
      </div>
    </div>
  );
}

/** Preset: Generic list item skeleton */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-line-200">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-1/2 rounded-sm" />
        <Skeleton className="h-3 w-1/3 rounded-sm" />
      </div>
    </div>
  );
}
