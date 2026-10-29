/**
 * @fileoverview Module `src/data/datatable/body/summary/summary-row.component.ts` providing summary row component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/body/summary/summary-row.component.ts`，提供汇总行组件相关的定义与实现。
 */

import { Component, Input, OnChanges, PipeTransform, TemplateRef } from '@angular/core';

/**
 * Interface `ISummaryColumn` defining the contract and properties for i summary column.
 * @zh 接口 `ISummaryColumn`，定义I汇总列的数据结构契约与属性规范。
 */
export interface ISummaryColumn {
  /**
   * Property `summaryFunc` (`(cells: any[]) => any`) storing summary func.
   * @zh 属性 `summaryFunc`（类型：`(cells: any[]) => any`），用于存储或配置汇总Func。
   */
  summaryFunc?: { (cells) };
  /**
   * Property `summaryTemplate` (`TemplateRef<any>`) storing summary template.
   * @zh 属性 `summaryTemplate`（类型：`TemplateRef<any>`），用于存储或配置汇总模板。
   */
  summaryTemplate?: TemplateRef<unknown>;

  /**
   * Property `prop` (`string`) storing prop.
   * @zh 属性 `prop`（类型：`string`），用于存储或配置属性。
   */
  prop: string;
  /**
   * Property `pipe` (`PipeTransform`) storing pipe.
   * @zh 属性 `pipe`（类型：`PipeTransform`），用于存储或配置管道。
   */
  pipe?: PipeTransform;
}

/**
 * Executes `defaultSumFunc` to handle default sum func.
 * @zh 执行 `defaultSumFunc`，用于默认求和Func。
 * @param cells - cells parameter (`any[]`) / 单元格集合参数（`any[]`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
function defaultSumFunc(cells) {
  const cellsWithValues = cells.filter(cell => !!cell);

  if (!cellsWithValues.length) {
    return null;
  }
  if (cellsWithValues.some(cell => typeof cell !== 'number')) {
    return null;
  }

  return cellsWithValues.reduce((res, cell) => res + cell);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Executes `noopSumFunc` to handle noop sum func.
 * @zh 执行 `noopSumFunc`，用于noop求和Func。
 * @param cells - cells parameter (`any[]`) / 单元格集合参数（`any[]`）
 */
function noopSumFunc(cells): void {
  return null;
}

/**
 * Angular component `DataTableSummaryRowComponent` (selector: 'datatable-summary-row') providing data table summary row component presentation and interaction in `src/data/datatable/body/summary`.
 * @zh Angular 组件 `DataTableSummaryRowComponent`（selector: 'datatable-summary-row'），提供数据表格汇总行组件的视图渲染与交互逻辑（位于 `src/data/datatable/body/summary`）。
 */
@Component({
  selector: 'datatable-summary-row',
  templateUrl: 'summary-row.component.html',
  host: {
    class: 'datatable-summary-row'
  }
})

export class DataTableSummaryRowComponent implements OnChanges {
  /**
   * Input property `rows` (`any[]`) configuring rows.
   * @zh 输入属性 `rows`（类型：`any[]`），用于配置行列表。
   */
  @Input() rows;
  /**
   * Input property `columns` (`ISummaryColumn[]`) configuring columns.
   * @zh 输入属性 `columns`（类型：`ISummaryColumn[]`），用于配置列集合。
   */
  @Input() columns: ISummaryColumn[];

  /**
   * Input property `rowHeight` (`number`) configuring row height.
   * @zh 输入属性 `rowHeight`（类型：`number`），用于配置行高度。
   */
  @Input() rowHeight: number;
  /**
   * Input property `offsetX` (`number`) configuring offset x.
   * @zh 输入属性 `offsetX`（类型：`number`），用于配置偏移量X坐标。
   */
  @Input() offsetX: number;
  /**
   * Input property `innerWidth` (`number`) configuring inner width.
   * @zh 输入属性 `innerWidth`（类型：`number`），用于配置内部宽度。
   */
  @Input() innerWidth: number;

  /**
   * Property `_internalColumns` (`ISummaryColumn[]`) storing internal columns.
   * @zh 属性 `_internalColumns`（类型：`ISummaryColumn[]`），用于存储或配置内部列集合。
   */
  _internalColumns: ISummaryColumn[];
  /**
   * Property `summaryRow` (`any`) storing summary row (default: `{}`).
   * @zh 属性 `summaryRow`（类型：`any`），用于存储或配置汇总行（默认值：`{}`）。
   */
  summaryRow: Record<string, unknown> = {};

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    if (!this.columns || !this.rows) {
      return;
    }
    this.updateInternalColumns();
    this.updateValues();
  }

  /**
   * Executes `updateInternalColumns` to handle update internal columns.
   * @zh 执行 `updateInternalColumns`，用于更新内部列集合。
   */
  private updateInternalColumns() {
    this._internalColumns = this.columns.map(col => ({
      ...col,
      cellTemplate: col.summaryTemplate
    }));
  }

  /**
   * Executes `updateValues` to handle update values.
   * @zh 执行 `updateValues`，用于更新值列表。
   */
  private updateValues() {
    this.summaryRow = {};

    this.columns
      .filter(col => !col.summaryTemplate)
      .forEach(col => {
        const cellsFromSingleColumn = this.rows.map(row => row[col.prop]);
        const sumFunc = this.getSummaryFunction(col);

        this.summaryRow[col.prop] = col.pipe
          ? col.pipe.transform(sumFunc(cellsFromSingleColumn))
          : sumFunc(cellsFromSingleColumn);
      });
  }

  /**
   * Executes `getSummaryFunction` to handle get summary function.
   * @zh 执行 `getSummaryFunction`，用于获取汇总函数。
   * @param column - column parameter (`ISummaryColumn`) / 列参数（`ISummaryColumn`）
   * @returns Result of type `(a: any[]) => any` / 类型为 `(a: any[]) => any` 的返回值
   */
  private getSummaryFunction(column: ISummaryColumn): { (a) } {
    if (column.summaryFunc === undefined) {
      return defaultSumFunc;
    } else if (column.summaryFunc === null) {
      return noopSumFunc;
    } else {
      return column.summaryFunc;
    }
  }
}
