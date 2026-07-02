import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { useCreateComment, useUpdateComment } from '@/features/comments/useComments';
import { mapErrorMessage } from '@/lib/apiClient';
import { useAuthStore } from '@/stores/authStore';
import ImageUploadButton from '@/components/ui/ImageUploadButton';

const commentSchema = z.object({
  content: z.string().min(1, 'Komentar tidak boleh kosong'),
});

type CommentFormType = z.infer<typeof commentSchema>;

interface CommentFormProps {
  threadId: string;
  parentId?: string;
  commentId?: string;
  initialContent?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CommentForm({ threadId, parentId, commentId, initialContent, onSuccess, onCancel }: CommentFormProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateComment(threadId);
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateComment(commentId || '', threadId);
  const isEditing = !!commentId;

  const isPending = isCreating || isUpdating;
  const error = isEditing ? updateError : createError;
  const location = useLocation();
  const navigate = useNavigate();
  
  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<CommentFormType>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: initialContent || '',
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="p-4 border border-line-200 rounded-md bg-paper-50 text-center">
        <p className="text-sm text-ink-600 mb-3">Silakan masuk untuk membalas.</p>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => navigate('/login', { state: { from: location } })}
        >
          Masuk
        </Button>
      </div>
    );
  }

  const handleImageUpload = (markdown: string) => {
    const current = getValues('content') || '';
    setValue('content', current + markdown, { shouldValidate: true });
  };

  const onSubmit = (data: CommentFormType) => {
    if (isEditing) {
      updateMutate({ content: data.content }, {
        onSuccess: () => {
          reset();
          onSuccess?.();
        }
      });
    } else {
      createMutate({ parent_id: parentId, content: data.content }, {
        onSuccess: () => {
          reset();
          onSuccess?.();
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {error && <div className="text-sm text-signal-red-600">{mapErrorMessage(error)}</div>}
      <Textarea
        placeholder={parentId ? "Tulis balasan..." : "Tulis komentar..."}
        error={errors.content?.message}
        {...register('content')}
        rows={3}
      />
      <div className="flex justify-between items-center">
        <ImageUploadButton onUploadSuccess={handleImageUpload} />
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
              Batal
            </Button>
          )}
          <Button type="submit" loading={isPending} size="sm">
            Kirim
          </Button>
        </div>
      </div>
    </form>
  );
}
