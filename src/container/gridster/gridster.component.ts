/**
 * @fileoverview Module `src/container/gridster/gridster.component.ts` providing gridster component definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridster.component.ts`，提供网格拖拽布局组件相关的定义与实现。
 */

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {GridsterComponentInterface} from './gridster.interface';
import {GridsterCompact} from './gridsterCompact.service';
import {GridsterConfigService} from './gridsterConfig.constant';
import {GridsterConfig} from './gridsterConfig.interface';
import {GridsterConfigS} from './gridsterConfigS.interface';
import {GridsterEmptyCell} from './gridsterEmptyCell.service';
import {GridsterItem} from './gridsterItem.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterRenderer} from './gridsterRenderer.service';
import {GridsterUtils} from './gridsterUtils.service';

/**
 * Angular component `GridsterComponent` (selector: 'gridster') providing gridster component presentation and interaction in `src/container/gridster`.
 * @zh Angular 组件 `GridsterComponent`（selector: 'gridster'），提供网格拖拽布局组件的视图渲染与交互逻辑（位于 `src/container/gridster`）。
 */
@Component({
  selector: 'gridster',
  templateUrl: './gridster.html',
  styleUrls: ['./gridster.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {hostID: 'dui-gridster' + Math.random().toString(36).substring(2, 15)}
})
export class GridsterComponent implements OnInit, OnChanges, OnDestroy, GridsterComponentInterface {

  /**
   * Input property `id` (`string`) configuring id.
   * @zh 输入属性 `id`（类型：`string`），用于配置唯一标识。
   */
  @Input() id: string;

  /**
   * Input property `options` (`GridsterConfig`) configuring options.
   * @zh 输入属性 `options`（类型：`GridsterConfig`），用于配置配置选项。
   */
  @Input() options: GridsterConfig;
  
  /**
   * Property `calculateLayoutDebounce` (`() => void`) storing calculate layout debounce.
   * @zh 属性 `calculateLayoutDebounce`（类型：`() => void`），用于存储或配置计算布局防抖。
   */
  calculateLayoutDebounce: () => void;
  /**
   * Property `movingItem` (`GridsterItem`) storing moving item.
   * @zh 属性 `movingItem`（类型：`GridsterItem`），用于存储或配置移动条目。
   */
  movingItem: GridsterItem | null;
  /**
   * Property `previewStyle` (`() => void`) storing preview style.
   * @zh 属性 `previewStyle`（类型：`() => void`），用于存储或配置预览样式。
   */
  previewStyle: () => void;
  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  el;
  /**
   * Property `$options` (`GridsterConfigS`) storing options.
   * @zh 属性 `$options`（类型：`GridsterConfigS`），用于存储或配置配置选项。
   */
  $options: GridsterConfigS;
  /**
   * Property `mobile` (`boolean`) storing mobile.
   * @zh 属性 `mobile`（类型：`boolean`），用于存储或配置mobile。
   */
  mobile: boolean;
  /**
   * Property `curWidth` (`number`) storing cur width.
   * @zh 属性 `curWidth`（类型：`number`），用于存储或配置当前宽度。
   */
  curWidth: number;
  /**
   * Property `curHeight` (`number`) storing cur height.
   * @zh 属性 `curHeight`（类型：`number`），用于存储或配置当前高度。
   */
  curHeight: number;
  /**
   * Property `grid` (`GridsterItemComponentInterface[]`) storing grid.
   * @zh 属性 `grid`（类型：`GridsterItemComponentInterface[]`），用于存储或配置网格表格。
   */
  grid: Array<GridsterItemComponentInterface>;
  /**
   * Property `columns` (`number`) storing columns (default: `0`).
   * @zh 属性 `columns`（类型：`number`），用于存储或配置列集合（默认值：`0`）。
   */
  columns = 0;
  /**
   * Property `rows` (`number`) storing rows (default: `0`).
   * @zh 属性 `rows`（类型：`number`），用于存储或配置行列表（默认值：`0`）。
   */
  rows = 0;
  /**
   * Property `curColWidth` (`number`) storing cur col width.
   * @zh 属性 `curColWidth`（类型：`number`），用于存储或配置当前列宽度。
   */
  curColWidth: number;
  /**
   * Property `curRowHeight` (`number`) storing cur row height.
   * @zh 属性 `curRowHeight`（类型：`number`），用于存储或配置当前行高度。
   */
  curRowHeight: number;
  /**
   * Property `gridColumns` (`any[]`) storing grid columns (default: `[]`).
   * @zh 属性 `gridColumns`（类型：`any[]`），用于存储或配置网格表格列集合（默认值：`[]`）。
   */
  gridColumns = [];
  /**
   * Property `gridRows` (`any[]`) storing grid rows (default: `[]`).
   * @zh 属性 `gridRows`（类型：`any[]`），用于存储或配置网格表格行列表（默认值：`[]`）。
   */
  gridRows = [];
  /**
   * Property `windowResize` (`() => void`) storing window resize.
   * @zh 属性 `windowResize`（类型：`() => void`），用于存储或配置窗口调整尺寸。
   */
  windowResize: (() => void) | null;
  /**
   * Property `dragInProgress` (`boolean`) storing drag in progress.
   * @zh 属性 `dragInProgress`（类型：`boolean`），用于存储或配置拖拽在进度条。
   */
  dragInProgress: boolean;
  /**
   * Property `emptyCell` (`GridsterEmptyCell`) storing empty cell.
   * @zh 属性 `emptyCell`（类型：`GridsterEmptyCell`），用于存储或配置空单元格。
   */
  emptyCell: GridsterEmptyCell;
  /**
   * Property `compact` (`GridsterCompact`) storing compact.
   * @zh 属性 `compact`（类型：`GridsterCompact`），用于存储或配置紧凑。
   */
  compact: GridsterCompact;
  /**
   * Property `gridRenderer` (`GridsterRenderer`) storing grid renderer.
   * @zh 属性 `gridRenderer`（类型：`GridsterRenderer`），用于存储或配置网格表格渲染器。
   */
  gridRenderer: GridsterRenderer;

  /**
   * Creates an instance of `GridsterComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterComponent` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param cdRef - Injected or initial cd ref (`ChangeDetectorRef`) / 注入或传入的cd引用（`ChangeDetectorRef`）
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   */
  constructor(@Inject(ElementRef) el: ElementRef, @Inject(Renderer2) public renderer: Renderer2,
              @Inject(ChangeDetectorRef) public cdRef: ChangeDetectorRef,
              @Inject(NgZone) public zone: NgZone) {
    this.el = el.nativeElement;
    this.$options = JSON.parse(JSON.stringify(GridsterConfigService));
    this.calculateLayoutDebounce = GridsterUtils.debounce(this.calculateLayout.bind(this), 0);
    this.mobile = false;
    this.curWidth = 0;
    this.curHeight = 0;
    this.grid = [];
    this.curColWidth = 0;
    this.curRowHeight = 0;
    this.dragInProgress = false;
    this.emptyCell = new GridsterEmptyCell(this);
    this.compact = new GridsterCompact(this);
    this.gridRenderer = new GridsterRenderer(this);
  }

  /**
   * Executes `checkCollisionTwoItems` to handle check collision two items.
   * @zh 执行 `checkCollisionTwoItems`，用于检查CollisionTwo条目列表。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @param item2 - item2 parameter (`GridsterItem`) / item2参数（`GridsterItem`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  checkCollisionTwoItems(item: GridsterItem, item2: GridsterItem): boolean {
    const collision = item.x < item2.x + item2.cols
      && item.x + item.cols > item2.x
      && item.y < item2.y + item2.rows
      && item.y + item.rows > item2.y;
    if (!collision) {
      return false;
    }
    if (!this.$options.allowMultiLayer) {
      return true;
    }
    const defaultLayerIndex = this.$options.defaultLayerIndex;
    const layerIndex = item.layerIndex === undefined ? defaultLayerIndex : item.layerIndex;
    const layerIndex2 = item2.layerIndex === undefined ? defaultLayerIndex : item2.layerIndex;
    return layerIndex === layerIndex2;
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    if (this.options.initCallback) {
      this.options.initCallback(this);
    }
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.setOptions();
      this.options.api = {
        optionsChanged: this.optionsChanged.bind(this),
        resize: this.onResize.bind(this),
        getNextPossiblePosition: this.getNextPossiblePosition.bind(this),
        getFirstPossiblePosition: this.getFirstPossiblePosition.bind(this),
        getLastPossiblePosition: this.getLastPossiblePosition.bind(this),
      };
      this.columns = this.$options.minCols;
      this.rows = this.$options.minRows;
      this.setGridSize();
      this.calculateLayout();
    }
  }

  /**
   * Executes `resize` to handle resize.
   * @zh 执行 `resize`，用于调整尺寸。
   */
  resize(): void {
    let height;
    let width;
    if (this.$options.gridType === 'fit' && !this.mobile) {
      width = this.el.offsetWidth;
      height = this.el.offsetHeight;
    } else {
      width = this.el.clientWidth;
      height = this.el.clientHeight;
    }
    if ((width !== this.curWidth || height !== this.curHeight) && this.checkIfToResize()) {
      this.onResize();
    }
  }

  /**
   * Executes `setOptions` to handle set options.
   * @zh 执行 `setOptions`，用于集合配置选项。
   */
  setOptions(): void {
    this.$options = GridsterUtils.merge(this.$options, this.options, this.$options);
    if (!this.$options.disableWindowResize && !this.windowResize) {
      this.windowResize = this.renderer.listen('window', 'resize', this.onResize.bind(this));
    } else if (this.$options.disableWindowResize && this.windowResize) {
      this.windowResize();
      this.windowResize = null;
    }
    this.emptyCell.updateOptions();
  }

  /**
   * Executes `optionsChanged` to handle options changed.
   * @zh 执行 `optionsChanged`，用于配置选项已变更。
   */
  optionsChanged(): void {
    this.setOptions();
    let widgetsIndex: number = this.grid.length - 1;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      widget.updateOptions();
    }
    this.calculateLayout();
  }

  /**
   * Property `resizeTimeout` (`any`) storing resize timeout.
   * @zh 属性 `resizeTimeout`（类型：`any`），用于存储或配置调整尺寸延时器。
   */
  private resizeTimeout;

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    if (this.windowResize) {
      this.windowResize();
    }
    if (this.options && this.options.destroyCallback) {
      this.options.destroyCallback(this);
    }
    if (this.options && this.options.api) {
      this.options.api.resize = undefined;
      this.options.api.optionsChanged = undefined;
      this.options.api.getNextPossiblePosition = undefined;
      this.options.api = undefined;
    }
    this.emptyCell.destroy();
    delete this.emptyCell;
    this.compact.destroy();
    delete this.compact;
  }

  /**
   * Executes `onResize` to handle on resize.
   * @zh 执行 `onResize`，用于当调整尺寸。
   */
  onResize(): void {
    this.setGridSize();
    this.calculateLayout();
  }

  /**
   * Executes `checkIfToResize` to handle check if to resize.
   * @zh 执行 `checkIfToResize`，用于检查If转换为调整尺寸。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  checkIfToResize(): boolean {
    const clientWidth = this.el.clientWidth;
    const offsetWidth = this.el.offsetWidth;
    const scrollWidth = this.el.scrollWidth;
    const clientHeight = this.el.clientHeight;
    const offsetHeight = this.el.offsetHeight;
    const scrollHeight = this.el.scrollHeight;
    const verticalScrollPresent = clientWidth < offsetWidth && scrollHeight > offsetHeight
      && scrollHeight - offsetHeight < offsetWidth - clientWidth;
    const horizontalScrollPresent = clientHeight < offsetHeight
      && scrollWidth > offsetWidth && scrollWidth - offsetWidth < offsetHeight - clientHeight;
    if (verticalScrollPresent) {
      return false;
    }
    return !horizontalScrollPresent;
  }

  /**
   * Executes `setGridSize` to handle set grid size.
   * @zh 执行 `setGridSize`，用于集合网格表格尺寸。
   */
  setGridSize(): void {
    const el = this.el;
    let width;
    let height;
    if (this.$options.setGridSize || this.$options.gridType === 'fit' && !this.mobile) {
      width = el.offsetWidth;
      height = el.offsetHeight;
    } else {
      width = el.clientWidth;
      height = el.clientHeight;
    }
    this.curWidth = width;
    this.curHeight = height;
  }

  /**
   * Executes `setGridDimensions` to handle set grid dimensions.
   * @zh 执行 `setGridDimensions`，用于集合网格表格维度列表。
   */
  setGridDimensions(): void {
    this.setGridSize();
    if (!this.mobile && this.$options.mobileBreakpoint > this.curWidth) {
      this.mobile = !this.mobile;
      this.renderer.addClass(this.el, 'mobile');
    } else if (this.mobile && this.$options.mobileBreakpoint < this.curWidth) {
      this.mobile = !this.mobile;
      this.renderer.removeClass(this.el, 'mobile');
    }
    let rows = this.$options.minRows;
    let columns = this.$options.minCols;

    let widgetsIndex = this.grid.length - 1;
    let widget;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      if (!widget.notPlaced) {
        rows = Math.max(rows, widget.$item.y + widget.$item.rows);
        columns = Math.max(columns, widget.$item.x + widget.$item.cols);
      }
    }

    if (this.columns !== columns || this.rows !== rows) {
      this.columns = columns;
      this.rows = rows;
      if (this.options.gridSizeChangedCallback) {
        this.options.gridSizeChangedCallback(this);
      }
    }
  }

  /**
   * Executes `calculateLayout` to handle calculate layout.
   * @zh 执行 `calculateLayout`，用于计算布局。
   */
  calculateLayout(): void {
    if (this.compact) {
      this.compact.checkCompact();
    }

    this.setGridDimensions();
    if (this.$options.outerMargin) {
      let marginWidth = -this.$options.margin;
      if (this.$options.outerMarginLeft !== null) {
        marginWidth += this.$options.outerMarginLeft;
        this.renderer.setStyle(this.el, 'padding-left', this.$options.outerMarginLeft + 'px');
      } else {
        marginWidth += this.$options.margin;
        this.renderer.setStyle(this.el, 'padding-left', this.$options.margin + 'px');
      }
      if (this.$options.outerMarginRight !== null) {
        marginWidth += this.$options.outerMarginRight;
        this.renderer.setStyle(this.el, 'padding-right', this.$options.outerMarginRight + 'px');
      } else {
        marginWidth += this.$options.margin;
        this.renderer.setStyle(this.el, 'padding-right', this.$options.margin + 'px');
      }
      this.curColWidth = (this.curWidth - marginWidth) / this.columns;
      let marginHeight = -this.$options.margin;
      if (this.$options.outerMarginTop !== null) {
        marginHeight += this.$options.outerMarginTop;
        this.renderer.setStyle(this.el, 'padding-top', this.$options.outerMarginTop + 'px');
      } else {
        marginHeight += this.$options.margin;
        this.renderer.setStyle(this.el, 'padding-top', this.$options.margin + 'px');
      }
      if (this.$options.outerMarginBottom !== null) {
        marginHeight += this.$options.outerMarginBottom;
        this.renderer.setStyle(this.el, 'padding-bottom', this.$options.outerMarginBottom + 'px');
      } else {
        marginHeight += this.$options.margin;
        this.renderer.setStyle(this.el, 'padding-bottom', this.$options.margin + 'px');
      }
      this.curRowHeight = (this.curHeight - marginHeight) / this.rows;
    } else {
      this.curColWidth = (this.curWidth + this.$options.margin) / this.columns;
      this.curRowHeight = (this.curHeight + this.$options.margin) / this.rows;
      this.renderer.setStyle(this.el, 'padding-left', 0 + 'px');
      this.renderer.setStyle(this.el, 'padding-right', 0 + 'px');
      this.renderer.setStyle(this.el, 'padding-top', 0 + 'px');
      this.renderer.setStyle(this.el, 'padding-bottom', 0 + 'px');
    }
    this.gridRenderer.updateGridster();

    this.updateGrid();

    if (this.$options.setGridSize) {
      this.renderer.setStyle(this.el, 'width', (this.columns * this.curColWidth + this.$options.margin) + 'px');
      this.renderer.setStyle(this.el, 'height', (this.rows * this.curRowHeight + this.$options.margin) + 'px');
    } else {
      this.renderer.setStyle(this.el, 'width', '');
      this.renderer.setStyle(this.el, 'height', '');
    }

    let widgetsIndex: number = this.grid.length - 1;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      widget.setSize();
      widget.drag.toggle();
      widget.resize.toggle();
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(this.resize.bind(this), 100);
  }

  /**
   * Executes `updateGrid` to handle update grid.
   * @zh 执行 `updateGrid`，用于更新网格表格。
   */
  updateGrid(): void {
    if (this.$options.displayGrid === 'always' && !this.mobile) {
      this.renderer.addClass(this.el, 'display-grid');
    } else if (this.$options.displayGrid === 'onDrag&Resize' && this.dragInProgress) {
      this.renderer.addClass(this.el, 'display-grid');
    } else if (this.$options.displayGrid === 'none' || !this.dragInProgress || this.mobile) {
      this.renderer.removeClass(this.el, 'display-grid');
    }
    this.setGridDimensions();
    this.gridColumns.length = GridsterComponent.getNewArrayLength(this.columns, this.curWidth, this.curColWidth);
    this.gridRows.length = GridsterComponent.getNewArrayLength(this.rows, this.curHeight, this.curRowHeight);
    this.cdRef.markForCheck();
  }

  /**
   * Executes `addItem` to handle add item.
   * @zh 执行 `addItem`，用于添加条目。
   * @param itemComponent - item component parameter (`GridsterItemComponentInterface`) / 条目组件参数（`GridsterItemComponentInterface`）
   */
  addItem(itemComponent: GridsterItemComponentInterface): void {
    if (itemComponent.$item.cols === undefined) {
      itemComponent.$item.cols = this.$options.defaultItemCols;
      itemComponent.item.cols = itemComponent.$item.cols;
      itemComponent.itemChanged();
    }
    if (itemComponent.$item.rows === undefined) {
      itemComponent.$item.rows = this.$options.defaultItemRows;
      itemComponent.item.rows = itemComponent.$item.rows;
      itemComponent.itemChanged();
    }
    if (itemComponent.$item.x === -1 || itemComponent.$item.y === -1) {
      this.autoPositionItem(itemComponent);
    } else if (this.checkCollision(itemComponent.$item)) {
      if (!this.$options.disableWarnings) {
        itemComponent.notPlaced = true;
        console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
          JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
      }
      if (!this.$options.disableAutoPositionOnConflict) {
        this.autoPositionItem(itemComponent);
      } else {
        itemComponent.notPlaced = true;
      }
    }
    this.grid.push(itemComponent);
    this.calculateLayoutDebounce();
  }

  /**
   * Executes `removeItem` to handle remove item.
   * @zh 执行 `removeItem`，用于移除条目。
   * @param itemComponent - item component parameter (`GridsterItemComponentInterface`) / 条目组件参数（`GridsterItemComponentInterface`）
   */
  removeItem(itemComponent: GridsterItemComponentInterface): void {
    this.grid.splice(this.grid.indexOf(itemComponent), 1);
    this.calculateLayoutDebounce();
    if (this.options.itemRemovedCallback) {
      this.options.itemRemovedCallback(itemComponent.item, itemComponent);
    }
  }

  /**
   * Executes `checkCollision` to handle check collision.
   * @zh 执行 `checkCollision`，用于检查Collision。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `boolean | GridsterItemComponentInterface` / 类型为 `boolean | GridsterItemComponentInterface` 的返回值
   */
  checkCollision(item: GridsterItem): GridsterItemComponentInterface | boolean {
    let collision: GridsterItemComponentInterface | boolean = false;
    if (this.options.itemValidateCallback) {
      collision = !this.options.itemValidateCallback(item);
    }
    if (!collision && this.checkGridCollision(item)) {
      collision = true;
    }
    if (!collision) {
      const c = this.findItemWithItem(item);
      if (c) {
        collision = c;
      }
    }
    return collision;
  }

  /**
   * Executes `checkGridCollision` to handle check grid collision.
   * @zh 执行 `checkGridCollision`，用于检查网格表格Collision。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  checkGridCollision(item: GridsterItem): boolean {
    const noNegativePosition = item.y > -1 && item.x > -1;
    const maxGridCols = item.cols + item.x <= this.$options.maxCols;
    const maxGridRows = item.rows + item.y <= this.$options.maxRows;
    const maxItemCols = item.maxItemCols === undefined ? this.$options.maxItemCols : item.maxItemCols;
    const minItemCols = item.minItemCols === undefined ? this.$options.minItemCols : item.minItemCols;
    const maxItemRows = item.maxItemRows === undefined ? this.$options.maxItemRows : item.maxItemRows;
    const minItemRows = item.minItemRows === undefined ? this.$options.minItemRows : item.minItemRows;
    const inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
    const inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
    const minAreaLimit = item.minItemArea === undefined ? this.$options.minItemArea : item.minItemArea;
    const maxAreaLimit = item.maxItemArea === undefined ? this.$options.maxItemArea : item.maxItemArea;
    const area = item.cols * item.rows;
    const inMinArea = minAreaLimit <= area;
    const inMaxArea = maxAreaLimit >= area;
    return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits && inMinArea && inMaxArea);
  }

  /**
   * Executes `findItemWithItem` to handle find item with item.
   * @zh 执行 `findItemWithItem`，用于查找条目带有条目。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `boolean | GridsterItemComponentInterface` / 类型为 `boolean | GridsterItemComponentInterface` 的返回值
   */
  findItemWithItem(item: GridsterItem): GridsterItemComponentInterface | boolean {
    let widgetsIndex: number = this.grid.length - 1;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex > -1; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      if (widget.$item !== item && this.checkCollisionTwoItems(widget.$item, item)) {
        return widget;
      }
    }
    return false;
  }

  /**
   * Executes `findItemsWithItem` to handle find items with item.
   * @zh 执行 `findItemsWithItem`，用于查找条目列表带有条目。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `GridsterItemComponentInterface[]` / 类型为 `GridsterItemComponentInterface[]` 的返回值
   */
  findItemsWithItem(item: GridsterItem): Array<GridsterItemComponentInterface> {
    const a: Array<GridsterItemComponentInterface> = [];
    let widgetsIndex: number = this.grid.length - 1;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex > -1; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      if (widget.$item !== item && this.checkCollisionTwoItems(widget.$item, item)) {
        a.push(widget);
      }
    }
    return a;
  }

  /**
   * Executes `autoPositionItem` to handle auto position item.
   * @zh 执行 `autoPositionItem`，用于自动位置条目。
   * @param itemComponent - item component parameter (`GridsterItemComponentInterface`) / 条目组件参数（`GridsterItemComponentInterface`）
   */
  autoPositionItem(itemComponent: GridsterItemComponentInterface): void {
    if (this.getNextPossiblePosition(itemComponent.$item)) {
      itemComponent.notPlaced = false;
      itemComponent.item.x = itemComponent.$item.x;
      itemComponent.item.y = itemComponent.$item.y;
      itemComponent.itemChanged();
    } else {
      itemComponent.notPlaced = true;
      if (!this.$options.disableWarnings) {
        console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
          JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
      }
    }
  }

  /**
   * Executes `getNextPossiblePosition` to handle get next possible position.
   * @zh 执行 `getNextPossiblePosition`，用于获取下一个Possible位置。
   * @param newItem - new item parameter (`GridsterItem`) / 新条目参数（`GridsterItem`）
   * @param startingFrom - starting from parameter (`{ y?: number; x?: number; }`) / 开始从参数（`{ y?: number; x?: number; }`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  getNextPossiblePosition(newItem: GridsterItem, startingFrom: { y?: number, x?: number } = {}): boolean {
    if (newItem.cols === -1) {
      newItem.cols = this.$options.defaultItemCols;
    }
    if (newItem.rows === -1) {
      newItem.rows = this.$options.defaultItemRows;
    }
    this.setGridDimensions();
    let rowsIndex = startingFrom.y || 0;
    let colsIndex;
    for (; rowsIndex < this.rows; rowsIndex++) {
      newItem.y = rowsIndex;
      colsIndex = startingFrom.x || 0;
      for (; colsIndex < this.columns; colsIndex++) {
        newItem.x = colsIndex;
        if (!this.checkCollision(newItem)) {
          return true;
        }
      }
    }
    const canAddToRows = this.$options.maxRows >= this.rows + newItem.rows;
    const canAddToColumns = this.$options.maxCols >= this.columns + newItem.cols;
    const addToRows = this.rows <= this.columns && canAddToRows;
    if (!addToRows && canAddToColumns) {
      newItem.x = this.columns;
      newItem.y = 0;
      return true;
    } else if (canAddToRows) {
      newItem.y = this.rows;
      newItem.x = 0;
      return true;
    }
    return false;
  }

  /**
   * Executes `getFirstPossiblePosition` to handle get first possible position.
   * @zh 执行 `getFirstPossiblePosition`，用于获取首个Possible位置。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `GridsterItem` / 类型为 `GridsterItem` 的返回值
   */
  getFirstPossiblePosition(item: GridsterItem): GridsterItem {
    const tmpItem = Object.assign({}, item);
    this.getNextPossiblePosition(tmpItem);
    return tmpItem;
  }

  /**
   * Executes `getLastPossiblePosition` to handle get last possible position.
   * @zh 执行 `getLastPossiblePosition`，用于获取末尾Possible位置。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `GridsterItem` / 类型为 `GridsterItem` 的返回值
   */
  getLastPossiblePosition(item: GridsterItem): GridsterItem {
    let farthestItem: { y: number, x: number } = {y: 0, x: 0};
    farthestItem = this.grid.reduce((prev, curr: GridsterItemComponentInterface) => {
      const currCoords = {y: curr.$item.y + curr.$item.rows - 1, x: curr.$item.x + curr.$item.cols - 1};
      if (GridsterUtils.compareItems(prev, currCoords) === 1) {
        return currCoords;
      } else {
        return prev;
      }
    }, farthestItem);

    const tmpItem = Object.assign({}, item);
    this.getNextPossiblePosition(tmpItem, farthestItem);
    return tmpItem;
  }

  /**
   * Executes `pixelsToPositionX` to handle pixels to position x.
   * @zh 执行 `pixelsToPositionX`，用于像素转换为位置X坐标。
   * @param x - x parameter (`number`) / X坐标参数（`number`）
   * @param roundingMethod - rounding method parameter (`(x: number) => number`) / 四舍五入方法参数（`(x: number) => number`）
   * @param noLimit - no limit parameter (`boolean`) / no限制参数（`boolean`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  pixelsToPositionX(x: number, roundingMethod: (x: number) => number, noLimit?: boolean): number {
    const position = roundingMethod(x / this.curColWidth);
    if (noLimit) {
      return position;
    } else {
      return Math.max(position, 0);
    }
  }

  /**
   * Executes `pixelsToPositionY` to handle pixels to position y.
   * @zh 执行 `pixelsToPositionY`，用于像素转换为位置Y坐标。
   * @param y - y parameter (`number`) / Y坐标参数（`number`）
   * @param roundingMethod - rounding method parameter (`(x: number) => number`) / 四舍五入方法参数（`(x: number) => number`）
   * @param noLimit - no limit parameter (`boolean`) / no限制参数（`boolean`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  pixelsToPositionY(y: number, roundingMethod: (x: number) => number, noLimit?: boolean): number {
    const position = roundingMethod(y / this.curRowHeight);
    if (noLimit) {
      return position;
    } else {
      return Math.max(position, 0);
    }
  }

  /**
   * Executes `positionXToPixels` to handle position x to pixels.
   * @zh 执行 `positionXToPixels`，用于位置X坐标转换为像素。
   * @param x - x parameter (`number`) / X坐标参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  positionXToPixels(x: number): number {
    return x * this.curColWidth;
  }

  /**
   * Executes `positionYToPixels` to handle position y to pixels.
   * @zh 执行 `positionYToPixels`，用于位置Y坐标转换为像素。
   * @param y - y parameter (`number`) / Y坐标参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  positionYToPixels(y: number): number {
    return y * this.curRowHeight;
  }

  // ------ Functions for swapWhileDragging option

  // identical to checkCollision() except that here we add bondaries.
  /**
   * Executes `checkCollisionTwoItemsForSwaping` to handle check collision two items for swaping.
   * @zh 执行 `checkCollisionTwoItemsForSwaping`，用于检查CollisionTwo条目列表用于Swaping。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @param item2 - item2 parameter (`GridsterItem`) / item2参数（`GridsterItem`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  static checkCollisionTwoItemsForSwaping(item: GridsterItem, item2: GridsterItem): boolean {
    // if the cols or rows of the items are 1 , doesnt make any sense to set a boundary. Only if the item is bigger we set a boundary
    const horizontalBoundaryItem1 = item.cols === 1 ? 0 : 1;
    const horizontalBoundaryItem2 = item2.cols === 1 ? 0 : 1;
    const verticalBoundaryItem1 = item.rows === 1 ? 0 : 1;
    const verticalBoundaryItem2 = item2.rows === 1 ? 0 : 1;
    return item.x + horizontalBoundaryItem1 < item2.x + item2.cols
      && item.x + item.cols > item2.x + horizontalBoundaryItem2
      && item.y + verticalBoundaryItem1 < item2.y + item2.rows
      && item.y + item.rows > item2.y + verticalBoundaryItem2;
  }

  // identical to checkCollision() except that this function calls findItemWithItemForSwaping() instead of findItemWithItem()
  /**
   * Executes `checkCollisionForSwaping` to handle check collision for swaping.
   * @zh 执行 `checkCollisionForSwaping`，用于检查Collision用于Swaping。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `boolean | GridsterItemComponentInterface` / 类型为 `boolean | GridsterItemComponentInterface` 的返回值
   */
  checkCollisionForSwaping(item: GridsterItem): GridsterItemComponentInterface | boolean {
    let collision: GridsterItemComponentInterface | boolean = false;
    if (this.options.itemValidateCallback) {
      collision = !this.options.itemValidateCallback(item);
    }
    if (!collision && this.checkGridCollision(item)) {
      collision = true;
    }
    if (!collision) {
      const c = this.findItemWithItemForSwaping(item);
      if (c) {
        collision = c;
      }
    }
    return collision;
  }

  // identical to findItemWithItem() except that this function calls checkCollisionTwoItemsForSwaping() instead of checkCollisionTwoItems()
  /**
   * Executes `findItemWithItemForSwaping` to handle find item with item for swaping.
   * @zh 执行 `findItemWithItemForSwaping`，用于查找条目带有条目用于Swaping。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `boolean | GridsterItemComponentInterface` / 类型为 `boolean | GridsterItemComponentInterface` 的返回值
   */
  findItemWithItemForSwaping(item: GridsterItem): GridsterItemComponentInterface | boolean {
    let widgetsIndex: number = this.grid.length - 1;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex > -1; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      if (widget.$item !== item && GridsterComponent.checkCollisionTwoItemsForSwaping(widget.$item, item)) {
        return widget;
      }
    }
    return false;
  }

  // ------ End of functions for swapWhileDragging option

  // tslint:disable-next-line:member-ordering
  /**
   * Executes `getNewArrayLength` to handle get new array length.
   * @zh 执行 `getNewArrayLength`，用于获取新数组长度。
   * @param length - length parameter (`number`) / 长度参数（`number`）
   * @param overallSize - overall size parameter (`number`) / overall尺寸参数（`number`）
   * @param size - size parameter (`number`) / 尺寸参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private static getNewArrayLength(length: number, overallSize: number, size: number): number {
    const newLength = Math.max(length, Math.floor(overallSize / size));

    if (newLength < 0) {
      return 0;
    }

    if (Number.isFinite(newLength)) {
      return Math.floor(newLength);
    }

    return 0;
  }
}
