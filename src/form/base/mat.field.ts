/**
 * @fileoverview Module `src/form/base/mat.field.ts` providing mat field definitions and implementation.
 * @zh 模块文件 `src/form/base/mat.field.ts`，提供Material字段相关的定义与实现。
 */

import { AfterViewInit, Directive, OnDestroy, OnInit, TemplateRef, Type, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Dui } from '@dotos/dui/core';
import { FieldType as CoreFieldType, ExtErrorStateMatcher, FieldConfig } from '@dotos/dui/core/form';
import { TranslateService } from '@dotos/dui/translator';
import {isUndefined}  from 'lodash-es';
import { Subject } from 'rxjs';

/**
 * Angular directive `MatField` attaching mat field behavior to host DOM elements.
 * @zh Angular 指令 `MatField`，为宿主 DOM 元素附加Material字段行为。
 */
@Directive()
export abstract class MatField<F extends FieldConfig = FieldConfig> extends CoreFieldType<F> implements OnInit, AfterViewInit, OnDestroy, MatFormFieldControl<unknown>  {
  /**
   * Template/content query reference `matPrefix` (`@ViewChild`) targeting mat prefix.
   * @zh 模板/内容视图查询引用 `matPrefix`（`@ViewChild`），指向Material前缀。
   */
  @ViewChild('matPrefix', { static: true }) matPrefix!: TemplateRef<unknown>;
  /**
   * Template/content query reference `matSuffix` (`@ViewChild`) targeting mat suffix.
   * @zh 模板/内容视图查询引用 `matSuffix`（`@ViewChild`），指向Material后缀。
   */
  @ViewChild('matSuffix', { static: true }) matSuffix!: TemplateRef<unknown>;

  /**
   * Gets the current form field control (`formFieldControl: any`).
   * @zh 获取当前表单字段表单控件（`formFieldControl: any`）。
   */
  get formFieldControl() { return this._control || this; }
  /**
   * Sets the form field control (`formFieldControl`).
   * @zh 设置表单字段表单控件（`formFieldControl`）。
   * @param control - New form field control value (`MatFormFieldControl<any>`) / 新的表单字段表单控件值（`MatFormFieldControl<any>`）
   */
  set formFieldControl(control: MatFormFieldControl<unknown>) {
    this._control = control;
    if (this.formField && control !== this.formField._control) {
      this.formField._control = control;
    }
  }

  /**
   * Property `_control` (`MatFormFieldControl<any>`) storing control.
   * @zh 属性 `_control`（类型：`MatFormFieldControl<any>`），用于存储或配置表单控件。
   */
  private _control!: MatFormFieldControl<unknown>;
  /**
   * Property `errorStateMatcher` (`ExtErrorStateMatcher`) storing error state matcher (default: `new ExtErrorStateMatcher(this)`).
   * @zh 属性 `errorStateMatcher`（类型：`ExtErrorStateMatcher`），用于存储或配置错误状态匹配器（默认值：`new ExtErrorStateMatcher(this)`）。
   */
  errorStateMatcher = new ExtErrorStateMatcher(this);
  /**
   * Property `stateChanges` (`Subject`) storing state changes (default: `new Subject<void>()`).
   * @zh 属性 `stateChanges`（类型：`Subject`），用于存储或配置状态变更集合（默认值：`new Subject<void>()`）。
   */
  stateChanges = new Subject<void>();
  /**
   * Property `_errorState` (`boolean`) storing error state (default: `false`).
   * @zh 属性 `_errorState`（类型：`boolean`），用于存储或配置错误状态（默认值：`false`）。
   */
  _errorState = false;

  /**
   * Property `invalidText` (`string`) storing invalid text (default: `'The value in this field is invalid'`).
   * @zh 属性 `invalidText`（类型：`string`），用于存储或配置无效文本（默认值：`'The value in this field is invalid'`）。
   */
  invalidText: string = 'The value in this field is invalid';

  /**
   * Property `toolTip` (`string`) storing tool tip.
   * @zh 属性 `toolTip`（类型：`string`），用于存储或配置tool提示。
   */
  public toolTip: string;

