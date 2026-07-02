/**
 * TypeScript types mapped from backend DTOs.
 * Reference: be/internal/dto/*.go, be/internal/domain/models.go
 */

/* ── Base / Shared ── */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

/* ── Auth ── */

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  role: 'user' | 'moderator' | 'admin';
  is_banned: boolean;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

/* ── Category ── */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thread_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

/* ── Thread ── */

export interface Thread {
  id: string;
  title: string;
  slug: string;
  content: string;
  view_count: number;
  is_locked: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category: Category;
  user: User;
  tags: string[];
  comment_count?: number;
  /** Client-side only: current user's vote */
  user_vote?: number;
  score?: number;
  /** Client-side only: current user's bookmark status */
  is_bookmarked?: boolean;
}

export interface ThreadRequest {
  category_id: string;
  title: string;
  content: string;
  tags?: string[];
  is_locked?: boolean;
}

export interface ThreadFilters {
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
}

/* ── Comment ── */

export interface Comment {
  id: string;
  thread_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: User;
  replies: Comment[];
  /** Client-side only: current user's vote */
  user_vote?: number;
  score?: number;
}

export interface CommentRequest {
  parent_id?: string;
  content: string;
}

/* ── Vote ── */

export interface VoteRequest {
  votable_id: string;
  votable_type: 'thread' | 'comment';
  vote_type: 1 | -1 | 0;
}

export interface VoteResponse {
  message: string;
}

/* ── Bookmark ── */

export interface Bookmark {
  thread_id: string;
  thread?: Thread;
  created_at: string;
}

export interface BookmarkResponse {
  thread_id: string;
  thread?: Thread;
  created_at: string;
}

/* ── Report ── */

export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

export interface Report {
  id: string;
  reporter_id: string;
  reportable_id: string;
  reportable_type: 'thread' | 'comment';
  reason: string;
  status: ReportStatus;
  created_at: string;
  /** Populated when available */
  reporter?: User;
  reportable?: Thread | Comment;
}

export interface ReportRequest {
  reportable_id: string;
  reportable_type: 'thread' | 'comment';
  reason: string;
}

export interface ReportFilters {
  status?: ReportStatus;
  page?: number;
  limit?: number;
}

/* ── Notification ── */

export type NotificationType = 'reply' | 'mention' | 'vote';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationPayload {
  thread_id?: string;
  thread_slug?: string;
  thread_title?: string;
  comment_id?: string;
  username?: string;
  vote_type?: number;
}

/* ── Tag ── */

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

/* ── Upload ── */

export interface UploadResponse {
  url: string;
  file_id: string;
}
