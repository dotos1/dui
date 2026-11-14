/**
 * @fileoverview Module `src/form/radiogroup/radiogroup.module.ts` providing radiogroup module definitions and implementation.
 * @zh 模块文件 `src/form/radiogroup/radiogroup.module.ts`，提供radiogroup模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '../components/form.module';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { RadioGroupField } from './radiogroup.component';
import { SelectPipeModule } from '../base/select.module';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
/**
 * Angular module `RadioGroupModule` declaring and exporting radio group module components, directives, pipes, and providers.
 * @zh Angular 模块 `RadioGroupModule`，声明并导出单选框分组模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    RadioGroupField,
  ],
  imports: [
    CommonModule,
    FormModule.forChild(),
    TranslateModule,
    SelectPipeModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatTooltipModule
  ],
  exports: [RadioGroupField]
})
export class RadioGroupModule {
  /**
   * Property `entryComponents` (`(typeof RadioGroupField)[]`) storing entry components (default: `[RadioGroupField]`).
   * @zh 属性 `entryComponents`（类型：`(typeof RadioGroupField)[]`），用于存储或配置条目组件列表（默认值：`[RadioGroupField]`）。
   */
  entryComponents = [RadioGroupField];
  /**
   * Creates an instance of `RadioGroupModule` and initializes its dependencies and internal state.
   * @zh 创建 `RadioGroupModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
