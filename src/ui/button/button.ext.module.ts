/**
 * @fileoverview Module `src/ui/button/button.ext.module.ts` providing button ext module definitions and implementation.
 * @zh 模块文件 `src/ui/button/button.ext.module.ts`，提供按钮ext模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule, MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuModule } from '@dotos/dui/ui/menu';
import { IconModule } from '@dotos/dui/common/icon';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';

import { ButtonComponent } from './button.component';
/**
 * Angular module `ButtonModule` declaring and exporting button module components, directives, pipes, and providers.
 * @zh Angular 模块 `ButtonModule`，声明并导出按钮模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MenuModule,
    IconModule,
    TranslateModule,
    MatDividerModule,
    RouterModule
  ],
  exports: [
    ButtonComponent,
    MenuModule
  ],
  declarations: [
    ButtonComponent
  ]
})
export class ButtonModule {
  /**
   * Property `entryComponents` (`(typeof MatDivider | typeof ButtonComponent)[]`) storing entry components (default: `[ MatDivider, ButtonComponent,]`).
   * @zh 属性 `entryComponents`（类型：`(typeof MatDivider | typeof ButtonComponent)[]`），用于存储或配置条目组件列表（默认值：`[ MatDivider, ButtonComponent,]`）。
   */
  entryComponents = [
     MatDivider,
    ButtonComponent,];
  /**
   * Creates an instance of `ButtonModule` and initializes its dependencies and internal state.
   * @zh 创建 `ButtonModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
