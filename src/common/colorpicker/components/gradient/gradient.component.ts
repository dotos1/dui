/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/gradient.component.ts` providing gradient component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/gradient.component.ts`，提供渐变组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContextService, PickerContextProps } from './hooks/context.service';

/**
 * Angular component `GradientComponent` (selector: 'color-gradient') providing gradient component presentation and interaction in `src/common/colorpicker/components/gradient`.
 * @zh Angular 组件 `GradientComponent`（selector: 'color-gradient'），提供渐变组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient`）。
 */
@Component({
  selector: 'color-gradient',
  templateUrl: './gradient.component.html',
  styleUrls: ['./gradient.component.scss'],
  host: {
    style: 'width:220px',
    '(keydown)': '_handleKeydown($event)',
   
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class GradientComponent {
  /**
   * Input property `hideControls` (`boolean`) configuring hide controls (default: `false`).
   * @zh 输入属性 `hideControls`（类型：`boolean`），用于配置隐藏控件集合（默认值：`false`）。
   */
  @Input() hideControls?: boolean = false;

  /**
   * Input property `hidePresets` (`boolean`) configuring hide presets (default: `false`).
   * @zh 输入属性 `hidePresets`（类型：`boolean`），用于配置隐藏Presets（默认值：`false`）。
   */
  @Input() hidePresets?: boolean = false;
  /**
   * Input property `hideOpacity` (`boolean`) configuring hide opacity (default: `false`).
   * @zh 输入属性 `hideOpacity`（类型：`boolean`），用于配置隐藏不透明度（默认值：`false`）。
   */
  @Input() hideOpacity?: boolean = false;
  /**
   * Input property `hideHue` (`boolean`) configuring hide hue (default: `false`).
   * @zh 输入属性 `hideHue`（类型：`boolean`），用于配置隐藏色相（默认值：`false`）。
   */
  @Input() hideHue?: boolean = false;
  /**
   * Input property `hideEyeDrop` (`boolean`) configuring hide eye drop (default: `false`).
   * @zh 输入属性 `hideEyeDrop`（类型：`boolean`），用于配置隐藏Eye放置（默认值：`false`）。
   */
  @Input() hideEyeDrop?: boolean = false;
  /**
   * Input property `hideColorTypeBtns` (`boolean`) configuring hide color type btns (default: `false`).
   * @zh 输入属性 `hideColorTypeBtns`（类型：`boolean`），用于配置隐藏颜色类型按钮（默认值：`false`）。
   */
  @Input() hideColorTypeBtns?: boolean = false;
  /**
   * Input property `hideGradientType` (`boolean`) configuring hide gradient type (default: `false`).
   * @zh 输入属性 `hideGradientType`（类型：`boolean`），用于配置隐藏渐变类型（默认值：`false`）。
   */
  @Input() hideGradientType?: boolean = false;
  /**
   * Input property `hideGradientAngle` (`boolean`) configuring hide gradient angle (default: `false`).
   * @zh 输入属性 `hideGradientAngle`（类型：`boolean`），用于配置隐藏渐变角度（默认值：`false`）。
   */
  @Input() hideGradientAngle?: boolean = false;
  /**
   * Input property `hideGradientStop` (`boolean`) configuring hide gradient stop (default: `false`).
   * @zh 输入属性 `hideGradientStop`（类型：`boolean`），用于配置隐藏渐变停止（默认值：`false`）。
   */
  @Input() hideGradientStop?: boolean = false;
  /**
   * Input property `hideGradientControls` (`boolean`) configuring hide gradient controls (default: `false`).
   * @zh 输入属性 `hideGradientControls`（类型：`boolean`），用于配置隐藏渐变控件集合（默认值：`false`）。
   */
  @Input() hideGradientControls?: boolean = false;

  /**
   * Input property `presets` (`string[]`) configuring presets (default: `[]`).
   * @zh 输入属性 `presets`（类型：`string[]`），用于配置presets（默认值：`[]`）。
   */
  @Input() presets?: string[] = [];

  /**
   * Property `conext` (`PickerContextProps`) storing conext.
   * @zh 属性 `conext`（类型：`PickerContextProps`），用于存储或配置conext。
   */
  public conext: PickerContextProps;

  /**
   * Creates an instance of `GradientComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GradientComponent` 实例，并初始化其依赖项与内部状态。
   * @param contextService - Injected or initial context service (`ContextService`) / 注入或传入的上下文服务（`ContextService`）
   */
  constructor(public contextService: ContextService) {
    this.conext = contextService.getContext();
  }
}
