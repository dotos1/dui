/**
 * @fileoverview Module `src/form/date/adapter/native-datetime-formats.ts` providing native datetime formats definitions and implementation.
 * @zh 模块文件 `src/form/date/adapter/native-datetime-formats.ts`，提供原生日期时间格式列表相关的定义与实现。
 */

import {MatDatetimeFormats} from "./datetime-formats";

/**
 * Constant/variable `MAT_NATIVE_DATETIME_FORMATS` defining mat native datetime formats in `src/form/date/adapter`.
 * @zh 常量/变量 `MAT_NATIVE_DATETIME_FORMATS`，定义 `src/form/date/adapter` 中的Material原生日期时间格式列表。
 */
export const MAT_NATIVE_DATETIME_FORMATS: MatDatetimeFormats = {
  parse: {},
  display: {
    dateInput: {year: "numeric", month: "2-digit", day: "2-digit"},
    monthInput: {month: "long"},
    datetimeInput: {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"},
    timeInput: {hour: "2-digit", minute: "2-digit"},
    monthYearLabel: {year: "numeric", month: "short"},
    dateA11yLabel: {year: "numeric", month: "long", day: "numeric"},
    monthYearA11yLabel: {year: "numeric", month: "long"},
    popupHeaderDateLabel: {weekday: "short", month: "short", day: "2-digit"}
  }
};
