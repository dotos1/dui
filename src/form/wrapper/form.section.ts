/**
 * @fileoverview Module `src/form/wrapper/form.section.ts` providing form section definitions and implementation.
 * @zh 模块文件 `src/form/wrapper/form.section.ts`，提供表单section相关的定义与实现。
 */

import { Component, Inject, Optional, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@dotos1/dui/core/form';
import { FormBuilder, FieldConfig, FORM_CONFIG } from '@dotos1/dui/core/form';
import { CollapseAnimation } from '@dotos1/dui/common/animations';
import { isUndefined } from '@dotos1/dui/base';

/**
 * Angular component `FormSection` (selector: 'form-section') providing form section presentation and interaction in `src/form/wrapper`.
 * @zh Angular 组件 `FormSection`（selector: 'form-section'），提供表单Section的视图渲染与交互逻辑（位于 `src/form/wrapper`）。
 */
@Component({
  selector: 'form-section',
  templateUrl: './form-section.html',
  styleUrls: ['./form-section.scss'],
  animations: [CollapseAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 
    hostID: 'form-section' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
export class FormSection<F extends FieldConfig = FieldConfig> extends FieldType<F>  {


  /**
   * Input property `collapsed` (`boolean`) configuring collapsed (default: `false`).
   * @zh 输入属性 `collapsed`（类型：`boolean`），用于配置已折叠（默认值：`false`）。
   */
  @Input() collapsed: boolean = false;

  /**
   * Input property `style` (`any`) configuring style.
   * @zh 输入属性 `style`（类型：`any`），用于配置样式。
   */
  @Input() style;

  /**
   * Input property `styleClass` (`string`) configuring style class.
   * @zh 输入属性 `styleClass`（类型：`string`），用于配置样式类名。
   */
  @Input() styleClass: string;

  /**
   * Property `layout` (`string`) storing layout (default: `'row'`).
   * @zh 属性 `layout`（类型：`string`），用于存储或配置布局（默认值：`'row'`）。
   */
  public layout = 'row';

  /**
   * Property `defaultOptions` (`{ defaultValue: any[]; }`) storing default options (default: `{ defaultValue: [], }`).
   * @zh 属性 `defaultOptions`（类型：`{ defaultValue: any[]; }`），用于存储或配置默认配置选项（默认值：`{ defaultValue: [], }`）。
   */
  override defaultOptions = {
    defaultValue: [],
  };
  /**
   * Creates an instance of `FormSection` and initializes its dependencies and internal state.
   * @zh 创建 `FormSection` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param builder - Injected or initial builder (`FormBuilder`) / 注入或传入的构建器（`FormBuilder`）
   */
  constructor(private el: ElementRef, @Inject(FORM_CONFIG) @Optional() builder?: FormBuilder) {
    super();
    if (builder instanceof FormBuilder) {
      console.warn(`NgxFormly: passing 'FormlyFormBuilder' to '${this.constructor.name}' type is not required anymore, you may remove it!`);
    }
  }
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
    if (!isUndefined(config) && !isUndefined(config.collapsed)) {
      this.collapsed = config.collapsed;
    }
  }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   */
  toggle() {
    this.collapsed = !this.collapsed;
  }
}
