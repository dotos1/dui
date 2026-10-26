/**
 * @fileoverview Module `src/common/directives/directives.module.ts` providing directives module definitions and implementation.
 * @zh 模块文件 `src/common/directives/directives.module.ts`，提供指令模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';

import { DuiIfOnDomDirective } from './if-on-dom.directive';

/**
 * Angular module `DuiDirectivesModule` declaring and exporting dui directives module components, directives, pipes, and providers.
 * @zh Angular 模块 `DuiDirectivesModule`，声明并导出DUI指令模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    declarations: [
      DuiIfOnDomDirective
    ],
    imports     : [],
    exports     : [
      DuiIfOnDomDirective
    ]
})
export class DuiDirectivesModule
{
}
