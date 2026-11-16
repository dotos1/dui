/**
 * @fileoverview Module `src/form/trigger/abstract.trigger.ts` providing abstract trigger definitions and implementation.
 * @zh 模块文件 `src/form/trigger/abstract.trigger.ts`，提供abstract触发相关的定义与实现。
 */

import { Directionality } from "@angular/cdk/bidi";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from "@angular/common";
import {
    ComponentRef,
    DoCheck,
    ElementRef,
    EventEmitter, Inject,
    Injectable,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Optional, Output,

} from '@angular/core';
import {  MatDialogRef } from "@angular/material/dialog";
import { TriggerPopup } from '@dotos1/dui/common/trigger';
import { TranslateService } from '@dotos1/dui/translator';
import {isObjectLike}  from 'lodash-es';
import { Subject } from "rxjs";
import { first, takeUntil } from "rxjs/operators";
import { MatField } from '../base/mat.field';
import { DialogService} from '@dotos1/dui/common/dialogs';

/**
 * Change event object emitted by Md2Select.
 * @zh 类 `ValueChange`，封装 `src/form/trigger` 中的值变更数据结构与处理逻辑。
 */
export class ValueChange {
  /**
   * Creates an instance of `ValueChange` and initializes its dependencies and internal state.
   * @zh 创建 `ValueChange` 实例，并初始化其依赖项与内部状态。
   * @param source - Injected or initial source (`any`) / 注入或传入的源（`any`）
   * @param value - Injected or initial value (`any`) / 注入或传入的值（`any`）
   */
  constructor(public source, public value) { }
}

/**
 * Injectable Angular service `AbstractTrigger` managing abstract trigger state and operations in `src/form/trigger`.
 * @zh 可注入的 Angular 服务 `AbstractTrigger`，管理 `src/form/trigger` 中的Abstract触发状态与业务操作。
 */
@Injectable()
export class AbstractTrigger extends MatField implements OnInit,OnDestroy,DoCheck  {


  /**
   * Gets the current editable (`editable: boolean`).
   * @zh 获取当前是否可编辑（`editable: boolean`）。
   */
  get editable(): boolean { return this._editable; }
  /**
   * Sets the editable (`editable`).
   * @zh 设置是否可编辑（`editable`）。
   * @param value - New editable value (`boolean`) / 新的是否可编辑值（`boolean`）
   */
  set editable(value: boolean) { this._editable =  coerceBooleanProperty (value); }
  /**
   * Property `_editable` (`boolean`) storing editable.
   * @zh 属性 `_editable`（类型：`boolean`），用于存储或配置是否可编辑。
   */
  private _editable: boolean;

  /**
   * Getter for input property `touchUi` (`boolean`) returning touch ui.
   * @zh 输入属性 `touchUi`（类型：`boolean`）的读取器，返回当前触摸界面。
   */
  @Input()
  get touchUi(): boolean {
    return this._touchUi;
  }

  /**
   * Sets the touch ui (`touchUi`).
   * @zh 设置触摸界面（`touchUi`）。
   * @param value - New touch ui value (`boolean`) / 新的触摸界面值（`boolean`）
   */
  set touchUi(value: boolean) {
    this._touchUi =  coerceBooleanProperty (value);
  }

  /**
   * Property `_touchUi` (`boolean`) storing touch ui (default: `false`).
   * @zh 属性 `_touchUi`（类型：`boolean`），用于存储或配置触摸界面（默认值：`false`）。
   */
  private _touchUi = false;

  /**
   * Property `tabindex` (`number`) storing tabindex (default: `0`).
   * @zh 属性 `tabindex`（类型：`number`），用于存储或配置tabindex（默认值：`0`）。
   */
  public tabindex: number = 0;


  /**
   * Property `_validatorOnChange` (`() => void`) storing validator on change (default: `() => { }`).
   * @zh 属性 `_validatorOnChange`（类型：`() => void`），用于存储或配置校验器当变更（默认值：`() => { }`）。
   */
  _validatorOnChange = () => { };

  /**
   * Property `_inputFocused` (`boolean`) storing input focused (default: `false`).
   * @zh 属性 `_inputFocused`（类型：`boolean`），用于存储或配置输入属性已聚焦（默认值：`false`）。
   */
  protected _inputFocused: boolean = false;

