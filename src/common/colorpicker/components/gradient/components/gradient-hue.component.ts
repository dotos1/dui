/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/components/gradient-hue.component.ts` providing gradient hue component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/components/gradient-hue.component.ts`，提供渐变色相组件相关的定义与实现。
 */



import tinycolor from 'tinycolor2'
import {  ChangeDetectionStrategy,  Component,   ElementRef,   Input,   OnDestroy,  OnInit, ViewChild,} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';
import { PaintHueService } from '../hooks/paint-hue.service';
import { getHandleValue } from '../utils/utils'

/**
 * Angular component `GradientHueComponent` (selector: 'gradient-hue') providing gradient hue component presentation and interaction in `src/common/colorpicker/components/gradient/components`.
 * @zh Angular 组件 `GradientHueComponent`（selector: 'gradient-hue'），提供渐变色相组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient/components`）。
 */
@Component({
  selector: 'gradient-hue',
  templateUrl: './gradient-hue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class GradientHueComponent implements OnInit,OnDestroy {

  /**
   * Template/content query reference `barRef` (`ElementRef<HTMLElement>`) targeting bar ref.
   * @zh 模板/内容视图查询引用 `barRef`（`@ViewChild`），指向条引用。
   */
  @ViewChild('paintSquare', { static: true })   private barRef: ElementRef<HTMLElement>;

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
   * Creates an instance of `GradientHueComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GradientHueComponent` 实例，并初始化其依赖项与内部状态。
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
    if (this.barRef?.nativeElement) {
      this.paintHueService.paintHue(this.barRef.nativeElement, this.conext .squareWidth)
    }
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
   * Property `stopDragging` (`() => void`) storing stop dragging.
   * @zh 属性 `stopDragging`（类型：`() => void`），用于存储或配置停止拖拽中。
   */
  public stopDragging = () => {
    // 挂在 window 的 mouseup 上,页面任何地方松开鼠标都会进来;没绑 [setDragging]
    // 的用法下直接调用会每次都抛 TypeError(b8c5e5c 复核)。
    if (typeof this.setDragging === 'function') {
      this.setDragging(false)
    }
  }

  /**
   * Executes `handleDown` to handle handle down.
   * @zh 执行 `handleDown`，用于连接手柄向下。
   */
  public handleDown (){
   this.setDragging(true)
  }

  /**
   * Property `handleHue` (`(e: any) => void`) storing handle hue.
   * @zh 属性 `handleHue`（类型：`(e: any) => void`），用于存储或配置连接手柄色相。
   */
  public handleHue = (e) => {
    const newHue = getHandleValue(e) * 3.6
    const tinyHsv = tinycolor({ h: newHue, s: this.conext .hc?.s, v: this.conext .hc?.v })
    const { r, g, b } = tinyHsv.toRgb()
    this.conext. handleChange(`rgba(${r}, ${g}, ${b}, ${this.conext .hc.a})`)
    this.conext. setHc({ ...this.conext .hc, h: newHue })
  }

  /**
   * Property `handleMove` (`(e: any) => void`) storing handle move.
   * @zh 属性 `handleMove`（类型：`(e: any) => void`），用于存储或配置连接手柄移动。
   */
  public handleMove = (e) => {
    if (this.dragging) {
    this.handleHue(e)
    }
  }

  /**
   * Property `handleClick` (`(e: any) => void`) storing handle click.
   * @zh 属性 `handleClick`（类型：`(e: any) => void`），用于存储或配置连接手柄点击。
   */
  public handleClick = (e) => {
    if (!this .dragging) {
     this. handleHue(e)
    }
  }
}
