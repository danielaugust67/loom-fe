import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrap, unwrapPaginated } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { Thread, ThreadRequest, ThreadFilters } from '@/types/api';

/** Fetch paginated threads with filters */
export function useThreads(filters: ThreadFilters = {}) {
  return useQuery({
    queryKey: queryKeys.threads.all(filters),
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters.category) params.category = filters.category;
      if (filters.tag) params.tag = filters.tag;
      if (filters.q) params.q = filters.q;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;

      const res = await apiClient.get('/api/v1/threads', { params });
      return unwrapPaginated<Thread[]>(res);
    },
  });
}

/** Fetch single thread by slug */
export function useThread(slug: string) {
  return useQuery({
    queryKey: queryKeys.threads.detail(slug),
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/threads/${slug}`);
      return unwrap<Thread>(res);
    },
    enabled: !!slug,
  });
}

/** Create thread mutation */
export function useCreateThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ThreadRequest) => {
      const res = await apiClient.post('/api/v1/threads', data);
      return unwrap<Thread>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

/** Update thread mutation */
export function useUpdateThread(id: string, slug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ThreadRequest) => {
      const res = await apiClient.put(`/api/v1/threads/${id}`, data);
      return unwrap<Thread>(res);
    },
    onSuccess: () => {
      if (slug) queryClient.invalidateQueries({ queryKey: queryKeys.threads.detail(slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all() });
    },
  });
}

/** Delete thread mutation */
export function useDeleteThread(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/threads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all() });
    },
  });
}
