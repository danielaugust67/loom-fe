import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import Card, { CardContent, CardFooter } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { useCreateThread } from '@/features/threads/useThreads';
import { useCategories } from '@/features/categories/useCategories';
import { mapErrorMessage } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import ImageUploadButton from '@/components/ui/ImageUploadButton';

const threadSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(150, 'Judul maksimal 150 karakter'),
  category_id: z.string().min(1, 'Kategori wajib dipilih'),
  content: z.string().min(10, 'Konten minimal 10 karakter'),
  tags: z.string().optional()
});

type ThreadForm = z.infer<typeof threadSchema>;

export default function ThreadNewPage() {
  const navigate = useNavigate();
  const { mutate: createThread, isPending, error } = useCreateThread();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<ThreadForm>({
    resolver: zodResolver(threadSchema)
  });

  const handleImageUpload = (markdown: string) => {
    const current = getValues('content') || '';
    setValue('content', current + markdown, { shouldValidate: true });
  };

  const onSubmit = (data: ThreadForm) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5) : []
    };
    
    createThread(payload, {
      onSuccess: (thread) => {
        navigate(`/thread/${thread.slug}`);
      }
    });
  };

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 md:px-0 mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-ink-950 tracking-tight mb-6">Buat Diskusi Baru</h1>
        <Card>
          <CardContent className="pt-6">
            <form id="new-thread-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              <div className="space-y-1">
                <Textarea
                  label="Isi Diskusi"
                  placeholder="Mendukung Markdown. Jelaskan secara detail..."
                  rows={12}
                  error={errors.content?.message}
                  {...register('content')}
                />
                <div className="flex justify-end -mt-1">
                  <ImageUploadButton onUploadSuccess={handleImageUpload} />
                </div>
              </div>

              <Input
                label="Tag (Opsional)"
                placeholder="react, web, typescript"
                helperText="Pisahkan dengan koma. Maksimal 5 tag."
                error={errors.tags?.message}
                {...register('tags')}
              />
            </form>
          </CardContent>
          <CardFooter className="justify-end gap-3 bg-paper-50 rounded-b-md border-t border-line-200">
            <Button variant="ghost" onClick={() => navigate(-1)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" form="new-thread-form" loading={isPending}>
              Posting Diskusi
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageShell>
  );
}
