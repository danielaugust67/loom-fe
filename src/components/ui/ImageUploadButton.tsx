import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/components/ui/Toast';

interface ImageUploadButtonProps {
  onUploadSuccess: (markdown: string) => void;
  className?: string;
}

export default function ImageUploadButton({ onUploadSuccess, className }: ImageUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiClient.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = res.data?.data?.url;
      if (url) {
        onUploadSuccess(`\n![image](${url})\n`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah gambar');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="text-ink-600 hover:text-ink-950 px-2 py-1 h-auto"
        title="Unggah Gambar"
      >
        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
      </Button>
    </div>
  );
}
