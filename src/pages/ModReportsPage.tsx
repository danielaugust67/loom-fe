import { useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import { useReports, useUpdateReportStatus } from '@/features/reports/useReports';
import EmptyState from '@/components/ui/EmptyState';
import { ShieldAlert } from 'lucide-react';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function ModReportsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useReports({ page, limit: 15 });
  const { mutate: updateStatus, isPending: updating } = useUpdateReportStatus();

  const handleUpdateStatus = (reportId: string, status: 'reviewed' | 'dismissed') => {
    if (confirm(`Yakin ingin menandai laporan ini sebagai ${status === 'reviewed' ? 'Selesai' : 'Ditolak'}?`)) {
      updateStatus({ reportId, status });
    }
  };

  return (
    <PageShell>
      <div className="flex items-center gap-2 mb-6 px-4 md:px-6 pt-4">
        <ShieldAlert className="w-5 h-5 text-signal-red-600" />
        <h1 className="text-xl font-semibold text-ink-950 tracking-tight">Laporan Moderasi</h1>
      </div>

      {isLoading ? (
        <div className="px-4 md:px-6 space-y-3">
          <p className="text-sm text-ink-600">Memuat laporan...</p>
        </div>
      ) : isError ? (
        <EmptyState
          title="Gagal memuat laporan"
          description="Anda mungkin tidak memiliki akses ke halaman ini."
          actionLabel="Coba lagi"
          onAction={() => refetch()}
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          icon={<ShieldAlert className="h-10 w-10 text-ink-300" />}
          title="Tidak ada laporan"
          description="Semuanya aman terkendali."
        />
      ) : (
        <div className="px-4 md:px-6 space-y-4">
          {data.data.map(report => (
            <Card key={report.id} className="border-l-4 border-l-signal-red-600">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="border-transparent whitespace-nowrap">
                      {report.reportable_type}
                    </Badge>
                    <span className="text-sm font-medium text-ink-950">
                      Dilaporkan oleh: {report.reporter?.username || report.reporter_id}
                    </span>
                  </div>
                  <time className="text-xs font-mono text-ink-600">
                    {formatDate(report.created_at)}
                  </time>
                </div>
                <p className="text-sm text-ink-950 font-medium mb-1">
                  Alasan: <span className="font-normal">{report.reason}</span>
                </p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-line-100">
                  <div className="text-xs text-ink-600">
                    Status: <span className="font-medium capitalize">{report.status}</span>
                  </div>
                  {report.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(report.id, 'dismissed')} disabled={updating}>
                        Tolak
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateStatus(report.id, 'reviewed')} disabled={updating}>
                        Tandai Selesai
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {data.meta && data.meta.total_pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={data.meta.page}
                totalPages={data.meta.total_pages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
