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
import { CommandPaletteModule } from '@dotos/dui/ux/command-palette';


import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      AppRoutingModule,
      BrowserAnimationsModule,
      BrowserModule,
      DotosConfigModule.forRoot(dotosConfig),
      HttpLoaderModule.forRoot(),
      ToastrModule.forRoot(),
      TranslateModule.forRoot(),
      // CommandPaletteService is providedIn:'root'; its own constructor deps
      // (CommandPaletteShortcutsService etc.) are resolved via the root
      // injector regardless of which lazy module first requests the service,
      // so CommandPaletteModule's providers must be registered here.
      CommandPaletteModule,
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
    translation.addTranslationFolder('public', 'i18n');
  }
}