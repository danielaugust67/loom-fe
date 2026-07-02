import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import type { PaginationMeta } from '@/types/api';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ── Request interceptor: attach Bearer token ── */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ── Response interceptor: auto-refresh on 401 ── */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and not already retried, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken = data.data.access_token;
        const newRefreshToken = data.data.refresh_token;
        useAuthStore.getState().setAccessToken(newAccessToken, newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — clear auth state, redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

/* ── Helpers ── */

/** Extract `data` from the backend envelope `{ success, data, meta }` */
export function unwrap<T>(response: { data: { data: T } }): T {
  return response.data.data;
}

/** Extract paginated data */
export function unwrapPaginated<T>(response: any): { data: T; meta: PaginationMeta } {
  const payload = response.data.data;
  const { data, ...meta } = payload;
  return { data, meta };
}

/** Map API error to user-friendly message */
export function mapErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data;

    if (response?.errors && Array.isArray(response.errors)) {
      return response.errors.map((e: { message: string }) => e.message).join(', ');
    }

    if (response?.message) {
      // Only show if it's a safe validation-style message (not internal detail)
      return response.message;
    }

    if (error.response?.status === 401) return 'Sesi telah berakhir. Silakan login kembali.';
    if (error.response?.status === 403) return 'Anda tidak memiliki akses untuk melakukan ini.';
    if (error.response?.status === 404) return 'Data tidak ditemukan.';
    if (error.response?.status === 422) return 'Data yang dikirim tidak valid.';
    if (error.response?.status === 429) return 'Terlalu banyak permintaan. Coba lagi beberapa saat.';

    return 'Terjadi kesalahan. Silakan coba lagi.';
  }

  if (error instanceof Error) return error.message;

  return 'Terjadi kesalahan yang tidak diketahui.';
}

export default apiClient;
