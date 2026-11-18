/**
 * @fileoverview Module `src/form/components/form.group.ts` providing form group definitions and implementation.
 * @zh 模块文件 `src/form/components/form.group.ts`，提供表单分组相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { isPhoneTerminal } from '@dotos1/dui/base';
import { FieldConfig, FieldType } from '@dotos1/dui/core/form';
import { buildRowWrapFlexStyle } from './flex-style.util';

/**
 * Angular component `FormGroup` (selector: 'form-group') providing form group presentation and interaction in `src/form/components`.
 * @zh Angular 组件 `FormGroup`（selector: 'form-group'），提供表单分组的视图渲染与交互逻辑（位于 `src/form/components`）。
 */
@Component({
  selector: 'form-group',
  templateUrl: './form.group.html',
  host: {
    class: 'field.fieldGroupClassName || ""',
    style: 'flex:1; box-sizing:  align-items: center;border-box; place-content: center flex-start;',
    hostID: 'form-group' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormGroup extends FieldType {
  /**
   * Executes `getStyle` to handle get style.
   * @zh 执行 `getStyle`，用于获取样式。
   * @param field - field parameter (`any`) / 字段参数（`any`）
   */
  /**
   * Flex basis of a field: the backend value on desktop, always 100 (single column) on a phone.
   * @zh 字段的 flex：桌面用后端下发值；手机类下固定 100（单列），后端值不变。
   */
  public flexOf(item: FieldConfig): number | string {
    return isPhoneTerminal() ? 100 : (item.flex ? item.flex : 100);
  }

  public getStyle(field): Record<string, string> {
    const style = buildRowWrapFlexStyle(this.flexOf(field));
    style['display'] = field.hidden ? 'none' : '';
    return style;
  }
  /**
   * Property `defaultOptions` (`{ defaultValue: {}; }`) storing default options (default: `{ defaultValue: {}, }`).
   * @zh 属性 `defaultOptions`（类型：`{ defaultValue: {}; }`），用于存储或配置默认配置选项（默认值：`{ defaultValue: {}, }`）。
   */
  override defaultOptions = {
    defaultValue: {},
  };
}
