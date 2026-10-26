/**
 * @fileoverview Module `src/form/checkboxgroup/checkboxgroup.exp.ts` providing checkboxgroup exp definitions and implementation.
 * @zh 模块文件 `src/form/checkboxgroup/checkboxgroup.exp.ts`，提供checkboxgroupexp相关的定义与实现。
 */


import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    AfterContentInit, ChangeDetectorRef, ContentChildren, Directive,
    EventEmitter, Input, Output, QueryList,
    forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslateService } from '@dotos/dui/translator';
import {indexOf}  from 'lodash-es';
import { MatField } from '../base/mat.field';



/**
 * Constant/variable `nextUniqueId` defining next unique id in `src/form/checkboxgroup`.
 * @zh 常量/变量 `nextUniqueId`，定义 `src/form/checkboxgroup` 中的下一个唯一唯一标识。
 */
let nextUniqueId = 0;


/**
 * Constant/variable `MAT_CHECK_GROUP_CONTROL_VALUE_ACCESSOR` defining mat check group control value accessor in `src/form/checkboxgroup`.
 * @zh 常量/变量 `MAT_CHECK_GROUP_CONTROL_VALUE_ACCESSOR`，定义 `src/form/checkboxgroup` 中的Material检查分组表单控件值访问器。
 */
export const MAT_CHECK_GROUP_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatCheckGroup),
  multi: true
};

/**
 * Change event object emitted by MatRadio and MatRadioGroup.
 * @zh 类 `MatCheckChange`，封装 `src/form/checkboxgroup` 中的Material检查变更数据结构与处理逻辑。
 */
export class MatCheckChange {

  /**
   * Property `source` (`Array<MatCheckbox> | null`) storing source.
   * @zh 属性 `source`（类型：`Array<MatCheckbox> | null`），用于存储或配置源。
   */
  source: Array<MatCheckbox> | null;

  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  value;
}

// Boilerplate for applying mixins to MatRadioGroup.
/**
 * @docs-private
 * @zh 类 `MatCheckGroupBase`，封装 `src/form/checkboxgroup` 中的Material检查分组基础数据结构与处理逻辑。
 */
export class MatCheckGroupBase { }
/**
 * Constant/variable `_MatCheckGroupMixinBase` defining mat check group mixin base in `src/form/checkboxgroup`.
 * @zh 常量/变量 `_MatCheckGroupMixinBase`，定义 `src/form/checkboxgroup` 中的Material检查分组Mixin基础。
 */
export const _MatCheckGroupMixinBase = mixinDisabled(MatCheckGroupBase);

/**
 * A group of radio buttons. May contain one or more `<mat-radio-button>` elements.

 * @zh Angular 指令 `MatCheckGroup`（selector: 'mat-check-group'），为宿主 DOM 元素附加Material检查分组行为。
 */
@Directive({
  selector: 'mat-check-group',
  providers: [MAT_CHECK_GROUP_CONTROL_VALUE_ACCESSOR],
  host: {
    'role': 'checkgroup',
    'class': 'mat-check-group',
    
  },
  inputs: ['disabled'],

})
export class MatCheckGroup extends MatField implements AfterContentInit, ControlValueAccessor, CanDisable {
  /**
   * Selected value for group. Should equal the value of the selected radio button if there *is*
   * a corresponding radio button with a matching value. If there is *not* such a corresponding
   * radio button, this value persists to be applied in case a new radio button is added with a
   * matching value.

   * @zh 属性 `_value`（类型：`Array<string>`），用于存储或配置值（默认值：`null`）。
   */
  private _value: Array<string> = null;

  /**
   * The HTML name attribute applied to radio buttons in this group.
   * @zh 属性 `_name`（类型：`string`），用于存储或配置名称（默认值：`'mat-check-group-${nextUniqueId++}'`）。
   */
  private _name: string = `mat-check-group-${nextUniqueId++}`;

  /**
   * The currently selected radio button. Should match value.
   * @zh 属性 `_selected`（类型：`Array<MatCheckbox> | null`），用于存储或配置已选中（默认值：`null`）。
   */
  private _selected: Array<MatCheckbox> | null = null;

  /**
   * Whether the `value` has been set to its initial value.
   * @zh 属性 `_isInitialized`（类型：`boolean`），用于存储或配置是否为已初始化（默认值：`false`）。
   */
  private _isInitialized: boolean = false;

  /**
   * Whether the labels should appear after or before the radio-buttons. Defaults to 'after'
   * @zh 属性 `_labelPosition`（类型：`'before' | 'after'`），用于存储或配置标签位置（默认值：`'after'`）。
   */
  private _labelPosition: 'before' | 'after' = 'after';

