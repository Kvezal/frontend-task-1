import { Observable } from 'rxjs';

import { Query } from './query.interface';
import { SearchResponse } from './search-response.interface';


export interface Search<T> {
  search(query: Query): Observable<SearchResponse<T>>;
}
