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
  private _collapsed = false;

  constructor() { }
}
