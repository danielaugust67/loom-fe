import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRegister } from '@/features/auth/useAuth';
import { mapErrorMessage } from '@/lib/apiClient';

const registerSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').max(30, 'Username maksimal 30 karakter'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirm_password: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Password tidak cocok",
  path: ["confirm_password"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: registerUser, isPending, isSuccess, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <PageShell>
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isSuccess ? 'Cek Email Anda' : 'Buat akun baru'}</CardTitle>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto w-12 h-12 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-ink-600">
                  Kami telah mengirimkan tautan verifikasi ke email Anda. Silakan klik tautan tersebut untuk mengaktifkan akun Anda sebelum masuk.
                </p>
                <p className="text-xs text-ink-400">
                  (Bila Anda menjalankan peladen secara lokal, silakan cek terminal/konsol backend Anda untuk melihat tautannya).
                </p>
              </div>
            ) : (
              <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-signal-red-600 bg-signal-red-50 rounded-sm">
                    {mapErrorMessage(error)}
                  </div>
                )}
                <Input
                  label="Username"
                  type="text"
                  placeholder="johndoe"
                  error={errors.username?.message}
                  {...register('username')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  label="Konfirmasi Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.confirm_password?.message}
                  {...register('confirm_password')}
                />
              </form>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            {isSuccess ? (
              <Button onClick={() => navigate('/login')} className="w-full">
                Ke Halaman Masuk
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  form="register-form"
                  className="w-full"
                  loading={isPending}
                >
                  Sign up
                </Button>
                <p className="text-sm text-ink-600 text-center">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="text-accent-600 font-medium hover:underline">
                    Masuk
                  </Link>
                </p>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </PageShell>
  );
}
