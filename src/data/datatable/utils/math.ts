/**
 * @fileoverview Module `src/data/datatable/utils/math.ts` providing math definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/math.ts`，提供math相关的定义与实现。
 */

import { columnsByPin, columnsTotalWidth } from './column';


/**
 * Executes `getTotalFlexGrow` to handle get total flex grow.
 * @zh 执行 `getTotalFlexGrow`，用于获取总计FlexGrow。
 * @param columns - columns parameter (`any[]`) / 列集合参数（`any[]`）
 */
export function getTotalFlexGrow(columns) {
  let totalFlexGrow = 0;

  for (const c of columns) {
    totalFlexGrow += c.flexGrow || 0;
  }

  return totalFlexGrow;
}


/**
 * Executes `adjustColumnWidths` to handle adjust column widths.
 * @zh 执行 `adjustColumnWidths`，用于adjust列宽度。
 * @param allColumns - all columns parameter (`any`) / 全部列集合参数（`any`）
 * @param expectedWidth - expected width parameter (`any`) / expected宽度参数（`any`）
 */
export function adjustColumnWidths(allColumns, expectedWidth) {
  const columnsWidth = columnsTotalWidth(allColumns);
  const totalFlexGrow = getTotalFlexGrow(allColumns);
  const colsByGroup = columnsByPin(allColumns);
  if (columnsWidth !== expectedWidth) {
    scaleColumns(colsByGroup, expectedWidth, totalFlexGrow);
  }
}

/**
 * Resizes columns based on the flexGrow property, while respecting manually set widths

 * @zh 执行 `scaleColumns`，用于缩放列集合。
 */
function scaleColumns(colsByGroup, maxWidth, totalFlexGrow) {
  // calculate total width and flexgrow points for coulumns that can be resized
  for (const attr in colsByGroup) {
    for (const column of colsByGroup[attr]) {
      if (!column.canAutoResize) {
        maxWidth -= column.width;
        totalFlexGrow -= column.flexGrow ? column.flexGrow : 0;
      } else {
        column.width = 0;
      }
    }
  }

  const hasMinWidth: Record<string, unknown> = {};
  let remainingWidth = maxWidth;

  // resize columns until no width is left to be distributed
  do {
    const widthPerFlexPoint = remainingWidth / totalFlexGrow;
    remainingWidth = 0;

    for (const attr in colsByGroup) {
      for (const column of colsByGroup[attr]) {
        // if the column can be resize and it hasn't reached its minimum width yet
        if (column.canAutoResize && !hasMinWidth[column.prop]) {
          const newWidth = column.width + column.flexGrow * widthPerFlexPoint;
          if (column.minWidth !== undefined && newWidth < column.minWidth) {
            remainingWidth += newWidth - column.minWidth;
            column.width = column.minWidth;
            hasMinWidth[column.prop] = true;
          } else {
            column.width = newWidth;
          }
        }
      }
    }
  } while (remainingWidth !== 0);
}

/**
 * Forces the width of the columns to
 * distribute equally but overflowing when necessary
 *
 * Rules:
 *
 *  - If combined withs are less than the total width of the grid,
 *    proportion the widths given the min / max / normal widths to fill the width.
 *
 *  - If the combined widths, exceed the total width of the grid,
 *    use the standard widths.
 *
 *  - If a column is resized, it should always use that width
 *
 *  - The proportional widths should never fall below min size if specified.
 *
 *  - If the grid starts off small but then becomes greater than the size ( + / - )
 *    the width should use the original width; not the newly proportioned widths.

 * @zh 执行 `forceFillColumnWidths`，用于force填充列宽度。
 */
export function forceFillColumnWidths(
  allColumns,
  expectedWidth: number,
  startIdx: number,
  allowBleed: boolean,
  defaultColWidth: number = 300
) {
  const columnsToResize = allColumns.slice(startIdx + 1, allColumns.length).filter(c => {
    return c.canAutoResize !== false;
  });

  for (const column of columnsToResize) {
    if (!column.$$oldWidth) {
      column.$$oldWidth = column.width;
    }
  }

  let additionWidthPerColumn = 0;
  let exceedsWindow = false;
  let contentWidth = getContentWidth(allColumns, defaultColWidth);
  let remainingWidth = expectedWidth - contentWidth;
  const columnsProcessed = [];
  const remainingWidthLimit = 1; // when to stop

  // This loop takes care of the
  do {
    additionWidthPerColumn = remainingWidth / columnsToResize.length;
    exceedsWindow = contentWidth >= expectedWidth;

    for (const column of columnsToResize) {
      if (exceedsWindow && allowBleed) {
        column.width = column.$$oldWidth || column.width || defaultColWidth;
      } else {
        const newSize = (column.width || defaultColWidth) + additionWidthPerColumn;

        if (column.minWidth && newSize < column.minWidth) {
          column.width = column.minWidth;
          columnsProcessed.push(column);
        } else if (column.maxWidth && newSize > column.maxWidth) {
          column.width = column.maxWidth;
          columnsProcessed.push(column);
        } else {
          column.width = newSize;
        }
      }

      column.width = Math.max(0, column.width);
    }

    contentWidth = getContentWidth(allColumns);
    remainingWidth = expectedWidth - contentWidth;
    removeProcessedColumns(columnsToResize, columnsProcessed);
  } while (remainingWidth > remainingWidthLimit && columnsToResize.length !== 0);
}

/**
 * Remove the processed columns from the current active columns.

 * @zh 执行 `removeProcessedColumns`，用于移除已处理列集合。
 */
function removeProcessedColumns(columnsToResize, columnsProcessed) {
  for (const column of columnsProcessed) {
    const index = columnsToResize.indexOf(column);
    columnsToResize.splice(index, 1);
  }
}

/**
 * Gets the width of the columns

 * @zh 执行 `getContentWidth`，用于获取内容宽度。
 */
function getContentWidth(allColumns, defaultColWidth: number = 300): number {
  let contentWidth = 0;

  for (const column of allColumns) {
    contentWidth += column.width || defaultColWidth;
  }

  return contentWidth;
}
