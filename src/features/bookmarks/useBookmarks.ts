import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapPaginated } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { Bookmark } from '@/types/api';

/** Fetch user's bookmarks */
export function useBookmarks(page = 1) {
  return useQuery({
    queryKey: queryKeys.bookmarks.all(page),
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/bookmarks', { params: { page, limit: 10 } });
      const unwrapped = unwrapPaginated<Bookmark[]>(res);
      
      unwrapped.data = unwrapped.data.map(b => {
        if (b.thread) {
          b.thread.is_bookmarked = true;
        }
        return b;
      });

      return unwrapped;
    },
  });
}

/** Add bookmark */
export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (threadId: string) => {
      await apiClient.post(`/api/v1/bookmarks/${threadId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      queryClient.invalidateQueries({ queryKey: ['thread'] });
    },
  });
}

/** Remove bookmark */
export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (threadId: string) => {
      await apiClient.delete(`/api/v1/bookmarks/${threadId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      queryClient.invalidateQueries({ queryKey: ['thread'] });
    },
  });
}
