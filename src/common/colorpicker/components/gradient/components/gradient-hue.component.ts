

import tinycolor from 'tinycolor2'
import {  ChangeDetectionStrategy,  Component,   ElementRef,   Input,   OnDestroy,  OnInit, ViewChild,} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';
import { PaintHueService } from '../hooks/paint-hue.service';
import { getHandleValue } from '../utils/utils'

@Component({
  selector: 'gradient-hue',
  templateUrl: './gradient-hue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class GradientHueComponent implements OnInit,OnDestroy {

  @ViewChild('paintSquare')   private barRef: ElementRef<HTMLElement>;

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
    this.paintHueService.paintHue(this.barRef.nativeElement, this.conext .squareWidth)
    window.addEventListener('mouseup', this.stopDragging)
  }

  ngOnDestroy(){
    window.removeEventListener('mouseup', this.stopDragging)
  }

  public stopDragging()  {
    this. setDragging(false)
  }

  public handleDown (){
   this.setDragging(true)
  }

  public handleHue = (e: any) => {
    const newHue = getHandleValue(e) * 3.6
    const tinyHsv = tinycolor({ h: newHue, s: this.conext .hc?.s, v: this.conext .hc?.v })
    const { r, g, b } = tinyHsv.toRgb()
    this.conext. handleChange(`rgba(${r}, ${g}, ${b}, ${this.conext .hc.a})`)
    this.conext. setHc({ ...this.conext .hc, h: newHue })
  }

  public handleMove = (e: any) => {
    if (this.dragging) {
    this.handleHue(e)
    }
  }

  public handleClick = (e: any) => {
    if (!this .dragging) {
     this. handleHue(e)
    }
  }
}
