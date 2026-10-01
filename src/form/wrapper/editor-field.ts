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


interface MatFieldConfig extends FieldConfig {
  _matPrefix: TemplateRef<any>;
  _matSuffix: TemplateRef<any>;
  __formField__: WrapperEditorField;
}


@Component({
  selector: 'editor-field-wrapper',
  templateUrl: './editor-field.html',
  styleUrls: ['./editor-field.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: WrapperEditorField }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {hostID: 'editor-field-wrapper' + Math.random().toString(36).substring(2, 15) },
})
export class WrapperEditorField extends FieldWrapper<MatFieldConfig> implements OnInit, OnDestroy, MatFormFieldControl<any>, AfterViewInit, AfterContentChecked {
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) declare fieldComponent: ViewContainerRef;
  @ViewChild(MatFormField, { static: true }) formField!: MatFormField;

  @ViewChild(PopoverTrigger, { static: true }) popoverTrigger!: PopoverTrigger;

  @ViewChild(Popover, { static: true }) popover!: Popover;

  stateChanges = new Subject<void>();
  _errorState = false;
  private initialGapCalculated = false;
  private focusSubscription?: Subscription;

  public showUnder = false;

  constructor(
    private config: FormConfig,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private _platform: Platform,
    private focusMonitor: FocusMonitor,
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.option.detectChanges!(this.field);
          }),
      ),
    );
    this.focusSubscription = this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      if (!origin && this.field.focused) {
        this.field.focused = false;
      }
    });
  }

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

  ngAfterViewInit() {
    if (this.field.hideFieldUnderline === true) {
      const underlineElement = this.formField._elementRef.nativeElement.querySelector('.mdc-line-ripple');
      underlineElement && this.renderer.removeChild(underlineElement.parentNode, underlineElement);
    }
  }

  ngOnDestroy() {
    delete this.field.__formField__;
    this.focusSubscription?.unsubscribe();
    this.focusMonitor.stopMonitoring(this.elementRef);
    // MatFormFieldControl 契约要求实现者在销毁时 complete 该 Subject。
    this.stateChanges.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDescribedByIds(ids: string[]): void { }

  public override init(): void {
    super.init();
    if (this.field.qtip && this.field.qtip === 'under') {
      if (!this._platform.IOS) {
        this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', ($event) => this.showTip($event));
        this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => this.hideTip());
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