  /**
   * Property `enableKeyEvents` (`boolean`) storing enable key events (default: `false`).
   * @zh 属性 `enableKeyEvents`（类型：`boolean`），用于存储或配置启用键事件集合（默认值：`false`）。
   */
  public enableKeyEvents = false;

  /**
   * Gets the current required (`required: boolean`).
   * @zh 获取当前必填（`required: boolean`）。
   */
  override get required(): boolean { return this._required; }
  /**
   * Sets the required (`required`).
   * @zh 设置必填（`required`）。
   * @param value - New required value (`boolean`) / 新的必填值（`boolean`）
   */
  override set required(value) { this._required =  coerceBooleanProperty (value); }
  /**
   * Property `_required` (`boolean`) storing required (default: `false`).
   * @zh 属性 `_required`（类型：`boolean`），用于存储或配置必填（默认值：`false`）。
   */
  private _required: boolean = false;


  /**
   * Output event emitter `selectedChanged` (`EventEmitter<any>`) firing when selected changed occurs.
   * @zh 输出事件 `selectedChanged`（类型：`EventEmitter<any>`），当触发已选中已变更时向外发出事件。
   */
  @Output() selectedChanged = new EventEmitter();

  /**
   * Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`.
   * @zh 输入属性 `panelClass`（类型：`string | string[]`），用于配置面板类名。
   */
  @Input() panelClass: string | string[];

  /**
   * Output event emitter `opened` (`EventEmitter<AbstractTrigger>`) firing when opened stream occurs.
   * @zh 输出事件 `opened`（类型：`EventEmitter<AbstractTrigger>`），当触发是否展开流时向外发出事件。
   */
  @Output("opened") openedStream: EventEmitter<AbstractTrigger> = new EventEmitter<AbstractTrigger>();

  // tslint:disable-next-line:no-output-rename
  /**
   * Output event emitter `closed` (`EventEmitter<AbstractTrigger>`) firing when closed stream occurs.
   * @zh 输出事件 `closed`（类型：`EventEmitter<AbstractTrigger>`），当触发是否关闭流时向外发出事件。
   */
  @Output("closed") closedStream: EventEmitter<AbstractTrigger> = new EventEmitter<AbstractTrigger>();

  /**
   * Whether the calendar is open.
   * @zh 属性 `opened`（类型：`boolean`），用于存储或配置是否展开（默认值：`false`）。
   */
  opened = false;


  /**
   * The currently selected date.
   * @zh 获取当前已选中（`_selected: any | null`）。
   */
  get _selected() {
    return this._validSelected;
  }

  /**
   * Sets the selected (`_selected`).
   * @zh 设置已选中（`_selected`）。
   * @param value - New selected value (`any`) / 新的已选中值（`any`）
   */
  set _selected(value) {
    this._validSelected = value;
  }
  /**
   * Property `_validSelected` (`any`) storing valid selected (default: `null`).
   * @zh 属性 `_validSelected`（类型：`any`），用于存储或配置有效已选中（默认值：`null`）。
   */
  private _validSelected = null;


  /**
   * Property `_value` (`any`) storing value.
   * @zh 属性 `_value`（类型：`any`），用于存储或配置值。
   */
  protected _value;

  /**
   * Sets the is open (`isOpen`).
   * @zh 设置是否为打开（`isOpen`）。
   * @param value - New is open value (`boolean`) / 新的是否为打开值（`boolean`）
   */
  set isOpen(value: boolean) {
    if (value && !this.opened) { this.open(); }
  }

  // @Output() change: EventEmitter<ValueChange> = new EventEmitter<ValueChange>();

  /**
   * A reference to the overlay when the calendar is opened as a popup.
   * @zh 属性 `_popupRef`（类型：`OverlayRef`），用于存储或配置弹窗引用。
   */
  protected _popupRef: OverlayRef;

  /**
   * A reference to the dialog when the calendar is opened as a dialog.
   * @zh 属性 `_dialogRef`（类型：`MatDialogRef<TriggerPopup, any>`），用于存储或配置对话框引用。
   */
  protected _dialogRef: MatDialogRef<TriggerPopup> | null;

  /**
   * Property `_portal` (`ComponentPortal<TriggerPopup>`) storing portal.
   * @zh 属性 `_portal`（类型：`ComponentPortal<TriggerPopup>`），用于存储或配置传送门容器。
   */
  protected _portal: ComponentPortal<TriggerPopup>;

