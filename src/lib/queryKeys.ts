/**
 * Centralized TanStack Query key factory.
 * All query keys are defined here so invalidation is consistent.
 */

export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },

  // Threads
  threads: {
    all: (filters?: ThreadFilters) => filters ? ['threads', 'list', filters] as const : ['threads', 'list'] as const,
    detail: (slug: string) => ['threads', 'detail', slug] as const,
  },

  // Comments
  comments: {
    byThread: (threadId: string, page?: number) =>
      page ? ['comments', 'thread', threadId, page] as const : ['comments', 'thread', threadId] as const,
  },

  // Categories
  categories: {
    all: ['categories', 'all'] as const,
  },

  // Users
  users: {
    profile: (username: string) => ['users', 'profile', username] as const,
    list: ['users', 'list'] as const,
  },

  // Notifications
  notifications: {
    all: (page?: number) => ['notifications', 'list', page] as const,
  },

  // Reports
  reports: {
    all: (filters?: ReportFilters) => ['reports', 'list', filters] as const,
  },

  // Bookmarks
  bookmarks: {
    all: (page?: number) => ['bookmarks', 'list', page] as const,
  },
} as const;

/* Local types for filter params */
interface ThreadFilters {
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
}

interface ReportFilters {
  status?: string;
  page?: number;
  limit?: number;
}
