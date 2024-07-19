import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, Optional, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DomSanitizer } from "@angular/platform-browser";
import { Dui } from '@dotos/dui/core';
import { TranslateService } from '@dotos/dui/translator';
import * as _ from 'lodash-es';
import { isObject } from 'lodash-es';
import { AbstractTrigger } from './abstract.trigger';

@Component({
  selector: 'trigger-field',
  templateUrl: 'trigger.field.html',
  styleUrls: ['trigger.scss'],
  host: {
    'role': 'trigger',
    '[class.trigger-field-disabled]': 'disabled',
    '[class.trigger-field-opened]': 'opened',
    '[attr.aria-label]': 'label',
    '[attr.aria-required]': 'required?required.toString():false',
    '[attr.aria-disabled]': 'disabled?disabled.toString():false',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TriggerField extends AbstractTrigger implements AfterViewInit {

  @ViewChild(MatInput, { static: true }) _mapInput: MatInput;
  @ViewChild('input') input: ElementRef;

  private content: ComponentType<any>;

  _onChange: (value: any) => void = () => { };

  _onTouched = () => { };

  label: string;

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
    private _viewContainerRef: ViewContainerRef,
    public detectRef: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    protected override translate: TranslateService,
    @Optional() protected override _dir: Directionality,
    @Optional() @Inject(DOCUMENT) protected override _document: any) {
    super(_elementRef, _dialog, _overlay, _ngZone, translate, _dir, _document);
  }

  override init(): void {
    super.init();
    if (this.field.icon && this.field.icon.indexOf('svg') != -1) {
      let icon: string = this.field.icon;
      let iconName = icon.substring(icon.lastIndexOf('\\') + 1, icon.lastIndexOf('.'));
      this.matIconRegistry.addSvgIcon(
        iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon)
      );
      this.field.icon = iconName;
    }
    Dui.applyIf(this, this.field);
    this.field['classFormField']="trigger-form-field";
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    let val=this.field.formControl.value;
    if (_.isObjectLike(val) && val.text) {
      this._elementRef.nativeElement.children[0].value = val.text;
    }
  }

  private coerceStringProperty(value: any): string {
    
    const d: string = value ? value + '' : null;
    return d;
  }

  override _selectAndClose(val: string): void {
    const oldValue = this._selected;
    if (isObject(val)) {
      this.field.inputValue = val['text'];
      this._selected = this.coerceStringProperty(val['value']);
    } else {
      this.field.inputValue = this.coerceStringProperty(val);
      this._selected = this.coerceStringProperty(val);
    }
    this.value = val;
    if (oldValue != this._selected) {
      this._emitChangeEvent();
      if (this.field.change && typeof this.field.change == "function") {
        this.field.change(this, val);
      }
    }
    this._mapInput.focus();
    this._mapInput.ngDoCheck();
    this.close();
  }

  override open(): void {
    if (this.opened || this.disabled || this.field.disabled) {
      return;
    }
    super.beforeOpen();
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }
    if (this.touchUi) {
      this._dialogRef = this._dialog.open(this.content, {
        direction: this._dir ? this._dir.value : "ltr",
        viewContainerRef: this._viewContainerRef,
        panelClass: "mat-datetimepicker-dialog"
      });
    } else {
      if (!this._portal && this.content) {
        this._portal = new ComponentPortal(this.content, this._viewContainerRef);
      }
    }
    super.postOpen(this.field.params);
  }
}
