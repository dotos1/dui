/**
 * @fileoverview Module `src/ux/iconpicker/icon-picker.field.ts` providing icon picker field definitions and implementation.
 * @zh 模块文件 `src/ux/iconpicker/icon-picker.field.ts`，提供图标选择器字段相关的定义与实现。
 */


import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, Optional, Renderer2, ViewChild,
   ViewContainerRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DialogService} from '@dotos/dui/common/dialogs';
import { MatInput } from '@angular/material/input';

import { isObject } from 'lodash-es';

import { AbstractTrigger } from '@dotos/dui/form';
import { TranslateService } from '@dotos/dui/translator';

import { FontLoaderService } from '@dotos/dui/common/icon';
import { IconPickerComponent } from './icon-picker.component';

/**
 * Constant/variable `DATEINPUT_CONTROL_VALUE_ACCESSOR` defining dateinput control value accessor in `src/ux/iconpicker`.
 * @zh 常量/变量 `DATEINPUT_CONTROL_VALUE_ACCESSOR`，定义 `src/ux/iconpicker` 中的DATEINPUT表单控件值访问器。
 */
export const DATEINPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IconPickerField),
  multi: true,
};

/**
 * Constant/variable `DATEFIELD_VALIDATORS` defining datefield validators in `src/ux/iconpicker`.
 * @zh 常量/变量 `DATEFIELD_VALIDATORS`，定义 `src/ux/iconpicker` 中的DATEFIELD校验器列表。
 */
export const DATEFIELD_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IconPickerField),
  multi: true
};

/**
 * Angular component `IconPickerField` (selector: 'icon-picker-field') providing icon picker field presentation and interaction in `src/ux/iconpicker`.
 * @zh Angular 组件 `IconPickerField`（selector: 'icon-picker-field'），提供图标选择器字段的视图渲染与交互逻辑（位于 `src/ux/iconpicker`）。
 */
@Component({
  selector: 'icon-picker-field',
  templateUrl: 'icon-picker.field.html',
  styleUrls: ['icon-picker.field.scss'],
  providers: [DATEINPUT_CONTROL_VALUE_ACCESSOR, DATEFIELD_VALIDATORS],
  host: {
    'role': 'icon-picker',
    '[class.icon-picker-field-disabled]': 'disabled',
    '[class.icon-picker-field-opened]': 'opened',
    '[attr.aria-label]': 'label',
    '[attr.aria-required]': 'required?required.toString():false',
    '[attr.aria-disabled]': 'disabled?disabled.toString():false',
    
  },
  encapsulation: ViewEncapsulation.None,
})


export class IconPickerField extends AbstractTrigger implements OnInit {

  /**
   * Template/content query reference `_mapInput` (`@ViewChild`) targeting map input.
   * @zh 模板/内容视图查询引用 `_mapInput`（`@ViewChild`），指向映射表输入属性。
   */
  @ViewChild(MatInput) _mapInput: MatInput;
  /**
   * Template/content query reference `input` (`@ViewChild`) targeting input.
   * @zh 模板/内容视图查询引用 `input`（`@ViewChild`），指向输入属性。
   */
  @ViewChild('input') input: ElementRef;

  /**
   * Property `mode` (`'auto' | 'portrait' | 'landscape'`) storing mode (default: `'auto'`).
   * @zh 属性 `mode`（类型：`'auto' | 'portrait' | 'landscape'`），用于存储或配置模式（默认值：`'auto'`）。
   */
  public mode: 'auto' | 'portrait' | 'landscape' = 'auto';


  /**
   * Property `_onChange` (`(value: any) => void`) storing on change (default: `() => { }`).
   * @zh 属性 `_onChange`（类型：`(value: any) => void`），用于存储或配置当变更（默认值：`() => { }`）。
   */
  _onChange: (value) => void = () => { };

  /**
   * Property `_onTouched` (`any`) storing on touched (default: `() => { }`).
   * @zh 属性 `_onTouched`（类型：`any`），用于存储或配置当是否已触碰（默认值：`() => { }`）。
   */
  _onTouched = () => { };

