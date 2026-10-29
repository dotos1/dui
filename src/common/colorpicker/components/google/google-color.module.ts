/**
 * @fileoverview Module `src/common/colorpicker/components/google/google-color.module.ts` providing google color module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/google/google-color.module.ts`，提供google颜色模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {  EditableInputModule,  RaisedModule,  SwatchModule,} from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { GoogColorComponent } from './google-color.component';

import { GoogColorPickerComponent } from './google.component';
import { GoogleColorService } from './google-color.services';

/**
 * Angular module `GoogColorModule` declaring and exporting goog color module components, directives, pipes, and providers.
 * @zh Angular 模块 `GoogColorModule`，声明并导出Goog颜色模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    GoogColorPickerComponent,
    GoogColorComponent
  ],
  exports: [GoogColorPickerComponent, GoogColorComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, EditableInputModule, SwatchModule, RaisedModule],
  providers: [
    GoogleColorService
  ]
})
export class GoogColorModule {
  /**
   * Property `entryComponents` (`(typeof GoogColorPickerComponent | typeof GoogColorComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof GoogColorPickerComponent | typeof GoogColorComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
    GoogColorPickerComponent,
      GoogColorComponent];
  /**
   * Creates an instance of `GoogColorModule` and initializes its dependencies and internal state.
   * @zh 创建 `GoogColorModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
