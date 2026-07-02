import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '@/stores/uiStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/lib/utils';
import { X, Home, Bell, Bookmark, Hash, Sun, Moon } from 'lucide-react';
import { useCategories } from '@/features/categories/useCategories';
import { useAuthStore } from '@/stores/authStore';
import { useUnreadNotificationCount } from '@/features/notifications/useNotifications';

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken && !!s.user);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const { data: categories, isLoading } = useCategories();
  const { theme, toggleTheme } = useThemeStore();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const mainNav = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Notifikasi', href: '/notifications', icon: Bell },
    { name: 'Bookmark', href: '/settings/bookmarks', icon: Bookmark },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          // Base styles
          'fixed inset-y-0 left-0 z-50 w-64 bg-paper-0 border-r border-line-200 overflow-y-auto transition-transform duration-200',
          // Desktop: sticky layout
          'md:relative md:translate-x-0 md:top-14 md:h-[calc(100vh-3.5rem)] md:sticky md:block md:w-64 md:border-r-0 md:pr-4',
          // Mobile: slide in/out
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
        aria-label="Sidebar navigasi"
      >
        <div className="flex flex-col h-full">
          {/* Close button (mobile) */}
          <div className="flex items-center justify-between p-4 border-b border-line-200 md:hidden">
            <h2 className="text-sm font-medium text-ink-950">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-ink-400 hover:text-ink-950"
              aria-label="Tutup sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="p-3 md:pt-6 flex-1 space-y-6">
            {/* Main Navigation */}
            <ul className="space-y-1">
              {mainNav.map((item) => {
                if (!isAuthenticated && (item.name === 'Notifikasi' || item.name === 'Bookmark')) return null;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-full transition-colors font-medium',
                        location.pathname === item.href
                          ? 'bg-paper-100 text-ink-950'
                          : 'text-ink-600 hover:bg-paper-50 hover:text-ink-950',
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      {item.name === 'Notifikasi' && unreadCount > 0 && (
                        <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-bold text-white bg-signal-red-600 rounded-full">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Categories */}
            <div>
              <h3 className="px-3 mb-2 text-xs font-bold tracking-wider text-ink-400 uppercase">
                Kategori
              </h3>
              {isLoading ? (
                <div className="space-y-2 px-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-6 animate-shimmer rounded-sm bg-paper-100" />
                  ))}
                </div>
              ) : categories && categories.length > 0 ? (
                <ul className="space-y-0.5">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/categories/${cat.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-full transition-colors text-sm',
                          location.pathname === `/categories/${cat.slug}`
                            ? 'bg-paper-100 text-ink-950 font-medium'
                            : 'text-ink-600 hover:bg-paper-50',
                        )}
                      >
                        <Hash className="w-4 h-4 opacity-70" />
                        <span className="flex-1 truncate">{cat.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2 text-sm text-ink-400">Belum ada kategori</p>
              )}
            </div>

            {/* Admin & Moderator Section */}
            {isAuthenticated && user && (user.role === 'admin' || user.role === 'moderator') && (
              <div>
                <h3 className="px-3 mt-6 mb-2 text-xs font-bold tracking-wider text-ink-400 uppercase">
                  Manajemen
                </h3>
                <ul className="space-y-0.5">
                  {user.role === 'admin' && (
                    <>
                      <li>
                        <Link
                          to="/admin/categories"
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-full transition-colors text-sm',
                            location.pathname === '/admin/categories'
                              ? 'bg-paper-100 text-ink-950 font-medium'
                              : 'text-ink-600 hover:bg-paper-50',
                          )}
                        >
                          <span className="flex-1 truncate">Kategori (Admin)</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/users"
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-full transition-colors text-sm',
                            location.pathname === '/admin/users'
                              ? 'bg-paper-100 text-ink-950 font-medium'
                              : 'text-ink-600 hover:bg-paper-50',
                          )}
                        >
                          <span className="flex-1 truncate">Pengguna (Admin)</span>
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      to="/mod/reports"
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-full transition-colors text-sm',
                        location.pathname === '/mod/reports'
                          ? 'bg-paper-100 text-ink-950 font-medium'
                          : 'text-ink-600 hover:bg-paper-50',
                      )}
                    >
                      <span className="flex-1 truncate">Laporan (Moderator)</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </nav>

          {/* Theme Toggle & User settings */}
          <div className="p-3 mt-auto">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-full transition-colors text-ink-600 hover:bg-paper-50 hover:text-ink-950 font-medium"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
