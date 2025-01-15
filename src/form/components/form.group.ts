import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@dotos/dui/core/form';

@Component({
  selector: 'form-group',
  templateUrl: './form.group.html',
  host: {
    class: 'field.fieldGroupClassName || ""',
    style: 'flex:1; box-sizing:  align-items: center;border-box; place-content: center flex-start;',
    'hostID': crypto.randomUUID().toString()
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormGroup extends FieldType {
  public getStyle(field) {
    return {
      'display': field.hidden ? "none" : ""
    };
  }
  override defaultOptions = {
    defaultValue: {},
  };
}
