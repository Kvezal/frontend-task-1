import { Observable } from 'rxjs';


export interface SearchContext<T> {
  results$: Observable<T[]>;
  totalReached$: Observable<boolean>;
  $implicit(query: string): void;
  nextPage(): void;
}
