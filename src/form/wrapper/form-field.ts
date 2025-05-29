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

import { Subject } from 'rxjs';
interface MatFieldConfig extends FieldConfig {
  _matPrefix: TemplateRef<any>;
  _matSuffix: TemplateRef<any>;
  __formField__: WrapperFormField;
}
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
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) declare fieldComponent: ViewContainerRef;
  @ViewChild(MatFormField, { static: true }) formField!: MatFormField;
  // textField !: MDCTextField;

  stateChanges = new Subject<void>();
  _errorState = false;
  private initialGapCalculated = false;

  public toolTip: string;

  public underTip: string;

  public showUnder = false;

  public classFormField="";

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private _platform: Platform,
    private focusMonitor: FocusMonitor,
    public themeService: ThemeService,
    private _changeDetector: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    defineHiddenProp(this.field, '__formField__', this.formField);
    ['prefix', 'suffix'].forEach((type) =>
      observe<TemplateRef<any>>(
        this.field,
        [ type],
        ({ currentValue }) =>
          currentValue &&
          Promise.resolve().then(() => {
            (<any>this.field)[`_mat${type}`] = currentValue;
            this.option.detectChanges!(this.field);
          }),
      ),
    );
    if (this.field.hide && this.field.appearance === 'outline') {
      this.initialGapCalculated = true;
    }
    this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      if (!origin && this.field.focused) {
        this.field.focused = false;
        // this.textField?.getDefaultFoundation().deactivateFocus();;
      }
    });
  }

  ngAfterContentChecked() {
    if (!this.initialGapCalculated || this.fieldConfig.hide) {
      return;
    }
    this.formField._refreshOutlineNotchWidth();//.updateOutlineGap();
    this.initialGapCalculated = true;
    this._changeDetector.detectChanges();
  }

  ngAfterViewInit() {
    let el=this.formField._elementRef.nativeElement;
    // this.textField = new MDCTextField(el.querySelector('.mdc-text-field'));
    if (this.formField.appearance !== 'outline' && this.field.hideFieldUnderline === true) {
      const underlineElement = el.querySelector('.mdc-line-ripple');
      underlineElement && this.renderer.removeChild(underlineElement.parentNode, underlineElement);
    }
  }

  ngOnDestroy() {
    delete this.field.__formField__;
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  public override init(): void {
    super.init();
    if (this.field.qtip && this.field.qtip === 'under') {
      if (!this._platform.IOS) {
        this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', ($event) => this.showTip($event));
        this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => this.hideTip());
      }
      this.underTip = this.field.description;
      if(this.field.classFormField){
        this.classFormField= this.field.classFormField;
      }

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onContainerClick(event: MouseEvent): void {
    this.fieldConfig.focused = true;
    this.stateChanges.next();
  }

  get errorState() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const showError = this.option!.showError!(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }
    return showError;
  }

  get color() { return this.field.color || 'accent'; }
  get controlType() { return this.field.type; }
  get focused() { return !!this.fieldConfig.focused && !this.disabled; }
  get disabled() { return !!this.field.disabled; }
  get required() { return !!this.field.required; }
  get placeholder() { return this.field.placeholder || ''; }
  get shouldPlaceholderFloat() { return this.shouldLabelFloat; }
  get value() { return this.formControl.value; }
  get ngControl() { return this.formControl as any; }
  get empty() { return !this.formControl.value; }
  get shouldLabelFloat() { return this.focused || !this.empty; }
  get fieldConfig() { return this.field as MatFieldConfig; }
}
