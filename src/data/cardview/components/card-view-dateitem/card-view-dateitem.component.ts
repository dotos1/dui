/**
 * @fileoverview Module `src/data/cardview/components/card-view-dateitem/card-view-dateitem.component.ts` providing card view dateitem component definitions and implementation.
 * @zh 模块文件 `src/data/cardview/components/card-view-dateitem/card-view-dateitem.component.ts`，提供卡片视图dateitem组件相关的定义与实现。
 */


import { Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDatetimepicker } from '@dotos/dui/form/date/picker';
import { ConfigService } from '@dotos/dui/core/config';
import { ClipboardService } from '@dotos/dui/common/clipboard';
import { TranslationService } from '@dotos/dui/translator';

import { CardViewDateItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';

/**
 * Angular component `CardViewDateItemComponent` (selector: 'dui-card-view-dateitem') providing card view date item component presentation and interaction in `src/data/cardview/components/card-view-dateitem`.
 * @zh Angular 组件 `CardViewDateItemComponent`（selector: 'dui-card-view-dateitem'），提供卡片视图日期条目组件的视图渲染与交互逻辑（位于 `src/data/cardview/components/card-view-dateitem`）。
 */
@Component({
  providers: [
    // { provide: DateAdapter, useClass: MomentDatetimeAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
    // { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
    // { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }
  ],
  selector: 'dui-card-view-dateitem',
  templateUrl: './card-view-dateitem.component.html',
  styleUrls: ['./card-view-dateitem.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardViewDateItemComponent implements OnInit, OnDestroy {


  /**
   * Input property `property` (`any`) configuring property.
   * @zh 输入属性 `property`（类型：`any`），用于配置属性。
   */
  @Input()
  property;

  /**
   * Input property `editable` (`boolean`) configuring editable (default: `false`).
   * @zh 输入属性 `editable`（类型：`boolean`），用于配置是否可编辑（默认值：`false`）。
   */
  @Input()
  editable: boolean = false;

  /**
   * Input property `displayEmpty` (`boolean`) configuring display empty (default: `true`).
   * @zh 输入属性 `displayEmpty`（类型：`boolean`），用于配置display空（默认值：`true`）。
   */
  @Input()
  displayEmpty: boolean = true;

  /**
   * Input property `displayClearAction` (`boolean`) configuring display clear action (default: `true`).
   * @zh 输入属性 `displayClearAction`（类型：`boolean`），用于配置display清空动作（默认值：`true`）。
   */
  @Input()
  displayClearAction: boolean = true;

  /**
   * Template/content query reference `datepicker` (`any`) targeting datepicker.
   * @zh 模板/内容视图查询引用 `datepicker`（`@ViewChild`），指向日期选择器。
   */
  @ViewChild('datetimePicker')
  public datepicker;

  /**
   * Property `valueDate` (`moment.Moment`) storing value date.
   * @zh 属性 `valueDate`（类型：`moment.Moment`），用于存储或配置值日期。
   */
  valueDate: Moment;
  /**
   * Property `dateFormat` (`string`) storing date format.
   * @zh 属性 `dateFormat`（类型：`string`），用于存储或配置日期格式化。
   */
  dateFormat: string;

  /**
   * Property `onDestroy$` (`Subject<boolean>`) storing on destroy (default: `new Subject<boolean>()`).
   * @zh 属性 `onDestroy$`（类型：`Subject<boolean>`），用于存储或配置当销毁（默认值：`new Subject<boolean>()`）。
   */
  private onDestroy$ = new Subject<boolean>();


  /**
   * Creates an instance of `CardViewDateItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewDateItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param cardViewUpdateService - Injected or initial card view update service (`CardViewUpdateService`) / 注入或传入的卡片视图更新服务（`CardViewUpdateService`）
   * @param dateAdapter - Injected or initial date adapter (`DateAdapter<moment.Moment, any>`) / 注入或传入的日期适配器（`DateAdapter<moment.Moment, any>`）
   * @param appConfig - Injected or initial app config (`ConfigService`) / 注入或传入的app配置（`ConfigService`）
   * @param clipboardService - Injected or initial clipboard service (`ClipboardService`) / 注入或传入的clipboard服务（`ClipboardService`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(
    public cardViewUpdateService: CardViewUpdateService,
    private dateAdapter: DateAdapter<Moment>,
    private appConfig: ConfigService,
    private clipboardService: ClipboardService,
    public translateService: TranslationService) {
      this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((itemModel: { key?; value? }) => {
        if (this.property.key === itemModel.key) {
          this.property.value = itemModel.value;
        }
      });
    this.dateFormat = this.appConfig.get('dateValues.defaultDateFormat');
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
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

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  /**
   * Executes `showProperty` to handle show property.
   * @zh 执行 `showProperty`，用于显示属性。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  showProperty(): boolean {
    return this.displayEmpty || !this.property.isEmpty();
  }

  /**
   * Executes `showClearAction` to handle show clear action.
   * @zh 执行 `showClearAction`，用于显示清空动作。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  showClearAction(): boolean {
    return this.displayClearAction && (!this.property.isEmpty() || !!this.property.default);
  }

  /**
   * Executes `isEditable` to handle is editable.
   * @zh 执行 `isEditable`，用于是否为是否可编辑。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isEditable(): boolean {
    return this.editable && this.property.editable;
  }

  /**
   * Executes `showDatePicker` to handle show date picker.
   * @zh 执行 `showDatePicker`，用于显示日期选择器。
   */
  showDatePicker() {
    this.datepicker.open();
  }

  /**
   * Executes `onDateChanged` to handle on date changed.
   * @zh 执行 `onDateChanged`，用于当日期已变更。
   * @param newDateValue - new date value parameter (`any`) / 新日期值参数（`any`）
   */
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

  /**
   * Executes `onDateClear` to handle on date clear.
   * @zh 执行 `onDateClear`，用于当日期清空。
   */
  onDateClear() {
    this.valueDate = null;
    this.cardViewUpdateService.update(<CardViewDateItemModel>{ ...this.property }, null);
    this.property.value = null;
    this.property.default = null;
  }

  /**
   * Executes `copyToClipboard` to handle copy to clipboard.
   * @zh 执行 `copyToClipboard`，用于复制转换为Clipboard。
   * @param valueToCopy - value to copy parameter (`string`) / 值转换为复制参数（`string`）
   */
  copyToClipboard(valueToCopy: string) {
    const clipboardMessage = this.translateService.instant('METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
    this.clipboardService.copyContentToClipboard(valueToCopy, clipboardMessage);
  }
}
