import { Outlet, useLocation } from 'react-router-dom';
import { Navbar, Sidebar, MobileNav } from '@/components/layout';
import ToastContainer from '@/components/ui/Toast';

export default function AppShell() {
  useLocation(); // Keep this to trigger re-renders on route change if needed, but remove the unused variable assignment.

  return (
    <div className="min-h-screen bg-paper-0">
      <Navbar />
      <div className="flex justify-center max-w-5xl mx-auto px-0 md:px-4">
        <Sidebar />
        <div className="flex-1 min-w-0 max-w-2xl border-x border-line-200 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </div>
      </div>
      <MobileNav />
      <ToastContainer />
    </div>
  );
}
