/**
 * @fileoverview Module `src/data/datatable/row/row.component.ts` providing row component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/row/row.component.ts`，提供行组件相关的定义与实现。
 */

import {
  Component, Input, HostBinding, ElementRef, Output, KeyValueDiffers, KeyValueDiffer,
  EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, SkipSelf
} from '@angular/core';
import { columnsByPin, columnGroupWidths, columnsByPinArr } from '../utils/column';
import { translateXY } from '../utils/translate';
import { Keys } from '../utils/keys';
import { ScrollbarHelper } from '../services/scrollbar-helper.service';
import { TreeStatus } from './cell.component';

/**
 * Angular component `DataTableBodyRowComponent` (selector: 'datatable-body-row') providing data table body row component presentation and interaction in `src/data/datatable/row`.
 * @zh Angular 组件 `DataTableBodyRowComponent`（selector: 'datatable-body-row'），提供数据表格主体行组件的视图渲染与交互逻辑（位于 `src/data/datatable/row`）。
 */
@Component({
  selector: 'datatable-body-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'row.component.html',
})

export class DataTableBodyRowComponent implements DoCheck {
  /**
   * Input setter `columns` updating columns.
   * @zh 输入属性 `columns` 的设置器，用于更新列集合。
   * @param val - New columns value (`any`) / 新的列集合值（`any`）
   */
  @Input() set columns(val) {
    this._columns = val;
    this.recalculateColumns(val);
    this.buildStylesByGroup();
  }

  /**
   * Gets the current columns (`columns: any[]`).
   * @zh 获取当前列集合（`columns: any[]`）。
   */
  get columns() {
    return this._columns;
  }

  /**
   * Input setter `innerWidth` updating inner width.
   * @zh 输入属性 `innerWidth` 的设置器，用于更新内部宽度。
   * @param val - New inner width value (`number`) / 新的内部宽度值（`number`）
   */
  @Input() set innerWidth(val: number) {
    if (this._columns) {
      const colByPin = columnsByPin(this._columns);
      this._columnGroupWidths = columnGroupWidths(colByPin, this._columns);
    }

    this._innerWidth = val;
    this.recalculateColumns();
    this.buildStylesByGroup();
  }

  /**
   * Gets the current inner width (`innerWidth: number`).
   * @zh 获取当前内部宽度（`innerWidth: number`）。
   */
  get innerWidth(): number {
    return this._innerWidth;
  }

  /**
   * Input property `expanded` (`boolean`) configuring expanded.
   * @zh 输入属性 `expanded`（类型：`boolean`），用于配置已展开。
   */
  @Input() expanded: boolean;
  /**
   * Input property `rowClass` (`any`) configuring row class.
   * @zh 输入属性 `rowClass`（类型：`any`），用于配置行类名。
   */
  @Input() rowClass;
  /**
   * Input property `row` (`any`) configuring row.
   * @zh 输入属性 `row`（类型：`any`），用于配置行。
   */
  @Input() row;
  /**
   * Input property `group` (`any`) configuring group.
   * @zh 输入属性 `group`（类型：`any`），用于配置分组。
   */
  @Input() group;
  /**
   * Input property `isSelected` (`boolean`) configuring is selected.
   * @zh 输入属性 `isSelected`（类型：`boolean`），用于配置是否为已选中。
   */
  @Input() isSelected: boolean;
  /**
   * Input property `rowIndex` (`number`) configuring row index.
   * @zh 输入属性 `rowIndex`（类型：`number`），用于配置行索引。
   */
  @Input() rowIndex: number;
  /**
   * Input property `displayCheck` (`any`) configuring display check.
   * @zh 输入属性 `displayCheck`（类型：`any`），用于配置display检查。
   */
  @Input() displayCheck;
  /**
   * Input property `treeStatus` (`TreeStatus`) configuring tree status (default: `'collapsed'`).
   * @zh 输入属性 `treeStatus`（类型：`TreeStatus`），用于配置树形控件状态（默认值：`'collapsed'`）。
   */
  @Input() treeStatus: TreeStatus = 'collapsed';
  /**
   * Input property `allowDrag` (`boolean`) configuring allow drag (default: `false`).
   * @zh 输入属性 `allowDrag`（类型：`boolean`），用于配置允许拖拽（默认值：`false`）。
   */
  @Input() allowDrag: boolean = false;

