/**
 * @fileoverview Module `src/common/perfect-scrollbar/perfect-scrollbar.module.ts` providing perfect scrollbar module definitions and implementation.
 * @zh 模块文件 `src/common/perfect-scrollbar/perfect-scrollbar.module.ts`，提供perfect滚动条模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ForceNativeScrollDirective } from './perfect-scrollbar-force-native-scroll.directive';
import { PerfectScrollbarComponent } from './perfect-scrollbar.component';
import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';

/**
 * Angular module `PerfectScrollbarModule` declaring and exporting perfect scrollbar module components, directives, pipes, and providers.
 * @zh Angular 模块 `PerfectScrollbarModule`，声明并导出Perfect滚动条模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    imports: [CommonModule],
    declarations: [PerfectScrollbarComponent, PerfectScrollbarDirective, ForceNativeScrollDirective],
    exports: [CommonModule, PerfectScrollbarComponent, PerfectScrollbarDirective, ForceNativeScrollDirective],
})
export class PerfectScrollbarModule {}
