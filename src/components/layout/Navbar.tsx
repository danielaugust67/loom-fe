import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, LogIn, Plus } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => !!s.accessToken && !!s.user);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line-200 bg-paper-0">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo + hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 text-ink-600 hover:bg-paper-100 rounded-sm transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src="/icon.png" alt="Loom" className="h-6 w-auto" />
          </Link>
        </div>

        {/* Center: Search (desktop only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = formData.get('q') as string;
              if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
            className="w-full"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                name="q"
                type="search"
                placeholder="Cari thread..."
                className="w-full rounded-sm border border-line-200 bg-paper-50 py-1.5 pl-9 pr-3 text-sm text-ink-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-950/30 focus:border-ink-950"
              />
            </div>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {/* Mobile search icon */}
          <button
            onClick={() => navigate('/search')}
            className="p-2 text-ink-600 hover:bg-paper-100 rounded-sm transition-colors md:hidden"
            aria-label="Cari"
          >
            <Search className="h-5 w-5" />
          </button>

          {isAuthenticated ? (
            <>
              {/* Create thread */}
              <button
                onClick={() => navigate('/thread/new')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-ink-950 text-paper-0 hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Thread Baru
              </button>

              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 text-ink-600 hover:bg-paper-100 rounded-sm transition-colors"
                aria-label="Notifikasi"
              >
                <Bell className="h-5 w-5" />
                {/* Unread badge — placeholder, will be populated by real data */}
              </button>

              {/* User avatar/menu */}
              <button
                onClick={() => navigate('/settings/profile')}
                className={cn(
                  'p-1 hover:bg-paper-100 rounded-full sm:rounded-sm transition-colors flex items-center gap-2',
                )}
                aria-label="Profil"
              >
                <Avatar src={user?.avatar_url} alt={user?.username || 'User'} size="sm" />
                {user?.username && (
                  <span className="hidden sm:inline text-sm font-medium text-ink-950 pr-2">
                    {user.username}
                  </span>
                )}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-ink-600 hover:bg-paper-100 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
