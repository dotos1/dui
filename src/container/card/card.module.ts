/**
 * @fileoverview Module `src/container/card/card.module.ts` providing card module definitions and implementation.
 * @zh 模块文件 `src/container/card/card.module.ts`，提供卡片模块相关的定义与实现。
 */


import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from 'ngx-flexible-layout';

import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { DuiCardComponent } from './card.component';

/**
 * Angular module `CardModule` declaring and exporting card module components, directives, pipes, and providers.
 * @zh Angular 模块 `CardModule`，声明并导出卡片模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    FlexLayoutModule,
    MatListModule,
    TranslateModule,
    FlexLayoutModule,
    MatPaginatorModule,
    MatSelectModule,
  ],
  exports: [
    DuiCardComponent
  ],
  declarations: [
    DuiCardComponent
  ]
})
export class CardModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[DuiCardComponent]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[DuiCardComponent]`）。
   */
  entryComponents = [DuiCardComponent];
  /**
   * Creates an instance of `CardModule` and initializes its dependencies and internal state.
   * @zh 创建 `CardModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
