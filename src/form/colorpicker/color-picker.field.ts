/**
 * @fileoverview Module `src/form/colorpicker/color-picker.field.ts` providing color picker field definitions and implementation.
 * @zh 模块文件 `src/form/colorpicker/color-picker.field.ts`，提供颜色选择器字段相关的定义与实现。
 */


import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  Optional, ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { AbstractTrigger } from '../trigger/abstract.trigger';

import { FieldConfig } from '@dotos/dui/core/form';
import { ColorPickerContent } from './color-picker.content';

import { DOCUMENT } from '@angular/common';
import { DialogService} from '@dotos/dui/common/dialogs';
import { ChromeComponent, CompactComponent, GithubComponent, SketchComponent } from '@dotos/dui/common/colorpicker/components';
import { TranslateService } from '@dotos/dui/translator';
import { isObject } from 'lodash-es';


/**
 * Constant/variable `DATEINPUT_CONTROL_VALUE_ACCESSOR` defining dateinput control value accessor in `src/form/colorpicker`.
 * @zh 常量/变量 `DATEINPUT_CONTROL_VALUE_ACCESSOR`，定义 `src/form/colorpicker` 中的DATEINPUT表单控件值访问器。
 */
export const DATEINPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorPickerField),
  multi: true,
};

/**
 * Constant/variable `DATEFIELD_VALIDATORS` defining datefield validators in `src/form/colorpicker`.
 * @zh 常量/变量 `DATEFIELD_VALIDATORS`，定义 `src/form/colorpicker` 中的DATEFIELD校验器列表。
 */
export const DATEFIELD_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ColorPickerField),
  multi: true
};

/**
 * Form field that opens one of the `color-*` picker style variants (sketch/chrome/compact/
 * github/material, chosen via `colorType`) in a popup, and binds the selected hex value to
 * the form control.
 * @zh 表单字段，在弹出层中打开某个 `color-*` 颜色选择器样式变体
 * （通过 `colorType` 选择 sketch/chrome/compact/github/material），
 * 并将选中的十六进制颜色值绑定到表单控件。
 */
