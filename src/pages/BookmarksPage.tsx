import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { useBookmarks } from '@/features/bookmarks/useBookmarks';
import ThreadCard from '@/components/thread/ThreadCard';
import { ThreadCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

export default function BookmarksPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useBookmarks(page);

  return (
    <PageShell>
      <div className="flex items-center gap-2 mb-6 px-4 md:px-6 pt-4">
        <Bookmark className="w-5 h-5 text-ink-950" />
        <h1 className="text-xl font-semibold text-ink-950 tracking-tight">Tersimpan</h1>
      </div>

      <div className="space-y-0">
        {isLoading ? (
          <div className="space-y-3 px-4 md:px-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <ThreadCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Gagal memuat bookmark"
            description="Terjadi kesalahan saat mengambil data dari server."
            actionLabel="Coba lagi"
            onAction={() => refetch()}
          />
        ) : !data || data.data.length === 0 ? (
          <div className="px-4 md:px-6">
            <EmptyState
              icon={<Bookmark className="h-10 w-10 text-ink-300" />}
              title="Belum ada bookmark"
              description="Simpan diskusi menarik untuk membacanya lagi nanti."
            />
          </div>
        ) : (
          <div className="border-t border-line-200">
            {data.data.map((bookmark) => (
              bookmark.thread ? <ThreadCard key={bookmark.thread_id} thread={bookmark.thread} /> : null
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
