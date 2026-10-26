/**
 * @fileoverview Module `src/data/datatable/utils/sort.ts` providing sort definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/sort.ts`，提供排序相关的定义与实现。
 */

import { SortType } from '../types/sort.type';
import { SortDirection } from '../types/sort-direction.type';
import { SortPropDir } from '../types/sort-prop-dir.type';
import { getterForProp } from './column-prop-getters';

/**
 * Executes `nextSortDir` to handle next sort dir.
 * @zh 执行 `nextSortDir`，用于下一个排序目录。
 * @param sortType - sort type parameter (`SortType`) / 排序类型参数（`SortType`）
 * @param current - current parameter (`SortDirection`) / 当前参数（`SortDirection`）
 * @returns Result of type `SortDirection | undefined` / 类型为 `SortDirection | undefined` 的返回值
 */
export function nextSortDir(sortType: SortType, current: SortDirection): SortDirection | undefined {
  if (sortType === SortType.single) {
    if (current === SortDirection.asc) {
      return SortDirection.desc;
    } else {
      return SortDirection.asc;
    }
  } else {
    if (!current) {
      return SortDirection.asc;
    } else if (current === SortDirection.asc) {
      return SortDirection.desc;
    } else if (current === SortDirection.desc) {
      return undefined;
    }
    // avoid TS7030: Not all code paths return a value.
    return undefined;
  }
}


/**
 * Executes `orderByComparator` to handle order by comparator.
 * @zh 执行 `orderByComparator`，用于顺序按Comparator。
 * @param a - a parameter (`any`) / a参数（`any`）
 * @param b - b parameter (`any`) / b参数（`any`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
export function orderByComparator(a, b): number {
  if (a === null || typeof a === 'undefined') a = 0;
  if (b === null || typeof b === 'undefined') b = 0;
  if (a instanceof Date && b instanceof Date) {
    if (a < b) return -1;
    if (a > b) return 1;
  } else if (isNaN(parseFloat(a)) || !isFinite(a) || (isNaN(parseFloat(b)) || !isFinite(b))) {
    // Convert to string in case of a=0 or b=0
    a = String(a);
    b = String(b);
    // Isn't a number so lowercase the string to properly compare
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
  } else {
    // Parse strings as numbers to compare properly
    if (parseFloat(a) < parseFloat(b)) return -1;
    if (parseFloat(a) > parseFloat(b)) return 1;
  }

  // equal each other
  return 0;
}

/**
 * creates a shallow copy of the `rows` input and returns the sorted copy. this function
 * does not sort the `rows` argument in place

 * @zh 执行 `sortRows`，用于排序行列表。
 */
export function sortRows(rows, columns, dirs: SortPropDir[]) {
  if (!rows) return [];
  if (!dirs || !dirs.length || !columns) return [...rows];

  /**
   * record the row ordering of results from prior sort operations (if applicable)
   * this is necessary to guarantee stable sorting behavior
   */
  const rowToIndexMap = new Map<unknown, number>();
  rows.forEach((row, index) => rowToIndexMap.set(row, index));

  const temp = [...rows];
  const cols = columns.reduce((obj, col) => {
    if (col.comparator && typeof col.comparator === 'function') {
      obj[col.prop] = col.comparator;
    }
    return obj;
  }, {});

  // cache valueGetter and compareFn so that they
  // do not need to be looked-up in the sort function body
  const cachedDirs = dirs.map(dir => {
    const prop = dir.prop;
    return {
      prop,
      dir: dir.dir,
      valueGetter: getterForProp(prop),
      compareFn: cols[prop] || orderByComparator
    };
  });

  return temp.sort(function (rowA, rowB) {
    for (const cachedDir of cachedDirs) {
      // Get property and valuegetters for column to be sorted
      const { prop, valueGetter } = cachedDir;
      // Get A and B cell values from rows based on properties of the columns
      const propA = valueGetter(rowA, prop);
      const propB = valueGetter(rowB, prop);

      // Compare function gets five parameters:
      // Two cell values to be compared as propA and propB
      // Two rows corresponding to the cells as rowA and rowB
      // Direction of the sort for this column as SortDirection
      // Compare can be a standard JS comparison function (a,b) => -1|0|1
      // as additional parameters are silently ignored. The whole row and sort
      // direction enable more complex sort logic.
      const comparison =
        cachedDir.dir !== SortDirection.desc
          ? cachedDir.compareFn(propA, propB, rowA, rowB, cachedDir.dir)
          : -cachedDir.compareFn(propA, propB, rowA, rowB, cachedDir.dir);

      // Don't return 0 yet in case of needing to sort by next property
      if (comparison !== 0) return comparison;
    }

    if (!(rowToIndexMap.has(rowA) && rowToIndexMap.has(rowB))) return 0;

    /**
     * all else being equal, preserve original order of the rows (stable sort)
     */
    return rowToIndexMap.get(rowA) < rowToIndexMap.get(rowB) ? -1 : 1;
  });
}
