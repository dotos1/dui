/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/components/gradient-square.component.ts` providing gradient square component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/components/gradient-square.component.ts`，提供渐变square组件相关的定义与实现。
 */


import throttle from 'lodash.throttle'
import tinycolor from 'tinycolor2';
import { computePickerPosition, computeSquareXY } from '../utils/utils';
import { config } from '../constants';

/**
 * Constant/variable `{ crossSize }` defining { cross size } in `src/common/colorpicker/components/gradient/components`.
 * @zh 常量/变量 `{ crossSize }`，定义 `src/common/colorpicker/components/gradient/components` 中的{cross尺寸}。
 */
const { crossSize } = config
import {
  ChangeDetectionStrategy,  Component,  ElementRef,  Input,  OnDestroy,  OnInit,
  ViewChild,
} from '@angular/core';
import { PaintHueService } from '../hooks/paint-hue.service';
import { ContextService, PickerContextProps } from '../hooks/context.service';


/**
 * Angular component `GradientSquareComponent` (selector: 'square-component') providing gradient square component presentation and interaction in `src/common/colorpicker/components/gradient/components`.
 * @zh Angular 组件 `GradientSquareComponent`（selector: 'square-component'），提供渐变Square组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient/components`）。
 */
@Component({
  selector: 'square-component',
  templateUrl: './gradient-square.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,
})
export class GradientSquareComponent implements OnInit, OnDestroy {

  /**
   * Template/content query reference `canvasElm` (`ElementRef<HTMLElement>`) targeting canvas elm.
   * @zh 模板/内容视图查询引用 `canvasElm`（`@ViewChild`），指向画布Elm。
   */
  @ViewChild('paintSquare', { static: true })   private canvasElm: ElementRef<HTMLElement>;

  /**
   * Input property `dragging` (`boolean`) configuring dragging (default: `false`).
   * @zh 输入属性 `dragging`（类型：`boolean`），用于配置拖拽中（默认值：`false`）。
   */
  @Input()  public  dragging?: boolean=false;
  /**
   * Input property `handleChange` (`any`) configuring handle change.
   * @zh 输入属性 `handleChange`（类型：`any`），用于配置连接手柄变更。
   */
  @Input()  public  handleChange?;
  /**
   * Input property `setDragging` (`any`) configuring set dragging.
   * @zh 输入属性 `setDragging`（类型：`any`），用于配置集合拖拽中。
   */
  @Input()  public  setDragging?;

  /**
   * Property `dragPos` (`{ x?: any; }`) storing drag pos (default: `{}`).
   * @zh 属性 `dragPos`（类型：`{ x?: any; }`），用于存储或配置拖拽位置（默认值：`{}`）。
   */
  public dragPos:{ x? }={};
  /**
   * Property `setDragPos` (`(pos: any) => void`) storing set drag pos (default: `(pos: any) => { this.dragPos = pos; }`).
   * @zh 属性 `setDragPos`（类型：`(pos: any) => void`），用于存储或配置集合拖拽位置（默认值：`(pos: any) => { this.dragPos = pos; }`）。
   */
  public setDragPos = (pos) => {
    this.dragPos = pos;
  };
  /**
   * Property `x` (`number`) storing x (default: `0`).
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标（默认值：`0`）。
   */
  public x=0;
  /**
   * Property `y` (`number`) storing y (default: `0`).
   * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标（默认值：`0`）。
   */
  public y=0;
  /**
   * Property `conext` (`PickerContextProps`) storing conext.
   * @zh 属性 `conext`（类型：`PickerContextProps`），用于存储或配置conext。
   */
  public conext:PickerContextProps;
  
  /**
   * Creates an instance of `GradientSquareComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GradientSquareComponent` 实例，并初始化其依赖项与内部状态。
   * @param paintHueService - Injected or initial paint hue service (`PaintHueService`) / 注入或传入的绘制色相服务（`PaintHueService`）
   * @param contextService - Injected or initial context service (`ContextService`) / 注入或传入的上下文服务（`ContextService`）
   */
  constructor(
    private paintHueService: PaintHueService,
    public contextService:ContextService
  ) {
    this.conext=contextService.getContext();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(){
    this.paintHueService. paintSquare(this.canvasElm.nativeElement,this.conext.hc?.h,this.conext. squareWidth,this.conext. squareHeight);
     const [x, y] = computeSquareXY(this.conext. hc?.s,this.conext. hc?.v * 100, this.conext. squareWidth,this.conext. squareHeight)
  // const [dragPos, setDragPos] = useState({ x, y })
    if (!this. dragging) {
      this. setDragPos({ x: this.conext.hc?.v === 0 ?  this.dragPos.x :  x, y })
    }
    window.addEventListener('mouseup', this.handleUp)
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(){
    window.removeEventListener('mouseup', this.handleUp)
  }

  /**
   * Property `handleUp` (`() => void`) storing handle up (default: `() => { this.stopDragging() }`).
   * @zh 属性 `handleUp`（类型：`() => void`），用于存储或配置连接手柄向上（默认值：`() => { this.stopDragging() }`）。
   */
  private readonly handleUp = () => {
    this.stopDragging()
  }

  /**
   * Property `throttledMouseMove` (`any`) storing throttled mouse move.
   * @zh 属性 `throttledMouseMove`（类型：`any`），用于存储或配置已节流鼠标移动。
   */
  private readonly throttledMouseMove = throttle((e) => {
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
  }, 250);

  /**
   * Executes `handleColor` to handle handle color.
   * @zh 执行 `handleColor`，用于连接手柄颜色。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  public  handleColor(e) {
    this.throttledMouseMove(e);
  }

  /**
   * Property `stopDragging` (`() => void`) storing stop dragging (default: `() => { this. setDragging(false) }`).
   * @zh 属性 `stopDragging`（类型：`() => void`），用于存储或配置停止拖拽中（默认值：`() => { this. setDragging(false) }`）。
   */
  public stopDragging = () => {
  this. setDragging(false)
  }

  /**
   * Property `handleMove` (`(e: any) => void`) storing handle move.
   * @zh 属性 `handleMove`（类型：`(e: any) => void`），用于存储或配置连接手柄移动。
   */
  public  handleMove = (e) => {
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

/**
 * Executes `handleClick` to handle handle click.
 * @zh 执行 `handleClick`，用于连接手柄点击。
 * @param e - e parameter (`any`) / e参数（`any`）
 */
public  handleClick (e){
    if (! this. dragging) {
     this.handleColor(e)
    }
  }

/**
 * Executes `handleMouseDown` to handle handle mouse down.
 * @zh 执行 `handleMouseDown`，用于连接手柄鼠标向下。
 */
public   handleMouseDown  (){
 this.   setDragging(true)
  }

 /**
  * Executes `handleCanvasDown` to handle handle canvas down.
  * @zh 执行 `handleCanvasDown`，用于连接手柄画布向下。
  * @param e - e parameter (`any`) / e参数（`any`）
  */
 public  handleCanvasDown (e) {
   this. setDragging(true)
  this.   handleColor(e)
  }
}