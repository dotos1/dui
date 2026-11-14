/**
 * @fileoverview Module `src/data/datatable/row/row-wrapper.component.ts` providing row wrapper component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/row/row-wrapper.component.ts`，提供行包装器组件相关的定义与实现。
 */

import { DuiStyle } from '@dotos/dui/base';
import {
  Component, Input, Output, EventEmitter, HostListener, DoCheck,
  ChangeDetectionStrategy, KeyValueDiffer, ChangeDetectorRef, KeyValueDiffers
} from '@angular/core';

/**
 * Angular component `DataTableRowWrapperComponent` (selector: 'datatable-row-wrapper') providing data table row wrapper component presentation and interaction in `src/data/datatable/row`.
 * @zh Angular 组件 `DataTableRowWrapperComponent`（selector: 'datatable-row-wrapper'），提供数据表格行包装器组件的视图渲染与交互逻辑（位于 `src/data/datatable/row`）。
 */
@Component({
  selector: 'datatable-row-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'row-wrapper.component.html',
  host: {
    class: 'datatable-row-wrapper'
  },
  standalone: false
})

export class DataTableRowWrapperComponent implements DoCheck {
  /**
   * Input property `innerWidth` (`number`) configuring inner width.
   * @zh 输入属性 `innerWidth`（类型：`number`），用于配置内部宽度。
   */
  @Input() innerWidth: number;
  /**
   * Input property `rowDetail` (`any`) configuring row detail.
   * @zh 输入属性 `rowDetail`（类型：`any`），用于配置行详情。
   */
  @Input() rowDetail;
  /**
   * Input property `groupHeader` (`any`) configuring group header.
   * @zh 输入属性 `groupHeader`（类型：`any`），用于配置分组表头。
   */
  @Input() groupHeader;
  /**
   * Input property `offsetX` (`number`) configuring offset x.
   * @zh 输入属性 `offsetX`（类型：`number`），用于配置偏移量X坐标。
   */
  @Input() offsetX: number;
  /**
   * Input property `detailRowHeight` (`any`) configuring detail row height.
   * @zh 输入属性 `detailRowHeight`（类型：`any`），用于配置详情行高度。
   */
  @Input() detailRowHeight;
  /**
   * Input property `row` (`Record<string, unknown>`) configuring row (default: `{}`).
   * @zh 输入属性 `row`（类型：`Record<string, unknown>`），用于配置行（默认值：`{}`）。
   */
  @Input() row: Record<string, unknown> = {};
  /**
   * Input property `groupedRows` (`any`) configuring grouped rows.
   * @zh 输入属性 `groupedRows`（类型：`any`），用于配置已分组行列表。
   */
  @Input() groupedRows;
  /**
   * Output event emitter `rowContextmenu` (`EventEmitter<{ event: MouseEvent; row: any; }>`) firing when row contextmenu occurs.
   * @zh 输出事件 `rowContextmenu`（类型：`EventEmitter<{ event: MouseEvent; row: any; }>`），当触发行Contextmenu时向外发出事件。
   */
  @Output() rowContextmenu = new EventEmitter<{ event: MouseEvent; row }>(false);

  /**
   * Input setter `rowIndex` updating row index.
   * @zh 输入属性 `rowIndex` 的设置器，用于更新行索引。
   * @param val - New row index value (`number`) / 新的行索引值（`number`）
   */
  @Input() set rowIndex(val: number) {
    this._rowIndex = val;
    this.rowContext.rowIndex = val;
    this.groupContext.rowIndex = val;
    this.cd.markForCheck();
  }

  /**
   * Gets the current row index (`rowIndex: number`).
   * @zh 获取当前行索引（`rowIndex: number`）。
   */
  get rowIndex(): number {
    return this._rowIndex;
  }

  /**
   * Input setter `expanded` updating expanded.
   * @zh 输入属性 `expanded` 的设置器，用于更新已展开。
   * @param val - New expanded value (`boolean`) / 新的已展开值（`boolean`）
   */
  @Input() set expanded(val: boolean) {
    this._expanded = val;
    this.groupContext.expanded = val;
    this.rowContext.expanded = val;
    this.cd.markForCheck();
  }

  /**
   * Gets the current expanded (`expanded: boolean`).
   * @zh 获取当前已展开（`expanded: boolean`）。
   */
  get expanded(): boolean {
    return this._expanded;
  }

  /**
   * Property `groupContext` (`{ group: Record<string, unknown>; expanded: boolean; rowIndex: number; }`) storing group context.
   * @zh 属性 `groupContext`（类型：`{ group: Record<string, unknown>; expanded: boolean; rowIndex: number; }`），用于存储或配置分组上下文。
   */
  groupContext = {
    group: this.row,
    expanded: this.expanded,
    rowIndex: this.rowIndex
  };

  /**
   * Property `rowContext` (`{ row: Record<string, unknown>; expanded: boolean; rowIndex: number; }`) storing row context.
   * @zh 属性 `rowContext`（类型：`{ row: Record<string, unknown>; expanded: boolean; rowIndex: number; }`），用于存储或配置行上下文。
   */
  rowContext = {
    row: this.row,
    expanded: this.expanded,
    rowIndex: this.rowIndex
  };

  /**
   * Property `rowDiffer` (`KeyValueDiffer<{}, {}>`) storing row differ.
   * @zh 属性 `rowDiffer`（类型：`KeyValueDiffer<{}, {}>`），用于存储或配置行Differ。
   */
  private rowDiffer: KeyValueDiffer<{}, {}>;
  /**
   * Property `_expanded` (`boolean`) storing expanded (default: `false`).
   * @zh 属性 `_expanded`（类型：`boolean`），用于存储或配置已展开（默认值：`false`）。
   */
  private _expanded: boolean = false;
  /**
   * Property `_rowIndex` (`number`) storing row index.
   * @zh 属性 `_rowIndex`（类型：`number`），用于存储或配置行索引。
   */
  private _rowIndex: number;

  /**
   * Creates an instance of `DataTableRowWrapperComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableRowWrapperComponent` 实例，并初始化其依赖项与内部状态。
   * @param cd - Injected or initial cd (`ChangeDetectorRef`) / 注入或传入的cd（`ChangeDetectorRef`）
   * @param differs - Injected or initial differs (`KeyValueDiffers`) / 注入或传入的differs（`KeyValueDiffers`）
   */
  constructor(private cd: ChangeDetectorRef, private differs: KeyValueDiffers) {
    this.rowDiffer = differs.find({}).create();
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.row)) {
      this.rowContext.row = this.row;
      this.groupContext.group = this.row;
      this.cd.markForCheck();
    }
  }

  /**
   * Host event listener `onContextmenu` handling `contextmenu` events for on contextmenu.
   * @zh 宿主事件监听方法 `onContextmenu`，响应 `contextmenu` 事件以处理当Contextmenu。
   * @param $event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  @HostListener('contextmenu', ['$event'])
  onContextmenu($event: MouseEvent): void {
    this.rowContextmenu.emit({ event: $event, row: this.row });
  }

  /**
   * Executes `getGroupHeaderStyle` to handle get group header style.
   * @zh 执行 `getGroupHeaderStyle`，用于获取分组表头样式。
   * @returns Result of type `DuiStyle` / 类型为 `DuiStyle` 的返回值
   */
  getGroupHeaderStyle() {
    const styles: DuiStyle = {};

    styles['transform'] = 'translate3d(' + this.offsetX + 'px, 0px, 0px)';
    styles['backface-visibility'] = 'hidden';
    styles['width'] = this.innerWidth;

    return styles;
  }
}
