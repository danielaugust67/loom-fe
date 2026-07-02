import { useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import { useThreads } from '@/features/threads/useThreads';
import ThreadCard from '@/components/thread/ThreadCard';
import { ThreadCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useThreads({ page, limit: 10 });

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-4 px-4 md:px-6 pt-4">
        <h1 className="text-xl font-bold text-ink-950 tracking-tight">Terbaru</h1>
      </div>

      <div className="space-y-0">
        {isLoading ? (
          <div className="space-y-3 px-4 md:px-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <ThreadCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Gagal memuat diskusi"
            description="Terjadi kesalahan saat mengambil data dari server."
            actionLabel="Coba lagi"
            onAction={() => refetch()}
          />
        ) : data?.data.length === 0 ? (
          <EmptyState
            title="Belum ada diskusi"
            description="Jadilah yang pertama memulai diskusi di sini."
          />
        ) : (
          <div className="border-t border-line-200">
            {data?.data.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </div>

      {data?.meta && data.meta.total_pages > 1 && (
        <div className="mt-8 pb-8">
          <Pagination
            currentPage={data.meta.page}
            totalPages={data.meta.total_pages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </PageShell>
  );
}
