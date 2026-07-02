import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrap } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import type { User } from '@/types/api';

/** Fetch public user profile */
export function useUserProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.users.profile(username),
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/users/${username}`);
      return unwrap<User>(res);
    },
    enabled: !!username,
  });
}

/** Update own profile */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bio?: string; avatar_url?: string }) => {
      const res = await apiClient.put('/api/v1/users/me', data);
      return unwrap<User>(res);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
    },
  });
}

/** Fetch all users (admin) */
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list,
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/users');
      return unwrap<User[]>(res);
    },
  });
}

/** Toggle user ban status (admin) */
export function useToggleBan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiClient.patch(`/api/v1/users/${userId}/ban`);
      return unwrap<User>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list });
    },
  });
}
