/**
 * @fileoverview Module `src/common/colorpicker/components/compact/compact.module.ts` providing compact module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/compact/compact.module.ts`，提供紧凑模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';

import {  EditableInputModule,  RaisedModule,  SwatchModule,} from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { CompactColorComponent } from './compact-color.component';
import { CompactFieldsComponent } from './compact-fields.component';
import { CompactComponent } from './compact.component';

/**
 * Angular module `ColorCompactModule` declaring and exporting color compact module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorCompactModule`，声明并导出颜色紧凑模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    CompactComponent,
    CompactColorComponent,
    CompactFieldsComponent,
  ],
  exports: [CompactComponent, CompactColorComponent, CompactFieldsComponent],
  imports: [CommonModule, EditableInputModule, SwatchModule, RaisedModule],
})
export class ColorCompactModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
      CompactComponent,
    CompactColorComponent,
    CompactFieldsComponent,];
  /**
   * Creates an instance of `ColorCompactModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorCompactModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
