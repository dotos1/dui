/**
 * @fileoverview Module `src/ui/context-menu/context-menu.module.ts` providing context menu module definitions and implementation.
 * @zh 模块文件 `src/ui/context-menu/context-menu.module.ts`，提供上下文菜单模块相关的定义与实现。
 */



import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

import { Dui } from '@dotos1/dui/core';
import { TranslateModule } from '@dotos1/dui/translator';
import { IconModule } from '@dotos1/dui/common/icon';
import { ExtensionsModule } from '@dotos1/dui/common/dynamic';

import { ContextMenuItemComponent } from './context-menu-item.component';
import { OutsideEventDirective } from './context-menu-outside-event.directive';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuService } from './context-menu.service';
/**
 * Angular module `ContextMenuModule` declaring and exporting context menu module components, directives, pipes, and providers.
 * @zh Angular 模块 `ContextMenuModule`，声明并导出上下文菜单模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    IconModule,
    ExtensionsModule
  ],
  declarations: [
    ContextMenuComponent,
    ContextMenuItemComponent,
    OutsideEventDirective
  ],
  exports: [
    OutsideEventDirective,
    ContextMenuComponent,
    ContextMenuItemComponent,
  ],
  providers: [
    ContextMenuService
  ]
})
export class ContextMenuModule {
  /**
   * Property `entryComponents` (`(typeof ContextMenuComponent)[]`) storing entry components (default: `[ContextMenuComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof ContextMenuComponent)[]`），用于存储或配置条目组件列表（默认值：`[ContextMenuComponent]`）。
   */
  entryComponents = [ContextMenuComponent];
  /**
   * Creates an instance of `ContextMenuModule` and initializes its dependencies and internal state.
   * @zh 创建 `ContextMenuModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}


