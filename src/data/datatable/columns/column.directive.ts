/**
 * @fileoverview Module `src/data/datatable/columns/column.directive.ts` providing column directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/columns/column.directive.ts`，提供列指令相关的定义与实现。
 */

import { Directive, TemplateRef, ContentChild, Input, OnChanges } from '@angular/core';
import { DataTableColumnHeaderDirective } from './column-header.directive';
import { DataTableColumnCellDirective } from './column-cell.directive';
import {
  DataTableColumnCellTreeToggle
} from './tree.directive';
import { TableColumnProp } from '../types/table-column.type';
import { ColumnChangesService } from '../services/column-changes.service';

/**
 * Angular directive `DataTableColumnDirective` (selector: 'dui-datatable-column') attaching data table column directive behavior to host DOM elements.
 * @zh Angular 指令 `DataTableColumnDirective`（selector: 'dui-datatable-column'），为宿主 DOM 元素附加数据表格列指令行为。
 */
@Directive({ selector: 'dui-datatable-column' })


export class DataTableColumnDirective implements OnChanges {
  /**
   * Input property `name` (`string`) configuring name.
   * @zh 输入属性 `name`（类型：`string`），用于配置名称。
   */
  @Input() name: string;
  /**
   * Input property `prop` (`TableColumnProp`) configuring prop.
   * @zh 输入属性 `prop`（类型：`TableColumnProp`），用于配置属性。
   */
  @Input() prop: TableColumnProp;
  /**
   * Input property `frozenLeft` (`any`) configuring frozen left.
   * @zh 输入属性 `frozenLeft`（类型：`any`），用于配置是否冻结左侧位置。
   */
  @Input() frozenLeft;
  /**
   * Input property `frozenRight` (`any`) configuring frozen right.
   * @zh 输入属性 `frozenRight`（类型：`any`），用于配置是否冻结右侧位置。
   */
  @Input() frozenRight;
  /**
   * Input property `flexGrow` (`number`) configuring flex grow.
   * @zh 输入属性 `flexGrow`（类型：`number`），用于配置flexGrow。
   */
  @Input() flexGrow: number;
  /**
   * Input property `resizeable` (`boolean`) configuring resizeable.
   * @zh 输入属性 `resizeable`（类型：`boolean`），用于配置resizeable。
   */
  @Input() resizeable: boolean;
  /**
   * Input property `comparator` (`any`) configuring comparator.
   * @zh 输入属性 `comparator`（类型：`any`），用于配置comparator。
   */
  @Input() comparator;
  /**
   * Input property `pipe` (`any`) configuring pipe.
   * @zh 输入属性 `pipe`（类型：`any`），用于配置管道。
   */
  @Input() pipe;
  /**
   * Input property `sortable` (`boolean`) configuring sortable.
   * @zh 输入属性 `sortable`（类型：`boolean`），用于配置是否可排序。
   */
  @Input() sortable: boolean;
  /**
   * Input property `draggable` (`boolean`) configuring draggable.
   * @zh 输入属性 `draggable`（类型：`boolean`），用于配置是否可拖拽。
   */
  @Input() draggable: boolean;
  /**
   * Input property `canAutoResize` (`boolean`) configuring can auto resize.
   * @zh 输入属性 `canAutoResize`（类型：`boolean`），用于配置是否可以自动调整尺寸。
   */
  @Input() canAutoResize: boolean;
  /**
   * Input property `minWidth` (`number`) configuring min width.
   * @zh 输入属性 `minWidth`（类型：`number`），用于配置最小值宽度。
   */
  @Input() minWidth: number;
  /**
   * Input property `width` (`number`) configuring width.
   * @zh 输入属性 `width`（类型：`number`），用于配置宽度。
   */
  @Input() width: number;
  /**
   * Input property `maxWidth` (`number`) configuring max width.
   * @zh 输入属性 `maxWidth`（类型：`number`），用于配置最大值宽度。
   */
  @Input() maxWidth: number;
  /**
   * Input property `checkboxable` (`boolean`) configuring checkboxable.
   * @zh 输入属性 `checkboxable`（类型：`boolean`），用于配置checkboxable。
   */
  @Input() checkboxable: boolean;
  /**
   * Input property `headerCheckboxable` (`boolean`) configuring header checkboxable.
   * @zh 输入属性 `headerCheckboxable`（类型：`boolean`），用于配置表头Checkboxable。
   */
  @Input() headerCheckboxable: boolean;
  /**
   * Input property `headerClass` (`any`) configuring header class.
   * @zh 输入属性 `headerClass`（类型：`any`），用于配置表头类名。
   */
  @Input() headerClass;
  /**
   * Input property `cellClass` (`any`) configuring cell class.
   * @zh 输入属性 `cellClass`（类型：`any`），用于配置单元格类名。
   */
  @Input() cellClass;
  /**
   * Input property `isTreeColumn` (`boolean`) configuring is tree column.
   * @zh 输入属性 `isTreeColumn`（类型：`boolean`），用于配置是否为树形控件列。
   */
  @Input() isTreeColumn: boolean;
  /**
   * Input property `treeLevelIndent` (`number`) configuring tree level indent.
   * @zh 输入属性 `treeLevelIndent`（类型：`number`），用于配置树形控件层级Indent。
   */
  @Input() treeLevelIndent: number;
  /**
   * Input property `summaryFunc` (`(cells: any) => any`) configuring summary func.
   * @zh 输入属性 `summaryFunc`（类型：`(cells: any) => any`），用于配置汇总Func。
   */
  @Input() summaryFunc: { (cells) };
  /**
   * Input property `summaryTemplate` (`TemplateRef<unknown>`) configuring summary template.
   * @zh 输入属性 `summaryTemplate`（类型：`TemplateRef<unknown>`），用于配置汇总模板。
   */
  @Input() summaryTemplate: TemplateRef<unknown>;

