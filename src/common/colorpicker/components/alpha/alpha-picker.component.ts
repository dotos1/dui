import {  ChangeDetectionStrategy,  Component,  Input,  OnChanges,} from '@angular/core';

import { ColorWrap, toState } from '@dotos/dui/common/colorpicker/common';

@Component({
  selector: 'color-alpha-picker',
  template: `
    <div class="alpha-picker {{ className }}"
      [style.width.px]="width" [style.height.px]="height">
      <color-alpha
        [hsl]="hsl"
        [rgb]="rgb"
        [pointer]="pointer"
        [direction]="direction"
        (onChange)="handlePickerChange($event)"
      ></color-alpha>
    </div>
  `,
  styles: [
    `
    .alpha-picker {
      position: relative;
    }
    .color-alpha {
      radius: 2px;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'alpha-picker-' + Math.random().toString(36).substring(2, 15) }
})
/**
 * Standalone alpha (opacity) slider picker.
 * @zh 独立使用的透明度（alpha）滑块选择器。
 */
export class AlphaPickerComponent extends ColorWrap implements OnChanges {

  /** @zh 选择器的宽度。 */
  @Input() width: string | number = 316;

  /** @zh 选择器的高度。 */
  @Input() height: string | number = 16;

  /** @zh 滑动条方向：水平或垂直。 */
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  /** @zh 滑块手柄的内联样式。 */
  pointer: { [key: string]: string } = {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    transform: 'translate(-9px, -2px)',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
  };

  constructor() {
    super();
  }
  override ngOnChanges() {
    if (this.direction === 'vertical') {
      this.pointer['transform'] = 'translate(-3px, -9px)';
    }
    this.setState(toState(this.color, this.oldHue));
  }
  /**
   * @hidden Forwards the child alpha slider's change to `handleChange`.
   * @zh 内部使用，将子级透明度滑块的变化转发给 `handleChange`。
   */
  handlePickerChange({ data, $event }) {
    this.handleChange(data, $event);
  }
}
