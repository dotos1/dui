/**
 * @fileoverview Module `src/common/popover/popover-module.ts` providing popover module definitions and implementation.
 * @zh 模块文件 `src/common/popover/popover-module.ts`，提供气泡卡片模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { Popover } from './popover';
import { PopoverTrigger } from './popover-trigger';
import { PopoverTarget } from './popover-target';
import { A11yModule } from '@angular/cdk/a11y';


/**
 * Angular module `PopoverModule` declaring and exporting popover module components, directives, pipes, and providers.
 * @zh Angular 模块 `PopoverModule`，声明并导出气泡卡片模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    OverlayModule,
    CommonModule,
    A11yModule
  ],
  exports: [Popover, PopoverTrigger, PopoverTarget],
  declarations: [Popover, PopoverTrigger, PopoverTarget],

})
export class PopoverModule {}
