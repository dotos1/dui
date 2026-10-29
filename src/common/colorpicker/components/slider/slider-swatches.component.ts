/**
 * @fileoverview Module `src/common/colorpicker/components/slider/slider-swatches.component.ts` providing slider swatches component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/slider/slider-swatches.component.ts`，提供滑块swatches组件相关的定义与实现。
 */

import {
  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  Output,
} from '@angular/core';
import { HSL } from '@dotos/dui/common/colorpicker/common';

/**
 * Angular component `SliderSwatchesComponent` (selector: 'color-slider-swatches') providing slider swatches component presentation and interaction in `src/common/colorpicker/components/slider`.
 * @zh Angular 组件 `SliderSwatchesComponent`（selector: 'color-slider-swatches'），提供滑块Swatches组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/slider`）。
 */
@Component({
  selector: 'color-slider-swatches',
  template: `
  <div class="slider-swatches">
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=".80"
        [active]="active(0.80, 0.50)"
        (onClick)="handleClick($event)"
        [first]=true
      ></color-slider-swatch>
    </div>
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=.65
        [active]="active(0.65, 0.50)"
        (onClick)="handleClick($event)"
      ></color-slider-swatch>
    </div>
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=.50
        [active]="active(0.50, 0.50)"
        (onClick)="handleClick($event)"
      ></color-slider-swatch>
    </div>
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=.35
        [active]="active(0.35, 0.50)"
        (onClick)="handleClick($event)"
      ></color-slider-swatch>
    </div>
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=.20
        [active]="active(0.20, 0.50)"
        (onClick)="handleClick($event)"
        [last]=true
      ></color-slider-swatch>
    </div>
  </div>
  `,
  styles: [`
    .slider-swatches {
      margin-top: 20px;
    }
    .slider-swatch-wrap {
      box-sizing: border-box;
      width: 20%;
      padding-right: 1px;
      float: left;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
    host: {
    'hostID': 'slider-swatches-' + Math.random().toString(36).substring(2, 15),
  },
})
/**
 * A row of five fixed lightness-preset swatches for the current hue, used by
 * {@link ColorSliderComponent}.
 * @zh {@link ColorSliderComponent} 使用的一排（5 个）当前色相下固定明度预设的色块。
 */
export class SliderSwatchesComponent {
  /**
   * @zh 当前颜色的 HSL 表示。
   * @zh 当前颜色的 HSL 表示。
   */
  @Input() hsl: HSL;
  /**
   * Output event emitter `onClick` (`EventEmitter<any>`) firing when on click occurs.
   * @zh 某个色块被点击时发出。
   * @zh 某个色块被点击时发出。
   */
  @Output() onClick = new EventEmitter();
  /**
   * Output event emitter `onSwatchHover` (`EventEmitter<any>`) firing when on swatch hover occurs.
   * @zh 鼠标悬停在某个色块上时发出。
   * @zh 鼠标悬停在某个色块上时发出。
   */
  @Output() onSwatchHover = new EventEmitter();
  /**
   * Property `swatchStyle` (`{ [key: string]: string; }`) storing swatch style.
   * @zh 色块的内联样式。
   * @zh 色块的内联样式。
   */
  swatchStyle: { [key: string]: string };

  /**
   * Whether the given lightness/saturation combination matches the current color.
   * @zh 判断给定的明度/饱和度组合是否与当前颜色匹配。
   */
  active(l: number, s: number) {
    return (
      Math.round(this.hsl.l * 100) / 100 === l &&
      Math.round(this.hsl.s * 100) / 100 === s
    );
  }
  /**
   * @hidden Forwards a child swatch's click as `onClick`.
   * @zh 内部使用，转发子级色块的点击事件为 `onClick`。
   */
  handleClick({ data, $event }) {
    this.onClick.emit({ data, $event });
  }
}
