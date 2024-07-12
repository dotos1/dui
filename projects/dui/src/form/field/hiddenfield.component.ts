import { Component, ElementRef,ChangeDetectionStrategy } from '@angular/core';
import { MatField } from '../base/mat.field';

@Component({
  selector: 'hidden-field',
  templateUrl: './hiddenfield.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HiddenFieldComponent extends MatField {

  input: ElementRef;

  type = 'hidden';

}
