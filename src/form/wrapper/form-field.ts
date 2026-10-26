/**
 * @fileoverview Module `src/form/wrapper/form-field.ts` providing form field definitions and implementation.
 * @zh 模块文件 `src/form/wrapper/form-field.ts`，提供表单字段相关的定义与实现。
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { FieldConfig, FieldWrapper, defineHiddenProp, observe } from '@dotos/dui/core/form';
import { ThemeService } from '@dotos/dui/theme';
// import { MDCTextField } from '@material/textfield';

import { Subject, Subscription } from 'rxjs';
/**
 * Interface `MatFieldConfig` defining the contract and properties for mat field config.
 * @zh 接口 `MatFieldConfig`，定义Material字段配置的数据结构契约与属性规范。
 */
interface MatFieldConfig extends FieldConfig {
  /**
   * Property `_matPrefix` (`TemplateRef<any>`) storing mat prefix.
   * @zh 属性 `_matPrefix`（类型：`TemplateRef<any>`），用于存储或配置Material前缀。
   */
  _matPrefix: TemplateRef<unknown>;
  /**
   * Property `_matSuffix` (`TemplateRef<any>`) storing mat suffix.
   * @zh 属性 `_matSuffix`（类型：`TemplateRef<any>`），用于存储或配置Material后缀。
   */
  _matSuffix: TemplateRef<unknown>;
  /**
   * Property `__formField__` (`WrapperFormField`) storing form field.
   * @zh 属性 `__formField__`（类型：`WrapperFormField`），用于存储或配置表单字段。
   */
  __formField__: WrapperFormField;
}
/**
 * Angular component `WrapperFormField` (selector: 'mat-form-field-wrapper') providing wrapper form field presentation and interaction in `src/form/wrapper`.
 * @zh Angular 组件 `WrapperFormField`（selector: 'mat-form-field-wrapper'），提供包装器表单字段的视图渲染与交互逻辑（位于 `src/form/wrapper`）。
 */
