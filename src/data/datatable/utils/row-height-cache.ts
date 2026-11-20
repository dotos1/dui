/**
 * @fileoverview Module `src/data/datatable/utils/row-height-cache.ts` providing row height cache definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/row-height-cache.ts`，提供行高度缓存相关的定义与实现。
 */


/**
 * Class `RowHeightCache` encapsulating row height cache data structures and logic in `src/data/datatable/utils`.
 * @zh 类 `RowHeightCache`，封装 `src/data/datatable/utils` 中的行高度缓存数据结构与处理逻辑。
 */
export class RowHeightCache {

  /**
   * Property `treeArray` (`number[]`) storing tree array (default: `[]`).
   * @zh 属性 `treeArray`（类型：`number[]`），用于存储或配置树形控件数组（默认值：`[]`）。
   */
  private treeArray: number[] = [];

  /**
   * Whether the cache has been initialized with at least one row.
   * @zh 缓存是否已按行初始化（`initCache` 之后、且有行）。
   */
  get initialized(): boolean {
    return this.treeArray.length > 0;
  }

  /**
   * Clear the Tree array.

   * @zh 执行 `clearCache`，用于清空缓存。
   */
  clearCache(): void {
    this.treeArray = [];
  }

  /**
   * Initialize the Fenwick tree with row Heights.
   *
   *  rows The array of rows which contain the expanded status.
   *  rowHeight The row height.
   *  detailRowHeight The detail row height.

   * @zh 执行 `initCache`，用于初始化缓存。
   */
  initCache(details): void {
    const { rows, rowHeight, detailRowHeight, externalVirtual, rowCount, rowIndexes, rowExpansions } = details;
    const isFn = typeof rowHeight === 'function';
    const isDetailFn = typeof detailRowHeight === 'function';

    if (!isFn && isNaN(rowHeight)) {
      throw new Error(`Row Height cache initialization failed. Please ensure that 'rowHeight' is a
        valid number or function value: (${rowHeight}) when 'scrollbarV' is enabled.`);
    }

    // Add this additional guard in case detailRowHeight is set to 'auto' as it wont work.
    if (!isDetailFn && isNaN(detailRowHeight)) {
      throw new Error(`Row Height cache initialization failed. Please ensure that 'detailRowHeight' is a
        valid number or function value: (${detailRowHeight}) when 'scrollbarV' is enabled.`);
    }

    const n = externalVirtual ? rowCount : rows.length;
    this.treeArray = new Array(n);

    for (let i = 0; i < n; ++i) {
      this.treeArray[i] = 0;
    }

    for (let i = 0; i < n; ++i) {
      const row = rows[i];
      let currentRowHeight = rowHeight;
      if (isFn) {
        currentRowHeight = rowHeight(row);
      }

      // Add the detail row height to the already expanded rows.
      // This is useful for the table that goes through a filter or sort.
      const expanded = rowExpansions.has(row);
      if (row && expanded) {
        if (isDetailFn) {
          const index = rowIndexes.get(row);
          currentRowHeight += detailRowHeight(row, index);
        } else {
          currentRowHeight += detailRowHeight;
        }
      }

      this.update(i, currentRowHeight);
    }
  }

  /**
   * Given the ScrollY position i.e. sum, provide the rowIndex
   * that is present in the current view port.  Below handles edge cases.

   * @zh 执行 `getRowIndex`，用于获取行索引。
   */
  getRowIndex(scrollY: number): number {
    if (scrollY === 0) return 0;
    return this.calcRowIndex(scrollY);
  }

  /**
   * When a row is expanded or rowHeight is changed, update the height.  This can
   * be utilized in future when Angular Data table supports dynamic row heights.

   * @zh 执行 `update`，用于更新。
   */
  update(atRowIndex: number, byRowHeight: number): void {
    if (!this.treeArray.length) {
      throw new Error(`Update at index ${atRowIndex} with value ${byRowHeight} failed:
        Row Height cache not initialized.`);
    }

    const n = this.treeArray.length;
    atRowIndex |= 0;

    while (atRowIndex < n) {
      this.treeArray[atRowIndex] += byRowHeight;
      atRowIndex |= atRowIndex + 1;
    }
  }

  /**
   * Range Sum query from 1 to the rowIndex

   * @zh 执行 `query`，用于查询。
   */
  query(atIndex: number): number {
    // 还没初始化（rows / rowCount 先到、refreshRowHeightCache 还没跑）时视为高度 0，
    // 与 calcRowIndex 对空缓存返回 0 的处理一致；原先在这里抛错，变更检测里会刷控制台报错
    if (!this.treeArray.length) {
      return 0;
    }

    let sum = 0;
    atIndex |= 0;

    while (atIndex >= 0) {
      sum += this.treeArray[atIndex];
      atIndex = (atIndex & (atIndex + 1)) - 1;
    }

    return sum;
  }

  /**
   * Find the total height between 2 row indexes

   * @zh 执行 `queryBetween`，用于查询之间。
   */
  queryBetween(atIndexA: number, atIndexB: number): number {
    return this.query(atIndexB) - this.query(atIndexA - 1);
  }

  /**
   * Given the ScrollY position i.e. sum, provide the rowIndex
   * that is present in the current view port.

   * @zh 执行 `calcRowIndex`，用于计算行索引。
   */
  private calcRowIndex(sum: number): number {
    if (!this.treeArray.length) return 0;

    let pos = -1;
    const dataLength = this.treeArray.length;

    // Get the highest bit for the block size.
    const highestBit = Math.pow(2, dataLength.toString(2).length - 1);

    for (let blockSize = highestBit; blockSize !== 0; blockSize >>= 1) {
      const nextPos = pos + blockSize;
      if (nextPos < dataLength && sum >= this.treeArray[nextPos]) {
        sum -= this.treeArray[nextPos];
        pos = nextPos;
      }
    }

    return pos + 1;
  }
}
