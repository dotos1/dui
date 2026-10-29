/**
 * @fileoverview Module `src/data/datatable/utils/selection.ts` providing selection definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/selection.ts`，提供selection相关的定义与实现。
 */

/**
 * Executes `selectRows` to handle select rows.
 * @zh 执行 `selectRows`，用于下拉选择行列表。
 * @param selected - selected parameter (`any`) / 已选中参数（`any`）
 * @param row - row parameter (`any`) / 行参数（`any`）
 * @param comparefn - comparefn parameter (`any`) / comparefn参数（`any`）
 */
export function selectRows(selected, row, comparefn) {
  const selectedIndex = comparefn(row, selected);

  if (selectedIndex > -1) {
    selected.splice(selectedIndex, 1);
  } else {
    selected.push(row);
  }

  return selected;
}

/**
 * Executes `selectRowsBetween` to handle select rows between.
 * @zh 执行 `selectRowsBetween`，用于下拉选择行列表之间。
 * @param selected - selected parameter (`any`) / 已选中参数（`any`）
 * @param rows - rows parameter (`any`) / 行列表参数（`any`）
 * @param index - index parameter (`number`) / 索引参数（`number`）
 * @param prevIndex - prev index parameter (`number`) / 前一个索引参数（`number`）
 * @param comparefn - comparefn parameter (`any`) / comparefn参数（`any`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function selectRowsBetween(
  selected,
  rows,
  index: number,
  prevIndex: number,
  comparefn
) {
  const reverse = index < prevIndex;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const greater = i >= prevIndex && i <= index;
    const lesser = i <= prevIndex && i >= index;

    let range = { start: 0, end: 0 };
    if (reverse) {
      range = {
        start: index,
        end: prevIndex
      };
    } else {
      range = {
        start: prevIndex,
        end: index + 1
      };
    }

    if ((reverse && lesser) || (!reverse && greater)) {
      // if in the positive range to be added to `selected`, and
      // not already in the selected array, add it
      if (i >= range.start && i <= range.end) {
        selected.push(row);
      }
    }
  }

  return selected;
}
