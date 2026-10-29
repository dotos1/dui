/**
 * @fileoverview Module `src/form/date/moment/moment-datetime-adapter.ts` providing moment datetime adapter definitions and implementation.
 * @zh 模块文件 `src/form/date/moment/moment-datetime-adapter.ts`，提供moment日期时间适配器相关的定义与实现。
 */

import {Inject, Injectable, Optional} from "@angular/core";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateAdapterOptions} from "@angular/material-moment-adapter";

import  moment from 'moment';
import {Moment} from 'moment';
import { DatetimeAdapter } from "@dotos/dui/form/date/adapter";

// const moment:any = 'default' in moment? moment['default'] : moment;

/**
 * Executes `range` to handle range.
 * @zh 执行 `range`，用于范围。
 * @param length - length parameter (`number`) / 长度参数（`number`）
 * @param valueFunction - value function parameter (`(index: number) => T`) / 值函数参数（`(index: number) => T`）
 * @returns Result of type `T[]` / 类型为 `T[]` 的返回值
 */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

/**
 * Injectable Angular service `MomentDatetimeAdapter` managing moment datetime adapter state and operations in `src/form/date/moment`.
 * @zh 可注入的 Angular 服务 `MomentDatetimeAdapter`，管理 `src/form/date/moment` 中的Moment日期时间适配器状态与业务操作。
 */
@Injectable()
export class MomentDatetimeAdapter extends DatetimeAdapter<Moment> {

  /**
   * Property `_localeData` (`{…}`) storing locale data.
   * @zh 属性 `_localeData`（类型：`{…}`），用于存储或配置语言区域数据。
   */
  private _localeData: {
    firstDayOfWeek: number,
    longMonths: string[],
    shortMonths: string[],
    dates: string[],
    hours: string[],
    minutes: string[],
    longDaysOfWeek: string[],
    shortDaysOfWeek: string[],
    narrowDaysOfWeek: string[]
  };

  /**
   * Property `_useUtc` (`boolean`) storing use utc (default: `false`).
   * @zh 属性 `_useUtc`（类型：`boolean`），用于存储或配置使用Utc（默认值：`false`）。
   */
  private _useUtc = false;

