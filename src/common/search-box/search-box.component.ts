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
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AUTO_STYLE,
} from '@angular/animations';

import { SearchInputComponent } from './search-input/search-input.component';
import { Subject, noop} from 'rxjs';
import {  takeUntil } from 'rxjs/operators';
import { Dui } from '@dotos/dui/core';
import { ActivatedRoute } from '@angular/router';
import { dotosSearchBoxTheme } from './search-box.theme';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

export class SearchBoxBase {
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
  animations: [
    trigger('inputState', [
      state(
        '0',
        style({
          width: '0%',
          margin: '0px',
        })
      ),
      state(
        '1',
        style({
          width: '100%',
          margin: AUTO_STYLE,
        })
      ),
      transition('0 => 1', animate('200ms ease-in')),
      transition('1 => 0', animate('200ms ease-out')),
    ]),
  ],
  host:{
    hostID: 'search-box'+   Math.random().toString(36).substring(2, 15),
  }
})
export class SearchBoxComponent implements ControlValueAccessor {
  private _searchVisible = false;
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
  @Input() config: any = {};

  /** @zh 收起状态下显示的图标。 */
  @Input() backIcon = 'search';

  /** @zh 搜索图标。 */
  @Input() searchIcon = 'search';

  /** @zh 清空按钮图标。 */
  @Input() clearIcon = 'cancel';

  /** @zh 是否显示下划线。 */
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

  /** @zh 输入框占位提示文字。 */
  @Input() placeholder = '';

  /** @zh 输入框当前值（`ControlValueAccessor` 绑定值）。 */
  @Input() value: unknown;

  /** @zh 是否禁用输入框。 */
  @Input() disabled:boolean = false;
  

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
      return this._width + 'px';
    } else {
      return '100%';
    }
  }

  /** @zh 停止输入 `debounce` 毫秒后发出当前输入值。 */
  @Output() searchDebounce: EventEmitter<string> = new EventEmitter<string>();

  /** @zh 触发搜索时（如按下回车）发出当前输入值。 */
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

  /** @zh 输入框被清空时发出。 */
  @Output() onClear: EventEmitter<void> = new EventEmitter<void>();

  /** @zh 输入框失去焦点时发出。 */
  @Output() blurSearch: EventEmitter<void> = new EventEmitter<void>();

  /** @zh 由 `config` 中的自定义回调触发时发出（用户自定义行为）。 */
  @Output('userDefined') onUserDefined: EventEmitter<string> = new EventEmitter<string>();

  /** @zh 搜索框展开/收起状态切换时发出。 */
  @Output() onSearching: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** @zh 由 `config` 提供的自定义搜索回调函数（若设置，会在 `handleSearch` 中一并调用）。 */
  public search: Function;

  /** @zh 由 `config` 提供的自定义清空回调函数（若设置，会在 `handleClear` 中一并调用）。 */
  public clear: Function;

  private sub: any;
  private _unsubscribeAll: Subject<void>;
  constructor(
    private _dotosConfigService: DotosConfigService,
    protected _themeService: ThemeService,
    private activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef) {
      this._unsubscribeAll = new Subject();
    }

  ngOnInit(): void {
    this.sub = this.activatedRoute.queryParams.subscribe((params:any) => {
      let term = params.q;
      this.value=term;
      if(term!=undefined){
        this._searchVisible=true;
      }else{
        this._searchVisible=false;
      }
    });
    this._dotosConfigService.config
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() => {
      this._themeService.loadTheme(dotosSearchBoxTheme);
    });  

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
        this.init(this.config);
    }
}

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.sub.unsubscribe();
  }

  /**
   * Applies the given config's properties onto this component, expanding the input by
   * default if `hasDefault` or a non-empty `defaultGrp` is set.
   * @zh 将给定配置的属性应用到本组件上，若设置了 `hasDefault` 或非空的 `defaultGrp`，
   * 则默认展开输入框。
   */
  init(config: any) {
    Dui.apply(this, config);
    if (config.hasDefault || (config.defaultGrp&&config.defaultGrp.length > 0)) {
      this._searchVisible = true;
    }
  }
  
  writeValue(value: unknown): void {
    this.value = value;
    this._changeDetectorRef.markForCheck();
  }

  registerOnChange(): void {
    noop;
  }

  registerOnTouched(): void {
    noop;
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
  handleSearchDebounce(value: any): void {
    this.searchDebounce.emit(value);
  }

  /**
   * @hidden Emits `onSearch` and invokes the `config`-provided `search` callback, if any.
   * @zh 内部使用，发出 `onSearch` 并调用 `config` 提供的 `search` 回调（如果有）。
   */
  handleSearch(value: any): void {
    console.log(value);

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
    this.blurSearch.emit();
  }
}
