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
import { Subject, noop, takeUntil } from 'rxjs';
import { Dui } from '@dotos/dui/core';
import { ActivatedRoute } from '@angular/router';
import { dotosSearchBoxTheme } from './search-box.theme';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

export class SearchBoxBase {
  constructor(public _changeDetectorRef: ChangeDetectorRef) {}
}

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
})
export class SearchBoxComponent implements ControlValueAccessor {
  private _searchVisible = false;
  @ViewChild(SearchInputComponent, { static: true })
  _searchInput?: SearchInputComponent;

  get searchVisible(): boolean {
    return this._searchVisible;
  }

  @Input() config: any = {};

  @Input() backIcon = 'search';


  @Input() searchIcon = 'search';


  @Input() clearIcon = 'cancel';

  @Input() showUnderline = false;

  @Input() debounce = 400;

  @Input() alwaysVisible = false;

  @Input() placeholder = '';

  @Input() value: unknown;

  @Input() disabled:boolean = false;
  

  public  _width = '600px';

  @HostBinding('style.width')
  set width(w) {
    this._width = w;
  }
  get width() {
    if (this._width) {
      return this._width + 'px';
    } else {
      return '100%';
    }
  }

  @Output() searchDebounce: EventEmitter<string> = new EventEmitter<string>();


  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();


  @Output() onClear: EventEmitter<void> = new EventEmitter<void>();


  @Output() blurSearch: EventEmitter<void> = new EventEmitter<void>();

  @Output('userDefined') onUserDefined: EventEmitter<string> = new EventEmitter<string>();

  @Output() onSearching: EventEmitter<boolean> = new EventEmitter<boolean>();

  public search: Function;

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


  searchClicked(): void {
    if (!this.alwaysVisible && this._searchVisible) {
      this.value = '';
      this.handleClear();
    } else if (this.alwaysVisible || !this._searchVisible) {
      this._searchInput?.focus();
    }
    this.toggleVisibility();
  }

  toggleVisibility(): void {
    this._searchVisible = !this._searchVisible;
    this._changeDetectorRef.markForCheck();
  }

  handleSearchDebounce(value: any): void {
    this.searchDebounce.emit(value);
  }

  handleSearch(value: any): void {
    console.log(value);
    
    this.onSearch.emit(value);
    if(this.search){
      this.search(value);
   }
  }

  handleClear(): void {
    this.onClear.emit();
    if(this.clear){
      this.clear();
    }
  }

  handleBlur(): void {
    this.blurSearch.emit();
  }
}
