/**
 * @fileoverview Module `src/common/colorpicker/components/alpha/alpha-picker.component.ts` providing alpha picker component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/alpha/alpha-picker.component.ts`，提供透明度选择器组件相关的定义与实现。
 */

import {  ChangeDetectionStrategy,  Component,  Input,  OnChanges,} from '@angular/core';

import { ColorWrap, toState } from '@dotos/dui/common/colorpicker/common';

/**
 * Angular component `AlphaPickerComponent` (selector: 'color-alpha-picker') providing alpha picker component presentation and interaction in `src/common/colorpicker/components/alpha`.
 * @zh Angular 组件 `AlphaPickerComponent`（selector: 'color-alpha-picker'），提供透明度选择器组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/alpha`）。
 */
@Component({
  selector: 'color-alpha-picker',
  template: `
    <div class="alpha-picker {{ className }}"
      [style.width.px]="width" [style.height.px]="height">
      <color-alpha
        [hsl]="hsl"
        [rgb]="rgb"
        [pointer]="pointer"
        [direction]="direction"
        (onChange)="handlePickerChange($event)"
      ></color-alpha>
    </div>
  `,
  styles: [
    `
    .alpha-picker {
      position: relative;
    }
    .color-alpha {
      radius: 2px;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'alpha-picker-' + Math.random().toString(36).substring(2, 15) }
})
/**
 * Standalone alpha (opacity) slider picker.
 * @zh 独立使用的透明度（alpha）滑块选择器。
 */
export class AlphaPickerComponent extends ColorWrap implements OnChanges {

  /**
   * Input property `width` (`string | number`) configuring width (default: `316`).
   * @zh 选择器的宽度。
   * @zh 选择器的宽度。
   */
  @Input() width: string | number = 316;

  /**
   * Input property `height` (`string | number`) configuring height (default: `16`).
   * @zh 选择器的高度。
   * @zh 选择器的高度。
   */
  @Input() height: string | number = 16;

  /**
   * Input property `direction` (`"horizontal" | "vertical"`) configuring direction (default: `'horizontal'`).
   * @zh 滑动条方向：水平或垂直。
   * @zh 滑动条方向：水平或垂直。
   */
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  /**
   * Property `pointer` (`{ [key: string]: string; }`) storing pointer.
   * @zh 滑块手柄的内联样式。
   * @zh 滑块手柄的内联样式。
   */
  pointer: { [key: string]: string } = {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    transform: 'translate(-9px, -2px)',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
  };

  /**
   * Creates an instance of `AlphaPickerComponent` and initializes its dependencies and internal state.
   * @zh 创建 `AlphaPickerComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    super();
  }
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  override ngOnChanges() {
    if (this.direction === 'vertical') {
      this.pointer['transform'] = 'translate(-3px, -9px)';
    }
    this.setState(toState(this.color, this.oldHue));
  }
  /**
   * @hidden Forwards the child alpha slider's change to `handleChange`.
   * @zh 内部使用，将子级透明度滑块的变化转发给 `handleChange`。
   */
  handlePickerChange({ data, $event }) {
    this.handleChange(data, $event);
  }
}
