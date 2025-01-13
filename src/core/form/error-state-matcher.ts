import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class ExtErrorStateMatcher implements ErrorStateMatcher {
  constructor(private field: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.field && this.field.showError;
  }
}
