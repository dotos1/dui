/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/components/controls.component.ts` providing controls component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/components/controls.component.ts`，提供控件集合组件相关的定义与实现。
 */




import {  ChangeDetectionStrategy,  Component,     Input,} from '@angular/core';
import { ContextService, PickerContextProps } from '../hooks/context.service';
import { config } from '../constants';

/**
 * Angular component `ControlsComponent` (selector: 'controls-component') providing controls component presentation and interaction in `src/common/colorpicker/components/gradient/components`.
 * @zh Angular 组件 `ControlsComponent`（selector: 'controls-component'），提供控件集合组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient/components`）。
 */
@Component({
  selector: 'controls-component',
  templateUrl: './controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,
  
})
export class ControlsComponent {

  /**
   * Input property `hideEyeDrop` (`boolean`) configuring hide eye drop (default: `false`).
   * @zh 输入属性 `hideEyeDrop`（类型：`boolean`），用于配置隐藏Eye放置（默认值：`false`）。
   */
  @Input()     hideEyeDrop?: boolean=false;
  /**
   * Input property `hideColorTypeBtns` (`boolean`) configuring hide color type btns (default: `false`).
   * @zh 输入属性 `hideColorTypeBtns`（类型：`boolean`），用于配置隐藏颜色类型按钮（默认值：`false`）。
   */
  @Input()     hideColorTypeBtns?: boolean=false;
  /**
   * Input property `hideGradientControls` (`boolean`) configuring hide gradient controls (default: `false`).
   * @zh 输入属性 `hideGradientControls`（类型：`boolean`），用于配置隐藏渐变控件集合（默认值：`false`）。
   */
  @Input()     hideGradientControls?: boolean=false;
  /**
   * Input property `hideGradientType` (`boolean`) configuring hide gradient type (default: `false`).
   * @zh 输入属性 `hideGradientType`（类型：`boolean`），用于配置隐藏渐变类型（默认值：`false`）。
   */
  @Input()     hideGradientType?: boolean=false;
  /**
   * Input property `hideGradientAngle` (`boolean`) configuring hide gradient angle (default: `false`).
   * @zh 输入属性 `hideGradientAngle`（类型：`boolean`），用于配置隐藏渐变角度（默认值：`false`）。
   */
  @Input()     hideGradientAngle?: boolean=false;
  /**
   * Input property `hideGradientStop` (`boolean`) configuring hide gradient stop.
   * @zh 输入属性 `hideGradientStop`（类型：`boolean`），用于配置隐藏渐变停止。
   */
  @Input()     hideGradientStop?: boolean

  /**
   * Property `conext` (`PickerContextProps`) storing conext.
   * @zh 属性 `conext`（类型：`PickerContextProps`），用于存储或配置conext。
   */
  public conext:PickerContextProps;

  /**
   * Creates an instance of `ControlsComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ControlsComponent` 实例，并初始化其依赖项与内部状态。
   * @param contextService - Injected or initial context service (`ContextService`) / 注入或传入的上下文服务（`ContextService`）
   */
  constructor(
    public contextService:ContextService
  ) {
    this.conext=contextService.getContext();
  }

  /**
   * Gets the current no tools (`noTools: any`).
   * @zh 获取当前noTools（`noTools: any`）。
   */
  public get    noTools(){
    return this. hideEyeDrop ;
  } 

  /**
   * Executes `getControlClass` to handle get control class.
   * @zh 执行 `getControlClass`，用于获取表单控件类名。
   */
  public getControlClass(){
    return `context.classes.rbgcpControlBtnWrapper`;
  }

  /**
   * Gets the current is gradient (`isGradient: any`).
   * @zh 获取当前是否为渐变（`isGradient: any`）。
   */
  public get isGradient(){
      return  this .conext.isGradient;
  }

  /**
   * Executes `getClass` to handle get class.
   * @zh 执行 `getClass`，用于获取类名。
   */
  public  getClass(){
    return `${ this .conext.classes.ac} ${this.conext.classes.jsb}`;
  }

  /**
   * Gets the current solid color (`solidColor: any`).
   * @zh 获取当前solid颜色（`solidColor: any`）。
   */
  public get solidColor(){
    return this.conext.previous?.color || config.defaultColor;
  }
  /**
   * Gets the current gradient color (`gradientColor: any`).
   * @zh 获取当前渐变颜色（`gradientColor: any`）。
   */
  public get gradientColor(){
    return this.conext.previous?.gradient || config.defaultGradient;
  }

  /**
   * Gets the current all right controls hidden (`allRightControlsHidden: any`).
   * @zh 获取当前全部右侧位置控件集合隐藏（`allRightControlsHidden: any`）。
   */
  public get allRightControlsHidden(){
    return this.hideEyeDrop;
  }
  /**
   * Gets the current all controls hidden (`allControlsHidden: any`).
   * @zh 获取当前全部控件集合隐藏（`allControlsHidden: any`）。
   */
  public get allControlsHidden(){
    return this.allRightControlsHidden&&this. hideColorTypeBtns;
  }


  /**
   * Property `setSolid` (`() => void`) storing set solid.
   * @zh 属性 `setSolid`（类型：`() => void`），用于存储或配置集合Solid。
   */
  public setSolid = () => {
    this.conext .onChange(this.solidColor)
  }

   /**
    * Property `setGradient` (`() => void`) storing set gradient.
    * @zh 属性 `setGradient`（类型：`() => void`），用于存储或配置集合渐变。
    */
   setGradient = () => {
    this.conext. onChange(this. gradientColor)
  }

 /**
  * Executes `colorTypeBtnStyles` to handle color type btn styles.
  * @zh 执行 `colorTypeBtnStyles`，用于颜色类型按钮样式集合。
  * @param selected - selected parameter (`boolean`) / 已选中参数（`boolean`）
  * @param classes - classes parameter (`any`) / 类名集合参数（`any`）
  */
 colorTypeBtnStyles  (selected: boolean, classes){
    if (selected) {
      return `${classes.rbgcpControlBtn} ${classes.rbgcpControlBtnSelected}`
    } else {
      return classes.rbgcpControlBtn
    }
  }
  
  /**
   * Executes `controlBtnStyles` to handle control btn styles.
   * @zh 执行 `controlBtnStyles`，用于表单控件按钮样式集合。
   * @param selected - selected parameter (`boolean`) / 已选中参数（`boolean`）
   * @param classes - classes parameter (`any`) / 类名集合参数（`any`）
   */
  controlBtnStyles  (selected: boolean, classes) {
    if (selected) {
      return `${classes.rbgcpControlIconBtn} ${classes.rbgcpControlBtnSelected}`
    } else {
      return classes.rbgcpControlIconBtn
    }
  }
  
  /**
   * Executes `modalBtnStyles` to handle modal btn styles.
   * @zh 执行 `modalBtnStyles`，用于模态框按钮样式集合。
   * @param selected - selected parameter (`boolean`) / 已选中参数（`boolean`）
   * @param classes - classes parameter (`any`) / 类名集合参数（`any`）
   */
  modalBtnStyles (selected: boolean, classes){
    if (selected) {
      return `${classes.rbgcpControlBtn} ${classes.rbgcpColorModelDropdownBtn} ${classes.rbgcpControlBtnSelected}`
    } else {
      return `${classes.rbgcpControlBtn} ${classes.rbgcpColorModelDropdownBtn}`
    }
  }
}

