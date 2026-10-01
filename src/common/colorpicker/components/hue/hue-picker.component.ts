
import {  ChangeDetectionStrategy,  Component,  Input,  OnChanges,} from '@angular/core';
import { ColorWrap, toState } from '@dotos/dui/common/colorpicker/common';

@Component({
  selector: 'color-hue-picker',
  template: `
  <div class="hue-picker {{ className }}"
    [style.width.px]="width" [style.height.px]="height"
  >
    <color-hue [hsl]="hsl" [pointer]="pointer"
      [direction]="direction" [radius]="radius"
      (onChange)="handlePickerChange($event)"
    ></color-hue>
  </div>
  `,
  styles: [
    `
    .hue-picker {
      position: relative;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'hue-picker-' + Math.random().toString(36).substring(2, 15) }
})
/**
 * Standalone hue slider picker.
 * @zh 独立使用的色相滑块选择器。
 */
export class HuePickerComponent extends ColorWrap implements OnChanges {
  /** Pixel value for picker width */
  @Input() width: string | number = 316;
  /** Pixel value for picker height */
  @Input() height: string | number = 16;
  /** @zh 滑动条的圆角半径。 */
  @Input() radius = 2;
  /** @zh 滑动条方向：水平或垂直。 */
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  /** @zh 滑块手柄的内联样式。 */
  pointer: { [key: string]: string } = {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    transform: 'translate(-9px, -2px)',
    backgroundColor: 'rgb(248, 248, 248)',
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
   * @hidden Forwards the child hue slider's change to `handleChange` (fixed saturation/lightness/alpha).
   * @zh 内部使用，将子级色相滑块的变化转发给 `handleChange`（固定饱和度/明度/透明度）。
   */
  handlePickerChange({ data, $event }) {
    this.handleChange({ a: 1, h: data.h, l: 0.5, s: 1 }, $event);
  }
}
