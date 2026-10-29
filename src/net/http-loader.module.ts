/**
 * @fileoverview Module `src/net/http-loader.module.ts` providing http loader module definitions and implementation.
 * @zh 模块文件 `src/net/http-loader.module.ts`，提供HTTP加载器模块相关的定义与实现。
 */


import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from '@angular/core';
import { HttpLoaderComponent } from './components/http-loader.component';
import { PendingRequestsInterceptorProvider } from './services/pending-requests-interceptor.service';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { Dui } from '@dotos/dui/core';

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
   * Property `entryComponents` (`(typeof MatProgressSpinner)[]`) storing entry components (default: `[MatSpinner]`).
   * @zh 属性 `entryComponents`（类型：`(typeof MatProgressSpinner)[]`），用于存储或配置条目组件列表（默认值：`[MatSpinner]`）。
   */
  entryComponents = [MatSpinner];
  /**
   * Creates an instance of `HttpLoaderModule` and initializes its dependencies and internal state.
   * @zh 创建 `HttpLoaderModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
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
