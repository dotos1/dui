/**
 * @fileoverview Module `src/common/search-box/search-box.component.ts` providing search box component definitions and implementation.
 * @zh 模块文件 `src/common/search-box/search-box.component.ts`，提供搜索盒子容器组件相关的定义与实现。
 */

import { DuiConfig } from '@dotos/dui/base';
import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  HostBinding,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SearchInputComponent } from './search-input/search-input.component';
import { Subject, noop} from 'rxjs';
import {  takeUntil } from 'rxjs/operators';
import { Dui } from '@dotos/dui/core';
import { ActivatedRoute } from '@angular/router';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

/**
 * Class `SearchBoxBase` encapsulating search box base data structures and logic in `src/common/search-box`.
 * @zh 类 `SearchBoxBase`，封装 `src/common/search-box` 中的搜索盒子容器基础数据结构与处理逻辑。
 */
export class SearchBoxBase {
  /**
   * Creates an instance of `SearchBoxBase` and initializes its dependencies and internal state.
   * @zh 创建 `SearchBoxBase` 实例，并初始化其依赖项与内部状态。
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(public _changeDetectorRef: ChangeDetectorRef) {}
}

/**
 * An expandable search input that collapses to a single icon when not in use, with
 * built-in debounced search/clear/blur events. Implements `ControlValueAccessor`.
 * @zh 一个可展开的搜索输入框，不使用时收起为单个图标，内置防抖的搜索/清空/失焦事件。实现了 `ControlValueAccessor`。
 */
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBoxComponent),
      multi: true,
    },
  ],
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host:{
    hostID: 'search-box'+   Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class SearchBoxComponent implements ControlValueAccessor {
  /**
   * Property `_searchVisible` (`boolean`) storing search visible (default: `false`).
   * @zh 属性 `_searchVisible`（类型：`boolean`），用于存储或配置搜索可见（默认值：`false`）。
   */
  private _searchVisible = false;
  /**
   * Template/content query reference `_searchInput` (`SearchInputComponent`) targeting search input.
   * @zh 模板/内容视图查询引用 `_searchInput`（`@ViewChild`），指向搜索输入属性。
   */
  @ViewChild(SearchInputComponent, { static: true })
  _searchInput?: SearchInputComponent;

  /**
   * Whether the search input is currently expanded/visible.
   * @zh 搜索输入框当前是否展开/可见。
   */
  get searchVisible(): boolean {
    return this._searchVisible;
  }

  /**
   * Config object applied via {@link Dui.apply}; can set `hasDefault`/`defaultGrp` to
   * start with the input expanded.
   * @zh 通过 {@link Dui.apply} 应用的配置对象；可设置 `hasDefault`/`defaultGrp` 使输入框初始为展开状态。
   */
  @Input() config: DuiConfig = {};

  /**
   * Input property `backIcon` (`string`) configuring back icon (default: `'search'`).
   * @zh 收起状态下显示的图标。
   * @zh 收起状态下显示的图标。
   */
  @Input() backIcon = 'search';

  /**
   * Input property `searchIcon` (`string`) configuring search icon (default: `'search'`).
   * @zh 搜索图标。
   * @zh 搜索图标。
   */
  @Input() searchIcon = 'search';

  /**
   * Input property `clearIcon` (`string`) configuring clear icon (default: `'cancel'`).
   * @zh 清空按钮图标。
   * @zh 清空按钮图标。
   */
  @Input() clearIcon = 'cancel';

  /**
   * Input property `showUnderline` (`boolean`) configuring show underline (default: `false`).
   * @zh 是否显示下划线。
   * @zh 是否显示下划线。
   */
  @Input() showUnderline = false;

  /**
   * Debounce (ms) before `searchDebounce` fires after typing stops.
   * @zh 停止输入后，多久（毫秒）触发一次 `searchDebounce`。
   */
  @Input() debounce = 400;

  /**
   * Keeps the input expanded at all times instead of collapsing to just an icon.
   * @zh 输入框始终保持展开，而不是收起为一个图标。
   */
  @Input() alwaysVisible = false;

  /**
   * Input property `placeholder` (`string`) configuring placeholder (default: `''`).
   * @zh 输入框占位提示文字。
   * @zh 输入框占位提示文字。
   */
  @Input() placeholder = '';

  /**
   * Input property `value` (`unknown`) configuring value.
   * @zh 输入框当前值（`ControlValueAccessor` 绑定值）。
   * @zh 输入框当前值（`ControlValueAccessor` 绑定值）。
   */
  @Input() value: unknown;

  /**
   * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
   * @zh 是否禁用输入框。
   * @zh 是否禁用输入框。
   */
  @Input() disabled:boolean = false;
  

  /**
   * Property `_width` (`string`) storing width (default: `'600px'`).
   * @zh 属性 `_width`（类型：`string`），用于存储或配置宽度（默认值：`'600px'`）。
   */
  public  _width = '600px';

  /**
   * The host element's width (in pixels, unit appended automatically).
   * @zh 宿主元素的宽度（单位为像素，会自动追加单位）。
   */
  @HostBinding('style.width')
  set width(w) {
    this._width = w;
  }
  /**
   * The host element's width (in pixels, unit appended automatically).
   * @zh 宿主元素的宽度（单位为像素，会自动追加单位）。
   */
  get width() {
    if (this._width) {
      const wStr = String(this._width);
      return wStr.endsWith('px') || wStr.endsWith('%') ? wStr : wStr + 'px';
    } else {
      return '100%';
    }
  }

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
   * Output event emitter `userDefined` (`EventEmitter<string>`) firing when on user defined occurs.
   * @zh 由 `config` 中的自定义回调触发时发出（用户自定义行为）。
   * @zh 由 `config` 中的自定义回调触发时发出（用户自定义行为）。
   */
  @Output('userDefined') onUserDefined: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Output event emitter `onSearching` (`EventEmitter<boolean>`) firing when on searching occurs.
   * @zh 搜索框展开/收起状态切换时发出。
   * @zh 搜索框展开/收起状态切换时发出。
   */
  @Output() onSearching: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Property `search` (`Function`) storing search.
   * @zh 由 `config` 提供的自定义搜索回调函数（若设置，会在 `handleSearch` 中一并调用）。
   * @zh 由 `config` 提供的自定义搜索回调函数（若设置，会在 `handleSearch` 中一并调用）。
   */
  public search: Function;

  /**
   * Property `clear` (`Function`) storing clear.
   * @zh 由 `config` 提供的自定义清空回调函数（若设置，会在 `handleClear` 中一并调用）。
   * @zh 由 `config` 提供的自定义清空回调函数（若设置，会在 `handleClear` 中一并调用）。
   */
  public clear: Function;

  /**
   * Property `sub` (`any`) storing sub.
   * @zh 属性 `sub`（类型：`any`），用于存储或配置子。
   */
  private sub;
  /**
   * Property `_unsubscribeAll` (`Subject<void>`) storing unsubscribe all.
   * @zh 属性 `_unsubscribeAll`（类型：`Subject<void>`），用于存储或配置取消订阅全部。
   */
  private _unsubscribeAll: Subject<void>;
  /**
   * Property `_onChange` (`(value: any) => void`) storing on change (default: `noop`).
   * @zh 属性 `_onChange`（类型：`(value: any) => void`），用于存储或配置当变更（默认值：`noop`）。
   */
  private _onChange: (value) => void = noop;
  /**
   * Property `_onTouched` (`() => void`) storing on touched (default: `noop`).
   * @zh 属性 `_onTouched`（类型：`() => void`），用于存储或配置当是否已触碰（默认值：`noop`）。
   */
  private _onTouched: () => void = noop;
  /**
   * Creates an instance of `SearchBoxComponent` and initializes its dependencies and internal state.
   * @zh 创建 `SearchBoxComponent` 实例，并初始化其依赖项与内部状态。
   * @param _dotosConfigService - Injected or initial dotos config service (`DotosConfigService`) / 注入或传入的DotOS配置服务（`DotosConfigService`）
   * @param _themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param activatedRoute - Injected or initial activated route (`ActivatedRoute`) / 注入或传入的已激活Route（`ActivatedRoute`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(
    private _dotosConfigService: DotosConfigService,
    protected _themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef) {
      this._unsubscribeAll = new Subject();
    }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.sub = this.activatedRoute.queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params:{ q? }) => {
        let term = params.q;
        if(term!=undefined){
          this.value=term;
          this._searchVisible=true;
        }
      });

  }
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
        this.init(this.config);
    }
}

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  /**
   * Applies the given config's properties onto this component, expanding the input by
   * default if `hasDefault` or a non-empty `defaultGrp` is set.
   * @zh 将给定配置的属性应用到本组件上，若设置了 `hasDefault` 或非空的 `defaultGrp`，
   * 则默认展开输入框。
   */
  init(config) {
    Dui.apply(this, config);
    if (config.hasDefault || (config.defaultGrp&&config.defaultGrp.length > 0)) {
      this._searchVisible = true;
    }
  }
  
  /**
   * Writes a new value from the Angular form model into the view (`ControlValueAccessor`).
   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   * @param value - value parameter (`unknown`) / 值参数（`unknown`）
   */
  writeValue(value: unknown): void {
    this.value = value;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Registers a callback function invoked when the control value changes in the UI (`ControlValueAccessor`).
   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  registerOnChange(fn): void {
    this._onChange = fn || noop;
  }

  /**
   * Registers a callback function invoked when the control receives a blur/touched event (`ControlValueAccessor`).
   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  registerOnTouched(fn): void {
    this._onTouched = fn || noop;
  }


  /**
   * Handles a click on the search icon: clears and closes if already open, or focuses the
   * input if closed; then toggles visibility.
   * @zh 处理搜索图标的点击：若已展开则清空并收起，若已收起则聚焦输入框；随后切换展开状态。
   */
  searchClicked(): void {
    if (!this.alwaysVisible && this._searchVisible) {
      this.value = '';
      this.handleClear();
    } else if (this.alwaysVisible || !this._searchVisible) {
      this._searchInput?.focus();
    }
    this.toggleVisibility();
  }

  /**
   * Toggles whether the search input is expanded/visible.
   * @zh 切换搜索输入框是否展开/可见。
   */
  toggleVisibility(): void {
    this._searchVisible = !this._searchVisible;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @hidden Forwards the debounced search value as `searchDebounce`.
   * @zh 内部使用，将防抖后的搜索值以 `searchDebounce` 转发出去。
   */
  handleSearchDebounce(value): void {
    this._onChange(value);
    this.searchDebounce.emit(value);
  }

  /**
   * @hidden Emits `onSearch` and invokes the `config`-provided `search` callback, if any.
   * @zh 内部使用，发出 `onSearch` 并调用 `config` 提供的 `search` 回调（如果有）。
   */
  handleSearch(value): void {
    console.log(value);
    this._onChange(value);

    this.onSearch.emit(value);
    if(this.search){
      this.search(value);
   }
  }

  /**
   * @hidden Emits `onClear` and invokes the `config`-provided `clear` callback, if any.
   * @zh 内部使用，发出 `onClear` 并调用 `config` 提供的 `clear` 回调（如果有）。
   */
  handleClear(): void {
    this._onChange('');
    this.onClear.emit();
    if(this.clear){
      this.clear();
    }
  }

  /**
   * @hidden Forwards the blur event as `blurSearch`.
   * @zh 内部使用，将失焦事件以 `blurSearch` 转发出去。
   */
  handleBlur(): void {
    this._onTouched();
    this.blurSearch.emit();
  }
}
