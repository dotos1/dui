
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { Dui } from '@dotos/dui/core';
import { TranslateService } from '@dotos/dui/translator';
import {isObjectLike}  from 'lodash-es';
import { MatField } from '../base/mat.field';

@Component({
  selector: 'number-field',
  templateUrl: './numberfield.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    .unit-select {
      width:50px
    }
    .unit-select  .mat-select-trigger .mat-select-value{
      text-align: end;
    }
  `,
  ],
  host: {
    hostID: 'number-field' + Math.random().toString(36).substring(2, 15),
  }
  
})
export class NumberFieldComponent extends MatField implements AfterViewInit {

  type: string = 'number';

  defaultUnit='';

  currentUnit='';

  units=[];

  constructor(
    protected _elementRef: ElementRef,
    protected override translate: TranslateService
  ) {
    super(translate);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit()
    let val=this.field.formControl.value;
    if (isObjectLike(val) && val.text) {
      this._elementRef.nativeElement.children[0].value = val.text;
    }
  }

  override init(): void {
    super.init();
    if (this.field.xtype=='number-field'&& this.field.min != undefined) {
      let minErrorText= this.field.minText?this.translate.instant(this.field.minText):this.translate.instant("FORM.MINTEXT");
      this.field.validation.messages['min'] = Dui.format(minErrorText, this.field.min);
    }
    if (this.field.xtype=='number-field'&& this.field.max != undefined) {
      let maxErrorText= this.field.maxText?this.translate.instant(this.field.maxText):this.translate.instant("FORM.MAXTEXT");
      this.field.validation.messages['max'] = Dui.format(maxErrorText, this.field.max);
    }
    if(this.field.unit){
      this.defaultUnit=this.field.unit.nativeUnit;
      this.currentUnit=this.field.unit.nativeUnit;
      this.units=this.field.unit.units;
    }
  }

  unitchange(event){
    this.currentUnit=event.value;
    let unit=this.units.filter((u)=>u.id== this.currentUnit)[0];
    if(this.currentUnit!=this.defaultUnit){
      if(this.field.formControl.value!=''){
        let val=this.field.formControl.value;
        this.field.inputValue=val*unit.factor+unit.offset;
      }
    }else{
      if(this.field.formControl.value!=''){
        let val=this.field.formControl.value;
        this.field.inputValue=val;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange(e) {
    let unit=this.units.filter((u)=>u.id== this.currentUnit)[0];
    if(this.currentUnit!=this.defaultUnit){
      if(this.field.formControl.value!=''){
        let val=this.field.formControl.value;
        this.field.formControl.patchValue((val-unit.offset)/unit.factor);
        this.field.inputValue=val;
      }
    }else{
        let val=this.field.formControl.value;
        this.field.inputValue=val;
    }
  }
}
