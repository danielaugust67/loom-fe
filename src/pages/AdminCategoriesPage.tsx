import { useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/categories/useCategories';
import EmptyState from '@/components/ui/EmptyState';
import { Folder, Plus, Pencil, Trash2, X } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import type { Category } from '@/types/api';

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const { mutate: createCat, isPending: creating } = useCreateCategory();
  const { mutate: updateCat, isPending: updating } = useUpdateCategory();
  const { mutate: deleteCat, isPending: deleting } = useDeleteCategory();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', description: '', slug: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCat(formData, {
      onSuccess: () => {
        setIsAdding(false);
        setFormData({ name: '', description: '', slug: '' });
      }
    });
  };

  const handleUpdate = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    updateCat({ id, data: formData }, {
      onSuccess: () => {
        setEditingId(null);
        setFormData({ name: '', description: '', slug: '' });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus kategori ini? Semua thread di dalamnya mungkin akan kehilangan kategori.')) {
      deleteCat(id);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '', slug: cat.slug });
    setIsAdding(false);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '', slug: '' });
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-2 mb-6 px-4 md:px-6 pt-4">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-ink-950" />
          <h1 className="text-xl font-semibold text-ink-950 tracking-tight">Manajemen Kategori</h1>
        </div>
        {!isAdding && !editingId && (
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Tambah
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card className="mb-6 mx-4 md:mx-6 border-accent-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-ink-950">{isAdding ? 'Tambah Kategori Baru' : 'Edit Kategori'}</h2>
              <button onClick={cancelForm} className="text-ink-400 hover:text-ink-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => isAdding ? handleCreate(e) : handleUpdate(e, editingId!)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Nama"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Deskripsi"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={cancelForm}>Batal</Button>
                <Button type="submit" loading={creating || updating}>Simpan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="px-4 md:px-6 space-y-3">
          <p className="text-sm text-ink-600">Memuat kategori...</p>
        </div>
      ) : isError ? (
        <EmptyState
          title="Gagal memuat kategori"
          description="Anda mungkin tidak memiliki akses ke halaman ini."
          actionLabel="Coba lagi"
          onAction={() => refetch()}
        />
      ) : !categories || categories.length === 0 ? (
        <EmptyState
          icon={<Folder className="h-10 w-10 text-ink-300" />}
          title="Tidak ada kategori"
        />
      ) : (
        <div className="px-4 md:px-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => (
              <Card key={category.id} className={editingId === category.id ? 'ring-2 ring-accent-500' : ''}>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-medium text-ink-950 break-words line-clamp-2">{category.name}</h3>
                    <Badge variant="default" className="font-mono text-[10px] whitespace-nowrap flex-shrink-0">
                      {category.thread_count} threads
                    </Badge>
                  </div>
                  <p className="text-[10px] font-mono text-ink-400 bg-paper-100 px-1 py-0.5 rounded w-fit">/{category.slug}</p>
                  <p className="text-xs text-ink-600 line-clamp-2 mt-1">{category.description || 'Tidak ada deskripsi'}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-line-100">
                    <time className="text-[10px] font-mono text-ink-400">
                      {formatDate(category.created_at)}
                    </time>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => startEdit(category)}
                        className="p-1 text-ink-400 hover:text-accent-600 hover:bg-accent-50 rounded"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting}
                        className="p-1 text-ink-400 hover:text-signal-red-600 hover:bg-signal-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
