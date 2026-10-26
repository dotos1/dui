/**
 * @fileoverview Module `src/form/checkboxgroup/checkboxgroup.module.ts` providing checkboxgroup module definitions and implementation.
 * @zh 模块文件 `src/form/checkboxgroup/checkboxgroup.module.ts`，提供checkboxgroup模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CheckboxGroupField } from './checkboxgroup.component';
import { MatCheckGroup } from './checkboxgroup.exp';
import { SelectPipeModule } from '../base/select.module';
import { FormModule } from '../components/form.module';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';

/**
 * Angular module `CheckboxGroupModule` declaring and exporting checkbox group module components, directives, pipes, and providers.
 * @zh Angular 模块 `CheckboxGroupModule`，声明并导出复选框分组模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    CheckboxGroupField,
    MatCheckGroup
  ],
  imports: [
    CommonModule,
    FormModule.forChild(),
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SelectPipeModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  exports: [CheckboxGroupField, MatCheckGroup],
})
export class CheckboxGroupModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[CheckboxGroupField]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[CheckboxGroupField]`）。
   */
  entryComponents = [CheckboxGroupField];
  /**
   * Creates an instance of `CheckboxGroupModule` and initializes its dependencies and internal state.
   * @zh 创建 `CheckboxGroupModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
