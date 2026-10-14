
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


export const DATEINPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorPickerField),
  multi: true,
};

export const DATEFIELD_VALIDATORS: any = {
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

  @ViewChild(MatInput, { static: true }) _mapInput: MatInput;
  @ViewChild('input') input: ElementRef;

  @Input()
  override set field(f: F | any) {
    this._field = f;
    if (f.colorType) {
      this.colorType = f.colorType;
    }
  }
  override get field() { return this._field || {}; }

  public colorType: 'sketch' | 'chrome' | 'compact' | 'github' | 'material' = 'sketch';

  public params: any = {};

  public label: string = '';

  _onChange: (value: any) => void = () => { };

  _onTouched = () => { };


  override get value() { 
    return this.formControl.value?this.formControl.value:this.field.defaultValue; 
  }
  override set value(val: any) {
      let _value = isObject(val)?this.coerceStringProperty(val['value']):this.coerceStringProperty(val);
      this._selected = _value;;
      this.field.inputValue = _value ;
      this.formControl.setValue(_value);
  }

  get openOnFocus(): boolean { return this._openOnFocus; }
  set openOnFocus(value: boolean) { this._openOnFocus =  coerceBooleanProperty (value); }
  private _openOnFocus: boolean;

  override set isOpen(value: boolean) {
    if (value && !this.opened) { this.open(); }
  }

  public override enableKeyEvents = true;

  protected maskRe;

  constructor(
    protected override _elementRef: ElementRef,
    protected override _dialogService: DialogService,
    protected override _overlay: Overlay,
    protected override _ngZone: NgZone,
    protected _viewContainerRef: ViewContainerRef,
    protected override translate: TranslateService,
    @Optional() protected override _dir: Directionality,
    @Optional() @Inject(DOCUMENT) protected override _document: any) {
    super(_elementRef, _dialogService, _overlay, _ngZone, translate, _dir, _document);
  }

  override init(): void {
    super.init();
  }

  clear() {
    this.value = undefined;
    this.field.inputValue = undefined;
  }

  private coerceStringProperty(value: any): string {
    const d: string = value ? value + '' : null;
    return d;
  }

  override _selectAndClose(val: string): void {
    const oldValue = this._selected;
    this.value = val;
    if (oldValue != this._selected) {
      this._emitChangeEvent();
    }
    // this._mapInput.focus();
    // this._mapInput.ngDoCheck();
  }
  override open(): void {
    super.beforeOpen();
    let params = {};
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
