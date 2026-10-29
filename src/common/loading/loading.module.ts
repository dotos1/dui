/**
 * @fileoverview Module `src/common/loading/loading.module.ts` providing loading module definitions and implementation.
 * @zh 模块文件 `src/common/loading/loading.module.ts`，提供加载中模块相关的定义与实现。
 */


import { ComponentFactoryResolver, Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LOADING_PROVIDER } from './services/loading.service';
import { LOADING_FACTORY_PROVIDER } from './services/loading.factory';
import { LoadingDirective } from './directives/loading.directive';
import { LoadingComponent } from './loading.component';
import { Dui } from '@dotos/dui/core';

/**
 * Constant/variable `TD_LOADING` defining td loading in `src/common/loading`.
 * @zh 常量/变量 `TD_LOADING`，定义 `src/common/loading` 中的TD加载中。
 */
const TD_LOADING = [LoadingComponent, LoadingDirective];
/**
 * Constant/variable `EXT_LOADING_ENTRY_COMPONENTS` defining ext loading entry components in `src/common/loading`.
 * @zh 常量/变量 `EXT_LOADING_ENTRY_COMPONENTS`，定义 `src/common/loading` 中的EXT加载中条目组件列表。
 */
const EXT_LOADING_ENTRY_COMPONENTS = [
  LoadingComponent
];
/**
 * Angular module `LoadingModule` declaring and exporting loading module components, directives, pipes, and providers.
 * @zh Angular 模块 `LoadingModule`，声明并导出加载中模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    OverlayModule,
    PortalModule,
  ],
  declarations: [TD_LOADING],
  exports: [TD_LOADING],
  providers: [LOADING_FACTORY_PROVIDER, LOADING_PROVIDER],
})
export class LoadingModule {
  /**
   * Property `entryComponents` (`(typeof LoadingComponent)[]`) storing entry components (default: `EXT_LOADING_ENTRY_COMPONENTS`).
   * @zh 属性 `entryComponents`（类型：`(typeof LoadingComponent)[]`），用于存储或配置条目组件列表（默认值：`EXT_LOADING_ENTRY_COMPONENTS`）。
   */
  entryComponents = EXT_LOADING_ENTRY_COMPONENTS;
  /**
   * Creates an instance of `LoadingModule` and initializes its dependencies and internal state.
   * @zh 创建 `LoadingModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
