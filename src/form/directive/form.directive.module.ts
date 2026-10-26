/**
 * @fileoverview Module `src/form/directive/form.directive.module.ts` providing form directive module definitions and implementation.
 * @zh 模块文件 `src/form/directive/form.directive.module.ts`，提供表单指令模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoTrimDirective } from './auto-trim.directive'

/**
 * Angular module `DuiFormDirectiveModule` declaring and exporting dui form directive module components, directives, pipes, and providers.
 * @zh Angular 模块 `DuiFormDirectiveModule`，声明并导出DUI表单指令模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
    AutoTrimDirective
  ],
  exports: [
    AutoTrimDirective
  ]
})
export class DuiFormDirectiveModule {

}
