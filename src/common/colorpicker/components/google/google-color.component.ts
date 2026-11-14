/**
 * @fileoverview Module `src/common/colorpicker/components/google/google-color.component.ts` providing google color component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/google/google-color.component.ts`，提供google颜色组件相关的定义与实现。
 */

import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output,
} from '@angular/core';
import { getContrastingColor } from '@dotos/dui/common/colorpicker/common';

/**
 * Angular component `GoogColorComponent` (selector: 'goog-color') providing goog color component presentation and interaction in `src/common/colorpicker/components/google`.
 * @zh Angular 组件 `GoogColorComponent`（selector: 'goog-color'），提供Goog颜色组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/google`）。
 */
@Component({
  selector: 'goog-color',
  templateUrl: './google-color.component.html',
  styleUrls: ['./google-color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'goog-color-' + Math.random().toString(36).substring(2, 15) },
  standalone: false
})
/**
 * A single square color swatch used by {@link GoogColorPickerComponent}'s palette grid.
 * @zh {@link GoogColorPickerComponent} 调色板网格中使用的单个方形色块。
 */
export class GoogColorComponent implements OnChanges {
  /**
   * Input property `color` (`string`) configuring color.
   * @zh 该色块代表的颜色值。
   * @zh 该色块代表的颜色值。
   */
  @Input() color: string;
  /**
   * Input property `active` (`boolean`) configuring active.
   * @zh 该色块当前是否为选中状态。
   * @zh 该色块当前是否为选中状态。
   */
  @Input() active: boolean;
  /**
   * Output event emitter `onClick` (`EventEmitter<any>`) firing when on click occurs.
   * @zh 色块被点击时发出。
   * @zh 色块被点击时发出。
   */
  @Output() onClick = new EventEmitter();
  /**
   * Output event emitter `onSwatchHover` (`EventEmitter<any>`) firing when on swatch hover occurs.
   * @zh 鼠标悬停在色块上时发出。
   * @zh 鼠标悬停在色块上时发出。
   */
  @Output() onSwatchHover = new EventEmitter();
  /**
   * Property `swatchStyle` (`{ [key: string]: string; }`) storing swatch style.
   * @zh 色块的基础内联样式。
   * @zh 色块的基础内联样式。
   */
  swatchStyle: { [key: string]: string } = {
    width: '15px',
    height: '15px',
    float: 'left',
    marginRight: '5px',
    marginBottom: '5px',
    position: 'relative',
    cursor: 'pointer',
  };
  /**
   * Property `swatchFocus` (`{ [key: string]: string; }`) storing swatch focus (default: `{}`).
   * @zh 聚焦时叠加的内联样式。
   * @zh 聚焦时叠加的内联样式。
   */
  swatchFocus: { [key: string]: string } = {};
  /**
   * Property `getContrastingColor` (`(data: any) => "#fff" | "rgba(0,0,0,0.4)" | "#000"`) storing get contrasting color (default: `getContrastingColor`).
   * @zh 根据背景色计算对比色的工具函数。
   * @zh 根据背景色计算对比色的工具函数。
   */
  getContrastingColor = getContrastingColor;

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
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
