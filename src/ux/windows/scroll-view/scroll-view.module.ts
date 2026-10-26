/**
 * @fileoverview Module `src/ux/windows/scroll-view/scroll-view.module.ts` providing scroll view module definitions and implementation.
 * @zh 模块文件 `src/ux/windows/scroll-view/scroll-view.module.ts`，提供滚动视图模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UtilsModule } from '../utils';
import { ScrollViewComponent } from './components';

/**
 * Angular module `ScrollViewModule` declaring and exporting scroll view module components, directives, pipes, and providers.
 * @zh Angular 模块 `ScrollViewModule`，声明并导出滚动视图模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    declarations: [
        ScrollViewComponent
    ],
    imports: [
      CommonModule,
      UtilsModule
    ],
    exports: [
        ScrollViewComponent
    ]
})
export class ScrollViewModule {}
