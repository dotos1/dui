/**
 * @fileoverview Module `src/common/colorpicker/common/alpha.component.ts` providing alpha component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/alpha.component.ts`，提供透明度组件相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  Output,
} from '@angular/core';

import { CheckboardModule } from './checkboard.component';
import { CoordinatesModule } from './coordinates.directive';
import { HSLA, RGBA } from './helpers/color.interfaces';


/**
 * Angular component `AlphaComponent` (selector: 'color-alpha') providing alpha component presentation and interaction in `src/common/colorpicker/common`.
 * @zh Angular 组件 `AlphaComponent`（selector: 'color-alpha'），提供透明度组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/common`）。
 */
@Component({
  selector: 'color-alpha',
  template: `
  <div class="alpha ltr-canvas" [style.border-radius]="radius">
    <div class="alpha-checkboard">
      <color-checkboard></color-checkboard>
    </div>
    <div class="alpha-gradient" [ngStyle]="gradient" [style.box-shadow]="shadow" [style.border-radius]="radius"></div>
    <div ngx-color-coordinates (coordinatesChange)="handleChange($event)" class="alpha-container color-alpha-{{direction}}">
      <div class="alpha-pointer" [style.left.%]="pointerLeft" [style.top.%]="pointerTop">
        <div class="alpha-slider" [ngStyle]="pointer"></div>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./alpha.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,
  
})
/**
 * Alpha (opacity) channel slider used by the `color-*` picker style variants.
 * @zh `color-*` 颜色选择器样式变体使用的透明度（alpha）通道滑块。
 */
export class AlphaComponent implements OnChanges {
  /**
   * @zh 当前颜色的 HSL 表示。
   * @zh 当前颜色的 HSL 表示。
   */
  @Input() hsl: HSLA;
  /**
   * @zh 当前颜色的 RGB 表示。
   * @zh 当前颜色的 RGB 表示。
   */
  @Input() rgb: RGBA;
  /**
   * Input property `pointer` (`{ [key: string]: string; }`) configuring pointer.
   * @zh 滑块手柄的内联样式。
   * @zh 滑块手柄的内联样式。
   */
  @Input() pointer: { [key: string]: string };
  /**
   * Input property `shadow` (`string`) configuring shadow.
   * @zh 滑动条的阴影样式。
   * @zh 滑动条的阴影样式。
   */
  @Input() shadow: string;
  /**
   * Input property `radius` (`string | number`) configuring radius.
   * @zh 滑动条的圆角半径。
   * @zh 滑动条的圆角半径。
   */
  @Input() radius: string|number;
  /**
   * Input property `direction` (`"horizontal" | "vertical"`) configuring direction (default: `'horizontal'`).
   * @zh 滑动条方向：水平或垂直。
   * @zh 滑动条方向：水平或垂直。
   */
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  /**
   * @zh alpha 值变化时发出。
   * @zh alpha 值变化时发出。
   */
  @Output() onChange = new EventEmitter();
  /**
   * Property `gradient` (`{ [key: string]: string; }`) storing gradient.
   * @zh 根据当前颜色计算出的渐变背景样式。
   * @zh 根据当前颜色计算出的渐变背景样式。
   */
  gradient: { [key: string]: string };
  /**
   * Property `pointerLeft` (`number`) storing pointer left.
   * @zh 滑块手柄的水平位置百分比。
   * @zh 滑块手柄的水平位置百分比。
   */
  pointerLeft: number;
  /**
   * Property `pointerTop` (`number`) storing pointer top.
   * @zh 滑块手柄的垂直位置百分比。
   * @zh 滑块手柄的垂直位置百分比。
   */
  pointerTop: number;

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    if (this.direction === 'vertical') {
      this.pointerLeft = 0;
      this.pointerTop = this.rgb.a * 100;
      this.gradient = {
        background: `linear-gradient(to bottom, rgba(${this.rgb.r},${
          this.rgb.g
        },${this.rgb.b}, 0) 0%,
          rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b}, 1) 100%)`,
      };
    } else {
      this.gradient = {
        background: `linear-gradient(to right, rgba(${this.rgb.r},${
          this.rgb.g
        },${this.rgb.b}, 0) 0%,
          rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b}, 1) 100%)`,
      };
      this.pointerLeft = this.rgb.a * 100;
    }
  }
  /**
   * Computes the new alpha value from a drag/click position and emits `onChange`.
   * @zh 根据拖拽/点击位置计算新的透明度值并发出 `onChange`。
   */
  handleChange({ top, left, containerHeight, containerWidth, $event }) {
    let data;
    if (this.direction === 'vertical') {
      let a: number;
      if (top < 0) {
        a = 0;
      } else if (top > containerHeight) {
        a = 1;
      } else {
        a = Math.round(top * 100 / containerHeight) / 100;
      }

      if (this.hsl.a !== a) {
        data = {
          h: this.hsl.h,
          s: this.hsl.s,
          l: this.hsl.l,
          a,
          source: 'rgb',
        };
      }
    } else {
      let a: number;
      if (left < 0) {
        a = 0;
      } else if (left > containerWidth) {
        a = 1;
      } else {
        a = Math.round(left * 100 / containerWidth) / 100;
      }

      if (this.hsl.a !== a) {
        data = {
          h: this.hsl.h,
          s: this.hsl.s,
          l: this.hsl.l,
          a,
          source: 'rgb',
        };
      }
    }

    if (!data) {
      return null;
    }

    this.onChange.emit({ data, $event });
  }
}

/**
 * Angular module `AlphaModule` declaring and exporting alpha module components, directives, pipes, and providers.
 * @zh Angular 模块 `AlphaModule`，声明并导出透明度模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [AlphaComponent],
  exports: [AlphaComponent],
  imports: [CommonModule, CheckboardModule, CoordinatesModule],
})
export class AlphaModule {}
