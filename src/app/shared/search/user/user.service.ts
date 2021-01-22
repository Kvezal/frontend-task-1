import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserApiService } from '../../../api/user/user-api.service';
import {
  Query,
  Search,
  SearchResponse,
  User
} from '../../../interfaces';


@Injectable()
export class UserService implements Search<User> {

  constructor(private _userApiService: UserApiService) {
  }

  public search(query: Query): Observable<SearchResponse<User>> {
    return this._userApiService.search(query);
  }
}
