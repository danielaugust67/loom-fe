import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrapPaginated } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/stores/authStore';
import type { Notification } from '@/types/api';

/** Fetch notifications */
export function useNotifications(page = 1) {
  return useQuery({
    queryKey: queryKeys.notifications.all(page),
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/notifications', { params: { page, limit: 20 } });
      return unwrapPaginated<Notification[]>(res);
    },
    refetchInterval: 30_000, // Poll every 30 seconds
  });
}

/** Fetch unread notification count */
export function useUnreadNotificationCount() {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/notifications', { params: { page: 1, limit: 1 } });
      const { meta } = unwrapPaginated<Notification[]>(res);
      return meta.total;
    },
    refetchInterval: 30_000, // Poll every 30 seconds
    enabled: isAuthenticated,
  });
}

/** Mark notification as read */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch(`/api/v1/notifications/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
