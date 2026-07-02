import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/api';

interface AuthState {
  /** Current user — null if guest */
  user: User | null;
  /** Access token */
  accessToken: string | null;
  /** Refresh token */
  refreshToken: string | null;

  /* Actions */
  setUser: (user: User) => void;
  setAccessToken: (token: string, refreshToken?: string) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user }),

      setAccessToken: (token, refreshToken) => 
        set((state) => ({ 
          accessToken: token, 
          refreshToken: refreshToken || state.refreshToken 
        })),

      login: (user, accessToken, refreshToken) => 
        set({ user, accessToken, refreshToken }),

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },

      isAuthenticated: () => get().accessToken !== null && get().user !== null,
    }),
    {
      name: 'loom-auth-storage',
    }
  )
);
