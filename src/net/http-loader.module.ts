/**
 * @fileoverview Module `src/net/http-loader.module.ts` providing http loader module definitions and implementation.
 * @zh 模块文件 `src/net/http-loader.module.ts`，提供HTTP加载器模块相关的定义与实现。
 */


import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpLoaderComponent } from './components/http-loader.component';
import { PendingRequestsInterceptorProvider } from './services/pending-requests-interceptor.service';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Dui } from '@dotos1/dui/core';

/**
 * Angular module `HttpLoaderModule` declaring and exporting http loader module components, directives, pipes, and providers.
 * @zh Angular 模块 `HttpLoaderModule`，声明并导出HTTP加载器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    HttpLoaderComponent,
  ],
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
  ],
  exports: [
    HttpLoaderComponent,
  ],
})
export class HttpLoaderModule {
  /**
   * Property `entryComponents` (`(typeof MatProgressSpinner)[]`) storing entry components (default: `[MatProgressSpinner]`).
   * @zh 属性 `entryComponents`（类型：`(typeof MatProgressSpinner)[]`），用于存储或配置条目组件列表（默认值：`[MatProgressSpinner]`）。
   */
  entryComponents = [MatProgressSpinner];
  /**
   * Creates an instance of `HttpLoaderModule` and initializes its dependencies and internal state.
   * @zh 创建 `HttpLoaderModule` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @returns Result of type `ModuleWithProviders<HttpLoaderModule>` / 类型为 `ModuleWithProviders<HttpLoaderModule>` 的返回值
   */
  public static forRoot(): ModuleWithProviders<HttpLoaderModule> {
    return {
      ngModule: HttpLoaderModule,
      providers: [
        PendingRequestsInterceptorProvider,
      ],
    };
  }
}