  /**
   * Input setter `offsetX` updating offset x.
   * @zh 输入属性 `offsetX` 的设置器，用于更新偏移量X坐标。
   * @param val - New offset x value (`number`) / 新的偏移量X坐标值（`number`）
   */
  @Input()
  set offsetX(val: number) {
    this._offsetX = val;
    this.buildStylesByGroup();
  }
  /**
   * Gets the current offset x (`offsetX: any`).
   * @zh 获取当前偏移量X坐标（`offsetX: any`）。
   */
  get offsetX() {
    return this._offsetX;
  }

  /**
   * Host-bound getter `cssClass` (`string`) computing css class.
   * @zh 宿主绑定读取器 `cssClass`（绑定至 `class`），计算并返回CSS样式类名。
   */
  @HostBinding('class')
  get cssClass() {
    let cls = 'datatable-body-row';
    if (this.isSelected) {
      cls += ' active';
    }
    if (this.rowIndex % 2 !== 0) {
      cls += ' datatable-row-odd';
    }
    if (this.rowIndex % 2 === 0) {
      cls += ' datatable-row-even';
    }

    if (this.rowClass) {
      const res = this.rowClass(this.row);
      if (typeof res === 'string') {
        cls += ` ${res}`;
      } else if (typeof res === 'object') {
        const keys = Object.keys(res);
        for (const k of keys) {
          if (res[k] === true) {
            cls += ` ${k}`;
          }
        }
      }
    }

    return cls;
  }

  /**
   * Input property `rowHeight` (`number`) configuring row height.
   * @zh 输入属性 `rowHeight`（类型：`number`），用于配置行高度。
   */
  @HostBinding('style.height.px')
  @Input()
  rowHeight: number;

  /**
   * Host-bound getter `columnsTotalWidths` (`string`) computing columns total widths.
   * @zh 宿主绑定读取器 `columnsTotalWidths`（绑定至 `style.width`），计算并返回列集合总计宽度。
   */
  @HostBinding('style.width')
  get columnsTotalWidths(): string {
    return this._columnGroupWidths.total;
  }

  /**
   * Output event emitter `activate` (`EventEmitter<any>`) firing when activate occurs.
   * @zh 输出事件 `activate`（类型：`EventEmitter<any>`），当触发激活时向外发出事件。
   */
  @Output() activate = new EventEmitter();
  /**
   * Output event emitter `treeAction` (`EventEmitter<any>`) firing when tree action occurs.
   * @zh 输出事件 `treeAction`（类型：`EventEmitter<any>`），当触发树形控件动作时向外发出事件。
   */
  @Output() treeAction = new EventEmitter();

  /**
   * Property `_element` (`any`) storing element.
   * @zh 属性 `_element`（类型：`any`），用于存储或配置元素。
   */
  _element;
  /**
   * Property `_columnGroupWidths` (`any`) storing column group widths.
   * @zh 属性 `_columnGroupWidths`（类型：`any`），用于存储或配置列分组宽度。
   */
  _columnGroupWidths;
  /**
   * Property `_columnsByPin` (`any`) storing columns by pin.
   * @zh 属性 `_columnsByPin`（类型：`any`），用于存储或配置列集合按Pin。
   */
  _columnsByPin;
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
   * Property `_innerWidth` (`number`) storing inner width.
   * @zh 属性 `_innerWidth`（类型：`number`），用于存储或配置内部宽度。
   */
  _innerWidth: number;
  /**
   * Property `_groupStyles` (`{ [prop: string]: {}; }`) storing group styles (default: `{ left: {}, center: {}, right: {} }`).
   * @zh 属性 `_groupStyles`（类型：`{ [prop: string]: {}; }`），用于存储或配置分组样式集合（默认值：`{ left: {}, center: {}, right: {} }`）。
   */
  _groupStyles: { [prop: string]: {} } = {
    left: {},
    center: {},
    right: {}
  };

  /**
   * Property `_rowDiffer` (`KeyValueDiffer<{}, {}>`) storing row differ.
   * @zh 属性 `_rowDiffer`（类型：`KeyValueDiffer<{}, {}>`），用于存储或配置行Differ。
   */
  private _rowDiffer: KeyValueDiffer<{}, {}>;

