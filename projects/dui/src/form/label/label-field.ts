import { Component, ChangeDetectionStrategy, } from '@angular/core';

@Component({
  selector: 'label-field',
  templateUrl: './label-field.html',
  styleUrls: ['./label-field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelField {
  field:any;
  style:any;
  init(field){
    this.field=field;
  }
}
