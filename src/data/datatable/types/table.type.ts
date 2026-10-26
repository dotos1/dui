/**
 * @fileoverview Module `src/data/datatable/types/table.type.ts` providing table type definitions and implementation.
 * @zh 模块文件 `src/data/datatable/types/table.type.ts`，提供表格类型相关的定义与实现。
 */


import { TableColumn } from './table-column.type';
import { ColumnMode } from './column-mode.type';
import { SelectionType } from './selection.type';
import { SortType } from './sort.type';


/**
 * Message overrides for localization
 *
 * emptyMessage     [default] = 'No data to display'
 * totalMessage     [default] = 'total'
 * selectedMessage  [default] = 'selected'

 * @zh 接口 `IMessages`，定义I消息列表的数据结构契约与属性规范。
 */
export interface IMessages {
  // Message to show when array is presented
  // but contains no values
  /**
   * Property `emptyMessage` (`string`) storing empty message.
   * @zh 属性 `emptyMessage`（类型：`string`），用于存储或配置空消息。
   */
  emptyMessage: string;

  // Footer total message
  /**
   * Property `totalMessage` (`string`) storing total message.
   * @zh 属性 `totalMessage`（类型：`string`），用于存储或配置总计消息。
   */
  totalMessage: string,

  // Footer selected message
  /**
   * Property `selectedMessage` (`string`) storing selected message.
   * @zh 属性 `selectedMessage`（类型：`string`），用于存储或配置已选中消息。
   */
  selectedMessage: string
};

/**
 * Interface `IDataSource` defining the contract and properties for i data source.
 * @zh 接口 `IDataSource`，定义I数据源的数据结构契约与属性规范。
 */
export interface IDataSource {
  /**
   * Property `apiBase` (`string`) storing api base.
   * @zh 属性 `apiBase`（类型：`string`），用于存储或配置API接口基础。
   */
  apiBase: string;
  /**
   * Property `url` (`string`) storing url.
   * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址。
   */
  url: string;
  /**
   * Property `id` (`string`) storing id.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id:  string;
  /**
   * Property `totalCount` (`string`) storing total count.
   * @zh 属性 `totalCount`（类型：`string`），用于存储或配置总计计数。
   */
  totalCount: string;
  /**
   * Property `data` (`string`) storing data.
   * @zh 属性 `data`（类型：`string`），用于存储或配置数据。
   */
  data:  string;
};

/**
 * Column Type
 *  {object}

 * @zh 接口 `ITable`，定义I表格的数据结构契约与属性规范。
 */
export interface ITable {
  /**
    * Template for the target marker of drag target columns.

   * @zh 属性 `targetMarkerTemplate`（类型：`any`），用于存储或配置目标标记点模板。
   */
  targetMarkerTemplate;

  /**
   * This attribute allows the user to set the name of the column to group the data with

   * @zh 属性 `groupRowsBy`（类型：`string`），用于存储或配置分组行列表按。
   */
  groupRowsBy?: string;



  /**
   * Property `groupedRows` (`any[]`) storing grouped rows.
   * @zh 属性 `groupedRows`（类型：`any[]`），用于存储或配置已分组行列表。
   */
  groupedRows;

  /**
   * Columns to be displayed.

   * @zh 属性 `columns`（类型：`TableColumn[]`），用于存储或配置列集合。
   */
  columns: TableColumn[];

  /**
   * List of row objects that should be
   * represented as selected in the grid.
   * Default value: `[]`

   * @zh 属性 `selected`（类型：`any[]`），用于存储或配置已选中。
   */
  selected;

  /**
   * Enable vertical scrollbars

   * @zh 属性 `scrollbarV`（类型：`boolean`），用于存储或配置滚动条V。
   */
  scrollbarV?: boolean;

  /**
   * Enable horz scrollbars

   * @zh 属性 `scrollbarH`（类型：`boolean`），用于存储或配置滚动条H。
   */
  scrollbarH?: boolean;

  /**
   * The row height; which is necessary
   * to calculate the height for the lazy rendering.

   * @zh 属性 `rowHeight`（类型：`number`），用于存储或配置行高度。
   */
  rowHeight?: number;

  /**
   * Type of column width distribution formula.
   * Example: flex, force, standard

   * @zh 属性 `columnMode`（类型：`ColumnMode`），用于存储或配置列模式。
   */
  columnMode?: ColumnMode;

  /**
   * The minimum header height in pixels.
   * Pass a falsey for no header

   * @zh 属性 `headerHeight`（类型：`any`），用于存储或配置表头高度。
   */
  headerHeight?;

  /**
   * The minimum footer height in pixels.
   * Pass falsey for no footer

   * @zh 属性 `footerHeight`（类型：`number`），用于存储或配置表尾高度。
   */
  footerHeight?: number;

  /**
   * If the table should use external paging
   * otherwise its assumed that all data is preloaded.

   * @zh 属性 `externalPaging`（类型：`boolean`），用于存储或配置外部页面。
   */
  externalPaging?: boolean;

  /**
   * If the table should use external sorting or
   * the built-in basic sorting.

   * @zh 属性 `externalSorting`（类型：`boolean`），用于存储或配置外部排序中。
   */
  externalSorting?: boolean;