  /**
   * Whether the radio group is disabled.
   * @zh 属性 `_disabled`（类型：`boolean`），用于存储或配置已禁用（默认值：`false`）。
   */
  private _disabled: boolean = false;

  /**
   * Whether the radio group is required.
   * @zh 属性 `_required`（类型：`boolean`），用于存储或配置必填（默认值：`false`）。
   */
  private _required: boolean = false;

  /**
   * The method to be called in order to update ngModel
   * @zh 属性 `_controlValueAccessorChangeFn`（类型：`(value: any) => void`），用于存储或配置表单控件值访问器变更函数（默认值：`() => { }`）。
   */
  _controlValueAccessorChangeFn: (value) => void = () => { };

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   * @docs-private

   * @zh 属性 `onTouched`（类型：`() => any`），用于存储或配置当是否已触碰（默认值：`() => { }`）。
   */
  onTouched: { () } = () => { };

  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a radio button (the same behavior as `<input type-"radio">`).

   * @zh 输出事件 `change`（类型：`EventEmitter<MatCheckChange>`），当触发变更时向外发出事件。
   */
  @Output() change: EventEmitter<MatCheckChange> = new EventEmitter<MatCheckChange>();

  /**
   * Child radio buttons.
   * @zh 模板/内容视图查询引用 `_checks`（`@ContentChildren`），指向检查。
   */
  @ContentChildren(forwardRef(() => MatCheckbox)) _checks: QueryList<MatCheckbox>;

  /**
   * Name of the radio button group. All radio buttons inside this group will use this name.
   * @zh 输入属性 `name`（类型：`string`）的读取器，返回当前名称。
   */
  @Input()
  override get name(): string { return this._name; }
  /**
   * Sets the name (`name`).
   * @zh 设置名称（`name`）。
   * @param value - New name value (`string`) / 新的名称值（`string`）
   */
  override set name(value: string) {
    this._name = value;
    this._updateCheckNames();
  }

  /**
   * Alignment of the radio-buttons relative to their labels. Can be 'before' or 'after'.
   * @deprecated

   * @zh 输入属性 `align`（类型：`'start' | 'end'`）的读取器，返回当前对齐。
   */
  @Input()
  get align(): 'start' | 'end' {
    return this.labelPosition === 'after' ? 'start' : 'end';
  }
  /**
   * Sets the align (`align`).
   * @zh 设置对齐（`align`）。
   * @param v - New align value (`any`) / 新的对齐值（`any`）
   */
  set align(v) {
    this.labelPosition = (v === 'start') ? 'after' : 'before';
  }


  /**
   * Whether the labels should appear after or before the radio-buttons. Defaults to 'after'
   * @zh 输入属性 `labelPosition`（类型：`any`）的读取器，返回当前标签位置。
   */
  @Input()
  get labelPosition() {
    return this._labelPosition;
  }
  /**
   * Sets the label position (`labelPosition`).
   * @zh 设置标签位置（`labelPosition`）。
   * @param v - New label position value (`any`) / 新的标签位置值（`any`）
   */
  set labelPosition(v) {
    this._labelPosition = (v === 'before') ? 'before' : 'after';
    this._markChecksForCheck();
  }

