/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/gradient.module.ts` providing gradient module definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/gradient.module.ts`，提供渐变模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {
  AlphaModule,  CheckboardModule,  EditableInputModule,  HueModule,  SaturationModule,  SwatchModule,
} from '@dotos1/dui/common/colorpicker/common';
import { Dui } from '@dotos1/dui/core';
import {GradientDialogComponent } from './gradient-dialog.component';
import {GradientFieldsComponent } from './gradient-fields.component';
// import {GradientPresetColorsComponent } from './gradient-preset-colors.component';
import {GradientComponent } from './gradient.component';
import { GradientHueComponent } from './components/gradient-hue.component';
import { GradientOpacityComponent } from './components/gradient-opacity.component';
import { GradientBarHandleComponent } from './components/gradient-bar-handle.component';
import { GradientBarComponent } from './components/gradient-bar.component';
import { GradientSquareComponent } from './components/gradient-square.component';
import { GradientPresetsComponent } from './components/gradient-presets.component';
import { EyeDropperComponent } from './components/eye-dropper.component';
import { GradientControlsComponent } from './components/gradient-controls.component';
import { ControlsComponent } from './components/controls.component';
import { MatIconModule } from '@angular/material/icon';


/**
 * Angular module `ColorGradientModule` declaring and exporting color gradient module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorGradientModule`，声明并导出颜色渐变模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
   GradientComponent,
   GradientFieldsComponent,
   GradientHueComponent,
   GradientBarHandleComponent,
   GradientBarComponent,
   GradientSquareComponent,
   GradientOpacityComponent,
   GradientPresetsComponent,
   EyeDropperComponent,
   ControlsComponent,
   GradientControlsComponent,
  //  GradientPresetColorsComponent,
   GradientDialogComponent
  ],
  exports: [
   GradientComponent,
   GradientFieldsComponent,
  //  GradientPresetColorsComponent,
   GradientDialogComponent
  ],
  imports: [
    CommonModule,
    AlphaModule,
    MatIconModule,
    CheckboardModule,
    EditableInputModule,
    HueModule,
    SaturationModule,
    SwatchModule,
    MatButtonModule
  ],
})
export class ColorGradientModule {
  /**
   * Property `entryComponents` (`(typeof GradientComponent | typeof GradientFieldsComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof GradientComponent | typeof GradientFieldsComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
    GradientComponent,
   GradientFieldsComponent,
   ];
  /**
   * Creates an instance of `ColorGradientModule` and initializes its dependencies and internal state.
   * @zh 创建 `ColorGradientModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
 }
