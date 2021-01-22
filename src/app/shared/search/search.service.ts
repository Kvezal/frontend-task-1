import {
  Injectable,
  Injector,
  Type,
} from '@angular/core';

import { Search } from '../../interfaces';


@Injectable()
export class SearchService {
  static entityMap: Map<string, Search<any>>;

  constructor(
    private _injector: Injector
  ) {
  }

  public getEntityService<T>(key: string): Search<T> {
    const token: Search<T> | undefined = SearchService.entityMap.get(key);
    if (!token) {
      throw Error(`${key} entity name doesn't exist`);
    }
    return this._injector.get(token as unknown as Type<Search<T>>);
  }
}
