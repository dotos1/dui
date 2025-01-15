
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, Optional, ViewChild, ViewContainerRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from "@angular/material/icon";
import { MatInput } from '@angular/material/input';
import { DomSanitizer } from "@angular/platform-browser";
import { isObject } from 'lodash-es';

import { AbstractTrigger } from '@dotos/dui/form';
import { TranslateService } from '@dotos/dui/translator';

import { FontLoaderService } from './font-loader.service';
import { IconPickerComponent } from './icon-picker.component';

export const DATEINPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IconPickerField),
  multi: true,
};

export const DATEFIELD_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IconPickerField),
  multi: true
};

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
    'hostID': crypto.randomUUID().toString()
  },
  encapsulation: ViewEncapsulation.None,
})


export class IconPickerField extends AbstractTrigger implements OnInit {

  @ViewChild(MatInput) _mapInput: MatInput;
  @ViewChild('input') input: ElementRef;

  public mode: 'auto' | 'portrait' | 'landscape' = 'auto';


  _onChange: (value: any) => void = () => { };

  _onTouched = () => { };

  _type = 'FONT';
  _icon = '';

  label = '';

  override get value() { 
    return this._icon; 
  }
  override set value(val: any) {

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
      this.inputValue = val['text'];

      this.formControl.setValue(this._icon);
    } else {
      this._icon = this.coerceStringProperty(val);
      this._selected = this._icon;
      this._value = this._icon;
      if(val){
        let vals = val.split(':');
        this._type = vals[0];
        if (vals[0] == 'SVG') {
          this.matIconRegistry.addSvgIcon(
            vals[1],
            this.domSanitizer.bypassSecurityTrustResourceUrl(vals[2])
          );
        }
        this.inputValue = vals[1];
      }
      this.formControl.setValue(this._icon);
    }
  }

  get icon() {
    return this._icon;
  }
  protected override _value: string = 'base:menu';
  public inputValue: string = 'menu';

  get openOnFocus(): boolean { return this._openOnFocus; }
  set openOnFocus(value: boolean) { this._openOnFocus = coerceBooleanProperty(value); }
  private _openOnFocus: boolean;

  override set isOpen(value: boolean) {
    if (value && !this.opened) { this.open(); }
  }

  public override enableKeyEvents = true;

  protected maskRe;

  public fontStyle={};

  constructor(
    public _element: ElementRef,
    protected override _dialog: MatDialog,
    protected override _overlay: Overlay,
    protected override _ngZone: NgZone,
    protected _viewContainerRef: ViewContainerRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    protected override translate: TranslateService,
    protected fontLoaderService:FontLoaderService,
    @Optional() protected override _dir: Directionality,
    protected _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) protected override _document: any) {
    super(_element, _dialog, _overlay, _ngZone, translate, _dir, _document);
  }
  override ngOnInit() {
    super.ngOnInit();
    this.formControl.registerOnChange((value)=>{
      let fullIcon = value;

      let _icon;
      if (fullIcon) {
        if (fullIcon.startsWith("SVG")) {
          let vals = fullIcon.split(":");
          _icon = vals[1];
          this._type = vals[0];
          if(vals[2]){
            this.matIconRegistry.addSvgIcon(
              vals[1],
              this.domSanitizer.bypassSecurityTrustResourceUrl(vals[2])
            );
          }
          this._icon=fullIcon;
        } else if (fullIcon.startsWith("EXTRA")) {
            let vals = fullIcon.split(":");
            this.fontLoaderService.loadFonts(vals[1],vals[3],700).then(()=>{
              this._type = vals[0];
              _icon =String.fromCharCode(parseInt(vals[2],16));
            this.fontStyle={'font-family':vals[1]};
            this._icon=_icon;
            this._changeDetectorRef.detectChanges();
          });
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
        _icon = this.inputValue;
        this._icon=_icon;
      };
    });
  }
  isColor(value){
    if(value&&value.indexOf("#")!==-1){
      return true;
    }else{
      return false;
    }
  }
  private coerceStringProperty(value: any): string {
    const d: string = value ? value + '' : null;
    return d;
  }


  override _selectAndClose(val: any): void {
    const oldValue = this._selected;
    if(typeof(val) =='object' ){
      this.value = val.value;
    }else{
      this.value = val;
    }
    if (oldValue != this._selected) {
      this._emitChangeEvent();
    }
    this._mapInput.focus();
    this._mapInput.ngDoCheck();
    this.close();
  }

  clear() {
    this.value = undefined;
    this.field.inputValue = undefined;
  }

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
