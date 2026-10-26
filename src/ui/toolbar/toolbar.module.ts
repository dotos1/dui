/**
 * @fileoverview Module `src/ui/toolbar/toolbar.module.ts` providing toolbar module definitions and implementation.
 * @zh 模块文件 `src/ui/toolbar/toolbar.module.ts`，提供工具栏模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Dui } from '@dotos/dui/core';
import { DuiToolbarComponent, Spacer, Fill, TextItem, Separator } from './toolbar.component';

/**
 * Angular module `DuiToolbarModule` declaring and exporting dui toolbar module components, directives, pipes, and providers.
 * @zh Angular 模块 `DuiToolbarModule`，声明并导出DUI工具栏模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatDividerModule,
    MatToolbarModule
  ],
  declarations: [
    Separator,
    Spacer,
    Fill,
    TextItem,
    DuiToolbarComponent,
  ],
  exports: [
    Separator,
    Spacer,
    Fill,
    TextItem,
    DuiToolbarComponent,
  ]
})
export class DuiToolbarModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
      DuiToolbarComponent,
    Separator,
    Spacer,
    Fill,
    TextItem];
  /**
   * Creates an instance of `DuiToolbarModule` and initializes its dependencies and internal state.
   * @zh 创建 `DuiToolbarModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
