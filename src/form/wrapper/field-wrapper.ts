import { Component, ViewChild, ViewContainerRef, OnInit, OnDestroy, ChangeDetectionStrategy,Renderer2, AfterContentChecked, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FieldWrapper, FieldConfig } from '@dotos/dui/core/form';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';


interface MatFormFieldConfig extends FieldConfig {
  __formField__: ExtFieldWrapper;
  _componentFactory: any;
}

@Component({
  selector: 'dui-field-wrapper',
  template: `
      <ng-container #fieldComponent></ng-container>
      <mat-error [id]="null">
        <validation-message [field]="field"></validation-message>
      </mat-error>
      <mat-hint *ngIf="field.description" [id]="null">{{ field.description |translate}}</mat-hint>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MatFormFieldControl, useExisting: FieldWrapper }],
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class ExtFieldWrapper extends FieldWrapper<MatFormFieldConfig> implements OnInit, OnDestroy, MatFormFieldControl<any>, AfterContentChecked {

  @ViewChild('fieldComponent', { read: ViewContainerRef }) declare fieldComponent: ViewContainerRef;


  stateChanges = new Subject<void>();
  _errorState = false;
  private initialGapCalculated = false;

  constructor(private renderer: Renderer2,
    private _changeDetector: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    if (this.fieldConfig.hide && this.fieldConfig['appearance'] === 'outline') {
      this.initialGapCalculated = true;
    }
  }

  ngAfterContentChecked() {
    if (!this.initialGapCalculated || this.fieldConfig.hide) {
      return;
    }
    this.initialGapCalculated = true;
    this._changeDetector.detectChanges();
  }

  ngOnDestroy() {
    delete this.fieldConfig.__formField__;
    this.stateChanges.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDescribedByIds(ids: string[]): void { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onContainerClick(event: MouseEvent): void {
    this.fieldConfig['focusable'] = true;
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

  get fieldConfig() { return this.field as MatFormFieldConfig; }
}
