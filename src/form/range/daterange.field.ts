/**
 * @fileoverview Module `src/form/range/daterange.field.ts` providing daterange field definitions and implementation.
 * @zh 模块文件 `src/form/range/daterange.field.ts`，提供daterange字段相关的定义与实现。
 */

import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Optional,
  ViewEncapsulation
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import {
  MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS
} from '@angular/material-moment-adapter';

import { TranslateService } from '@dotos/dui/translator';
import { RangeField } from './range.field';

/**
 * 日期区间输入，用于 `between` 条件。
 *
 * 用 Material 自带的 mat-date-range-input + mat-date-range-picker：一次日历
 * 交互就选完起止两端，整体仍然只占一个表单字段，所以扩展过滤器那种一行一个
 * 值单元格的地方也放得下。
 *
 * 注意：Material 的区间日历只有「天」粒度，没有月/日期时间区间。列上配了
 * YYYYMM 之类 SpecialSet 时，界面按天选，后台 appendWhere 再按 SpecialSet
 * 归一化，查询结果仍然正确，只是选取精度比单值的 date-field 粗。

 * @zh 日期区间输入，用于 `between` 条件。
 */
@Component({
  selector: 'date-range-field',
  templateUrl: './daterange.field.html',
  styleUrls: ['./range.field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' }
  ],
  host: {
    style: 'flex:1;display:flex;flex-direction:row;align-items:center;',
    hostID: 'date-range-field' + Math.random().toString(36).substring(2, 15),
  }
})
export class DateRangeFieldComponent<D> extends RangeField implements AfterViewInit {

  /**
   * Property `type` (`string`) storing type (default: `'date-range'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'date-range'`）。
   */
  type: string = 'date-range';

  /**
   * 回传后台的格式，与 date-field 一致——后台的 $str_date() 只认这一种。
   * @zh 回传后台的格式，与 date-field 一致——后台的 $str_date() 只认这一种。
   */
  readonly valueFormat = 'YYYY-MM-DD HH:mm:ss';

  /**
   * Creates an instance of `DateRangeFieldComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DateRangeFieldComponent` 实例，并初始化其依赖项与内部状态。
   * @param _dateAdapter - Injected or initial date adapter (`DateAdapter<D, any>`) / 注入或传入的日期适配器（`DateAdapter<D, any>`）
   * @param _dateFormats - Injected or initial date formats (`MatDateFormats`) / 注入或传入的日期格式列表（`MatDateFormats`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   */
  constructor(
    @Optional() public _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    private _changeDetectorRef: ChangeDetectorRef,
    protected override translate: TranslateService) {
    super(translate);
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    // 区间输入是两个 input 拼起来的，值从外部灌进来时要主动刷一次视图。
    this._changeDetectorRef.markForCheck();
  }

  /**
   * 界面展示格式，取 Material 的显示格式，与单值日期框保持一致。
   * @zh 界面展示格式，取 Material 的显示格式，与单值日期框保持一致。
   */
  get displayFormat() {
    return this._dateFormats.display.dateInput;
  }

  /**
   * Executes `formatPart` to handle format part.
   * @zh 执行 `formatPart`，用于格式化Part。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  protected formatPart(value): string {
    return this.momentFormat(value, this.valueFormat);
  }

  /**
   * Executes `displayPart` to handle display part.
   * @zh 执行 `displayPart`，用于displayPart。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  protected override displayPart(value): string {
    return this.momentFormat(value, this.displayFormat);
  }

  /**
   * 后台下发的缺省值是字符串，转成 moment 才能喂给日历。
   * @zh 后台下发的缺省值是字符串，转成 moment 才能喂给日历。
   */
  protected override parsePart(value) {
    if (this.isBlank(value)) {
      return null;
    }
    if (value && typeof value.format === 'function') {
      return value;
    }
    // 缺省值可能是后台 DefaultValue 展开 @[currentMonth] 之类得到的串，
    // 未必按传值格式书写，解析不出来时再按展示格式试一次。
    let parsed = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.parse(value, this.valueFormat));
    if (!parsed) {
      parsed = this._dateAdapter.getValidDateOrNull(
        this._dateAdapter.parse(value, this.displayFormat));
    }
    return parsed;
  }

  /**
   * Executes `momentFormat` to handle moment format.
   * @zh 执行 `momentFormat`，用于moment格式化。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param format - format parameter (`any`) / 格式化参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private momentFormat(value, format): string {
    if (this.isBlank(value)) {
      return '';
    }
    if (value && typeof value.format === 'function') {
      return value.format(format);
    }
    return String(value);
  }
}
