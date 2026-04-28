export type PaginatedMeta = Readonly<{
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}>;

export type PaginatedResponse<T> = Readonly<{
  data: readonly T[];
  meta: PaginatedMeta;
}>;