  /**
   * The page size to be shown.
   * Default value: `undefined`

   * @zh 属性 `limit`（类型：`number | undefined`），用于存储或配置限制。
   */
  limit: number | undefined;


  /**
   * The total count of all rows.
   * Default value: `0`

   * @zh 属性 `count`（类型：`number`），用于存储或配置计数。
   */
  count: number;


  /**
   * The current offset ( page - 1 ) shown.
   * Default value: `0`

   * @zh 属性 `offset`（类型：`number`），用于存储或配置偏移量。
   */
  offset: number;

  /**
   * Type of row selection. Options are:
   *
   *  - `single`
   *  - `multi`
   *  - `checkbox`
   *  - `multiClick`
   *  - `cell`
   *
   * For no selection pass a `falsey`.
   * Default value: `undefined`

   * @zh 属性 `selectionType`（类型：`SelectionType`），用于存储或配置selection类型。
   */
  selectionType: SelectionType;

  /**
   * Enable/Disable ability to re-order columns
   * by dragging them.

   * @zh 属性 `reorderable`（类型：`boolean`），用于存储或配置reorderable。
   */
  reorderable?: boolean;

  /**
   * Swap columns on re-order columns or
   * move them.

   * @zh 属性 `swapColumns`（类型：`boolean`），用于存储或配置swap列集合。
   */
  swapColumns?: boolean;

  /**
   * The type of sorting

   * @zh 属性 `sortType`（类型：`SortType`），用于存储或配置排序类型。
   */
  sortType?: SortType;

  /**
   * Array of sorted columns by property and type.
   * Default value: `[]`

   * @zh 属性 `sorts`（类型：`any[]`），用于存储或配置排序集合。
   */
  sorts? ;

  /**
   * Message overrides for localization
   *
   * emptyMessage     [default] = 'No data to display'
   * totalMessage     [default] = 'total'
   * selectedMessage  [default] = 'selected'

   * @zh 属性 `messages`（类型：`IMessages`），用于存储或配置消息列表。
   */
  messages?: IMessages;

  /**
   * This will be used when displaying or selecting rows.
   * when tracking/comparing them, we'll use the value of this fn,
   *
   * (`fn(x) === fn(y)` instead of `x === y`)

   * @zh 属性 `rowIdentity`（类型：`Function`），用于存储或配置行Identity。
   */
  rowIdentity?: Function;

  /**
   * Row specific classes.
   * Similar implementation to ngClass.
   *
   *  [rowClass]="'first second'"
   *  [rowClass]="{ 'first': true, 'second': true, 'third': false }"

   * @zh 属性 `rowClass`（类型：`any`），用于存储或配置行类名。
   */
  rowClass?;

  /**
   * A boolean/function you can use to check whether you want
   * to select a particular row based on a criteria. Example:
   *
   *    (selection) => {
   *      return selection !== 'Ethel Price';
   *    }

   * @zh 属性 `selectCheck`（类型：`any`），用于存储或配置下拉选择检查。
   */
  selectCheck?;

  /**
   * A function you can use to check whether you want
   * to show the checkbox for a particular row based on a criteria. Example:
   *
   *    (row, column, value) => {
   *      return row.name !== 'Ethel Price';
   *    }

   * @zh 属性 `displayCheck`（类型：`(row: any, column?: any, value?: any) => boolean`），用于存储或配置display检查。
   */
  displayCheck?: (row, column?, value?) => boolean;

  /**
   * A boolean you can use to set the detault behaviour of rows and groups
   * whether they will start expanded or not. If ommited the default is NOT expanded.
   *

   * @zh 属性 `groupExpansionDefault`（类型：`boolean`），用于存储或配置分组展开面板默认。
   */
  groupExpansionDefault?: boolean;

  /**
   * Property to which you can use for custom tracking of rows.
   * Example: 'name'

   * @zh 属性 `trackByProp`（类型：`string`），用于存储或配置track按属性。
   */
  trackByProp?: string;

  /**
   * Property to which you can use for determining select all
   * rows on current page or not.
   *
   *  {boolean}
   * @DatatableComponent

   * @zh 属性 `selectAllRowsOnPage`（类型：`boolean`），用于存储或配置下拉选择全部行列表当页面。
   */
  selectAllRowsOnPage?: boolean;

  /**
   * A flag for row virtualization on / off

   * @zh 属性 `virtualization`（类型：`boolean`），用于存储或配置virtualization。
   */
  virtualization?: boolean;

  /**
   * Tree from relation

   * @zh 属性 `treeFromRelation`（类型：`string`），用于存储或配置树形控件从Relation。
   */
  treeFromRelation?: string;

  /**
   * Tree to relation

   * @zh 属性 `treeToRelation`（类型：`string`），用于存储或配置树形控件转换为Relation。
   */
  treeToRelation?: string;

  /**
   * A flag for switching summary row on / off

   * @zh 属性 `summaryRow`（类型：`boolean`），用于存储或配置汇总行。
   */
  summaryRow?: boolean;

  /**
   * A height of summary row

   * @zh 属性 `summaryHeight`（类型：`number`），用于存储或配置汇总高度。
   */
  summaryHeight?: number;




}
