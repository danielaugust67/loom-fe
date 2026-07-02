import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, AtSign, ArrowBigUp } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { useNotifications, useMarkNotificationRead } from '@/features/notifications/useNotifications';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { ListItemSkeleton } from '@/components/ui/Skeleton';
import { formatDate, cn } from '@/lib/utils';
import type { Notification } from '@/types/api';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useNotifications(page);
  const { mutate: markRead } = useMarkNotificationRead();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markRead(notification.id);
    }

    const payload = notification.payload as any;
    if (payload.thread_slug) {
      navigate(`/thread/${payload.thread_slug}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reply': return <MessageSquare className="w-5 h-5 text-accent-600" />;
      case 'mention': return <AtSign className="w-5 h-5 text-accent-600" />;
      case 'vote': return <ArrowBigUp className="w-5 h-5 text-accent-600" />;
      default: return <Bell className="w-5 h-5 text-ink-600" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const payload = notification.payload as any;
    const username = payload.username || 'Seseorang';
    
    switch (notification.type) {
      case 'reply':
        return <span><span className="font-medium text-ink-950">{username}</span> membalas diskusi Anda.</span>;
      case 'mention':
        return <span><span className="font-medium text-ink-950">{username}</span> menyebut Anda dalam sebuah komentar.</span>;
      case 'vote':
        return <span><span className="font-medium text-ink-950">{username}</span> memberikan upvote pada diskusi/komentar Anda.</span>;
      default:
        return <span>Ada notifikasi baru untuk Anda.</span>;
    }
  };

  return (
    <PageShell>
      <div className="flex items-center gap-2 mb-6 px-4 md:px-6 pt-4">
        <Bell className="w-5 h-5 text-ink-950" />
        <h1 className="text-xl font-semibold text-ink-950 tracking-tight">Notifikasi</h1>
      </div>

      <div className="bg-paper-0 border border-line-200 rounded-md overflow-hidden mx-4 md:mx-6">
        {isLoading ? (
          <div className="divide-y divide-line-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4">
                <ListItemSkeleton />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8">
            <EmptyState
              title="Gagal memuat notifikasi"
              description="Terjadi kesalahan saat mengambil data dari server."
              actionLabel="Coba lagi"
              onAction={() => refetch()}
            />
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Bell className="h-10 w-10 text-ink-300" />}
              title="Belum ada notifikasi"
              description="Anda akan mendapat pemberitahuan jika ada interaksi baru."
            />
          </div>
        ) : (
          <div className="divide-y divide-line-200">
            {data.data.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "flex items-start gap-4 p-4 cursor-pointer hover:bg-paper-50 transition-colors",
                  !notification.is_read ? "bg-accent-50/30" : "opacity-75"
                )}
              >
                <div className="shrink-0 pt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink-950 mb-0.5">
                    {getNotificationText(notification)}
                  </p>
                  <time className="text-xs font-mono text-ink-600">
                    {formatDate(notification.created_at)}
                  </time>
                </div>
                {!notification.is_read && (
                  <div className="shrink-0 w-2 h-2 rounded-full bg-accent-600 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {data?.meta && data.meta.total_pages > 1 && (
        <div className="mt-8 pb-8">
          <Pagination
            currentPage={data.meta.page}
            totalPages={data.meta.total_pages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </PageShell>
  );
}
