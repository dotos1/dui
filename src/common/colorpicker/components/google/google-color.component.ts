import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output,
} from '@angular/core';
import { getContrastingColor } from '@dotos/dui/common/colorpicker/common';

@Component({
  selector: 'goog-color',
  templateUrl: './google-color.component.html',
  styleUrls: ['./google-color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'goog-color-' + Math.random().toString(36).substring(2, 15) }
})
/**
 * A single square color swatch used by {@link GoogColorPickerComponent}'s palette grid.
 * @zh {@link GoogColorPickerComponent} 调色板网格中使用的单个方形色块。
 */
export class GoogColorComponent implements OnChanges {
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
  /** @zh 根据背景色计算对比色的工具函数。 */
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
