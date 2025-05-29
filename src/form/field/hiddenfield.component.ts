import { Component, ElementRef,ChangeDetectionStrategy } from '@angular/core';
import { MatField } from '../base/mat.field';

@Component({
  selector: 'hidden-field',
  templateUrl: './hiddenfield.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'hidden-field' + Math.random().toString(36).substring(2, 15)
  }
})
export class HiddenFieldComponent extends MatField {

  input: ElementRef;

  type = 'hidden';

}
