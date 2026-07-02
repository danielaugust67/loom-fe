import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useLogin } from '@/features/auth/useAuth';
import { mapErrorMessage } from '@/lib/apiClient';

const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: login, isPending, error } = useLogin();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: () => {
        navigate(from, { replace: true });
      },
    });
  };

  return (
    <PageShell>
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-signal-red-600 bg-signal-red-50 rounded-sm">
                  {mapErrorMessage(error)}
                </div>
              )}
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
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
              type="submit"
              form="login-form"
              className="w-full"
              loading={isPending}
            >
              Log in
            </Button>
            <p className="text-sm text-ink-600 text-center">
              Belum punya akun?{' '}
              <Link to="/register" className="text-accent-600 font-medium hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageShell>
  );
}
