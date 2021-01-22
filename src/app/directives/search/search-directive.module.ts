import { NgModule } from '@angular/core';

import { SearchDirective } from './search.directive';


@NgModule({
  declarations: [SearchDirective],
  exports: [SearchDirective],
})
export class SearchDirectiveModule {}
