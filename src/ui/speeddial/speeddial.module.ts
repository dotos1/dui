/**
 * @fileoverview Module `src/ui/speeddial/speeddial.module.ts` providing speeddial module definitions and implementation.
 * @zh 模块文件 `src/ui/speeddial/speeddial.module.ts`，提供speeddial模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { IconModule } from '@dotos/dui/common/icon';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { MenuModule } from '@dotos/dui/ui/menu';

import { FabButtonComponent } from './fab.button';
import { ExtSpeedDialComponent } from './speeddial.component';
import { SpeedDialActionsComponent, SpeedDialComponent } from './speed-dial';
import { SpeedDialTriggerComponent } from './speed-dial-trigger';



/**
 * Angular module `SpeedDialModule` declaring and exporting speed dial module components, directives, pipes, and providers.
 * @zh Angular 模块 `SpeedDialModule`，声明并导出速度Dial模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MenuModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    TranslateModule,
    MatTooltipModule,
    IconModule
  ],
  declarations: [
    SpeedDialComponent,
    FabButtonComponent,
    ExtSpeedDialComponent,
    SpeedDialActionsComponent,
    SpeedDialTriggerComponent,
  ],
  exports: [
    SpeedDialActionsComponent,
    SpeedDialComponent,
    SpeedDialTriggerComponent,
    ExtSpeedDialComponent,
    FabButtonComponent
  ],
})
export class SpeedDialModule {
  /**
   * Property `entryComponents` (`(typeof SpeedDialActionsComponent | typeof SpeedDialComponent | typeof SpeedDialTriggerComponent | typeof ExtSpeedDialComponent | typeof FabButtonComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof SpeedDialActionsComponent | typeof SpeedDialComponent | typeof SpeedDialTriggerComponent | typeof ExtSpeedDialComponent | typeof FabButtonComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
    SpeedDialActionsComponent,
    SpeedDialComponent,
    SpeedDialTriggerComponent,
    ExtSpeedDialComponent,
    FabButtonComponent
  ];
  /**
   * Creates an instance of `SpeedDialModule` and initializes its dependencies and internal state.
   * @zh 创建 `SpeedDialModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
 }
