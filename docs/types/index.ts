// Shared TypeScript types for FE integration across modules.

export type Rfc3339String = string;

export interface Pagination {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface Meta {
  request_id: string;
  timestamp: Rfc3339String;
  pagination?: Pagination;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
}

// Some services occasionally return a plain error shape from the framework.
// Use this when you need to represent possible error unions.
export type HttpError<T = null> = APIResponse<T> | { error: string };

// Utility cursor alias (both numeric and UUID cursors are represented as string in URLs)
export type Cursor = string;

