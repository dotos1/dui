/**
 * @fileoverview Module `src/common/colorpicker/common/saturation.component.ts` providing saturation component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/saturation.component.ts`，提供饱和度组件相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  Output,
} from '@angular/core';
import { CoordinatesModule } from './coordinates.directive';
import { HSLA, HSVA, HSVAsource } from './helpers/color.interfaces';

/**
 * Angular component `SaturationComponent` (selector: 'color-saturation') providing saturation component presentation and interaction in `src/common/colorpicker/common`.
 * @zh Angular 组件 `SaturationComponent`（selector: 'color-saturation'），提供饱和度组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/common`）。
 */
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
  /**
   * @zh 当前颜色的 HSL 表示。
   * @zh 当前颜色的 HSL 表示。
   */
  @Input() hsl: HSLA;
  /**
   * @zh 当前颜色的 HSV 表示。
   * @zh 当前颜色的 HSV 表示。
   */
  @Input() hsv: HSVA;
  /**
   * Input property `radius` (`number`) configuring radius.
   * @zh 面板的圆角半径。
   * @zh 面板的圆角半径。
   */
  @Input() radius: number;
  /**
   * Input property `pointer` (`{ [key: string]: string }`) configuring pointer.
   * @zh 指示器手柄的内联样式。
   * @zh 指示器手柄的内联样式。
   */
  @Input() pointer: { [key: string]: string };
  /**
   * Input property `circle` (`{ [key: string]: string }`) configuring circle.
   * @zh 指示器圆点的内联样式。
   * @zh 指示器圆点的内联样式。
   */
  @Input() circle: { [key: string]: string };
  /**
   * Output event emitter `onChange` (`EventEmitter`) firing when on change occurs.
   * @zh 饱和度/明度变化时发出。
   * @zh 饱和度/明度变化时发出。
   */
  @Output() onChange = new EventEmitter<{ data: HSVAsource; $event: Event }>();
  /**
   * Property `background` (`string`) storing background.
   * @zh 根据当前色相计算出的面板背景色。
   * @zh 根据当前色相计算出的面板背景色。
   */
  background: string;
  /**
   * Property `pointerTop` (`string`) storing pointer top.
   * @zh 指示器的垂直位置百分比。
   * @zh 指示器的垂直位置百分比。
   */
  pointerTop: string;
  /**
   * Property `pointerLeft` (`string`) storing pointer left.
   * @zh 指示器的水平位置百分比。
   * @zh 指示器的水平位置百分比。
   */
  pointerLeft: string;

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
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

/**
 * Angular module `SaturationModule` declaring and exporting saturation module components, directives, pipes, and providers.
 * @zh Angular 模块 `SaturationModule`，声明并导出饱和度模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [SaturationComponent],
  exports: [SaturationComponent],
  imports: [CommonModule, CoordinatesModule],
})
export class SaturationModule { }
