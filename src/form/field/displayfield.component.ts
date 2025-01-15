import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextFieldComponent } from './textfield.component';

@Component({
  selector: 'display-field',
  templateUrl: './displayfield.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class DisplayFieldComponent extends TextFieldComponent {

  type: string = 'display';

  xtype: string = 'displayfield';

}