@Component({
  selector: 'mat-form-field-wrapper',
  templateUrl: './form-field.html',
  providers: [{ provide: MatFormFieldControl, useExisting: WrapperFormField }],
  encapsulation: ViewEncapsulation.None,
  styles: [`
        .mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {
          padding-left: 8px;
        }
        .mat-mdc-select-trigger{
          padding-left: 8px;
        }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { hostID: 'mat-form-field-wrapper' + Math.random().toString(36).substring(2, 15) }
})
export class WrapperFormField extends FieldWrapper<MatFieldConfig> implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  /**
   * Template/content query reference `fieldComponent` (`@ViewChild`) targeting field component.
   * @zh 模板/内容视图查询引用 `fieldComponent`（`@ViewChild`），指向字段组件。
   */
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) declare fieldComponent: ViewContainerRef;
  /**
   * Template/content query reference `formField` (`@ViewChild`) targeting form field.
   * @zh 模板/内容视图查询引用 `formField`（`@ViewChild`），指向表单字段。
   */
  @ViewChild(MatFormField, { static: true }) formField!: MatFormField;


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
   * Property `initialGapCalculated` (`boolean`) storing initial gap calculated (default: `false`).
   * @zh 属性 `initialGapCalculated`（类型：`boolean`），用于存储或配置初始间距已计算（默认值：`false`）。
   */
  private initialGapCalculated = false;
  /**
   * Property `focusSubscription` (`Subscription`) storing focus subscription.
   * @zh 属性 `focusSubscription`（类型：`Subscription`），用于存储或配置聚焦订阅对象。
   */
  private focusSubscription?: Subscription;
  /**
   * Property `observers` (`Array<{ unsubscribe: Function }>`) storing observers (default: `[]`).
   * @zh 属性 `observers`（类型：`Array<{ unsubscribe: Function }>`），用于存储或配置观察者（默认值：`[]`）。
   */
  private observers: Array<{ unsubscribe: Function }> = [];
  /**
   * Property `unlisteners` (`Array<() => void>`) storing unlisteners (default: `[]`).
   * @zh 属性 `unlisteners`（类型：`Array<() => void>`），用于存储或配置unlisteners（默认值：`[]`）。
   */
  private unlisteners: Array<() => void> = [];

  /**
   * Property `toolTip` (`string`) storing tool tip.
   * @zh 属性 `toolTip`（类型：`string`），用于存储或配置tool提示。
   */
  public toolTip: string;

  /**
   * Property `underTip` (`string`) storing under tip.
   * @zh 属性 `underTip`（类型：`string`），用于存储或配置下方提示。
   */
  public underTip: string;

  /**
   * Property `showUnder` (`boolean`) storing show under (default: `false`).
   * @zh 属性 `showUnder`（类型：`boolean`），用于存储或配置显示下方（默认值：`false`）。
   */
  public showUnder = false;

  /**
   * Property `classFormField` (`string`) storing class form field (default: `""`).
   * @zh 属性 `classFormField`（类型：`string`），用于存储或配置类名表单字段（默认值：`""`）。
   */
  public classFormField="";

  /**
   * Gets the current padding style (`paddingStyle: any`).
   * @zh 获取当前内边距样式（`paddingStyle: any`）。
   */
  public get paddingStyle(){
    return {
      'padding-left':this.field.prefix ? '32px' : '8px'
    }
  }

  /**
   * Creates an instance of `WrapperFormField` and initializes its dependencies and internal state.
   * @zh 创建 `WrapperFormField` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param elementRef - Injected or initial element ref (`ElementRef`) / 注入或传入的元素引用（`ElementRef`）
   * @param _platform - Injected or initial platform (`Platform`) / 注入或传入的platform（`Platform`）
   * @param focusMonitor - Injected or initial focus monitor (`FocusMonitor`) / 注入或传入的聚焦Monitor（`FocusMonitor`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param _changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
   */
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private _platform: Platform,
    private focusMonitor: FocusMonitor,
    public themeService: ThemeService,
    private _changeDetector: ChangeDetectorRef) {
    super();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    defineHiddenProp(this.field, '__formField__', this.formField);
    ['prefix', 'suffix'].forEach((type) =>
      this.observers.push(
        observe<TemplateRef<unknown>>(
          this.field,
          [ type],
          ({ currentValue }) =>
            currentValue &&
            Promise.resolve().then(() => {
              (<unknown>this.field)[`_mat${type}`] = currentValue;
              this.option.detectChanges!(this.field);
            }),
        ),
      ),
    );
    this.focusSubscription = this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      if (!origin && this.field.focused) {
        this.field.focused = false;
        // this.textField?.getDefaultFoundation().deactivateFocus();;
      }
    });
  }

  /**
   * Angular lifecycle hook invoked after every check of projected content.
   * @zh Angular 生命周期钩子：在每次检查完投影内容后调用。
   */
  ngAfterContentChecked() {
    // 只在字段首次真正可见时重算一次 outline 缺口宽度：字段隐藏时 DOM 尺寸为 0，
    // 此时测量得到的缺口是错的，需要等它显示出来再算。
    if (this.initialGapCalculated || this.fieldConfig.hide || this.formField.appearance !== 'outline') {
      return;
    }
    this.initialGapCalculated = true;
    this.formField._refreshOutlineNotchWidth();//.updateOutlineGap();
    this._changeDetector.detectChanges();
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    let el=this.formField._elementRef.nativeElement;

    if (this.formField.appearance !== 'outline' && this.field.hideFieldUnderline === true) {
      const underlineElement = el.querySelector('.mdc-line-ripple');
      underlineElement && this.renderer.removeChild(underlineElement.parentNode, underlineElement);
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    delete this.field.__formField__;
    this.observers.forEach(o => o?.unsubscribe());
    this.observers = [];
    this.unlisteners.forEach(unlisten => unlisten());
    this.unlisteners = [];
    this.focusSubscription?.unsubscribe();
    this.focusMonitor.stopMonitoring(this.elementRef);
    // MatFormFieldControl 契约要求实现者在销毁时 complete 该 Subject。
    this.stateChanges.complete();
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  public override init(): void {
    super.init();
    if (this.field.qtip && this.field.qtip === 'under') {
      if (!this._platform.IOS) {
        this.unlisteners.push(
          this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', ($event) => this.showTip($event)),
          this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => this.hideTip()),
        );
      }
      this.underTip = this.field.description;
      if(this.field.classFormField){
        this.classFormField= this.field.classFormField;
      }

    }
  }

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onContainerClick` to handle on container click.
   * @zh 执行 `onContainerClick`，用于当容器点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  onContainerClick(event: MouseEvent): void {
    this.fieldConfig.focused = true;
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
   * Gets the current color (`color: any`).
   * @zh 获取当前颜色（`color: any`）。
   */
  get color() { return this.field.color || 'accent'; }
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
  get ngControl() { return this.formControl as unknown; }
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
  get fieldConfig() { return this.field as MatFieldConfig; }
}
