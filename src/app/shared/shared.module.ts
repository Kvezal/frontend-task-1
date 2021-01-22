import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchModule } from './search/search.module';
import { UserService } from './search/user/user.service';


@NgModule({
  imports: [
    CommonModule,
    SearchModule.forRoot([
      {name: `User`, provider: UserService },
    ]),
  ],
})
export class SharedModule { }
