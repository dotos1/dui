
import { getHandleValue } from '../utils/utils'
import { ContextService, PickerContextProps } from '../hooks/context.service'
import { low, high } from '../utils/formatters'
import {
  ChangeDetectionStrategy,  Component,  Input,
  OnDestroy,
  OnInit,  
} from '@angular/core';


@Component({
  selector: 'gradient-bar',
  templateUrl: './gradient-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class GradientBarComponent implements OnInit,OnDestroy {

  public conext:PickerContextProps;

  @Input()  public  dragging?: boolean=false;
  @Input()  public  setDragging?;
  @Input()  public  inFocus?: string='';
  @Input()  public  setInFocus?;


  constructor(
    public contextService:ContextService
  ) {
    this.conext=contextService.getContext();
  }

  ngOnInit(){
    const selectedEl = window?.document?.getElementById(
      `gradient-handle-${this.conext. selectedColor}`
    )
    if (selectedEl) {
      selectedEl.focus()
    }

    window.addEventListener('mouseup',this. handleUp)
    window?.addEventListener('keydown',this. handleKeyboard)
  }

  ngOnDestroy(){
    window.removeEventListener('mouseup',this. handleUp)
    window?.removeEventListener('keydown',this. handleKeyboard)
  }

  public  force90degLinear(color: string) {
    return color.replace(
      /(radial|linear)-gradient\([^,]+,/,
      'linear-gradient(90deg,'
    )
  }

  public  addPoint = (e: any) => {
    const left = getHandleValue(e)
    const newColors = [
      ... this.conext.colors.map((c: any) => ({ ...c, value: low(c) })),
      { value:  this.conext.currentColor, left: left },
    ]?.sort((a, b) => a.left - b.left)
    this.conext.createGradientStr(newColors)
  }

   stopDragging = () => {
     this. setDragging(false)
  }

   handleDown = (e: any) => {
    if (!this. dragging) {
      this.addPoint(e)
      this. setDragging(true)
    }
  }

   handleMove = (e: any) => {
    if (this. dragging) {
      this.conext. handleGradient(  this.conext.currentColor, getHandleValue(e))
    }
  }

   handleKeyboard = (e: any) => {
    if (  this.conext.isGradient) {
      if (e.keyCode === 8) {
        if (this. inFocus === 'gpoint') {
        this.conext.deletePoint()
        }
      }
    }
  }
   handleUp = () => {
    this. stopDragging()
  }
}
