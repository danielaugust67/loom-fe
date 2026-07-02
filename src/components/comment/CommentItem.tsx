import { useState, useRef, useEffect } from 'react';
import type { Comment } from '@/types/api';
import { formatDate } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import VoteControl from '@/components/thread/VoteControl';
import CommentForm from './CommentForm';
import { MessageSquareReply, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useDeleteComment } from '@/features/comments/useComments';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/lib/utils';

// Agent instruction: limit visual indent
const MAX_VISUAL_DEPTH = 4;

interface CommentItemProps {
  comment: Comment;
  depth: number;
}

export default function CommentItem({ comment, depth }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore(s => s.user);
  const isOwner = user?.id === comment.user.id;
  const isModOrAdmin = user?.role === 'moderator' || user?.role === 'admin';
  const canEdit = isOwner || isModOrAdmin;
  const canDelete = isOwner || isModOrAdmin;

  const { mutate: deleteComment, isPending: deleting } = useDeleteComment(comment.id, comment.thread_id);

  const handleDelete = () => {
    if (confirm('Yakin ingin menghapus komentar ini?')) {
      deleteComment();
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visualDepth = Math.min(depth, MAX_VISUAL_DEPTH);

  return (
    <div className={cn("flex flex-col", visualDepth > 0 && "pl-4 sm:pl-8 border-l border-line-200 mt-4")}>
      <div className="flex gap-3">
        {/* Vote Control */}
        <div className="flex-shrink-0 pt-1">
          <VoteControl
            votableId={comment.id}
            votableType="comment"
            initialScore={comment.score || 0}
            initialUserVote={comment.user_vote}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs text-ink-600 flex-wrap">
            <Avatar src={comment.user.avatar_url} alt={comment.user.username} size="sm" className="w-5 h-5 sm:hidden" />
            <span className="font-medium text-ink-950">{comment.user.username}</span>
            <span aria-hidden="true">·</span>
            <time className="font-mono" dateTime={comment.created_at}>{formatDate(comment.created_at)}</time>
          </div>

          {/* Body */}
          <div className="prose prose-sm max-w-none text-ink-950 prose-p:leading-normal prose-a:text-accent-600">
            {comment.deleted_at ? (
              <p className="text-ink-400 italic">[komentar telah dihapus]</p>
            ) : isEditing ? (
              <div className="mt-2">
                <CommentForm
                  threadId={comment.thread_id}
                  initialContent={comment.content}
                  commentId={comment.id}
                  onCancel={() => setIsEditing(false)}
                  onSuccess={() => setIsEditing(false)}
                />
              </div>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {comment.content}
              </ReactMarkdown>
            )}
          </div>

          {/* Footer Actions */}
          {!comment.deleted_at && !isEditing && (
            <div className="flex items-center gap-4 mt-1">
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1.5 text-xs font-medium text-ink-600 hover:text-ink-950 transition-colors"
              >
                <MessageSquareReply className="w-4 h-4" />
                Balas
              </button>

              {(canEdit || canDelete) && (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-ink-500 hover:text-ink-950 transition-colors p-1 rounded-md hover:bg-ink-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute left-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-line-200 py-1 z-10">
                      {canEdit && (
                        <button
                          onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                          className="w-full text-left px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-50 flex items-center gap-2"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="w-full text-left px-3 py-1.5 text-sm text-signal-red-600 hover:bg-signal-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-2 mb-2">
              <CommentForm 
                threadId={comment.thread_id} 
                parentId={comment.id} 
                onCancel={() => setIsReplying(false)}
                onSuccess={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col mt-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
