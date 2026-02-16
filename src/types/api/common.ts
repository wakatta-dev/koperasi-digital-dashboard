/** @format */

// Shared API primitives (copied from docs/types) so docs is purely documentation.

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
  status_code?: number;
  pagination?: Pagination;
}

export interface ApiErrorPayload {
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
  error?: ApiErrorPayload | null;
}

// Alias to match docs naming
export type APIResponse<T> = ApiResponse<T>;

export type HttpError<T = null> = ApiResponse<T> | { error: string };

export type Cursor = string;

// Local utility maps
export type StringMap = Record<string, string>;
export type NumberMap = Record<string, number>;
