/**
 * @fileoverview Module `src/common/colorpicker/components/github/github.module.ts` providing github module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/github/github.module.ts`，提供github模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule, } from '@angular/core';
import { SwatchModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { GithubSwatchComponent } from './github-swatch.component';
import { GithubComponent } from './github.component';

/**
 * Angular module `ColorGithubModule` declaring and exporting color github module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorGithubModule`，声明并导出颜色Github模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [GithubComponent, GithubSwatchComponent],
  exports: [GithubComponent, GithubSwatchComponent],
  imports: [CommonModule, SwatchModule],
})
export class ColorGithubModule {
  /**
   * Property `entryComponents` (`(typeof GithubComponent | typeof GithubSwatchComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof GithubComponent | typeof GithubSwatchComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [  GithubComponent, GithubSwatchComponent];
  /**
   * Creates an instance of `ColorGithubModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorGithubModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
