import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => {
    if (isAuthenticated) {
      setIsInitializing(false);
      return;
    }

    let isMounted = true;

    const restoreSession = async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (isMounted && data?.data?.access_token) {
          login(data.data.user, data.data.access_token, data.data.refresh_token);
        }
      } catch (err) {
        // Failed to restore (e.g. refresh token expired or doesn't exist)
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, login]);

  // Optionally return a full-page loading spinner here
  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-paper-0">
        <div className="w-8 h-8 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
