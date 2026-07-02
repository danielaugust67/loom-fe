import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { User as  LogOut } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { useUpdateProfile } from '@/features/users/useUsers';
import { useLogout, useCurrentUser } from '@/features/auth/useAuth';
import { mapErrorMessage } from '@/lib/apiClient';
import Avatar from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';

const profileSchema = z.object({
  bio: z.string().max(250, 'Bio maksimal 250 karakter').optional(),
  avatar_url: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const toast = useToast();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema)
  });

  const currentAvatarUrl = watch('avatar_url');

  useEffect(() => {
    if (user) {
      reset({
        bio: user.bio || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileForm) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success('Profil berhasil diperbarui!');
      }
    });
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      navigate('/', { replace: true });
      logout();
    }
  };

  if (isLoadingUser) {
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto px-4 md:px-0">
          <p className="text-sm text-ink-600">Memuat profil...</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto px-4 md:px-6 mb-8 mt-4 space-y-8">
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-2xl font-bold text-ink-950 tracking-tight">Pengaturan Profil</h1>
        </div>

        <Card>
          <CardHeader>
          </CardHeader>
          <CardContent>
            <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-signal-red-600 bg-signal-red-50 rounded-sm">
                  {mapErrorMessage(error)}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={user?.username}
                  disabled
                  helperText="Username tidak dapat diubah."
                />
                <Input
                  label="Email"
                  value={user?.email}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-sm font-semibold text-ink-950">Foto Profil</label>
                <div className="flex items-center gap-5 mt-2">
                  <div className="relative group rounded-full overflow-hidden border border-line-200">
                    <Avatar src={currentAvatarUrl || undefined} alt="Avatar Preview" size="xl" />
                    <div
                      className="absolute inset-0 bg-ink-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <span className="text-xs font-medium text-white">Ubah</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) {
                          toast.error('Ukuran file maksimal 2MB');
                          return;
                        }
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await (await import('@/lib/apiClient')).default.post('/api/v1/upload', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                          });
                          const url = res.data?.data?.url;
                          if (url) {
                            setValue('avatar_url', url, { shouldValidate: true });
                          }
                        } catch (err: any) {
                          toast.error(err.response?.data?.message || 'Gagal mengunggah foto');
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()}>
                      Pilih Foto Baru
                    </Button>
                    <p className="text-xs text-ink-500">Format: JPG, PNG, atau WebP (Maks. 2MB)</p>
                  </div>
                </div>
                {errors.avatar_url && <p className="text-xs text-signal-red-600 mt-1">{errors.avatar_url.message}</p>}
                <input type="hidden" {...register('avatar_url')} />
              </div>

              <Textarea
                label="Bio"
                placeholder="Ceritakan sedikit tentang diri Anda..."
                rows={4}
                error={errors.bio?.message}
                {...register('bio')}
              />
            </form>
          </CardContent>
          <CardFooter className="justify-end border-t border-line-200 pt-5 pb-5">
            <Button type="submit" form="profile-form" loading={isPending}>
              Simpan Perubahan
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-signal-red-200 overflow-hidden">
          <CardHeader className="bg-signal-red-50/50 border-b border-signal-red-100">
            <CardTitle className="text-signal-red-600 flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Sesi Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink-600 mb-4">
              Keluar dari akun Anda pada perangkat ini.
            </p>
            <Button
              variant="destructive"
              onClick={handleLogout}
              loading={isLoggingOut}
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
