/**
 * @fileoverview Module `src/common/message/message.module.ts` providing message module definitions and implementation.
 * @zh 模块文件 `src/common/message/message.module.ts`，提供消息模块相关的定义与实现。
 */

import { Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {
  MessageComponent,
  MessageContainerDirective,
} from './message.component';

/**
 * Constant/variable `DUI_MESSAGE` defining dui message in `src/common/message`.
 * @zh 常量/变量 `DUI_MESSAGE`，定义 `src/common/message` 中的DUI消息。
 */
const DUI_MESSAGE = [
  MessageComponent,
  MessageContainerDirective,
];

/**
 * Angular module `MessageModule` declaring and exporting message module components, directives, pipes, and providers.
 * @zh Angular 模块 `MessageModule`，声明并导出消息模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [DUI_MESSAGE],
  exports: [DUI_MESSAGE],
})
export class MessageModule {}
