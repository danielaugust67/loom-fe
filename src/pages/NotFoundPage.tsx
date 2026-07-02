import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <p className="text-6xl font-mono text-ink-400 mb-4">404</p>
      <h1 className="text-xl font-medium text-ink-950 mb-2">Halaman tidak ditemukan</h1>
      <p className="text-sm text-ink-600 mb-6 max-w-sm">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <Link to="/">
        <Button variant="primary" size="sm">
          <Home className="h-4 w-4" />
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
}
