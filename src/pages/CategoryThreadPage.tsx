import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { useThreads } from '@/features/threads/useThreads';
import ThreadCard from '@/components/thread/ThreadCard';
import { ThreadCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

export default function CategoryThreadPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  
  const { data, isLoading, isError, refetch } = useThreads({ 
    category: slug, 
    page, 
    limit: 10 
  });

  return (
    <PageShell>
      <div className="mb-6 px-4 md:px-6 pt-4">
        <Link 
          to="/categories" 
          className="inline-flex items-center text-sm font-medium text-ink-600 hover:text-accent-600 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Kategori
        </Link>
        <h1 className="text-xl font-semibold text-ink-950 tracking-tight">
          Kategori: <span className="text-accent-600">{slug}</span>
        </h1>
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
            title="Gagal memuat diskusi"
            description="Terjadi kesalahan saat mengambil data dari server."
            actionLabel="Coba lagi"
            onAction={() => refetch()}
          />
        ) : data?.data.length === 0 ? (
          <EmptyState
            title="Belum ada diskusi"
            description={`Jadilah yang pertama memulai diskusi di kategori ${slug}.`}
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
