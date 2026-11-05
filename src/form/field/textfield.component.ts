/**
 * @fileoverview Module `src/form/field/textfield.component.ts` providing textfield component definitions and implementation.
 * @zh 模块文件 `src/form/field/textfield.component.ts`，提供textfield组件相关的定义与实现。
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { isObject, phoneSelectableOptions } from '@dotos/dui/base';
import { Dui } from '@dotos/dui/core';
import { TranslateService } from '@dotos/dui/translator';
import { isEmpty, isObjectLike } from 'lodash-es';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, delay, filter, map, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { MatField } from '../base/mat.field';
import { OptionsService } from './options.service';



/**
 * Angular component `TextFieldComponent` (selector: 'text-field') providing text field component presentation and interaction in `src/form/field`.
 * @zh Angular 组件 `TextFieldComponent`（selector: 'text-field'），提供文本字段组件的视图渲染与交互逻辑（位于 `src/form/field`）。
 */
@Component({
  selector: 'text-field',
  templateUrl: './textfield.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [OptionsService],
  host: {
    hostID: 'dui-text-field' + Math.random().toString(36).substring(2, 15),
  }
})
export class TextFieldComponent extends MatField implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Template/content query reference `autocompleteTrigger` (`MatAutocompleteTrigger`) targeting autocomplete trigger.
   * @zh 模板/内容视图查询引用 `autocompleteTrigger`（`@ViewChild`），指向自动补全触发。
   */
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autocompleteTrigger: MatAutocompleteTrigger;

  // protected maskRe;

  /**
   * Property `disableKeyFilter` (`boolean`) storing disable key filter (default: `false`).
   * @zh 属性 `disableKeyFilter`（类型：`boolean`），用于存储或配置禁用键过滤（默认值：`false`）。
   */
  public disableKeyFilter = false;

  // vtype: string = undefined;

  /**
   * Property `regexText` (`string`) storing regex text.
   * @zh 属性 `regexText`（类型：`string`），用于存储或配置正则表达式文本。
   */
  regexText: string;

  /**
   * Property `filteredOptions` (`Observable<string[]>`) storing filtered options (default: `new Observable<string[]>()`).
   * @zh 属性 `filteredOptions`（类型：`Observable<string[]>`），用于存储或配置已过滤配置选项（默认值：`new Observable<string[]>()`）。
   */
  filteredOptions: Observable<string[]> = new Observable<string[]>();

  /**
   * Property `isAlive` (`boolean`) storing is alive (default: `false`).
   * @zh 属性 `isAlive`（类型：`boolean`），用于存储或配置是否为Alive（默认值：`false`）。
   */
  isAlive = false;

  /**
   * Property `isLoading` (`boolean`) storing is loading (default: `false`).
   * @zh 属性 `isLoading`（类型：`boolean`），用于存储或配置是否为加载中（默认值：`false`）。
   */
  isLoading = false;

  /**
   * Property `searching` (`boolean`) storing searching (default: `false`).
   * @zh 属性 `searching`（类型：`boolean`），用于存储或配置搜索（默认值：`false`）。
   */
  public searching: boolean = false;

  /**
   * Property `_onDestroy` (`Subject<void>`) storing on destroy (default: `new Subject<void>()`).
   * @zh 属性 `_onDestroy`（类型：`Subject<void>`），用于存储或配置当销毁（默认值：`new Subject<void>()`）。
   */
  protected _onDestroy = new Subject<void>();

  // Tracks the exact params object sent with the most recently issued remote request; see
  // comment on the `serviceData` subscribe below.
  /**
   * Property `_lastRequestParams` (`any`) storing last request params.
   * @zh 属性 `_lastRequestParams`（类型：`any`），用于存储或配置末尾请求参数集合。
   */
  private _lastRequestParams;

  /**
   * Creates an instance of `TextFieldComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TextFieldComponent` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param optionService - Injected or initial option service (`OptionsService`) / 注入或传入的选项服务（`OptionsService`）
   * @param changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
   */
  constructor(
    protected _elementRef: ElementRef,
    protected override translate: TranslateService,
    protected optionService: OptionsService,
    protected changeDetector: ChangeDetectorRef
  ) {
    super(translate);
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  override init() {
    super.init();
    if (this.field.minLength) {
      let minLengthErrorText = this.field.minLengthText ? this.translate.instant(this.field.minLengthText) : this.translate.instant("FORM.MINLENGTHTEXT")
      this.field.validation.messages['minlength'] = Dui.format(minLengthErrorText, this.field.minLength);
    }
    if (this.field.maxLength) {
      let minLengthErrorText = this.field.maxLengthText ? this.translate.instant(this.field.maxLengthText) : this.translate.instant("FORM.MAXLENGTHTEXT");
      this.field.validation.messages['maxlength'] = Dui.format(minLengthErrorText, this.field.maxLength);
    }
    if (this.field.pattern) {
      let patternErrorText = this.field.regexText ? this.translate.instant(this.field.regexText) : this.translate.instant("FORM.REGEXTEXT");
      this.field.validation.messages['pattern'] = patternErrorText;
    }
    this.filteredOptions = of(this.field.options);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    super.ngOnInit();

    if (!isEmpty(this.field)) {
      this.field.formControl
        .valueChanges.pipe(takeUntil(this._onDestroy)).subscribe((val) => {
          if (isObjectLike(val) && val.text) {
            this._elementRef.nativeElement.children[0].value = val.text;
          }
          if (this.field.change) {
            this.field.change(this.field, val, this);
          }
        });
      if (this.field.remote) {
        this.isAlive = true;
        this.optionService.options.pipe(
          takeWhile(() => this.isAlive)).subscribe(serviceData => {
            // `this.field.params` is a single object reused (and mutated) across every
            // search -- comparing serviceData.params against it was always comparing an
            // object against itself, so a slow response could silently overwrite a
            // newer one that already arrived. Compare against the params object we
            // actually sent for the request we're still waiting on instead.
            if (serviceData && this._lastRequestParams === serviceData.params) {
              // 手机类：去掉「新建并编辑」「更多」（见 phoneSelectableOptions）；桌面原样
              this.filteredOptions = of(phoneSelectableOptions(serviceData.options === null ? [] : serviceData.options, (o) => (o !== null && typeof o === 'object' ? (o as Record<string, unknown>)['value'] : o)));
              this.changeDetector.detectChanges();
              this.isLoading = false;
              this.searching = false;
              if (serviceData.error) {
                this.field.formControl.setErrors({ 'serviceFail': serviceData.error });
              }
            }
          });
        this.formControl.valueChanges
          .pipe(
            debounceTime(500),
            tap(search => { this.searching = !!search; }),
            filter(search => !!search),
            map(search => {
              return search;
            }),
            delay(200),
            // takeUntil 必须在最后:放在 debounceTime/delay 前面时,销毁那一刻
            // 已经在防抖或 delay 里的值照样会发出,组件销毁后还会发一次远程请求。
            takeUntil(this._onDestroy)
          ).subscribe(searchText => {
            this.searching = false;
            let url = this.field.dataSource?.url;
            let method = this.field.dataSource?.method || 'POST';
            // Clone rather than mutate this.field.params in place -- otherwise every
            // in-flight/queued request ends up pointing at the same object, which is
            // what made the identity check above meaningless.
            let params = { ...this.field.params, '$filter': searchText };
            this._lastRequestParams = params;
            this.optionService.getOptions(url, method, params);
          });
      } else {
        this.filteredOptions = of(this.field.options);
        if (this.field.options) {
          this.formControl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(val => {
              this.filteredOptions = of(typeof val === 'string' && val ? this._filter(val) : this.field.options);
            });
        }
      }
    }

  }
  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  override ngAfterViewInit() {
    super.ngAfterViewInit()
    if (this.field.remote) {
      // this.matAutocompleteTrigger.optionSelections.subscribe((event) => {
      //   this.changeDetector.markForCheck();
      // });
    }
    let val = this.field.formControl.value;
    this.changeDetector.detectChanges();
    if (isObjectLike(val) && val.text) {
      setTimeout(() => {
        this._elementRef.nativeElement.children[0].value = val.text;
        this.changeDetector.detectChanges();
      }, 300);
    }
  }

  /**
   * Executes `openChanged` to handle open changed.
   * @zh 执行 `openChanged`，用于打开已变更。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  openChanged(e) {
    if (this.field.remote) {

    } else {
      // this.field.formControl.reset();
      this.filteredOptions = of(this.field.options);
    }
  }


  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    this.isAlive = false;
    this._onDestroy.next();
    this._onDestroy.complete();
    super.ngOnDestroy();
  }

  /**
   * Executes `getLabel` to handle get label.
   * @zh 执行 `getLabel`，用于获取标签。
   * @param option - option parameter (`any`) / 选项参数（`any`）
   */
  public getLabel(option) {
    if (isObject(option)) {
      return this.translate.instant(option.label);
    } else {
      return this.translate.instant(option);
    }
  }

  /**
   * Executes `getValue` to handle get value.
   * @zh 执行 `getValue`，用于获取值。
   * @param option - option parameter (`any`) / 选项参数（`any`）
   */
  public getValue(option) {
    if (isObject(option)) {
      return option.value;
    } else {
      return option;
    }
  }

  /**
   * Executes `trackByOption` to handle track by option.
   * @zh 执行 `trackByOption`，用于跟踪按选项。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param option - option parameter (`any`) / 选项参数（`any`）
   */
  public trackByOption(index: number, option) {
    return isObject(option) ? option.value : option;
  }

  /**
   * Executes `_filter` to handle filter.
   * @zh 执行 `_filter`，用于过滤。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  private _filter(value): string[] {
    if (this.field.options == null || value == null) {
      return [];
    } else {
      const filterValue = value.toLowerCase();
      return this.field.options.filter(option => {
        if (isObject(option)) {
          return true;
        } else {
          return option.toLowerCase().includes(filterValue);
        }
      });
    }
  }


}
