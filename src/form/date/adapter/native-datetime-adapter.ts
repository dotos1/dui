/**
 * @fileoverview Module `src/form/date/adapter/native-datetime-adapter.ts` providing native datetime adapter definitions and implementation.
 * @zh 模块文件 `src/form/date/adapter/native-datetime-adapter.ts`，提供原生日期时间适配器相关的定义与实现。
 */

import {Inject, Injectable, Optional} from "@angular/core";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {DatetimeAdapter} from "./datetime-adapter";

/**
 * The default hour names to use if Intl API is not available.
 * @zh 常量/变量 `DEFAULT_HOUR_NAMES`，定义 `src/form/date/adapter` 中的默认小时名称列表。
 */
const DEFAULT_HOUR_NAMES = range(24, i => String(i));

/**
 * The default minute names to use if Intl API is not available.
 * @zh 常量/变量 `DEFAULT_MINUTE_NAMES`，定义 `src/form/date/adapter` 中的默认分钟名称列表。
 */
const DEFAULT_MINUTE_NAMES = range(60, i => String(i));

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
 * Injectable Angular service `NativeDatetimeAdapter` managing native datetime adapter state and operations in `src/form/date/adapter`.
 * @zh 可注入的 Angular 服务 `NativeDatetimeAdapter`，管理 `src/form/date/adapter` 中的原生日期时间适配器状态与业务操作。
 */
@Injectable({providedIn:'root'})
export class NativeDatetimeAdapter extends DatetimeAdapter<Date> {

