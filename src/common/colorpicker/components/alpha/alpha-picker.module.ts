/**
 * @fileoverview Module `src/common/colorpicker/components/alpha/alpha-picker.module.ts` providing alpha picker module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/alpha/alpha-picker.module.ts`，提供透明度选择器模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { AlphaModule, CheckboardModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { AlphaPickerComponent } from './alpha-picker.component';

/**
 * Angular module `ColorAlphaModule` declaring and exporting color alpha module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorAlphaModule`，声明并导出颜色透明度模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [AlphaPickerComponent],
  exports: [AlphaPickerComponent],
  imports: [CommonModule, AlphaModule, CheckboardModule],
})
export class ColorAlphaModule {
  /**
   * Property `entryComponents` (`(typeof AlphaPickerComponent)[]`) storing entry components (default: `[AlphaPickerComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof AlphaPickerComponent)[]`），用于存储或配置条目组件列表（默认值：`[AlphaPickerComponent]`）。
   */
  entryComponents = [AlphaPickerComponent];
  /**
   * Creates an instance of `ColorAlphaModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorAlphaModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
