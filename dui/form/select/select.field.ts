import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import {  of, Subject } from 'rxjs';
import { debounceTime, delay, tap,  map, takeUntil, takeWhile } from 'rxjs/operators';

import { TranslateService } from '@dotos/dui/translator';
import { SelectOptionsService } from './options.service';
import { MatField } from '../base/mat.field';
import { MatSelectSearchComponent } from './select.search';

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
    style: 'flex:1;'
  },
  changeDetection: ChangeDetectionStrategy.Default
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

  public allowDecimals=true;

  public selectSearchControl: FormControl = new FormControl();

  public searching: boolean = false;

  protected _onDestroy = new Subject<void>();

  private selectAllValue!: { options: any; value: any[] };

  constructor(
    protected override translate: TranslateService,
    private optionService: SelectOptionsService,
    private changeDetector: ChangeDetectorRef
  ) {
    super(translate);
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.field.remote) {
      this.isAlive = true;
      this.optionService.options.pipe(takeWhile(() => this.isAlive)).subscribe(serviceData => {
        if (serviceData && this.field.params === serviceData.params) {
          this.options = this.field.options = serviceData.options === null ? [] : serviceData.options;
          if (!this.field.hasSearch) {
            this.hasSearch();
          }
          this.changeDetector.detectChanges();
          if (this.isLoading) {
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
        let params = this.field.params;
        params['$filter'] = searchText;
        this.optionService.getOptions(url, method, params);
      } else {
        let options = this.field.options.filter(option => option.label.toLowerCase().indexOf(searchText) > -1);
        this.field.options = options;
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
    if (this.field.options && this.field.options.length > 15) {
      this.field.hasSearch = true;
    } else {
      this.field.hasSearch = false;
    }
  }

  openChanged(e) {
    if (this.field.remote) {
      this.isLoading = true;
      this.field.options = [];
      this.field.formControl.reset();
      let url = this.field.dataSource.url;
      let method = this.field.dataSource.method;
      let params = this.field.params;
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

    //  this.field.formControl.patchValue($event.value);
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