  /**
   * Creates an instance of `NativeDatetimeAdapter` and initializes its dependencies and internal state.
   * @zh 创建 `NativeDatetimeAdapter` 实例，并初始化其依赖项与内部状态。
   * @param matDateLocale - Injected or initial mat date locale (`string`) / 注入或传入的Material日期语言区域（`string`）
   * @param _delegate - Injected or initial delegate (`DateAdapter<Date, any>`) / 注入或传入的delegate（`DateAdapter<Date, any>`）
   */
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string, _delegate: DateAdapter<Date>) {
    super(_delegate);
    this.setLocale(matDateLocale);
  }

  /**
   * Executes `clone` to handle clone.
   * @zh 执行 `clone`，用于克隆。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @returns Result of type `Date` / 类型为 `Date` 的返回值
   */
  override clone(date: Date): Date {
    return this.createDatetime(this.getYear(date), this.getMonth(date), this.getDate(date), this.getHour(date), this.getMinute(date));
  }

  /**
   * Executes `getHour` to handle get hour.
   * @zh 执行 `getHour`，用于获取小时。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getHour(date: Date): number {
    return date.getHours();
  }

  /**
   * Executes `getMinute` to handle get minute.
   * @zh 执行 `getMinute`，用于获取分钟。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getMinute(date: Date): number {
    return date.getMinutes();
  }

  /**
   * Executes `isInNextMonth` to handle is in next month.
   * @zh 执行 `isInNextMonth`，用于是否为在下一个月。
   * @param startDate - start date parameter (`Date`) / 开始日期参数（`Date`）
   * @param endDate - end date parameter (`Date`) / 结束日期参数（`Date`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isInNextMonth(startDate: Date, endDate: Date): boolean {
    const nextMonth = this.getDateInNextMonth(startDate);
    return this.sameMonthAndYear(nextMonth, endDate);
  }

  /**
   * Executes `createDatetime` to handle create datetime.
   * @zh 执行 `createDatetime`，用于创建日期时间。
   * @param year - year parameter (`number`) / 年参数（`number`）
   * @param month - month parameter (`number`) / 月参数（`number`）
   * @param date - date parameter (`number`) / 日期参数（`number`）
   * @param hour - hour parameter (`number`) / 小时参数（`number`）
   * @param minute - minute parameter (`number`) / 分钟参数（`number`）
   * @returns Result of type `Date` / 类型为 `Date` 的返回值
   */
  createDatetime(year: number, month: number, date: number, hour: number, minute: number): Date {
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

    const result = this._createDateWithOverflow(year, month, date, hour, minute);

    // Check that the date wasn't above the upper bound for the month, causing the month to overflow
    if (result.getMonth() !== month) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  /**
   * Executes `getFirstDateOfMonth` to handle get first date of month.
   * @zh 执行 `getFirstDateOfMonth`，用于获取首个日期的月。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @returns Result of type `Date` / 类型为 `Date` 的返回值
   */
  getFirstDateOfMonth(date: Date): Date {
    const result = new Date();
    result.setFullYear(date.getFullYear(), date.getMonth(), 1);
    return result;
  }

  /**
   * Executes `getHourNames` to handle get hour names.
   * @zh 执行 `getHourNames`，用于获取小时名称列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getHourNames(): string[] {
    return DEFAULT_HOUR_NAMES;
  }

  /**
   * Executes `getMinuteNames` to handle get minute names.
   * @zh 执行 `getMinuteNames`，用于获取分钟名称列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getMinuteNames(): string[] {
    return DEFAULT_MINUTE_NAMES;
  }

  /**
   * Executes `addCalendarYears` to handle add calendar years.
   * @zh 执行 `addCalendarYears`，用于添加日历年。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @param years - years parameter (`number`) / 年参数（`number`）
   * @returns Result of type `Date` / 类型为 `Date` 的返回值
   */
  override addCalendarYears(date: Date, years: number): Date {
    return this.addCalendarMonths(date, years * 12);
  }

  /**
   * Executes `addCalendarMonths` to handle add calendar months.
   * @zh 执行 `addCalendarMonths`，用于添加日历月。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @param months - months parameter (`number`) / 月参数（`number`）
   * @returns Result of type `Date` / 类型为 `Date` 的返回值
   */
  override addCalendarMonths(date: Date, months: number): Date {
    let newDate = this._createDateWithOverflow(
      this.getYear(date), this.getMonth(date) + months, this.getDate(date), this.getHour(date), this.getMinute(date));

    // It's possible to wind up in the wrong month if the original month has more days than the new
    // month. In this case we want to go to the last day of the desired month.
    // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
    // guarantee this.
    if (this.getMonth(newDate) !== ((this.getMonth(date) + months) % 12 + 12) % 12) {
      newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0, this.getHour(date), this.getMinute(date));
    }

    return newDate;
  }

  /**
   * Executes `addCalendarDays` to handle add calendar days.
   * @zh 执行 `addCalendarDays`，用于添加日历天数。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @param days - days parameter (`number`) / 天数参数（`number`）
   * @returns Result of type `Date` / 类型为 `Date` 的返回值
   */
  override addCalendarDays(date: Date, days: number): Date {
    return this._createDateWithOverflow(
      this.getYear(date), this.getMonth(date), this.getDate(date) + days, this.getHour(date), this.getMinute(date));
  }

  /**
   * Executes `addCalendarHours` to handle add calendar hours.
   * @zh 执行 `addCalendarHours`，用于添加日历小时数。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @param hours - hours parameter (`number`) / 小时数参数（`number`）
   * @returns Result of type `Date` / 类型为 `Date` 的返回值
   */
  addCalendarHours(date: Date, hours: number): Date {
    return this._createDateWithOverflow(
      this.getYear(date), this.getMonth(date), this.getDate(date),
      this.getHour(date) + hours, this.getMinute(date));
  }

  /**
   * Executes `addCalendarMinutes` to handle add calendar minutes.
   * @zh 执行 `addCalendarMinutes`，用于添加日历分钟数。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @param minutes - minutes parameter (`number`) / 分钟数参数（`number`）
   * @returns Result of type `Date` / 类型为 `Date` 的返回值
   */
  addCalendarMinutes(date: Date, minutes: number): Date {
    return this._createDateWithOverflow(
      this.getYear(date), this.getMonth(date), this.getDate(date),
      this.getHour(date), this.getMinute(date) + minutes);
  }

  /**
   * Executes `toIso8601` to handle to iso8601.
   * @zh 执行 `toIso8601`，用于转换为Iso8601。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  override toIso8601(date: Date): string {
    return super.toIso8601(date) + "T" + [
      this._2digit(date.getUTCHours()),
      this._2digit(date.getUTCMinutes())
    ].join(":");
  }

  /**
   * Executes `getDateInNextMonth` to handle get date in next month.
   * @zh 执行 `getDateInNextMonth`，用于获取日期在下一个月。
   * @param date - date parameter (`Date`) / 日期参数（`Date`）
   */
  private getDateInNextMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1,
      date.getHours(), date.getMinutes());
  }

  /**
   * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
   * other browsers do not. We remove them to make output consistent and because they interfere with
   * date parsing.
   * @param str The string to strip direction characters from.
   * @returns The stripped string.

   * @zh 执行 `_stripDirectionalityCharacters`，用于stripDirectionality字符。
   */
  private _stripDirectionalityCharacters(str: string) {
    return str.replace(/[\u200e\u200f]/g, "");
  }

  /**
   * Pads a number to make it two digits.
   * @param n The number to pad.
   * @returns The padded number.

   * @zh 执行 `_2digit`，用于2digit。
   */
  private _2digit(n: number) {
    return ("00" + n).slice(-2);
  }

  /**
   * Creates a date but allows the month and date to overflow.
   * @zh 执行 `_createDateWithOverflow`，用于创建日期带有Overflow。
   */
  private _createDateWithOverflow(year: number, month: number, date: number,
                                  hours: number, minutes: number) {
    const result = new Date(year, month, date, hours, minutes);

    // We need to correct for the fact that JS native Date treats years in range [0, 99] as
    // abbreviations for 19xx.
    if (year >= 0 && year < 100) {
      result.setFullYear(this.getYear(result) - 1900);
    }
    return result;
  }
}
