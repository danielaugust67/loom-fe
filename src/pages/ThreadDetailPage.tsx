import { useParams, Link, useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import { useThread, useDeleteThread } from '@/features/threads/useThreads';
import { useAuthStore } from '@/stores/authStore';
import { formatDate } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ThreadCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import VoteControl from '@/components/thread/VoteControl';
import CommentTree from '@/components/comment/CommentTree';
import CommentForm from '@/components/comment/CommentForm';
import { Edit2, Trash2, Pin, Lock, MessageSquare, Eye, Bookmark, Flag } from 'lucide-react';
import { useAddBookmark, useRemoveBookmark } from '@/features/bookmarks/useBookmarks';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ReportModal from '@/components/report/ReportModal';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

export default function ThreadDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: thread, isLoading, isError } = useThread(slug!);
  const { mutate: deleteThread, isPending: isDeleting } = useDeleteThread(slug!);
  const { mutate: addBookmark, isPending: isAdding } = useAddBookmark();
  const { mutate: removeBookmark, isPending: isRemoving } = useRemoveBookmark();
  const queryClient = useQueryClient();
  
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const isBookmarkPending = isAdding || isRemoving;

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !thread) return;
    
    if (thread.is_bookmarked) {
      removeBookmark(thread.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['threads'] });
        }
      });
    } else {
      addBookmark(thread.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['threads'] });
        }
      });
    }
  };
  
  if (isLoading) {
    return (
      <PageShell>
        <ThreadCardSkeleton />
      </PageShell>
    );
  }

  if (isError || !thread) {
    return (
      <PageShell>
        <EmptyState
          title="Thread tidak ditemukan"
          description="Thread yang Anda cari mungkin telah dihapus atau URL tidak valid."
          actionLabel="Kembali ke Beranda"
          onAction={() => navigate('/')}
        />
      </PageShell>
    );
  }

  const isOwner = user?.id === thread.user.id;
  const isAdminOrMod = user?.role === 'admin' || user?.role === 'moderator';
  const canEdit = isOwner || isAdminOrMod;
  const canDelete = isOwner || isAdminOrMod;

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus thread ini?')) {
      deleteThread(undefined, {
        onSuccess: () => navigate('/'),
      });
    }
  };

  return (
    <PageShell>
      <article className="bg-paper-0 border-b border-line-200 mb-6 pb-2">
        <div className="flex gap-3 px-4 py-4 md:px-6 md:py-6">
          <div className="flex-shrink-0 pt-1">
            <Avatar src={thread.user.avatar_url} alt={thread.user.username} size="lg" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Meta */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-sm text-ink-600 flex-wrap">
                <Link to={`/u/${thread.user.username}`} className="font-bold text-base text-ink-950 hover:underline">
                  {thread.user.username}
                </Link>
                <span>di</span>
                <Link to={`/categories/${thread.category.slug}`} className="hover:underline text-accent-600">
                  {thread.category.name}
                </Link>
                <span aria-hidden="true">·</span>
                <time className="font-mono text-xs" dateTime={thread.created_at}>{formatDate(thread.created_at)}</time>
              </div>

              {canEdit && (
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/thread/${thread.slug}/edit`)} aria-label="Edit thread">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  {canDelete && (
                    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting} className="text-signal-red-600 hover:text-signal-red-600" aria-label="Hapus thread">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Title & Status */}
            <h1 className="text-xl md:text-2xl font-bold text-ink-950 tracking-tight mb-4 break-words">
              {thread.is_pinned && <Pin className="w-5 h-5 inline-block mr-2 text-accent-600 align-text-bottom" />}
              {thread.is_locked && <Lock className="w-5 h-5 inline-block mr-2 text-signal-red-600 align-text-bottom" />}
              {thread.title}
            </h1>

            {/* Content */}
            <div className="prose prose-sm md:prose-base max-w-none text-ink-950 prose-p:leading-normal prose-a:text-accent-600 break-words mb-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {thread.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map(tag => (
                  <Badge key={tag} variant="default" className="font-mono bg-paper-100 text-ink-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-line-200 mt-2 max-w-md pr-2 sm:pr-8">
              <a href="#comments" className="flex items-center gap-1 text-ink-400 hover:text-ink-950 transition-colors group">
                <div className="p-1.5 rounded-full group-hover:bg-paper-100 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-sm font-mono">{thread.comment_count || 0}</span>
              </a>
              
              <div className="flex items-center gap-1 text-ink-400">
                <div className="p-1.5">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-sm font-mono">{thread.view_count || 0}</span>
              </div>

              <VoteControl
                votableId={thread.id}
                votableType="thread"
                initialScore={thread.score || 0}
                initialUserVote={thread.user_vote}
              />

              <div className="flex items-center gap-1">
                <button
                  onClick={handleBookmark}
                  disabled={isBookmarkPending}
                  className={cn(
                    "p-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 group",
                    thread.is_bookmarked ? "text-ink-950" : "text-ink-400 hover:text-ink-950 hover:bg-paper-100"
                  )}
                  aria-label={thread.is_bookmarked ? "Hapus dari bookmark" : "Simpan bookmark"}
                >
                  <Bookmark className="w-5 h-5" fill={thread.is_bookmarked ? "currentColor" : "none"} />
                </button>

                {isAuthenticated && !isOwner && (
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="p-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 group text-ink-400 hover:text-signal-red-600 hover:bg-signal-red-50"
                    aria-label="Laporkan thread"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section id="comments" className="bg-paper-0 border border-line-200 rounded-md p-4 md:p-6">
        <h2 className="text-lg font-semibold text-ink-950 mb-6 flex items-center gap-2">
          Komentar <span className="font-mono text-ink-600 font-normal text-sm bg-paper-100 px-2 py-0.5 rounded-sm">{thread.comment_count || 0}</span>
        </h2>

        {thread.is_locked ? (
          <div className="p-4 mb-8 bg-signal-red-50 border border-signal-red-600/20 rounded-md text-signal-red-600 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Thread ini telah dikunci oleh moderator. Anda tidak dapat menambahkan komentar baru.
          </div>
        ) : (
          <div className="mb-8">
            <CommentForm threadId={thread.id} />
          </div>
        )}

        <CommentTree threadId={thread.id} />
      </section>

      <ReportModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportableId={thread.id}
        reportableType="thread"
      />
    </PageShell>
  );
}
