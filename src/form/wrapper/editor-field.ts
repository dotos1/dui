/**
 * @fileoverview Module `src/form/wrapper/editor-field.ts` providing editor field definitions and implementation.
 * @zh 模块文件 `src/form/wrapper/editor-field.ts`，提供编辑器字段相关的定义与实现。
 */

import {
  Component, ViewChild, ViewContainerRef, OnInit, OnDestroy, Renderer2,ChangeDetectionStrategy,
  AfterViewInit, AfterContentChecked, TemplateRef, ChangeDetectorRef, ElementRef
} from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { FieldWrapper, defineHiddenProp, FieldConfig, FormConfig , observe } from '@dotos/dui/core/form';
import { Subject, Subscription } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { FocusMonitor } from '@angular/cdk/a11y';
import { PopoverTrigger, Popover } from '@dotos/dui/common/popover';


/**
 * Interface `MatFieldConfig` defining the contract and properties for mat field config.
 * @zh 接口 `MatFieldConfig`，定义Material字段配置的数据结构契约与属性规范。
 */
interface MatFieldConfig extends FieldConfig {
  /**
   * Property `_matPrefix` (`TemplateRef<unknown>`) storing mat prefix.
   * @zh 属性 `_matPrefix`（类型：`TemplateRef<unknown>`），用于存储或配置Material前缀。
   */
  _matPrefix: TemplateRef<unknown>;
  /**
   * Property `_matSuffix` (`TemplateRef<unknown>`) storing mat suffix.
   * @zh 属性 `_matSuffix`（类型：`TemplateRef<unknown>`），用于存储或配置Material后缀。
   */
  _matSuffix: TemplateRef<unknown>;
  /**
   * Property `__formField__` (`WrapperEditorField`) storing form field.
   * @zh 属性 `__formField__`（类型：`WrapperEditorField`），用于存储或配置表单字段。
   */
  __formField__: WrapperEditorField;
}


/**
 * Angular component `WrapperEditorField` (selector: 'editor-field-wrapper') providing wrapper editor field presentation and interaction in `src/form/wrapper`.
 * @zh Angular 组件 `WrapperEditorField`（selector: 'editor-field-wrapper'），提供包装器编辑器字段的视图渲染与交互逻辑（位于 `src/form/wrapper`）。
 */
@Component({
  selector: 'editor-field-wrapper',
  templateUrl: './editor-field.html',
  styleUrls: ['./editor-field.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: WrapperEditorField }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {hostID: 'editor-field-wrapper' + Math.random().toString(36).substring(2, 15) },
  standalone: false,
})
export class WrapperEditorField extends FieldWrapper<MatFieldConfig> implements OnInit, OnDestroy, MatFormFieldControl<unknown>, AfterViewInit, AfterContentChecked {
  /**
   * Template/content query reference `fieldComponent` (`ViewContainerRef`) targeting field component.
   * @zh 模板/内容视图查询引用 `fieldComponent`（`@ViewChild`），指向字段组件。
   */
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) declare fieldComponent: ViewContainerRef;
  /**
   * Template/content query reference `formField` (`MatFormField`) targeting form field.
   * @zh 模板/内容视图查询引用 `formField`（`@ViewChild`），指向表单字段。
   */
  @ViewChild(MatFormField, { static: true }) formField!: MatFormField;

  /**
   * Template/content query reference `popoverTrigger` (`PopoverTrigger`) targeting popover trigger.
   * @zh 模板/内容视图查询引用 `popoverTrigger`（`@ViewChild`），指向气泡卡片触发。
   */
  @ViewChild(PopoverTrigger, { static: true }) popoverTrigger!: PopoverTrigger;

  /**
   * Template/content query reference `popover` (`Popover`) targeting popover.
   * @zh 模板/内容视图查询引用 `popover`（`@ViewChild`），指向气泡卡片。
   */
  @ViewChild(Popover, { static: true }) popover!: Popover;

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
   * Property `focusSubscription` (`Subscription`) storing focus subscription.
   * @zh 属性 `focusSubscription`（类型：`Subscription`），用于存储或配置聚焦订阅对象。
   */
  private focusSubscription?: Subscription;
  /**
   * Property `observers` (`{ unsubscribe: Function; }[]`) storing observers (default: `[]`).
   * @zh 属性 `observers`（类型：`{ unsubscribe: Function; }[]`），用于存储或配置观察者（默认值：`[]`）。
   */
  private observers: Array<{ unsubscribe: Function }> = [];
  /**
   * Property `unlisteners` (`(() => void)[]`) storing unlisteners (default: `[]`).
   * @zh 属性 `unlisteners`（类型：`(() => void)[]`），用于存储或配置unlisteners（默认值：`[]`）。
   */
  private unlisteners: Array<() => void> = [];

  /**
   * Property `showUnder` (`boolean`) storing show under (default: `false`).
   * @zh 属性 `showUnder`（类型：`boolean`），用于存储或配置显示下方（默认值：`false`）。
   */
  public showUnder = false;

  /**
   * Creates an instance of `WrapperEditorField` and initializes its dependencies and internal state.
   * @zh 创建 `WrapperEditorField` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`FormConfig`) / 注入或传入的配置（`FormConfig`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _platform - Injected or initial platform (`Platform`) / 注入或传入的platform（`Platform`）
   * @param focusMonitor - Injected or initial focus monitor (`FocusMonitor`) / 注入或传入的聚焦Monitor（`FocusMonitor`）
   * @param _changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
   */
  constructor(
    private config: FormConfig,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private _platform: Platform,
    private focusMonitor: FocusMonitor,
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
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.option.detectChanges!(this.field);
            }),
        ),
      ),
    );
    this.focusSubscription = this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      if (!origin && this.field.focused) {
        this.field.focused = false;
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
    this.formField._refreshOutlineNotchWidth();//updateOutlineGap();
    this._changeDetector.detectChanges();
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    if (this.field.hideFieldUnderline === true) {
      const underlineElement = this.formField._elementRef.nativeElement.querySelector('.mdc-line-ripple');
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `setDescribedByIds` to handle set described by ids.
   * @zh 执行 `setDescribedByIds`，用于集合Described按标识列表。
   * @param ids - ids parameter (`string[]`) / 标识列表参数（`string[]`）
   */
  setDescribedByIds(ids: string[]): void { }

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
    if (!showError) {
      this.popoverTrigger.destroyPopover();
    }
    //  else {
    //   setTimeout(() => {
    //     this.popoverTrigger.openPopover();
    //   }, this.popover.enterDelay);
    // }
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
  get fieldConfig() { return this.field as MatFieldConfig; }
}


