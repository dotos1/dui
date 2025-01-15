import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextFieldComponent } from './textfield.component';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

@Component({
  selector: 'textarea-field',
  templateUrl: './textarea.component.html',
  providers: [
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: TextAreaComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class TextAreaComponent extends TextFieldComponent {
  override defaultOptions = {
    cols: 1,
    rows: 3,
  };
}
