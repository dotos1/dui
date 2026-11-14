/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/components/gradient-presets.component.ts` providing gradient presets component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/components/gradient-presets.component.ts`，提供渐变presets组件相关的定义与实现。
 */

import {
  ChangeDetectionStrategy,  Component,   Input
} from '@angular/core';
import { fakePresets } from '../constants'
import { ContextService, PickerContextProps } from '../hooks/context.service';

/**
 * Angular component `GradientPresetsComponent` (selector: 'gradient-presets') providing gradient presets component presentation and interaction in `src/common/colorpicker/components/gradient/components`.
 * @zh Angular 组件 `GradientPresetsComponent`（selector: 'gradient-presets'），提供渐变Presets组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient/components`）。
 */
@Component({
  selector: 'gradient-presets',
  templateUrl: './gradient-presets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,
  
})
export class GradientPresetsComponent  {

  /**
   * Input property `presets` (`any[]`) configuring presets (default: `[]`).
   * @zh 输入属性 `presets`（类型：`any[]`），用于配置presets（默认值：`[]`）。
   */
  @Input()  public  presets?=[];

  /**
   * Property `context` (`PickerContextProps`) storing context.
   * @zh 属性 `context`（类型：`PickerContextProps`），用于存储或配置上下文。
   */
  public context:PickerContextProps;  
  
  /**
   * Creates an instance of `GradientPresetsComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GradientPresetsComponent` 实例，并初始化其依赖项与内部状态。
   * @param contextService - Injected or initial context service (`ContextService`) / 注入或传入的上下文服务（`ContextService`）
   */
  constructor(
    public contextService:ContextService,

  ) {
    this.context=contextService.getContext();
  }

  /**
   * Executes `getStyle` to handle get style.
   * @zh 执行 `getStyle`，用于获取样式。
   * @param p - p parameter (`any`) / p参数（`any`）
   */
  getStyle(p){
    return  {  background: p,  border: p === 'rgba(255,255,255, 1)' ? '1px solid #96959c' : ''}
  }
  

  /**
   * Executes `getPresets` to handle get presets.
   * @zh 执行 `getPresets`，用于获取Presets。
   * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
   */
  public getPresets (){
    if (this. presets?.length > 0) {
      return this.presets?.slice(0, 18)
    } else {
      return fakePresets
    }
  }

  /**
   * Executes `handlePresetClick` to handle handle preset click.
   * @zh 执行 `handlePresetClick`，用于连接手柄Preset点击。
   * @param preset - preset parameter (`any`) / preset参数（`any`）
   */
  public handlePresetClick (preset){
    if (preset?.includes('gradient')) {
            this.context.onChange(preset)
    } else {
         this.context. handleChange(preset)
    }
  }
}
