/**
 * @fileoverview Module `src/form/field/hiddenfield.component.ts` providing hiddenfield component definitions and implementation.
 * @zh 模块文件 `src/form/field/hiddenfield.component.ts`，提供hiddenfield组件相关的定义与实现。
 */

import { Component, ElementRef,ChangeDetectionStrategy } from '@angular/core';
import { MatField } from '../base/mat.field';

/**
 * Angular component `HiddenFieldComponent` (selector: 'hidden-field') providing hidden field component presentation and interaction in `src/form/field`.
 * @zh Angular 组件 `HiddenFieldComponent`（selector: 'hidden-field'），提供隐藏字段组件的视图渲染与交互逻辑（位于 `src/form/field`）。
 */
@Component({
  selector: 'hidden-field',
  templateUrl: './hiddenfield.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'hidden-field' + Math.random().toString(36).substring(2, 15)
  },
  standalone: false
})
export class HiddenFieldComponent extends MatField {

  /**
   * Property `input` (`ElementRef<any>`) storing input.
   * @zh 属性 `input`（类型：`ElementRef<any>`），用于存储或配置输入属性。
   */
  input: ElementRef;

  /**
   * Property `type` (`string`) storing type (default: `'hidden'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'hidden'`）。
   */
  type = 'hidden';

}
