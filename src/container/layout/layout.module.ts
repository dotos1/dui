/**
 * @fileoverview Module `src/container/layout/layout.module.ts` providing layout module definitions and implementation.
 * @zh 模块文件 `src/container/layout/layout.module.ts`，提供布局模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';import { CommonModule } from '@angular/common'
import { LayoutComponent } from './component/layout.component'
import { SplitAreaDirective } from './directive/split-area.directive'
import { DuiPanelComponent } from './component/panel.component'
import { Dui } from '@dotos1/dui/core'

/**
 * Angular module `DuiLayoutModule` declaring and exporting dui layout module components, directives, pipes, and providers.
 * @zh Angular 模块 `DuiLayoutModule`，声明并导出DUI布局模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule],
  declarations: [LayoutComponent, DuiPanelComponent,SplitAreaDirective],
  exports: [LayoutComponent,DuiPanelComponent,SplitAreaDirective],
})
export class DuiLayoutModule {
  /**
   * Property `dynamicComponents` (`(typeof LayoutComponent | typeof DuiPanelComponent)[]`) storing dynamic components (default: `[LayoutComponent,DuiPanelComponent]`).
   * @zh 属性 `dynamicComponents`（类型：`(typeof LayoutComponent | typeof DuiPanelComponent)[]`），用于存储或配置动态组件列表（默认值：`[LayoutComponent,DuiPanelComponent]`）。
   */
  dynamicComponents = [LayoutComponent,DuiPanelComponent];
  /**
   * Creates an instance of `DuiLayoutModule` and initializes its dependencies and internal state.
   * @zh 创建 `DuiLayoutModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.dynamicComponents);
  }
}
