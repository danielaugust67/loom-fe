import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useUnreadNotificationCount } from '@/features/notifications/useNotifications';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/categories', icon: Grid3X3, label: 'Kategori' },
  { to: '/search', icon: Search, label: 'Cari' },
  { to: '/notifications', icon: Bell, label: 'Notifikasi', auth: true },
  { to: '/settings/profile', icon: User, label: 'Profil', auth: true },
];

export default function MobileNav() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line-200 bg-paper-0 md:hidden">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map(({ to, icon: Icon, label, auth }) => {
          if (auth && !isAuthenticated) {
            return (
              <Link
                key={to}
                to="/login"
                className="flex flex-col items-center gap-0.5 py-1 px-3 text-ink-400"
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px]">{label}</span>
              </Link>
            );
          }

          const isActive =
            to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'relative flex flex-col items-center gap-0.5 py-1 px-3 transition-colors',
                isActive ? 'text-accent-600' : 'text-ink-400 hover:text-ink-600',
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {to === '/notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[1rem] h-4 px-1 text-[9px] font-bold text-white bg-signal-red-600 rounded-full border border-paper-0">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
