import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import type { VoteRequest } from '@/types/api';

/** Vote mutation with optimistic update */
export function useVote(votableType: 'thread' | 'comment') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VoteRequest) => {
      const res = await apiClient.post('/api/v1/votes', data);
      return res.data;
    },
    // Optimistic update is handled at the component level
    // because it depends on the context (thread card vs comment)
    onSettled: () => {
      if (votableType === 'thread') {
        queryClient.invalidateQueries({ queryKey: ['threads'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      }
    },
  });
}
