/**
 * @fileoverview Module `src/form/base/select.module.ts` providing select module definitions and implementation.
 * @zh 模块文件 `src/form/base/select.module.ts`，提供下拉选择模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { TranslateModule } from '@dotos/dui/translator';
import { SelectOptionsPipe } from './select-options.pipe';

/**
 * Angular module `SelectPipeModule` declaring and exporting select pipe module components, directives, pipes, and providers.
 * @zh Angular 模块 `SelectPipeModule`，声明并导出下拉选择管道模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
     TranslateModule,
  ],
  declarations: [SelectOptionsPipe],
  exports: [SelectOptionsPipe],
})
export class SelectPipeModule {


}
