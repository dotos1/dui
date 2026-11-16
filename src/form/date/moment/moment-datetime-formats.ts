/**
 * @fileoverview Module `src/form/date/moment/moment-datetime-formats.ts` providing moment datetime formats definitions and implementation.
 * @zh 模块文件 `src/form/date/moment/moment-datetime-formats.ts`，提供moment日期时间格式列表相关的定义与实现。
 */

import { MatDateFormats } from "@angular/material/core";
import { MatDatetimeFormats } from "@dotos1/dui/form/date/adapter";

/**
 * Constant/variable `MAT_MOMENT_DATETIME_FORMATS` defining mat moment datetime formats in `src/form/date/moment`.
 * @zh 常量/变量 `MAT_MOMENT_DATETIME_FORMATS`，定义 `src/form/date/moment` 中的MaterialMOMENT日期时间格式列表。
 */
export const MAT_MOMENT_DATETIME_FORMATS: MatDatetimeFormats = {
  parse: {
    dateInput: "L",
    monthInput: "MMMM",
    timeInput: "LT",
    datetimeInput: "L LT"
  },
  display: {
    dateInput: "L",
    monthInput: "MMMM",
    datetimeInput: "L LT",
    timeInput: "LT",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
    popupHeaderDateLabel: "ddd, DD MMM"
  }
};
/**
 * Constant/variable `MOMENT_DATE_FORMATS` defining moment date formats in `src/form/date/moment`.
 * @zh 常量/变量 `MOMENT_DATE_FORMATS`，定义 `src/form/date/moment` 中的MOMENT日期格式列表。
 */
export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
      dateInput: 'DD/MM/YYYY'
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM Y',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM Y'
  }
};

/**
 * Constant/variable `dateNames` defining date names in `src/form/date/moment`.
 * @zh 常量/变量 `dateNames`，定义 `src/form/date/moment` 中的日期名称列表。
 */
const dateNames: string[] = [];
for (let date = 1; date <= 31; date++) {
    dateNames.push(String(date));
}
