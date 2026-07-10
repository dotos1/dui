import {
  ChangeDetectionStrategy,  Component,  Input,
} from '@angular/core';
import { ColorWrap } from '@dotos/dui/common/colorpicker/common';

@Component({
  selector: 'color-slider',
  template: `
  <div class="slider-picker {{ className }}">
    <div class="slider-hue">
      <color-hue
        [hsl]="hsl" [radius]="radius" [pointer]="pointer"
        (onChange)="handlePickerChange($event)"
      ></color-hue>
    </div>
    <div class="slider-swatches">
      <color-slider-swatches [hsl]="hsl"
        (onClick)="handlePickerChange($event)"
      ></color-slider-swatches>
    </div>
  </div>
  `,
  styles: [
    `
    .slider-hue {
      height: 12px;
      position: relative;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {hostID: 'dui-color-slider'+ Math.random().toString(36).substring(2, 15)},
})
/**
 * Compact hue slider with a row of preset color swatches beneath it.
 * @zh 紧凑型色相滑块，下方带一排预设色块。
 */
export class ColorSliderComponent extends ColorWrap {
  /** @zh 滑块手柄的内联样式。 */
  @Input()
  pointer: { [key: string]: string } = {
    width: '14px',
    height: '14px',
    borderRadius: '6px',
    transform: 'translate(-7px, -2px)',
    backgroundColor: 'rgb(248, 248, 248)',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
  };
  /** @zh 色相滑动条的圆角半径。 */
  @Input() radius = 2;

  constructor() {
    super();
  }

  /**
   * @hidden Forwards a child (hue slider or swatch) change to `handleChange`.
   * @zh 内部使用，将子级（色相滑块或色块）的变化转发给 `handleChange`。
   */
  handlePickerChange({ data, $event }) {
    this.handleChange(data, $event);
  }
}