  /**
   * Input property `cellTemplate` (`TemplateRef<any>`) configuring cell template input.
   * @zh 输入属性 `cellTemplate`（类型：`TemplateRef<any>`），用于配置单元格模板输入属性。
   */
  @Input('cellTemplate')
  _cellTemplateInput: TemplateRef<unknown>;

  /**
   * Template/content query reference `_cellTemplateQuery` (`TemplateRef<unknown>`) targeting cell template query.
   * @zh 模板/内容视图查询引用 `_cellTemplateQuery`（`@ContentChild`），指向单元格模板查询。
   */
  @ContentChild(DataTableColumnCellDirective, { read: TemplateRef, static: true })
  _cellTemplateQuery: TemplateRef<unknown>;

  /**
   * Gets the current cell template (`cellTemplate: TemplateRef<any>`).
   * @zh 获取当前单元格模板（`cellTemplate: TemplateRef<any>`）。
   */
  get cellTemplate(): TemplateRef<unknown> {
    return this._cellTemplateInput || this._cellTemplateQuery;
  }

  /**
   * Input property `headerTemplate` (`TemplateRef<any>`) configuring header template input.
   * @zh 输入属性 `headerTemplate`（类型：`TemplateRef<any>`），用于配置表头模板输入属性。
   */
  @Input('headerTemplate')
  _headerTemplateInput: TemplateRef<unknown>;

  /**
   * Template/content query reference `_headerTemplateQuery` (`TemplateRef<unknown>`) targeting header template query.
   * @zh 模板/内容视图查询引用 `_headerTemplateQuery`（`@ContentChild`），指向表头模板查询。
   */
  @ContentChild(DataTableColumnHeaderDirective, { read: TemplateRef, static: true })
  _headerTemplateQuery: TemplateRef<unknown>;

  /**
   * Gets the current header template (`headerTemplate: TemplateRef<any>`).
   * @zh 获取当前表头模板（`headerTemplate: TemplateRef<any>`）。
   */
  get headerTemplate(): TemplateRef<unknown> {
    return this._headerTemplateInput || this._headerTemplateQuery;
  }

  /**
   * Input property `treeToggleTemplate` (`TemplateRef<any>`) configuring tree toggle template input.
   * @zh 输入属性 `treeToggleTemplate`（类型：`TemplateRef<any>`），用于配置树形控件开关模板输入属性。
   */
  @Input('treeToggleTemplate')
  _treeToggleTemplateInput: TemplateRef<unknown>;

  /**
   * Template/content query reference `_treeToggleTemplateQuery` (`TemplateRef<unknown>`) targeting tree toggle template query.
   * @zh 模板/内容视图查询引用 `_treeToggleTemplateQuery`（`@ContentChild`），指向树形控件开关模板查询。
   */
  @ContentChild(DataTableColumnCellTreeToggle, { read: TemplateRef, static: true })
  _treeToggleTemplateQuery: TemplateRef<unknown>;

  /**
   * Gets the current tree toggle template (`treeToggleTemplate: TemplateRef<any>`).
   * @zh 获取当前树形控件开关模板（`treeToggleTemplate: TemplateRef<any>`）。
   */
  get treeToggleTemplate(): TemplateRef<unknown> {
    return this._treeToggleTemplateInput || this._treeToggleTemplateQuery;
  }

  /**
   * Property `isFirstChange` (`boolean`) storing is first change (default: `true`).
   * @zh 属性 `isFirstChange`（类型：`boolean`），用于存储或配置是否为首个变更（默认值：`true`）。
   */
  private isFirstChange = true;

  /**
   * Creates an instance of `DataTableColumnDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableColumnDirective` 实例，并初始化其依赖项与内部状态。
   * @param columnChangesService - Injected or initial column changes service (`ColumnChangesService`) / 注入或传入的列变更集合服务（`ColumnChangesService`）
   */
  constructor(private columnChangesService: ColumnChangesService) { }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.columnChangesService.onInputChange();
    }
  }
}
