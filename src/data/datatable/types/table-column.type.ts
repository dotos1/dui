/**
 * @fileoverview Module `src/data/datatable/types/table-column.type.ts` providing table column type definitions and implementation.
 * @zh 模块文件 `src/data/datatable/types/table-column.type.ts`，提供表格列类型相关的定义与实现。
 */

import { PipeTransform } from '@angular/core';
import { ValueGetter } from '../utils/column-prop-getters';


/**
 * Type alias `TableColumnProp` representing table column prop (`string | number`).
 * @zh 类型别名 `TableColumnProp`，表示表格列属性（`string | number`）。
 */
export type TableColumnProp = string | number;

/**
 * Column Type

 * @zh 接口 `TableColumn`，定义表格列的数据结构契约与属性规范。
 */
export interface TableColumn {
  /**
   * Internal unique id
   *
   * @memberOf TableColumn

   * @zh 属性 `$id`（类型：`string`），用于存储或配置唯一标识。
   */
  $$id?: string;

  /**
   * Internal for column width distributions
   *
   * @memberOf TableColumn

   * @zh 属性 `$oldWidth`（类型：`number`），用于存储或配置旧宽度。
   */
  $$oldWidth?: number;

  /**
   * Internal for setColumnDefaults
   *
   * @memberOf TableColumn

   * @zh 属性 `$valueGetter`（类型：`ValueGetter`），用于存储或配置值Getter。
   */
  $$valueGetter?: ValueGetter;

  /**
   * Determines if column is checkbox
   *
   * @memberOf TableColumn

   * @zh 属性 `checkboxable`（类型：`boolean`），用于存储或配置checkboxable。
   */
  checkboxable?: boolean;

  /**
   * Determines if the column is frozen to the left
   *
   * @memberOf TableColumn

   * @zh 属性 `frozenLeft`（类型：`boolean`），用于存储或配置是否冻结左侧位置。
   */
  frozenLeft?: boolean;

  /**
   * Determines if the column is frozen to the right
   *
   * @memberOf TableColumn

   * @zh 属性 `frozenRight`（类型：`boolean`），用于存储或配置是否冻结右侧位置。
   */
  frozenRight?: boolean;

  /**
   * The grow factor relative to other columns. Same as the flex-grow
   * API from http =//www.w3.org/TR/css3-flexbox/. Basically;
   * take any available extra width and distribute it proportionally
   * according to all columns' flexGrow values.
   *
   * @memberOf TableColumn

   * @zh 属性 `flexGrow`（类型：`number`），用于存储或配置flexGrow。
   */
  flexGrow?: number;

  /**
   * Min width of the column
   *
   * @memberOf TableColumn

   * @zh 属性 `minWidth`（类型：`number`），用于存储或配置最小值宽度。
   */
  minWidth?: number;

  /**
   * Max width of the column
   *
   * @memberOf TableColumn

   * @zh 属性 `maxWidth`（类型：`number`），用于存储或配置最大值宽度。
   */
  maxWidth?: number;

  /**
   * The default width of the column, in pixels
   *
   * @memberOf TableColumn

   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
   */
  width?: number;

  /**
   * Can the column be resized
   *
   * @memberOf TableColumn

   * @zh 属性 `resizeable`（类型：`boolean`），用于存储或配置resizeable。
   */
  resizeable?: boolean;

  /**
   * Custom sort comparator
   *
   * @memberOf TableColumn

   * @zh 属性 `comparator`（类型：`any`），用于存储或配置comparator。
   */
  comparator?;

  /**
   * Custom pipe transforms
   *
   * @memberOf TableColumn

   * @zh 属性 `pipe`（类型：`PipeTransform`），用于存储或配置管道。
   */
  pipe?: PipeTransform;

  /**
   * Can the column be sorted
   *
   * @memberOf TableColumn

   * @zh 属性 `sortable`（类型：`boolean`），用于存储或配置是否可排序。
   */
  sortable?: boolean;

