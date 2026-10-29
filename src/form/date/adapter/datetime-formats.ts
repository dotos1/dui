/**
 * @fileoverview Module `src/form/date/adapter/datetime-formats.ts` providing datetime formats definitions and implementation.
 * @zh 模块文件 `src/form/date/adapter/datetime-formats.ts`，提供日期时间格式列表相关的定义与实现。
 */

import {InjectionToken} from "@angular/core";

/**
 * Interface `MatDatetimeFormats` defining the contract and properties for mat datetime formats.
 * @zh 接口 `MatDatetimeFormats`，定义Material日期时间格式列表的数据结构契约与属性规范。
 */
export interface MatDatetimeFormats {
  /**
   * Property `parse` (`{ dateInput?: any; monthInput?: any; timeInput?: any; datetimeInput?: any; }`) storing parse.
   * @zh 属性 `parse`（类型：`{ dateInput?: any; monthInput?: any; timeInput?: any; datetimeInput?: any; }`），用于存储或配置解析。
   */
  parse: {
    dateInput?;
    monthInput?;
    timeInput?;
    datetimeInput?;
  };
  /**
   * Property `display` (`{…}`) storing display.
   * @zh 属性 `display`（类型：`{…}`），用于存储或配置display。
   */
  display: {
    dateInput;
    monthInput;
    timeInput;
    datetimeInput;
    monthYearLabel;
    dateA11yLabel;
    monthYearA11yLabel;
    popupHeaderDateLabel;
  };
}

/**
 * Angular dependency-injection token `MAT_DATETIME_FORMATS` for providing mat datetime formats.
 * @zh Angular 依赖注入令牌 `MAT_DATETIME_FORMATS`，用于提供与注入Material日期时间格式列表。
 */
export const MAT_DATETIME_FORMATS = new InjectionToken<MatDatetimeFormats>("mat-datetime-formats");
