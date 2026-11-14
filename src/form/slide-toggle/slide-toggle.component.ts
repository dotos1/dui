/**
 * @fileoverview Module `src/form/slide-toggle/slide-toggle.component.ts` providing slide toggle component definitions and implementation.
 * @zh 模块文件 `src/form/slide-toggle/slide-toggle.component.ts`，提供slide开关组件相关的定义与实现。
 */

import { Component, AfterViewInit, ViewChild, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { MatField } from '../base/mat.field';
import { MatSlideToggle } from '@angular/material/slide-toggle';

/**
 * Angular component `SliderToggleField` (selector: 'slide-toggle') providing slider toggle field presentation and interaction in `src/form/slide-toggle`.
 * @zh Angular 组件 `SliderToggleField`（selector: 'slide-toggle'），提供滑块开关字段的视图渲染与交互逻辑（位于 `src/form/slide-toggle`）。
 */
@Component({
  selector: 'slide-toggle',
  templateUrl: './slide-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {hostID: 'slide-toggle-field' + Math.random().toString(36).substring(2, 15)},
  standalone: false,
})

export class SliderToggleField extends MatField implements AfterViewInit {

  /**
   * Template/content query reference `slideToggle` (`MatSlideToggle`) targeting slide toggle.
   * @zh 模板/内容视图查询引用 `slideToggle`（`@ViewChild`），指向slide开关。
   */
  @ViewChild(forwardRef(() => MatSlideToggle), { static: true })
  private slideToggle: MatSlideToggle;

  /**
   * Property `defaultOptions` (`{…}`) storing default options.
   * @zh 属性 `defaultOptions`（类型：`{…}`），用于存储或配置默认配置选项。
   */
  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
    hideLabel: true,
    color: 'accent',
    defaultValue: false
  };

  /**
   * Executes `onContainerClick` to handle on container click.
   * @zh 执行 `onContainerClick`，用于当容器点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  override onContainerClick(event: MouseEvent): void {
    this.slideToggle.focus();
    super.onContainerClick(event);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `click` to handle click.
   * @zh 执行 `click`，用于点击。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  click(event){
    if(this.field.wrappers.indexOf('editor-field')!=-1){
      this.slideToggle.toggle();
    }
  }
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  override init(): void {
    super.init();
  }
}
