import { Component, ViewChild, ViewContainerRef,  OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';

import { Subject } from 'rxjs';
import { Renderer2, ElementRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { FieldConfig } from '@dotos/dui/core/form';
import { FieldWrapper } from '@dotos/dui/core/form';

@Component({
  selector: 'label-field-wrapper',
  templateUrl: './label-field.html',
  styleUrls: ['./label-field.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: LabelWrapperField }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host:{ hostID: 'label-field-wrapper' + Math.random().toString(36).substring(2, 15),}
})
export class LabelWrapperField extends FieldWrapper<FieldConfig> implements  OnDestroy, MatFormFieldControl<any> {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) declare fieldComponent: ViewContainerRef;

  stateChanges = new Subject<void>();
  _errorState = false;

  public underTip: string;

  private _enterListener: Function;

  private _leaveListener: Function;

  public showUnder = false;
  public options: any;

  constructor(private _elementRef: ElementRef,
    private renderer: Renderer2,
    private _platform: Platform,
    private _changeDetector: ChangeDetectorRef, ) {
    super();
  }

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
  showTip(e) {
    this.showUnder = true;
    this._changeDetector.detectChanges();
  }
  hideTip() {
    this.showUnder = false;
    this._changeDetector.detectChanges();
  }

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
  setDescribedByIds(ids: string[]): void { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onContainerClick(event: MouseEvent): void {
    this.field.focused = true;
    this.stateChanges.next();
  }

  get errorState() {
    const showError = this.options.showError(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }
    return showError;
  }

  get focused() { return !!this.fieldConfig.focused && !this.disabled; }
  get disabled() { return !!this.field.disabled; }
  get required() { return !!this.field.required; }
  get placeholder() { return this.field.placeholder || ''; }
  get shouldPlaceholderFloat() { return this.shouldLabelFloat; }
  get value() { return this.formControl.value; }
  get ngControl() { return this.formControl as any; }
  get empty() { return !this.formControl.value; }
  get shouldLabelFloat() { return this.focused || !this.empty; }

  get fieldConfig() { return this.field as FieldConfig; }
}
