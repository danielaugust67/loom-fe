import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import ThreadCard, { ThreadCardSkeleton } from '@/components/thread/ThreadCard';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { useThreads } from '@/features/threads/useThreads';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const queryParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [inputValue, setInputValue] = useState(queryParam);
  const [q, setQ] = useState(queryParam);
  const [page, setPage] = useState(pageParam);

  // Sync state with URL params
  useEffect(() => {
    setInputValue(queryParam);
    setQ(queryParam);
    setPage(pageParam);
  }, [queryParam, pageParam]);

  const { data, isLoading, isError, refetch } = useThreads({
    q: q || undefined,
    page,
    limit: 10,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}&page=1`);
    } else {
      navigate(`/search`);
    }
  };

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-ink-950 mb-4 tracking-tight">Pencarian</h1>
        
        <form onSubmit={handleSearch} className="w-full mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Cari thread atau topik..."
              className="w-full rounded-md border border-line-200 bg-paper-0 py-3 pl-10 pr-4 text-base text-ink-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-950/30 focus:border-ink-950 shadow-sm"
            />
          </div>
        </form>

        {q && (
          <p className="text-sm text-ink-600 mb-4">
            Hasil pencarian untuk: <span className="font-semibold text-ink-950">"{q}"</span>
          </p>
        )}
      </div>

      <div className="bg-paper-0 rounded-lg border border-line-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div>
            <ThreadCardSkeleton />
            <ThreadCardSkeleton />
            <ThreadCardSkeleton />
          </div>
        ) : isError ? (
          <EmptyState
            title="Gagal memuat hasil"
            description="Terjadi kesalahan saat mencari data. Silakan coba lagi."
            actionLabel="Coba lagi"
            onAction={() => refetch()}
          />
        ) : !q ? (
          <EmptyState
            title="Mulai Mencari"
            description="Ketik kata kunci di atas untuk mencari diskusi."
          />
        ) : data?.data.length === 0 ? (
          <EmptyState
            title="Hasil tidak ditemukan"
            description={`Tidak ada diskusi yang cocok dengan kata kunci "${q}". Coba gunakan kata kunci lain.`}
          />
        ) : (
          <div className="divide-y divide-line-200">
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
              navigate(`/search?q=${encodeURIComponent(q)}&page=${p}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </PageShell>
  );
}
