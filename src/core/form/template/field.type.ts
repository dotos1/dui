import { Input, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {FieldConfig } from '../models/field.config';

@Directive()
export abstract class FieldType<F extends FieldConfig = FieldConfig> {

  defaultOptions?: F;

  @Input()
  set field (f: F | any) {
    this._field = f;
  }
  get field() {
    return this._field || {};
  }
  protected _field: F;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public init (conf?): void {}

  @Input()
  get model() { return this.field.model; }

  @Input()
  get form() { return <FormGroup> this.field.parent.formControl; }

  @Input()
  get option() { return this.field.option; }

  get name() { return this.field.name; }

  get formControl() { return this.field.formControl; }

  get showError(): boolean { return this.option.showError(this); }

  get id(): string { return this.field.id; }

  get formState() { return this.option.formState || {}; }
}
