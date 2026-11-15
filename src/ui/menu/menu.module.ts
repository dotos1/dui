/**
 * @fileoverview Module `src/ui/menu/menu.module.ts` providing menu module definitions and implementation.
 * @zh 模块文件 `src/ui/menu/menu.module.ts`，提供菜单模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule, MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { IconModule } from '@dotos1/dui/common/icon';
import { Dui } from '@dotos1/dui/core';
import { TranslateModule } from '@dotos1/dui/translator';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ExtensionsModule } from '@dotos1/dui/common/dynamic';

import { MenuBarComponent } from './menu-bar.component';
import { MenuItemComponent } from './menu-item.component';
import { MenuDirective } from './menu-item.directive';

/**
 * Angular module `MenuModule` declaring and exporting menu module components, directives, pipes, and providers.
 * @zh Angular 模块 `MenuModule`，声明并导出菜单模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatListModule,
    MatCheckboxModule,
    IconModule,
    ExtensionsModule,
    FlexLayoutModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    MenuBarComponent,
    MenuItemComponent,
    MenuDirective
  ],
  declarations: [
    MenuBarComponent,
    MenuItemComponent,
    MenuDirective
  ]
})
export class MenuModule {
  /**
   * Property `entryComponents` (`(typeof MatDivider | typeof MenuBarComponent | typeof MenuItemComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof MatDivider | typeof MenuBarComponent | typeof MenuItemComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
     MatDivider,
     MenuBarComponent,
    MenuItemComponent,];
  /**
   * Creates an instance of `MenuModule` and initializes its dependencies and internal state.
   * @zh 创建 `MenuModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
