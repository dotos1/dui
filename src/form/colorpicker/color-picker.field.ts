
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
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'color-picker-field',
  templateUrl: 'color-picker.field.html',
  styleUrls: ['color-picker.field.scss'],
  providers: [DATEINPUT_CONTROL_VALUE_ACCESSOR, DATEFIELD_VALIDATORS],
  host: {
    'role': 'color-picker',
    '[class.color-picker-field-disabled]': 'disabled',
    '[class.color-picker-field-opened]': 'opened',
    // '[class.mat-picker-popup]': 'opened',
    '[attr.aria-label]': 'label',
    '[attr.aria-required]': 'required?required.toString():false',
    '[attr.aria-disabled]': 'disabled?disabled.toString():false',
    'hostID': crypto.randomUUID().toString()
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


  override get value() { return this.formControl.value?this.formControl.value:this.field.defaultValue; }
  override set value(val: any) {

    if (isObject(val)) {
      let _value = this.coerceStringProperty(val['value']);
      this._selected = _value;
      this.formControl.setValue(_value);
      this.field.inputValue = this._selected ;
    } else {
      let _value = this.coerceStringProperty(val);
      this._selected = _value;
      this.formControl.setValue(_value);
      this.field.inputValue = this._selected ;
    }
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
    protected override _dialog: MatDialog,
    protected override _overlay: Overlay,
    protected override _ngZone: NgZone,
    protected _viewContainerRef: ViewContainerRef,
    protected override translate: TranslateService,
    @Optional() protected override _dir: Directionality,
    @Optional() @Inject(DOCUMENT) protected override _document: any) {
    super(_elementRef, _dialog, _overlay, _ngZone, translate, _dir, _document);
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
    this._mapInput.focus();
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
