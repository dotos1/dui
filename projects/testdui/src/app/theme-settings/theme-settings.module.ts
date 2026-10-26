/**
 * @fileoverview Module `projects/testdui/src/app/theme-settings/theme-settings.module.ts` providing theme settings module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/theme-settings/theme-settings.module.ts`，提供主题设置项模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { ColorPickerModule } from '@dotos/dui/common/matcolorpicker';

import { ThemeSettingsComponent } from './theme-settings.component';

/**
 * Angular module `ThemeSettingsModule` declaring and exporting theme settings module components, directives, pipes, and providers.
 * @zh Angular 模块 `ThemeSettingsModule`，声明并导出主题设置项模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ThemeSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ColorPickerModule,
  ],
  exports: [ThemeSettingsComponent],
})
export class ThemeSettingsModule {}
