/**
 * @fileoverview Module `src/common/print/print.module.ts` providing print module definitions and implementation.
 * @zh 模块文件 `src/common/print/print.module.ts`，提供打印模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintService } from "./print.service";
import { PrintDirective } from "./print.directive";

/**
 * Angular module `PrintModule` declaring and exporting print module components, directives, pipes, and providers.
 * @zh Angular 模块 `PrintModule`，声明并导出打印模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PrintDirective],
  exports: [PrintDirective],
  providers: [
    PrintService,
  ],
})
export class PrintModule {
}
