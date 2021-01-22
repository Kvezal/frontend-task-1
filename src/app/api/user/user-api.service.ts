import { Injectable } from '@angular/core';
import {
  Observable,
  of
} from 'rxjs';

import {
  Query,
  SearchResponse,
  User
} from '../../interfaces';


@Injectable()
export class UserApiService {
  constructor() { }


  public search(query: Query): Observable<SearchResponse<User>> {
    return of({
      total: 50,
      hits: [
        {
          id: 1,
          email: `test@gmail.com`,
        }
      ],
    });
  }
}
