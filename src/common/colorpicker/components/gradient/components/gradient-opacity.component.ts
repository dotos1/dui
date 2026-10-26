/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/components/gradient-opacity.component.ts` providing gradient opacity component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/components/gradient-opacity.component.ts`，提供渐变不透明度组件相关的定义与实现。
 */



import { getHandleValue } from '../utils/utils.js'
import {  ChangeDetectionStrategy,  Component,    Input,   OnDestroy,  OnInit} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';
import { PaintHueService } from '../hooks/paint-hue.service.js';

/**
 * Angular component `GradientOpacityComponent` (selector: 'gradient-opacity') providing gradient opacity component presentation and interaction in `src/common/colorpicker/components/gradient/components`.
 * @zh Angular 组件 `GradientOpacityComponent`（selector: 'gradient-opacity'），提供渐变不透明度组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient/components`）。
 */
@Component({
  selector: 'gradient-opacity',
  templateUrl: './gradient-opacity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  
})
export class GradientOpacityComponent implements OnInit,OnDestroy {
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
   * Property `conext` (`PickerContextProps`) storing conext.
   * @zh 属性 `conext`（类型：`PickerContextProps`），用于存储或配置conext。
   */
  public conext:PickerContextProps;

  /**
   * Creates an instance of `GradientOpacityComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GradientOpacityComponent` 实例，并初始化其依赖项与内部状态。
   * @param contextService - Injected or initial context service (`ContextService`) / 注入或传入的上下文服务（`ContextService`）
   * @param paintHueService - Injected or initial paint hue service (`PaintHueService`) / 注入或传入的绘制色相服务（`PaintHueService`）
   */
  constructor(
    public contextService:ContextService,
    private paintHueService: PaintHueService
  ) {
    this.conext=contextService.getContext();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(){
    window.addEventListener('mouseup', this.stopDragging)
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(){
    window.removeEventListener('mouseup', this.stopDragging)
  }

  /**
   * Gets the current bg (`bg: any`).
   * @zh 获取当前背景（`bg: any`）。
   */
  public get bg(){
    const { r, g, b } =this.conext. hc
    const bg = `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},.5) 100%)`
    return bg;
  }
  /**
   * Gets the current left (`left: any`).
   * @zh 获取当前左侧位置（`left: any`）。
   */
  public get left(){
    const squareWidth=this.conext. squareWidth
    const left = squareWidth - 18
    return left;
  }

  /**
   * Property `stopDragging` (`any`) storing stop dragging.
   * @zh 属性 `stopDragging`（类型：`any`），用于存储或配置停止拖拽中。
   */
  public stopDragging = () => {
    // 挂在 window 的 mouseup 上,页面任何地方松开鼠标都会进来;没绑 [setDragging]
    // 的用法下直接调用会每次都抛 TypeError(b8c5e5c 复核)。
    if (typeof this.setDragging === 'function') {
      this.setDragging(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `handleDown` to handle handle down.
   * @zh 执行 `handleDown`，用于连接手柄向下。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  public handleDown(e){
    this.  setDragging(true)
  }

  /**
   * Executes `handleOpacity` to handle handle opacity.
   * @zh 执行 `handleOpacity`，用于连接手柄不透明度。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  public handleOpacity(e){
    const newO = getHandleValue(e) / 100;
    const { r, g, b } =this.conext. hc;
    const newColor = `rgba(${r}, ${g}, ${b}, ${newO})`
     this.conext. handleChange(newColor)
  }

  /**
   * Executes `handleMove` to handle handle move.
   * @zh 执行 `handleMove`，用于连接手柄移动。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  public handleMove(e){
    if (this .dragging) {
    this.  handleOpacity(e)
    }
  }

  /**
   * Executes `handleClick` to handle handle click.
   * @zh 执行 `handleClick`，用于连接手柄点击。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  public handleClick(e){
    if (!this. dragging) {
      this. handleOpacity(e)
    }
  }
}

