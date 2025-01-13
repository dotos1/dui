import { Component, ViewChild, AfterViewInit,  ChangeDetectionStrategy, Renderer2, OnDestroy } from '@angular/core';
import { MatField } from '../base/mat.field';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { TranslateService } from '@dotos/dui/translator';

@Component({
  selector: 'checkbox-field',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxField extends MatField implements AfterViewInit,OnDestroy {

  @ViewChild(MatCheckbox, { static: true }) checkbox!: MatCheckbox;

  override defaultOptions = {
    hideFieldUnderline: true,
    indeterminate: true,
    floatLabel: 'always',
    hideLabel: true,
    align: 'start',
    color: 'accent',  // start or end
  };
  private _required!: boolean;
  constructor(
    private renderer: Renderer2,
    protected override translate: TranslateService ) {
    super(translate);
  }

  override onContainerClick(event: MouseEvent): void {
    this.checkbox.focus();
    super.onContainerClick(event);
  }

  change($event: MatCheckboxChange) {
    if (this.field.change) {
      // this.field.value=this.field.formControl.value;
      this.field.change(this.field, $event);
    }
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.required !== this._required && this.checkbox && this.checkbox._inputElement) {
      this._required = this.required;
      const inputElement = this.checkbox._inputElement.nativeElement;
      if (this.required) {
        this.renderer.setAttribute(inputElement, 'required', 'required');
      } else {
        this.renderer.removeAttribute(inputElement, 'required');
      }
    }
  }
  override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
