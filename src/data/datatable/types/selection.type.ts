/**
 * @fileoverview Module `src/data/datatable/types/selection.type.ts` providing selection type definitions and implementation.
 * @zh 模块文件 `src/data/datatable/types/selection.type.ts`，提供selection类型相关的定义与实现。
 */

/**
 * Enumeration `SelectionType` defining supported selection type constants.
 * @zh 枚举 `SelectionType`，定义支持的Selection类型常量集合。
 */
export enum SelectionType {
  /**
   * Enum member `SelectionType.single` = 'single' representing single.
   * @zh 枚举项 `SelectionType.single` = 'single'，表示单个。
   */
  single = 'single',
  /**
   * Enum member `SelectionType.multi` = 'multi' representing multi.
   * @zh 枚举项 `SelectionType.multi` = 'multi'，表示多。
   */
  multi = 'multi',
  /**
   * Enum member `SelectionType.multiClick` = 'multiClick' representing multi click.
   * @zh 枚举项 `SelectionType.multiClick` = 'multiClick'，表示多点击。
   */
  multiClick = 'multiClick',
  /**
   * Enum member `SelectionType.cell` = 'cell' representing cell.
   * @zh 枚举项 `SelectionType.cell` = 'cell'，表示单元格。
   */
  cell = 'cell',
  /**
   * Enum member `SelectionType.checkbox` = 'checkbox' representing checkbox.
   * @zh 枚举项 `SelectionType.checkbox` = 'checkbox'，表示复选框。
   */
  checkbox = 'checkbox'
}
