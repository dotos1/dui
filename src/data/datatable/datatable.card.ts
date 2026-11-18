/**
 * @fileoverview Module `src/data/datatable/datatable.card.ts` providing datatable card definitions and implementation.
 * @zh 模块文件 `src/data/datatable/datatable.card.ts`，提供数据表格卡片相关的定义与实现。
 */

import { DuiConfig } from '@dotos1/dui/base';
import {
  Component, Input, ViewChild, ChangeDetectionStrategy,
  SimpleChanges, ChangeDetectorRef, Injector, OnChanges,
  ViewEncapsulation
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { Dui } from '@dotos1/dui/core';
import { DuiCardComponent } from '@dotos1/dui/container';
import { DatatableComponent } from './datatable.component';
import { ITable, IDataSource } from './types/table.type';
import { TableColumn } from './types/table-column.type';
import { TranslatePipe, TranslateService } from '@dotos1/dui/translator';
import { SelectionType } from './types';

/**
 * Angular component `DatatableCardComponent` (selector: 'datatable-card') providing datatable card component presentation and interaction in `src/data/datatable`.
 * @zh Angular 组件 `DatatableCardComponent`（selector: 'datatable-card'），提供数据表格卡片组件的视图渲染与交互逻辑（位于 `src/data/datatable`）。
 */
@Component({
  selector: 'datatable-card',
  styleUrls: ['./datatable.card.scss'],
  templateUrl: './datatable.card.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  providers:[TranslatePipe],
  standalone: false
})

export class DatatableCardComponent extends DuiCardComponent implements OnChanges{
  /**
   * Template/content query reference `view` (`DatatableComponent`) targeting view.
   * @zh 模板/内容视图查询引用 `view`（`@ViewChild`），指向视图。
   */
  @ViewChild(DatatableComponent)
  view: DatatableComponent;

  /**
   * Input property `config` (`DuiConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() override config: DuiConfig = {};

  /**
   * Property `columns` (`TableColumn[]`) storing columns.
   * @zh 属性 `columns`（类型：`TableColumn[]`），用于存储或配置列集合。
   */
  columns: TableColumn[];

  /**
   * Property `viewConfig` (`ITable`) storing view config (default: `null`).
   * @zh 属性 `viewConfig`（类型：`ITable`），用于存储或配置视图配置（默认值：`null`）。
   */
  viewConfig: ITable = null;

  /**
   * Property `datasource` (`IDataSource`) storing datasource.
   * @zh 属性 `datasource`（类型：`IDataSource`），用于存储或配置数据源。
   */
  datasource: IDataSource;

  /**
   * Property `hideHead` (`boolean`) storing hide head (default: `false`).
   * @zh 属性 `hideHead`（类型：`boolean`），用于存储或配置隐藏Head（默认值：`false`）。
   */
  public hideHead: boolean = false;

  /**
   * Gets the current row data (`rowData: any[]`).
   * @zh 获取当前行数据（`rowData: any[]`）。
   */
  get rowData() {
    return this._rowData;
  }

  /**
   * Sets the row data (`rowData`).
   * @zh 设置行数据（`rowData`）。
   * @param data - New row data value (`any`) / 新的行数据值（`any`）
   */
  set rowData(data) {
    this._rowData = data;
  

    if(this.view){
      this.view.selected = [];
    }
    this.loadingIndicator = false;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Property `_rowData` (`any`) storing row data.
   * @zh 属性 `_rowData`（类型：`any`），用于存储或配置行数据。
   */
  _rowData;

  /**
   * Property `selectionType` (`SelectionType`) storing selection type (default: `SelectionType.single`).
   * @zh 属性 `selectionType`（类型：`SelectionType`），用于存储或配置selection类型（默认值：`SelectionType.single`）。
   */
  selectionType =SelectionType.single;

  /**
   * Property `loadingIndicator` (`boolean`) storing loading indicator (default: `false`).
   * @zh 属性 `loadingIndicator`（类型：`boolean`），用于存储或配置加载中指示器（默认值：`false`）。
   */
  loadingIndicator: boolean = false;

  /**
   * Property `baseParams` (`{…}`) storing base params (default: `{}`).
   * @zh 属性 `baseParams`（类型：`{…}`），用于存储或配置基础参数集合（默认值：`{}`）。
   */
  /** 数据请求的基础参数（作 HttpParams 发出） */
  baseParams: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {};

  /**
   * Property `start` (`number`) storing start (default: `0`).
   * @zh 属性 `start`（类型：`number`），用于存储或配置开始（默认值：`0`）。
   */
  private start = 0;
  /**
   * Property `pageSize` (`number`) storing page size (default: `20`).
   * @zh 属性 `pageSize`（类型：`number`），用于存储或配置页面尺寸（默认值：`20`）。
   */
  private pageSize = 20;

  /**
   * Property `sort` (`string`) storing sort (default: `""`).
   * @zh 属性 `sort`（类型：`string`），用于存储或配置排序（默认值：`""`）。
   */
  private sort = "";
  /**
   * Property `dir` (`string`) storing dir (default: `""`).
   * @zh 属性 `dir`（类型：`string`），用于存储或配置目录（默认值：`""`）。
   */
  private dir = "";

  /**
   * Property `displayCheck` (`boolean`) storing display check (default: `true`).
   * @zh 属性 `displayCheck`（类型：`boolean`），用于存储或配置display检查（默认值：`true`）。
   */
  public displayCheck = true;
  /**
   * Property `totalCount` (`number`) storing total count (default: `20`).
   * @zh 属性 `totalCount`（类型：`number`），用于存储或配置总计计数（默认值：`20`）。
   */
  public totalCount=20;

  /**
   * Property `_destroy$` (`Subject<void>`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `_destroy$`（类型：`Subject<void>`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private _destroy$ = new Subject<void>();

  /**
   * Creates an instance of `DatatableCardComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DatatableCardComponent` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param translateService - Injected or initial translate service (`TranslateService`) / 注入或传入的翻译服务（`TranslateService`）
   */
  constructor(
    protected http: HttpClient,
    public override injector: Injector,
    public changeDetectorRef: ChangeDetectorRef,
    public override translateService: TranslateService,) {
    super(injector, changeDetectorRef, translateService);
  }


  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  // private
  /**
   * Executes `onDestroy` to handle on destroy.
   * @zh 执行 `onDestroy`，用于当销毁。
   */
  override onDestroy() {
    // loadds() 发出的 HTTP 请求原来没有随组件销毁取消；卡片在响应返回前
    // 被销毁（如所在对话框关闭）时，success() 仍会在之后执行并访问已拆除的视图
    this._destroy$.next();
    this._destroy$.complete();
    Dui.destroy(this.columns);
    this.columns = this.view = null;
    super.onDestroy.call(this);
  }

  // private
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
    this.viewConfig.externalSorting = true;
    if (this.viewConfig.sorts) {
      this.sort = this.viewConfig.sorts[0].prop;
      this.dir = this.viewConfig.sorts[0].dir;
    }
    if (this.viewConfig.limit) {
      this.pageSize = this.viewConfig.limit;
    }
    if(this.baseParams){
      if (this.datasource && this.datasource.url && this.datasource.apiBase) {
        this.loadds();
      }
    }
  }
  /**
   * Executes `loadData` to handle load data.
   * @zh 执行 `loadData`，用于加载数据。
   * @param data - data parameter (`any`) / 数据参数（`any`）
   */
  public loadData(data): void {
    let val: Record<string, unknown> = {};
    if (typeof (data) == "object") {
      if (Array.isArray(data)) {
        val[this.datasource.totalCount] = data.length;
        val[this.datasource.data] = data;
      }
      else
        val = data
    } else
      return;
    this.success(val);
  }
  /**
   * Executes `load` to handle load.
   * @zh 执行 `load`，用于加载。
   * @param params - params parameter (`any`) / 参数集合参数（`any`）
   */
  public load(params?): void {
    if (params) {
      this.baseParams = params;
    }
    if (this.datasource && this.datasource.url && this.datasource.apiBase) {
      this.loadds();
    }
  }

  /**
   * Executes `loadds` to handle loadds.
   * @zh 执行 `loadds`，用于loadds。
   */
  private loadds(){
    this.loadingIndicator = true;
    this.changeDetectorRef.detectChanges();
    Dui.apply(this.baseParams, {
      start: this.start,
      limit: this.pageSize,
      sort: this.sort,
      dir: this.dir
    });
    let url = this.datasource.url;
    let apiBase = this.datasource.apiBase;
    this.http.get(apiBase + url,
      {
        params: this.baseParams,
      }).pipe(takeUntil(this._destroy$)).subscribe(
        val => this.success(val)
      );
  }

  /**
   * Executes `success` to handle success.
   * @zh 执行 `success`，用于成功。
   * @param val - val parameter (`any`) / 值参数（`any`）
   */
  private success(val) {
    if(this.view){
      this.view.count = val[this.datasource.totalCount];
    }
    this.rowData = val[this.datasource.data];
    this.totalCount=val[this.datasource.totalCount];
    this.view.selected = [];
    this.loadingIndicator = false;
    this.changeDetectorRef.detectChanges();
  }


  /**
   * Executes `getState` to handle get state.
   * @zh 执行 `getState`，用于获取状态。
   */
  getState() {
    let o = { columns: [], sort: '', group: '' };
    // eslint-disable-next-line no-cond-assign
    for (let i = 0, c; c = this.columns[i]; i++) {
      o.columns[i] = { id: c.id, width: c.width };
      if (c.hidden) {
        o.columns[i].hidden = true;
      }
      if (c.sortable) {
        o.columns[i].sortable = true;
      }
    }
    return o;
  }


  /**
   * Executes `reconfigure` to handle reconfigure.
   * @zh 执行 `reconfigure`，用于reconfigure。
   * @param colModel - col model parameter (`TableColumn[]`) / 列模型参数（`TableColumn[]`）
   */
  reconfigure(colModel: TableColumn[]) {
    // if (this.view) {
    //   this.view.initData(store, colModel);
    // }
    this.columns = colModel;
  }

  /**
   * Executes `setStart` to handle set start.
   * @zh 执行 `setStart`，用于集合开始。
   * @param v - v parameter (`any`) / v参数（`any`）
   */
  public setStart(v){
    this.start=v;
  }
  // private
  /**
   * Executes `onPage` to handle on page.
   * @zh 执行 `onPage`，用于当页面。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onPage(e) {
    this.pageSize = e.pageSize;
    this.start = e.fromRow;
    this.load();
    this.trigger('page', e);
  }
  /**
   * Executes `onSort` to handle on sort.
   * @zh 执行 `onSort`，用于当排序。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onSort(e) {
    this.sort = e.sorts[0].prop;
    this.dir = e.sorts[0].dir;
    this.load();
    this.trigger('sort', { grid: this.view, event: e });
  }
  /**
   * Executes `onActivate` to handle on activate.
   * @zh 执行 `onActivate`，用于当激活。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onActivate(e) {
    this.trigger('activate', e);
  }
  /**
   * Executes `onSelect` to handle on select.
   * @zh 执行 `onSelect`，用于当下拉选择。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onSelect(e) {

    this.trigger('select', { grid: this.view, event: e });
  }

  /**
   * Executes `onScroll` to handle on scroll.
   * @zh 执行 `onScroll`，用于当滚动。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onScroll(e) {
    this.trigger('scroll', { grid: this.view, event: e });
  }

  /**
   * Executes `onReorder` to handle on reorder.
   * @zh 执行 `onReorder`，用于当重排。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onReorder(e) {
    this.trigger('reorder', e);
  }

  /**
   * Executes `onResize` to handle on resize.
   * @zh 执行 `onResize`，用于当调整尺寸。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onResize(e) {
    this.trigger('resize', e);
  }

  /**
   * Executes `onTableContextmenu` to handle on table contextmenu.
   * @zh 执行 `onTableContextmenu`，用于当表格Contextmenu。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onTableContextmenu(e) {
    this.trigger('tableContextmenu', e);
  }

  /**
   * Executes `onTreeAction` to handle on tree action.
   * @zh 执行 `onTreeAction`，用于当树形控件动作。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onTreeAction(e) {
    this.trigger('treeAction', e);
  }

  /**
   * Executes `getColumnModel` to handle get column model.
   * @zh 执行 `getColumnModel`，用于获取列模型。
   * @returns Result of type `TableColumn[]` / 类型为 `TableColumn[]` 的返回值
   */
  getColumnModel(): TableColumn[] {
    return this.columns;
  }

  /**
   * Executes `getView` to handle get view.
   * @zh 执行 `getView`，用于获取视图。
   * @returns Result of type `DatatableComponent` / 类型为 `DatatableComponent` 的返回值
   */
  getView(): DatatableComponent {
    return this.view;
  }

  /**
   * Executes `getSelected` to handle get selected.
   * @zh 执行 `getSelected`，用于获取已选中。
   * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
   */
  getSelected() {
    return this.view.selected;
  }
  /**
   * Executes `getSelectedIds` to handle get selected ids.
   * @zh 执行 `getSelectedIds`，用于获取已选中标识列表。
   * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
   */
  getSelectedIds() {
    let ids = [];
    for (const row of this.view.selected) {
      ids.push(row[this.datasource.id]);
    }
    return ids;
  }
}
