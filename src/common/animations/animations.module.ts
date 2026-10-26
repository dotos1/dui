/**
 * @fileoverview Module `src/common/animations/animations.module.ts` providing animations module definitions and implementation.
 * @zh 模块文件 `src/common/animations/animations.module.ts`，提供动画模块相关的定义与实现。
 */


import { NgModule } from '@angular/core';
import { ToggleDirective } from './toggle/toggle.directive';

/**
 * Angular module `AnimationsModule` declaring and exporting animations module components, directives, pipes, and providers.
 * @zh Angular 模块 `AnimationsModule`，声明并导出动画模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    imports: [
    ],
    declarations: [
        ToggleDirective
    ],
    exports: [
        ToggleDirective
    ]
  })
  export class AnimationsModule {

  }
