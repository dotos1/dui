/**
 * @fileoverview Module `src/form/wrapper/field-wrapper.ts` providing field wrapper definitions and implementation.
 * @zh 模块文件 `src/form/wrapper/field-wrapper.ts`，提供字段包装器相关的定义与实现。
 */

import { Component, ViewChild, ViewContainerRef, OnInit, OnDestroy, ChangeDetectionStrategy,Renderer2, AfterContentChecked, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FieldWrapper, FieldConfig } from '@dotos1/dui/core/form';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';


/**
 * Interface `MatFormFieldConfig` defining the contract and properties for mat form field config.
 * @zh 接口 `MatFormFieldConfig`，定义Material表单字段配置的数据结构契约与属性规范。
 */
interface MatFormFieldConfig extends FieldConfig {
  /**
   * Property `__formField__` (`ExtFieldWrapper`) storing form field.
   * @zh 属性 `__formField__`（类型：`ExtFieldWrapper`），用于存储或配置表单字段。
   */
  __formField__: ExtFieldWrapper;
  /**
   * Property `_componentFactory` (`any`) storing component factory.
   * @zh 属性 `_componentFactory`（类型：`any`），用于存储或配置组件工厂。
   */
  _componentFactory;
}

/**
 * Angular component `ExtFieldWrapper` (selector: 'dui-field-wrapper') providing ext field wrapper presentation and interaction in `src/form/wrapper`.
 * @zh Angular 组件 `ExtFieldWrapper`（selector: 'dui-field-wrapper'），提供Ext字段包装器的视图渲染与交互逻辑（位于 `src/form/wrapper`）。
 */
@Component({
  selector: 'dui-field-wrapper',
  template: `
      <ng-container #fieldComponent></ng-container>
      <mat-error [id]="null">
        <validation-message [field]="field"></validation-message>
      </mat-error>
      <mat-hint *ngIf="field.description" [id]="null">{{ field.description |translate}}</mat-hint>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MatFormFieldControl, useExisting: FieldWrapper }],
  host: {
    hostID: 'dui-field-wrapper' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class ExtFieldWrapper extends FieldWrapper<MatFormFieldConfig> implements OnInit, OnDestroy, MatFormFieldControl<unknown>, AfterContentChecked {

  /**
   * Template/content query reference `fieldComponent` (`ViewContainerRef`) targeting field component.
   * @zh 模板/内容视图查询引用 `fieldComponent`（`@ViewChild`），指向字段组件。
   */
  @ViewChild('fieldComponent', { read: ViewContainerRef }) declare fieldComponent: ViewContainerRef;


  /**
   * Property `stateChanges` (`Subject<void>`) storing state changes (default: `new Subject<void>()`).
   * @zh 属性 `stateChanges`（类型：`Subject<void>`），用于存储或配置状态变更集合（默认值：`new Subject<void>()`）。
   */
  stateChanges = new Subject<void>();
  /**
   * Property `_errorState` (`boolean`) storing error state (default: `false`).
   * @zh 属性 `_errorState`（类型：`boolean`），用于存储或配置错误状态（默认值：`false`）。
   */
  _errorState = false;
  /**
   * Property `initialGapCalculated` (`boolean`) storing initial gap calculated (default: `false`).
   * @zh 属性 `initialGapCalculated`（类型：`boolean`），用于存储或配置初始间距已计算（默认值：`false`）。
   */
  private initialGapCalculated = false;

  /**
   * Creates an instance of `ExtFieldWrapper` and initializes its dependencies and internal state.
   * @zh 创建 `ExtFieldWrapper` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
   */
  constructor(private renderer: Renderer2,
    private _changeDetector: ChangeDetectorRef) {
    super();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    if (this.fieldConfig.hide && this.fieldConfig['appearance'] === 'outline') {
      this.initialGapCalculated = true;
    }
  }

  /**
   * Angular lifecycle hook invoked after every check of projected content.
   * @zh Angular 生命周期钩子：在每次检查完投影内容后调用。
   */
  ngAfterContentChecked() {
    if (!this.initialGapCalculated || this.fieldConfig.hide) {
      return;
    }
    this.initialGapCalculated = true;
    this._changeDetector.detectChanges();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    delete this.fieldConfig.__formField__;
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
    this.fieldConfig['focusable'] = true;
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
  get controlType() { return this.field.type; }
  /**
   * Gets the current focused (`focused: any`).
   * @zh 获取当前已聚焦（`focused: any`）。
   */
  get focused() { return !!this.fieldConfig.focused && !this.disabled; }
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
   * Gets the current ng control (`ngControl: any`).
   * @zh 获取当前Angular表单控件（`ngControl: any`）。
   */
  get ngControl() { return this.formControl as never; }
  /**
   * Gets the current empty (`empty: any`).
   * @zh 获取当前空（`empty: any`）。
   */
  get empty() { return !this.formControl.value; }
  /**
   * Gets the current should label float (`shouldLabelFloat: any`).
   * @zh 获取当前是否应当标签Float（`shouldLabelFloat: any`）。
   */
  get shouldLabelFloat() { return this.focused || !this.empty; }

  /**
   * Gets the current field config (`fieldConfig: any`).
   * @zh 获取当前字段配置（`fieldConfig: any`）。
   */
  get fieldConfig() { return this.field as MatFormFieldConfig; }
}
