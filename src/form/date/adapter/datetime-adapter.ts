/**
 * @fileoverview Module `src/form/date/adapter/datetime-adapter.ts` providing datetime adapter definitions and implementation.
 * @zh 模块文件 `src/form/date/adapter/datetime-adapter.ts`，提供日期时间适配器相关的定义与实现。
 */

import {DateAdapter} from "@angular/material/core";

/**
 * Class `DatetimeAdapter` encapsulating datetime adapter data structures and logic in `src/form/date/adapter`.
 * @zh 类 `DatetimeAdapter`，封装 `src/form/date/adapter` 中的日期时间适配器数据结构与处理逻辑。
 */
export abstract class DatetimeAdapter<D> extends DateAdapter<D> {

  /**
   * Creates an instance of `DatetimeAdapter` and initializes its dependencies and internal state.
   * @zh 创建 `DatetimeAdapter` 实例，并初始化其依赖项与内部状态。
   * @param _delegate - Injected or initial delegate (`DateAdapter<D, any>`) / 注入或传入的delegate（`DateAdapter<D, any>`）
   */
  constructor(protected _delegate: DateAdapter<D>) {
    super();
  }

  /**
   * Executes `getHour` to handle get hour.
   * @zh 执行 `getHour`，用于获取小时。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  abstract getHour(date: D): number;

  /**
   * Executes `getMinute` to handle get minute.
   * @zh 执行 `getMinute`，用于获取分钟。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  abstract getMinute(date: D): number;

  /**
   * Executes `getFirstDateOfMonth` to handle get first date of month.
   * @zh 执行 `getFirstDateOfMonth`，用于获取首个日期的月。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  abstract getFirstDateOfMonth(date: D): D;

  /**
   * Executes `isInNextMonth` to handle is in next month.
   * @zh 执行 `isInNextMonth`，用于是否为在下一个月。
   * @param startDate - start date parameter (`D`) / 开始日期参数（`D`）
   * @param endDate - end date parameter (`D`) / 结束日期参数（`D`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  abstract isInNextMonth(startDate: D, endDate: D): boolean;

  /**
   * Executes `getHourNames` to handle get hour names.
   * @zh 执行 `getHourNames`，用于获取小时名称列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  abstract getHourNames(): string[];

  /**
   * Executes `getMinuteNames` to handle get minute names.
   * @zh 执行 `getMinuteNames`，用于获取分钟名称列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  abstract getMinuteNames(): string[];

  /**
   * Executes `addCalendarHours` to handle add calendar hours.
   * @zh 执行 `addCalendarHours`，用于添加日历小时数。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @param months - months parameter (`number`) / 月参数（`number`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  abstract addCalendarHours(date: D, months: number): D;

  /**
   * Executes `addCalendarMinutes` to handle add calendar minutes.
   * @zh 执行 `addCalendarMinutes`，用于添加日历分钟数。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @param months - months parameter (`number`) / 月参数（`number`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  abstract addCalendarMinutes(date: D, months: number): D;

  /**
   * Executes `createDatetime` to handle create datetime.
   * @zh 执行 `createDatetime`，用于创建日期时间。
   * @param year - year parameter (`number`) / 年参数（`number`）
   * @param month - month parameter (`number`) / 月参数（`number`）
   * @param date - date parameter (`number`) / 日期参数（`number`）
   * @param hour - hour parameter (`number`) / 小时参数（`number`）
   * @param minute - minute parameter (`number`) / 分钟参数（`number`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  abstract createDatetime(year: number, month: number, date: number, hour: number, minute: number): D;

  /**
   * Executes `getValidDateOrNull` to handle get valid date or null.
   * @zh 执行 `getValidDateOrNull`，用于获取有效日期Or空值。
   * @param obj - obj parameter (`any`) / 对象参数（`any`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  override getValidDateOrNull(obj): D | null {
    return (this.isDateInstance(obj) && this.isValid(obj)) ? obj : null;
  }

  /**
   * Executes `compareDatetime` to handle compare datetime.
   * @zh 执行 `compareDatetime`，用于比较日期时间。
   * @param first - first parameter (`D`) / 首个参数（`D`）
   * @param second - second parameter (`D`) / 秒参数（`D`）
   * @param respectMinutePart - respect minute part parameter (`boolean`) / respect分钟Part参数（`boolean`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  compareDatetime(first: D, second: D, respectMinutePart: boolean = true): number {
    return this.compareDate(first, second) ||
      this.getHour(first) - this.getHour(second) ||
      (respectMinutePart && this.getMinute(first) - this.getMinute(second));
  }

  /**
   * Executes `sameDatetime` to handle same datetime.
   * @zh 执行 `sameDatetime`，用于相同日期时间。
   * @param first - first parameter (`D`) / 首个参数（`D`）
   * @param second - second parameter (`D`) / 秒参数（`D`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  sameDatetime(first: D | null, second: D | null): boolean {
    if (first && second) {
      const firstValid = this.isValid(first);
      const secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !this.compareDatetime(first, second);
      }
      return firstValid === secondValid;
    }
    return first === second;
  }

  /**
   * Executes `sameYear` to handle same year.
   * @zh 执行 `sameYear`，用于相同年。
   * @param first - first parameter (`D`) / 首个参数（`D`）
   * @param second - second parameter (`D`) / 秒参数（`D`）
   */
  sameYear(first: D, second: D) {
    return first && second && this.getYear(first) === this.getYear(second);
  }

