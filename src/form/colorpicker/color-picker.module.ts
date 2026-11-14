/**
 * @fileoverview Module `src/form/colorpicker/color-picker.module.ts` providing color picker module definitions and implementation.
 * @zh 模块文件 `src/form/colorpicker/color-picker.module.ts`，提供颜色选择器模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FormModule } from '../components/form.module';

import { DuiPipesModule } from '@dotos/dui/util/pipes';
import { Dui, StyleModule } from '@dotos/dui/core';
import { ColorPickerContent } from './color-picker.content';
import { ColorPickerField } from './color-picker.field';
import { ColorCompactModule } from '@dotos/dui/common/colorpicker/components';
import { ColorChromeModule } from '@dotos/dui/common/colorpicker/components';
import { ColorGithubModule } from '@dotos/dui/common/colorpicker/components';
import { ColorSketchModule } from '@dotos/dui/common/colorpicker/components';
import { TranslateModule } from '@dotos/dui/translator';

/**
 * Angular module `ColorFieldModule` declaring and exporting color field module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorFieldModule`，声明并导出颜色字段模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    ColorPickerContent,
    ColorPickerField,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    DuiPipesModule,
    FormModule.forChild(),
    ReactiveFormsModule,
    OverlayModule,
    PortalModule,
    A11yModule,
    StyleModule,
    TranslateModule,
    ColorCompactModule,
    ColorChromeModule,
    ColorGithubModule,
    ColorSketchModule,
    MatInputModule
  ],
  exports: [
    ColorCompactModule,
    ColorChromeModule,
    ColorGithubModule,
    ColorSketchModule,
    ColorPickerContent,
    ColorPickerField
  ],
})
export class ColorFieldModule {
  /**
   * Property `entryComponents` (`(typeof ColorPickerField | typeof ColorPickerContent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof ColorPickerField | typeof ColorPickerContent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
    ColorPickerContent,
    ColorPickerField
  ];
  /**
   * Creates an instance of `ColorFieldModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorFieldModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
