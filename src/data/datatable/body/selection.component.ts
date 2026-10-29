/**
 * @fileoverview Module `src/data/datatable/body/selection.component.ts` providing selection component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/body/selection.component.ts`，提供selection组件相关的定义与实现。
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Keys} from '../utils/keys';
import { selectRows,selectRowsBetween } from '../utils/selection';
import { SelectionType } from '../types/selection.type';

/**
 * Interface `Model` defining the contract and properties for model.
 * @zh 接口 `Model`，定义模型的数据结构契约与属性规范。
 */
export interface Model {
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `event` (`KeyboardEvent | MouseEvent`) storing event.
   * @zh 属性 `event`（类型：`KeyboardEvent | MouseEvent`），用于存储或配置事件。
   */
  event: MouseEvent | KeyboardEvent;
  /**
   * Property `row` (`any`) storing row.
   * @zh 属性 `row`（类型：`any`），用于存储或配置行。
   */
  row;
  /**
   * Property `rowElement` (`any`) storing row element.
   * @zh 属性 `rowElement`（类型：`any`），用于存储或配置行元素。
   */
  rowElement;
  /**
   * Property `cellElement` (`any`) storing cell element.
   * @zh 属性 `cellElement`（类型：`any`），用于存储或配置单元格元素。
   */
  cellElement;
  /**
   * Property `cellIndex` (`number`) storing cell index.
   * @zh 属性 `cellIndex`（类型：`number`），用于存储或配置单元格索引。
   */
  cellIndex: number;
}

/**
 * Angular component `DataTableSelectionComponent` (selector: 'datatable-selection') providing data table selection component presentation and interaction in `src/data/datatable/body`.
 * @zh Angular 组件 `DataTableSelectionComponent`（selector: 'datatable-selection'），提供数据表格Selection组件的视图渲染与交互逻辑（位于 `src/data/datatable/body`）。
 */
