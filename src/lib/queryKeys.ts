/**
 * Centralized TanStack Query key factory.
 * All query keys are defined here so invalidation is consistent.
 */

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },

  threads: {
    all: (filters?: ThreadFilters) => filters ? ['threads', 'list', filters] as const : ['threads', 'list'] as const,
    detail: (slug: string) => ['threads', 'detail', slug] as const,
  },

  comments: {
    byThread: (threadId: string, page?: number) =>
      page ? ['comments', 'thread', threadId, page] as const : ['comments', 'thread', threadId] as const,
  },

  categories: {
    all: ['categories', 'all'] as const,
  },

  users: {
    profile: (username: string) => ['users', 'profile', username] as const,
    list: ['users', 'list'] as const,
  },

  notifications: {
    all: (page?: number) => ['notifications', 'list', page] as const,
  },

  reports: {
    all: (filters?: ReportFilters) => ['reports', 'list', filters] as const,
  },

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