  /**
   * Property `_type` (`string`) storing type (default: `'FONT'`).
   * @zh 属性 `_type`（类型：`string`），用于存储或配置类型（默认值：`'FONT'`）。
   */
  _type = 'FONT';
  /**
   * Property `_icon` (`string`) storing icon (default: `''`).
   * @zh 属性 `_icon`（类型：`string`），用于存储或配置图标（默认值：`''`）。
   */
  _icon = '';

  /**
   * Property `label` (`string`) storing label (default: `''`).
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签（默认值：`''`）。
   */
  label = '';

  /**
   * Gets the current value (`value: any`).
   * @zh 获取当前值（`value: any`）。
   */
  override get value() { 
    return this._icon; 
  }
  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param val - New value value (`any`) / 新的值值（`any`）
   */
  override set value(val) {

    if (isObject(val)) {
      this._type = val['type'];
      if (this.field.allow.indexOf('material')!=-1) {
        let valueString = this.coerceStringProperty(val['value']);
        if (valueString != null) {
          this._icon = valueString.substring(valueString.indexOf(":") + 1, valueString.length);
        } else {
          this._icon = undefined;
        }
      } else {
        this._icon = this.coerceStringProperty(val['value']);
      }
      this._selected = this._icon;
      this.field.inputValue= val['text'];
      this.formControl.setValue(this._icon);
    } else {
      this._icon = this.coerceStringProperty(val);
      this._selected = this._icon;
      this.field.inputValue=  this._icon;
      this.formControl.setValue(this._icon);
    }
  }

  /**
   * Gets the current icon (`icon: any`).
   * @zh 获取当前图标（`icon: any`）。
   */
  get icon() {
    return this._icon;
  }

  /**
   * Gets the current open on focus (`openOnFocus: boolean`).
   * @zh 获取当前打开当聚焦（`openOnFocus: boolean`）。
   */
  get openOnFocus(): boolean { return this._openOnFocus; }
  /**
   * Sets the open on focus (`openOnFocus`).
   * @zh 设置打开当聚焦（`openOnFocus`）。
   * @param value - New open on focus value (`boolean`) / 新的打开当聚焦值（`boolean`）
   */
  set openOnFocus(value: boolean) { this._openOnFocus = coerceBooleanProperty(value); }
  /**
   * Property `_openOnFocus` (`boolean`) storing open on focus.
   * @zh 属性 `_openOnFocus`（类型：`boolean`），用于存储或配置打开当聚焦。
   */
  private _openOnFocus: boolean;

  /**
   * Sets the is open (`isOpen`).
   * @zh 设置是否为打开（`isOpen`）。
   * @param value - New is open value (`boolean`) / 新的是否为打开值（`boolean`）
   */
  override set isOpen(value: boolean) {
    if (value && !this.opened) { this.open(); }
  }

  /**
   * Property `enableKeyEvents` (`boolean`) storing enable key events (default: `true`).
   * @zh 属性 `enableKeyEvents`（类型：`boolean`），用于存储或配置启用键事件集合（默认值：`true`）。
   */
  public override enableKeyEvents = true;

  /**
   * Property `maskRe` (`any`) storing mask re.
   * @zh 属性 `maskRe`（类型：`any`），用于存储或配置遮罩Re。
   */
  protected maskRe;

  /**
   * Property `fontStyle` (`any`) storing font style (default: `{}`).
   * @zh 属性 `fontStyle`（类型：`any`），用于存储或配置字体样式（默认值：`{}`）。
   */
  public fontStyle={};

