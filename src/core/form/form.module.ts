/**
 * @fileoverview Module `src/core/form/form.module.ts` providing form module definitions and implementation.
 * @zh 模块文件 `src/core/form/form.module.ts`，提供表单模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessage } from './template/form.validation-message';
import { FormTemplateType } from './template/field-template.type';
import { DuiBase } from '@dotos1/dui/base';
import { TranslateModule } from '@dotos1/dui/translator';

/**
 * Angular module `AbstractFormModule` declaring and exporting abstract form module components, directives, pipes, and providers.
 * @zh Angular 模块 `AbstractFormModule`，声明并导出Abstract表单模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    imports: [ TranslateModule,CommonModule],
    declarations: [
        FormTemplateType,
        ValidationMessage
    ],
    exports: [
        FormTemplateType,
        ValidationMessage
    ]
})
export class AbstractFormModule {
  /**
   * Property `entryComponents` (`(typeof FormTemplateType | typeof ValidationMessage)[]`) storing entry components (default: `[FormTemplateType,ValidationMessage]`).
   * @zh 属性 `entryComponents`（类型：`(typeof FormTemplateType | typeof ValidationMessage)[]`），用于存储或配置条目组件列表（默认值：`[FormTemplateType,ValidationMessage]`）。
   */
  entryComponents = [FormTemplateType,ValidationMessage];
  /**
   * Creates an instance of `AbstractFormModule` and initializes its dependencies and internal state.
   * @zh 创建 `AbstractFormModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    DuiBase.registerComponentFactory(this.entryComponents);
  }
 }
