/**
 * @fileoverview Module `src/common/matcolorpicker/color-picker.module.ts` providing color picker module definitions and implementation.
 * @zh 模块文件 `src/common/matcolorpicker/color-picker.module.ts`，提供颜色选择器模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DuiPipesModule } from '@dotos/dui/util/pipes';

import { ColorPickerComponent } from './color-picker.component';
import { PerfectScrollbarModule } from '@dotos/dui/common/perfect-scrollbar';
import { TranslateModule } from '@dotos/dui/translator';

/**
 * Angular module `ColorPickerModule` declaring and exporting color picker module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorPickerModule`，声明并导出颜色选择器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    PerfectScrollbarModule,
    TranslateModule,
    DuiPipesModule
  ],
  exports: [
    ColorPickerComponent
  ],
})
export class ColorPickerModule {
}
