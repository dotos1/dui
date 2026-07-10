import {
  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  Output,
} from '@angular/core';
import { Shape } from '@dotos/dui/common/colorpicker/common';

@Component({
  selector: 'color-sketch-preset-colors',
  template: `
  <div class="sketch-swatches">
    <div class="sketch-wrap" *ngFor="let c of colors">
      <color-swatch
        [color]="normalizeValue(c).color"
        [style]="swatchStyle"
        [focusStyle]="focusStyle(c)"
        (onClick)="handleClick($event)"
        (onHover)="onSwatchHover.emit($event)"
        class="swatch"
      ></color-swatch>
    </div>
  </div>
  `,
  styles: [
    `
    .sketch-swatches {
      margin: 0px -10px;
      padding: 10px 0px 0px 10px;
      border-top: 1px solid rgb(238, 238, 238);
      display: flex;
      flex-wrap: wrap;
      position: relative;
    }
    .sketch-wrap {
      width: 16px;
      height: 16px;
      margin: 0px 10px 10px 0px;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    'hostID': 'sketch-preset-colors-' + Math.random().toString(36).substring(2, 15),
  },
})
/**
 * A row of preset color swatches shown beneath {@link SketchComponent}'s main controls.
 * @zh 显示在 {@link SketchComponent} 主控件下方的一排预设色块。
 */
export class SketchPresetColorsComponent {
  /** @zh 预设颜色列表，每项可以是颜色字符串或 `Shape` 对象。 */
  @Input() colors: any[] =[];
  /** @zh 色块被点击时发出。 */
  @Output() onClick = new EventEmitter<any>();
  /** @zh 鼠标悬停在色块上时发出。 */
  @Output() onSwatchHover = new EventEmitter<any>();
  /** @zh 每个色块的内联样式。 */
  swatchStyle = {
    borderRadius: '3px',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
  };

  /**
   * @hidden Emits `onClick` with the swatch's color.
   * @zh 内部使用，携带色块颜色发出 `onClick`。
   */
  handleClick({ hex, $event }) {
    this.onClick.emit({ hex, $event });
  }
  /**
   * Normalizes a preset color entry (string or `Shape` object) into a `Shape`-like object.
   * @zh 将预设颜色条目（字符串或 `Shape` 对象）归一化为类 `Shape` 对象。
   */
  normalizeValue(val: string | Shape) {
    if (typeof val === 'string') {
      return { color: val };
    }
    return val;
  }
  /**
   * Computes the focus-state box-shadow style for a given preset color entry.
   * @zh 计算给定预设颜色条目在聚焦状态下的阴影样式。
   */
  focusStyle(val: string | Shape) {
    const c = this.normalizeValue(val);
    return {
      boxShadow: `inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ${c.color}`,
    };
  }
}
