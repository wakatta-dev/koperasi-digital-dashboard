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
  pagination?: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Meta;
  errors: Record<string, string[]> | null;
}

export type HttpError<T = null> = ApiResponse<T> | { error: string };

export type Cursor = string;

// Local utility maps
export type StringMap = Record<string, string>;
export type NumberMap = Record<string, number>;
