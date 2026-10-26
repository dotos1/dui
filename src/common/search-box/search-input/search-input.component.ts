/**
 * @fileoverview Module `src/common/search-box/search-input/search-input.component.ts` providing search input component definitions and implementation.
 * @zh 模块文件 `src/common/search-box/search-input/search-input.component.ts`，提供搜索输入属性组件相关的定义与实现。
 */

import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  OnDestroy,
  ElementRef,
  NgZone,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Dir } from '@angular/cdk/bidi';
import { MatInput } from '@angular/material/input';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, skip, takeUntil } from 'rxjs/operators';
import { IControlValueAccessor, mixinControlValueAccessor } from '@dotos/dui/core/behaviors';
import { ThemeService } from '@dotos/dui/theme';


/**
 * Class `SearchInputBase` encapsulating search input base data structures and logic in `src/common/search-box/search-input`.
 * @zh 类 `SearchInputBase`，封装 `src/common/search-box/search-input` 中的搜索输入属性基础数据结构与处理逻辑。
 */
export class SearchInputBase {
  /**
   * Creates an instance of `SearchInputBase` and initializes its dependencies and internal state.
   * @zh 创建 `SearchInputBase` 实例，并初始化其依赖项与内部状态。
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(public _changeDetectorRef: ChangeDetectorRef) {}
}

/**
 * Constant/variable `_SearchInputMixinBase` defining search input mixin base in `src/common/search-box/search-input`.
 * @zh 常量/变量 `_SearchInputMixinBase`，定义 `src/common/search-box/search-input` 中的搜索输入属性Mixin基础。
 */
export const _SearchInputMixinBase =
  mixinControlValueAccessor(SearchInputBase);

/**
 * Angular component `SearchInputComponent` (selector: 'search-input') providing search input component presentation and interaction in `src/common/search-box/search-input`.
 * @zh Angular 组件 `SearchInputComponent`（selector: 'search-input'），提供搜索输入属性组件的视图渲染与交互逻辑（位于 `src/common/search-box/search-input`）。
 */
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true,
    },
  ],
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['value'],
  animations: [
    trigger('searchState', [
      state(
        'hide-left',
        style({
          transform: 'translateX(-150%)',
          display: 'none',
        })
      ),
      state(
        'hide-right',
        style({
          transform: 'translateX(150%)',
          display: 'none',
        })
      ),
      state(
        'show',
        style({
          transform: 'translateX(0%)',
          display: 'block',
        })
      ),
      transition('* => show', animate('200ms ease-in')),
      transition('show => *', animate('200ms ease-out')),
    ]),
  ],
  host:{
    hostID: 'search-input'+   Math.random().toString(36).substring(2, 15),
  }
})
export class SearchInputComponent
  extends _SearchInputMixinBase
  implements IControlValueAccessor, OnInit, OnDestroy
{
  /**
   * Template/content query reference `_input` (`@ViewChild`) targeting input.
   * @zh 模板/内容视图查询引用 `_input`（`@ViewChild`），指向输入属性。
   */
  @ViewChild(MatInput, { static: true }) _input?: MatInput;

  /**
   * Template/content query reference `_searchElement` (`@ViewChild`) targeting search element.
   * @zh 模板/内容视图查询引用 `_searchElement`（`@ViewChild`），指向搜索元素。
   */
  @ViewChild('searchElement', { static: true, read: ElementRef })
  _searchElement!: ElementRef<HTMLInputElement>;


  /**
   * @zh Material 表单字段外观：`'outline'`、`'fill'` 等。
   * @zh Material 表单字段外观：`'outline'`、`'fill'` 等。
   */
  @Input() appearance: MatFormFieldAppearance = 'outline';

  /**
   * Input property `showUnderline` (`boolean`) configuring show underline (default: `false`).
   * @zh 是否显示下划线。
   * @zh 是否显示下划线。
   */
  @Input() showUnderline = false;

  /**
   * Input property `debounce` (`number`) configuring debounce (default: `400`).
   * @zh 停止输入后，多久（毫秒）触发一次 `searchDebounce`。
   * @zh 停止输入后，多久（毫秒）触发一次 `searchDebounce`。
   */
  @Input() debounce = 400;

  /**
   * Input property `placeholder` (`string`) configuring placeholder (default: `''`).
   * @zh 输入框占位提示文字。
   * @zh 输入框占位提示文字。
   */
  @Input() placeholder = '';

  /**
   * Input property `clearIcon` (`string`) configuring clear icon (default: `'cancel'`).
   * @zh 清空按钮图标。
   * @zh 清空按钮图标。
   */
  @Input() clearIcon = 'cancel';

  /**
   * Input property `value` (`unknown`) configuring value.
   * @zh 输入框当前值（`ControlValueAccessor` 绑定值）。
   * @zh 输入框当前值（`ControlValueAccessor` 绑定值）。
   */
  @Input() override value!: unknown;

  /**
   * Output event emitter `searchDebounce` (`EventEmitter<string>`) firing when search debounce occurs.
   * @zh 停止输入 `debounce` 毫秒后发出当前输入值。
   * @zh 停止输入 `debounce` 毫秒后发出当前输入值。
   */
  @Output() searchDebounce: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Output event emitter `onSearch` (`EventEmitter<string>`) firing when on search occurs.
   * @zh 触发搜索时（如按下回车）发出当前输入值。
   * @zh 触发搜索时（如按下回车）发出当前输入值。
   */
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Output event emitter `onClear` (`EventEmitter<void>`) firing when on clear occurs.
   * @zh 输入框被清空时发出。
   * @zh 输入框被清空时发出。
   */
  @Output() onClear: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Output event emitter `blurSearch` (`EventEmitter<void>`) firing when blur search occurs.
   * @zh 输入框失去焦点时发出。
   * @zh 输入框失去焦点时发出。
   */
  @Output() blurSearch: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Whether the current bidi direction is right-to-left.
   * @zh 当前双向文字方向是否为从右到左。
   */
  get isRTL(): boolean {
    if (this._dir) {
      return this._dir.dir === 'rtl';
    }
    return false;
  }

  /**
   * Property `_destroy$` (`Subject`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `_destroy$`（类型：`Subject`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private _destroy$ = new Subject<void>();

  /**
   * Creates an instance of `SearchInputComponent` and initializes its dependencies and internal state.
   * @zh 创建 `SearchInputComponent` 实例，并初始化其依赖项与内部状态。
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param _dir - Injected or initial dir (`Dir`) / 注入或传入的目录（`Dir`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(
    public themeService: ThemeService,
    @Optional() private _dir: Dir,
    override _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    super(_changeDetectorRef);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this._input?.ngControl?.valueChanges
      ?.pipe(
        debounceTime(this.debounce),
        skip(1), // skip first change when value is set to undefined
        takeUntil(this._destroy$)
      )
      .subscribe((value: string) => {
        this._searchTermChanged(value);
      });

    this._ngZone.runOutsideAngular(() =>
      fromEvent(this._searchElement.nativeElement, 'search')
        .pipe(takeUntil(this._destroy$))
        .subscribe(this._stopPropagation)
    );
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._destroy$.next();
  }


  /**
   * Focuses the underlying `<input>` element.
   * @zh 聚焦底层的 `<input>` 元素。
   */
  focus(): void {
    this._input?.focus();
  }

  /**
   * @hidden Forwards the blur event as `blurSearch`.
   * @zh 内部使用，将失焦事件以 `blurSearch` 转发出去。
   */
  handleBlur(): void {
    this.blurSearch.emit();
  }

  /**
   * @hidden Handles the native `search` event, emitting `onSearch` with the current value.
   * @zh 内部使用，处理原生 `search` 事件，携带当前值发出 `onSearch`。
   */
  handleSearch(event: Event): void {
    this._stopPropagation(event);
    if (typeof this.value == 'string') {
      this.onSearch.emit(this.value);
    }
  }


  /**
   * Clears the input's value and emits `onClear`.
   * @zh 清空输入框的值并发出 `onClear`。
   */
  clearSearch(): void {
    this.value = '';
    this._changeDetectorRef.markForCheck();
    this.onClear.emit();
  }

  /**
   * Executes `_searchTermChanged` to handle search term changed.
   * @zh 执行 `_searchTermChanged`，用于搜索Term已变更。
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  private _searchTermChanged(value: string): void {
    this.searchDebounce.emit(value);
  }

  /**
   * Executes `_stopPropagation` to handle stop propagation.
   * @zh 执行 `_stopPropagation`，用于停止事件冒泡。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  private _stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
