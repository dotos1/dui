/**
 * @fileoverview Module `src/common/collapsible/collapsible.component.ts` providing collapsible component definitions and implementation.
 * @zh 模块文件 `src/common/collapsible/collapsible.component.ts`，提供可折叠面板组件相关的定义与实现。
 */

import { Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * A titled panel with a built-in chevron toggle that expands/collapses its projected content.
 * @zh 带标题的面板，内置箭头开关，用于展开/收起投影进来的内容。
 */
@Component({
  selector: 'dui-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})

export class CollapsibleComponent {
  /**
   * Panel title text (translated via the `translate` pipe).
   * @zh 面板标题文字（通过 `translate` 管道翻译）。
   */
  @Input()
  get title() {
    return this._title;
  }
  /**
   * Panel title text (translated via the `translate` pipe).
   * @zh 面板标题文字（通过 `translate` 管道翻译）。
   */
  set title(value: string) {
    this._title = value;
  }
  /**
   * Property `_title` (`string`) storing title (default: `''`).
   * @zh 属性 `_title`（类型：`string`），用于存储或配置标题（默认值：`''`）。
   */
  private _title = '';

  /**
   * Initial collapsed state; toggling the chevron icon updates this internally.
   * @zh 初始的收起状态；点击箭头图标会在内部更新该状态。
   */
  @Input()
  get collapsed() {
    return this._collapsed;
  }
  /**
   * Initial collapsed state; toggling the chevron icon updates this internally.
   * @zh 初始的收起状态；点击箭头图标会在内部更新该状态。
   */
  set collapsed(value: boolean) {
    this._collapsed = value;
  }
  /**
   * Property `_collapsed` (`boolean`) storing collapsed (default: `false`).
   * @zh 属性 `_collapsed`（类型：`boolean`），用于存储或配置已折叠（默认值：`false`）。
   */
  private _collapsed = false;

  /**
   * Creates an instance of `CollapsibleComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CollapsibleComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() { }
}
