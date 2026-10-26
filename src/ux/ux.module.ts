/**
 * @fileoverview Module `src/ux/ux.module.ts` providing ux module definitions and implementation.
 * @zh 模块文件 `src/ux/ux.module.ts`，提供交互体验模块相关的定义与实现。
 */


import { NgModule } from '@angular/core';
import { CodeEditorModule } from './code-editor/code-editor.module';
import { IconPickerModule } from './iconpicker/icon-picker.module';

/**
 * Constant/variable `MODULE_ARRAY` defining module array in `src/ux`.
 * @zh 常量/变量 `MODULE_ARRAY`，定义 `src/ux` 中的模块数组。
 */
const MODULE_ARRAY = [
  CodeEditorModule,
  IconPickerModule,
];
/**
 * Angular module `ExtUxModule` declaring and exporting ext ux module components, directives, pipes, and providers.
 * @zh Angular 模块 `ExtUxModule`，声明并导出Ext交互体验模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: MODULE_ARRAY
})
export class ExtUxModule {

}
