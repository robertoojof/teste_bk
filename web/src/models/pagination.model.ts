export type SortDirection = 'asc' | 'desc';

export type SearchParams = {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
  filter?: string;
};

export type PaginationMeta = {
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};
