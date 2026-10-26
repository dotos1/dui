/**
 * @fileoverview Module `src/form/slide-toggle/slide-toggle.ext.module.ts` providing slide toggle ext module definitions and implementation.
 * @zh 模块文件 `src/form/slide-toggle/slide-toggle.ext.module.ts`，提供slide开关ext模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SliderToggleField } from './slide-toggle.component';
import { FormModule } from '../components/form.module';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';

/**
 * Angular module `SliderToggleFieldModule` declaring and exporting slider toggle field module components, directives, pipes, and providers.
 * @zh Angular 模块 `SliderToggleFieldModule`，声明并导出滑块开关字段模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [SliderToggleField],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    TranslateModule,
    FormModule.forChild(),
    MatSlideToggleModule,
  ],
})
export class SliderToggleFieldModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[SliderToggleField]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[SliderToggleField]`）。
   */
  entryComponents = [SliderToggleField];
  /**
   * Creates an instance of `SliderToggleFieldModule` and initializes its dependencies and internal state.
   * @zh 创建 `SliderToggleFieldModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
