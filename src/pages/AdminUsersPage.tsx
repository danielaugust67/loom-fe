import PageShell from '@/components/layout/PageShell';
import { useUsers, useToggleBan } from '@/features/users/useUsers';
import EmptyState from '@/components/ui/EmptyState';
import { Users, Ban, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function AdminUsersPage() {
  const { data: users, isLoading, isError, refetch } = useUsers();
  const { mutate: toggleBan, isPending: toggling } = useToggleBan();

  const handleToggleBan = (userId: string, isBanned: boolean) => {
    if (confirm(`Yakin ingin ${isBanned ? 'membuka blokir' : 'memblokir'} pengguna ini?`)) {
      toggleBan(userId);
    }
  };

  return (
    <PageShell>
      <div className="flex items-center gap-2 mb-6 px-4 md:px-6 pt-4">
        <Users className="w-5 h-5 text-ink-950" />
        <h1 className="text-xl font-semibold text-ink-950 tracking-tight">Manajemen Pengguna</h1>
      </div>

      {isLoading ? (
        <div className="px-4 md:px-6 space-y-3">
          <p className="text-sm text-ink-600">Memuat pengguna...</p>
        </div>
      ) : isError ? (
        <EmptyState
          title="Gagal memuat pengguna"
          description="Anda mungkin tidak memiliki akses ke halaman ini."
          actionLabel="Coba lagi"
          onAction={() => refetch()}
        />
      ) : !users || users.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10 text-ink-300" />}
          title="Tidak ada pengguna"
        />
      ) : (
        <div className="px-4 md:px-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map(user => (
              <Card key={user.id} className={user.is_banned ? 'opacity-75' : ''}>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <Avatar src={user.avatar_url} alt={user.username} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-950 truncate">{user.username}</p>
                      <p className="text-xs text-ink-600 truncate">{user.email}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge variant="default" className="capitalize text-[10px] whitespace-nowrap">
                          {user.role}
                        </Badge>
                        {user.is_banned && (
                          <Badge variant="red" className="text-[10px] whitespace-nowrap border-transparent">
                            Banned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {user.role !== 'admin' && (
                    <div className="pt-3 mt-1 border-t border-line-100 flex justify-end">
                      <Button
                        size="sm"
                        variant={user.is_banned ? 'secondary' : 'destructive'}
                        onClick={() => handleToggleBan(user.id, user.is_banned)}
                        disabled={toggling}
                        className="w-full text-xs"
                      >
                        {user.is_banned ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Unban
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5 mr-1" />
                            Ban
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
