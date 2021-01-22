import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ApiModule } from './api/api.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SearchDirectiveModule } from './directives/search/search-directive.module';
import { SharedModule } from './shared';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiModule,
    SharedModule,
    SearchDirectiveModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
