import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { SearchService } from './search.service';


export interface ISearchEntity<T> {
  name: string;
  provider: T;
}

@NgModule({
  providers: [],
})
export class SearchModule {
  static forRoot(entities: ISearchEntity<any>[]): ModuleWithProviders<SearchModule> {
    const {providers, entityMap} = entities.reduce(
      (acc: any, entity: ISearchEntity<any>) => {
        acc.providers.push(entity.provider);
        acc.entityMap.set(entity.name, entity.provider);
        return acc;
      },
      {
        providers: [],
        entityMap: new Map([]),
      }
    );

    SearchService.entityMap = entityMap;

    return {
      ngModule: SearchModule,
      providers: [
        ...providers,
        SearchService,
      ],
    };
  }
}
