
import html2canvas from 'html2canvas'
import tc from 'tinycolor2'
import {
  ChangeDetectionStrategy,  Component,   Input
} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';

@Component({
  selector: 'eye-dropper-component',
  templateUrl: './eye-dropper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class EyeDropperComponent  {

  @Input()  public  pickerCanvas?: any;
  @Input()  public  onSelect?: any;
  
  @Input()  public  setPickerCanvas?: any;
  @Input()  public  coverUp?: boolean=false;
  @Input()  public  setCoverUp?: any;
  @Input()  public  color?: any;


  public style1 = {
    fill: 'none',
    stroke: this.color,
    strokeWidth: '1.4px',
  }

  public style2 = {
    fill: this.color,
    stroke: this.color,
    strokeWidth: '1.4px',
  }

  public context:PickerContextProps;  

  getClass(){
      return `${controlBtnStyles(this.coverUp,this.context. classes)} ${this.context. classes.rbgcpEyedropperBtn}`;
  }
  
  constructor(
    public contextService:ContextService,

  ) {
    this.context=contextService.getContext();
  }

   takePick () {
    const root = document.getElementById('root')
    this.setCoverUp(true)
    html2canvas(root).then((canvas: any) => {
      const blankCanvas = document.createElement('canvas')
      const ctx = blankCanvas.getContext('2d', { willReadFrequently: true })
      if (root && ctx) {
        blankCanvas.width = root.offsetWidth * 2
        blankCanvas.height = root.offsetHeight * 2
        ctx.drawImage(canvas, 0, 0)
      }
     this. setPickerCanvas(ctx)
    })
  }

   getColorLegacy (e: any){
    e.stopPropagation()
    if (this. pickerCanvas) {
      const { pageX, pageY } = e
      const x1 = pageX * 2
      const y1 = pageY * 2
      const [r, g, b] =this. pickerCanvas.getImageData(x1, y1, 1, 1).data
    this. onSelect(`rgba(${r}, ${g}, ${b}, 1)`)
    }
    this. setCoverUp(false)
  }

   getEyeDrop () {
    // @ts-expect-error - ts does not evaluate for window.EyeDropper
    if (!window.EyeDropper) {
     this. takePick()
    } else {
      // @ts-expect-error - ts does not evaluate for window.EyeDropper
      const eyeDropper = new window.EyeDropper()
      const abortController = new window.AbortController()
      eyeDropper
        .open({ signal: abortController.signal })
        .then((result: any) => {
          const tinyHex = tc(result.sRGBHex)
          const { r, g, b } = tinyHex.toRgb()
          this.onSelect(`rgba(${r}, ${g}, ${b}, 1)`)
        })
        .catch((e: any) => {
          console.log(e)
        })
    }
  }
}

export const controlBtnStyles = (selected: boolean, classes: any) => {
  if (selected) {
    return `${classes.rbgcpControlIconBtn} ${classes.rbgcpControlBtnSelected}`
  } else {
    return classes.rbgcpControlIconBtn
  }
}
