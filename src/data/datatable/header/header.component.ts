/**
 * @fileoverview Module `src/data/datatable/header/header.component.ts` providing header component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/header/header.component.ts`，提供表头组件相关的定义与实现。
 */

import {
  Component, Output, EventEmitter, Input, HostBinding, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { SortType } from '../types/sort.type';
import { SelectionType } from '../types/selection.type';
import { columnsByPin, columnGroupWidths, columnsByPinArr } from '../utils/column';
import { translateXY } from '../utils/translate';
import { DataTableColumnDirective } from '../columns/column.directive';
import { TranslatePipe } from '@dotos/dui/translator';

/**
 * Angular component `DataTableHeaderComponent` (selector: 'datatable-header') providing data table header component presentation and interaction in `src/data/datatable/header`.
 * @zh Angular 组件 `DataTableHeaderComponent`（selector: 'datatable-header'），提供数据表格表头组件的视图渲染与交互逻辑（位于 `src/data/datatable/header`）。
 */
@Component({
  selector: 'datatable-header',
  templateUrl: 'header.component.html',
  host: {
    class: 'datatable-header'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[TranslatePipe]
})


export class DataTableHeaderComponent implements OnDestroy {
  /**
   * Input property `sortAscendingIcon` (`any`) configuring sort ascending icon.
   * @zh 输入属性 `sortAscendingIcon`（类型：`any`），用于配置排序Ascending图标。
   */
  @Input() sortAscendingIcon;
  /**
   * Input property `sortDescendingIcon` (`any`) configuring sort descending icon.
   * @zh 输入属性 `sortDescendingIcon`（类型：`any`），用于配置排序Descending图标。
   */
  @Input() sortDescendingIcon;
  /**
   * Input property `scrollbarH` (`boolean`) configuring scrollbar h.
   * @zh 输入属性 `scrollbarH`（类型：`boolean`），用于配置滚动条H。
   */
  @Input() scrollbarH: boolean;
  /**
   * Input property `dealsWithGroup` (`boolean`) configuring deals with group.
   * @zh 输入属性 `dealsWithGroup`（类型：`boolean`），用于配置deals带有分组。
   */
  @Input() dealsWithGroup: boolean;
  /**
   * Input property `targetMarkerTemplate` (`any`) configuring target marker template.
   * @zh 输入属性 `targetMarkerTemplate`（类型：`any`），用于配置目标标记点模板。
   */
  @Input() targetMarkerTemplate;

  /**
   * Property `targetMarkerContext` (`any`) storing target marker context.
   * @zh 属性 `targetMarkerContext`（类型：`any`），用于存储或配置目标标记点上下文。
   */
  targetMarkerContext;

  /**
   * Input setter `innerWidth` updating inner width.
   * @zh 输入属性 `innerWidth` 的设置器，用于更新内部宽度。
   * @param val - New inner width value (`number`) / 新的内部宽度值（`number`）
   */
  @Input() set innerWidth(val: number) {
    this._innerWidth = val;
    if (this._innerWidthTimeout) {
      clearTimeout(this._innerWidthTimeout);
    }
    this._innerWidthTimeout = setTimeout(() => {
      this._innerWidthTimeout = null;
      if (this._columns && !this.destroyed) {
        const colByPin = columnsByPin(this._columns);
        this.columnGroupWidths = columnGroupWidths(colByPin, this._columns);
        this.setStylesByGroup();
      }
    });
  }

  /**
   * Gets the current inner width (`innerWidth: number`).
   * @zh 获取当前内部宽度（`innerWidth: number`）。
   */
  get innerWidth(): number {
    return this._innerWidth;
  }

  /**
   * Input property `sorts` (`any`) configuring sorts.
   * @zh 输入属性 `sorts`（类型：`any`），用于配置排序集合。
   */
  @Input() sorts;
  /**
   * Input property `sortType` (`SortType`) configuring sort type.
   * @zh 输入属性 `sortType`（类型：`SortType`），用于配置排序类型。
   */
  @Input() sortType: SortType;
  /**
   * Input property `allRowsSelected` (`boolean`) configuring all rows selected.
   * @zh 输入属性 `allRowsSelected`（类型：`boolean`），用于配置全部行列表已选中。
   */
  @Input() allRowsSelected: boolean;
  /**
   * Input property `partialRowsSelected` (`boolean`) configuring partial rows selected.
   * @zh 输入属性 `partialRowsSelected`（类型：`boolean`），用于配置partial行列表已选中。
   */
  @Input() partialRowsSelected: boolean;
  /**
   * Input property `selectionType` (`SelectionType`) configuring selection type.
   * @zh 输入属性 `selectionType`（类型：`SelectionType`），用于配置selection类型。
   */
  @Input() selectionType: SelectionType;
  /**
   * Input property `reorderable` (`boolean`) configuring reorderable.
   * @zh 输入属性 `reorderable`（类型：`boolean`），用于配置reorderable。
   */
  @Input() reorderable: boolean;
  /**
   * Input property `columnMode` (`string`) configuring column mode (default: `'force'`).
   * @zh 输入属性 `columnMode`（类型：`string`），用于配置列模式（默认值：`'force'`）。
   */
  @Input() columnMode:string='force';

  /**
   * Property `dragEventTarget` (`any`) storing drag event target.
   * @zh 属性 `dragEventTarget`（类型：`any`），用于存储或配置拖拽事件目标。
   */
  dragEventTarget;

  /**
   * Input setter `headerHeight` updating header height.
   * @zh 输入属性 `headerHeight` 的设置器，用于更新表头高度。
   * @param val - New header height value (`string`) / 新的表头高度值（`string`）
   */
  @HostBinding('style.height')
  @Input()
  set headerHeight(val) {
    if (val !== 'auto') {
      this._headerHeight = `${val}px`;
    } else {
      this._headerHeight = val;
    }
  }

  /**
   * Gets the current header height (`headerHeight: any`).
   * @zh 获取当前表头高度（`headerHeight: any`）。
   */
  get headerHeight() {
    return this._headerHeight;
  }

  /**
   * Input setter `columns` updating columns.
   * @zh 输入属性 `columns` 的设置器，用于更新列集合。
   * @param val - New columns value (`any`) / 新的列集合值（`any`）
   */
  @Input() set columns(val) {
    this._columns = val;
    const colsByPin = columnsByPin(val);
    this._columnsByPin = columnsByPinArr(val);

    this.columnGroupWidths = columnGroupWidths(colsByPin, val);
    this.setStylesByGroup();
    this.cd.detectChanges();
  }

  /**
   * Gets the current columns (`columns: any[]`).
   * @zh 获取当前列集合（`columns: any[]`）。
   */
  get columns() {
    return this._columns;
  }

  /**
   * Input setter `offsetX` updating offset x.
   * @zh 输入属性 `offsetX` 的设置器，用于更新偏移量X坐标。
   * @param val - New offset x value (`number`) / 新的偏移量X坐标值（`number`）
   */
  @Input()
  set offsetX(val: number) {
    this._offsetX = val;
    this.setStylesByGroup();
  }
  /**
   * Gets the current offset x (`offsetX: any`).
   * @zh 获取当前偏移量X坐标（`offsetX: any`）。
   */
  get offsetX() {
    return this._offsetX;
  }

  /**
   * Output event emitter `sort` (`EventEmitter<any>`) firing when sort occurs.
   * @zh 输出事件 `sort`（类型：`EventEmitter<any>`），当触发排序时向外发出事件。
   */
  @Output() sort = new EventEmitter();
  /**
   * Output event emitter `reorder` (`EventEmitter<any>`) firing when reorder occurs.
   * @zh 输出事件 `reorder`（类型：`EventEmitter<any>`），当触发重排时向外发出事件。
   */
  @Output() reorder = new EventEmitter();
  /**
   * Output event emitter `resize` (`EventEmitter<any>`) firing when resize occurs.
   * @zh 输出事件 `resize`（类型：`EventEmitter<any>`），当触发调整尺寸时向外发出事件。
   */
  @Output() resize = new EventEmitter();
  /**
   * Output event emitter `select` (`EventEmitter<any>`) firing when select occurs.
   * @zh 输出事件 `select`（类型：`EventEmitter<any>`），当触发下拉选择时向外发出事件。
   */
  @Output() select = new EventEmitter();
  /**
   * Output event emitter `columnContextmenu` (`EventEmitter<{ event: MouseEvent; column: any; }>`) firing when column contextmenu occurs.
   * @zh 输出事件 `columnContextmenu`（类型：`EventEmitter<{ event: MouseEvent; column: any; }>`），当触发列Contextmenu时向外发出事件。
   */
  @Output() columnContextmenu = new EventEmitter<{ event: MouseEvent; column }>(false);

  /**
   * Property `_columnsByPin` (`any`) storing columns by pin.
   * @zh 属性 `_columnsByPin`（类型：`any`），用于存储或配置列集合按Pin。
   */
  _columnsByPin;
  /**
   * Property `columnGroupWidths` (`{ total: number; }`) storing column group widths (default: `{ total: 100 }`).
   * @zh 属性 `columnGroupWidths`（类型：`{ total: number; }`），用于存储或配置列分组宽度（默认值：`{ total: 100 }`）。
   */
  columnGroupWidths = {
    total: 100
  };
  /**
   * Property `_innerWidth` (`number`) storing inner width.
   * @zh 属性 `_innerWidth`（类型：`number`），用于存储或配置内部宽度。
   */
  _innerWidth: number;
  /**
   * Property `_offsetX` (`number`) storing offset x.
   * @zh 属性 `_offsetX`（类型：`number`），用于存储或配置偏移量X坐标。
   */
  _offsetX: number;
  /**
   * Property `_columns` (`any`) storing columns.
   * @zh 属性 `_columns`（类型：`any`），用于存储或配置列集合。
   */
  _columns;
  /**
   * Property `_headerHeight` (`string`) storing header height.
   * @zh 属性 `_headerHeight`（类型：`string`），用于存储或配置表头高度。
   */
  _headerHeight: string;
  /**
   * Property `_styleByGroup` (`{ [prop: string]: {}; }`) storing style by group (default: `{ left: {}, center: {}, right: {} }`).
   * @zh 属性 `_styleByGroup`（类型：`{ [prop: string]: {}; }`），用于存储或配置样式按分组（默认值：`{ left: {}, center: {}, right: {} }`）。
   */
  _styleByGroup: { [prop: string]: {} } = {
    left: {},
    center: {},
    right: {}
  };

  /**
   * Property `destroyed` (`boolean`) storing destroyed (default: `false`).
   * @zh 属性 `destroyed`（类型：`boolean`），用于存储或配置已销毁（默认值：`false`）。
   */
  private destroyed = false;
  /**
   * Property `_innerWidthTimeout` (`any`) storing inner width timeout.
   * @zh 属性 `_innerWidthTimeout`（类型：`any`），用于存储或配置内部宽度延时器。
   */
  private _innerWidthTimeout;

  /**
   * Creates an instance of `DataTableHeaderComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableHeaderComponent` 实例，并初始化其依赖项与内部状态。
   * @param cd - Injected or initial cd (`ChangeDetectorRef`) / 注入或传入的cd（`ChangeDetectorRef`）
   */
  constructor(private cd: ChangeDetectorRef) {}

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.destroyed = true;
    if (this._innerWidthTimeout) {
      clearTimeout(this._innerWidthTimeout);
      this._innerWidthTimeout = null;
    }
  }

  /**
   * Executes `onLongPressStart` to handle on long press start.
   * @zh 执行 `onLongPressStart`，用于当LongPress开始。
   * @param options - { event, model } parameter (`{ event: any; model: any }`) / {event,模型}参数（`{ event: any; model: any }`）
   */
  onLongPressStart({ event, model }: { event; model }) {
    model.dragging = true;
    this.dragEventTarget = event;
  }

  /**
   * Executes `onLongPressEnd` to handle on long press end.
   * @zh 执行 `onLongPressEnd`，用于当LongPress结束。
   * @param options - { event, model } parameter (`{ event: any; model: any }`) / {event,模型}参数（`{ event: any; model: any }`）
   */
  onLongPressEnd({ event, model }: { event; model }) {
    this.dragEventTarget = event;

    // delay resetting so sort can be
    // prevented if we were dragging
    setTimeout(() => {
      // datatable component creates copies from columns on reorder
      // set dragging to false on new objects
      const column = this._columns.find(c => c.$$id === model.$$id);
      if (column) {
        column.dragging = false;
      }
    }, 5);
  }

  /**
   * Host-bound getter `headerWidth` (`string`) computing header width.
   * @zh 宿主绑定读取器 `headerWidth`（绑定至 `style.width`），计算并返回表头宽度。
   */
  @HostBinding('style.width')
  get headerWidth(): string {
    if (this.scrollbarH) {
      return this.innerWidth + 'px';
    }
    return '100%';
  }

  /**
   * Executes `trackByGroups` to handle track by groups.
   * @zh 执行 `trackByGroups`，用于跟踪按分组。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param colGroup - col group parameter (`any`) / 列分组参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  trackByGroups(index: number, colGroup) {
    return colGroup.type;
  }

  /**
   * Executes `columnTrackingFn` to handle column tracking fn.
   * @zh 执行 `columnTrackingFn`，用于列Tracking函数。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param column - column parameter (`any`) / 列参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  columnTrackingFn(index: number, column) {
    return column.$$id;
  }

  /**
   * Executes `onColumnResized` to handle on column resized.
   * @zh 执行 `onColumnResized`，用于当列已调整尺寸。
   * @param width - width parameter (`number`) / 宽度参数（`number`）
   * @param column - column parameter (`DataTableColumnDirective`) / 列参数（`DataTableColumnDirective`）
   */
  onColumnResized(width: number, column: DataTableColumnDirective): void {
    if (width <= column.minWidth) {
      width = column.minWidth;
    } else if (width >= column.maxWidth) {
      width = column.maxWidth;
    }

    this.resize.emit({
      column,
      prevValue: column.width,
      newValue: width
    });
  }

  /**
   * Executes `onColumnReordered` to handle on column reordered.
   * @zh 执行 `onColumnReordered`，用于当列已重排。
   * @param options - { prev index, new index, model } parameter (`any`) / {前一个Index,新Index,模型}参数（`any`）
   */
  onColumnReordered({ prevIndex, newIndex, model }): void {
    const column = this.getColumn(newIndex);
    column.isTarget = false;
    column.targetMarkerContext = undefined;
    this.reorder.emit({
      column: model,
      prevValue: prevIndex,
      newValue: newIndex
    });
  }

  /**
   * Executes `onTargetChanged` to handle on target changed.
   * @zh 执行 `onTargetChanged`，用于当目标已变更。
   * @param { prevIndex, newIndex, initial... - { prev index, new index, initial parameter (`any`) / {前一个Index,新Index,初始参数（`any`）
   */
  onTargetChanged({ prevIndex, newIndex, initialIndex }): void {
    if (prevIndex || prevIndex === 0) {
      const oldColumn = this.getColumn(prevIndex);
      oldColumn.isTarget = false;
      oldColumn.targetMarkerContext = undefined;
    }
    if (newIndex || newIndex === 0) {
      const newColumn = this.getColumn(newIndex);
      newColumn.isTarget = true;

      if (initialIndex !== newIndex) {
        newColumn.targetMarkerContext = {
          class: 'targetMarker '.concat(initialIndex > newIndex ? 'dragFromRight' : 'dragFromLeft')
        };
      }
    }
  }

  /**
   * Executes `getColumn` to handle get column.
   * @zh 执行 `getColumn`，用于获取列。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  getColumn(index: number) {
    const leftColumnCount = this._columnsByPin[0].columns.length;
    if (index < leftColumnCount) {
      return this._columnsByPin[0].columns[index];
    }

    const centerColumnCount = this._columnsByPin[1].columns.length;
    if (index < leftColumnCount + centerColumnCount) {
      return this._columnsByPin[1].columns[index - leftColumnCount];
    }

    return this._columnsByPin[2].columns[index - leftColumnCount - centerColumnCount];
  }

  /**
   * Executes `onSort` to handle on sort.
   * @zh 执行 `onSort`，用于当排序。
   * @param { column, prevValue, newValue... - { column, prev value, new value parameter (`any`) / {column,前一个Value,新值参数（`any`）
   */
  onSort({ column, prevValue, newValue }): void {
    // if we are dragging don't sort!
    if (column.dragging) {
      return;
    }

    const sorts = this.calcNewSorts(column, prevValue, newValue);
    this.sort.emit({
      sorts,
      column,
      prevValue,
      newValue
    });
  }

  /**
   * Executes `calcNewSorts` to handle calc new sorts.
   * @zh 执行 `calcNewSorts`，用于计算新排序集合。
   * @param column - column parameter (`any`) / 列参数（`any`）
   * @param prevValue - prev value parameter (`number`) / 前一个值参数（`number`）
   * @param newValue - new value parameter (`number`) / 新值参数（`number`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  calcNewSorts(column, prevValue: number, newValue: number) {
    let idx = 0;

    if (!this.sorts) {
      this.sorts = [];
    }

    const sorts = this.sorts.map((s, i) => {
      s = { ...s };
      if (s.prop === column.prop) {
        idx = i;
      }
      return s;
    });

    if (newValue === undefined) {
      sorts.splice(idx, 1);
    } else if (prevValue) {
      sorts[idx].dir = newValue;
    } else {
      if (this.sortType === SortType.single) {
        sorts.splice(0, this.sorts.length);
      }

      sorts.push({ dir: newValue, prop: column.prop });
    }

    return sorts;
  }

  /**
   * Executes `setStylesByGroup` to handle set styles by group.
   * @zh 执行 `setStylesByGroup`，用于集合样式集合按分组。
   */
  setStylesByGroup() {
    this._styleByGroup['left'] = this.calcStylesByGroup('left');
    this._styleByGroup['center'] = this.calcStylesByGroup('center');
    this._styleByGroup['right'] = this.calcStylesByGroup('right');
    if (!this.destroyed) {
      this.cd.detectChanges();
    }
  }

  /**
   * Executes `calcStylesByGroup` to handle calc styles by group.
   * @zh 执行 `calcStylesByGroup`，用于计算样式集合按分组。
   * @param group - group parameter (`string`) / 分组参数（`string`）
   * @returns Result of type `{ width: string; }` / 类型为 `{ width: string; }` 的返回值
   */
  calcStylesByGroup(group: string) {
    const widths = this.columnGroupWidths;
    const offsetX = this.offsetX;
    if(this.columnMode=='flex'){
      const styles = {
        width: `100%`
      };
      if (group !== 'center') {
        styles.width="0%";
      }
      return styles;
    }else{
      const styles = {
        width: `${widths[group]}px`
      };
      if (group === 'center') {
        translateXY(styles, offsetX * -1, 0);
      } else if (group === 'right') {
        const totalDiff = widths.total - this.innerWidth;
        const offset = totalDiff * -1;
        translateXY(styles, offset, 0);
      }
      return styles;
    }

  }
}
