export type SortOrder = "asc" | "desc";

export interface BaseQueryOptions<TSortField> {
  page: number;
  limit: number;
  search?: string;
  sortBy: TSortField;
  sortOrder: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
