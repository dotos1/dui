/**
 * @fileoverview Module `src/ui/color-button/color-button.module.ts` providing color button module definitions and implementation.
 * @zh 模块文件 `src/ui/color-button/color-button.module.ts`，提供颜色按钮模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormModule } from '@dotos/dui/form';
import { Dui } from '@dotos/dui/core';
import { ColorPickerButton } from './color-button';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@dotos/dui/common/icon';
import { ColorCircleModule, ColorCompactModule } from '@dotos/dui/common/colorpicker/components';
import { TranslateModule } from '@dotos/dui/translator';
import { MatIconModule } from '@angular/material/icon';
import { GoogColorModule } from '@dotos/dui/common/colorpicker/components';

/**
 * Angular module `ColorPickerButtonModule` declaring and exporting color picker button module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorPickerButtonModule`，声明并导出颜色选择器按钮模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    PortalModule,
    TranslateModule.forChild(),
    ColorCompactModule,
    MatMenuModule,
    MatIconModule,
    GoogColorModule,
    ColorCircleModule,
    MatButtonModule,
    OverlayModule,
    IconModule,
    FormModule.forChild(),
  ],
  declarations: [
    ColorPickerButton
  ],
  exports:[
    ColorPickerButton,
  ]
})
export class ColorPickerButtonModule {
  /**
   * Property `entryComponents` (`(typeof ColorPickerButton)[]`) storing entry components (default: `[ ColorPickerButton, ]`).
   * @zh 属性 `entryComponents`（类型：`(typeof ColorPickerButton)[]`），用于存储或配置条目组件列表（默认值：`[ ColorPickerButton, ]`）。
   */
  entryComponents = [
    ColorPickerButton,
  ];
  /**
   * Creates an instance of `ColorPickerButtonModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorPickerButtonModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
