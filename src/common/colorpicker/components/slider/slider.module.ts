/**
 * @fileoverview Module `src/common/colorpicker/components/slider/slider.module.ts` providing slider module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/slider/slider.module.ts`，提供滑块模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule, } from '@angular/core';
import { HueModule, SwatchModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { SliderSwatchComponent } from './slider-swatch.component';
import { SliderSwatchesComponent } from './slider-swatches.component';
import { ColorSliderComponent } from './slider.component';

/**
 * Angular module `ColorSliderModule` declaring and exporting color slider module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorSliderModule`，声明并导出颜色滑块模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    ColorSliderComponent,
    SliderSwatchComponent,
    SliderSwatchesComponent,
  ],
  exports: [ColorSliderComponent, SliderSwatchComponent, SliderSwatchesComponent],
  imports: [CommonModule, HueModule, SwatchModule],
})
export class ColorSliderModule {
  /**
   * Property `entryComponents` (`(typeof ColorSliderComponent | typeof SliderSwatchComponent | typeof SliderSwatchesComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof ColorSliderComponent | typeof SliderSwatchComponent | typeof SliderSwatchesComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
     ColorSliderComponent,
    SliderSwatchComponent,
    SliderSwatchesComponent];
  /**
   * Creates an instance of `ColorSliderModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorSliderModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
