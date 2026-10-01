
import { low, high } from '../utils/formatters.js'
import { GradientProps } from '../shared/types.js'

import {
  ChangeDetectionStrategy,  Component,  Input,  
} from '@angular/core';


@Component({
  selector: 'gradient-bar-handle',
  templateUrl: './gradient-bar-handle.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class GradientBarHandleComponent {
  @Input()  public  left?: number;
  @Input()  public     i: number=0;
  @Input()    setDragging: (arg0: boolean) => void;
  @Input()  setInFocus: (arg0: string | null) => void;
  @Input()  context:any={};
  // colors, selectedColor, squareWidth, classes, createGradientStr
  
   public isSelected =this.context.selectedColor ===this.i;

   public leftMultiplyer = (this.context.squareWidth - 18) / 100;

   public get leftStyle(){
    return {
       left: (this.left || 0) * this. leftMultiplyer 
    }
   }
    
   public setSelectedColor = (index: number) => {
        const newGradStr =this.context. colors?.map((cc: GradientProps, i: number) => ({
          ...cc,
          value: i === index ? high(cc) : low(cc),
        }))
           this.context. createGradientStr(newGradStr)
      }
    
      public handleDown = (e: any) => {
        e.stopPropagation()
        this.  setSelectedColor(this.i);
         this. setDragging(true);
      }
    
     public handleFocus = () => {
        // setInFocus('gpoint')
      this.  setSelectedColor(this.i)
      }
    
      public handleBlur = () => {
        // setInFocus(null)
      }
    
}

