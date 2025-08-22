import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from '@dotos/dui/common/toastr';
import { ServiceLocator } from '@dotos/dui/core/services';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { HttpLoaderModule } from '@dotos/dui/net';
import { DotosConfigModule, DotosConfigService, ThemeService, dotosConfig } from '@dotos/dui/theme';
import { TranslateModule, TranslateService, TranslationService } from '@dotos/dui/translator';
import { ButtonModule } from '@dotos/dui/ui/button';


import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      AppRoutingModule,
      ButtonModule,
      BrowserAnimationsModule,
      BrowserModule,
      DotosConfigModule.forRoot(dotosConfig),
      HttpLoaderModule.forRoot(),
      ToastrModule.forRoot(),
      TranslateModule.forRoot(),
    ],
    providers: [
      {
        provide: ThemeService,
        useFactory: (): ThemeService => {
          return ThemeService.getInstance();
        },
      },
      {
        provide: 'LOCAL_STORAGE_SERVICE_CONFIG',
        useValue: {
          prefix: 'dotos',
          storageType: 'localStorage'
        }
      },
      LocalStorageService,
      TranslationService,
      TranslateService,
      DotosConfigService,
      { provide: 'apiBase', useValue: '/api' },
      provideHttpClient(
        withInterceptorsFromDi(),
      ),
      {
        provide: MAT_TOOLTIP_SCROLL_STRATEGY,
        deps: [Overlay],
        useFactory(overlay: Overlay): () => ScrollStrategy {
          return () => overlay.scrollStrategies.close();
        }
      },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    private injector: Injector,
    public readonly translation: TranslationService) {
    ServiceLocator.injector = injector;

  }

}