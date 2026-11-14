/**
 * @fileoverview Module `src/form/trigger/trigger.module.ts` providing trigger module definitions and implementation.
 * @zh 模块文件 `src/form/trigger/trigger.module.ts`，提供触发模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormModule } from '../components/form.module';

import { TriggerField } from './trigger.field';
import { Dui, StyleModule } from '@dotos/dui/core';
import { TreeModule } from '@dotos/dui/tree';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { TranslateModule } from '@dotos/dui/translator';

/**
 * Angular module `TriggerModule` declaring and exporting trigger module components, directives, pipes, and providers.
 * @zh Angular 模块 `TriggerModule`，声明并导出触发模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
     
    OverlayModule,
    MatTooltipModule,
    ReactiveFormsModule,//.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    PortalModule,
    StyleModule,
    MatIconModule,
    A11yModule,
    TreeModule,
    TranslateModule,
    FlexLayoutModule,
    FormModule.forChild(),
  ],
  exports: [
    MatInputModule,
     
    TriggerField,
  ],
  declarations: [
    TriggerField,
  ],
  providers: [],
})
export class TriggerModule {
  /**
   * Property `entryComponents` (`(typeof TriggerField)[]`) storing entry components (default: `[TriggerField]`).
   * @zh 属性 `entryComponents`（类型：`(typeof TriggerField)[]`），用于存储或配置条目组件列表（默认值：`[TriggerField]`）。
   */
  entryComponents = [TriggerField];
  /**
   * Creates an instance of `TriggerModule` and initializes its dependencies and internal state.
   * @zh 创建 `TriggerModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
