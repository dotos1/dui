/**
 * @fileoverview Module `src/util/util.module.ts` providing util module definitions and implementation.
 * @zh 模块文件 `src/util/util.module.ts`，提供工具模块相关的定义与实现。
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


/**
 * Angular module `ExtUtilModule` declaring and exporting ext util module components, directives, pipes, and providers.
 * @zh Angular 模块 `ExtUtilModule`，声明并导出Ext工具模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
  ],
})
export class ExtUtilModule {

}