@Component({
  selector: 'datatable-selection',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableSelectionComponent {
  /**
   * Input property `rows` (`any`) configuring rows.
   * @zh 输入属性 `rows`（类型：`any`），用于配置行列表。
   */
  @Input() rows;
  /**
   * Input property `selected` (`any`) configuring selected.
   * @zh 输入属性 `selected`（类型：`any`），用于配置已选中。
   */
  @Input() selected;
  /**
   * Input property `selectEnabled` (`boolean`) configuring select enabled.
   * @zh 输入属性 `selectEnabled`（类型：`boolean`），用于配置下拉选择已启用。
   */
  @Input() selectEnabled: boolean;
  /**
   * Input property `selectionType` (`SelectionType`) configuring selection type.
   * @zh 输入属性 `selectionType`（类型：`SelectionType`），用于配置selection类型。
   */
  @Input() selectionType: SelectionType;
  /**
   * Input property `rowIdentity` (`any`) configuring row identity.
   * @zh 输入属性 `rowIdentity`（类型：`any`），用于配置行Identity。
   */
  @Input() rowIdentity;
  /**
   * Input property `selectCheck` (`any`) configuring select check.
   * @zh 输入属性 `selectCheck`（类型：`any`），用于配置下拉选择检查。
   */
  @Input() selectCheck;

  /**
   * Output event emitter `activate` (`EventEmitter<any>`) firing when activate occurs.
   * @zh 输出事件 `activate`（类型：`EventEmitter<any>`），当触发激活时向外发出事件。
   */
  @Output() activate = new EventEmitter();
  /**
   * Output event emitter `select` (`EventEmitter<any>`) firing when select occurs.
   * @zh 输出事件 `select`（类型：`EventEmitter<any>`），当触发下拉选择时向外发出事件。
   */
  @Output() select = new EventEmitter();

  /**
   * Property `prevIndex` (`number`) storing prev index.
   * @zh 属性 `prevIndex`（类型：`number`），用于存储或配置前一个索引。
   */
  prevIndex: number;

  /**
   * Executes `selectRow` to handle select row.
   * @zh 执行 `selectRow`，用于下拉选择行。
   * @param event - event parameter (`KeyboardEvent | MouseEvent`) / 事件参数（`KeyboardEvent | MouseEvent`）
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param row - row parameter (`any`) / 行参数（`any`）
   */
  selectRow(event: KeyboardEvent | MouseEvent, index: number, row): void {
    if (!this.selectEnabled) return;

    const chkbox = this.selectionType === SelectionType.checkbox;
    const multi = this.selectionType === SelectionType.multi;
    const multiClick = this.selectionType === SelectionType.multiClick;
    let selected = [];

    if (multi || chkbox || multiClick) {
      if (event.shiftKey) {
        selected = selectRowsBetween([], this.rows, index, this.prevIndex, this.getRowSelectedIdx.bind(this));
      } else if (event.ctrlKey || event.metaKey || multiClick || chkbox) {
        selected = selectRows([...this.selected], row, this.getRowSelectedIdx.bind(this));
      } else {
        selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
      }
    } else {
      selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
    }

    if (typeof this.selectCheck === 'function') {
      selected = selected.filter(this.selectCheck.bind(this));
    }

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

    this.prevIndex = index;

    this.select.emit({
      selected
    });
  }

  /**
   * Executes `onActivate` to handle on activate.
   * @zh 执行 `onActivate`，用于当激活。
   * @param model - model parameter (`Model`) / 模型参数（`Model`）
   * @param index - index parameter (`number`) / 索引参数（`number`）
   */
  onActivate(model: Model, index: number): void {
    const { type, event, row } = model;
    const chkbox = this.selectionType === SelectionType.checkbox;
    const select = (!chkbox && (type === 'click' || type === 'dblclick')) || (chkbox && type === 'checkbox');

    if (select) {
      this.selectRow(event, index, row);
    } else if (type === 'keydown') {
      if ((<KeyboardEvent>event).keyCode === Keys.return) {
        this.selectRow(event, index, row);
      } else {
        this.onKeyboardFocus(model);
      }
    }
    this.activate.emit(model);
  }

  /**
   * Executes `onKeyboardFocus` to handle on keyboard focus.
   * @zh 执行 `onKeyboardFocus`，用于当键盘聚焦。
   * @param model - model parameter (`Model`) / 模型参数（`Model`）
   */
  onKeyboardFocus(model: Model): void {
    const { keyCode } = <KeyboardEvent>model.event;
    const shouldFocus = keyCode === Keys.up || keyCode === Keys.down || keyCode === Keys.right || keyCode === Keys.left;

    if (shouldFocus) {
      const isCellSelection = this.selectionType === SelectionType.cell;

      if (!model.cellElement || !isCellSelection) {
        this.focusRow(model.rowElement, keyCode);
      } else if (isCellSelection) {
        this.focusCell(model.cellElement, model.rowElement, keyCode, model.cellIndex);
      }
    }
  }

  /**
   * Executes `focusRow` to handle focus row.
   * @zh 执行 `focusRow`，用于聚焦行。
   * @param rowElement - row element parameter (`any`) / 行元素参数（`any`）
   * @param keyCode - key code parameter (`number`) / 键编码参数（`number`）
   */
  focusRow(rowElement, keyCode: number): void {
    const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
    if (nextRowElement) nextRowElement.focus();
  }

  /**
   * Executes `getPrevNextRow` to handle get prev next row.
   * @zh 执行 `getPrevNextRow`，用于获取前一个下一个行。
   * @param rowElement - row element parameter (`any`) / 行元素参数（`any`）
   * @param keyCode - key code parameter (`number`) / 键编码参数（`number`）
   * @returns Result of type `HTMLElement` / 类型为 `HTMLElement` 的返回值
   */
  getPrevNextRow(rowElement, keyCode: number) {
    const parentElement = rowElement.parentElement;

    if (parentElement) {
      let focusElement: HTMLElement;
      if (keyCode === Keys.up) {
        focusElement = parentElement.previousElementSibling;
      } else if (keyCode === Keys.down) {
        focusElement = parentElement.nextElementSibling;
      }

      if (focusElement && focusElement.children.length) {
        return focusElement.children[0] as HTMLElement;
      }
    }
    return undefined;
  }

  /**
   * Executes `focusCell` to handle focus cell.
   * @zh 执行 `focusCell`，用于聚焦单元格。
   * @param cellElement - cell element parameter (`any`) / 单元格元素参数（`any`）
   * @param rowElement - row element parameter (`any`) / 行元素参数（`any`）
   * @param keyCode - key code parameter (`number`) / 键编码参数（`number`）
   * @param cellIndex - cell index parameter (`number`) / 单元格索引参数（`number`）
   */
  focusCell(cellElement, rowElement, keyCode: number, cellIndex: number): void {
    let nextCellElement: HTMLElement;

    if (keyCode === Keys.left) {
      nextCellElement = cellElement.previousElementSibling;
    } else if (keyCode === Keys.right) {
      nextCellElement = cellElement.nextElementSibling;
    } else if (keyCode === Keys.up || keyCode === Keys.down) {
      const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
      if (nextRowElement) {
        const children = nextRowElement.getElementsByClassName('datatable-body-cell');
        if (children.length) nextCellElement = children[cellIndex] as HTMLElement;
      }
    }

    if (nextCellElement) nextCellElement.focus();
  }

  /**
   * Executes `getRowSelected` to handle get row selected.
   * @zh 执行 `getRowSelected`，用于获取行已选中。
   * @param row - row parameter (`any`) / 行参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  getRowSelected(row): boolean {
    return this.getRowSelectedIdx(row, this.selected) > -1;
  }

  /**
   * Executes `getRowSelectedIdx` to handle get row selected idx.
   * @zh 执行 `getRowSelectedIdx`，用于获取行已选中索引。
   * @param row - row parameter (`any`) / 行参数（`any`）
   * @param selected - selected parameter (`any`) / 已选中参数（`any`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getRowSelectedIdx(row, selected): number {
    if (!selected || !selected.length) return -1;

    const rowId = this.rowIdentity(row);
    return selected.findIndex(r => {
      const id = this.rowIdentity(r);
      return id === rowId;
    });
  }
}
