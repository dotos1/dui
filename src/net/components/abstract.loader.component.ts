/**
 * @fileoverview Module `src/net/components/abstract.loader.component.ts` providing abstract loader component definitions and implementation.
 * @zh 模块文件 `src/net/components/abstract.loader.component.ts`，提供abstract加载器组件相关的定义与实现。
 */


import { Input, Directive } from '@angular/core';

/**
 * Angular directive `AbstractLoader` attaching abstract loader behavior to host DOM elements.
 * @zh Angular 指令 `AbstractLoader`，为宿主 DOM 元素附加Abstract加载器行为。
 */
@Directive()
export abstract class AbstractLoader {

  /**
   * Input property `backgroundColor` (`string`) configuring background color.
   * @zh 输入属性 `backgroundColor`（类型：`string`），用于配置背景颜色。
   */
  @Input() public backgroundColor: string;
}
