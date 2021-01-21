## Тех задание на дом

Для данного задания нужно использовать возможности Angular.

Все задания взаимосвязаны, однако их спокойно можно выполнить по отдельности. НЕ ОБЯЗАТЕЛЬНО делать все задания. Можно выбрать какое-то наиболее интересное, остальные обсудим.

Можно задавать сколько угодно вопросов. Разумеется за мной остается выбор: отвечать на него или нет.

По завершению работы над заданием создается pull request в master.

1. Написать механизм для поиска.

Сервисы для поиска реализуют следующий интерфейс:

```typescript
// Параметры запроса поиска
export interface Query {
    from: number; // Индекс с которого будут возвращаться результаты
    size: number; // Максимальное количество результатов
    query: string; // Строка поиска
}

// Ответ на поисковой запрос
export interface SearchResponse<T> {
    total: number; // Общее количество сущностей удовлетворяющих запросу
    hits: T[]; // Массив результатов поиска
}

// Интерфейс сервиса для поиска
export interface Search<T> {
    search(query: Query): Observable<SearchResponse<T>>;
}
```

Сервисы для поиска должны регистрироваться для сущностей, к которым они относятся.

Например, UserService конфигурируется для сущности User.

```typescript
export interface User {
    id: number;
    email: string;
}
```

Должна быть возможность получить сервис по названию сущности.

2. Написать структурную директиву для поиска со следующим контекcтом:

```typescript
export interface SearchContext<T> {
    implicit$(query: string): void; // Функция, которая запускает поиск
    results$: Observable<T[]>; // Результаты поиска
    totalReached$: Observable<boolean>; // Для данного запроса больше нет результатов
    nextPage(): void; // Подгружает следующие значения с предыдущим значением строки поиска
}
```

Применяться она должна следующим образом:

```angular2html
<ng-container *search="let search; for 'User'; results$ as results$; totalReached$ as totalReached$">
    <input (input)="search($any($event.target).value)" type="text"/>

    <p>{{ totalReached$ | async }}</p>

    <div *ngFor="let result of results$ | async">
        {{ result.email }}
    </div>
</ng-container>
```

Параметры:

- for (string). Название сущности. Можно использовать логику из предыдущего задания, чтобы по названию сущности сделать запрос с нужным сервисом, либо игнорировать этот параметр.

3. Написать структурную директиву для бесконечного скролла

Использовать [IntersectionObserver](https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API)

Контекст:

```typescript
export interface ScrollContext<T> {
    implicit$: T;
}
```

Применяться она должна следующим образом:

```angular2html
<div *scroll="let result of results$ | async" (scrolled)="nextPage()">
    {{ result.email }}
</div>
```

Или в случае с поиском:

```angular2html
<ng-container *search="let search; for 'User'; results$ as results$; totalReached$ as totalReached$; nextPage as nextPage">
    <input (input)="search($any($event.target).value)" type="text"/>

    <p>{{ totalReached$ | async }}</p>

    <div *scroll="let result of results$ | async; disconnected: totalReached | async" (scrolled)="nextPage()">
        {{ result.email }}
    </div>
</ng-container>
```

Параметры:
- of: Массив, итератор и т.п. (можно посмотреть как сделано в ngFor) из которого берутся данные.
- disconnected (boolean): Это означает, что intersection observer не должен реагировать на событие скролла.

Рассмотрим сценарий работы с поиском:

- Пользователь вбивает значение в строку поиска
- Отображается столько результатов, сколько помещается в контейнер с поиском
- Если total превышает количество показанных пользователю результатов, то totalReached$ будет возвращать false
- При скролле до конца области запускается функция nextPage(), которая отправляет запрос с тем же значением поиска, но обновляет значение from, чтобы поиск осуществлялся начиная со следующего за последним элементом объекта
- Новые элементы добавляются на экран
- Когда количество полученных значений превышает или равно total, то totalReached$ возвращает true и IntersectionObserver перестанет наблюдать за событием скролла
- Если запустить поиск с новым значением строки поиска, то обнуляются результаты и totalReached$ возвращает false
- Мы снова говорим IntersectionObserver слушать событие скролла и сценарий повторяется



