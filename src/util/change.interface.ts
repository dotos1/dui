/**
 * @fileoverview Module `src/util/change.interface.ts` providing change interface definitions and implementation.
 * @zh 模块文件 `src/util/change.interface.ts`，提供变更interface相关的定义与实现。
 */

/**
 * Enumeration `ChangeType` defining supported change type constants.
 * @zh 枚举 `ChangeType`，定义支持的变更类型常量集合。
 */
export enum ChangeType {
  /**
   * Enum member `ChangeType.ADDED` = 'added' representing added.
   * @zh 枚举项 `ChangeType.ADDED` = 'added'，表示已添加。
   */
  ADDED = 'added',
  /**
   * Enum member `ChangeType.DELETED` = 'deleted' representing deleted.
   * @zh 枚举项 `ChangeType.DELETED` = 'deleted'，表示已删除。
   */
  DELETED = 'deleted',
  /**
   * Enum member `ChangeType.MODIFIED` = 'modified' representing modified.
   * @zh 枚举项 `ChangeType.MODIFIED` = 'modified'，表示MODIFIED。
   */
  MODIFIED = 'modified'
}

/**
 * Interface `Change` defining the contract and properties for change.
 * @zh 接口 `Change`，定义变更的数据结构契约与属性规范。
 */
export interface Change {
  /**
   * Property `type` (`ChangeType`) storing type.
   * @zh 属性 `type`（类型：`ChangeType`），用于存储或配置类型。
   */
  type: ChangeType;
  /**
   * Property `keysChanged` (`{ key: string; newValue: unknown; oldValue: unknown; }[]`) storing keys changed.
   * @zh 属性 `keysChanged`（类型：`{ key: string; newValue: unknown; oldValue: unknown; }[]`），用于存储或配置键列表已变更。
   */
  keysChanged?: {
    key: string;
    newValue: unknown;
    oldValue: unknown;
  }[];
}

/**
 * Interface `GroupingChanges` defining the contract and properties for grouping changes.
 * @zh 接口 `GroupingChanges`，定义分组变更集合的数据结构契约与属性规范。
 */
export interface GroupingChanges {
  /**
   * Property `added` (`ChangeItem[]`) storing added.
   * @zh 属性 `added`（类型：`ChangeItem[]`），用于存储或配置已添加。
   */
  added: ChangeItem[];
  /**
   * Property `deleted` (`ChangeItem[]`) storing deleted.
   * @zh 属性 `deleted`（类型：`ChangeItem[]`），用于存储或配置已删除。
   */
  deleted: ChangeItem[];
  /**
   * Property `modified` (`ChangeItem[]`) storing modified.
   * @zh 属性 `modified`（类型：`ChangeItem[]`），用于存储或配置modified。
   */
  modified: ChangeItem[];
}

/**
 * Interface `ChangeItem` defining the contract and properties for change item.
 * @zh 接口 `ChangeItem`，定义变更条目的数据结构契约与属性规范。
 */
export interface ChangeItem {
  /**
   * Property `change` (`Change`) storing change.
   * @zh 属性 `change`（类型：`Change`），用于存储或配置变更。
   */
  change: Change;
  /**
   * Property `value` (`unknown`) storing value.
   * @zh 属性 `value`（类型：`unknown`），用于存储或配置值。
   */
  value: unknown;
  /**
   * Property `oldValue` (`unknown`) storing old value.
   * @zh 属性 `oldValue`（类型：`unknown`），用于存储或配置旧值。
   */
  oldValue?: unknown;
  /**
   * Property `newValue` (`unknown`) storing new value.
   * @zh 属性 `newValue`（类型：`unknown`），用于存储或配置新值。
   */
  newValue?: unknown;
}
