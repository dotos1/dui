import { Component, ElementRef,ChangeDetectionStrategy } from '@angular/core';
import { MatField } from '../base/mat.field';

@Component({
  selector: 'hidden-field',
  templateUrl: './hiddenfield.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class HiddenFieldComponent extends MatField {

  input: ElementRef;

  type = 'hidden';

}
