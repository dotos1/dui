/**
 * @fileoverview Module `src/common/inline-svg/inline-svg.module.ts` providing inline svg module definitions and implementation.
 * @zh 模块文件 `src/common/inline-svg/inline-svg.module.ts`，提供inlineSVG矢量图模块相关的定义与实现。
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { Dui } from '@dotos/dui/core';

import { InlineSVGComponent } from './inline-svg.component';
import { InlineSVGConfig } from './inline-svg.config';
import { InlineSVGDirective } from './inline-svg.directive';

/**
 * Angular module `InlineSVGModule` declaring and exporting inline svg module components, directives, pipes, and providers.
 * @zh Angular 模块 `InlineSVGModule`，声明并导出InlineSVG矢量图模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [InlineSVGDirective, InlineSVGComponent],
  exports: [InlineSVGDirective,InlineSVGComponent]
})
export class InlineSVGModule {
  /**
   * Property `entryComponents` (`(typeof InlineSVGComponent)[]`) storing entry components (default: `[InlineSVGComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof InlineSVGComponent)[]`），用于存储或配置条目组件列表（默认值：`[InlineSVGComponent]`）。
   */
  entryComponents = [InlineSVGComponent];
  /**
   * Creates an instance of `InlineSVGModule` and initializes its dependencies and internal state.
   * @zh 创建 `InlineSVGModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`InlineSVGConfig`) / 配置参数（`InlineSVGConfig`）
   * @returns Result of type `ModuleWithProviders<InlineSVGModule>` / 类型为 `ModuleWithProviders<InlineSVGModule>` 的返回值
   */
  static forRoot(config?: InlineSVGConfig): ModuleWithProviders<InlineSVGModule> {
    return {
      ngModule: InlineSVGModule,
      providers: [
        { provide: InlineSVGConfig, useValue: config }
      ]
    };
  }
}
