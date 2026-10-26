/**
 * @fileoverview Module `src/common/collapsible/collapsible.module.ts` providing collapsible module definitions and implementation.
 * @zh 模块文件 `src/common/collapsible/collapsible.module.ts`，提供可折叠面板模块相关的定义与实现。
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CollapseDirective } from './collapse.directive';
import { CollapsibleComponent } from './collapsible.component';
import { TranslateModule } from '@dotos/dui/translator';
/**
 * Angular module `CollapsibleModule` declaring and exporting collapsible module components, directives, pipes, and providers.
 * @zh Angular 模块 `CollapsibleModule`，声明并导出可折叠面板模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [MatIconModule, MatListModule,TranslateModule],
  declarations: [CollapsibleComponent, CollapseDirective],
  exports: [CollapsibleComponent, CollapseDirective]
})
export class CollapsibleModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @returns Result of type `ModuleWithProviders<CollapsibleModule>` / 类型为 `ModuleWithProviders<CollapsibleModule>` 的返回值
   */
  static forRoot(): ModuleWithProviders<CollapsibleModule> {
    return {
      ngModule: CollapsibleModule,
      providers: []
    };
  }
}
