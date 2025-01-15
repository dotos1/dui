


import {  ChangeDetectionStrategy,  Component,     Input,} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';
import { config } from '../constants';

@Component({
  selector: 'controls-component',
  templateUrl: './controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class ControlsComponent {

  @Input()     hideEyeDrop?: boolean=false;
  @Input()     hideColorTypeBtns?: boolean=false;
  @Input()     hideGradientControls?: boolean=false;
  @Input()     hideGradientType?: boolean=false;
  @Input()     hideGradientAngle?: boolean=false;
  @Input()     hideGradientStop?: boolean

  public conext:PickerContextProps;

  constructor(
    public contextService:ContextService
  ) {
    this.conext=contextService.getContext();
  }

  public get    noTools(){
    return this. hideEyeDrop ;
  } 

  public getControlClass(){
    return `context.classes.rbgcpControlBtnWrapper`;
  }

  public get isGradient(){
      return  this .conext.isGradient;
  }

  public  getClass(){
    return `${ this .conext.classes.ac} ${this.conext.classes.jsb}`;
  }

  public get solidColor(){
    return this.conext.previous?.color || config.defaultColor;
  }
  public get gradientColor(){
    return this.conext.previous?.gradient || config.defaultGradient;
  }

  public get allRightControlsHidden(){
    return this.hideEyeDrop;
  }
  public get allControlsHidden(){
    return this.allRightControlsHidden&&this. hideColorTypeBtns;
  }


  public setSolid = () => {
    this.conext .onChange(this.solidColor)
  }

   setGradient = () => {
    this.conext. onChange(this. gradientColor)
  }

 colorTypeBtnStyles  (selected: boolean, classes: any){
    if (selected) {
      return `${classes.rbgcpControlBtn} ${classes.rbgcpControlBtnSelected}`
    } else {
      return classes.rbgcpControlBtn
    }
  }
  
  controlBtnStyles  (selected: boolean, classes: any) {
    if (selected) {
      return `${classes.rbgcpControlIconBtn} ${classes.rbgcpControlBtnSelected}`
    } else {
      return classes.rbgcpControlIconBtn
    }
  }
  
  modalBtnStyles (selected: boolean, classes: any){
    if (selected) {
      return `${classes.rbgcpControlBtn} ${classes.rbgcpColorModelDropdownBtn} ${classes.rbgcpControlBtnSelected}`
    } else {
      return `${classes.rbgcpControlBtn} ${classes.rbgcpColorModelDropdownBtn}`
    }
  }
}

