import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { unwrap } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/stores/authStore';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/api';

/** Fetch current user profile (called on app init if token exists) */
export function useCurrentUser() {
  const setAuth = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/v1/users/me');
        return unwrap<User>(res);
      } catch (error) {
        logout();
        throw error;
      }
    },
    retry: 1,
    select: (data) => {
      // Sync store with fetched user data
      setAuth(data, useAuthStore.getState().accessToken!, useAuthStore.getState().refreshToken!);
      return data;
    },
    meta: {
      // Don't show error toast for initial auth check failure
      silent: true,
    },
    enabled: !!useAuthStore.getState().accessToken,
  });
}

/** Login mutation */
export function useLogin() {
  const setAuth = useAuthStore((s) => s.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await apiClient.post('/api/v1/auth/login', data);
      return unwrap<AuthResponse>(res);
    },
    onSuccess: ({ user, access_token, refresh_token }) => {
      setAuth(user, access_token, refresh_token);
      queryClient.setQueryData(queryKeys.auth.me, user);
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all() });
    },
  });
}

/** Register mutation */
export function useRegister() {
  const setAuth = useAuthStore((s) => s.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await apiClient.post('/api/v1/auth/register', data);
      return unwrap<AuthResponse>(res);
    },
    onSuccess: ({ user, access_token, refresh_token }) => {
      setAuth(user, access_token, refresh_token);
      queryClient.setQueryData(queryKeys.auth.me, user);
    },
  });
}

/** Logout action */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Best-effort server logout (invalidates refresh token cookie)
      await apiClient.post('/api/v1/auth/logout').catch(() => {});
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}
