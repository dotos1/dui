/**
 * @fileoverview Module `src/data/datatable/utils/column.ts` providing column definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/column.ts`，提供列相关的定义与实现。
 */


/**
 * Executes `columnsByPin` to handle columns by pin.
 * @zh 执行 `columnsByPin`，用于列集合按Pin。
 * @param cols - cols parameter (`any`) / 列列表参数（`any`）
 */
export function columnsByPin(cols) {
  const ret: { left; center; right } = {
    left: [],
    center: [],
    right: []
  };

  if (cols) {
    for (const col of cols) {
      if (col.frozenLeft) {
        ret.left.push(col);
      } else if (col.frozenRight) {
        ret.right.push(col);
      } else {
        ret.center.push(col);
      }
    }
  }

  return ret;
}

/**
 * Returns the widths of all group sets of a column

 * @zh 执行 `columnGroupWidths`，用于列分组宽度。
 */
export function columnGroupWidths(groups, all) {
  return {
    left: columnTotalWidth(groups.left),
    center: columnTotalWidth(groups.center),
    right: columnTotalWidth(groups.right),
    total: Math.floor(columnTotalWidth(all))
  };
}

/**
 * Calculates the total width of all columns and their groups

 * @zh 执行 `columnTotalWidth`，用于列总计宽度。
 */
export function columnTotalWidth(columns, prop?: string) {
  let totalWidth = 0;

  if (columns && Array.isArray(columns)) {
    for (const c of columns) {
      const has = prop && c[prop];
      const width = has ? c[prop] : c.width;
      totalWidth = totalWidth + parseFloat(width);
    }
  }
  return totalWidth;
}

/**
 * Calculates the total width of all columns and their groups

 * @zh 执行 `columnsTotalWidth`，用于列集合总计宽度。
 */
export function columnsTotalWidth(columns, prop?) {
  let totalWidth = 0;

  for (const column of columns) {
    const has = prop && column[prop];
    totalWidth = totalWidth + (has ? column[prop] : column.width);
  }

  return totalWidth;
}

/**
 * Executes `columnsByPinArr` to handle columns by pin arr.
 * @zh 执行 `columnsByPinArr`，用于列集合按PinArr。
 * @param val - val parameter (`any`) / 值参数（`any`）
 */
export function columnsByPinArr(val) {
  const colsByPinArr = [];
  const colsByPin = columnsByPin(val);

  colsByPinArr.push({ type: 'left', columns: colsByPin['left'] });
  colsByPinArr.push({ type: 'center', columns: colsByPin['center'] });
  colsByPinArr.push({ type: 'right', columns: colsByPin['right'] });

  return colsByPinArr;
}
