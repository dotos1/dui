
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


  @Input() placeholderLabel = 'FORM.SELECT_SEARCH';


  @Input() type = 'text';


  @Input() closeIcon = 'close';


  @Input() closeSvgIcon?: string;


  @Input() noEntriesFoundLabel = 'FORM.NO_SEARCH_OPTIONS_FOUND';


  @Input() clearSearchInput = true;


  @Input() searching = false;


  @Input() disableInitialFocus = false;


  @Input() enableClearOnEscapePressed = false;


  @Input() preventHomeEndKeyPropagation = false;

  /** Disables scrolling to active options when option list changes. Useful for server-side search */
  @Input() disableScrollToActiveOnOptionsChanged = false;

  /** Adds 508 screen reader support for search box */
  @Input() ariaLabel = 'dropdown search';

  /** Whether to show Select All Checkbox (for mat-select[multi=true]) */
  @Input() showToggleAllCheckbox = false;

  /** Select all checkbox checked state */
  @Input() toggleAllCheckboxChecked = false;

  /** select all checkbox indeterminate state */
  @Input() toggleAllCheckboxIndeterminate = false;

  /** Display a message in a tooltip on the toggle-all checkbox */
  @Input() toggleAllCheckboxTooltipMessage = '';

  /** Define the position of the tooltip on the toggle-all checkbox. */
  @Input() toggleAllCheckboxTooltipPosition: 'left' | 'right' | 'above' | 'below' | 'before' | 'after' = 'below';


  @Input() alwaysRestoreSelectedOptionsMulti = false;


  @Input() recreateValuesArray = false;


  @Output() toggleAll = new EventEmitter<boolean>();


  @ViewChild('searchSelectInput', { read: ElementRef, static: true }) searchSelectInput: ElementRef;


  @ViewChild('innerSelectSearch', { read: ElementRef, static: true }) innerSelectSearch: ElementRef;


  @ContentChild(MatSelectSearchClearDirective) clearIcon: MatSelectSearchClearDirective;


  @ContentChild(MatSelectNoEntriesFoundDirective) noEntriesFound: MatSelectNoEntriesFoundDirective;


  get value(): string {
    return this._formControl.value;
  }
  private _lastExternalInputValue?: string;

  onTouched: () => void = ()  => {
    // do nothing.
  };

  /** Reference to the MatSelect options */
  public set _options(_options: QueryList<MatOption>) {
    this._options$.next(_options);
  }
  public get _options(): QueryList<MatOption> {
    return this._options$.getValue();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _options$: BehaviorSubject<QueryList<MatOption>> = new BehaviorSubject<QueryList<MatOption>>(null as any);

  private optionsList$: Observable<MatOption[] | null> = this._options$.pipe(
    switchMap(_options => _options ?
      _options.changes.pipe(
        map(options => options.toArray()),
        startWith<MatOption[]>(_options.toArray()),
      ) : of(null)
    )
  );

  private optionsLength$: Observable<number> = this.optionsList$.pipe(
    map(options => options ? options.length : 0)
  );


  private previousSelectedValues: any[];

  public _formControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});


  public _showNoEntriesFound$: Observable<boolean> = combineLatest([
    this._formControl.valueChanges,
    this.optionsLength$
  ]).pipe(
    map(([value, optionsLength]) => !!(this.noEntriesFoundLabel && value
      && optionsLength === this.getOptionsLengthOffset()))
  );


  private _onDestroy = new Subject<void>();


  private activeDescendant: HTMLElement;

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

  private applyDefaultOptions(defaultOptions?: MatSelectSearchOptions) {
    if (!defaultOptions) {
      return;
    }
    for (const key of configurableDefaultOptions) {
      if (Object.prototype.hasOwnProperty.call(defaultOptions, key)) {

        (this[key] as any) = defaultOptions[key];
      }
    }
  }

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

  _emitSelectAllBooleanToParent(state: boolean) {
    this.toggleAll.emit(state);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  _isToggleAllCheckboxVisible(): boolean {
    return this.matSelect.multiple && this.showToggleAllCheckbox;
  }


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

  writeValue(value: string) {
    this._lastExternalInputValue = value;
    this._formControl.setValue(value);
    this.changeDetectorRef.markForCheck();
  }

  onBlur() {
    this.unselectActiveDescendant();
    this.onTouched();
  }

  registerOnChange(fn: (value: string) => void) {
    this._formControl.valueChanges.pipe(
      filter(value => value !== this._lastExternalInputValue),
      tap(() => this._lastExternalInputValue = undefined),
      takeUntil(this._onDestroy)
    ).subscribe(fn);
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }


  public _focus() {
    if (!this.searchSelectInput || !this.matSelect.panel) {
      return;
    }

    const panel = this.matSelect.panel.nativeElement;
    const scrollTop = panel.scrollTop;

    this.searchSelectInput.nativeElement.focus();

    panel.scrollTop = scrollTop;
  }


  public _reset(focus?: boolean) {
    this._formControl.setValue('');
    this._lastExternalInputValue = undefined
    this._options = this.matSelect.options;
    if (focus) {
      this._focus();
    }
  }

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


  private getOptionsLengthOffset(): number {
    if (this.matOption) {
      return 1;
    } else {
      return 0;
    }
  }

  private unselectActiveDescendant() {
    this.activeDescendant?.removeAttribute('aria-selected');
    this.searchSelectInput.nativeElement.removeAttribute('aria-activedescendant');
  }

}
