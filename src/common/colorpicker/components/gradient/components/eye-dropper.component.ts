/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/components/eye-dropper.component.ts` providing eye dropper component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/components/eye-dropper.component.ts`，提供eyedropper组件相关的定义与实现。
 */


import html2canvas from 'html2canvas'
import tc from 'tinycolor2'
import {
  ChangeDetectionStrategy,  Component,   Input
} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';

/**
 * Angular component `EyeDropperComponent` (selector: 'eye-dropper-component') providing eye dropper component presentation and interaction in `src/common/colorpicker/components/gradient/components`.
 * @zh Angular 组件 `EyeDropperComponent`（selector: 'eye-dropper-component'），提供EyeDropper组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient/components`）。
 */
@Component({
  selector: 'eye-dropper-component',
  templateUrl: './eye-dropper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  
})
export class EyeDropperComponent  {

  /**
   * Input property `pickerCanvas` (`any`) configuring picker canvas.
   * @zh 输入属性 `pickerCanvas`（类型：`any`），用于配置选择器画布。
   */
  @Input()  public  pickerCanvas?;
  /**
   * Input property `onSelect` (`any`) configuring on select.
   * @zh 输入属性 `onSelect`（类型：`any`），用于配置当下拉选择。
   */
  @Input()  public  onSelect?;
  
  /**
   * Input property `setPickerCanvas` (`any`) configuring set picker canvas.
   * @zh 输入属性 `setPickerCanvas`（类型：`any`），用于配置集合选择器画布。
   */
  @Input()  public  setPickerCanvas?;
  /**
   * Input property `coverUp` (`boolean`) configuring cover up (default: `false`).
   * @zh 输入属性 `coverUp`（类型：`boolean`），用于配置cover向上（默认值：`false`）。
   */
  @Input()  public  coverUp?: boolean=false;
  /**
   * Input property `setCoverUp` (`any`) configuring set cover up.
   * @zh 输入属性 `setCoverUp`（类型：`any`），用于配置集合Cover向上。
   */
  @Input()  public  setCoverUp?;
  /**
   * Input property `color` (`any`) configuring color.
   * @zh 输入属性 `color`（类型：`any`），用于配置颜色。
   */
  @Input()  public  color?;


  /**
   * Property `style1` (`any`) storing style1.
   * @zh 属性 `style1`（类型：`any`），用于存储或配置style1。
   */
  public style1 = {
    fill: 'none',
    stroke: this.color,
    strokeWidth: '1.4px',
  }

  /**
   * Property `style2` (`any`) storing style2.
   * @zh 属性 `style2`（类型：`any`），用于存储或配置style2。
   */
  public style2 = {
    fill: this.color,
    stroke: this.color,
    strokeWidth: '1.4px',
  }

  /**
   * Property `context` (`PickerContextProps`) storing context.
   * @zh 属性 `context`（类型：`PickerContextProps`），用于存储或配置上下文。
   */
  public context:PickerContextProps;  

  /**
   * Executes `getClass` to handle get class.
   * @zh 执行 `getClass`，用于获取类名。
   */
  getClass(){
      return `${controlBtnStyles(this.coverUp,this.context. classes)} ${this.context. classes.rbgcpEyedropperBtn}`;
  }
  
  /**
   * Creates an instance of `EyeDropperComponent` and initializes its dependencies and internal state.
   * @zh 创建 `EyeDropperComponent` 实例，并初始化其依赖项与内部状态。
   * @param contextService - Injected or initial context service (`ContextService`) / 注入或传入的上下文服务（`ContextService`）
   */
  constructor(
    public contextService:ContextService,

  ) {
    this.context=contextService.getContext();
  }

   /**
    * Executes `takePick` to handle take pick.
    * @zh 执行 `takePick`，用于takePick。
    */
   takePick () {
    const root = document.getElementById('root')
    this.setCoverUp(true)
    html2canvas(root).then((canvas) => {
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

   /**
    * Executes `getColorLegacy` to handle get color legacy.
    * @zh 执行 `getColorLegacy`，用于获取颜色Legacy。
    * @param e - e parameter (`any`) / e参数（`any`）
    */
   getColorLegacy (e){
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

   /**
    * Executes `getEyeDrop` to handle get eye drop.
    * @zh 执行 `getEyeDrop`，用于获取Eye放置。
    */
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
        .then((result: { sRGBHex? }) => {
          const tinyHex = tc(result.sRGBHex)
          const { r, g, b } = tinyHex.toRgb()
          this.onSelect(`rgba(${r}, ${g}, ${b}, 1)`)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}

/**
 * Constant/variable `controlBtnStyles` defining control btn styles in `src/common/colorpicker/components/gradient/components`.
 * @zh 常量/变量 `controlBtnStyles`，定义 `src/common/colorpicker/components/gradient/components` 中的表单控件按钮样式集合。
 */
export const controlBtnStyles = (selected: boolean, classes: { rbgcpControlIconBtn?; rbgcpControlBtnSelected? }) => {
  if (selected) {
    return `${classes.rbgcpControlIconBtn} ${classes.rbgcpControlBtnSelected}`
  } else {
    return classes.rbgcpControlIconBtn
  }
}
