/**
 * @fileoverview Module `src/common/colorpicker/components/shade/shade-picker.module.ts` providing shade picker module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/shade/shade-picker.module.ts`，提供shade选择器模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShadeModule } from '@dotos1/dui/common/colorpicker/common';
import { Dui } from '@dotos1/dui/core';
import { ShadeSliderComponent } from './shade-picker.component';


/**
 * Angular module `ColorShadeModule` declaring and exporting color shade module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorShadeModule`，声明并导出颜色Shade模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ShadeSliderComponent],
  exports: [ShadeSliderComponent],
  imports: [CommonModule, ShadeModule],
})
export class ColorShadeModule {
  /**
   * Property `entryComponents` (`(typeof ShadeSliderComponent)[]`) storing entry components (default: `[ShadeSliderComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof ShadeSliderComponent)[]`），用于存储或配置条目组件列表（默认值：`[ShadeSliderComponent]`）。
   */
  entryComponents = [ShadeSliderComponent];
  /**
   * Creates an instance of `ColorShadeModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorShadeModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
