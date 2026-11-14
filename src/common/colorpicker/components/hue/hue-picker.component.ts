/**
 * @fileoverview Module `src/common/colorpicker/components/hue/hue-picker.component.ts` providing hue picker component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/hue/hue-picker.component.ts`，提供色相选择器组件相关的定义与实现。
 */


import {  ChangeDetectionStrategy,  Component,  Input,  OnChanges,} from '@angular/core';
import { ColorWrap, toState } from '@dotos/dui/common/colorpicker/common';

/**
 * Angular component `HuePickerComponent` (selector: 'color-hue-picker') providing hue picker component presentation and interaction in `src/common/colorpicker/components/hue`.
 * @zh Angular 组件 `HuePickerComponent`（selector: 'color-hue-picker'），提供色相选择器组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/hue`）。
 */
@Component({
  selector: 'color-hue-picker',
  template: `
  <div class="hue-picker {{ className }}"
    [style.width.px]="width" [style.height.px]="height"
  >
    <color-hue [hsl]="hsl" [pointer]="pointer"
      [direction]="direction" [radius]="radius"
      (onChange)="handlePickerChange($event)"
    ></color-hue>
  </div>
  `,
  styles: [
    `
    .hue-picker {
      position: relative;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'hue-picker-' + Math.random().toString(36).substring(2, 15) },
  standalone: false
})
/**
 * Standalone hue slider picker.
 * @zh 独立使用的色相滑块选择器。
 */
export class HuePickerComponent extends ColorWrap implements OnChanges {
  /**
   * Pixel value for picker width
   * @zh 输入属性 `width`（类型：`string | number`），用于配置宽度（默认值：`316`）。
   */
  @Input() width: string | number = 316;
  /**
   * Pixel value for picker height
   * @zh 输入属性 `height`（类型：`string | number`），用于配置高度（默认值：`16`）。
   */
  @Input() height: string | number = 16;
  /**
   * Input property `radius` (`number`) configuring radius (default: `2`).
   * @zh 滑动条的圆角半径。
   * @zh 滑动条的圆角半径。
   */
  @Input() radius = 2;
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
    backgroundColor: 'rgb(248, 248, 248)',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
  };

  /**
   * Creates an instance of `HuePickerComponent` and initializes its dependencies and internal state.
   * @zh 创建 `HuePickerComponent` 实例，并初始化其依赖项与内部状态。
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
   * @hidden Forwards the child hue slider's change to `handleChange` (fixed saturation/lightness/alpha).
   * @zh 内部使用，将子级色相滑块的变化转发给 `handleChange`（固定饱和度/明度/透明度）。
   */
  handlePickerChange({ data, $event }) {
    this.handleChange({ a: 1, h: data.h, l: 0.5, s: 1 }, $event);
  }
}
