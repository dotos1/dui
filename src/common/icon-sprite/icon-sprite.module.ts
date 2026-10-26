/**
 * @fileoverview Module `src/common/icon-sprite/icon-sprite.module.ts` providing icon sprite module definitions and implementation.
 * @zh 模块文件 `src/common/icon-sprite/icon-sprite.module.ts`，提供图标sprite模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IconSpriteComponent } from './icon-sprite.component';
import { IconSpriteDirective } from './icon-sprite.directive';
import { IconSpriteConfig } from './icon-sprite-config.model';


/**
 * Angular module `IconSpriteModule` declaring and exporting icon sprite module components, directives, pipes, and providers.
 * @zh Angular 模块 `IconSpriteModule`，声明并导出图标Sprite模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule],
  declarations: [
    IconSpriteComponent,
    IconSpriteDirective
  ],
  exports: [IconSpriteComponent]
})
export class IconSpriteModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`IconSpriteConfig`) / 配置参数（`IconSpriteConfig`）
   * @returns Result of type `ModuleWithProviders<IconSpriteModule>` / 类型为 `ModuleWithProviders<IconSpriteModule>` 的返回值
   */
  static forRoot(config: IconSpriteConfig): ModuleWithProviders<IconSpriteModule> {
    return {
      ngModule: IconSpriteModule,
      providers: [
        { provide: IconSpriteConfig, useValue: config }
      ]
    };
  }
}
