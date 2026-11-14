/**
 * @fileoverview Module `src/form/toggle-select/toggle-select.component.ts` providing toggle select component definitions and implementation.
 * @zh 模块文件 `src/form/toggle-select/toggle-select.component.ts`，提供开关下拉选择组件相关的定义与实现。
 */


import { Component, forwardRef, HostBinding, Input } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _ToggleBase, ToggleHeaderAppearance } from './toggle-header.component';
import { coerceBoolean } from '@dotos/dui/core/decorators';


/**
 * Angular component `ToggleSelectComponent` (selector: 'toggle-select') providing toggle select component presentation and interaction in `src/form/toggle-select`.
 * @zh Angular 组件 `ToggleSelectComponent`（selector: 'toggle-select'），提供开关下拉选择组件的视图渲染与交互逻辑（位于 `src/form/toggle-select`）。
 */
@Component({
  selector: 'toggle-select',
  templateUrl: './toggle-select.component.html',
  styleUrls: ['./toggle-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSelectComponent),
      multi: true
    }
  ],
  standalone: false
})
export class ToggleSelectComponent extends _ToggleBase implements ControlValueAccessor {

  /**
   * Host-bound getter `maxWidth` (`string`) computing max width.
   * @zh 宿主绑定读取器 `maxWidth`（绑定至 `style.maxWidth`），计算并返回最大值宽度。
   */
  @HostBinding('style.maxWidth')
  get maxWidth() { return '100%'; }

  /**
   * Input property `disabled` (`boolean`) configuring disabled.
   * @zh 输入属性 `disabled`（类型：`boolean`），用于配置已禁用。
   */
  @Input()
  @coerceBoolean()
  disabled: boolean;

  /**
   * Input property `selectMediaBreakpoint` (`string`) configuring select media breakpoint.
   * @zh 输入属性 `selectMediaBreakpoint`（类型：`string`），用于配置下拉选择媒体Breakpoint。
   */
  @Input()
  selectMediaBreakpoint: string;

  /**
   * Input property `appearance` (`ToggleHeaderAppearance`) configuring appearance (default: `'stroked'`).
   * @zh 输入属性 `appearance`（类型：`ToggleHeaderAppearance`），用于配置appearance（默认值：`'stroked'`）。
   */
  @Input()
  appearance: ToggleHeaderAppearance = 'stroked';

  /**
   * Input property `disablePagination` (`boolean`) configuring disable pagination (default: `false`).
   * @zh 输入属性 `disablePagination`（类型：`boolean`），用于配置禁用分页（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  disablePagination = false;

  /**
   * Input property `fillHeight` (`boolean`) configuring fill height (default: `false`).
   * @zh 输入属性 `fillHeight`（类型：`boolean`），用于配置填充高度（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  fillHeight = false;

  /**
   * Input property `extraPadding` (`boolean`) configuring extra padding (default: `false`).
   * @zh 输入属性 `extraPadding`（类型：`boolean`），用于配置extra内边距（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  extraPadding = false;

  /**
   * Input property `primaryBackground` (`boolean`) configuring primary background (default: `false`).
   * @zh 输入属性 `primaryBackground`（类型：`boolean`），用于配置主色背景（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  primaryBackground = false;

  /**
   * Property `modelValue` (`any`) storing model value.
   * @zh 属性 `modelValue`（类型：`any`），用于存储或配置模型值。
   */
  modelValue;

  /**
   * Property `propagateChange` (`any`) storing propagate change (default: `null`).
   * @zh 属性 `propagateChange`（类型：`any`），用于存储或配置propagate变更（默认值：`null`）。
   */
  private propagateChange = null;

  /**
   * Creates an instance of `ToggleSelectComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ToggleSelectComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    super();
  }

  /**
   * Registers a callback function invoked when the control value changes in the UI (`ControlValueAccessor`).
   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  /**
   * Registers a callback function invoked when the control receives a blur/touched event (`ControlValueAccessor`).
   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  registerOnTouched(fn): void {
  }

  /**
   * Enables or disables the UI control when the form control disabled status changes (`ControlValueAccessor`).
   * @zh 当表单控件的禁用状态变更时启用或禁用界面控件（`ControlValueAccessor` 接口实现）。
   * @param isDisabled - is disabled parameter (`boolean`) / 是否为已禁用参数（`boolean`）
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Writes a new value from the Angular form model into the view (`ControlValueAccessor`).
   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  writeValue(value): void {
    this.modelValue = value;
  }

  /**
   * Executes `updateModel` to handle update model.
   * @zh 执行 `updateModel`，用于更新模型。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  updateModel(value) {
    this.modelValue = value;
    this.propagateChange(this.modelValue);
  }
}
