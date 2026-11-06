/**
 * @fileoverview Module `src/form/select/select.field.ts` providing select field definitions and implementation.
 * @zh 模块文件 `src/form/select/select.field.ts`，提供下拉选择字段相关的定义与实现。
 */

import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { debounce, filter, tap, takeUntil, takeWhile } from 'rxjs/operators';

import { PhoneBackGuard, guardPhoneBack, isPhoneTerminal, phoneSelectableOptions } from '@dotos/dui/base';
import { TranslateService } from '@dotos/dui/translator';
import { SelectOptionsService } from './options.service';
import { MatField } from '../base/mat.field';
import { getOptionLabel, getOptionValue } from '../base/select-option-props';
import { MatSelectSearchComponent } from './search/mat-select-search.component';

/**
 * Class `SelectOption` encapsulating select option data structures and logic in `src/form/select`.
 * @zh 类 `SelectOption`，封装 `src/form/select` 中的下拉选择选项数据结构与处理逻辑。
 */
export class SelectOption {
  /**
   * Property `label` (`string`) storing label.
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签。
   */
  label: string;
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value?: string;
  /**
   * Property `group` (`SelectOption[]`) storing group.
   * @zh 属性 `group`（类型：`SelectOption[]`），用于存储或配置分组。
   */
  group?: SelectOption[];
  /**
   * Property `disabled` (`boolean`) storing disabled.
   * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  disabled?: boolean;
  [key: string]: unknown;

  /**
   * Creates an instance of `SelectOption` and initializes its dependencies and internal state.
   * @zh 创建 `SelectOption` 实例，并初始化其依赖项与内部状态。
   * @param label - Injected or initial label (`string`) / 注入或传入的标签（`string`）
   * @param value - Injected or initial value (`string`) / 注入或传入的值（`string`）
   * @param children - Injected or initial children (`SelectOption[]`) / 注入或传入的子级列表（`SelectOption[]`）
   */
  constructor(label: string, value?: string, children?: SelectOption[]) {
    this.label = label;
    this.value = value;
    this.group = children;
  }
}

