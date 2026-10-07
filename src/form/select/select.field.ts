import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import {  of, Subject } from 'rxjs';
import { debounceTime, delay, tap,  map, takeUntil, takeWhile } from 'rxjs/operators';

import { TranslateService } from '@dotos/dui/translator';
import { SelectOptionsService } from './options.service';
import { MatField } from '../base/mat.field';
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
    this.selectSearchControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
         let searchText = this.selectSearchControl.value;
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
          this.options = this.field.options = serviceData.options === null ? [] : serviceData.options;
          if (!this.field.hasSearch) {
            this.hasSearch();
          }
          this.changeDetector.detectChanges();
          if (this.isLoading && this.matSelect && !this.matSelect.panelOpen) {
            this.matSelect.open();
          }
          this.isLoading = false;
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
     of(searchText).pipe(
      tap(() => { this.searching = true;  }),
      takeUntil(this._onDestroy),
      debounceTime(500),
      map(search => {
        return search;
      }),
      delay(200)
    ).subscribe(searchText => {
      this.searching = false;
      if (this.field.remote) {
        let url = this.field.dataSource.url;
        let method = this.field.dataSource.method;
        // Clone rather than mutate this.field.params in place -- otherwise every
        // in-flight/queued request ends up pointing at the same object, which is what
        // made the identity check above meaningless.
        let params = { ...this.field.params, '$filter': searchText };
        this._lastRequestParams = params;
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
        const q = (searchText ?? '').toString().trim().toLowerCase();
        const all = this.options ?? [];
        if (q === '') {
          this.field.options = all;
        } else {
          this.field.options = all.filter((option) => {
            const label = (option?.label ?? '').toString().toLowerCase();
            const value = (option?.value ?? '').toString().toLowerCase();
            return label.indexOf(q) > -1 || value.indexOf(q) > -1;
          });
        }
        this.changeDetector.detectChanges();
      }
    });
  }

  override ngOnDestroy() {
    this.isAlive = false;
    this._onDestroy.next();
    this._onDestroy.complete();
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
    }
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
