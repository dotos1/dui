import {
  Component, Input, ViewChild, ChangeDetectionStrategy,
  SimpleChanges, ChangeDetectorRef, ComponentFactoryResolver, Injector, OnChanges,
  ViewEncapsulation
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { Dui } from '@dotos/dui/core';
import { DuiCardComponent } from '@dotos/dui/container';
import { DatatableComponent } from './datatable.component';
import { ITable, IDataSource } from './types/table.type';
import { TableColumn } from './types/table-column.type';
import { TranslatePipe, TranslateService } from '@dotos/dui/translator';
import { SelectionType } from './types';

@Component({
  selector: 'datatable-card',
  styleUrls: ['./datatable.card.scss'],
  templateUrl: './datatable.card.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  providers:[TranslatePipe]
})

export class DatatableCardComponent extends DuiCardComponent implements OnChanges{
  @ViewChild(DatatableComponent)
  view: DatatableComponent;

  @Input() override config: any = {};

  columns: TableColumn[];

  viewConfig: ITable = null;

  datasource: IDataSource;

  public hideHead: boolean = false;

  get rowData(): any[] {
    return this._rowData;
  }

  set rowData(data) {
    this._rowData = data;
  

    if(this.view){
      this.view.selected = [];
    }
    this.loadingIndicator = false;
    this.changeDetectorRef.detectChanges();
  }

  _rowData: any[];

  selectionType =SelectionType.single;

  loadingIndicator: boolean = false;

  baseParams: any = {};

  private start = 0;
  private pageSize = 20;

  private sort = "";
  private dir = "";

  public displayCheck:any = true;
  public totalCount=20;

  private _destroy$ = new Subject<void>();

  constructor(
    protected http: HttpClient,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public changeDetectorRef: ChangeDetectorRef,
    public override translateService: TranslateService,) {
    super(resolver, injector, changeDetectorRef, translateService);
  }


  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  // private
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
  override init(config: any) {
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
  public loadData(data): void {
    let val = {};
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
  public load(params?): void {
    if (params) {
      this.baseParams = params;
    }
    if (this.datasource && this.datasource.url && this.datasource.apiBase) {
      this.loadds();
    }
  }

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

  private success(val: any) {
    if(this.view){
      this.view.count = val[this.datasource.totalCount];
    }
    this.rowData = val[this.datasource.data];
    this.totalCount=val[this.datasource.totalCount];
    this.view.selected = [];
    this.loadingIndicator = false;
    this.changeDetectorRef.detectChanges();
  }


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


  reconfigure(colModel: TableColumn[]) {
    // if (this.view) {
    //   this.view.initData(store, colModel);
    // }
    this.columns = colModel;
  }

  public setStart(v){
    this.start=v;
  }
  // private
  onPage(e) {
    this.pageSize = e.pageSize;
    this.start = e.fromRow;
    this.load();
    this.trigger('page', e);
  }
  onSort(e) {
    this.sort = e.sorts[0].prop;
    this.start = e.sorts[0].dir;
    this.load();
    this.trigger('sort', { grid: this.view, event: e });
  }
  onActivate(e) {
    this.trigger('activate', e);
  }
  onSelect(e) {

    this.trigger('select', { grid: this.view, event: e });
  }

  onScroll(e) {
    this.trigger('scroll', { grid: this.view, event: e });
  }

  onReorder(e) {
    this.trigger('reorder', e);
  }

  onResize(e) {
    this.trigger('resize', e);
  }

  onTableContextmenu(e) {
    this.trigger('tableContextmenu', e);
  }

  onTreeAction(e) {
    this.trigger('treeAction', e);
  }

  getColumnModel(): TableColumn[] {
    return this.columns;
  }

  getView(): DatatableComponent {
    return this.view;
  }

  getSelected(): any[] {
    return this.view.selected;
  }
  getSelectedIds(): any[] {
    let ids = [];
    for (const row of this.view.selected) {
      ids.push(row[this.datasource.id]);
    }
    return ids;
  }
}
