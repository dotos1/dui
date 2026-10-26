/**
 * @fileoverview Module `src/common/icon/icon.module.ts` providing icon module definitions and implementation.
 * @zh 模块文件 `src/common/icon/icon.module.ts`，提供图标模块相关的定义与实现。
 */



import { NgModule } from '@angular/core';
import { IconComponent } from './icon.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IconPickerService } from './icon-picker.service';
import { FontLoaderService } from './font-loader.service';
/**
 * Angular module `IconModule` declaring and exporting icon module components, directives, pipes, and providers.
 * @zh Angular 模块 `IconModule`，声明并导出图标模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [
    IconComponent
  ],
  exports: [
    IconComponent
  ],
  providers: [
    FontLoaderService,
    IconPickerService
  ]
})
export class IconModule { }
