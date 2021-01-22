export interface SearchResponse<T> {
  total: number;
  hits: T[];
}
