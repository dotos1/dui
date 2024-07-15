
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDatetimepicker } from '@dotos/dui/form/date/picker';
import { ConfigService } from '@dotos/dui/core/config';
import { ClipboardService } from '@dotos/dui/common/clipboard';
import { TranslationService } from '@dotos/dui/i18n';

import { CardViewDateItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';

@Component({
  providers: [
    // { provide: DateAdapter, useClass: MomentDatetimeAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
    // { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
    // { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }
  ],
  selector: 'dui-card-view-dateitem',
  templateUrl: './card-view-dateitem.component.html',
  styleUrls: ['./card-view-dateitem.component.scss']
})
export class CardViewDateItemComponent implements OnInit, OnDestroy {


  @Input()
  property: CardViewDateItemModel|any;

  @Input()
  editable: boolean = false;

  @Input()
  displayEmpty: boolean = true;

  @Input()
  displayClearAction: boolean = true;

  @ViewChild('datetimePicker')
  public datepicker: MatDatetimepicker<any>;

  valueDate: Moment;
  dateFormat: string;

  private onDestroy$ = new Subject<boolean>();

  protected destroy$ = new Subject<boolean>();


  constructor(
    public cardViewUpdateService: CardViewUpdateService,
    private dateAdapter: DateAdapter<Moment>,
    private appConfig: ConfigService,
    private clipboardService: ClipboardService,
    public translateService: TranslationService) {
      this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemModel: any) => {
        if (this.property.key === itemModel.key) {
          this.property.value = itemModel.value;
        }
      });
    this.dateFormat = this.appConfig.get('dateValues.defaultDateFormat');
  }

  ngOnInit() {
    let locale = this.translateService.userLang.replace("_", "-");
    if (locale == undefined) {
      this.dateAdapter.setLocale('zh-CN');
      this.property.locale = 'zh-CN';
    } else {
      this.dateAdapter.setLocale(locale);
      this.property.locale = locale;
    }
    // (<MomentDatetimeAdapter>this.dateAdapter).overrideDisplayFormat = 'MMM DD';
    if (this.property.value) {
      this.valueDate = moment(this.property.value, this.dateFormat);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  showProperty(): boolean {
    return this.displayEmpty || !this.property.isEmpty();
  }

  showClearAction(): boolean {
    return this.displayClearAction && (!this.property.isEmpty() || !!this.property.default);
  }

  isEditable(): boolean {
    return this.editable && this.property.editable;
  }

  showDatePicker() {
    this.datepicker.open();
  }

  onDateChanged(newDateValue) {
    if (newDateValue) {
      const momentDate = moment(newDateValue.value, this.dateFormat, true);
      if (momentDate.isValid()) {
        this.valueDate = momentDate;
        this.cardViewUpdateService.update(<CardViewDateItemModel>{ ...this.property }, momentDate.toDate());
        this.property.value = momentDate.toDate();
      }
    }
  }

  onDateClear() {
    this.valueDate = null;
    this.cardViewUpdateService.update(<CardViewDateItemModel>{ ...this.property }, null);
    this.property.value = null;
    this.property.default = null;
  }

  copyToClipboard(valueToCopy: string) {
    const clipboardMessage = this.translateService.instant('METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
    this.clipboardService.copyContentToClipboard(valueToCopy, clipboardMessage);
  }
}
