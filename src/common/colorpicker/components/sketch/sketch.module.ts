/**
 * @fileoverview Module `src/common/colorpicker/components/sketch/sketch.module.ts` providing sketch module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/sketch/sketch.module.ts`，提供sketch模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {
  AlphaModule,  CheckboardModule,  EditableInputModule,  HueModule,  SaturationModule,  SwatchModule,
} from '@dotos1/dui/common/colorpicker/common';
import { Dui } from '@dotos1/dui/core';
import { SketchDialogComponent } from './sketch-dialog.component';
import { SketchFieldsComponent } from './sketch-fields.component';
import { SketchPresetColorsComponent } from './sketch-preset-colors.component';
import { SketchComponent } from './sketch.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@dotos1/dui/translator';


/**
 * Angular module `ColorSketchModule` declaring and exporting color sketch module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorSketchModule`，声明并导出颜色Sketch模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    SketchComponent,
    SketchFieldsComponent,
    SketchPresetColorsComponent,
    SketchDialogComponent
  ],
  exports: [
    SketchComponent,
    SketchFieldsComponent,
    SketchPresetColorsComponent,
    SketchDialogComponent
  ],
  imports: [
    CommonModule,
    AlphaModule,
    CheckboardModule,
    EditableInputModule,
    HueModule,
    MatDialogModule,
    SaturationModule,
    SwatchModule,
    TranslateModule,
    MatButtonModule
  ],
})
export class ColorSketchModule {
  /**
   * Property `entryComponents` (`(typeof SketchComponent | typeof SketchFieldsComponent | typeof SketchPresetColorsComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof SketchComponent | typeof SketchFieldsComponent | typeof SketchPresetColorsComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
     SketchComponent,
    SketchFieldsComponent,
    SketchPresetColorsComponent,];
  /**
   * Creates an instance of `ColorSketchModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorSketchModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
 }
