/**
 * @fileoverview Module `src/form/ext-slider/slider.ext.module.ts` providing slider ext module definitions and implementation.
 * @zh 模块文件 `src/form/ext-slider/slider.ext.module.ts`，提供滑块ext模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule  } from '@angular/material/form-field';
import {  MatTooltipModule , } from '@angular/material/tooltip';
import {  MatSliderModule  } from '@angular/material/slider';
import { SliderFieldComponent } from './slider.component';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { FormModule } from '../components/form.module';
import { Dui } from '@dotos/dui/core';

/**
 * Angular module `SliderFieldModule` declaring and exporting slider field module components, directives, pipes, and providers.
 * @zh Angular 模块 `SliderFieldModule`，声明并导出滑块字段模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
    FlexLayoutModule,
    FormModule.forChild(),
    MatTooltipModule
  ],
  declarations: [SliderFieldComponent],
  exports: [SliderFieldComponent],
})
export class SliderFieldModule {
  /**
   * Property `entryComponents` (`(typeof SliderFieldComponent)[]`) storing entry components (default: `[SliderFieldComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof SliderFieldComponent)[]`），用于存储或配置条目组件列表（默认值：`[SliderFieldComponent]`）。
   */
  entryComponents = [SliderFieldComponent];
  /**
   * Creates an instance of `SliderFieldModule` and initializes its dependencies and internal state.
   * @zh 创建 `SliderFieldModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
