import { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { useCreateReport } from '@/features/reports/useReports';
import { useToast } from '@/components/ui/Toast';

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  reportableId: string;
  reportableType: 'thread' | 'comment';
}

export default function ReportModal({ open, onClose, reportableId, reportableType }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const { mutate: createReport, isPending } = useCreateReport();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    createReport(
      {
        reportable_id: reportableId,
        reportable_type: reportableType,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Laporan berhasil dikirim. Terima kasih!');
          setReason('');
          onClose();
        },
        onError: () => {
          toast.error('Gagal mengirim laporan. Silakan coba lagi.');
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} title={`Laporkan ${reportableType === 'thread' ? 'Diskusi' : 'Komentar'}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="Alasan Pelaporan"
          placeholder="Jelaskan mengapa konten ini melanggar aturan..."
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" loading={isPending} disabled={!reason.trim()}>
            Kirim Laporan
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