@Component({
  selector: 'color-picker-field',
  templateUrl: 'color-picker.field.html',
  styleUrls: ['color-picker.field.scss'],
  host: {
    'role': 'color-picker',
    '[class.color-picker-field-disabled]': 'disabled',
    '[class.color-picker-field-opened]': 'opened',
    // '[class.mat-picker-popup]': 'opened',
    '[attr.aria-label]': 'label',
    '[attr.aria-required]': 'required?required.toString():false',
    '[attr.aria-disabled]': 'disabled?disabled.toString():false',

      hostID: 'color-picker-field' + Math.random().toString(36).substring(2, 15),

  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class ColorPickerField<F extends FieldConfig = FieldConfig> extends AbstractTrigger {

  /**
   * Template/content query reference `_mapInput` (`MatInput`) targeting map input.
   * @zh 模板/内容视图查询引用 `_mapInput`（`@ViewChild`），指向映射表输入属性。
   */
  @ViewChild(MatInput, { static: true }) _mapInput: MatInput;
  /**
   * Template/content query reference `input` (`ElementRef<any>`) targeting input.
   * @zh 模板/内容视图查询引用 `input`（`@ViewChild`），指向输入属性。
   */
  @ViewChild('input') input: ElementRef;

  /**
   * Input setter `field` updating field.
   * @zh 输入属性 `field` 的设置器，用于更新字段。
   * @param f - New field value (`any`) / 新的字段值（`any`）
   */
  @Input()
  override set field(f) {
    this._field = f;
    if (f.colorType) {
      this.colorType = f.colorType;
    }
  }
  /**
   * Gets the current field (`field: any`).
   * @zh 获取当前字段（`field: any`）。
   */
  override get field() { return this._field || {}; }

  /**
   * Property `colorType` (`"compact" | "sketch" | "chrome" | "github" | "material"`) storing color type (default: `'sketch'`).
   * @zh 属性 `colorType`（类型：`"compact" | "sketch" | "chrome" | "github" | "material"`），用于存储或配置颜色类型（默认值：`'sketch'`）。
   */
  public colorType: 'sketch' | 'chrome' | 'compact' | 'github' | 'material' = 'sketch';

  /**
   * Property `params` (`Record<string, unknown>`) storing params (default: `{}`).
   * @zh 属性 `params`（类型：`Record<string, unknown>`），用于存储或配置参数集合（默认值：`{}`）。
   */
  public params: Record<string, unknown> = {};

  /**
   * Property `label` (`string`) storing label (default: `''`).
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签（默认值：`''`）。
   */
  public label: string = '';

  /**
   * Property `_onChange` (`(value: any) => void`) storing on change (default: `() => { }`).
   * @zh 属性 `_onChange`（类型：`(value: any) => void`），用于存储或配置当变更（默认值：`() => { }`）。
   */
  _onChange: (value) => void = () => { };

  /**
   * Property `_onTouched` (`() => void`) storing on touched (default: `() => { }`).
   * @zh 属性 `_onTouched`（类型：`() => void`），用于存储或配置当是否已触碰（默认值：`() => { }`）。
   */
  _onTouched = () => { };


  /**
   * Gets the current value (`value: any`).
   * @zh 获取当前值（`value: any`）。
   */
  override get value() { 
    return this.formControl.value?this.formControl.value:this.field.defaultValue; 
  }
  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param val - New value value (`any`) / 新的值值（`any`）
   */
  override set value(val) {
      let _value = isObject(val)?this.coerceStringProperty(val['value']):this.coerceStringProperty(val);
      this._selected = _value;;
      this.field.inputValue = _value ;
      this.formControl.setValue(_value);
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
  set openOnFocus(value: boolean) { this._openOnFocus =  coerceBooleanProperty (value); }
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
   * Creates an instance of `ColorPickerField` and initializes its dependencies and internal state.
   * @zh 创建 `ColorPickerField` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _dialogService - Injected or initial dialog service (`DialogService`) / 注入或传入的对话框服务（`DialogService`）
   * @param _overlay - Injected or initial overlay (`Overlay`) / 注入或传入的浮层（`Overlay`）
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param _viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param _dir - Injected or initial dir (`Directionality`) / 注入或传入的目录（`Directionality`）
   * @param _document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(
    protected override _elementRef: ElementRef,
    protected override _dialogService: DialogService,
    protected override _overlay: Overlay,
    protected override _ngZone: NgZone,
    protected _viewContainerRef: ViewContainerRef,
    protected override translate: TranslateService,
    @Optional() protected override _dir: Directionality,
    @Optional() @Inject(DOCUMENT) protected override _document) {
    super(_elementRef, _dialogService, _overlay, _ngZone, translate, _dir, _document);
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  override init(): void {
    super.init();
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
   * Executes `coerceStringProperty` to handle coerce string property.
   * @zh 执行 `coerceStringProperty`，用于强制转换字符串属性。
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
   * @param val - val parameter (`string`) / 值参数（`string`）
   */
  override _selectAndClose(val: string): void {
    const oldValue = this._selected;
    this.value = val;
    if (oldValue != this._selected) {
      this._emitChangeEvent();
    }
    // this._mapInput.focus();
    // this._mapInput.ngDoCheck();
  }
  /**
   * Executes `open` to handle open.
   * @zh 执行 `open`，用于打开。
   */
  override open(): void {
    super.beforeOpen();
    let params: Record<string, unknown> = {};
    params['value'] = this.value;
    if (!this._portal) {
      if (this.colorType === 'material') {
        this._portal = new ComponentPortal(ColorPickerContent, this._viewContainerRef);
      } else {
        if (this.colorType === 'sketch') {
          this._portal = new ComponentPortal(SketchComponent, this._viewContainerRef);
        } else if (this.colorType === 'chrome') {
          this._portal = new ComponentPortal(ChromeComponent, this._viewContainerRef);
        } else if (this.colorType === 'compact') {
          this._portal = new ComponentPortal(CompactComponent, this._viewContainerRef);
        } else if (this.colorType === 'github') {
          this._portal = new ComponentPortal(GithubComponent, this._viewContainerRef);
        }
      }
    }
    super.postOpen(params);
  }
}
