/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/components/gradient-controls.component.ts` providing gradient controls component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/components/gradient-controls.component.ts`，提供渐变控件集合组件相关的定义与实现。
 */


import {
  ChangeDetectionStrategy,  Component,   Input
} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';
import { low, high } from '../utils/formatters';
import { formatInputValues } from '../utils/formatters';

/**
 * Angular component `GradientControlsComponent` (selector: 'gradient-controls-component') providing gradient controls component presentation and interaction in `src/common/colorpicker/components/gradient/components`.
 * @zh Angular 组件 `GradientControlsComponent`（selector: 'gradient-controls-component'），提供渐变控件集合组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient/components`）。
 */
@Component({
  selector: 'gradient-controls-component',
  templateUrl: './gradient-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,
  
})

export class GradientControlsComponent  {

  /**
   * Input property `hideGradientType` (`boolean`) configuring hide gradient type (default: `false`).
   * @zh 输入属性 `hideGradientType`（类型：`boolean`），用于配置隐藏渐变类型（默认值：`false`）。
   */
  @Input()  public  hideGradientType?: boolean=false;
  /**
   * Input property `hideGradientAngle` (`boolean`) configuring hide gradient angle (default: `false`).
   * @zh 输入属性 `hideGradientAngle`（类型：`boolean`），用于配置隐藏渐变角度（默认值：`false`）。
   */
  @Input()  public  hideGradientAngle?: boolean=false;
  /**
   * Input property `hideGradientStop` (`boolean`) configuring hide gradient stop (default: `false`).
   * @zh 输入属性 `hideGradientStop`（类型：`boolean`），用于配置隐藏渐变停止（默认值：`false`）。
   */
  @Input()  public  hideGradientStop?: boolean=false;

  /**
   * Property `context` (`PickerContextProps`) storing context.
   * @zh 属性 `context`（类型：`PickerContextProps`），用于存储或配置上下文。
   */
  public context:PickerContextProps;  


  /**
   * Creates an instance of `GradientControlsComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GradientControlsComponent` 实例，并初始化其依赖项与内部状态。
   * @param contextService - Injected or initial context service (`ContextService`) / 注入或传入的上下文服务（`ContextService`）
   */
  constructor(
    public contextService:ContextService,
  ) {
    this.context=contextService.getContext();
  }
  /**
   * Gets the current is radial (`isRadial: any`).
   * @zh 获取当前是否为Radial（`isRadial: any`）。
   */
  public get isRadial(){
    const   isRadial =   this.context .gradientType === 'radial-gradient'
    return isRadial;
}

/**
 * Executes `getLinearClass` to handle get linear class.
 * @zh 执行 `getLinearClass`，用于获取Linear类名。
 */
public getLinearClass(){
    return `${this.context.classes.rbgcpControlBtn} ${this.isLinear && this.context.classes.rbgcpControlBtnSelected}`;
}
/**
 * Executes `getRadialClass` to handle get radial class.
 * @zh 执行 `getRadialClass`，用于获取Radial类名。
 */
public getRadialClass(){
  return `${this.context.classes.rbgcpControlBtn} ${this.isRadial && this.context.classes.rbgcpControlBtnSelected}`;
}

/**
 * Executes `getGradientAngleClass` to handle get gradient angle class.
 * @zh 执行 `getGradientAngleClass`，用于获取渐变角度类名。
 */
public getGradientAngleClass(){
  return `${this.context.classes.rbgcpControlBtnWrapper} ${this.context.classes.rbgcpControlInputWrap} ${this.context.classes.rbgcpDegreeInputWrap}`;
}

/**
 * Executes `getGradientDegreeClass` to handle get gradient degree class.
 * @zh 执行 `getGradientDegreeClass`，用于获取渐变度数类名。
 */
public getGradientDegreeClass(){
  return `${this.context.classes.rbgcpControlInput} ${this.context.classes.rbgcpDegreeInput}`;
}
/**
 * Executes `getStopClass` to handle get stop class.
 * @zh 执行 `getStopClass`，用于获取停止类名。
 */
public getStopClass(){
  return `${this.context.classes.rbgcpControlBtnWrapper} ${this.context.classes.rbgcpControlInputWrap} ${this.context.classes.rbgcpStopInputWrap}`;
}

/**
 * Executes `getStopInputClass` to handle get stop input class.
 * @zh 执行 `getStopInputClass`，用于获取停止输入属性类名。
 */
public getStopInputClass(){
  return `${this.context.classes.rbgcpControlInput} ${this.context.classes.rbgcpStopInput}`;
}

/**
 * Executes `controlBtnStyles` to handle control btn styles.
 * @zh 执行 `controlBtnStyles`，用于表单控件按钮样式集合。
 * @param selected - selected parameter (`boolean`) / 已选中参数（`boolean`）
 * @param classes - classes parameter (`any`) / 类名集合参数（`any`）
 */
public controlBtnStyles  (selected: boolean, classes) {
  if (selected) {
    return `${classes.rbgcpControlIconBtn} ${classes.rbgcpControlBtnSelected}`
  } else {
    return classes.rbgcpControlIconBtn
  }
}


  /**
   * Gets the current is linear (`isLinear: any`).
   * @zh 获取当前是否为Linear（`isLinear: any`）。
   */
  public get isLinear(){
      const  isLinear =   this.context .gradientType === 'linear-gradient';
      return isLinear;
  }

  /**
   * Executes `handleLinear` to handle handle linear.
   * @zh 执行 `handleLinear`，用于连接手柄Linear。
   */
  handleLinear () {
    const remaining = this.context. value.split(/,(.+)/)[1]
    this.context. onChange(`linear-gradient(90deg, ${remaining}`)
  }

   /**
    * Executes `handleRadial` to handle handle radial.
    * @zh 执行 `handleRadial`，用于连接手柄Radial。
    */
   handleRadial () {
    const remaining =  this.context .value.split(/,(.+)/)[1]
    this.context.   onChange(`radial-gradient(circle, ${remaining}`)
  }


  /**
   * Executes `deletePoint` to handle delete point.
   * @zh 执行 `deletePoint`，用于删除坐标点。
   */
  public deletePoint  () {
    if ( this.context.colors?.length > 2) {
      const formatted = this.context. colors?.map((fc, i: number) => ({
        ...fc,
        value: i ===  this.context.selectedColor - 1 ? high(fc) : low(fc),
      }))
      const remaining = formatted?.filter(
        (_, i: number) => i !== this.context. selectedColor
      )
      this.context. createGradientStr(remaining)
    }
  }
  /**
   * Executes `handleDegrees` to handle handle degrees.
   * @zh 执行 `handleDegrees`，用于连接手柄度数。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  public handleDegrees  (e) {
    const newValue = formatInputValues(e.target.value, 0, 360)
    const remaining = this.context. value.split(/,(.+)/)[1]
    this.context.   onChange(`linear-gradient(${newValue || 0}deg, ${remaining}`)
  }

  /**
   * Executes `handleMove` to handle handle move.
   * @zh 执行 `handleMove`，用于连接手柄移动。
   * @param newVal - new val parameter (`any`) / 新值参数（`any`）
   */
  public handleMove  (newVal) {
    this.context.  handleGradient(this.context. currentColor, formatInputValues(parseInt(newVal), 0, 100))
  }
}
