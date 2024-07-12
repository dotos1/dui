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
})
export class SearchInputComponent
  extends _SearchInputMixinBase
  implements IControlValueAccessor, OnInit, OnDestroy
{
  @ViewChild(MatInput, { static: true }) _input?: MatInput;

  @ViewChild('searchElement', { static: true, read: ElementRef })
  _searchElement!: ElementRef<HTMLInputElement>;


  @Input() appearance: MatFormFieldAppearance = 'outline';


  @Input() showUnderline = false;


  @Input() debounce = 400;


  @Input() placeholder = '';


  @Input() clearIcon = 'cancel';

  @Input() override value!: unknown;


  @Output() searchDebounce: EventEmitter<string> = new EventEmitter<string>();


  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();


  @Output() onClear: EventEmitter<void> = new EventEmitter<void>();

  @Output() blurSearch: EventEmitter<void> = new EventEmitter<void>();

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


  focus(): void {
    this._input?.focus();
  }

  handleBlur(): void {
    this.blurSearch.emit();
  }

  handleSearch(event: Event): void {
    this._stopPropagation(event);
    if (typeof this.value == 'string') {
      this.onSearch.emit(this.value);
    }
  }


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
