/** @format */

export interface Pagination {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface Meta {
  pagination?: Pagination;
  request_id: string;
  timestamp: string; // ISO 8601
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: Meta;
  errors: unknown;
}

export type StringMap = Record<string, string>;
export type NumberMap = Record<string, number>;
