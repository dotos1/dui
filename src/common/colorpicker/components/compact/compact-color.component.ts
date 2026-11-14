/**
 * @fileoverview Module `src/common/colorpicker/components/compact/compact-color.component.ts` providing compact color component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/compact/compact-color.component.ts`，提供紧凑颜色组件相关的定义与实现。
 */

import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output,
} from '@angular/core';
import { getContrastingColor } from '@dotos/dui/common/colorpicker/common';

/**
 * Angular component `CompactColorComponent` (selector: 'color-compact-color') providing compact color component presentation and interaction in `src/common/colorpicker/components/compact`.
 * @zh Angular 组件 `CompactColorComponent`（selector: 'color-compact-color'），提供紧凑颜色组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/compact`）。
 */
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
  standalone: false,
  
})
/**
 * A single square color swatch (with an active-state dot indicator) used by
 * {@link CompactComponent}'s palette grid.
 * @zh {@link CompactComponent} 调色板网格中使用的单个方形色块（带激活状态圆点指示器）。
 */
export class CompactColorComponent implements OnChanges {
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
   * @zh 根据背景色计算出对比色（用于激活状态指示点），来自 `getContrastingColor` 工具函数。
   * @zh 根据背景色计算出对比色（用于激活状态指示点），来自 `getContrastingColor` 工具函数。
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
