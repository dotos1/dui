import { Component, ViewChild, ChangeDetectorRef, ElementRef,ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, of,Subject } from 'rxjs';
import { debounceTime, delay, tap, filter, map, takeUntil, takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { Dui } from '@dotos/dui/core';
import { isObject } from '@dotos/dui/base';
import { TranslateService } from '@dotos/dui/i18n';
import { OptionsService } from './options.service';
import { MatField } from '../base/mat.field';
import { VTypes } from './vtype';
@Component({
  selector: 'text-field',
  templateUrl: './textfield.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TextFieldComponent extends MatField implements OnInit,AfterViewInit,OnDestroy{

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autocompleteTrigger: MatAutocompleteTrigger;

  protected maskRe;

  public disableKeyFilter = false;

  vtype: string = undefined;

  regexText: string ;

  filteredOptions: Observable<string[]>=new Observable<string[]>();

  isAlive = false;

  isLoading = false;

  public searching: boolean = false;

  protected _onDestroy = new Subject<void>();

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
      let minLengthErrorText=this.field.minLengthText? this.translate.instant(this.field.minLengthText): this.translate.instant("FORM.MINLENGTHTEXT")
      this.field.validation.messages['minlength'] =   Dui.format(minLengthErrorText, this.field.minLength);
    }
    if (this.field.maxLength) {
      let minLengthErrorText = this.field.maxLengthText?this.translate.instant(this.field.maxLengthText):this.translate.instant("FORM.MAXLENGTHTEXT");
      this.field.validation.messages['maxlength'] =Dui.format(minLengthErrorText, this.field.maxLength) ;
    }
    if (this.field.pattern) {
      let patternErrorText = this.field.regexText?this.translate.instant(this.field.regexText):this.translate.instant("FORM.REGEXTEXT");
      this.field.validation.messages['pattern'] =patternErrorText;
    }
    this.filteredOptions = of(this.field.options);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.field.formControl
      .valueChanges.subscribe((val) => {
        if (_.isObjectLike(val) && val.text) {
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
          if (serviceData && this.field.params === serviceData.params) {
            this.filteredOptions = of(serviceData.options === null ? [] : serviceData.options);
            this.changeDetector.detectChanges();
            this.isLoading = false;
            if (serviceData.error) {
              this.field.formControl.setErrors({ 'serviceFail': serviceData.error });
            }
          }
        });
      this.formControl.valueChanges
        .pipe(
          filter(search => !!search),
          tap(() => this.searching = true),
          takeUntil(this._onDestroy),
          debounceTime(500),
          map(search => {
            return search;
          }),
          delay(200)
        ).subscribe(searchText => {
          this.searching = false;
          let url = this.field.dataSource.url;
          let method = this.field.dataSource.method;
          let params = this.field.params;
          params['$filter'] = searchText;
          this.optionService.getOptions(url, method, params);
        });
    } else {
      this.filteredOptions = of(this.field.options);
    }
  }
  override ngAfterViewInit() {
    super.ngAfterViewInit()
    if (this.field.remote) {
      // this.matAutocompleteTrigger.optionSelections.subscribe((event) => {
      //   this.changeDetector.markForCheck();
      // });
    }
    let val=this.field.formControl.value;
    this.changeDetector.detectChanges();
    if (_.isObjectLike(val) && val.text) {
      setTimeout(()=>{
        this._elementRef.nativeElement.children[0].value = val.text;
        this.changeDetector.detectChanges();
      },300);
    }
  }

  openChanged(e) {
    if (this.field.remote) {

    }else{
      this.field.formControl.reset();
      this.filteredOptions = of(this.field.options);
    }
  }


  override ngOnDestroy() {
    this.isAlive = false;
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public getLabel(option) {
    if (isObject(option)) {
      return this.translate.instant(option.label);
    } else {
      return  this.translate.instant(option);
    }
  }

  public getValue(option) {
    if (isObject(option)) {
      return option.value;
    } else {
      return option;
    }
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

  public onKeyPress(e) {
    if (this.vtype && this.disableKeyFilter !== true && (this.maskRe = VTypes[this.vtype + 'Mask'])) {
      if (e.ctrlKey) {
        return;
      }
      const k = e.getKey();
      if ((e.isNavKeyPress() || k === e.BACKSPACE || (k === e.DELETE && e.button === -1))) {
        return;
      }
      const cc = String.fromCharCode(e.getCharCode());
      if (e.isSpecialKey() && !cc) {
        return;
      }
      if (!this.maskRe.test(cc)) {
        e.stopEvent();
      }
    }
  }
}
