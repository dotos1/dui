/**
 * @fileoverview Module `src/ux/editor/editor.module.ts` providing editor module definitions and implementation.
 * @zh 模块文件 `src/ux/editor/editor.module.ts`，提供编辑器模块相关的定义与实现。
 */

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

/**
 * Angular dependency-injection token `EDITOR_CONFIG_TOKEN` for providing editor config token.
 * @zh Angular 依赖注入令牌 `EDITOR_CONFIG_TOKEN`，用于提供与注入编辑器配置令牌。
 */
export const EDITOR_CONFIG_TOKEN = new InjectionToken<EditorConfig>('EditorConfig');

/**
 * Constant/variable `defaultConfig` defining default config in `src/ux/editor`.
 * @zh 常量/变量 `defaultConfig`，定义 `src/ux/editor` 中的默认配置。
 */
const defaultConfig: EditorConfig = {
  locals: defaultLocals,
};

/**
 * Angular module `EditorModule` declaring and exporting editor module components, directives, pipes, and providers.
 * @zh Angular 模块 `EditorModule`，声明并导出编辑器模块相关的组件、指令、管道与服务提供者。
 */
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
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`EditorConfig`) / 配置参数（`EditorConfig`）
   * @returns Result of type `ModuleWithProviders<EditorModule>` / 类型为 `ModuleWithProviders<EditorModule>` 的返回值
   */
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

  /**
   * Executes `forChild` to handle for child.
   * @zh 执行 `forChild`，用于用于子级。
   * @param config - config parameter (`EditorConfig`) / 配置参数（`EditorConfig`）
   * @returns Result of type `ModuleWithProviders<EditorModule>` / 类型为 `ModuleWithProviders<EditorModule>` 的返回值
   */
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
