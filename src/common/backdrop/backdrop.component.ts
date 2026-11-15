/**
 * @fileoverview Module `src/common/backdrop/backdrop.component.ts` providing backdrop component definitions and implementation.
 * @zh 模块文件 `src/common/backdrop/backdrop.component.ts`，提供背景遮罩组件相关的定义与实现。
 */

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * A simple full-screen dimming backdrop overlay, toggled on/off via the `shown` input.
 * @zh 一个简单的全屏遮罩层，通过 `shown` 输入属性控制显示/隐藏。
 */
@Component({
  selector: 'dui-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class BackdropComponent {
  /**
   * Whether the backdrop is visible.
   * @zh 遮罩层是否可见。
   */
  @Input()
  get shown(): boolean {
    return this._shown;
  }
  /**
   * Whether the backdrop is visible.
   * @zh 遮罩层是否可见。
   */
  set shown(value: boolean) {
    this._shown = value;
  }
  /**
   * Property `_shown` (`boolean`) storing shown.
   * @zh 属性 `_shown`（类型：`boolean`），用于存储或配置已显示。
   */
  private _shown: boolean;

  /**
   * Creates an instance of `BackdropComponent` and initializes its dependencies and internal state.
   * @zh 创建 `BackdropComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() { }
}
