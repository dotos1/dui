import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditorConfig } from './types';
import { defaults as defaultLocals } from './Locals';

import { EditorComponent } from './editor.component';
import { EditorServiceConfig } from './editor-config.service';
import { EditorService, provideMyServiceOptions } from './editor.service';
import { EditorMenuModule } from './modules/menu/menu.module';

import { MenuComponent } from './modules/menu/menu.component';
import { ImageViewComponent } from './components/image-view/image-view.component';
import { FloatingMenuComponent } from './modules/menu/floating-menu/floating-menu.component';

export const EDITOR_CONFIG_TOKEN = new InjectionToken<EditorConfig>('EditorConfig');

const defaultConfig: EditorConfig = {
  locals: defaultLocals,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditorMenuModule,
  ],
  providers: [],
  declarations: [
    EditorComponent,
    ImageViewComponent,
  ],
  exports: [
    EditorComponent,
    MenuComponent,
    FloatingMenuComponent,
  ],
})
export class EditorModule {
  static forRoot(config: EditorConfig = defaultConfig): ModuleWithProviders<EditorModule> {
    return {
      ngModule: EditorModule,
      providers: [
        {
          provide: EDITOR_CONFIG_TOKEN,
          useValue: config,
        },
        {
          provide: EditorServiceConfig,
          useFactory: provideMyServiceOptions,
          deps: [EDITOR_CONFIG_TOKEN],
        },
      ],
    };
  }

  static forChild(config: EditorConfig = defaultConfig): ModuleWithProviders<EditorModule> {
    return {
      ngModule: EditorModule,
      providers: [
        {
          provide: EDITOR_CONFIG_TOKEN,
          useValue: config,
        },
        {
          provide: EditorServiceConfig,
          useFactory: provideMyServiceOptions,
          deps: [EDITOR_CONFIG_TOKEN],
        },
        EditorService,
      ],
    };
  }
}
