/**
 * @fileoverview Module `src/common/colorpicker/components/circle/circle.module.ts` providing circle module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/circle/circle.module.ts`，提供圆形模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import {ComponentFactoryResolver, NgModule,} from '@angular/core';
import { CircleComponent } from './circle.component';
import { CircleSwatchComponent } from './circle-swatch.component';
import { SwatchModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';


/**
 * Angular module `ColorCircleModule` declaring and exporting color circle module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorCircleModule`，声明并导出颜色圆形模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [CircleComponent, CircleSwatchComponent],
  exports: [CircleComponent, CircleSwatchComponent],
  imports: [CommonModule, SwatchModule],
})
export class ColorCircleModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [ CircleComponent, CircleSwatchComponent];
  /**
   * Creates an instance of `ColorCircleModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorCircleModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
