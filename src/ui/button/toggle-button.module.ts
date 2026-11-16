/**
 * @fileoverview Module `src/ui/button/toggle-button.module.ts` providing toggle button module definitions and implementation.
 * @zh 模块文件 `src/ui/button/toggle-button.module.ts`，提供开关按钮模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { Dui } from '@dotos1/dui/core';
import { IconModule } from '@dotos1/dui/common/icon';
import { TranslateModule } from '@dotos1/dui/translator';
import { ToggleButtonComponent } from './toggle-button.component';
/**
 * Angular module `ToggleButtonModule` declaring and exporting toggle button module components, directives, pipes, and providers.
 * @zh Angular 模块 `ToggleButtonModule`，声明并导出开关按钮模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatListModule,
    IconModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    ToggleButtonComponent,
  ],
  declarations: [
    ToggleButtonComponent
  ]
})
export class ToggleButtonModule {
  /**
   * Property `entryComponents` (`(typeof ToggleButtonComponent)[]`) storing entry components (default: `[ToggleButtonComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof ToggleButtonComponent)[]`），用于存储或配置条目组件列表（默认值：`[ToggleButtonComponent]`）。
   */
  entryComponents = [ToggleButtonComponent];
  /**
   * Creates an instance of `ToggleButtonModule` and initializes its dependencies and internal state.
   * @zh 创建 `ToggleButtonModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
