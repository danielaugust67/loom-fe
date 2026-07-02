import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Pin, Lock, Bookmark } from 'lucide-react';
import type { Thread } from '@/types/api';
import { formatDate } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import VoteControl from './VoteControl';
import { useAddBookmark, useRemoveBookmark } from '@/features/bookmarks/useBookmarks';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

interface ThreadCardProps {
  thread: Thread;
}

export function ThreadCardSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-line-200 bg-paper-0 animate-pulse">
      {/* Avatar skeleton */}
      <div className="flex-shrink-0 pt-1">
        <div className="w-10 h-10 rounded-full bg-paper-200" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-24 rounded bg-paper-200" />
          <div className="h-4 w-3 rounded bg-paper-200" />
          <div className="h-4 w-16 rounded bg-paper-200" />
          <div className="h-4 w-20 rounded bg-paper-200" />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 rounded bg-paper-200 mb-2" />

        {/* Snippet */}
        <div className="h-4 w-full rounded bg-paper-200 mb-1" />
        <div className="h-4 w-2/3 rounded bg-paper-200 mb-3" />

        {/* Action bar */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-8 rounded bg-paper-200" />
          <div className="h-4 w-8 rounded bg-paper-200" />
          <div className="h-4 w-12 rounded bg-paper-200" />
        </div>
      </div>
    </div>
  );
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  const { mutate: addBookmark, isPending: isAdding } = useAddBookmark();
  const { mutate: removeBookmark, isPending: isRemoving } = useRemoveBookmark();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const isBookmarkPending = isAdding || isRemoving;

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
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

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-line-200 bg-paper-0 hover:bg-paper-50 transition-colors">
      {/* Left Avatar */}
      <div className="flex-shrink-0 pt-1">
        <Avatar src={thread.user.avatar_url} alt={thread.user.username} size="md" />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Meta Header */}
        <div className="flex items-center gap-1.5 text-sm text-ink-600 flex-wrap mb-1">
          <Link to={`/u/${thread.user.username}`} className="font-bold text-ink-950 hover:underline truncate max-w-[120px] sm:max-w-[200px]">
            {thread.user.username}
          </Link>
          <span className="hidden sm:inline">di</span>
          <Link to={`/categories/${thread.category.slug}`} className="hover:underline text-ink-950 font-medium hidden sm:inline">
            {thread.category.name}
          </Link>
          <span aria-hidden="true">·</span>
          <time className="font-mono text-xs" dateTime={thread.created_at}>{formatDate(thread.created_at)}</time>
          
          {thread.is_pinned && (
            <Badge variant="default" className="ml-auto text-ink-950 bg-paper-100 border-transparent gap-1 hidden sm:flex">
              <Pin className="w-3 h-3" /> Pinned
            </Badge>
          )}
        </div>

        {/* Title & Snippet */}
        <Link to={`/thread/${thread.slug}`} className="group block mb-1">
          <h2 className="text-base sm:text-lg font-semibold text-ink-950 group-hover:underline transition-colors break-words">
            {thread.is_locked && <Lock className="w-4 h-4 inline-block mr-1.5 text-signal-red-600 align-text-bottom" />}
            {thread.title}
          </h2>
          {thread.content && (
            <p className="text-sm text-ink-600 line-clamp-2 mt-1 leading-relaxed break-words">
              {thread.content}
            </p>
          )}
        </Link>

        {/* Tags */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
            {thread.tags.map(tag => (
              <Badge key={tag} variant="default" className="font-mono text-[10px] px-1.5 py-0 bg-paper-100 text-ink-600">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-1 max-w-md pr-2 sm:pr-8">
          <Link to={`/thread/${thread.slug}#comments`} className="flex items-center gap-1 text-ink-400 hover:text-accent-600 transition-colors group">
            <div className="p-1.5 rounded-full group-hover:bg-accent-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono">{thread.comment_count || 0}</span>
          </Link>
          
          <div className="flex items-center gap-1 text-ink-400">
            <div className="p-1.5">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono">{thread.view_count || 0}</span>
          </div>

          <VoteControl
            votableId={thread.id}
            votableType="thread"
            initialScore={thread.score || 0}
            initialUserVote={thread.user_vote}
          />

          <button
            onClick={handleBookmark}
            disabled={isBookmarkPending}
            className={cn(
              "p-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 group",
              thread.is_bookmarked ? "text-accent-600" : "text-ink-400 hover:text-accent-600 hover:bg-accent-50"
            )}
            aria-label={thread.is_bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark className="w-4 h-4" fill={thread.is_bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}
