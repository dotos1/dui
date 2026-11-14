/**
 * @fileoverview Module `src/form/date/datefield.module.ts` providing datefield module definitions and implementation.
 * @zh 模块文件 `src/form/date/datefield.module.ts`，提供datefield模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Dui } from '@dotos/dui/core';
import { FormModule } from '@dotos/dui/form';
import { MatDatetimepickerModule } from '@dotos/dui/form/date/picker';
import { NativeDatetimeAdapter } from '@dotos/dui/form/date/adapter';
import { TranslateModule } from '@dotos/dui/translator';
import { DateFieldComponent } from './datefield.component';

/**
 * Angular module `DateFieldModule` declaring and exporting date field module components, directives, pipes, and providers.
 * @zh Angular 模块 `DateFieldModule`，声明并导出日期字段模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    DateFieldComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    TranslateModule,
    MatDatetimepickerModule,
    FormModule.forChild(),
  ],
  exports: [
    DateFieldComponent
  ],
  providers: [NativeDatetimeAdapter]
})
export class DateFieldModule {
  /**
   * Property `entryComponents` (`(typeof DateFieldComponent)[]`) storing entry components (default: `[DateFieldComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof DateFieldComponent)[]`），用于存储或配置条目组件列表（默认值：`[DateFieldComponent]`）。
   */
  entryComponents = [DateFieldComponent];
  /**
   * Creates an instance of `DateFieldModule` and initializes its dependencies and internal state.
   * @zh 创建 `DateFieldModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
 }
