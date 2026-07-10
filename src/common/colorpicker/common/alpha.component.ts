import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  Output,
} from '@angular/core';

import { CheckboardModule } from './checkboard.component';
import { CoordinatesModule } from './coordinates.directive';
import { HSLA, RGBA } from './helpers/color.interfaces';


@Component({
  selector: 'color-alpha',
  template: `
  <div class="alpha" [style.border-radius]="radius">
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
  
})
/**
 * Alpha (opacity) channel slider used by the `color-*` picker style variants.
 * @zh `color-*` 颜色选择器样式变体使用的透明度（alpha）通道滑块。
 */
export class AlphaComponent implements OnChanges {
  /** @zh 当前颜色的 HSL 表示。 */
  @Input() hsl: HSLA;
  /** @zh 当前颜色的 RGB 表示。 */
  @Input() rgb: RGBA;
  /** @zh 滑块手柄的内联样式。 */
  @Input() pointer: { [key: string]: string };
  /** @zh 滑动条的阴影样式。 */
  @Input() shadow: string;
  /** @zh 滑动条的圆角半径。 */
  @Input() radius: string|number;
  /** @zh 滑动条方向：水平或垂直。 */
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  /** @zh alpha 值变化时发出。 */
  @Output() onChange = new EventEmitter();
  /** @zh 根据当前颜色计算出的渐变背景样式。 */
  gradient: { [key: string]: string };
  /** @zh 滑块手柄的水平位置百分比。 */
  pointerLeft: number;
  /** @zh 滑块手柄的垂直位置百分比。 */
  pointerTop: number;

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

@NgModule({
  declarations: [AlphaComponent],
  exports: [AlphaComponent],
  imports: [CommonModule, CheckboardModule, CoordinatesModule],
})
export class AlphaModule {}
