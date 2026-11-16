/**
 * @fileoverview Module `src/container/panel/panel.module.ts` providing panel module definitions and implementation.
 * @zh 模块文件 `src/container/panel/panel.module.ts`，提供面板模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { A11yModule } from '@angular/cdk/a11y';
import { PanelComponent } from './panel.component';
import { SplitComponent } from './split.component';
import { DuiLayoutToggleDirective, DuiLayoutCloseDirective, DuiLayoutOpenDirective } from './layout.directives';
import { Dui } from '@dotos1/dui/core';
/**
 * Angular module `PanelModule` declaring and exporting panel module components, directives, pipes, and providers.
 * @zh Angular 模块 `PanelModule`，声明并导出面板模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    ScrollingModule,
    A11yModule
  ],
  exports: [
    SplitComponent,
    PanelComponent,
    DuiLayoutToggleDirective,
    DuiLayoutCloseDirective,
    DuiLayoutOpenDirective
  ],
  declarations: [
    SplitComponent,
    PanelComponent,
    DuiLayoutToggleDirective,
    DuiLayoutCloseDirective,
    DuiLayoutOpenDirective
  ]
})
export class PanelModule {
  /**
   * Property `dynamicComponents` (`(typeof PanelComponent | typeof SplitComponent)[]`) storing dynamic components (default: `[SplitComponent,PanelComponent]`).
   * @zh 属性 `dynamicComponents`（类型：`(typeof PanelComponent | typeof SplitComponent)[]`），用于存储或配置动态组件列表（默认值：`[SplitComponent,PanelComponent]`）。
   */
  dynamicComponents = [SplitComponent,PanelComponent];
  /**
   * Creates an instance of `PanelModule` and initializes its dependencies and internal state.
   * @zh 创建 `PanelModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.dynamicComponents);
  }
}
