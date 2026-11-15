/**
 * @fileoverview Module `src/common/colorpicker/components/chrome/chrome.module.ts` providing chrome module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/chrome/chrome.module.ts`，提供chrome模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlphaModule, CheckboardModule, EditableInputModule, HueModule, SaturationModule, } from '@dotos1/dui/common/colorpicker/common';
import { Dui } from '@dotos1/dui/core';
import { ChromeFieldsComponent } from './chrome-fields.component';
import { ChromeComponent } from './chrome.component';

/**
 * Angular module `ColorChromeModule` declaring and exporting color chrome module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorChromeModule`，声明并导出颜色Chrome模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    ChromeComponent,
    ChromeFieldsComponent
  ],
  exports: [ChromeComponent, ChromeFieldsComponent],
  imports: [
    CommonModule,
    AlphaModule,
    CheckboardModule,
    EditableInputModule,
    HueModule,
    SaturationModule,
  ],
})
export class ColorChromeModule {
  /**
   * Property `entryComponents` (`(typeof ChromeComponent | typeof ChromeFieldsComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof ChromeComponent | typeof ChromeFieldsComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [ChromeComponent,
    ChromeFieldsComponent];
  /**
   * Creates an instance of `ColorChromeModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorChromeModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
