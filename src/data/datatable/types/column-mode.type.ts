/**
 * @fileoverview Module `src/data/datatable/types/column-mode.type.ts` providing column mode type definitions and implementation.
 * @zh 模块文件 `src/data/datatable/types/column-mode.type.ts`，提供列模式类型相关的定义与实现。
 */

/**
 * Enumeration `ColumnMode` defining supported column mode constants.
 * @zh 枚举 `ColumnMode`，定义支持的列模式常量集合。
 */
export enum ColumnMode {
  /**
   * Enum member `ColumnMode.standard` = 'standard' representing standard.
   * @zh 枚举项 `ColumnMode.standard` = 'standard'，表示standard。
   */
  standard = 'standard',
  /**
   * Enum member `ColumnMode.flex` = 'flex' representing flex.
   * @zh 枚举项 `ColumnMode.flex` = 'flex'，表示flex。
   */
  flex = 'flex',
  /**
   * Enum member `ColumnMode.force` = 'force' representing force.
   * @zh 枚举项 `ColumnMode.force` = 'force'，表示force。
   */
  force = 'force'
}
