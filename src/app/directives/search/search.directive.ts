import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject
} from 'rxjs';
import {
  filter,
  mergeAll,
  mergeMap,
  scan,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';

import { SearchService } from '../../shared/search/search.service';
import { SearchContext } from './inderface';
import { SearchResponse } from '../../interfaces';


@Directive({
  selector: '[search]',
})
export class SearchDirective implements OnInit, OnDestroy {
  @Input(`searchFor`) for = ``;

  private _from = 0;
  private _size = 20;

  private _destroySubject = new Subject<void>();

  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainerRef: ViewContainerRef,
    private _searchService: SearchService,
  ) {
  }

  public ngOnInit(): void {
    this._viewContainerRef.createEmbeddedView(this._templateRef, this.getContext());
  }

  public getContext<T>(): SearchContext<T> {
    const searchBehaviorSubject = new BehaviorSubject<string>(``);
    const nextPageSubject = new Subject<void>();
    const totalReachedBehaviorSubject = new BehaviorSubject<boolean>(false);
    const results$: Observable<T[]> = nextPageSubject.asObservable()
      .pipe(
        withLatestFrom(() => searchBehaviorSubject.asObservable()),
        mergeAll(),
        scan((lastQuery: string, currentQuery: string) => currentQuery || lastQuery, ``),
        mergeMap((query: string) => this._searchService
          .getEntityService<T>(this.for)
          .search({
            from: this._from,
            size: this._size,
            query,
          })
        ),
        filter((): boolean => totalReachedBehaviorSubject.getValue()),
        scan((entityList: T[], searchResponse: SearchResponse<T>) => {
          const lastIndex = this._from + this._size;
          const isLimited = searchResponse.total <= lastIndex;
          totalReachedBehaviorSubject.next(!isLimited);
          if (this._from === 0) {
            return searchResponse.hits;
          }
          return [...entityList, ...searchResponse.hits];
        }, []),
        takeUntil(this._destroySubject)
      );

    return {
      $implicit: (query: string) => {
        this._from = 0;
        totalReachedBehaviorSubject.next(true);
        searchBehaviorSubject.next(query);
        nextPageSubject.next();
      },
      results$,
      totalReached$: totalReachedBehaviorSubject.asObservable(),
      nextPage: (): void => {
        this._from += this._size;
        nextPageSubject.next();
      },
    };
  }

  ngOnDestroy(): void {
    this._destroySubject.next();
  }
}