  /**
   * Creates an instance of `DataTableBodyRowComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableBodyRowComponent` 实例，并初始化其依赖项与内部状态。
   * @param differs - Injected or initial differs (`KeyValueDiffers`) / 注入或传入的differs（`KeyValueDiffers`）
   * @param scrollbarHelper - Injected or initial scrollbar helper (`ScrollbarHelper`) / 注入或传入的滚动条辅助工具（`ScrollbarHelper`）
   * @param cd - Injected or initial cd (`ChangeDetectorRef`) / 注入或传入的cd（`ChangeDetectorRef`）
   * @param element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   */
  constructor(
    private differs: KeyValueDiffers,
    @SkipSelf() private scrollbarHelper: ScrollbarHelper,
    private cd: ChangeDetectorRef,
    element: ElementRef
  ) {
    this._element = element.nativeElement;
    this._rowDiffer = differs.find({}).create();
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck(): void {
    if (this._rowDiffer.diff(this.row)) {
      this.cd.markForCheck();
    }
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
   * Executes `buildStylesByGroup` to handle build styles by group.
   * @zh 执行 `buildStylesByGroup`，用于构建样式集合按分组。
   */
  buildStylesByGroup() {
    this._groupStyles['left'] = this.calcStylesByGroup('left');
    this._groupStyles['center'] = this.calcStylesByGroup('center');
    this._groupStyles['right'] = this.calcStylesByGroup('right');
    this.cd.markForCheck();
  }

  /**
   * Executes `calcStylesByGroup` to handle calc styles by group.
   * @zh 执行 `calcStylesByGroup`，用于计算样式集合按分组。
   * @param group - group parameter (`string`) / 分组参数（`string`）
   */
  calcStylesByGroup(group: string) {
    const widths = this._columnGroupWidths;
    const offsetX = this.offsetX;

    const styles = {
      width: `${widths[group]}px`
    };

    if (group === 'left') {
      translateXY(styles, offsetX, 0);
    } else if (group === 'right') {
      const bodyWidth = parseInt(this.innerWidth + '', 0);
      const totalDiff = widths.total - bodyWidth;
      const offsetDiff = totalDiff - offsetX;
      const offset = (offsetDiff + this.scrollbarHelper.width) * -1;
      translateXY(styles, offset, 0);
    }

    return styles;
  }

  /**
   * Executes `onActivate` to handle on activate.
   * @zh 执行 `onActivate`，用于当激活。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   * @param index - index parameter (`number`) / 索引参数（`number`）
   */
  onActivate(event, index: number): void {
    event.cellIndex = index;
    event.rowElement = this._element;
    this.activate.emit(event);
  }

  /**
   * Host event listener `onKeyDown` handling `keydown` events for on key down.
   * @zh 宿主事件监听方法 `onKeyDown`，响应 `keydown` 事件以处理当键向下。
   * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isTargetRow = event.target === this._element;

    const isAction =
      keyCode === Keys.return ||
      keyCode === Keys.down ||
      keyCode === Keys.up ||
      keyCode === Keys.left ||
      keyCode === Keys.right;

    if (isAction && isTargetRow) {
      event.preventDefault();
      event.stopPropagation();

      this.activate.emit({
        type: 'keydown',
        event,
        row: this.row,
        rowElement: this._element
      });
    }
  }

  /**
   * Host event listener `onMouseenter` handling `mouseenter` events for on mouseenter.
   * @zh 宿主事件监听方法 `onMouseenter`，响应 `mouseenter` 事件以处理当鼠标进入。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  @HostListener('mouseenter', ['$event'])
  onMouseenter(event): void {
    this.activate.emit({
      type: 'mouseenter',
      event,
      row: this.row,
      rowElement: this._element
    });
  }

  /**
   * Host event listener `onDragstart` handling `dragstart` events for on dragstart.
   * @zh 宿主事件监听方法 `onDragstart`，响应 `dragstart` 事件以处理当Dragstart。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  @HostListener('dragstart', ['$event'])
  onDragstart(event): void {
    this.activate.emit({
      type: 'dragstart',
      event,
      row: this.row,
      rowElement: this._element
    });
  }

  /**
   * Host event listener `onDragEnd` handling `dragend` events for on drag end.
   * @zh 宿主事件监听方法 `onDragEnd`，响应 `dragend` 事件以处理当拖拽结束。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  @HostListener('dragend', ['$event'])
  onDragEnd(event): void {
    this.activate.emit({
      type: 'dragend',
      event,
      row: this.row,
      rowElement: this._element
    });
  }

  /**
   * Executes `recalculateColumns` to handle recalculate columns.
   * @zh 执行 `recalculateColumns`，用于重新计算列集合。
   * @param val - val parameter (`any`) / 值参数（`any`）
   */
  recalculateColumns(val = this.columns): void {
    this._columns = val;
    const colsByPin = columnsByPin(this._columns);
    this._columnsByPin = columnsByPinArr(this._columns);
    this._columnGroupWidths = columnGroupWidths(colsByPin, this._columns);
  }

  /**
   * Executes `onTreeAction` to handle on tree action.
   * @zh 执行 `onTreeAction`，用于当树形控件动作。
   */
  onTreeAction() {
    this.treeAction.emit();
  }
}
