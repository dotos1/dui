/**
 * @fileoverview Module `src/core/mobx/mobx.module.ts` providing mobx module definitions and implementation.
 * @zh 模块文件 `src/core/mobx/mobx.module.ts`，提供mobx模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import {MobxAutorunDirective} from './directives/mobx-autorun.directive';
import {MobxReactionDirective} from './directives/mobx-reaction.directive';

/**
 * Angular module `MobxAngularModule` declaring and exporting mobx angular module components, directives, pipes, and providers.
 * @zh Angular 模块 `MobxAngularModule`，声明并导出MobxAngular模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    MobxAutorunDirective, MobxReactionDirective
  ],
  exports: [
    MobxAutorunDirective,  MobxReactionDirective
  ]
})
export class MobxAngularModule {}
