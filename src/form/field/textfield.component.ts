import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { isObject } from '@dotos/dui/base';
import { Dui } from '@dotos/dui/core';
import { TranslateService } from '@dotos/dui/translator';
import { isEmpty, isObjectLike } from 'lodash-es';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, delay, filter, map, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { MatField } from '../base/mat.field';
import { OptionsService } from './options.service';



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

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autocompleteTrigger: MatAutocompleteTrigger;

  // protected maskRe;

  public disableKeyFilter = false;

  // vtype: string = undefined;

  regexText: string;

  filteredOptions: Observable<string[]> = new Observable<string[]>();

  isAlive = false;

  isLoading = false;

  public searching: boolean = false;

  protected _onDestroy = new Subject<void>();

  // Tracks the exact params object sent with the most recently issued remote request; see
  // comment on the `serviceData` subscribe below.
  private _lastRequestParams: any;

  constructor(
    protected _elementRef: ElementRef,
    protected override translate: TranslateService,
    protected optionService: OptionsService,
    protected changeDetector: ChangeDetectorRef
  ) {
    super(translate);
  }

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
              this.filteredOptions = of(serviceData.options === null ? [] : serviceData.options);
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

  openChanged(e) {
    if (this.field.remote) {

    } else {
      // this.field.formControl.reset();
      this.filteredOptions = of(this.field.options);
    }
  }


  override ngOnDestroy() {
    this.isAlive = false;
    this._onDestroy.next();
    this._onDestroy.complete();
    super.ngOnDestroy();
  }

  public getLabel(option) {
    if (isObject(option)) {
      return this.translate.instant(option.label);
    } else {
      return this.translate.instant(option);
    }
  }

  public getValue(option) {
    if (isObject(option)) {
      return option.value;
    } else {
      return option;
    }
  }

  public trackByOption(index: number, option: any) {
    return isObject(option) ? option.value : option;
  }

  private _filter(value: any): string[] {
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
