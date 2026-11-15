/**
 * @fileoverview Module `src/common/colorpicker/components/slider/slider.component.ts` providing slider component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/slider/slider.component.ts`，提供滑块组件相关的定义与实现。
 */

import {
  ChangeDetectionStrategy,  Component,  Input,
} from '@angular/core';
import { ColorWrap } from '@dotos1/dui/common/colorpicker/common';

/**
 * Angular component `ColorSliderComponent` (selector: 'color-slider') providing color slider component presentation and interaction in `src/common/colorpicker/components/slider`.
 * @zh Angular 组件 `ColorSliderComponent`（selector: 'color-slider'），提供颜色滑块组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/slider`）。
 */
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
  standalone: false,
})
/**
 * Compact hue slider with a row of preset color swatches beneath it.
 * @zh 紧凑型色相滑块，下方带一排预设色块。
 */
export class ColorSliderComponent extends ColorWrap {
  /**
   * Input property `pointer` (`{ [key: string]: string; }`) configuring pointer.
   * @zh 滑块手柄的内联样式。
   * @zh 滑块手柄的内联样式。
   */
  @Input()
  pointer: { [key: string]: string } = {
    width: '14px',
    height: '14px',
    borderRadius: '6px',
    transform: 'translate(-7px, -2px)',
    backgroundColor: 'rgb(248, 248, 248)',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
  };
  /**
   * Input property `radius` (`number`) configuring radius (default: `2`).
   * @zh 色相滑动条的圆角半径。
   * @zh 色相滑动条的圆角半径。
   */
  @Input() radius = 2;

  /**
   * Creates an instance of `ColorSliderComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ColorSliderComponent` 实例，并初始化其依赖项与内部状态。
   */
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
