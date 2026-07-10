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


export class SearchInputBase {
  constructor(public _changeDetectorRef: ChangeDetectorRef) {}
}

export const _SearchInputMixinBase =
  mixinControlValueAccessor(SearchInputBase);

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
  @ViewChild(MatInput, { static: true }) _input?: MatInput;

  @ViewChild('searchElement', { static: true, read: ElementRef })
  _searchElement!: ElementRef<HTMLInputElement>;


  /** @zh Material 表单字段外观：`'outline'`、`'fill'` 等。 */
  @Input() appearance: MatFormFieldAppearance = 'outline';

  /** @zh 是否显示下划线。 */
  @Input() showUnderline = false;

  /** @zh 停止输入后，多久（毫秒）触发一次 `searchDebounce`。 */
  @Input() debounce = 400;

  /** @zh 输入框占位提示文字。 */
  @Input() placeholder = '';

  /** @zh 清空按钮图标。 */
  @Input() clearIcon = 'cancel';

  /** @zh 输入框当前值（`ControlValueAccessor` 绑定值）。 */
  @Input() override value!: unknown;

  /** @zh 停止输入 `debounce` 毫秒后发出当前输入值。 */
  @Output() searchDebounce: EventEmitter<string> = new EventEmitter<string>();

  /** @zh 触发搜索时（如按下回车）发出当前输入值。 */
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

  /** @zh 输入框被清空时发出。 */
  @Output() onClear: EventEmitter<void> = new EventEmitter<void>();

  /** @zh 输入框失去焦点时发出。 */
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

  private _destroy$ = new Subject<void>();

  constructor(
    public themeService: ThemeService,
    @Optional() private _dir: Dir,
    override _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    super(_changeDetectorRef);
  }

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

  private _searchTermChanged(value: string): void {
    this.searchDebounce.emit(value);
  }

  private _stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
