
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
 */
export interface IMessages {
  // Message to show when array is presented
  // but contains no values
  emptyMessage: string;

  // Footer total message
  totalMessage: string,

  // Footer selected message
  selectedMessage: string
};

export interface IDataSource {
  apiBase: string;
  url: string;
  id:  string;
  totalCount: string;
  data:  string;
};

/**
 * Column Type
 *  {object}
 */
export interface ITable {
  /**
    * Template for the target marker of drag target columns.
    */
  targetMarkerTemplate: any;

  /**
   * This attribute allows the user to set the name of the column to group the data with
   */
  groupRowsBy?: string;



  groupedRows: any[];

  /**
   * Columns to be displayed.
   */
  columns: TableColumn[];

  /**
   * List of row objects that should be
   * represented as selected in the grid.
   * Default value: `[]`
   */
  selected: any[];

  /**
   * Enable vertical scrollbars
   */
  scrollbarV?: boolean;

  /**
   * Enable horz scrollbars
   */
  scrollbarH?: boolean;

  /**
   * The row height; which is necessary
   * to calculate the height for the lazy rendering.
   */
  rowHeight?: number;

  /**
   * Type of column width distribution formula.
   * Example: flex, force, standard
   */
  columnMode?: ColumnMode;

  /**
   * The minimum header height in pixels.
   * Pass a falsey for no header
   */
  headerHeight?: any;

  /**
   * The minimum footer height in pixels.
   * Pass falsey for no footer
   */
  footerHeight?: number;

  /**
   * If the table should use external paging
   * otherwise its assumed that all data is preloaded.
   */
  externalPaging?: boolean;

  /**
   * If the table should use external sorting or
   * the built-in basic sorting.
   */
  externalSorting?: boolean;

  /**
   * The page size to be shown.
   * Default value: `undefined`
   */
  limit: number | undefined;


  /**
   * The total count of all rows.
   * Default value: `0`
   */
  count: number;


  /**
   * The current offset ( page - 1 ) shown.
   * Default value: `0`
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
   */
  selectionType: SelectionType;

  /**
   * Enable/Disable ability to re-order columns
   * by dragging them.
   */
  reorderable?: boolean;

  /**
   * Swap columns on re-order columns or
   * move them.
   */
  swapColumns?: boolean;

  /**
   * The type of sorting
   */
  sortType?: SortType;

  /**
   * Array of sorted columns by property and type.
   * Default value: `[]`
   */
  sorts?: any[] ;

  /**
   * Message overrides for localization
   *
   * emptyMessage     [default] = 'No data to display'
   * totalMessage     [default] = 'total'
   * selectedMessage  [default] = 'selected'
   */
  messages?: IMessages;

  /**
   * This will be used when displaying or selecting rows.
   * when tracking/comparing them, we'll use the value of this fn,
   *
   * (`fn(x) === fn(y)` instead of `x === y`)
   */
  rowIdentity?: Function;

  /**
   * Row specific classes.
   * Similar implementation to ngClass.
   *
   *  [rowClass]="'first second'"
   *  [rowClass]="{ 'first': true, 'second': true, 'third': false }"
   */
  rowClass?: any;

  /**
   * A boolean/function you can use to check whether you want
   * to select a particular row based on a criteria. Example:
   *
   *    (selection) => {
   *      return selection !== 'Ethel Price';
   *    }
   */
  selectCheck?: any;

  /**
   * A function you can use to check whether you want
   * to show the checkbox for a particular row based on a criteria. Example:
   *
   *    (row, column, value) => {
   *      return row.name !== 'Ethel Price';
   *    }
   */
  displayCheck?: (row: any, column?: any, value?: any) => boolean;

  /**
   * A boolean you can use to set the detault behaviour of rows and groups
   * whether they will start expanded or not. If ommited the default is NOT expanded.
   *
   */
  groupExpansionDefault?: boolean;

  /**
   * Property to which you can use for custom tracking of rows.
   * Example: 'name'
   */
  trackByProp?: string;

  /**
   * Property to which you can use for determining select all
   * rows on current page or not.
   *
   *  {boolean}
   * @DatatableComponent
   */
  selectAllRowsOnPage?: boolean;

  /**
   * A flag for row virtualization on / off
   */
  virtualization?: boolean;

  /**
   * Tree from relation
   */
  treeFromRelation?: string;

  /**
   * Tree to relation
   */
  treeToRelation?: string;

  /**
   * A flag for switching summary row on / off
   */
  summaryRow?: boolean;

  /**
   * A height of summary row
   */
  summaryHeight?: number;




}
