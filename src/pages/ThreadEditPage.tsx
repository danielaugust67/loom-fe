import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import Card, { CardContent, CardFooter } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { useThread, useUpdateThread } from '@/features/threads/useThreads';
import { useCategories } from '@/features/categories/useCategories';
import { mapErrorMessage } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import { ThreadCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useAuthStore } from '@/stores/authStore';

const threadSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(150, 'Judul maksimal 150 karakter'),
  category_id: z.string().min(1, 'Kategori wajib dipilih'),
  content: z.string().min(10, 'Konten minimal 10 karakter'),
  tags: z.string().optional(),
  is_locked: z.boolean().optional(),
});

type ThreadForm = z.infer<typeof threadSchema>;

export default function ThreadEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  
  const { data: thread, isLoading: isLoadingThread, isError: isErrorThread } = useThread(slug!);
  const { mutate: updateThread, isPending, error } = useUpdateThread(thread?.id || '', slug!);
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ThreadForm>({
    resolver: zodResolver(threadSchema)
  });

  useEffect(() => {
    if (thread) {
      reset({
        title: thread.title,
        category_id: thread.category.id,
        content: thread.content,
        tags: thread.tags?.join(', ') || '',
        is_locked: thread.is_locked,
      });
    }
  }, [thread, reset]);

  if (isLoadingThread) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-4 md:px-0">
          <ThreadCardSkeleton />
        </div>
      </PageShell>
    );
  }

  if (isErrorThread || !thread) {
    return (
      <PageShell>
        <EmptyState
          title="Thread tidak ditemukan"
          description="Thread yang ingin diedit tidak ditemukan atau Anda tidak memiliki akses."
          actionLabel="Kembali ke Beranda"
          onAction={() => navigate('/')}
        />
      </PageShell>
    );
  }

  const isOwner = user?.id === thread.user.id;
  const isAdminOrMod = user?.role === 'admin' || user?.role === 'moderator';
  
  if (!isOwner && !isAdminOrMod) {
    return (
      <PageShell>
        <EmptyState
          title="Akses Ditolak"
          description="Anda tidak memiliki izin untuk mengedit thread ini."
          actionLabel="Kembali"
          onAction={() => navigate(-1)}
        />
      </PageShell>
    );
  }

  const onSubmit = (data: ThreadForm) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5) : []
    };
    
    updateThread(payload, {
      onSuccess: (updatedThread) => {
        navigate(`/thread/${updatedThread.slug}`);
      }
    });
  };

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 md:px-0 mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-ink-950 tracking-tight mb-6">Edit Diskusi</h1>
        <Card>
          <CardContent className="pt-6">
            <form id="edit-thread-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-signal-red-600 bg-signal-red-50 rounded-sm border border-signal-red-600/20">
                  {mapErrorMessage(error)}
                </div>
              )}
              
              <Input
                label="Judul"
                placeholder="Tulis judul yang menarik..."
                error={errors.title?.message}
                {...register('title')}
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="category_id" className="text-sm font-medium text-ink-950">
                  Kategori
                </label>
                <select
                  id="category_id"
                  className={cn(
                    'w-full rounded-sm border bg-paper-0 px-3 py-2 text-sm text-ink-950 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-accent-600/30 focus:border-accent-600',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    errors.category_id 
                      ? 'border-signal-red-600 focus:ring-signal-red-600/30 focus:border-signal-red-600' 
                      : 'border-line-200'
                  )}
                  disabled={isLoadingCategories}
                  {...register('category_id')}
                >
                  <option value="">Pilih Kategori</option>
                  {categories?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-xs text-signal-red-600">{errors.category_id.message}</p>}
              </div>

              <Textarea
                label="Isi Diskusi"
                placeholder="Mendukung Markdown. Jelaskan secara detail..."
                rows={12}
                error={errors.content?.message}
                {...register('content')}
              />

              <Input
                label="Tag (Opsional)"
                placeholder="react, web, typescript"
                helperText="Pisahkan dengan koma. Maksimal 5 tag."
                error={errors.tags?.message}
                {...register('tags')}
              />

              {(isOwner || isAdminOrMod) && (
                <div className="flex items-start gap-3 p-4 bg-paper-50 rounded-sm border border-line-200">
                  <div className="flex h-6 items-center">
                    <input
                      id="is_locked"
                      type="checkbox"
                      className="h-4 w-4 rounded border-line-300 text-accent-600 focus:ring-accent-600"
                      {...register('is_locked')}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="is_locked" className="font-medium text-ink-950">
                      Tutup Komentar (Kunci Thread)
                    </label>
                    <p className="text-ink-500">Mencegah pengguna lain menambahkan komentar baru di thread ini.</p>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="justify-end gap-3 bg-paper-50 rounded-b-md border-t border-line-200">
            <Button variant="ghost" onClick={() => navigate(-1)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" form="edit-thread-form" loading={isPending}>
              Simpan Perubahan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageShell>
  );
}
