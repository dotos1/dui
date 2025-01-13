
import throttle from 'lodash.throttle'
import tinycolor from 'tinycolor2';
import { computePickerPosition, computeSquareXY } from '../utils/utils';
import { config } from '../constants';

const { crossSize } = config
import {
  ChangeDetectionStrategy,  Component,  ElementRef,  Input,  OnInit,
  ViewChild,  
} from '@angular/core';
import { PaintHueService } from '../hooks/paint-hue.service';
import { ContextService, PickerContextProps } from '../hooks/context.service';


@Component({
  selector: 'square-component',
  templateUrl: './gradient-square.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class GradientSquareComponent implements OnInit {

  @ViewChild('paintSquare')   private canvasElm: ElementRef<HTMLElement>;

  @Input()  public  dragging?: boolean=false;
  @Input()  public  handleChange?;
  @Input()  public  setDragging?;

  public dragPos:any={};
  public setDragPos;
  public x=0;
  public y=0;
  public conext:PickerContextProps;
  
  constructor(
    private paintHueService: PaintHueService,
    public contextService:ContextService
  ) {
    this.conext=contextService.getContext();
  }

  ngOnInit(){
    this.paintHueService. paintSquare(this.canvasElm.nativeElement,this.conext.hc?.h,this.conext. squareWidth,this.conext. squareHeight);
     const [x, y] = computeSquareXY(this.conext. hc?.s,this.conext. hc?.v * 100, this.conext. squareWidth,this.conext. squareHeight)
  // const [dragPos, setDragPos] = useState({ x, y })
    if (!this. dragging) {
      this. setDragPos({ x: this.conext.hc?.v === 0 ?  this.dragPos.x :  x, y })
    }
    const handleUp = () => {
       this. stopDragging()
    }
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mouseup', handleUp)
    }
  }


  public  handleColor(e: any) {
    const onMouseMove = throttle(() => {
      const [x, y] = computePickerPosition(e)
      if (x && y) {
        const x1 = Math.min(x + crossSize / 2,this.conext. squareWidth - 1)
        const y1 = Math.min(y + crossSize / 2, this.conext. squareHeight - 1)
        const newS = (x1 /this.conext. squareWidth) * 100
        const newY = 100 - (y1 /this.conext. squareHeight) * 100
       this. setDragPos({ x: newY === 0 ?this. dragPos?.x : x, y })
        const updated = tinycolor(
          `hsva(${this.conext. hc?.h}, ${newS}%, ${newY}%, ${this.conext. hc?.a})`
        )
       this.handleChange(updated.toRgbString())
      }
    }, 250)
    onMouseMove()
  }

  public stopDragging = () => {
  this. setDragging(false)
  }

  public  handleMove = (e: any) => {
    if (this. dragging) {
     this.handleColor(e)
    }
  }

  // const handleTouchMove = (e: any) => {
  //   if (dragging && isMobile) {
  //     document.body.style.overflow = 'hidden'
  //     handleColor(e)
  //   }
  // }

public  handleClick (e: any){
    if (! this. dragging) {
     this.handleColor(e)
    }
  }

public   handleMouseDown  (){
 this.   setDragging(true)
  }

 public  handleCanvasDown (e: any) {
   this. setDragging(true)
  this.   handleColor(e)
  }
}