  /**
   * Executes `sameDay` to handle same day.
   * @zh 执行 `sameDay`，用于相同日。
   * @param first - first parameter (`D`) / 首个参数（`D`）
   * @param second - second parameter (`D`) / 秒参数（`D`）
   */
  sameDay(first: D, second: D) {
    return first && second && this.getDate(first) === this.getDate(second) && this.sameMonthAndYear(first, second);
  }

  /**
   * Executes `sameHour` to handle same hour.
   * @zh 执行 `sameHour`，用于相同小时。
   * @param first - first parameter (`D`) / 首个参数（`D`）
   * @param second - second parameter (`D`) / 秒参数（`D`）
   */
  sameHour(first: D, second: D) {
    return first && second && this.getHour(first) === this.getHour(second) && this.sameDay(first, second);
  }

  /**
   * Executes `sameMinute` to handle same minute.
   * @zh 执行 `sameMinute`，用于相同分钟。
   * @param first - first parameter (`D`) / 首个参数（`D`）
   * @param second - second parameter (`D`) / 秒参数（`D`）
   */
  sameMinute(first: D, second: D) {
    return first && second && this.getMinute(first) === this.getMinute(second) && this.sameHour(first, second);
  }

  /**
   * Executes `sameMonthAndYear` to handle same month and year.
   * @zh 执行 `sameMonthAndYear`，用于相同月And年。
   * @param first - first parameter (`D`) / 首个参数（`D`）
   * @param second - second parameter (`D`) / 秒参数（`D`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  sameMonthAndYear(first: D | null, second: D | null): boolean {
    if (first && second) {
      const firstValid = this.isValid(first);
      const secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !(this.getYear(first) - this.getYear(second) ||
          this.getMonth(first) - this.getMonth(second));
      }
      return firstValid === secondValid;
    }
    return first === second;
  }

  // delegate
  /**
   * Executes `clone` to handle clone.
   * @zh 执行 `clone`，用于克隆。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  clone(date: D): D {
    return this._delegate.clone(date);
  }

  /**
   * Executes `addCalendarYears` to handle add calendar years.
   * @zh 执行 `addCalendarYears`，用于添加日历年。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @param years - years parameter (`number`) / 年参数（`number`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  addCalendarYears(date: D, years: number): D {
    return this._delegate.addCalendarYears(date, years);
  }

  /**
   * Executes `addCalendarMonths` to handle add calendar months.
   * @zh 执行 `addCalendarMonths`，用于添加日历月。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @param months - months parameter (`number`) / 月参数（`number`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  addCalendarMonths(date: D, months: number): D {
    return this._delegate.addCalendarMonths(date, months);
  }

  /**
   * Executes `addCalendarDays` to handle add calendar days.
   * @zh 执行 `addCalendarDays`，用于添加日历天数。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @param days - days parameter (`number`) / 天数参数（`number`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  addCalendarDays(date: D, days: number): D {
    return this._delegate.addCalendarDays(date, days);
  }

  /**
   * Executes `getYear` to handle get year.
   * @zh 执行 `getYear`，用于获取年。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getYear(date: D): number {
    return this._delegate.getYear(date);
  }

  /**
   * Executes `getMonth` to handle get month.
   * @zh 执行 `getMonth`，用于获取月。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getMonth(date: D): number {
    return this._delegate.getMonth(date);
  }

  /**
   * Executes `getDate` to handle get date.
   * @zh 执行 `getDate`，用于获取日期。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getDate(date: D): number {
    return this._delegate.getDate(date);
  }

  /**
   * Executes `getDayOfWeek` to handle get day of week.
   * @zh 执行 `getDayOfWeek`，用于获取日的周。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getDayOfWeek(date: D): number {
    return this._delegate.getDayOfWeek(date);
  }

  /**
   * Executes `getMonthNames` to handle get month names.
   * @zh 执行 `getMonthNames`，用于获取月名称列表。
   * @param style - style parameter (`any`) / 样式参数（`any`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getMonthNames(style): string[] {
    return this._delegate.getMonthNames(style);
  }

  /**
   * Executes `getDateNames` to handle get date names.
   * @zh 执行 `getDateNames`，用于获取日期名称列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getDateNames(): string[] {
    return this._delegate.getDateNames();
  }

  /**
   * Executes `getDayOfWeekNames` to handle get day of week names.
   * @zh 执行 `getDayOfWeekNames`，用于获取日的周名称列表。
   * @param style - style parameter (`any`) / 样式参数（`any`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getDayOfWeekNames(style): string[] {
    return this._delegate.getDayOfWeekNames(style);
  }

  /**
   * Executes `getYearName` to handle get year name.
   * @zh 执行 `getYearName`，用于获取年名称。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getYearName(date: D): string {
    return this._delegate.getYearName(date);
  }

  /**
   * Executes `getFirstDayOfWeek` to handle get first day of week.
   * @zh 执行 `getFirstDayOfWeek`，用于获取首个日的周。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getFirstDayOfWeek(): number {
    return this._delegate.getFirstDayOfWeek();
  }

  /**
   * Executes `getNumDaysInMonth` to handle get num days in month.
   * @zh 执行 `getNumDaysInMonth`，用于获取数值天数在月。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getNumDaysInMonth(date: D): number {
    return this._delegate.getNumDaysInMonth(date);
  }

  /**
   * Executes `createDate` to handle create date.
   * @zh 执行 `createDate`，用于创建日期。
   * @param year - year parameter (`number`) / 年参数（`number`）
   * @param month - month parameter (`number`) / 月参数（`number`）
   * @param date - date parameter (`number`) / 日期参数（`number`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  createDate(year: number, month: number, date: number): D {
    return this._delegate.createDate(year, month, date);
  }

  /**
   * Executes `today` to handle today.
   * @zh 执行 `today`，用于today。
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  today(): D {
    return this._delegate.today();
  }

  /**
   * Executes `parse` to handle parse.
   * @zh 执行 `parse`，用于解析。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param parseFormat - parse format parameter (`any`) / 解析格式化参数（`any`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  parse(value, parseFormat): D | null {
    return this._delegate.parse(value, parseFormat);
  }

  /**
   * Executes `format` to handle format.
   * @zh 执行 `format`，用于格式化。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @param displayFormat - display format parameter (`any`) / display格式化参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  format(date: D, displayFormat): string {
    return this._delegate.format(date, displayFormat);
  }

  /**
   * Executes `toIso8601` to handle to iso8601.
   * @zh 执行 `toIso8601`，用于转换为Iso8601。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  toIso8601(date: D): string {
    return this._delegate.toIso8601(date);
  }

  /**
   * Executes `isDateInstance` to handle is date instance.
   * @zh 执行 `isDateInstance`，用于是否为日期实例。
   * @param obj - obj parameter (`any`) / 对象参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isDateInstance(obj): boolean {
    return this._delegate.isDateInstance(obj);
  }

  /**
   * Executes `isValid` to handle is valid.
   * @zh 执行 `isValid`，用于是否为有效。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isValid(date: D): boolean {
    return this._delegate.isValid(date);
  }

  /**
   * Executes `invalid` to handle invalid.
   * @zh 执行 `invalid`，用于无效。
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  invalid(): D {
    return this._delegate.invalid();
  }

  /**
   * Executes `clampDate` to handle clamp date.
   * @zh 执行 `clampDate`，用于限制范围日期。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @param min - min parameter (`D`) / 最小值参数（`D`）
   * @param max - max parameter (`D`) / 最大值参数（`D`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  override clampDate(date: D, min?: D | null, max?: D | null): D {
    if (min && this.compareDatetime(date, min) < 0) {
      return min;
    }
    if (max && this.compareDatetime(date, max) > 0) {
      return max;
    }
    return date;
  }
}
