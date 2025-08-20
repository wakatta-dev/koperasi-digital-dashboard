export interface Pagination {
  next_cursor: string | null;
  prev_cursor: string | null;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface ApiMeta {
  pagination: Pagination | null;
  request_id: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: ApiMeta;
  errors: Record<string, string[]> | null;
}
