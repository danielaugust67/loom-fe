import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'info';
}

interface UIState {
  /** Mobile sidebar drawer */
  sidebarOpen: boolean;
  /** Active toast messages */
  toasts: Toast[];

  /* Actions */
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToast: (message: string, variant?: Toast['variant']) => void;
  removeToast: (id: string) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toasts: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  addToast: (message, variant = 'info') => {
    const id = `toast-${++toastCounter}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
