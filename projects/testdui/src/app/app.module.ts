/**
 * @fileoverview Module `projects/testdui/src/app/app.module.ts` providing app module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/app.module.ts`，提供app模块相关的定义与实现。
 */

import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ToastrModule } from '@dotos/dui/common/toastr';
import { ServiceLocator } from '@dotos/dui/core/services';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { HttpLoaderModule } from '@dotos/dui/net';
import { DotosConfigModule, DotosConfigService, ThemeService, dotosConfig } from '@dotos/dui/theme';
import { TranslateModule, TranslateService, TranslationService } from '@dotos/dui/translator';
import { CommandPaletteModule } from '@dotos/dui/ux/command-palette';

import { ThemeSettingsModule } from './theme-settings/theme-settings.module';

import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
/**
 * Angular module `AppModule` declaring and exporting app module components, directives, pipes, and providers.
 * @zh Angular 模块 `AppModule`，声明并导出App模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      AppRoutingModule,
      BrowserModule,
      MatButtonModule,
      MatIconModule,
      MatMenuModule,
      MatSidenavModule,
      MatToolbarModule,
      MatTooltipModule,
      DotosConfigModule.forRoot(dotosConfig),
      HttpLoaderModule.forRoot(),
      ToastrModule.forRoot(),
      TranslateModule.forRoot(),
      // CommandPaletteService is providedIn:'root'; its own constructor deps
      // (CommandPaletteShortcutsService etc.) are resolved via the root
      // injector regardless of which lazy module first requests the service,
      // so CommandPaletteModule's providers must be registered here.
      CommandPaletteModule,
      ThemeSettingsModule,
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
  /**
   * Creates an instance of `AppModule` and initializes its dependencies and internal state.
   * @zh 创建 `AppModule` 实例，并初始化其依赖项与内部状态。
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param translation - Injected or initial translation (`TranslationService`) / 注入或传入的翻译文本（`TranslationService`）
   */
  constructor(
    private injector: Injector,
    public readonly translation: TranslationService) {
    ServiceLocator.injector = injector;
    translation.addTranslationFolder('public', 'i18n');
  }
}