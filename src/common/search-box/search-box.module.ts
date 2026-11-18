/**
 * @fileoverview Module `src/common/search-box/search-box.module.ts` providing search box module definitions and implementation.
 * @zh 模块文件 `src/common/search-box/search-box.module.ts`，提供搜索盒子容器模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SearchInputComponent } from './search-input/search-input.component';
import { SearchBoxComponent } from './search-box.component';
import { Dui } from '@dotos1/dui/core';

/**
 * Angular module `SearchBoxModule` declaring and exporting search box module components, directives, pipes, and providers.
 * @zh Angular 模块 `SearchBoxModule`，声明并导出搜索盒子容器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [SearchInputComponent, SearchBoxComponent],
  exports: [SearchInputComponent, SearchBoxComponent],
})
export class SearchBoxModule {
  /**
   * Property `entryComponents` (`(typeof SearchBoxComponent)[]`) storing entry components (default: `[ SearchBoxComponent ]`).
   * @zh 属性 `entryComponents`（类型：`(typeof SearchBoxComponent)[]`），用于存储或配置条目组件列表（默认值：`[ SearchBoxComponent ]`）。
   */
  entryComponents = [
    SearchBoxComponent
  ];
  /**
   * Creates an instance of `SearchBoxModule` and initializes its dependencies and internal state.
   * @zh 创建 `SearchBoxModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
