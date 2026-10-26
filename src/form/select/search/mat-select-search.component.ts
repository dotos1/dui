/**
 * @fileoverview Module `src/form/select/search/mat-select-search.component.ts` providing mat select search component definitions and implementation.
 * @zh 模块文件 `src/form/select/search/mat-select-search.component.ts`，提供Material下拉选择搜索组件相关的定义与实现。
 */


import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { delay, filter, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MatSelectSearchClearDirective } from './mat-select-search-clear.directive';
import { configurableDefaultOptions, MAT_SELECTSEARCH_DEFAULT_OPTIONS, MatSelectSearchOptions } from './default-options';
import { MatSelectNoEntriesFoundDirective } from './mat-select-no-entries-found.directive';
import { ThemeService } from '@dotos/dui/theme';

/**
 * Angular component `MatSelectSearchComponent` (selector: 'mat-select-search') providing mat select search component presentation and interaction in `src/form/select/search`.
 * @zh Angular 组件 `MatSelectSearchComponent`（selector: 'mat-select-search'），提供Material下拉选择搜索组件的视图渲染与交互逻辑（位于 `src/form/select/search`）。
 */
@Component({
  selector: 'mat-select-search',
  standalone: false,
  templateUrl: './mat-select-search.component.html',
  styleUrls: ['./mat-select-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSelectSearchComponent),
      multi: true
    }
  ],
  host: {
    hostID: 'mat-select-search' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatSelectSearchComponent implements OnInit, OnDestroy, ControlValueAccessor {


  /**
   * Input property `placeholderLabel` (`string`) configuring placeholder label (default: `'FORM.SELECT_SEARCH'`).
   * @zh 输入属性 `placeholderLabel`（类型：`string`），用于配置占位提示标签（默认值：`'FORM.SELECT_SEARCH'`）。
   */
  @Input() placeholderLabel = 'FORM.SELECT_SEARCH';


  /**
   * Input property `type` (`string`) configuring type (default: `'text'`).
   * @zh 输入属性 `type`（类型：`string`），用于配置类型（默认值：`'text'`）。
   */
  @Input() type = 'text';


  /**
   * Input property `closeIcon` (`string`) configuring close icon (default: `'close'`).
   * @zh 输入属性 `closeIcon`（类型：`string`），用于配置关闭图标（默认值：`'close'`）。
   */
  @Input() closeIcon = 'close';


  /**
   * Input property `closeSvgIcon` (`string`) configuring close svg icon.
   * @zh 输入属性 `closeSvgIcon`（类型：`string`），用于配置关闭SVG矢量图图标。
   */
  @Input() closeSvgIcon?: string;


  /**
   * Input property `noEntriesFoundLabel` (`string`) configuring no entries found label (default: `'FORM.NO_SEARCH_OPTIONS_FOUND'`).
   * @zh 输入属性 `noEntriesFoundLabel`（类型：`string`），用于配置no条目集合Found标签（默认值：`'FORM.NO_SEARCH_OPTIONS_FOUND'`）。
   */
  @Input() noEntriesFoundLabel = 'FORM.NO_SEARCH_OPTIONS_FOUND';


  /**
   * Input property `clearSearchInput` (`boolean`) configuring clear search input (default: `true`).
   * @zh 输入属性 `clearSearchInput`（类型：`boolean`），用于配置清空搜索输入属性（默认值：`true`）。
   */
  @Input() clearSearchInput = true;


  /**
   * Input property `searching` (`boolean`) configuring searching (default: `false`).
   * @zh 输入属性 `searching`（类型：`boolean`），用于配置搜索（默认值：`false`）。
   */
  @Input() searching = false;


  /**
   * Input property `disableInitialFocus` (`boolean`) configuring disable initial focus (default: `false`).
   * @zh 输入属性 `disableInitialFocus`（类型：`boolean`），用于配置禁用初始聚焦（默认值：`false`）。
   */
  @Input() disableInitialFocus = false;


  /**
   * Input property `enableClearOnEscapePressed` (`boolean`) configuring enable clear on escape pressed (default: `false`).
   * @zh 输入属性 `enableClearOnEscapePressed`（类型：`boolean`），用于配置启用清空当Escape按下（默认值：`false`）。
   */
  @Input() enableClearOnEscapePressed = false;


  /**
   * Input property `preventHomeEndKeyPropagation` (`boolean`) configuring prevent home end key propagation (default: `false`).
   * @zh 输入属性 `preventHomeEndKeyPropagation`（类型：`boolean`），用于配置阻止默认Home结束键事件冒泡（默认值：`false`）。
   */
  @Input() preventHomeEndKeyPropagation = false;

  /**
   * Disables scrolling to active options when option list changes. Useful for server-side search
   * @zh 输入属性 `disableScrollToActiveOnOptionsChanged`（类型：`boolean`），用于配置禁用滚动转换为激活当配置选项已变更（默认值：`false`）。
   */
  @Input() disableScrollToActiveOnOptionsChanged = false;

  /**
   * Adds 508 screen reader support for search box
   * @zh 输入属性 `ariaLabel`（类型：`string`），用于配置aria标签（默认值：`'dropdown search'`）。
   */
  @Input() ariaLabel = 'dropdown search';

  /**
   * Whether to show Select All Checkbox (for mat-select[multi=true])
   * @zh 输入属性 `showToggleAllCheckbox`（类型：`boolean`），用于配置显示开关全部复选框（默认值：`false`）。
   */
  @Input() showToggleAllCheckbox = false;

  /**
   * Select all checkbox checked state
   * @zh 输入属性 `toggleAllCheckboxChecked`（类型：`boolean`），用于配置开关全部复选框已勾选（默认值：`false`）。
   */
  @Input() toggleAllCheckboxChecked = false;

  /**
   * select all checkbox indeterminate state
   * @zh 输入属性 `toggleAllCheckboxIndeterminate`（类型：`boolean`），用于配置开关全部复选框半选状态（默认值：`false`）。
   */
  @Input() toggleAllCheckboxIndeterminate = false;

  /**
   * Display a message in a tooltip on the toggle-all checkbox
   * @zh 输入属性 `toggleAllCheckboxTooltipMessage`（类型：`string`），用于配置开关全部复选框悬浮提示消息（默认值：`''`）。
   */
  @Input() toggleAllCheckboxTooltipMessage = '';

  /**
   * Define the position of the tooltip on the toggle-all checkbox.
   * @zh 输入属性 `toggleAllCheckboxTooltipPosition`（类型：`'left' | 'right' | 'above' | 'below' | 'before' | 'after'`），用于配置开关全部复选框悬浮提示位置（默认值：`'below'`）。
   */
  @Input() toggleAllCheckboxTooltipPosition: 'left' | 'right' | 'above' | 'below' | 'before' | 'after' = 'below';


  /**
   * Input property `alwaysRestoreSelectedOptionsMulti` (`boolean`) configuring always restore selected options multi (default: `false`).
   * @zh 输入属性 `alwaysRestoreSelectedOptionsMulti`（类型：`boolean`），用于配置always还原已选中配置选项多（默认值：`false`）。
   */
  @Input() alwaysRestoreSelectedOptionsMulti = false;


  /**
   * Input property `recreateValuesArray` (`boolean`) configuring recreate values array (default: `false`).
   * @zh 输入属性 `recreateValuesArray`（类型：`boolean`），用于配置recreate值列表数组（默认值：`false`）。
   */
  @Input() recreateValuesArray = false;


  /**
   * Output event emitter `toggleAll` (`EventEmitter`) firing when toggle all occurs.
   * @zh 输出事件 `toggleAll`（类型：`EventEmitter`），当触发开关全部时向外发出事件。
   */
  @Output() toggleAll = new EventEmitter<boolean>();


  /**
   * Template/content query reference `searchSelectInput` (`@ViewChild`) targeting search select input.
   * @zh 模板/内容视图查询引用 `searchSelectInput`（`@ViewChild`），指向搜索下拉选择输入属性。
   */
  @ViewChild('searchSelectInput', { read: ElementRef, static: true }) searchSelectInput: ElementRef;


  /**
   * Template/content query reference `innerSelectSearch` (`@ViewChild`) targeting inner select search.
   * @zh 模板/内容视图查询引用 `innerSelectSearch`（`@ViewChild`），指向内部下拉选择搜索。
   */
  @ViewChild('innerSelectSearch', { read: ElementRef, static: true }) innerSelectSearch: ElementRef;


  /**
   * Template/content query reference `clearIcon` (`@ContentChild`) targeting clear icon.
   * @zh 模板/内容视图查询引用 `clearIcon`（`@ContentChild`），指向清空图标。
   */
  @ContentChild(MatSelectSearchClearDirective) clearIcon: MatSelectSearchClearDirective;


  /**
   * Template/content query reference `noEntriesFound` (`@ContentChild`) targeting no entries found.
   * @zh 模板/内容视图查询引用 `noEntriesFound`（`@ContentChild`），指向no条目集合Found。
   */
  @ContentChild(MatSelectNoEntriesFoundDirective) noEntriesFound: MatSelectNoEntriesFoundDirective;


  /**
   * Gets the current value (`value: string`).
   * @zh 获取当前值（`value: string`）。
   */
  get value(): string {
    return this._formControl.value;
  }
  /**
   * Property `_lastExternalInputValue` (`string`) storing last external input value.
   * @zh 属性 `_lastExternalInputValue`（类型：`string`），用于存储或配置末尾外部输入属性值。
   */
  private _lastExternalInputValue?: string;

  /**
   * Property `onTouched` (`() => void`) storing on touched (default: `() => { }`).
   * @zh 属性 `onTouched`（类型：`() => void`），用于存储或配置当是否已触碰（默认值：`() => { }`）。
   */
  onTouched: () => void = ()  => {
    // do nothing.
  };

  /**
   * Reference to the MatSelect options
   * @zh 设置配置选项（`_options`）。
   */
  public set _options(_options: QueryList<MatOption>) {
    this._options$.next(_options);
  }
  /**
   * Gets the current options (`_options: QueryList<MatOption>`).
   * @zh 获取当前配置选项（`_options: QueryList<MatOption>`）。
   */
  public get _options(): QueryList<MatOption> {
    return this._options$.getValue();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /**
   * Property `_options$` (`BehaviorSubject<QueryList<MatOption>>`) storing options.
   * @zh 属性 `_options$`（类型：`BehaviorSubject<QueryList<MatOption>>`），用于存储或配置配置选项。
   */
  public _options$: BehaviorSubject<QueryList<MatOption>> = new BehaviorSubject<QueryList<MatOption>>(null);

  /**
   * Property `optionsList$` (`Observable<MatOption[] | null>`) storing options list.
   * @zh 属性 `optionsList$`（类型：`Observable<MatOption[] | null>`），用于存储或配置配置选项列表。
   */
  private optionsList$: Observable<MatOption[] | null> = this._options$.pipe(
    switchMap(_options => _options ?
      _options.changes.pipe(
        map(options => options.toArray()),
        startWith<MatOption[]>(_options.toArray()),
      ) : of(null)
    )
  );

  /**
   * Property `optionsLength$` (`Observable<number>`) storing options length.
   * @zh 属性 `optionsLength$`（类型：`Observable<number>`），用于存储或配置配置选项长度。
   */
  private optionsLength$: Observable<number> = this.optionsList$.pipe(
    map(options => options ? options.length : 0)
  );


  /**
   * Property `previousSelectedValues` (`any[]`) storing previous selected values.
   * @zh 属性 `previousSelectedValues`（类型：`any[]`），用于存储或配置上一个已选中值列表。
   */
  private previousSelectedValues;

  /**
   * Property `_formControl` (`FormControl<string>`) storing form control.
   * @zh 属性 `_formControl`（类型：`FormControl<string>`），用于存储或配置表单表单控件。
   */
  public _formControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});


  /**
   * Property `_showNoEntriesFound$` (`Observable<boolean>`) storing show no entries found.
   * @zh 属性 `_showNoEntriesFound$`（类型：`Observable<boolean>`），用于存储或配置显示No条目集合Found。
   */
  public _showNoEntriesFound$: Observable<boolean> = combineLatest([
    this._formControl.valueChanges,
    this.optionsLength$
  ]).pipe(
    map(([value, optionsLength]) => !!(this.noEntriesFoundLabel && value
      && optionsLength === this.getOptionsLengthOffset()))
  );


  /**
   * Property `_onDestroy` (`Subject`) storing on destroy (default: `new Subject<void>()`).
   * @zh 属性 `_onDestroy`（类型：`Subject`），用于存储或配置当销毁（默认值：`new Subject<void>()`）。
   */
  private _onDestroy = new Subject<void>();


  /**
   * Property `activeDescendant` (`HTMLElement`) storing active descendant.
   * @zh 属性 `activeDescendant`（类型：`HTMLElement`），用于存储或配置激活后代节点。
   */
  private activeDescendant: HTMLElement;

  /**
   * Creates an instance of `MatSelectSearchComponent` and initializes its dependencies and internal state.
   * @zh 创建 `MatSelectSearchComponent` 实例，并初始化其依赖项与内部状态。
   * @param matSelect - Injected or initial mat select (`MatSelect`) / 注入或传入的Material下拉选择（`MatSelect`）
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param _viewportRuler - Injected or initial viewport ruler (`ViewportRuler`) / 注入或传入的视口Ruler（`ViewportRuler`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param matOption - Injected or initial mat option (`MatOption`) / 注入或传入的Material选项（`MatOption`）
   * @param matFormField - Injected or initial mat form field (`MatFormField`) / 注入或传入的Material表单字段（`MatFormField`）
   * @param defaultOptions - Injected or initial default options (`MatSelectSearchOptions`) / 注入或传入的默认配置选项（`MatSelectSearchOptions`）
   */
  constructor(
    @Inject(MatSelect) public matSelect: MatSelect,
    public changeDetectorRef: ChangeDetectorRef,
    private _viewportRuler: ViewportRuler,
    public themeService: ThemeService,
    @Optional() @Inject(MatOption) public matOption: MatOption,
    @Optional() @Inject(MatFormField) public matFormField: MatFormField,
    @Optional() @Inject(MAT_SELECTSEARCH_DEFAULT_OPTIONS) defaultOptions?: MatSelectSearchOptions
  ) {
    this.applyDefaultOptions(defaultOptions);
  }

  /**
   * Executes `applyDefaultOptions` to handle apply default options.
   * @zh 执行 `applyDefaultOptions`，用于应用默认配置选项。
   * @param defaultOptions - default options parameter (`MatSelectSearchOptions`) / 默认配置选项参数（`MatSelectSearchOptions`）
   */
  private applyDefaultOptions(defaultOptions?: MatSelectSearchOptions) {
    if (!defaultOptions) {
      return;
    }
    for (const key of configurableDefaultOptions) {
      if (Object.prototype.hasOwnProperty.call(defaultOptions, key)) {

        (this[key] as unknown) = defaultOptions[key];
      }
    }
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    // set custom mat-option class if the component was placed inside a mat-option
    if (this.matOption) {
      this.matOption.disabled = true;
      this.matOption._getHostElement().classList.add('contains-mat-select-search');
      this.matOption._getHostElement().setAttribute('role', 'presentation');
    } else {
      console.error('<mat-select-search> must be placed inside a <mat-option> element');
    }

    // when the select dropdown panel is opened or closed
    this.matSelect.openedChange
      .pipe(
        delay(1),
        takeUntil(this._onDestroy)
      )
      .subscribe((opened) => {
        if (opened) {
          this.updateInputWidth();

          if (!this.disableInitialFocus) {
            this._focus();
          }
        } else {
     
          if (this.clearSearchInput) {
            this._reset();
          }
        }
      });

    this.matSelect.openedChange
      .pipe(
        take(1),
        switchMap(() => {
        this._options = this.matSelect.options;

        let previousFirstOption = this._options.toArray()[this.getOptionsLengthOffset()];

        return this._options.changes
          .pipe(tap(() => {

            setTimeout(() => {
           
              const options = this._options.toArray();

              // The true first item is offset by 1
              const currentFirstOption = options[this.getOptionsLengthOffset()];

              const keyManager = this.matSelect._keyManager;
              if (keyManager && this.matSelect.panelOpen && currentFirstOption) {

                const firstOptionIsChanged = !previousFirstOption
                  || !this.matSelect.compareWith(previousFirstOption.value, currentFirstOption.value);

                if (firstOptionIsChanged
                  || !keyManager.activeItem
                  || !options.find(option => this.matSelect.compareWith(option.value, keyManager.activeItem?.value))) {
                  keyManager.setActiveItem(this.getOptionsLengthOffset());
                }

                // wait for panel width changes
                setTimeout(() => {
                  this.updateInputWidth();
                });
              }

              // Update our reference
              previousFirstOption = currentFirstOption;
            });
          }));
        })
      )
      .pipe(takeUntil(this._onDestroy))
      .subscribe();

    // add or remove css class depending on whether to show the no entries found message
    // note: this is hacky
    this._showNoEntriesFound$.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(showNoEntriesFound => {
      // set no entries found class on mat option
      if (this.matOption) {
        if (showNoEntriesFound) {
          this.matOption._getHostElement().classList.add('mat-select-search-no-entries-found');
        } else {
          this.matOption._getHostElement().classList.remove('mat-select-search-no-entries-found');
        }
      }
    });

    // resize the input width when the viewport is resized, i.e. the trigger width could potentially be resized
    this._viewportRuler.change()
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        if (this.matSelect.panelOpen) {
          this.updateInputWidth();
        }
      });

    this.initMultipleHandling();

    this.optionsList$.pipe(
      takeUntil(this._onDestroy)
    ).subscribe(() => {

      this.changeDetectorRef.markForCheck();
    });
  }

  /**
   * Executes `_emitSelectAllBooleanToParent` to handle emit select all boolean to parent.
   * @zh 执行 `_emitSelectAllBooleanToParent`，用于发出下拉选择全部布尔值转换为父级。
   * @param state - state parameter (`boolean`) / 状态参数（`boolean`）
   */
  _emitSelectAllBooleanToParent(state: boolean) {
    this.toggleAll.emit(state);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Executes `_isToggleAllCheckboxVisible` to handle is toggle all checkbox visible.
   * @zh 执行 `_isToggleAllCheckboxVisible`，用于是否为开关全部复选框可见。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  _isToggleAllCheckboxVisible(): boolean {
    return this.matSelect.multiple && this.showToggleAllCheckbox;
  }


  /**
   * Executes `_handleKeydown` to handle handle keydown.
   * @zh 执行 `_handleKeydown`，用于连接手柄按键按下。
   * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
   */
  _handleKeydown(event: KeyboardEvent) {
  
    if ((event.key && event.key.length === 1)
      || (this.preventHomeEndKeyPropagation && (event.key === 'Home' || event.key === 'End'))
    ) {
      event.stopPropagation();
    }

    if (this.matSelect.multiple && event.key && event.key === 'Enter') {

      setTimeout(() => this._focus());
    }


    if (this.enableClearOnEscapePressed && event.key === 'Escape' && this.value) {
      this._reset(true);
      event.stopPropagation();
    }
  }


  /**
   * Executes `_handleKeyup` to handle handle keyup.
   * @zh 执行 `_handleKeyup`，用于连接手柄按键抬起。
   * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
   */
  _handleKeyup(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const ariaActiveDescendantId = this.matSelect._getAriaActiveDescendant();
      const index = this._options.toArray().findIndex(item => item.id === ariaActiveDescendantId);
      if (index !== -1) {
        this.unselectActiveDescendant();
        this.activeDescendant = this._options.toArray()[index]._getHostElement();
        this.activeDescendant.setAttribute('aria-selected', 'true');
        this.searchSelectInput.nativeElement.setAttribute('aria-activedescendant', ariaActiveDescendantId);
      }
    }
  }

  /**
   * Writes a new value from the Angular form model into the view (`ControlValueAccessor`).
   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  writeValue(value: string) {
    this._lastExternalInputValue = value;
    this._formControl.setValue(value);
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Executes `onBlur` to handle on blur.
   * @zh 执行 `onBlur`，用于当失焦。
   */
  onBlur() {
    this.unselectActiveDescendant();
    this.onTouched();
  }

  /**
   * Registers a callback function invoked when the control value changes in the UI (`ControlValueAccessor`).
   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`(value: string) => void`) / 函数参数（`(value: string) => void`）
   */
  registerOnChange(fn: (value: string) => void) {
    this._formControl.valueChanges.pipe(
      filter(value => value !== this._lastExternalInputValue),
      tap(() => this._lastExternalInputValue = undefined),
      takeUntil(this._onDestroy)
    ).subscribe(fn);
  }

  /**
   * Registers a callback function invoked when the control receives a blur/touched event (`ControlValueAccessor`).
   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`() => void`) / 函数参数（`() => void`）
   */
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }


  /**
   * Executes `_focus` to handle focus.
   * @zh 执行 `_focus`，用于聚焦。
   */
  public _focus() {
    if (!this.searchSelectInput || !this.matSelect.panel) {
      return;
    }

    const panel = this.matSelect.panel.nativeElement;
    const scrollTop = panel.scrollTop;

    this.searchSelectInput.nativeElement.focus();

    panel.scrollTop = scrollTop;
  }


  /**
   * Executes `_reset` to handle reset.
   * @zh 执行 `_reset`，用于重置。
   * @param focus - focus parameter (`boolean`) / 聚焦参数（`boolean`）
   */
  public _reset(focus?: boolean) {
    this._formControl.setValue('');
    this._lastExternalInputValue = undefined
    this._options = this.matSelect.options;
    if (focus) {
      this._focus();
    }
  }

  /**
   * Executes `initMultipleHandling` to handle init multiple handling.
   * @zh 执行 `initMultipleHandling`，用于初始化多个连接手柄。
   */
  private initMultipleHandling() {
    if (!this.matSelect.ngControl) {
      if (this.matSelect.multiple) {
 
        console.error('the mat-select containing mat-select-search must have a ngModel or formControl directive when multiple=true');
      }
      return;
    }

    this.previousSelectedValues = this.matSelect.ngControl.value;

    if (!this.matSelect.ngControl.valueChanges) {
      return;
    }

    this.matSelect.ngControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((values) => {
        let restoreSelectedValues = false;
        if (this.matSelect.multiple) {
          if ((this.alwaysRestoreSelectedOptionsMulti || (this._formControl.value && this._formControl.value.length))
            && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
            if (!values || !Array.isArray(values)) {
              values = [];
            }
            const optionValues = this.matSelect.options.map(option => option.value);
            this.previousSelectedValues.forEach(previousValue => {
              if (!values.some(v => this.matSelect.compareWith(v, previousValue))
                && !optionValues.some(v => this.matSelect.compareWith(v, previousValue))) {

                if (this.recreateValuesArray) {
                  values = [...values, previousValue];
                } else {
                  values.push(previousValue);
                }
                restoreSelectedValues = true;
              }
            });
          }
        }
        this.previousSelectedValues = values;

        if (restoreSelectedValues) {
          this.matSelect._onChange(values);
        }
      });
  }


  /**
   * Executes `updateInputWidth` to handle update input width.
   * @zh 执行 `updateInputWidth`，用于更新输入属性宽度。
   */
  public updateInputWidth() {
    if (!this.innerSelectSearch || !this.innerSelectSearch.nativeElement) {
      return;
    }
    let element: HTMLElement | null = this.innerSelectSearch.nativeElement;
    let panelElement: HTMLElement | null = null;
    while (element && element.parentElement) {
      element = element.parentElement;
      if (element.classList.contains('mat-select-panel')) {
        panelElement = element;
        break;
      }
    }
    if (panelElement) {
      this.innerSelectSearch.nativeElement.style.width = panelElement.clientWidth + 'px';
    }
  }


  /**
   * Executes `getOptionsLengthOffset` to handle get options length offset.
   * @zh 执行 `getOptionsLengthOffset`，用于获取配置选项长度偏移量。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private getOptionsLengthOffset(): number {
    if (this.matOption) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Executes `unselectActiveDescendant` to handle unselect active descendant.
   * @zh 执行 `unselectActiveDescendant`，用于取消选中激活后代节点。
   */
  private unselectActiveDescendant() {
    this.activeDescendant?.removeAttribute('aria-selected');
    this.searchSelectInput.nativeElement.removeAttribute('aria-activedescendant');
  }

}
