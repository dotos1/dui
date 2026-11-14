/**
 * @fileoverview Module `src/common/colorpicker/common/shade.component.ts` providing shade component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/shade.component.ts`，提供shade组件相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  Output,
} from '@angular/core';
import { CoordinatesModule } from './coordinates.directive';
import { HSLA, RGBA } from './helpers/color.interfaces';
import { TinyColor } from '@dotos/dui/core/color';

/**
 * Angular component `ShadeComponent` (selector: 'color-shade') providing shade component presentation and interaction in `src/common/colorpicker/common`.
 * @zh Angular 组件 `ShadeComponent`（selector: 'color-shade'），提供Shade组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/common`）。
 */
@Component({
  selector: 'color-shade',
  templateUrl: './shade.component.html',
  styleUrls: ['./shade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,
  
})
/**
 * Shade (brightness) slider used by some `color-*` picker style variants.
 * @zh 部分 `color-*` 颜色选择器样式变体使用的明暗（shade）滑块。
 */
export class ShadeComponent implements OnChanges {
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
   * Input property `radius` (`string`) configuring radius.
   * @zh 滑动条的圆角半径。
   * @zh 滑动条的圆角半径。
   */
  @Input() radius: string;
  /**
   * Output event emitter `onChange` (`EventEmitter<any>`) firing when on change occurs.
   * @zh 明暗值变化时发出。
   * @zh 明暗值变化时发出。
   */
  @Output() onChange = new EventEmitter();
  /**
   * Property `gradient` (`{ [key: string]: string; }`) storing gradient.
   * @zh 根据当前色相计算出的渐变背景样式。
   * @zh 根据当前色相计算出的渐变背景样式。
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
    this.gradient = {
      background: `linear-gradient(to right,
          hsl(${this.hsl.h}, 90%, 55%),
          #000)`,
    };
    const hsv = new TinyColor(this.hsl).toHsv();
    this.pointerLeft = 100 - (hsv.v * 100);
  }

  /**
   * Computes the new brightness (v) value from a drag/click position and emits `onChange`.
   * @zh 根据拖拽/点击位置计算新的明度（v）值并发出 `onChange`。
   */
  handleChange({ left, containerWidth, $event }) {
    let data;
    let v: number;
    if (left < 0) {
      v = 0;
    } else if (left > containerWidth) {
      v = 1;
    } else {
      v = Math.round((left * 100) / containerWidth) / 100;
    }

    const hsv = new TinyColor(this.hsl).toHsv();
    if (hsv.v !== v) {
      data = {
        h: this.hsl.h,
        s: 100,
        v: 1 - v,
        l: this.hsl.l,
        a: this.hsl.a,
        source: 'rgb',
      };
    }

    if (!data) {
      return null;
    }

    this.onChange.emit({ data, $event });
  }
}

/**
 * Angular module `ShadeModule` declaring and exporting shade module components, directives, pipes, and providers.
 * @zh Angular 模块 `ShadeModule`，声明并导出Shade模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ShadeComponent],
  exports: [ShadeComponent],
  imports: [CommonModule, CoordinatesModule],
})
export class ShadeModule { }
