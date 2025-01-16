import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateModule, TranslateService, TranslationService } from '@dotos/dui/translator';
import { ButtonModule } from '@dotos/dui/ui/button';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      ButtonModule,
      TranslateModule.forRoot(),
    ],
    providers: [
      TranslationService,
      TranslateService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { 
}