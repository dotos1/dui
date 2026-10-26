/**
 * @fileoverview Module `src/container/tabpanel/tabs-module.ts` providing tabs module definitions and implementation.
 * @zh 模块文件 `src/container/tabpanel/tabs-module.ts`，提供选项卡组模块相关的定义与实现。
 */



import {ObserversModule} from '@angular/cdk/observers';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {ComponentFactoryResolver, NgModule} from '@angular/core';
import {MatCommonModule, MatRippleModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {TabPanel} from './tabpanel.component';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';

/**
 * Angular module `DuiTabsModule` declaring and exporting dui tabs module components, directives, pipes, and providers.
 * @zh Angular 模块 `DuiTabsModule`，声明并导出DUI选项卡组模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatCommonModule,
    PortalModule,
    TranslateModule,
    MatRippleModule,
    ObserversModule,
    FlexLayoutModule,
    ScrollingModule,
    MatTabsModule
  ],
  exports: [
    TabPanel
  ],
  declarations: [
    TabPanel
  ]
})
export class DuiTabsModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[TabPanel]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[TabPanel]`）。
   */
  entryComponents = [TabPanel];
  /**
   * Creates an instance of `DuiTabsModule` and initializes its dependencies and internal state.
   * @zh 创建 `DuiTabsModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
