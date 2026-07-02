import { Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import { useCategories } from '@/features/categories/useCategories';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Folder } from 'lucide-react';

export default function CategoriesPage() {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  return (
    <PageShell>
      <div className="mb-6 px-4 md:px-0">
        <h1 className="text-xl font-semibold text-ink-950 tracking-tight">Kategori</h1>
        <p className="text-sm text-ink-600 mt-1">Jelajahi diskusi berdasarkan topik.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-32">
              <CardContent className="h-full p-4 flex flex-col justify-center gap-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Gagal memuat kategori"
          description="Terjadi kesalahan saat mengambil data dari server."
          actionLabel="Coba lagi"
          onAction={() => refetch()}
        />
      ) : !categories || categories.length === 0 ? (
        <EmptyState
          title="Belum ada kategori"
          description="Kategori belum ditambahkan oleh administrator."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-0">
          {categories.map((category) => (
            <Link key={category.id} to={`/categories/${category.slug}`} className="group block">
              <Card className="h-full hover:border-accent-600 transition-colors bg-paper-0 group-hover:bg-accent-50/30">
                <CardHeader className="pb-2 flex flex-row items-center gap-2">
                  <div className="p-2 bg-paper-100 rounded-md text-ink-600 group-hover:text-accent-600 group-hover:bg-accent-50 transition-colors">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base group-hover:text-accent-600 transition-colors">
                      {category.name}
                    </CardTitle>
                    <p className="text-xs font-mono text-ink-600 mt-0.5">
                      {category.thread_count} threads
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ink-600 line-clamp-2">
                    {category.description || 'Tidak ada deskripsi.'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
