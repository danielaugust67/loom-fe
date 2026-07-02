import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ThreadCardSkeleton } from '@/components/ui/Skeleton';

/* Layout */
import AppShell from './AppShell';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

/* Lazy-loaded pages */
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const CategoryThreadPage = lazy(() => import('@/pages/CategoryThreadPage'));
const ThreadDetailPage = lazy(() => import('@/pages/ThreadDetailPage'));
const ThreadNewPage = lazy(() => import('@/pages/ThreadNewPage'));
const ThreadEditPage = lazy(() => import('@/pages/ThreadEditPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));
const BookmarksPage = lazy(() => import('@/pages/BookmarksPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const ModReportsPage = lazy(() => import('@/pages/ModReportsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/AdminCategoriesPage'));
const AdminUsersPage = lazy(() => import('@/pages/AdminUsersPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/* Fallback loading */
function PageLoader() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ThreadCardSkeleton key={i} />
      ))}
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CategoriesPage />
          </Suspense>
        ),
      },
      {
        path: 'categories/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CategoryThreadPage />
          </Suspense>
        ),
      },
      {
        path: 'thread/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ThreadDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: 'u/:username',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserProfilePage />
          </Suspense>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'thread/new',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ThreadNewPage />
              </Suspense>
            ),
          },
          {
            path: 'thread/:slug/edit',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ThreadEditPage />
              </Suspense>
            ),
          },
          {
            path: 'settings/profile',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfileSettingsPage />
              </Suspense>
            ),
          },
          {
            path: 'settings/bookmarks',
            element: (
              <Suspense fallback={<PageLoader />}>
                <BookmarksPage />
              </Suspense>
            ),
          },
          {
            path: 'notifications',
            element: (
              <Suspense fallback={<PageLoader />}>
                <NotificationsPage />
              </Suspense>
            ),
          },
          {
            element: <ProtectedRoute allowedRoles={['admin', 'moderator']} />,
            children: [
              {
                path: 'mod/reports',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <ModReportsPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [
              {
                path: 'admin/categories',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <AdminCategoriesPage />
                  </Suspense>
                ),
              },
              {
                path: 'admin/users',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <AdminUsersPage />
                  </Suspense>
                ),
              },
            ],
          },
        ]
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
