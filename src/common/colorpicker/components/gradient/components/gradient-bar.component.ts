/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/components/gradient-bar.component.ts` providing gradient bar component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/components/gradient-bar.component.ts`，提供渐变条组件相关的定义与实现。
 */


import { getHandleValue } from '../utils/utils'
import { ContextService, PickerContextProps } from '../hooks/context.service'
import { low, high } from '../utils/formatters'
import {
  ChangeDetectionStrategy,  Component,  Input,
  OnDestroy,
  OnInit,  
} from '@angular/core';


/**
 * Angular component `GradientBarComponent` (selector: 'gradient-bar') providing gradient bar component presentation and interaction in `src/common/colorpicker/components/gradient/components`.
 * @zh Angular 组件 `GradientBarComponent`（selector: 'gradient-bar'），提供渐变条组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient/components`）。
 */
@Component({
  selector: 'gradient-bar',
  templateUrl: './gradient-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,
})
export class GradientBarComponent implements OnInit,OnDestroy {

  /**
   * Property `conext` (`PickerContextProps`) storing conext.
   * @zh 属性 `conext`（类型：`PickerContextProps`），用于存储或配置conext。
   */
  public conext:PickerContextProps;

  /**
   * Input property `dragging` (`boolean`) configuring dragging (default: `false`).
   * @zh 输入属性 `dragging`（类型：`boolean`），用于配置拖拽中（默认值：`false`）。
   */
  @Input()  public  dragging?: boolean=false;
  /**
   * Input property `setDragging` (`any`) configuring set dragging.
   * @zh 输入属性 `setDragging`（类型：`any`），用于配置集合拖拽中。
   */
  @Input()  public  setDragging?;
  /**
   * Input property `inFocus` (`string`) configuring in focus (default: `''`).
   * @zh 输入属性 `inFocus`（类型：`string`），用于配置在聚焦（默认值：`''`）。
   */
  @Input()  public  inFocus?: string='';
  /**
   * Input property `setInFocus` (`any`) configuring set in focus.
   * @zh 输入属性 `setInFocus`（类型：`any`），用于配置集合在聚焦。
   */
  @Input()  public  setInFocus?;


  /**
   * Creates an instance of `GradientBarComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GradientBarComponent` 实例，并初始化其依赖项与内部状态。
   * @param contextService - Injected or initial context service (`ContextService`) / 注入或传入的上下文服务（`ContextService`）
   */
  constructor(
    public contextService:ContextService
  ) {
    this.conext=contextService.getContext();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
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

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(){
    window.removeEventListener('mouseup',this. handleUp)
    window?.removeEventListener('keydown',this. handleKeyboard)
  }

  /**
   * Executes `force90degLinear` to handle force90deg linear.
   * @zh 执行 `force90degLinear`，用于force90degLinear。
   * @param color - color parameter (`string`) / 颜色参数（`string`）
   */
  public  force90degLinear(color: string) {
    return color.replace(
      /(radial|linear)-gradient\([^,]+,/,
      'linear-gradient(90deg,'
    )
  }

  /**
   * Property `addPoint` (`(e: any) => void`) storing add point.
   * @zh 属性 `addPoint`（类型：`(e: any) => void`），用于存储或配置添加坐标点。
   */
  public  addPoint = (e) => {
    const left = getHandleValue(e)
    const newColors = [
      ... this.conext.colors.map((c) => ({ ...c, value: low(c) })),
      { value:  this.conext.currentColor, left: left },
    ]?.sort((a, b) => a.left - b.left)
    this.conext.createGradientStr(newColors)
  }

   /**
    * Property `stopDragging` (`() => void`) storing stop dragging (default: `() => { this. setDragging(false) }`).
    * @zh 属性 `stopDragging`（类型：`() => void`），用于存储或配置停止拖拽中（默认值：`() => { this. setDragging(false) }`）。
    */
   stopDragging = () => {
     this. setDragging(false)
  }

   /**
    * Property `handleDown` (`(e: any) => void`) storing handle down.
    * @zh 属性 `handleDown`（类型：`(e: any) => void`），用于存储或配置连接手柄向下。
    */
   handleDown = (e) => {
    if (!this. dragging) {
      this.addPoint(e)
      this. setDragging(true)
    }
  }

   /**
    * Property `handleMove` (`(e: any) => void`) storing handle move.
    * @zh 属性 `handleMove`（类型：`(e: any) => void`），用于存储或配置连接手柄移动。
    */
   handleMove = (e) => {
    if (this. dragging) {
      this.conext. handleGradient(  this.conext.currentColor, getHandleValue(e))
    }
  }

   /**
    * Property `handleKeyboard` (`(e: any) => void`) storing handle keyboard.
    * @zh 属性 `handleKeyboard`（类型：`(e: any) => void`），用于存储或配置连接手柄键盘。
    */
   handleKeyboard = (e) => {
    if (  this.conext.isGradient) {
      if (e.keyCode === 8) {
        if (this. inFocus === 'gpoint') {
        this.conext.deletePoint()
        }
      }
    }
  }
   /**
    * Property `handleUp` (`() => void`) storing handle up (default: `() => { this. stopDragging() }`).
    * @zh 属性 `handleUp`（类型：`() => void`），用于存储或配置连接手柄向上（默认值：`() => { this. stopDragging() }`）。
    */
   handleUp = () => {
    this. stopDragging()
  }
}
