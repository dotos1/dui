import { Component, ChangeDetectionStrategy, } from '@angular/core';

@Component({
  selector: 'label-field',
  templateUrl: './label-field.html',
  styleUrls: ['./label-field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'label-field' + Math.random().toString(36).substring(2, 15),  
  }
})
export class LabelField {
  field:any;
  style:any;
  init(field){
    this.field=field;
  }
}