  /**
   * Creates an instance of `IconPickerField` and initializes its dependencies and internal state.
   * @zh 创建 `IconPickerField` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef`) / 注入或传入的元素（`ElementRef`）
   * @param _dialogService - Injected or initial dialog service (`DialogService`) / 注入或传入的对话框服务（`DialogService`）
   * @param _overlay - Injected or initial overlay (`Overlay`) / 注入或传入的浮层（`Overlay`）
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param _viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param fontLoaderService - Injected or initial font loader service (`FontLoaderService`) / 注入或传入的字体加载器服务（`FontLoaderService`）
   * @param _dir - Injected or initial dir (`Directionality`) / 注入或传入的目录（`Directionality`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param renderer2 - Injected or initial renderer2 (`Renderer2`) / 注入或传入的renderer2（`Renderer2`）
   * @param _document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(
    public _element: ElementRef,
    protected override _dialogService: DialogService,
    protected override _overlay: Overlay,
    protected override _ngZone: NgZone,
    protected _viewContainerRef: ViewContainerRef,
    protected override translate: TranslateService,
    protected fontLoaderService:FontLoaderService,
    @Optional() protected override _dir: Directionality,
    protected _changeDetectorRef: ChangeDetectorRef,
    public renderer2: Renderer2,
    @Optional() @Inject(DOCUMENT) protected override _document) {
    super(_element, _dialogService, _overlay, _ngZone, translate,  _dir, _document);
  }
  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    super.ngOnInit();
    this.field.  inputValue = 'menu';
    this.formControl.registerOnChange((value)=>{
      let fullIcon = value;
      let _icon;
      if (fullIcon) {
        if (fullIcon.startsWith("SVG")) {
          let vals = fullIcon.split(":");
          _icon = vals[1];
          this._type = vals[0];
          this._icon=fullIcon;
        } else if (fullIcon.startsWith("FONT")) {
          let vals = fullIcon.split(":");
          this._type = vals[0];
          _icon = vals[1];
          this._icon=_icon;
        } else {
          _icon = fullIcon;
          this._icon=_icon;
        }
      } else {
        this._type = "UNKNOWN";
        this._icon=_icon;
      };
    });
  }
  /**
   * Executes `isColor` to handle is color.
   * @zh 执行 `isColor`，用于是否为颜色。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  isColor(value){
    if(value&&value.indexOf("#")!==-1){
      return true;
    }else{
      return false;
    }
  }

  /**
   * Executes `isPattern` to handle is pattern.
   * @zh 执行 `isPattern`，用于是否为模式/图案。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  isPattern(value){
    if(value&&value.indexOf("/api/")!==-1){
      return true;
    }else{
      return false;
    }
  }
  /**
   * Executes `coerceStringProperty` to handle coerce string property.
   * @zh 执行 `coerceStringProperty`，用于coerce字符串属性。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private coerceStringProperty(value): string {
    const d: string = value ? value + '' : null;
    return d;
  }

  /**
   * Executes `_selectAndClose` to handle select and close.
   * @zh 执行 `_selectAndClose`，用于下拉选择And关闭。
   * @param val - val parameter (`any`) / 值参数（`any`）
   */
  override _selectAndClose(val): void {

    if(typeof(val) =='object' ){
      this.value = val.value;
    }else{
      this.value = val;
    }
    if ( this.value != this._selected) {
      this._emitChangeEvent();
    }
    this._mapInput.focus();
    this._mapInput.ngDoCheck();
    this.close();
  }

  /**
   * Executes `clear` to handle clear.
   * @zh 执行 `clear`，用于清空。
   */
  clear() {
    this.value = undefined;
    this.field.inputValue = undefined;
  }

  /**
   * Executes `open` to handle open.
   * @zh 执行 `open`，用于打开。
   */
  override open(): void {
    super.beforeOpen();
    if (!this._portal) {
      this._portal = new ComponentPortal(IconPickerComponent, this._viewContainerRef);
    }
    super.postOpen({
      allow: this.field.allow == undefined ? false : this.field.allow,
      iconpath:this.field.iconpath== undefined?'':this.field.iconpath,
      fontpath:this.field.fontpath== undefined?'':this.field.fontpath,
      custompath: this.field.custompath== undefined?'':this.field.custompath,
    });
  }
}
