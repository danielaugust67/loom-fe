import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrap } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { Category } from '@/types/api';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/categories');
      return unwrap<Category[]>(res);
    },
    staleTime: 5 * 60 * 1000, // Categories rarely change
  });
}

/** Admin only: Create category */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description: string; slug: string }) => {
      const res = await apiClient.post('/api/v1/categories', data);
      return unwrap<Category>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

/** Admin only: Update category */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; description: string; slug: string } }) => {
      const res = await apiClient.put(`/api/v1/categories/${id}`, data);
      return unwrap<Category>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

/** Admin only: Delete category */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}