  /**
   * Creates an instance of `MomentDatetimeAdapter` and initializes its dependencies and internal state.
   * @zh 创建 `MomentDatetimeAdapter` 实例，并初始化其依赖项与内部状态。
   * @param matDateLocale - Injected or initial mat date locale (`string`) / 注入或传入的Material日期语言区域（`string`）
   * @param matMomentAdapterOptions - Injected or initial mat moment adapter options (`MatMomentDateAdapterOptions`) / 注入或传入的MaterialMoment适配器配置选项（`MatMomentDateAdapterOptions`）
   * @param _delegate - Injected or initial delegate (`DateAdapter<moment.Moment, any>`) / 注入或传入的delegate（`DateAdapter<moment.Moment, any>`）
   */
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string,
              @Optional() @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS) matMomentAdapterOptions: MatMomentDateAdapterOptions,
              _delegate: DateAdapter<Moment>) {
    super(_delegate);
    this.setLocale(matDateLocale || moment.locale());
    this._useUtc = matMomentAdapterOptions.useUtc;
  }

  /**
   * Executes `setLocale` to handle set locale.
   * @zh 执行 `setLocale`，用于集合语言区域。
   * @param locale - locale parameter (`string`) / 语言区域参数（`string`）
   */
  override setLocale(locale: string) {
    super.setLocale(locale);
    const momentLocaleData = moment.localeData(locale);
    this._localeData = {
      firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
      longMonths: momentLocaleData.months(),
      shortMonths: momentLocaleData.monthsShort(),
      dates: range(31, (i) => super.createDate(2017, 0, i + 1).format("D")),
      hours: range(24, (i) => this.createDatetime(2017, 0, 1, i, 0).format("H")),
      minutes: range(60, (i) => this.createDatetime(2017, 0, 1, 1, i).format("m")),
      longDaysOfWeek: momentLocaleData.weekdays(),
      shortDaysOfWeek: momentLocaleData.weekdaysShort(),
      narrowDaysOfWeek: momentLocaleData.weekdaysMin()
    };
  }

  /**
   * Executes `getHour` to handle get hour.
   * @zh 执行 `getHour`，用于获取小时。
   * @param date - date parameter (`moment.Moment`) / 日期参数（`moment.Moment`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getHour(date: Moment): number {
    return super.clone(date).hour();
  }

  /**
   * Executes `getMinute` to handle get minute.
   * @zh 执行 `getMinute`，用于获取分钟。
   * @param date - date parameter (`moment.Moment`) / 日期参数（`moment.Moment`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getMinute(date: Moment): number {
    return super.clone(date).minute();
  }

  /**
   * Executes `isInNextMonth` to handle is in next month.
   * @zh 执行 `isInNextMonth`，用于是否为在下一个月。
   * @param startDate - start date parameter (`moment.Moment`) / 开始日期参数（`moment.Moment`）
   * @param endDate - end date parameter (`moment.Moment`) / 结束日期参数（`moment.Moment`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isInNextMonth(startDate: Moment, endDate: Moment): boolean {
    const nextMonth = this.getDateInNextMonth(startDate);
    return super.sameMonthAndYear(nextMonth, endDate);
  }

  /**
   * Executes `createDatetime` to handle create datetime.
   * @zh 执行 `createDatetime`，用于创建日期时间。
   * @param year - year parameter (`number`) / 年参数（`number`）
   * @param month - month parameter (`number`) / 月参数（`number`）
   * @param date - date parameter (`number`) / 日期参数（`number`）
   * @param hour - hour parameter (`number`) / 小时参数（`number`）
   * @param minute - minute parameter (`number`) / 分钟参数（`number`）
   * @returns Result of type `moment.Moment` / 类型为 `moment.Moment` 的返回值
   */
  createDatetime(year: number, month: number, date: number, hour: number, minute: number): Moment {
    // Check for invalid month and date (except upper bound on date which we have to check after
    // creating the Date).
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    if (hour < 0 || hour > 23) {
      throw Error(`Invalid hour "${hour}". Hour has to be between 0 and 23.`);
    }

    if (minute < 0 || minute > 59) {
      throw Error(`Invalid minute "${minute}". Minute has to be between 0 and 59.`);
    }

    // const result = moment({year, month, date, hour, minute}).locale(this.locale);
    let result = moment({year, month, date, hour, minute});
    // if (this._useUtc) {
    //   result = result.utc();
    // }

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  /**
   * Executes `getFirstDateOfMonth` to handle get first date of month.
   * @zh 执行 `getFirstDateOfMonth`，用于获取首个日期的月。
   * @param date - date parameter (`moment.Moment`) / 日期参数（`moment.Moment`）
   * @returns Result of type `moment.Moment` / 类型为 `moment.Moment` 的返回值
   */
  getFirstDateOfMonth(date: Moment): Moment {
    return super.clone(date).startOf("month");
  }

  /**
   * Executes `getHourNames` to handle get hour names.
   * @zh 执行 `getHourNames`，用于获取小时名称列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getHourNames(): string[] {
    return this._localeData.hours;
  }

  /**
   * Executes `getMinuteNames` to handle get minute names.
   * @zh 执行 `getMinuteNames`，用于获取分钟名称列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getMinuteNames(): string[] {
    return this._localeData.minutes;
  }

  /**
   * Executes `addCalendarHours` to handle add calendar hours.
   * @zh 执行 `addCalendarHours`，用于添加日历小时数。
   * @param date - date parameter (`moment.Moment`) / 日期参数（`moment.Moment`）
   * @param hours - hours parameter (`number`) / 小时数参数（`number`）
   * @returns Result of type `moment.Moment` / 类型为 `moment.Moment` 的返回值
   */
  addCalendarHours(date: Moment, hours: number): Moment {
    return super.clone(date).add({hours});
  }

  /**
   * Executes `addCalendarMinutes` to handle add calendar minutes.
   * @zh 执行 `addCalendarMinutes`，用于添加日历分钟数。
   * @param date - date parameter (`moment.Moment`) / 日期参数（`moment.Moment`）
   * @param minutes - minutes parameter (`number`) / 分钟数参数（`number`）
   * @returns Result of type `moment.Moment` / 类型为 `moment.Moment` 的返回值
   */
  addCalendarMinutes(date: Moment, minutes: number): Moment {
    return super.clone(date).add({minutes});
  }

  /**
   * Executes `deserialize` to handle deserialize.
   * @zh 执行 `deserialize`，用于反序列化。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `moment.Moment` / 类型为 `moment.Moment` 的返回值
   */
  override deserialize(value): Moment | null {
    return this._delegate.deserialize(value);
  }

  /**
   * Executes `getDateInNextMonth` to handle get date in next month.
   * @zh 执行 `getDateInNextMonth`，用于获取日期在下一个月。
   * @param date - date parameter (`moment.Moment`) / 日期参数（`moment.Moment`）
   */
  private getDateInNextMonth(date: Moment) {
    return super.clone(date).date(1).add({month: 1});
  }
}
