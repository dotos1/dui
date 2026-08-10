import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  Output,
} from '@angular/core';
import { CoordinatesModule } from './coordinates.directive';
import { HSLA, HSVA, HSVAsource } from './helpers/color.interfaces';

@Component({
  selector: 'color-saturation',
  template: `
  <div class="color-saturation" ngx-color-coordinates (coordinatesChange)="handleChange($event)" [style.background]="background">
    <div class="saturation ltr-canvas-white">
      <div class="saturation-black"></div>
      <div class="saturation-pointer" [ngStyle]="pointer" [style.top]="pointerTop" [style.left]="pointerLeft">
        <div class="saturation-circle" [ngStyle]="circle"></div>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
    .saturation-white {
      background: linear-gradient(to right, #fff, rgba(255,255,255,0));
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .saturation-black {
      background: linear-gradient(to top, #000, rgba(0,0,0,0));
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .color-saturation {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .saturation-pointer {
      position: absolute;
      cursor: default;
    }
    .saturation-circle {
      width: 4px;
      height: 4px;
      box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4);
      border-radius: 50%;
      cursor: hand;
      transform: translate(-2px, -4px);
    }
  `,
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
/**
 * Saturation/brightness selection panel used by the `color-*` picker style variants.
 * @zh `color-*` 颜色选择器样式变体使用的饱和度/明度选择面板。
 */
export class SaturationComponent implements OnChanges {
  /** @zh 当前颜色的 HSL 表示。 */
  @Input() hsl: HSLA;
  /** @zh 当前颜色的 HSV 表示。 */
  @Input() hsv: HSVA;
  /** @zh 面板的圆角半径。 */
  @Input() radius: number;
  /** @zh 指示器手柄的内联样式。 */
  @Input() pointer: { [key: string]: string };
  /** @zh 指示器圆点的内联样式。 */
  @Input() circle: { [key: string]: string };
  /** @zh 饱和度/明度变化时发出。 */
  @Output() onChange = new EventEmitter<{ data: HSVAsource; $event: Event }>();
  /** @zh 根据当前色相计算出的面板背景色。 */
  background: string;
  /** @zh 指示器的垂直位置百分比。 */
  pointerTop: string;
  /** @zh 指示器的水平位置百分比。 */
  pointerLeft: string;

  ngOnChanges() {
    this.background = `hsl(${this.hsl.h}, 100%, 50%)`;
    this.pointerTop = -(this.hsv.v * 100) + 1 + 100 + '%';
    this.pointerLeft = this.hsv.s * 100 + '%';
  }
  /**
   * Computes the new saturation/brightness (HSV) from a drag/click position and emits `onChange`.
   * @zh 根据拖拽/点击位置计算新的饱和度/明度（HSV）值并发出 `onChange`。
   */
  handleChange({ top, left, containerHeight, containerWidth, $event }) {
    if (left < 0) {
      left = 0;
    } else if (left > containerWidth) {
      left = containerWidth;
    } else if (top < 0) {
      top = 0;
    } else if (top > containerHeight) {
      top = containerHeight;
    }

    const saturation = left / containerWidth;
    let bright = -(top / containerHeight) + 1;
    bright = bright > 0 ? bright : 0;
    bright = bright > 1 ? 1 : bright;

    const data: HSVAsource = {
      h: this.hsl.h,
      s: saturation,
      v: bright,
      a: this.hsl.a,
      source: 'hsva',
    };
    this.onChange.emit({ data, $event });
  }
}

@NgModule({
  declarations: [SaturationComponent],
  exports: [SaturationComponent],
  imports: [CommonModule, CoordinatesModule],
})
export class SaturationModule { }
