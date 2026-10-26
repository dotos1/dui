/**
 * @fileoverview Module `src/container/accordion/expansion-module.ts` providing expansion module definitions and implementation.
 * @zh 模块文件 `src/container/accordion/expansion-module.ts`，提供展开面板模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { A11yModule } from '@angular/cdk/a11y';
import { Accordion } from './accordion';
import { FormBuilder } from '@dotos/dui/core/form';


import {
  ExpansionPanel,
  ExpansionPanelActionRow,
  ExpansionPanelBase
} from './expansion-panel';
import {
  ExpansionPanelDescription,
  ExpansionPanelHeader,
  ExpansionPanelTitle,
} from './expansion-panel-header';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';


/**
 * Angular module `ExpansionModule` declaring and exporting expansion module components, directives, pipes, and providers.
 * @zh Angular 模块 `ExpansionModule`，声明并导出展开面板模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    A11yModule,
     CdkAccordionModule,
     TranslateModule,
     MatIconModule,
     MatDividerModule
  ],
  exports: [
    Accordion,
    ExpansionPanel,
    ExpansionPanelActionRow,
    ExpansionPanelHeader,
    ExpansionPanelTitle,
    ExpansionPanelDescription
  ],
  declarations: [
    ExpansionPanelBase,
    Accordion,
    ExpansionPanel,
    ExpansionPanelActionRow,
    ExpansionPanelHeader,
    ExpansionPanelTitle,
    ExpansionPanelDescription
  ],
  providers: [FormBuilder]
})
export class ExpansionModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[ Accordion, ExpansionPanel,]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[ Accordion, ExpansionPanel,]`）。
   */
  entryComponents = [
    Accordion,
    ExpansionPanel,];
  /**
   * Creates an instance of `ExpansionModule` and initializes its dependencies and internal state.
   * @zh 创建 `ExpansionModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
