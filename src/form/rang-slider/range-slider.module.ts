/**
 * @fileoverview Module `src/form/rang-slider/range-slider.module.ts` providing range slider module definitions and implementation.
 * @zh 模块文件 `src/form/rang-slider/range-slider.module.ts`，提供范围滑块模块相关的定义与实现。
 */

import {CommonModule} from '@angular/common';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { FormModule } from '../components';

import { RangeSliderFieldComponent } from './range-slider.field';
import { MatSliderModule } from '@angular/material/slider';
import { FlexLayoutModule } from 'ngx-flexible-layout';

/**
 * Angular module `RangeSliderModule` declaring and exporting range slider module components, directives, pipes, and providers.
 * @zh Angular 模块 `RangeSliderModule`，声明并导出范围滑块模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [RangeSliderFieldComponent],
  exports: [RangeSliderFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
     FlexLayoutModule,
    FormModule.forChild(),
    TranslateModule
  ]
})
export class RangeSliderModule {
  /**
   * Property `entryComponents` (`(typeof RangeSliderFieldComponent)[]`) storing entry components (default: `[RangeSliderFieldComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof RangeSliderFieldComponent)[]`），用于存储或配置条目组件列表（默认值：`[RangeSliderFieldComponent]`）。
   */
  entryComponents = [RangeSliderFieldComponent];
  /**
   * Creates an instance of `RangeSliderModule` and initializes its dependencies and internal state.
   * @zh 创建 `RangeSliderModule` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
