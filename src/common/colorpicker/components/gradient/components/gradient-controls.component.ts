
import {
  ChangeDetectionStrategy,  Component,   Input
} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';
import { low, high } from '../utils/formatters';
import { formatInputValues } from '../utils/formatters';

@Component({
  selector: 'gradient-controls-component',
  templateUrl: './gradient-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': crypto.randomUUID().toString()}
})

export class GradientControlsComponent  {

  @Input()  public  hideGradientType?: boolean=false;
  @Input()  public  hideGradientAngle?: boolean=false;
  @Input()  public  hideGradientStop?: boolean=false;

  public context:PickerContextProps;  


  constructor(
    public contextService:ContextService,
  ) {
    this.context=contextService.getContext();
  }
  public get isRadial(){
    const   isRadial =   this.context .gradientType === 'radial-gradient'
    return isRadial;
}

public getLinearClass(){
    return `${this.context.classes.rbgcpControlBtn} ${this.isLinear && this.context.classes.rbgcpControlBtnSelected}`;
}
public getRadialClass(){
  return `${this.context.classes.rbgcpControlBtn} ${this.isRadial && this.context.classes.rbgcpControlBtnSelected}`;
}

public getGradientAngleClass(){
  return `${this.context.classes.rbgcpControlBtnWrapper} ${this.context.classes.rbgcpControlInputWrap} ${this.context.classes.rbgcpDegreeInputWrap}`;
}

public getGradientDegreeClass(){
  return `${this.context.classes.rbgcpControlInput} ${this.context.classes.rbgcpDegreeInput}`;
}
public getStopClass(){
  return `${this.context.classes.rbgcpControlBtnWrapper} ${this.context.classes.rbgcpControlInputWrap} ${this.context.classes.rbgcpStopInputWrap}`;
}

public getStopInputClass(){
  return `${this.context.classes.rbgcpControlInput} ${this.context.classes.rbgcpStopInput}`;
}

public controlBtnStyles  (selected: boolean, classes: any) {
  if (selected) {
    return `${classes.rbgcpControlIconBtn} ${classes.rbgcpControlBtnSelected}`
  } else {
    return classes.rbgcpControlIconBtn
  }
}


  public get isLinear(){
      const  isLinear =   this.context .gradientType === 'linear-gradient';
      return isLinear;
  }

  handleLinear () {
    const remaining = this.context. value.split(/,(.+)/)[1]
    this.context. onChange(`linear-gradient(90deg, ${remaining}`)
  }

   handleRadial () {
    const remaining =  this.context .value.split(/,(.+)/)[1]
    this.context.   onChange(`radial-gradient(circle, ${remaining}`)
  }


  public deletePoint  () {
    if ( this.context.colors?.length > 2) {
      const formatted = this.context. colors?.map((fc: any, i: number) => ({
        ...fc,
        value: i ===  this.context.selectedColor - 1 ? high(fc) : low(fc),
      }))
      const remaining = formatted?.filter(
        (_: any, i: number) => i !== this.context. selectedColor
      )
      this.context. createGradientStr(remaining)
    }
  }
  public handleDegrees  (e: any) {
    const newValue = formatInputValues(e.target.value, 0, 360)
    const remaining = this.context. value.split(/,(.+)/)[1]
    this.context.   onChange(`linear-gradient(${newValue || 0}deg, ${remaining}`)
  }

  public handleMove  (newVal: any) {
    this.context.  handleGradient(this.context. currentColor, formatInputValues(parseInt(newVal), 0, 100))
  }
}
