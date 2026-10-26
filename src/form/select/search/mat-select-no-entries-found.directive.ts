/**
 * @fileoverview Module `src/form/select/search/mat-select-no-entries-found.directive.ts` providing mat select no entries found directive definitions and implementation.
 * @zh 模块文件 `src/form/select/search/mat-select-no-entries-found.directive.ts`，提供Material下拉选择no条目集合found指令相关的定义与实现。
 */

import { Directive } from '@angular/core';

/**
 * Angular directive `MatSelectNoEntriesFoundDirective` (selector: '[MatSelectNoEntriesFound]') attaching mat select no entries found directive behavior to host DOM elements.
 * @zh Angular 指令 `MatSelectNoEntriesFoundDirective`（selector: '[MatSelectNoEntriesFound]'），为宿主 DOM 元素附加Material下拉选择No条目集合Found指令行为。
 */
@Directive({
  selector: '[MatSelectNoEntriesFound]',
  standalone: false
})
export class MatSelectNoEntriesFoundDirective {}