  /**
   * The element that was focused before the datepicker was opened.
   * @zh 属性 `_focusedElementBeforeOpen`（类型：`HTMLElement`），用于存储或配置已聚焦元素之前打开（默认值：`null`）。
   */
  protected _focusedElementBeforeOpen: HTMLElement | null = null;

  /**
   * Property `_onDestroy` (`Subject<void>`) storing on destroy (default: `new Subject<void>()`).
   * @zh 属性 `_onDestroy`（类型：`Subject<void>`），用于存储或配置当销毁（默认值：`new Subject<void>()`）。
   */
  private readonly _onDestroy = new Subject<void>();

  /**
   * Creates an instance of `AbstractTrigger` and initializes its dependencies and internal state.
   * @zh 创建 `AbstractTrigger` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _dialogService - Injected or initial dialog service (`DialogService`) / 注入或传入的对话框服务（`DialogService`）
   * @param _overlay - Injected or initial overlay (`Overlay`) / 注入或传入的浮层（`Overlay`）
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param _dir - Injected or initial dir (`Directionality`) / 注入或传入的目录（`Directionality`）
   * @param _document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(
    protected _elementRef: ElementRef,
    protected  _dialogService: DialogService,
    protected _overlay: Overlay,
    protected _ngZone: NgZone,
    protected override translate: TranslateService,
    @Optional() protected _dir: Directionality,
    @Optional() @Inject(DOCUMENT) protected _document) {
    super(translate);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    super.ngOnInit();
    this.field.formControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((val) => {
      if (isObjectLike(val) ) {
        if(val.text){
          this._elementRef.nativeElement.children[0].value = val.text;
        }else{
          this._elementRef.nativeElement.children[0].value ='';
        }
      }
      if(this.field.inputValue){
        this._elementRef.nativeElement.children[0].value = this.field.inputValue;
      }
    });
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck() {
    if (this.field.doCheck) {
      this.field.doCheck(this);
    }
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config?): void {
    super.init(config);
    if(this.field.touchUi!=undefined){
      this.touchUi=this.field.touchUi;
    }
    if(this.field.panelClass!=undefined){
      // Was `==` (a no-op comparison) instead of `=` -- consumer-set panelClass never
      // reached the @Input at all, and was never read anywhere either (see
      // _createPopup() below), making it end-to-end dead configuration.
      this.panelClass=this.field.panelClass;
    }
    if (this.field.opened) {
      this.openedStream.pipe(takeUntil(this._onDestroy)).subscribe(this.field.opened);
    }
    if (this.field.closed) {
      this.closedStream.pipe(takeUntil(this._onDestroy)).subscribe(this.field.closed);
    }
  }

  /**
   * Executes `open` to handle open.
   * @zh 执行 `open`，用于打开。
   */
  public open() { }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    this.close();
    this._onDestroy.next();
    this._onDestroy.complete();
    if (this._popupRef) {
      this._popupRef.dispose();
    }
    super.ngOnDestroy();
  }

  /**
   * Executes `_select` to handle select.
   * @zh 执行 `_select`，用于下拉选择。
   * @param val - val parameter (`any`) / 值参数（`any`）
   */
  _select(val): void {
    const oldValue = this._selected;
    this._selected = val;
    if (oldValue != this._selected) {
      this.selectedChanged.emit(val);
    }
  }

  /**
   * Executes `registerOnValidatorChange` to handle register on validator change.
   * @zh 执行 `registerOnValidatorChange`，用于注册当校验器变更。
   * @param fn - fn parameter (`() => void`) / 函数参数（`() => void`）
   */
  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }


  /**
   * Executes `_handleFocus` to handle handle focus.
   * @zh 执行 `_handleFocus`，用于连接手柄聚焦。
   */
  _handleFocus() {
    this._inputFocused = true;
    if (!this.opened && !this.editable) {
      this.open();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `_handleBlur` to handle handle blur.
   * @zh 执行 `_handleBlur`，用于连接手柄失焦。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  _handleBlur(event: Event) {
    this._inputFocused = false;
    // if (!this.opened) {
    //   this._onTouched();
    // }
    // const el: any = event.target;
    //  this.value = el.value;
    this._emitChangeEvent();
  }

  /**
   * Executes `close` to handle close.
   * @zh 执行 `close`，用于关闭。
   */
  close(): void {
    if (!this.opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }
    if (this._portal && this._portal.isAttached) {
      this._portal.detach();
    }
    const completeClose = () => {
      if (this.opened) {
        this.opened = false;
        this.closedStream.emit(this);
        this._focusedElementBeforeOpen = null;
      }
    };
    if (this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === "function") {
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `_selectAndClose` to handle select and close.
   * @zh 执行 `_selectAndClose`，用于下拉选择And关闭。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  _selectAndClose(value): void {
    const oldValue = this._selected;
    if (oldValue !== this._selected) {
      this._emitChangeEvent();
    }
    this.close();
  }

  /**
   * Executes `_emitChangeEvent` to handle emit change event.
   * @zh 执行 `_emitChangeEvent`，用于发出变更事件。
   */
  _emitChangeEvent(): void {
    this.selectedChanged.emit(new ValueChange(this, this.value));
    if (this.field.change) {
      this.field.change(this.field,this.value);
    }
  }

  /**
   * Executes `beforeOpen` to handle before open.
   * @zh 执行 `beforeOpen`，用于之前打开。
   */
  protected beforeOpen(): void {
    if (this.opened) { return; }
    if (this.disabled) { return; }
  }

  /**
   * Executes `postOpen` to handle post open.
   * @zh 执行 `postOpen`，用于提交打开。
   * @param params - params parameter (`any`) / 参数集合参数（`any`）
   */
  protected postOpen(params?): void {
    if( this.field.touchUi){
      this._openAsDialog(params)
    }else{
      this._openAsPopup(params);
    }
    this.opened = true;
    this.openedStream.emit(this);
  }

  /**
   * Open the calendar as a dialog.
   * @zh 执行 `_openAsDialog`，用于打开As对话框。
   */
  private _openAsDialog(params?): void {
    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.host = this;
    if (params) this._dialogRef.componentInstance.params = params;
  }

  /**
   * Open the calendar as a popup.
   * @zh 执行 `_openAsPopup`，用于打开As弹窗。
   */
  private _openAsPopup(params?): void {
    if (!this._popupRef) {
      this._createPopup();
    }
    if (!this._popupRef.hasAttached()) {
      const componentRef: ComponentRef<TriggerPopup> = this._popupRef.attach(this._portal);
      componentRef.instance.host = this;
      if (params) componentRef.instance.params = params;
      this._ngZone.onStable.asObservable().pipe(first()).subscribe(() => {
        this._popupRef.updatePosition();
      });
    }
  }

  /**
   * Executes `_createPopup` to handle create popup.
   * @zh 执行 `_createPopup`，用于创建弹窗。
   */
  private _createPopup(): void {
    const panelClass = ["mat-picker-popup"];
    if (this.panelClass) {
      Array.isArray(this.panelClass) ? panelClass.push(...this.panelClass) : panelClass.push(this.panelClass);
    }
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: "mat-overlay-transparent-backdrop",
      direction: this._dir ? this._dir.value : "ltr",
      panelClass
    });
    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.backdropClick()
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.close());
  }

  /**
   * Executes `_createPopupPositionStrategy` to handle create popup position strategy.
   * @zh 执行 `_createPopupPositionStrategy`，用于创建弹窗位置策略。
   * @returns Result of type `PositionStrategy` / 类型为 `PositionStrategy` 的返回值
   */
  public _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .flexibleConnectedTo(this.getConnectedOverlayOrigin())
      .withTransformOriginOn(".mat-content-popup")
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top"
        },
        {
          originX: "start",
          originY: "top",
          overlayX: "start",
          overlayY: "bottom"
        },
        {
          originX: "end",
          originY: "bottom",
          overlayX: "end",
          overlayY: "top"
        },
        {
          originX: "end",
          originY: "top",
          overlayX: "end",
          overlayY: "bottom"
        }
      ]);
  }
  /**
   * Executes `getConnectedOverlayOrigin` to handle get connected overlay origin.
   * @zh 执行 `getConnectedOverlayOrigin`，用于获取已连接浮层Origin。
   * @returns Result of type `ElementRef<any>` / 类型为 `ElementRef<any>` 的返回值
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._elementRef;
  }
}
