/**
 * @fileoverview Module `src/form/ext-slider/slider.component.ts` providing slider component definitions and implementation.
 * @zh 模块文件 `src/form/ext-slider/slider.component.ts`，提供滑块组件相关的定义与实现。
 */

import { Component, ViewChild ,  forwardRef, ChangeDetectionStrategy} from '@angular/core';
import { MatField } from '../base/mat.field';
import { MatSliderThumb  } from '@angular/material/slider';
/**
 * Angular component `SliderFieldComponent` (selector: 'slider-field') providing slider field component presentation and interaction in `src/form/ext-slider`.
 * @zh Angular 组件 `SliderFieldComponent`（selector: 'slider-field'），提供滑块字段组件的视图渲染与交互逻辑（位于 `src/form/ext-slider`）。
 */
@Component({
  selector: 'slider-field',
  styleUrls: ['./slider.component.scss'],
  templateUrl: './slider.component.html',
  host: {
    style: 'flex:1;display:flex;flex-direction:row;',
    hostID: 'slider-field' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderFieldComponent extends MatField {

  /**
   * Template/content query reference `slider` (`@ViewChild`) targeting slider.
   * @zh 模板/内容视图查询引用 `slider`（`@ViewChild`），指向滑块。
   */
  @ViewChild(forwardRef(() => MatSliderThumb ),{static: true})
  private slider: MatSliderThumb ;

  /**
   * Property `defaultOptions` (`any`) storing default options.
   * @zh 属性 `defaultOptions`（类型：`any`），用于存储或配置默认配置选项。
   */
  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
  };
  /**
   * Executes `onContainerClick` to handle on container click.
   * @zh 执行 `onContainerClick`，用于当容器点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  override onContainerClick(event: MouseEvent): void {
    this.slider.focus();
    super.onContainerClick(event);
  }
}
