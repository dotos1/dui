/**
 * @fileoverview Module `src/form/field/displayfield.component.ts` providing displayfield component definitions and implementation.
 * @zh 模块文件 `src/form/field/displayfield.component.ts`，提供displayfield组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextFieldComponent } from './textfield.component';

/**
 * Angular component `DisplayFieldComponent` (selector: 'display-field') providing display field component presentation and interaction in `src/form/field`.
 * @zh Angular 组件 `DisplayFieldComponent`（selector: 'display-field'），提供Display字段组件的视图渲染与交互逻辑（位于 `src/form/field`）。
 */
@Component({
  selector: 'display-field',
  templateUrl: './displayfield.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'display-field' + Math.random().toString(36).substring(2, 15),
  },
})
export class DisplayFieldComponent extends TextFieldComponent {

  /**
   * Property `type` (`string`) storing type (default: `'display'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'display'`）。
   */
  type: string = 'display';

  /**
   * Property `xtype` (`string`) storing xtype (default: `'displayfield'`).
   * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型（默认值：`'displayfield'`）。
   */
  xtype: string = 'displayfield';

}