  /**
   * Value of the radio button.
   * @zh 输入属性 `value`（类型：`Array<string>`）的读取器，返回当前值。
   */
  @Input()
  override get value(): Array<string> { return this._value; }
  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param newValue - New value value (`Array<string>`) / 新的值值（`Array<string>`）
   */
  override set value(newValue: Array<string>) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._updateSelectedCheckFromValue();
      this._checkSelectedCheck();
    }
  }

  /**
   * Whether the radio group is disabled
   * @zh 输入属性 `disabled`（类型：`boolean`）的读取器，返回当前已禁用。
   */
  @Input()
  override get disabled(): boolean { return this._disabled; }
  /**
   * Sets the disabled (`disabled`).
   * @zh 设置已禁用（`disabled`）。
   * @param value - New disabled value (`any`) / 新的已禁用值（`any`）
   */
  override set disabled(value) {
    this._disabled =  coerceBooleanProperty (value);
    this._markChecksForCheck();
  }

  /**
   * Whether the radio group is required
   * @zh 输入属性 `required`（类型：`boolean`）的读取器，返回当前必填。
   */
  @Input()
  override get required(): boolean { return this._required; }
  /**
   * Sets the required (`required`).
   * @zh 设置必填（`required`）。
   * @param value - New required value (`boolean`) / 新的必填值（`boolean`）
   */
  override set required(value: boolean) {
    this._required =  coerceBooleanProperty (value);
    this._markChecksForCheck();
  }

  /**
   * Whether the radio button is selected.
   * @zh 输入属性 `selected`（类型：`any`）的读取器，返回当前已选中。
   */
  @Input()
  get selected() { return this._selected; }
  /**
   * Sets the selected (`selected`).
   * @zh 设置已选中（`selected`）。
   * @param selected - New selected value (`Array<MatCheckbox> | null`) / 新的已选中值（`Array<MatCheckbox> | null`）
   */
  set selected(selected: Array<MatCheckbox> | null) {
    this._selected = selected;
    if (selected) {
      this.value = [];
      this.selected.forEach(check => {
        this.value.push(check.value);
      });
    } else {
      this.value = null;
    }
    this._checkSelectedCheck();
  }

  /**
   * Creates an instance of `MatCheckGroup` and initializes its dependencies and internal state.
   * @zh 创建 `MatCheckGroup` 实例，并初始化其依赖项与内部状态。
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param _changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
   */
  constructor(protected override translate: TranslateService,
    private _changeDetector: ChangeDetectorRef) {
    super(translate);
  }
  /**
   * Initialize properties once content children are available.
   * This allows us to propagate relevant attributes to associated buttons.

   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this._isInitialized = true;
  }

  /**
   * Updates the `selected` radio button from the internal _value state.
   * @zh 执行 `_updateSelectedCheckFromValue`，用于更新已选中检查从值。
   */
  private _updateSelectedCheckFromValue(): void {
    // If the value already matches the selected radio, do nothing.
    const isAlreadySelected = this._selected != null && null == this._value;
    if (this._checks != null && !isAlreadySelected) {
      this._selected = [];
      this._checks.forEach(check => {
        check.checked = indexOf(this.value, check.value) >= 0;
        if (check.checked) {
          this._selected.push(check);
        }
      });
    }
  }

  /**
   * Executes `_checkSelectedCheck` to handle check selected check.
   * @zh 执行 `_checkSelectedCheck`，用于检查已选中检查。
   */
  _checkSelectedCheck() {
    if (this._selected) {
      this.selected.forEach(check => {
        if (!check.checked) {
          check.checked = true;
        }
      });
    }
  }

  /**
   * Dispatch change event with current selection and group value.
   * @zh 执行 `_emitChangeEvent`，用于发出变更事件。
   */
  _emitChangeEvent(): void {
    if (this._isInitialized) {
      const event = new MatCheckChange();
      event.source = this._selected;
      event.value = this._value;
      this.change.emit(event);
    }
  }

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.

   * @zh 执行 `_touch`，用于触摸。
   */
  _touch() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  /**
   * Executes `_updateCheckNames` to handle update check names.
   * @zh 执行 `_updateCheckNames`，用于更新检查名称列表。
   */
  private _updateCheckNames(): void {
    if (this._checks) {
      this._checks.forEach(check => {
        check.name = this.name;
      });
    }
  }

  /**
   * Executes `_markChecksForCheck` to handle mark checks for check.
   * @zh 执行 `_markChecksForCheck`，用于标记检查用于检查。
   */
  _markChecksForCheck() {
    if (this._checks) {
      this._checks.forEach(check => check._onLabelTextChange());
    }
  }

  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   * param value

   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   */
  writeValue(value) {
    this.value = value;
    this._changeDetector.markForCheck();
  }

  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   * param fn Callback to be registered.

   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   */
  registerOnChange(fn: (value) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a callback to be triggered when the control is touched.
   * Implemented as part of ControlValueAccessor.
   * param fn Callback to be registered.

   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   */
  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * param isDisabled Whether the control should be disabled.

   * @zh 当表单控件的禁用状态变更时启用或禁用界面控件（`ControlValueAccessor` 接口实现）。
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
}

/**
 * Type alias `Constructor` representing constructor (`new (...args: any[]) => T`).
 * @zh 类型别名 `Constructor`，表示Constructor（`new (...args: any[]) => T`）。
 */
export type Constructor<T> = new (...args) => T;

/**
 * @docs-private
 * @zh 接口 `CanDisable`，定义是否可以禁用的数据结构契约与属性规范。
 */
export interface CanDisable {
  /**
   * Property `disabled` (`boolean`) storing disabled.
   * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  disabled: boolean;
}

/**
 * Mixin to augment a directive with a `disabled` property.
 * @zh 执行 `mixinDisabled`，用于mixin已禁用。
 */
export function mixinDisabled<T extends Constructor<{}>>(base: T): Constructor<CanDisable> & T {
  return class extends base {
    private _disabled: boolean = false;

    get disabled() { return this._disabled; }
    set disabled(value) { this._disabled =  coerceBooleanProperty (value); }

    constructor(...args) { super(...args); }
  };
}
