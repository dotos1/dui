import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { debounce, filter, tap, takeUntil, takeWhile } from 'rxjs/operators';

import { TranslateService } from '@dotos/dui/translator';
import { SelectOptionsService } from './options.service';
import { MatField } from '../base/mat.field';
import { getOptionLabel, getOptionValue } from '../base/select-option-props';
import { MatSelectSearchComponent } from './search/mat-select-search.component';

export class SelectOption {
  label: string;
  value?: string;
  group?: SelectOption[];
  disabled?: boolean;
  [key: string]: any;

  constructor(label: string, value?: string, children?: SelectOption[]) {
    this.label = label;
    this.value = value;
    this.group = children;
  }
}

@Component({
  selector: 'select-field',
  templateUrl: './select.field.html',
  host: {
    style: 'flex:1;',
    hostID: 'select-field' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [SelectOptionsService]
})
export class FieldSelect extends MatField implements OnInit,OnDestroy {

  @ViewChild(MatSelect, { static: true }) matSelect!: MatSelect;
  @ViewChild(MatSelectSearchComponent, { static: true }) matSearch: MatSelectSearchComponent;

    
  override defaultOptions = {
    options: []
  };

  isAlive = false;

  isLoading = false;

  options = [];

  public selectSearchControl:  FormControl<string> = new FormControl<string>('', {nonNullable: true});

  public searching: boolean = false;

  protected _onDestroy = new Subject<void>();

  private selectAllValue!: { options: any; value: any[] };

  // Tracks the exact params object sent with the most recently issued remote request, so
  // a late-arriving response for a superseded search can be told apart from the current
  // one (see comment on the `serviceData` subscribe below).
  private _lastRequestParams: any;
  private _lastLoadedParams: any;

  // 远程 select 的完整选项(不带 $filter 那次加载的结果)和它对应的参数。
  // b8c5e5c 复核:远程搜过之后关面板,mat-select-search 会把搜索词清空,但
  // 上面那条管道按设计不为「面板关着 + 空串」发请求,于是 field.options 停在
  // 搜索结果上;当前值若不在结果里,mat-select 找不到对应 option,显示变成空白。
  // 关面板时从这份缓存恢复,不再多发一次请求。params 变了缓存就作废。
  private _fullOptions: any[] = null;
  private _fullOptionsParams: any;
  private _searched = false;

  private areParamsEqual(a: any, b: any): boolean {
    if (!a || !b) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (a[k] !== b[k]) return false;
    }
    return true;
  }

  constructor(
    protected override translate: TranslateService,
    private optionService: SelectOptionsService,
    private changeDetector: ChangeDetectorRef
  ) {
    super(translate);
  }

  override ngOnInit() {
    super.ngOnInit();
    // b8c5e5c 复核:
    //  - 「面板关着、搜索词又是空」就不发远程请求,这个判断只放在这条管道里 ——
    //    它拦的是 mat-select-search 关面板时 _reset() 回写的那个空串。不能放进
    //    searchChange():主应用 widget.input.ts 在下拉框里新建记录后,会在面板
    //    关着时主动调 searchChange('') 重新拉选项再 setValue,放进去就拉不到,
    //    新记录回填后显示成空白。
    //  - 防抖只给远程用(500ms)。本地过滤是内存操作,原来那 500ms + delay(200)
    //    只会让每次按键后列表卡 0.7 秒才跟上。
    //  - takeUntil 放在管道最后:放在 debounce 前面时,销毁触发的 complete 会让
    //    debounce 把还在等的那个值立刻发出来,组件销毁后还会再搜一次。
    this.selectSearchControl.valueChanges
      .pipe(
        filter(search => !(this.field.remote && !this.matSelect?.panelOpen && !search)),
        tap(() => { this.searching = true; }),
        debounce(() => timer(this.field.remote ? 500 : 0)),
        takeUntil(this._onDestroy)
      )
      .subscribe((searchText) => {
        // 防抖的 500ms 里面板可能已经关了:这时再发远程搜索,回来的结果会把
        // 关面板时恢复好的完整列表覆盖成搜索结果(见 openedChanged)。
        if (this.field.remote && !this.matSelect?.panelOpen) {
          this.searching = false;
          return;
        }
        this.searchChange(searchText);
      });
    if (this.field.remote) {
      this.isAlive = true;
      this.optionService.options.pipe(takeWhile(() => this.isAlive)).subscribe(serviceData => {
        // `this.field.params` is a single object reused (and mutated) across every
        // search -- comparing serviceData.params against it was always comparing an
        // object against itself, so a slow "a" response arriving after a fast "ab"
        // response would always pass and silently overwrite the newer results.
        // Compare against the params object we actually sent for the request we're
        // still waiting on instead.
        if (serviceData && this._lastRequestParams === serviceData.params) {
          this._lastLoadedParams = { ...this._lastRequestParams };
          if (!serviceData.error && !serviceData.params?.['$filter']) {
            const { $filter, ...base } = serviceData.params as any;
            this._fullOptions = serviceData.options === null ? [] : serviceData.options;
            this._fullOptionsParams = base;
            this._searched = false;
          }
          this.options = this.field.options = serviceData.options === null ? [] : serviceData.options;
          if (!this.field.hasSearch) {
            this.hasSearch();
          }
          this.changeDetector.detectChanges();
          if (this.isLoading && this.matSelect && !this.matSelect.panelOpen) {
            this.matSelect.open();
          }
          this.isLoading = false;
          this.searching = false;
          if (serviceData.error) {
            this.field.formControl.setErrors({ 'serviceFail': serviceData.error });
            this.matSelect.close();
          }
        }
      });
    }
  }



  searchChange(searchText?) {
    this.searching = false;
    if (this.field.remote) {
      let url = this.field.dataSource?.url;
      let method = this.field.dataSource?.method || 'POST';
      // Clone rather than mutate this.field.params in place -- otherwise every
      // in-flight/queued request ends up pointing at the same object, which is what
      // made the identity check above meaningless.
      let params = { ...this.field.params, '$filter': searchText };
      this._lastRequestParams = params;
      if (searchText) {
        this._searched = true;
      }
      this.optionService.getOptions(url, method, params);
    } else {
      // 两处都必须从**完整列表**过滤,且大小写都要归一:
      //
      //   1. 原先过滤的是 `this.field.options` —— 那是上一次按键之后**已经被
      //      筛过**的列表。于是退格不会放宽:输入 "utm2" 再退成 "utm",是在
      //      "utm2" 的结果里再找 "utm",永远回不到更宽的集合,
      //      只有清空才恢复。
      //   2. 原先只把 label 转小写、**没有转 searchText**。于是输入大写
      //      "UTM" 一条都匹配不到,而输入小写 "utm" 正常 —— 用户几乎不可能
      //      想到问题出在大小写上。
      //
      // 顺带把 value 也纳入匹配:坐标系这类选项,人记住的往往是标识
      // (UTM23N)而不是那句中文标签。
      //
      // this.options 是原始选项,label/value 要按字段的 labelProp/valueProp 取,
      // 和 SelectOptionsPipe 同一套规则(b8c5e5c 复核,见 select-option-props.ts)。
      const q = (searchText ?? '').toString().trim().toLowerCase();
      const all = this.options ?? [];
      if (q === '') {
        this.field.options = all;
      } else {
        this.field.options = all.filter((option) => {
          const label = (getOptionLabel(option, this.field) ?? '').toString().toLowerCase();
          const value = (getOptionValue(option, this.field) ?? '').toString().toLowerCase();
          return label.indexOf(q) > -1 || value.indexOf(q) > -1;
        });
      }
      this.changeDetector.detectChanges();
    }
  }

  override ngOnDestroy() {
    this.isAlive = false;
    this._onDestroy.next();
    this._onDestroy.complete();
    super.ngOnDestroy();
  }
  override init() {
    super.init();
    this.options = this.field.options;
    if (this.field.remote == undefined || !this.field.remote) {
      this.hasSearch();
    }
  }
  hasSearch() {
    if (this.field.options && this.field.options.length > 30) {
      this.field.hasSearch = true;
    } else {
      this.field.hasSearch = false;
    }
  }

  openedChanged(opened: boolean) {
    if (opened) {
      this.openChanged(true);
    } else {
      this.restoreFullOptions();
    }
  }

  private restoreFullOptions() {
    if (!this.field.remote || !this._searched) {
      return;
    }
    this._searched = false;
    if (!this._fullOptions || !this.areParamsEqual(this._fullOptionsParams, { ...this.field.params })) {
      // params 变了:缓存的是旧条件下的列表,不能拿来恢复;下次打开时
      // openChanged 会因 _lastLoadedParams 对不上而重新加载。
      this._fullOptions = null;
      return;
    }
    // 丢弃还在路上的搜索响应(subscribe 里按 _lastRequestParams 身份比对)。
    this._lastRequestParams = null;
    this.searching = false;
    this._lastLoadedParams = { ...this._fullOptionsParams };
    this.options = this.field.options = this._fullOptions;
    this.changeDetector.detectChanges();
  }

  openChanged(e?) {
    if (this.field.remote) {
      let params = { ...this.field.params };
      if (this.field.options && this.field.options.length > 0 && this.areParamsEqual(this._lastLoadedParams, params)) {
        return;
      }
      this.isLoading = true;
      let url = this.field.dataSource?.url;
      let method = this.field.dataSource?.method || 'POST';
      this._lastRequestParams = params;
      this.optionService.getOptions(url, method, params);
    }
  }

  setOptions(opts) {
    this.optionService.setOptions(opts);
  }

  getSelectAllState(options: any[]):any {
    if (this.empty || this.value.length === 0) {
      return '';
    }
    return this.value.length !== this.getSelectAllValue(options).length
      ? 'indeterminate'
      : 'checked';
  }

  toggleSelectAll(options: any[]) {
    const selectAllValue = this.getSelectAllValue(options);
    this.formControl.setValue(
      !this.value || this.value.length !== selectAllValue.length
        ? selectAllValue
        : [],
    );
  }

  change($event: MatSelectChange) {
    this.isLoading = false;
    let viewValue = $event.source.selected['viewValue'];
    this.field.inputValue = viewValue;
    if (this.field.change) {
      this.field.change(this.field, $event, this);
    }
  }

  clear() {
    this.value = undefined;
    this.field.inputValue = undefined;
  }

  compareWith(o1: any, o2: any) {
    return o1 === o2;
  }

  trackByOption(index: number, item: any) {
    return item ? (item.value !== undefined ? item.value : item.label) : index;
  }

  _getAriaLabelledby() {
    if (this.field.attributes && this.field.attributes['aria-labelledby']) {
      return this.field.attributes['aria-labelledby'];
    }
    if (this.formField && this.formField._labelId) {
      return this.formField._labelId;
    }
    return null;
  }

  private getSelectAllValue(options: any[]) {
    if (!this.selectAllValue || options !== this.selectAllValue.options) {
      const flatOptions: any[] = [];
      options.forEach(o => o.group
        ? flatOptions.push(...o.group)
        : flatOptions.push(o),
      );
      this.selectAllValue = {
        options,
        value: flatOptions.map(o => o.value),
      };
    }
    return this.selectAllValue.value;
  }
}
