/**
 * @fileoverview Module `src/form/range/range.module.ts` providing range module definitions and implementation.
 * @zh 模块文件 `src/form/range/range.module.ts`，提供范围模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from 'ngx-flexible-layout';

import { Dui } from '@dotos/dui/core';
import { FormModule } from '@dotos/dui/form';
import { TranslateModule } from '@dotos/dui/translator';

import { DateRangeFieldComponent } from './daterange.field';
import { NumberRangeFieldComponent } from './numberrange.field';

/**
 * Angular module `RangeFieldModule` declaring and exporting range field module components, directives, pipes, and providers.
 * @zh Angular 模块 `RangeFieldModule`，声明并导出范围字段模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    DateRangeFieldComponent,
    NumberRangeFieldComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSliderModule,
    TranslateModule,
    FormModule.forChild()
  ],
  exports: [
    DateRangeFieldComponent,
    NumberRangeFieldComponent
  ]
})
export class RangeFieldModule {
  /**
   * Property `entryComponents` (`(typeof DateRangeFieldComponent | typeof NumberRangeFieldComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof DateRangeFieldComponent | typeof NumberRangeFieldComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [DateRangeFieldComponent, NumberRangeFieldComponent];
  /**
   * Creates an instance of `RangeFieldModule` and initializes its dependencies and internal state.
   * @zh 创建 `RangeFieldModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
