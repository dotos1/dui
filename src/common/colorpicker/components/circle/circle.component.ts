/**
 * @fileoverview Module `src/common/colorpicker/components/circle/circle.component.ts` providing circle component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/circle/circle.component.ts`，提供圆形组件相关的定义与实现。
 */

import {  ChangeDetectionStrategy,  Component,  Input,} from '@angular/core';
import { MatColors } from '@dotos/dui/core/color';

/**
 * Constant/variable `amber` defining amber in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `amber`，定义 `src/common/colorpicker/components/circle` 中的amber。
 */
export const amber = MatColors.getColorName('amber');
/**
 * Constant/variable `blue` defining blue in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `blue`，定义 `src/common/colorpicker/components/circle` 中的blue。
 */
export const blue = MatColors.getColorName('blue');
/**
 * Constant/variable `blueGrey` defining blue grey in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `blueGrey`，定义 `src/common/colorpicker/components/circle` 中的blueGrey。
 */
export const blueGrey = MatColors.getColorName('blue-grey');
/**
 * Constant/variable `brown` defining brown in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `brown`，定义 `src/common/colorpicker/components/circle` 中的brown。
 */
export const brown = MatColors.getColorName('brown');
/**
 * Constant/variable `cyan` defining cyan in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `cyan`，定义 `src/common/colorpicker/components/circle` 中的cyan。
 */
export const cyan = MatColors.getColorName('cyan');
/**
 * Constant/variable `deepOrange` defining deep orange in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `deepOrange`，定义 `src/common/colorpicker/components/circle` 中的deepOrange。
 */
export const deepOrange = MatColors.getColorName('deep-orange');
/**
 * Constant/variable `deepPurple` defining deep purple in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `deepPurple`，定义 `src/common/colorpicker/components/circle` 中的deepPurple。
 */
export const deepPurple = MatColors.getColorName('deep-purple');
/**
 * Constant/variable `green` defining green in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `green`，定义 `src/common/colorpicker/components/circle` 中的green。
 */
export const green = MatColors.getColorName('green');
/**
 * Constant/variable `indigo` defining indigo in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `indigo`，定义 `src/common/colorpicker/components/circle` 中的indigo。
 */
export const indigo = MatColors.getColorName('indigo');
/**
 * Constant/variable `lightBlue` defining light blue in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `lightBlue`，定义 `src/common/colorpicker/components/circle` 中的浅色Blue。
 */
export const lightBlue = MatColors.getColorName('light-blue');
/**
 * Constant/variable `lightGreen` defining light green in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `lightGreen`，定义 `src/common/colorpicker/components/circle` 中的浅色Green。
 */
export const lightGreen = MatColors.getColorName('light-green');
/**
 * Constant/variable `lime` defining lime in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `lime`，定义 `src/common/colorpicker/components/circle` 中的lime。
 */
export const lime = MatColors.getColorName('lime');
/**
 * Constant/variable `orange` defining orange in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `orange`，定义 `src/common/colorpicker/components/circle` 中的orange。
 */
export const orange = MatColors.getColorName('orange');
/**
 * Constant/variable `pink` defining pink in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `pink`，定义 `src/common/colorpicker/components/circle` 中的pink。
 */
export const pink = MatColors.getColorName('pink');
/**
 * Constant/variable `purple` defining purple in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `purple`，定义 `src/common/colorpicker/components/circle` 中的purple。
 */
export const purple = MatColors.getColorName('purple');
/**
 * Constant/variable `red` defining red in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `red`，定义 `src/common/colorpicker/components/circle` 中的red。
 */
export const red = MatColors.getColorName('red');
/**
 * Constant/variable `teal` defining teal in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `teal`，定义 `src/common/colorpicker/components/circle` 中的teal。
 */
export const teal = MatColors.getColorName('teal');
/**
 * Constant/variable `yellow` defining yellow in `src/common/colorpicker/components/circle`.
 * @zh 常量/变量 `yellow`，定义 `src/common/colorpicker/components/circle` 中的yellow。
 */
export const yellow = MatColors.getColorName('yellow');

import { ColorWrap, isValidHex } from '@dotos/dui/common/colorpicker/common';
import { TriggerPopup } from '@dotos/dui/common/trigger';

/**
 * Color picker rendered as a grid of round color swatches, with no fine-grained
 * saturation/hue controls — pick from a fixed palette.
 * @zh 以圆形色块网格形式渲染的颜色选择器，不提供细粒度的饱和度/色相控件——
 * 仅可从固定调色板中选取。
 */
@Component({
  selector: 'color-circle',
  template: `
    <div
      class="circle-picker {{ className }}"
      [style.width.px]="width"
      [style.margin-right.px]="-circleSpacing"
      [style.margin-bottom.px]="-circleSpacing"
    >
      <color-circle-swatch
        *ngFor="let color of colors"
        [circleSize]="circleSize"
        [circleSpacing]="circleSpacing"
        [color]="color"
        [focus]="isActive(color)"
        (onClick)="handleBlockChange($event)"
        (onSwatchHover)="onSwatchHover.emit($event)"
      ></color-circle-swatch>
    </div>
  `,
  styles: [
    `
      .circle-picker {
        display: flex;
        flex-wrap: wrap;
      }
    `,
  ],
  host: {
    '(keydown)': '_handleKeydown($event)',
    hostId: 'circle-picker-' + Math.random().toString(36).substring(2, 15)
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,

})
export class CircleComponent extends ColorWrap implements TriggerPopup {
  /**
   * Pixel value for picker width
   * @zh 输入属性 `width`（类型：`string | number`），用于配置宽度（默认值：`252`）。
   */
  @Input() width: string | number = 252;
  /**
   * Color squares to display
   * @zh 输入属性 `colors`（类型：`string[]`），用于配置颜色列表。
   */
  @Input()
  colors: string[] = [
    red['500'],
    pink['500'],
    purple['500'],
    deepPurple['500'],
    indigo['500'],
    blue['500'],
    lightBlue['500'],
    cyan['500'],
    teal['500'],
    green['500'],
    lightGreen['500'],
    lime['500'],
    yellow['500'],
    amber['500'],
    orange['500'],
    deepOrange['500'],
    brown['500'],
    blueGrey['500'],
  ];
  /**
   * Value for circle size
   * @zh 输入属性 `circleSize`（类型：`number`），用于配置圆形尺寸（默认值：`28`）。
   */
  @Input() circleSize = 28;
  /**
   * Value for spacing between circles
   * @zh 输入属性 `circleSpacing`（类型：`number`），用于配置圆形间距（默认值：`14`）。
   */
  @Input() circleSpacing = 14;

  /**
   * Creates an instance of `CircleComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CircleComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    super();
  }
  /**
   * Whether the given color is the currently selected one.
   * @zh 判断给定颜色是否为当前选中颜色。
   */
  isActive(color) {
    return this.hex === color;
  }
  /**
   * @hidden Applies a swatch click as the new color, if it's a valid hex.
   * @zh 内部使用，若色块点击的颜色是有效的十六进制值，则应用为新颜色。
   */
  handleBlockChange({ hex, $event }) {
    if (isValidHex(hex)) {
      this.handleChange({ hex, source: 'hex' }, $event);
    }
  }
  /**
   * @hidden Forwards a child component's change to `handleChange`.
   * @zh 内部使用，将子组件的变化转发给 `handleChange`。
   */
  handleValueChange({ data, $event }) {
    this.handleChange(data, $event);
  }

}
