/**
 * @fileoverview Module `src/container/gridster/gridster.module.ts` providing gridster module definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridster.module.ts`，提供网格拖拽布局模块相关的定义与实现。
 */

import {CommonModule} from '@angular/common';
import {ComponentFactoryResolver, NgModule} from '@angular/core';
import { Dui } from '@dotos/dui/core';
import {GridsterComponent} from './gridster.component';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterPreviewComponent} from './gridsterPreview.component';

/**
 * Angular module `GridsterModule` declaring and exporting gridster module components, directives, pipes, and providers.
 * @zh Angular 模块 `GridsterModule`，声明并导出网格拖拽布局模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    GridsterComponent,
    GridsterItemComponent,
    GridsterPreviewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [GridsterComponent, GridsterItemComponent],
  providers: [],
  bootstrap: []
})
export class GridsterModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [GridsterComponent, GridsterItemComponent];
  /**
   * Creates an instance of `GridsterModule` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
