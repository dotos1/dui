/**
 * @fileoverview Module `src/common/dragselect/models.ts` providing models definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/models.ts`，提供模型集合相关的定义与实现。
 */

import { Observable } from 'rxjs';
import { SelectItemDirective } from './select-item.directive';

/**
 * Type alias `PredicateFn` representing predicate fn (`(item: T) => boolean`).
 * @zh 类型别名 `PredicateFn`，表示Predicate函数（`(item: T) => boolean`）。
 */
export type PredicateFn<T> = (item: T) => boolean;

/**
 * Enumeration `UpdateActions` defining supported update actions constants.
 * @zh 枚举 `UpdateActions`，定义支持的更新动作列表常量集合。
 */
export enum UpdateActions {
  /**
   * Enum member `UpdateActions.Add` representing add.
   * @zh 枚举项 `UpdateActions.Add`，表示添加。
   */
  Add,
  /**
   * Enum member `UpdateActions.Remove` representing remove.
   * @zh 枚举项 `UpdateActions.Remove`，表示移除。
   */
  Remove
}

/**
 * Interface `UpdateAction` defining the contract and properties for update action.
 * @zh 接口 `UpdateAction`，定义更新动作的数据结构契约与属性规范。
 */
export interface UpdateAction {
  /**
   * Property `type` (`UpdateActions`) storing type.
   * @zh 属性 `type`（类型：`UpdateActions`），用于存储或配置类型。
   */
  type: UpdateActions;
  /**
   * Property `item` (`SelectItemDirective`) storing item.
   * @zh 属性 `item`（类型：`SelectItemDirective`），用于存储或配置条目。
   */
  item: SelectItemDirective;
}

/**
 * Interface `ObservableProxy` defining the contract and properties for observable proxy.
 * @zh 接口 `ObservableProxy`，定义可观察流Proxy的数据结构契约与属性规范。
 */
export interface ObservableProxy<T> {
  /**
   * Property `proxy$` (`Observable<any>`) storing proxy.
   * @zh 属性 `proxy$`（类型：`Observable<any>`），用于存储或配置proxy。
   */
  proxy$;
  /**
   * Property `proxy` (`T`) storing proxy.
   * @zh 属性 `proxy`（类型：`T`），用于存储或配置proxy。
   */
  proxy: T;
}

/**
 * Interface `SelectContainerHost` defining the contract and properties for select container host.
 * @zh 接口 `SelectContainerHost`，定义下拉选择容器宿主的数据结构契约与属性规范。
 */
export interface SelectContainerHost extends HTMLElement {
  /**
   * Property `boundingClientRect` (`BoundingBox`) storing bounding client rect.
   * @zh 属性 `boundingClientRect`（类型：`BoundingBox`），用于存储或配置包围边界Client矩形。
   */
  boundingClientRect: BoundingBox;
}

/**
 * Interface `Shortcuts` defining the contract and properties for shortcuts.
 * @zh 接口 `Shortcuts`，定义快捷键列表的数据结构契约与属性规范。
 */
export interface Shortcuts {
  /**
   * Property `moveRangeStart` (`string`) storing move range start.
   * @zh 属性 `moveRangeStart`（类型：`string`），用于存储或配置移动范围开始。
   */
  moveRangeStart: string;
  /**
   * Property `disableSelection` (`string`) storing disable selection.
   * @zh 属性 `disableSelection`（类型：`string`），用于存储或配置禁用Selection。
   */
  disableSelection: string;
  /**
   * Property `toggleSingleItem` (`string`) storing toggle single item.
   * @zh 属性 `toggleSingleItem`（类型：`string`），用于存储或配置开关单个条目。
   */
  toggleSingleItem: string;
  /**
   * Property `addToSelection` (`string`) storing add to selection.
   * @zh 属性 `addToSelection`（类型：`string`），用于存储或配置添加转换为Selection。
   */
  addToSelection: string;
  /**
   * Property `removeFromSelection` (`string`) storing remove from selection.
   * @zh 属性 `removeFromSelection`（类型：`string`），用于存储或配置移除从Selection。
   */
  removeFromSelection: string;
}

