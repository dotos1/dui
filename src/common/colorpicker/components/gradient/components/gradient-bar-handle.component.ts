/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/components/gradient-bar-handle.component.ts` providing gradient bar handle component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/components/gradient-bar-handle.component.ts`，提供渐变条连接手柄组件相关的定义与实现。
 */


import { low, high } from '../utils/formatters.js'
import { GradientProps } from '../shared/types.js'

import {
  ChangeDetectionStrategy,  Component,  Input,  
} from '@angular/core';


/**
 * Angular component `GradientBarHandleComponent` (selector: 'gradient-bar-handle') providing gradient bar handle component presentation and interaction in `src/common/colorpicker/components/gradient/components`.
 * @zh Angular 组件 `GradientBarHandleComponent`（selector: 'gradient-bar-handle'），提供渐变条连接手柄组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient/components`）。
 */
@Component({
  selector: 'gradient-bar-handle',
  templateUrl: './gradient-bar-handle.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,
})
export class GradientBarHandleComponent {
  /**
   * Input property `left` (`number`) configuring left.
   * @zh 输入属性 `left`（类型：`number`），用于配置左侧位置。
   */
  @Input()  public  left?: number;
  /**
   * Input property `i` (`number`) configuring i (default: `0`).
   * @zh 输入属性 `i`（类型：`number`），用于配置i（默认值：`0`）。
   */
  @Input()  public     i: number=0;
  /**
   * Input property `setDragging` (`(arg0: boolean) => void`) configuring set dragging.
   * @zh 输入属性 `setDragging`（类型：`(arg0: boolean) => void`），用于配置集合拖拽中。
   */
  @Input()    setDragging: (arg0: boolean) => void;
  /**
   * Input property `setInFocus` (`(arg0: string | null) => void`) configuring set in focus.
   * @zh 输入属性 `setInFocus`（类型：`(arg0: string | null) => void`），用于配置集合在聚焦。
   */
  @Input()  setInFocus: (arg0: string | null) => void;
  /**
   * Input property `context` (`{…}`) configuring context (default: `{}`).
   * @zh 输入属性 `context`（类型：`{…}`），用于配置上下文（默认值：`{}`）。
   */
  @Input()  context:{ selectedColor?; squareWidth?; colors?; createGradientStr? }={};
  // colors, selectedColor, squareWidth, classes, createGradientStr
  
   /**
    * Property `isSelected` (`boolean`) storing is selected (default: `this.context.selectedColor ===this.i`).
    * @zh 属性 `isSelected`（类型：`boolean`），用于存储或配置是否为已选中（默认值：`this.context.selectedColor ===this.i`）。
    */
   public isSelected =this.context.selectedColor ===this.i;

   /**
    * Property `leftMultiplyer` (`number`) storing left multiplyer (default: `(this.context.squareWidth - 18) / 100`).
    * @zh 属性 `leftMultiplyer`（类型：`number`），用于存储或配置左侧位置Multiplyer（默认值：`(this.context.squareWidth - 18) / 100`）。
    */
   public leftMultiplyer = (this.context.squareWidth - 18) / 100;

   /**
    * Gets the current left style (`leftStyle: any`).
    * @zh 获取当前左侧位置样式（`leftStyle: any`）。
    */
   public get leftStyle(){
    return {
       left: (this.left || 0) * this. leftMultiplyer 
    }
   }
    
   /**
    * Property `setSelectedColor` (`(index: number) => void`) storing set selected color.
    * @zh 属性 `setSelectedColor`（类型：`(index: number) => void`），用于存储或配置集合已选中颜色。
    */
   public setSelectedColor = (index: number) => {
        const newGradStr =this.context. colors?.map((cc: GradientProps, i: number) => ({
          ...cc,
          value: i === index ? high(cc) : low(cc),
        }))
           this.context. createGradientStr(newGradStr)
      }
    
      /**
       * Property `handleDown` (`(e: { stopPropagation?: any; }) => void`) storing handle down.
       * @zh 属性 `handleDown`（类型：`(e: { stopPropagation?: any; }) => void`），用于存储或配置连接手柄向下。
       */
      public handleDown = (e: { stopPropagation? }) => {
        e.stopPropagation()
        this.  setSelectedColor(this.i);
         this. setDragging(true);
      }
    
     /**
      * Property `handleFocus` (`() => void`) storing handle focus.
      * @zh 属性 `handleFocus`（类型：`() => void`），用于存储或配置连接手柄聚焦。
      */
     public handleFocus = () => {
        // setInFocus('gpoint')
      this.  setSelectedColor(this.i)
      }
    
      /**
       * Property `handleBlur` (`() => void`) storing handle blur (default: `() => { }`).
       * @zh 属性 `handleBlur`（类型：`() => void`），用于存储或配置连接手柄失焦（默认值：`() => { }`）。
       */
      public handleBlur = () => {
        // setInFocus(null)
      }
    
}