/**
 * Angular component `FieldSelect` (selector: 'select-field') providing field select presentation and interaction in `src/form/select`.
 * @zh Angular 组件 `FieldSelect`（selector: 'select-field'），提供字段下拉选择的视图渲染与交互逻辑（位于 `src/form/select`）。
 */
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

  /**
   * Template/content query reference `matSelect` (`MatSelect`) targeting mat select.
   * @zh 模板/内容视图查询引用 `matSelect`（`@ViewChild`），指向Material下拉选择。
   */
  @ViewChild(MatSelect, { static: true }) matSelect!: MatSelect;

  /**
   * Whether the terminal is a phone: the panel becomes a full-screen page with a close bar.
   * @zh 是否手机类：选择面板变全屏页并带关闭条（施工图 M2-15）。桌面为 false，模板与原来一致。
   */
  readonly phone = isPhoneTerminal();

  /** 手机下面板打开期间的返回键守卫 */
  private _backGuard?: PhoneBackGuard;
  /**
   * Template/content query reference `matSearch` (`MatSelectSearchComponent`) targeting mat search.
   * @zh 模板/内容视图查询引用 `matSearch`（`@ViewChild`），指向Material搜索。
   */
  @ViewChild(MatSelectSearchComponent, { static: true }) matSearch: MatSelectSearchComponent;

    
  /**
   * Property `defaultOptions` (`{ options: any[]; }`) storing default options (default: `{ options: [] }`).
   * @zh 属性 `defaultOptions`（类型：`{ options: any[]; }`），用于存储或配置默认配置选项（默认值：`{ options: [] }`）。
   */
  override defaultOptions = {
    options: []
  };

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
   * Property `options` (`any[]`) storing options (default: `[]`).
   * @zh 属性 `options`（类型：`any[]`），用于存储或配置配置选项（默认值：`[]`）。
   */
  options = [];

  /**
   * Property `selectSearchControl` (`FormControl<string>`) storing select search control.
   * @zh 属性 `selectSearchControl`（类型：`FormControl<string>`），用于存储或配置下拉选择搜索表单控件。
   */
  public selectSearchControl:  FormControl<string> = new FormControl<string>('', {nonNullable: true});

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

  /**
   * Property `selectAllValue` (`{ options: any; value: any; }`) storing select all value.
   * @zh 属性 `selectAllValue`（类型：`{ options: any; value: any; }`），用于存储或配置下拉选择全部值。
   */
  private selectAllValue!: { options; value };

  // Tracks the exact params object sent with the most recently issued remote request, so
  // a late-arriving response for a superseded search can be told apart from the current
  // one (see comment on the `serviceData` subscribe below).
  /**
   * Property `_lastRequestParams` (`any`) storing last request params.
   * @zh 属性 `_lastRequestParams`（类型：`any`），用于存储或配置末尾请求参数集合。
   */
  private _lastRequestParams;
  /**
   * Property `_lastLoadedParams` (`any`) storing last loaded params.
   * @zh 属性 `_lastLoadedParams`（类型：`any`），用于存储或配置末尾已加载参数集合。
   */
  private _lastLoadedParams;

  // 远程 select 的完整选项(不带 $filter 那次加载的结果)和它对应的参数。
  // b8c5e5c 复核:远程搜过之后关面板,mat-select-search 会把搜索词清空,但
  // 上面那条管道按设计不为「面板关着 + 空串」发请求,于是 field.options 停在
  // 搜索结果上;当前值若不在结果里,mat-select 找不到对应 option,显示变成空白。
  // 关面板时从这份缓存恢复,不再多发一次请求。params 变了缓存就作废。
  /**
   * Property `_fullOptions` (`any`) storing full options (default: `null`).
   * @zh 属性 `_fullOptions`（类型：`any`），用于存储或配置完整配置选项（默认值：`null`）。
   */
  private _fullOptions = null;
  /**
   * Property `_fullOptionsParams` (`any`) storing full options params.
   * @zh 属性 `_fullOptionsParams`（类型：`any`），用于存储或配置完整配置选项参数集合。
   */
  private _fullOptionsParams;
  /**
   * Property `_searched` (`boolean`) storing searched (default: `false`).
   * @zh 属性 `_searched`（类型：`boolean`），用于存储或配置已搜索（默认值：`false`）。
   */
  private _searched = false;

  /**
   * Executes `areParamsEqual` to handle are params equal.
   * @zh 执行 `areParamsEqual`，用于are参数集合Equal。
   * @param a - a parameter (`any`) / a参数（`any`）
   * @param b - b parameter (`any`) / b参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private areParamsEqual(a, b): boolean {
    if (!a || !b) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (a[k] !== b[k]) return false;
    }
    return true;
  }

  /**
   * Creates an instance of `FieldSelect` and initializes its dependencies and internal state.
   * @zh 创建 `FieldSelect` 实例，并初始化其依赖项与内部状态。
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param optionService - Injected or initial option service (`SelectOptionsService`) / 注入或传入的选项服务（`SelectOptionsService`）
   * @param changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
   */
  constructor(
    protected override translate: TranslateService,
    private optionService: SelectOptionsService,
    private changeDetector: ChangeDetectorRef
  ) {
    super(translate);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
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
          // 手机类：去掉「新建并编辑」「更多」（要弹桌面窗口，手机没有；见 phoneSelectableOptions）。桌面原样
          const loaded = this.selectable(serviceData.options === null ? [] : serviceData.options);
          if (!serviceData.error && !serviceData.params?.['$filter']) {
            const { $filter, ...base } = serviceData.params as { $filter? };
            this._fullOptions = loaded;
            this._fullOptionsParams = base;
            this._searched = false;
          }
          this.options = this.field.options = loaded;
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



  /**
   * Executes `searchChange` to handle search change.
   * @zh 执行 `searchChange`，用于搜索变更。
   * @param searchText - search text parameter (`any`) / 搜索文本参数（`any`）
   */
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
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  override init() {
    super.init();
    if (this.phone) {
      this.field.options = this.selectable(this.field.options);
    }
    this.options = this.field.options;
    if (this.field.remote == undefined || !this.field.remote) {
      this.hasSearch();
    }
  }
  /**
   * Executes `hasSearch` to handle has search.
   * @zh 执行 `hasSearch`，用于是否包含搜索。
   */
  hasSearch() {
    if (this.field.options && this.field.options.length > 30) {
      this.field.hasSearch = true;
    } else {
      this.field.hasSearch = false;
    }
  }

  /**
   * Options the user can pick: on a phone drops the server's desktop-only sentinels; desktop returns the same array.
   * @zh 可选的选项：手机类去掉桌面专用的哨兵项，桌面原样返回。
   */
  /**
   * Gets the echo option shown when the field is disabled/readonly and the current value matches none of the loaded options.
   * @zh 停用 / 只读态下，当前值对不上任何已加载选项时，补一个只放服务端回显文字（`field.inputValue`）的选项，避免显示空白；其它情况返回 null（启用态行为不变）。
   * @returns the echo option or null / 回显选项，没有则为 null
   */
  get fallbackOption(): { value: unknown; text: string } | null {
    const f = this.field;
    if (!(this.formControl?.disabled || f.disabled || f.readonly) || f.multiple) {
      return null;
    }
    const v = this.formControl?.value;
    const text = f.inputValue;
    if (v === undefined || v === null || v === '' || text === undefined || text === null || text === '') {
      return null;
    }
    const opts = Array.isArray(f.options) ? f.options : [];
    if (opts.some((o) => getOptionValue(o, f) === v)) {
      return null;
    }
    const cached = this._echo;
    if (cached && cached.value === v && cached.text === String(text)) {
      return cached;
    }
    return (this._echo = { value: v, text: String(text) });
  }
  private _echo: { value: unknown; text: string } | null = null;

  /**
   * Gets the server-echoed text (`field.inputValue`) to show in the trigger while the field is disabled/readonly and has a value; empty otherwise (enabled behavior unchanged).
   * @zh 停用 / 只读态且有值时，触发器显示的服务端回显文字（`field.inputValue`）；其它情况为空串（启用态行为不变）。
   * @returns echo text or empty string / 回显文字，没有则为空串
   */
  get echoText(): string {
    const f = this.field;
    if (!(this.formControl?.disabled || f.disabled || f.readonly) || f.multiple) {
      return '';
    }
    const v = this.formControl?.value;
    const t = f.inputValue;
    if (v === undefined || v === null || v === '' || t === undefined || t === null || t === '') {
      return '';
    }
    return String(t);
  }

  private selectable(list) {
    return phoneSelectableOptions(list, (o) => getOptionValue(o, this.field));
  }

  /**
   * On a phone, the system back key closes the panel instead of leaving the page.
   * @zh 手机下让系统返回键关闭面板而不是退出页面，已填内容不丢。
   */
  private guardBack(opened: boolean) {
    if (!this.phone) {
      return;
    }
    if (opened) {
      this._backGuard = guardPhoneBack(() => this.matSelect?.close());
    } else {
      this._backGuard?.release();
      this._backGuard = undefined;
    }
  }

  /**
   * Executes `openedChanged` to handle opened changed.
   * @zh 执行 `openedChanged`，用于是否展开已变更。
   * @param opened - opened parameter (`boolean`) / 是否展开参数（`boolean`）
   */
  openedChanged(opened: boolean) {
    this.guardBack(opened);
    if (opened) {
      this.openChanged(true);
    } else {
      this.restoreFullOptions();
    }
  }

  /**
   * Executes `restoreFullOptions` to handle restore full options.
   * @zh 执行 `restoreFullOptions`，用于还原完整配置选项。
   */
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

  /**
   * Executes `openChanged` to handle open changed.
   * @zh 执行 `openChanged`，用于打开已变更。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
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

  /**
   * Executes `setOptions` to handle set options.
   * @zh 执行 `setOptions`，用于集合配置选项。
   * @param opts - opts parameter (`any`) / 选项列表参数（`any`）
   */
  setOptions(opts) {
    this.optionService.setOptions(opts);
  }

  /**
   * Executes `getSelectAllState` to handle get select all state.
   * @zh 执行 `getSelectAllState`，用于获取下拉选择全部状态。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   * @returns Result of type `"" | "indeterminate" | "checked"` / 类型为 `"" | "indeterminate" | "checked"` 的返回值
   */
  getSelectAllState(options) {
    if (this.empty || this.value.length === 0) {
      return '';
    }
    return this.value.length !== this.getSelectAllValue(options).length
      ? 'indeterminate'
      : 'checked';
  }

  /**
   * Executes `toggleSelectAll` to handle toggle select all.
   * @zh 执行 `toggleSelectAll`，用于开关下拉选择全部。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   */
  toggleSelectAll(options) {
    const selectAllValue = this.getSelectAllValue(options);
    this.formControl.setValue(
      !this.value || this.value.length !== selectAllValue.length
        ? selectAllValue
        : [],
    );
  }

  /**
   * Executes `change` to handle change.
   * @zh 执行 `change`，用于变更。
   * @param $event - event parameter (`MatSelectChange`) / 事件参数（`MatSelectChange`）
   */
  change($event: MatSelectChange) {
    this.isLoading = false;
    let viewValue = $event.source.selected['viewValue'];
    this.field.inputValue = viewValue;
    if (this.field.change) {
      this.field.change(this.field, $event, this);
    }
  }

  /**
   * Executes `clear` to handle clear.
   * @zh 执行 `clear`，用于清空。
   */
  clear() {
    this.value = undefined;
    this.field.inputValue = undefined;
  }

  /**
   * Executes `compareWith` to handle compare with.
   * @zh 执行 `compareWith`，用于比较带有。
   * @param o1 - o1 parameter (`any`) / o1参数（`any`）
   * @param o2 - o2 parameter (`any`) / o2参数（`any`）
   */
  compareWith(o1, o2) {
    return o1 === o2;
  }

  /**
   * Executes `trackByOption` to handle track by option.
   * @zh 执行 `trackByOption`，用于跟踪按选项。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param item - item parameter (`any`) / 条目参数（`any`）
   */
  trackByOption(index: number, item) {
    return item ? (item.value !== undefined ? item.value : item.label) : index;
  }

  /**
   * Executes `_getAriaLabelledby` to handle get aria labelledby.
   * @zh 执行 `_getAriaLabelledby`，用于获取AriaLabelledby。
   */
  _getAriaLabelledby() {
    if (this.field.attributes && this.field.attributes['aria-labelledby']) {
      return this.field.attributes['aria-labelledby'];
    }
    if (this.formField && this.formField._labelId) {
      return this.formField._labelId;
    }
    return null;
  }

  /**
   * Executes `getSelectAllValue` to handle get select all value.
   * @zh 执行 `getSelectAllValue`，用于获取下拉选择全部值。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   */
  private getSelectAllValue(options) {
    if (!this.selectAllValue || options !== this.selectAllValue.options) {
      const flatOptions = [];
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
