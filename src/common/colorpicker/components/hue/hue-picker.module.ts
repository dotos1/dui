/**
 * @fileoverview Module `src/common/colorpicker/components/hue/hue-picker.module.ts` providing hue picker module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/hue/hue-picker.module.ts`，提供色相选择器模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { HueModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { HuePickerComponent } from './hue-picker.component';

/**
 * Angular module `ColorHueModule` declaring and exporting color hue module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorHueModule`，声明并导出颜色色相模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [HuePickerComponent],
  exports: [HuePickerComponent],
  imports: [CommonModule, HueModule],
})
export class ColorHueModule {
  /**
   * Property `entryComponents` (`(typeof HuePickerComponent)[]`) storing entry components (default: `[HuePickerComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof HuePickerComponent)[]`），用于存储或配置条目组件列表（默认值：`[HuePickerComponent]`）。
   */
  entryComponents = [HuePickerComponent];
  /**
   * Creates an instance of `ColorHueModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorHueModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
