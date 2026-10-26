/**
 * @fileoverview Module `src/data/datatable/types/sort-prop-dir.type.ts` providing sort prop dir type definitions and implementation.
 * @zh 模块文件 `src/data/datatable/types/sort-prop-dir.type.ts`，提供排序属性目录类型相关的定义与实现。
 */

import { SortDirection } from './sort-direction.type';
import { TableColumnProp } from './table-column.type';

/**
 * Interface `SortPropDir` defining the contract and properties for sort prop dir.
 * @zh 接口 `SortPropDir`，定义排序属性目录的数据结构契约与属性规范。
 */
export interface SortPropDir {
  /**
   * Property `dir` (`SortDirection`) storing dir.
   * @zh 属性 `dir`（类型：`SortDirection`），用于存储或配置目录。
   */
  dir: SortDirection;
  /**
   * Property `prop` (`TableColumnProp`) storing prop.
   * @zh 属性 `prop`（类型：`TableColumnProp`），用于存储或配置属性。
   */
  prop: TableColumnProp;
}
