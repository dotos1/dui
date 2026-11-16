/**
 * @fileoverview Module `src/form/wrapper/label-field.ts` providing label field definitions and implementation.
 * @zh 模块文件 `src/form/wrapper/label-field.ts`，提供标签字段相关的定义与实现。
 */

import { Component, ViewChild, ViewContainerRef,  OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';

import { Subject } from 'rxjs';
import { Renderer2, ElementRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { FieldConfig } from '@dotos1/dui/core/form';
import { FieldWrapper } from '@dotos1/dui/core/form';

/**
 * Angular component `LabelWrapperField` (selector: 'label-field-wrapper') providing label wrapper field presentation and interaction in `src/form/wrapper`.
 * @zh Angular 组件 `LabelWrapperField`（selector: 'label-field-wrapper'），提供标签包装器字段的视图渲染与交互逻辑（位于 `src/form/wrapper`）。
 */
@Component({
  selector: 'label-field-wrapper',
  templateUrl: './label-field.html',
  styleUrls: ['./label-field.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: LabelWrapperField }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host:{ hostID: 'label-field-wrapper' + Math.random().toString(36).substring(2, 15),},
  standalone: false
})
export class LabelWrapperField extends FieldWrapper<FieldConfig> implements  OnDestroy, MatFormFieldControl<unknown> {
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
   * Property `underTip` (`string`) storing under tip.
   * @zh 属性 `underTip`（类型：`string`），用于存储或配置下方提示。
   */
  public underTip: string;

  /**
   * Property `_enterListener` (`Function`) storing enter listener.
   * @zh 属性 `_enterListener`（类型：`Function`），用于存储或配置进入监听器。
   */
  private _enterListener: Function;

  /**
   * Property `_leaveListener` (`Function`) storing leave listener.
   * @zh 属性 `_leaveListener`（类型：`Function`），用于存储或配置离开监听器。
   */
  private _leaveListener: Function;

  /**
   * Property `showUnder` (`boolean`) storing show under (default: `false`).
   * @zh 属性 `showUnder`（类型：`boolean`），用于存储或配置显示下方（默认值：`false`）。
   */
  public showUnder = false;
  /**
   * Property `options` (`any`) storing options.
   * @zh 属性 `options`（类型：`any`），用于存储或配置配置选项。
   */
  public options;

  /**
   * Creates an instance of `LabelWrapperField` and initializes its dependencies and internal state.
   * @zh 创建 `LabelWrapperField` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _platform - Injected or initial platform (`Platform`) / 注入或传入的platform（`Platform`）
   * @param _changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
   */
  constructor(private _elementRef: ElementRef,
    private renderer: Renderer2,
    private _platform: Platform,
    private _changeDetector: ChangeDetectorRef, ) {
    super();
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  public override init(): void {
    super.init();
    if (this.field.qtip && this.field.qtip === 'under') {
      if (!this._platform.IOS) {
        this._enterListener =
          this.renderer.listen(this._elementRef.nativeElement, 'mouseenter', ($event) => this.showTip($event));
        this._leaveListener =
          this.renderer.listen(this._elementRef.nativeElement, 'mouseleave', () => this.hideTip());
      }
      this.underTip = this.field.description;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `showTip` to handle show tip.
   * @zh 执行 `showTip`，用于显示提示。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  showTip(e) {
    this.showUnder = true;
    this._changeDetector.detectChanges();
  }
  /**
   * Executes `hideTip` to handle hide tip.
   * @zh 执行 `hideTip`，用于隐藏提示。
   */
  hideTip() {
    this.showUnder = false;
    this._changeDetector.detectChanges();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (!this._platform.IOS) {
      if (this._enterListener) {
        this._enterListener();
      }
      if (this._leaveListener) {
        this._leaveListener();
      }
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
    const showError = this.options.showError(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }
    return showError;
  }

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
  get fieldConfig() { return this.field as FieldConfig; }
}
