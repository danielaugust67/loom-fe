import { useState } from 'react';
import { useComments } from '@/features/comments/useComments';
import { CommentSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import CommentItem from './CommentItem';
import Pagination from '@/components/ui/Pagination';

interface CommentTreeProps {
  threadId: string;
}

export default function CommentTree({ threadId }: CommentTreeProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useComments(threadId, page);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Gagal memuat komentar"
        description="Terjadi kesalahan saat mengambil data dari server."
        actionLabel="Coba lagi"
        onAction={() => refetch()}
      />
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="py-8 text-center text-ink-600 text-sm">
        Belum ada komentar. Jadilah yang pertama!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        {data.data.map(comment => (
          <CommentItem key={comment.id} comment={comment} depth={0} />
        ))}
      </div>

      {data.meta && data.meta.total_pages > 1 && (
        <div className="pt-4 border-t border-line-200">
          <Pagination
            currentPage={data.meta.page}
            totalPages={data.meta.total_pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
