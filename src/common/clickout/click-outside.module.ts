/**
 * @fileoverview Module `src/common/clickout/click-outside.module.ts` providing click outside module definitions and implementation.
 * @zh 模块文件 `src/common/clickout/click-outside.module.ts`，提供点击外部模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';

import { ClickOutsideDirective } from './click-outside.directive';

/**
 * Angular module `ClickOutsideModule` declaring and exporting click outside module components, directives, pipes, and providers.
 * @zh Angular 模块 `ClickOutsideModule`，声明并导出点击外部模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ClickOutsideDirective],
  exports: [ClickOutsideDirective]
})
export class ClickOutsideModule {}
