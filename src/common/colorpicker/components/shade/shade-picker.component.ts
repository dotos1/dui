/**
 * @fileoverview Module `src/common/colorpicker/components/shade/shade-picker.component.ts` providing shade picker component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/shade/shade-picker.component.ts`，提供shade选择器组件相关的定义与实现。
 */


import {  ChangeDetectionStrategy,  Component,  Input,  OnChanges,
} from '@angular/core';
import { ColorWrap, toState } from '@dotos/dui/common/colorpicker/common';

/**
 * Angular component `ShadeSliderComponent` (selector: 'color-shade-picker') providing shade slider component presentation and interaction in `src/common/colorpicker/components/shade`.
 * @zh Angular 组件 `ShadeSliderComponent`（selector: 'color-shade-picker'），提供Shade滑块组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/shade`）。
 */
@Component({
  selector: 'color-shade-picker',
  template: `
    <div class="shade-slider {{ className || '' }}"
      [style.width.px]="width" [style.height.px]="height">
      <color-shade
        [hsl]="hsl"
        [rgb]="rgb"
        [pointer]="pointer"
        (onChange)="handlePickerChange($event)"
      ></color-shade>
    </div>
  `,
  styles: [
    `
    .shade-slider {
      position: relative;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'shade-picker-' + Math.random().toString(36).substring(2, 15) }
})
/**
 * Standalone shade (brightness) slider picker.
 * @zh 独立使用的明暗（shade）滑块选择器。
 */
export class ShadeSliderComponent extends ColorWrap implements OnChanges {
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
   * Property `pointer` (`{ [key: string]: string }`) storing pointer.
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
   * Creates an instance of `ShadeSliderComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ShadeSliderComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    super();
  }
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  override ngOnChanges() {
    this.setState(toState(this.color, this.oldHue));
  }
  /**
   * @hidden Forwards the child shade slider's change to `handleChange`.
   * @zh 内部使用，将子级明暗滑块的变化转发给 `handleChange`。
   */
  handlePickerChange({ data, $event }) {
    this.handleChange(data, $event);
  }
}
