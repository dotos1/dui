/**
 * @fileoverview Module `src/ux/query-builder/query-input.directive.ts` providing query input directive definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-input.directive.ts`，提供查询输入属性指令相关的定义与实现。
 */

import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * Angular directive `QueryInputDirective` (selector: '[queryInput]') attaching query input directive behavior to host DOM elements.
 * @zh Angular 指令 `QueryInputDirective`（selector: '[queryInput]'），为宿主 DOM 元素附加查询输入属性指令行为。
 */
@Directive({selector: '[queryInput]'})
export class QueryInputDirective {
  /**
   * Unique name for query input type.
   * @zh 输入属性 `queryInputType`（类型：`string`）的读取器，返回当前查询输入属性类型。
   */
  @Input()
  get queryInputType(): string { return this._type; }
  /**
   * Sets the query input type (`queryInputType`).
   * @zh 设置查询输入属性类型（`queryInputType`）。
   * @param value - New query input type value (`string`) / 新的查询输入属性类型值（`string`）
   */
  set queryInputType(value: string) {
    if (!value) { return; }
    this._type = value;
  }
  /**
   * Property `_type` (`string`) storing type.
   * @zh 属性 `_type`（类型：`string`），用于存储或配置类型。
   */
  private _type: string;

  /**
   * Creates an instance of `QueryInputDirective` and initializes its dependencies and internal state.
   * @zh 创建 `QueryInputDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) {}
}
