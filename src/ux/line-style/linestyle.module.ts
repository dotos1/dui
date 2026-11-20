/**
 * @fileoverview Module `src/ux/line-style/linestyle.module.ts` providing linestyle module definitions and implementation.
 * @zh 模块文件 `src/ux/line-style/linestyle.module.ts`，提供linestyle模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormModule } from '@dotos1/dui/form';
import { LineStyleSelector } from './linestyle';
import { LineSizeSelector } from './linesize';
import { Dui } from '@dotos1/dui/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@dotos1/dui/common/icon';
import { ColorCircleModule, ColorCompactModule } from '@dotos1/dui/common/colorpicker/components';
import { TranslateModule } from '@dotos1/dui/translator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

/**
 * Angular module `LineStyleModule` declaring and exporting line style module components, directives, pipes, and providers.
 * @zh Angular 模块 `LineStyleModule`，声明并导出线段样式模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    PortalModule,
    MatInputModule,
    MatAutocompleteModule,
    // 不用 forChild()：它会在引入方的注入器里另建一份 TranslateService（currentLang 为空或 en），
    // 同一注入器下其它组件的 translate 管道拿到这份，收不到根上的词条更新，界面停在词条键上
    TranslateModule,
    ColorCompactModule,
    MatMenuModule,
    ColorCircleModule,
    MatButtonModule,
    OverlayModule,
    IconModule,
    FormModule.forChild()
  ],
  declarations: [
    LineStyleSelector,
    LineSizeSelector
  ],
  exports:[
    LineStyleSelector,
    LineSizeSelector
  ]
})
export class LineStyleModule {
  /**
   * Property `entryComponents` (`(typeof LineStyleSelector | typeof LineSizeSelector)[]`) storing entry components (default: `[ LineStyleSelector, LineSizeSelector ]`).
   * @zh 属性 `entryComponents`（类型：`(typeof LineStyleSelector | typeof LineSizeSelector)[]`），用于存储或配置条目组件列表（默认值：`[ LineStyleSelector, LineSizeSelector ]`）。
   */
  entryComponents = [
    LineStyleSelector,
    LineSizeSelector
  ];
  /**
   * Creates an instance of `LineStyleModule` and initializes its dependencies and internal state.
   * @zh 创建 `LineStyleModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
