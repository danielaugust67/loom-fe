import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrap, unwrapPaginated } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { Comment, CommentRequest } from '@/types/api';

/** Fetch comments for a thread */
export function useComments(threadId: string, page = 1) {
  return useQuery({
    queryKey: queryKeys.comments.byThread(threadId, page),
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/threads/${threadId}/comments`, {
        params: { page, limit: 20 },
      });
      return unwrapPaginated<Comment[]>(res);
    },
    enabled: !!threadId,
  });
}

/** Create comment mutation */
export function useCreateComment(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CommentRequest) => {
      const res = await apiClient.post(`/api/v1/threads/${threadId}/comments`, data);
      return unwrap<Comment>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byThread(threadId) });
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });
}

/** Update comment mutation */
export function useUpdateComment(commentId: string, threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const res = await apiClient.put(`/api/v1/comments/${commentId}`, data);
      return unwrap<Comment>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byThread(threadId) });
    },
  });
}

/** Delete comment mutation */
export function useDeleteComment(commentId: string, threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byThread(threadId) });
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });
}
