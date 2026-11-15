/**
 * @fileoverview Module `src/common/iframe/iframe.module.ts` providing iframe module definitions and implementation.
 * @zh 模块文件 `src/common/iframe/iframe.module.ts`，提供iframe模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { IframeComponent } from './components/iframe.component';
import { SafePipe } from './pipes/safe.pipe';
import { CommonModule } from '@angular/common';
import { Dui } from '@dotos1/dui/core';

/**
 * Angular module `IFrameModule` declaring and exporting i frame module components, directives, pipes, and providers.
 * @zh Angular 模块 `IFrameModule`，声明并导出I框架模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule],
  declarations: [IframeComponent, SafePipe],
  exports: [IframeComponent],
})
export class IFrameModule {
  /**
   * Property `entryComponents` (`(typeof IframeComponent)[]`) storing entry components (default: `[IframeComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof IframeComponent)[]`），用于存储或配置条目组件列表（默认值：`[IframeComponent]`）。
   */
  entryComponents = [IframeComponent];
  /**
   * Creates an instance of `IFrameModule` and initializes its dependencies and internal state.
   * @zh 创建 `IFrameModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
 }
