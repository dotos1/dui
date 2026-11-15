/**
 * @fileoverview Module `src/ux/terminal/terminal.module.ts` providing terminal module definitions and implementation.
 * @zh 模块文件 `src/ux/terminal/terminal.module.ts`，提供终端模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizableModule } from '@dotos1/dui/common/resize-element';
import { TerminalComponent } from './terminal.component';
import { GlobalStyleComponent } from './global-style/global-style.component';


/**
 * Angular module `TerminalModule` declaring and exporting terminal module components, directives, pipes, and providers.
 * @zh Angular 模块 `TerminalModule`，声明并导出终端模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [TerminalComponent,GlobalStyleComponent],
  imports: [
    ResizableModule, CommonModule
  ],
  exports: [TerminalComponent]
})
export class TerminalModule { }
