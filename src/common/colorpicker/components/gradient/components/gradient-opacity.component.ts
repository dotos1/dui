

import { getHandleValue } from '../utils/utils.js'
import {  ChangeDetectionStrategy,  Component,    Input,   OnDestroy,  OnInit} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';
import { PaintHueService } from '../hooks/paint-hue.service.js';

@Component({
  selector: 'gradient-opacity',
  templateUrl: './gradient-opacity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class GradientOpacityComponent implements OnInit,OnDestroy {
  @Input()  public  dragging?: boolean=false;
  @Input()  public  setDragging?;

  public conext:PickerContextProps;

  constructor(
    public contextService:ContextService,
    private paintHueService: PaintHueService
  ) {
    this.conext=contextService.getContext();
  }

  ngOnInit(){
    window.addEventListener('mouseup', this.stopDragging)
  }

  ngOnDestroy(){
    window.removeEventListener('mouseup', this.stopDragging)
  }

  public get bg(){
    const { r, g, b } =this.conext. hc
    const bg = `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},.5) 100%)`
    return bg;
  }
  public get left(){
    const squareWidth=this.conext. squareWidth
    const left = squareWidth - 18
    return left;
  }

  public stopDragging (){
    this. setDragging(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleDown(e){
    this.  setDragging(true)
  }

  public handleOpacity(e: any){
    const newO = getHandleValue(e) / 100;
    const { r, g, b } =this.conext. hc;
    const newColor = `rgba(${r}, ${g}, ${b}, ${newO})`
     this.conext. handleChange(newColor)
  }

  public handleMove(e: any){
    if (this .dragging) {
    this.  handleOpacity(e)
    }
  }

  public handleClick(e: any){
    if (!this. dragging) {
      this. handleOpacity(e)
    }
  }
}

