/**
 * @fileoverview Module `src/form/checkbox/checkbox.ext.module.ts` providing checkbox ext module definitions and implementation.
 * @zh 模块文件 `src/form/checkbox/checkbox.ext.module.ts`，提供复选框ext模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormModule } from '../components/form.module';
import { CheckboxField } from './checkbox.component';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';

/**
 * Angular module `CheckBoxFieldModule` declaring and exporting check box field module components, directives, pipes, and providers.
 * @zh Angular 模块 `CheckBoxFieldModule`，声明并导出检查盒子容器字段模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [CheckboxField],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatCheckboxModule,
    FormModule.forChild()
  ]
})
export class CheckBoxFieldModule {
  /**
   * Property `entryComponents` (`(typeof CheckboxField)[]`) storing entry components (default: `[CheckboxField]`).
   * @zh 属性 `entryComponents`（类型：`(typeof CheckboxField)[]`），用于存储或配置条目组件列表（默认值：`[CheckboxField]`）。
   */
  entryComponents = [CheckboxField];
  /**
   * Creates an instance of `CheckBoxFieldModule` and initializes its dependencies and internal state.
   * @zh 创建 `CheckBoxFieldModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