  /**
   * Creates an instance of `MatField` and initializes its dependencies and internal state.
   * @zh 创建 `MatField` 实例，并初始化其依赖项与内部状态。
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   */
  constructor(
    protected translate: TranslateService,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  public override init(config?): void {
    let blankErrorText = this.translate.instant("FORM.BLANKTEXT");
    if (this.field.validation) {
      if (isUndefined(this.field.validation.messages)) {
        this.field.validation.messages = {};
      }
      this.field.validation.messages['required'] = this.field.blankText ?
      this.translate.instant(this.field.blankText) : blankErrorText;
    } else {
      this.field.validation = {
        messages: {
          'required': this.field.blankText ? this.translate.instant(this.field.blankText)  : blankErrorText
        },
        show: false
      };
    }
    if (this.field.qtip !== 'under' && this.field.description) {
      this.toolTip = this.field.description;
    }
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    if (this.formField) {
      this.formField._control = this.formFieldControl;
    }
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    if (this.matPrefix || this.matSuffix) {
      setTimeout(() => {
        Dui.defineHiddenProp(this.field, '_matPrefix', this.matPrefix);
        Dui.defineHiddenProp(this.field, '_matSuffix', this.matSuffix);
        (<{ _markForCheck? }><unknown>this.option)._markForCheck(this.field);
      });
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (this.formField) {
      delete this.formField._control;
    }
    this.stateChanges.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `setDescribedByIds` to handle set described by ids.
   * @zh 执行 `setDescribedByIds`，用于集合Described按标识列表。
   * @param ids - ids parameter (`string[]`) / 标识列表参数（`string[]`）
   */
  setDescribedByIds(ids: string[]): void { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onContainerClick` to handle on container click.
   * @zh 执行 `onContainerClick`，用于当容器点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  onContainerClick(event: MouseEvent): void {
    this.field.focused = true;
    this.stateChanges.next();
  }

  /**
   * Gets the current error state (`errorState: any`).
   * @zh 获取当前错误状态（`errorState: any`）。
   */
  get errorState() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const showError = this.option!.showError!(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }
    return showError;
  }

  /**
   * Gets the current control type (`controlType: any`).
   * @zh 获取当前表单控件类型（`controlType: any`）。
   */
  get controlType() {
    if (this.field.type) {
      return this.field.type;
    }
    if ((<unknown>this.field.type) instanceof Type) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.field.type!.constructor.name;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.field.type!;
  }
  /**
   * Gets the current focused (`focused: any`).
   * @zh 获取当前已聚焦（`focused: any`）。
   */
  get focused() { return !!this.field.focused && !this.disabled; }
  /**
   * Gets the current disabled (`disabled: any`).
   * @zh 获取当前已禁用（`disabled: any`）。
   */
  get disabled() { return !!this.field.disabled; }
  /**
   * Gets the current required (`required: any`).
   * @zh 获取当前必填（`required: any`）。
   */
  get required() { return !!this.field.required; }
  /**
   * Gets the current placeholder (`placeholder: any`).
   * @zh 获取当前占位提示（`placeholder: any`）。
   */
  get placeholder() { return this.field.placeholder || ''; }
  /**
   * Gets the current should placeholder float (`shouldPlaceholderFloat: any`).
   * @zh 获取当前是否应当占位提示Float（`shouldPlaceholderFloat: any`）。
   */
  get shouldPlaceholderFloat() { return this.shouldLabelFloat; }
  /**
   * Gets the current value (`value: any`).
   * @zh 获取当前值（`value: any`）。
   */
  get value() { return this.formControl.value; }
  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param value - New value value (`any`) / 新的值值（`any`）
   */
  set value(value) {
    this.formControl.patchValue(value);
  }
  /**
   * Gets the current ng control (`ngControl: any`).
   * @zh 获取当前Angular表单控件（`ngControl: any`）。
   */
  get ngControl() { return this.formControl as never; }
  /**
   * Gets the current empty (`empty: any`).
   * @zh 获取当前空（`empty: any`）。
   */
  get empty() { return this.value === undefined || this.value === null || this.value === ''; }
  /**
   * Gets the current should label float (`shouldLabelFloat: any`).
   * @zh 获取当前是否应当标签Float（`shouldLabelFloat: any`）。
   */
  get shouldLabelFloat() { return this.focused || !this.empty; }
  /**
   * Gets the current form field (`formField: MatFormField`).
   * @zh 获取当前表单字段（`formField: MatFormField`）。
   */
  get formField(): MatFormField { return this.field ? (<unknown>this.field)['__formField__'] : null; }
}
