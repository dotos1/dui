import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output,
} from '@angular/core';
import { getContrastingColor } from '@dotos/dui/common/colorpicker/common';

@Component({
  selector: 'color-compact-color',
  template: `
  <div class="compact-color">
    <color-swatch class="swatch"
      [color]="color" [style]="swatchStyle"
      [focusStyle]="swatchFocus"
      (onClick)="handleClick($event)" (onHover)="onSwatchHover.emit($event)"
      >
      <div class="compact-dot"
        [class.active]="active" [style.background]="getContrastingColor(color)"
      ></div>
    </color-swatch>
  </div>
  `,
  styles: [
    `
  .compact-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    border-radius: 50%;
    opacity: 0;
  }
  .compact-dot.active {
    opacity: 1;
  }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  
})
/**
 * A single square color swatch (with an active-state dot indicator) used by
 * {@link CompactComponent}'s palette grid.
 * @zh {@link CompactComponent} 调色板网格中使用的单个方形色块（带激活状态圆点指示器）。
 */
export class CompactColorComponent implements OnChanges {
  /** @zh 该色块代表的颜色值。 */
  @Input() color: string;
  /** @zh 该色块当前是否为选中状态。 */
  @Input() active: boolean;
  /** @zh 色块被点击时发出。 */
  @Output() onClick = new EventEmitter<any>();
  /** @zh 鼠标悬停在色块上时发出。 */
  @Output() onSwatchHover = new EventEmitter<any>();
  /** @zh 色块的基础内联样式。 */
  swatchStyle: { [key: string]: string } = {
    width: '15px',
    height: '15px',
    float: 'left',
    marginRight: '5px',
    marginBottom: '5px',
    position: 'relative',
    cursor: 'pointer',
  };
  /** @zh 聚焦时叠加的内联样式。 */
  swatchFocus: { [key: string]: string } = {};
  /** @zh 根据背景色计算出对比色（用于激活状态指示点），来自 `getContrastingColor` 工具函数。 */
  getContrastingColor = getContrastingColor;

  ngOnChanges() {
    this.swatchStyle['background'] = this.color;
    this.swatchFocus['boxShadow'] = `0 0 4px ${this.color}`;
    if (this.color.toLowerCase() === '#ffffff') {
      this.swatchStyle['boxShadow'] = 'inset 0 0 0 1px #ddd';
    }
  }
  /**
   * @hidden Emits `onClick` with the swatch's color.
   * @zh 内部使用，携带色块颜色发出 `onClick`。
   */
  handleClick({ hex, $event }) {
    this.onClick.emit({ hex, $event });
  }
}
