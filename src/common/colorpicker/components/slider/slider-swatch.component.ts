/**
 * @fileoverview Module `src/common/colorpicker/components/slider/slider-swatch.component.ts` providing slider swatch component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/slider/slider-swatch.component.ts`，提供滑块swatch组件相关的定义与实现。
 */

import {  
  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output,
} from '@angular/core';
import { HSL } from '@dotos/dui/core/color';

/**
 * Angular component `SliderSwatchComponent` (selector: 'color-slider-swatch') providing slider swatch component presentation and interaction in `src/common/colorpicker/components/slider`.
 * @zh Angular 组件 `SliderSwatchComponent`（selector: 'color-slider-swatch'），提供滑块Swatch组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/slider`）。
 */
@Component({
  selector: 'color-slider-swatch',
  template: `
  <div class="slider-swatch" [style.background]="background"
    [class.first]="first" [class.last]="last" [class.active]="active"
    (click)="handleClick($event)"
  ></div>
  `,
  styles: [
    `
    .slider-swatch {
      height: 12px;
      background: rgb(121, 211, 166);
      cursor: pointer;
    }
    .slider-swatch.active {
      transform: scaleY(1.8);
      border-top-right-radius: 3.6px 2px;
      border-top-left-radius: 3.6px 2px;
      border-bottom-right-radius: 3.6px 2px;
      border-bottom-left-radius: 3.6px 2px;
    }
    .slider-swatch.first {
      border-radius: 2px 0px 0px 2px;
    }
    .slider-swatch.last {
      border-radius: 0px 2px 2px 0px;
    }

  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
    host: {
    'hostID': 'slider-swatch-' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
/**
 * A single lightness-preset swatch used by {@link SliderSwatchesComponent}.
 * @zh {@link SliderSwatchesComponent} 使用的单个明度预设色块。
 */
export class SliderSwatchComponent implements OnChanges {
  /**
   * @zh 当前颜色的 HSL 表示（用于取色相 h）。
   * @zh 当前颜色的 HSL 表示（用于取色相 h）。
   */
  @Input() hsl: HSL;
  /**
   * Input property `active` (`boolean`) configuring active.
   * @zh 该色块当前是否为选中状态。
   * @zh 该色块当前是否为选中状态。
   */
  @Input() active: boolean;
  /**
   * @zh 该色块对应的明度（lightness）偏移量。
   * @zh 该色块对应的明度（lightness）偏移量。
   */
  @Input() offset: number;
  /**
   * Input property `first` (`boolean`) configuring first (default: `false`).
   * @zh 该色块是否为列表第一个（应用左侧圆角）。
   * @zh 该色块是否为列表第一个（应用左侧圆角）。
   */
  @Input() first = false;
  /**
   * Input property `last` (`boolean`) configuring last (default: `false`).
   * @zh 该色块是否为列表最后一个（应用右侧圆角）。
   * @zh 该色块是否为列表最后一个（应用右侧圆角）。
   */
  @Input() last = false;
  /**
   * Output event emitter `onClick` (`EventEmitter<any>`) firing when on click occurs.
   * @zh 色块被点击时发出。
   * @zh 色块被点击时发出。
   */
  @Output() onClick = new EventEmitter();
  /**
   * Property `background` (`string`) storing background.
   * @zh 根据当前色相和明度偏移计算出的背景色。
   * @zh 根据当前色相和明度偏移计算出的背景色。
   */
  background: string;

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    this.background = `hsl(${this.hsl.h}, 50%, ${this.offset * 100}%)`;
  }
  /**
   * @hidden Emits `onClick` with the resulting HSL color for this swatch's lightness.
   * @zh 内部使用，携带该色块明度对应的 HSL 颜色发出 `onClick`。
   */
  handleClick($event) {
    this.onClick.emit({
      data: {
        h: this.hsl.h,
        s: 0.5,
        l: this.offset,
        source: 'hsl',
      },
      $event,
    });
  }
}
