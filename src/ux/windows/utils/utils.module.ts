/**
 * @fileoverview Module `src/ux/windows/utils/utils.module.ts` providing utils module definitions and implementation.
 * @zh 模块文件 `src/ux/windows/utils/utils.module.ts`，提供工具集模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { AppendToBodyDirective, FixedToParentDirective } from './directives';

/**
 * Angular module `UtilsModule` declaring and exporting utils module components, directives, pipes, and providers.
 * @zh Angular 模块 `UtilsModule`，声明并导出工具集模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    declarations: [
        AppendToBodyDirective,
        FixedToParentDirective
    ],
    exports: [
        AppendToBodyDirective,
        FixedToParentDirective
    ]
})
export class UtilsModule {}
