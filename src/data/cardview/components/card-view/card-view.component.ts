/**
 * @fileoverview Module `src/data/cardview/components/card-view/card-view.component.ts` providing card view component definitions and implementation.
 * @zh 模块文件 `src/data/cardview/components/card-view/card-view.component.ts`，提供卡片视图组件相关的定义与实现。
 */


import { Component, Input } from '@angular/core';
import { DEFAULT_SEPARATOR } from '../card-view-textitem/card-view-textitem.component';
import { CardViewItem } from '../../interfaces';

/**
 * Angular component `CardViewComponent` (selector: 'dui-card-view') providing card view component presentation and interaction in `src/data/cardview/components/card-view`.
 * @zh Angular 组件 `CardViewComponent`（selector: 'dui-card-view'），提供卡片视图组件的视图渲染与交互逻辑（位于 `src/data/cardview/components/card-view`）。
 */
@Component({
  selector: 'dui-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent {
  /**
   * (**required**) Items to show in the card view.
   * @zh 输入属性 `properties`（类型：`CardViewItem[]`），用于配置属性列表。
   */
  @Input()
  properties: CardViewItem[];

  /**
   * Toggles whether or not the items can be edited.
   * @zh 输入属性 `editable`（类型：`boolean`），用于配置是否可编辑。
   */
  @Input()
  editable: boolean;

  /**
   * Toggles whether or not to show empty items in non-editable mode.
   * @zh 输入属性 `displayEmpty`（类型：`boolean`），用于配置display空（默认值：`true`）。
   */
  @Input()
  displayEmpty: boolean = true;

  /**
   * Toggles whether or not to display none option.
   * @zh 输入属性 `displayNoneOption`（类型：`boolean`），用于配置display无选项（默认值：`true`）。
   */
  @Input()
  displayNoneOption: boolean = true;

  /**
   * Toggles whether or not to display clear action.
   * @zh 输入属性 `displayClearAction`（类型：`boolean`），用于配置display清空动作（默认值：`true`）。
   */
  @Input()
  displayClearAction: boolean = true;

  /**
   * Toggles whether or not to enable copy to clipboard action.
   * @zh 输入属性 `copyToClipboardAction`（类型：`boolean`），用于配置复制转换为Clipboard动作（默认值：`true`）。
   */
  @Input()
  copyToClipboardAction: boolean = true;

  /**
   * Toggles whether or not to enable chips for multivalued properties.
   * @zh 输入属性 `useChipsForMultiValueProperty`（类型：`boolean`），用于配置使用纸片标签用于多值属性（默认值：`true`）。
   */
  @Input()
  useChipsForMultiValueProperty: boolean = true;


  /**
   * Input property `multiValueSeparator` (`string`) configuring multi value separator (default: `DEFAULT_SEPARATOR`).
   * @zh 输入属性 `multiValueSeparator`（类型：`string`），用于配置多值Separator（默认值：`DEFAULT_SEPARATOR`）。
   */
  @Input()
  multiValueSeparator: string = DEFAULT_SEPARATOR;

  /**
   * Executes `trackByProperty` to handle track by property.
   * @zh 执行 `trackByProperty`，用于track按属性。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param property - property parameter (`CardViewItem`) / 属性参数（`CardViewItem`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  trackByProperty(index: number, property: CardViewItem) {
    return property ? property.key : index;
  }
}