/**
 * Interface `DragToSelectConfig` defining the contract and properties for drag to select config.
 * @zh 接口 `DragToSelectConfig`，定义拖拽转换为下拉选择配置的数据结构契约与属性规范。
 */
export interface DragToSelectConfig {
  /**
   * Property `selectedClass` (`string`) storing selected class.
   * @zh 属性 `selectedClass`（类型：`string`），用于存储或配置已选中类名。
   */
  selectedClass: string;
  /**
   * Property `shortcuts` (`Partial<Shortcuts>`) storing shortcuts.
   * @zh 属性 `shortcuts`（类型：`Partial<Shortcuts>`），用于存储或配置快捷键列表。
   */
  shortcuts: Partial<Shortcuts>;
}

/**
 * Interface `MousePosition` defining the contract and properties for mouse position.
 * @zh 接口 `MousePosition`，定义鼠标位置的数据结构契约与属性规范。
 */
export interface MousePosition {
  /**
   * Property `x` (`number`) storing x.
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
   */
  x: number;
  /**
   * Property `y` (`number`) storing y.
   * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
   */
  y: number;
}

/**
 * Interface `BoundingBox` defining the contract and properties for bounding box.
 * @zh 接口 `BoundingBox`，定义包围边界盒子容器的数据结构契约与属性规范。
 */
export interface BoundingBox {
  /**
   * Property `top` (`number`) storing top.
   * @zh 属性 `top`（类型：`number`），用于存储或配置顶部位置。
   */
  top: number;
  /**
   * Property `left` (`number`) storing left.
   * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
   */
  left: number;
  /**
   * Property `width` (`number`) storing width.
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
   */
  width: number;
  /**
   * Property `height` (`number`) storing height.
   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  height: number;
}

/**
 * Type alias `SelectBoxInput` representing select box input (`[MouseEvent, number, MousePosition]`).
 * @zh 类型别名 `SelectBoxInput`，表示下拉选择盒子容器输入属性（`[MouseEvent, number, MousePosition]`）。
 */
export type SelectBoxInput = [MouseEvent, number, MousePosition];

/**
 * Interface `SelectBox` defining the contract and properties for select box.
 * @zh 接口 `SelectBox`，定义下拉选择盒子容器的数据结构契约与属性规范。
 */
export interface SelectBox<T> {
  /**
   * Property `top` (`T`) storing top.
   * @zh 属性 `top`（类型：`T`），用于存储或配置顶部位置。
   */
  top: T;
  /**
   * Property `left` (`T`) storing left.
   * @zh 属性 `left`（类型：`T`），用于存储或配置左侧位置。
   */
  left: T;
  /**
   * Property `width` (`T`) storing width.
   * @zh 属性 `width`（类型：`T`），用于存储或配置宽度。
   */
  width: T;
  /**
   * Property `height` (`T`) storing height.
   * @zh 属性 `height`（类型：`T`），用于存储或配置高度。
   */
  height: T;
  /**
   * Property `opacity` (`number`) storing opacity.
   * @zh 属性 `opacity`（类型：`number`），用于存储或配置不透明度。
   */
  opacity: number;
}

/**
 * Enumeration `Action` defining supported action constants.
 * @zh 枚举 `Action`，定义支持的动作常量集合。
 */
export enum Action {
  /**
   * Enum member `Action.Add` representing add.
   * @zh 枚举项 `Action.Add`，表示添加。
   */
  Add,
  /**
   * Enum member `Action.Delete` representing delete.
   * @zh 枚举项 `Action.Delete`，表示删除。
   */
  Delete,
  /**
   * Enum member `Action.None` representing none.
   * @zh 枚举项 `Action.None`，表示无。
   */
  None
}