  /**
   * Can the column be re-arranged by dragging
   *
   * @memberOf TableColumn

   * @zh 属性 `draggable`（类型：`boolean`），用于存储或配置是否可拖拽。
   */
  draggable?: boolean;

  /**
   * Whether the column can automatically resize to fill space in the table.
   *
   * @memberOf TableColumn

   * @zh 属性 `canAutoResize`（类型：`boolean`），用于存储或配置是否可以自动调整尺寸。
   */
  canAutoResize?: boolean;

  /**
   * Column name or label
   *
   * @memberOf TableColumn

   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name?: string;

  /**
   * Property to bind to the row. Example:
   *
   * `someField` or `some.field.nested`, 0 (numeric)
   *
   * If left blank, will use the name as camel case conversion
   *
   * @memberOf TableColumn

   * @zh 属性 `prop`（类型：`TableColumnProp`），用于存储或配置属性。
   */
  prop?: TableColumnProp;

  /**
   * Cell template ref
   *
   * @memberOf TableColumn

   * @zh 属性 `cellTemplate`（类型：`any`），用于存储或配置单元格模板。
   */
  cellTemplate?;

  /**
   * Header template ref
   *
   * @memberOf TableColumn

   * @zh 属性 `headerTemplate`（类型：`any`），用于存储或配置表头模板。
   */
  headerTemplate?;

  /**
   * Tree toggle template ref
   *
   * @memberOf TableColumn

   * @zh 属性 `treeToggleTemplate`（类型：`any`），用于存储或配置树形控件开关模板。
   */
  treeToggleTemplate?;

  /**
   * CSS Classes for the cell
   *
   *
   * @memberOf TableColumn

   * @zh 属性 `cellClass`（类型：`any`），用于存储或配置单元格类名。
   */
  cellClass?;

  /**
   * CSS classes for the header
   *
   *
   * @memberOf TableColumn

   * @zh 属性 `headerClass`（类型：`any`），用于存储或配置表头类名。
   */
  headerClass?;

  /**
   * Header checkbox enabled
   *
   * @memberOf TableColumn

   * @zh 属性 `headerCheckboxable`（类型：`boolean`），用于存储或配置表头Checkboxable。
   */
  headerCheckboxable?: boolean;

  /**
   * Is tree displayed on this column
   *
   * @memberOf TableColumn

   * @zh 属性 `isTreeColumn`（类型：`boolean`），用于存储或配置是否为树形控件列。
   */
  isTreeColumn?: boolean;

  /**
   * Width of the tree level indent
   *
   * @memberOf TableColumn

   * @zh 属性 `treeLevelIndent`（类型：`number`），用于存储或配置树形控件层级Indent。
   */
  treeLevelIndent?: number;

  /**
   * Summary function
   *
   * @memberOf TableColumn

   * @zh 属性 `summaryFunc`（类型：`(cells: any) => any`），用于存储或配置汇总Func。
   */
  summaryFunc?: { (cells) };

  /**
   * Summary cell template ref
   *
   * @memberOf TableColumn

   * @zh 属性 `summaryTemplate`（类型：`any`），用于存储或配置汇总模板。
   */
  summaryTemplate?;
  /**
   * Header tooltip
   *  {string}
   * @TableColumn

   * @zh 属性 `tooltip`（类型：`string`），用于存储或配置悬浮提示。
   */
  tooltip?: string;

  /**
   * Property `hidden` (`boolean`) storing hidden.
   * @zh 属性 `hidden`（类型：`boolean`），用于存储或配置隐藏。
   */
  hidden?: boolean;
  /**
   * Format
   *  {Function}
   * @TableColumn

   * @zh 属性 `format`（类型：`(value: any) => any`），用于存储或配置格式化。
   */
  format?: { (value) };

  /**
   * Property `align` (`string`) storing align.
   * @zh 属性 `align`（类型：`string`），用于存储或配置对齐。
   */
  align?: string

  /**
   * Property `numeric` (`boolean`) storing numeric.
   * @zh 属性 `numeric`（类型：`boolean`），用于存储或配置numeric。
   */
  numeric?: boolean;
}
