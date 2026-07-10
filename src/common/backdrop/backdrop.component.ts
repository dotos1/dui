import { Component, Input } from '@angular/core';

/**
 * A simple full-screen dimming backdrop overlay, toggled on/off via the `shown` input.
 * @zh 一个简单的全屏遮罩层，通过 `shown` 输入属性控制显示/隐藏。
 */
@Component({
  selector: 'dui-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss']
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
  set shown(value: boolean) {
    this._shown = value;
  }
  private _shown: boolean;

  constructor() { }
}
