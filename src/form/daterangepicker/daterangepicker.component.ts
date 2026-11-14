/**
 * @fileoverview Module `src/form/daterangepicker/daterangepicker.component.ts` providing daterangepicker component definitions and implementation.
 * @zh 模块文件 `src/form/daterangepicker/daterangepicker.component.ts`，提供daterangepicker组件相关的定义与实现。
 */

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';
import dayjs, { Dayjs } from 'dayjs/esm';
import localeData from 'dayjs/esm/plugin/localeData';
import LocalizedFormat from 'dayjs/esm/plugin/localizedFormat';
import isoWeek from 'dayjs/esm/plugin/isoWeek';
import week from 'dayjs/esm/plugin/weekOfYear';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import utc from 'dayjs/esm/plugin/utc';

dayjs.extend(localeData);
dayjs.extend(LocalizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(week);
dayjs.extend(customParseFormat);
dayjs.extend(utc);

/**
 * Enumeration `SideEnum` defining supported side enum constants.
 * @zh 枚举 `SideEnum`，定义支持的SideEnum常量集合。
 */
export enum SideEnum {
  /**
   * Enum member `SideEnum.left` = 'left' representing left.
   * @zh 枚举项 `SideEnum.left` = 'left'，表示左侧位置。
   */
  left = 'left',
  /**
   * Enum member `SideEnum.right` = 'right' representing right.
   * @zh 枚举项 `SideEnum.right` = 'right'，表示右侧位置。
   */
  right = 'right'
}

/**
 * Interface `DateRanges` defining the contract and properties for date ranges.
 * @zh 接口 `DateRanges`，定义日期范围列表的数据结构契约与属性规范。
 */
export interface DateRanges {
  [index: string]: [Dayjs, Dayjs];
}

/**
 * Interface `DateRange` defining the contract and properties for date range.
 * @zh 接口 `DateRange`，定义日期范围的数据结构契约与属性规范。
 */
export interface DateRange {
  /**
   * Property `label` (`string`) storing label.
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签。
   */
  label: string;
  /**
   * Property `dates` (`[dayjs.Dayjs, dayjs.Dayjs]`) storing dates.
   * @zh 属性 `dates`（类型：`[dayjs.Dayjs, dayjs.Dayjs]`），用于存储或配置日期。
   */
  dates: [Dayjs, Dayjs];
}

/**
 * Interface `ChosenDate` defining the contract and properties for chosen date.
 * @zh 接口 `ChosenDate`，定义Chosen日期的数据结构契约与属性规范。
 */
export interface ChosenDate {
  /**
   * Property `chosenLabel` (`string`) storing chosen label.
   * @zh 属性 `chosenLabel`（类型：`string`），用于存储或配置chosen标签。
   */
  chosenLabel: string;
  /**
   * Property `startDate` (`dayjs.Dayjs`) storing start date.
   * @zh 属性 `startDate`（类型：`dayjs.Dayjs`），用于存储或配置开始日期。
   */
  startDate: Dayjs;
  /**
   * Property `endDate` (`dayjs.Dayjs`) storing end date.
   * @zh 属性 `endDate`（类型：`dayjs.Dayjs`），用于存储或配置结束日期。
   */
  endDate: Dayjs;
}

/**
 * Interface `TimePeriod` defining the contract and properties for time period.
 * @zh 接口 `TimePeriod`，定义时间Period的数据结构契约与属性规范。
 */
export interface TimePeriod {
  [index: string]: Dayjs;

  /**
   * Property `startDate` (`dayjs.Dayjs`) storing start date.
   * @zh 属性 `startDate`（类型：`dayjs.Dayjs`），用于存储或配置开始日期。
   */
  startDate: Dayjs;
  /**
   * Property `endDate` (`dayjs.Dayjs`) storing end date.
   * @zh 属性 `endDate`（类型：`dayjs.Dayjs`），用于存储或配置结束日期。
   */
  endDate: Dayjs;
}

/**
 * Interface `StartDate` defining the contract and properties for start date.
 * @zh 接口 `StartDate`，定义开始日期的数据结构契约与属性规范。
 */
export interface StartDate {
  /**
   * Property `startDate` (`dayjs.Dayjs`) storing start date.
   * @zh 属性 `startDate`（类型：`dayjs.Dayjs`），用于存储或配置开始日期。
   */
  startDate: Dayjs;
}

/**
 * Interface `EndDate` defining the contract and properties for end date.
 * @zh 接口 `EndDate`，定义结束日期的数据结构契约与属性规范。
 */
export interface EndDate {
  /**
   * Property `endDate` (`dayjs.Dayjs`) storing end date.
   * @zh 属性 `endDate`（类型：`dayjs.Dayjs`），用于存储或配置结束日期。
   */
  endDate: Dayjs;
}

/**
 * Interface `TimePickerVariables` defining the contract and properties for time picker variables.
 * @zh 接口 `TimePickerVariables`，定义时间选择器Variables的数据结构契约与属性规范。
 */
interface TimePickerVariables {
  /**
   * Property `secondsLabel` (`string[]`) storing seconds label.
   * @zh 属性 `secondsLabel`（类型：`string[]`），用于存储或配置秒数标签。
   */
  secondsLabel: string[];
  /**
   * Property `selectedMinute` (`number`) storing selected minute.
   * @zh 属性 `selectedMinute`（类型：`number`），用于存储或配置已选中分钟。
   */
  selectedMinute: number;
  /**
   * Property `selectedSecond` (`number`) storing selected second.
   * @zh 属性 `selectedSecond`（类型：`number`），用于存储或配置已选中秒。
   */
  selectedSecond: number;
  /**
   * Property `hours` (`number[]`) storing hours.
   * @zh 属性 `hours`（类型：`number[]`），用于存储或配置小时数。
   */
  hours: number[];
  /**
   * Property `seconds` (`number[]`) storing seconds.
   * @zh 属性 `seconds`（类型：`number[]`），用于存储或配置秒数。
   */
  seconds: number[];
  /**
   * Property `disabledHours` (`number[]`) storing disabled hours.
   * @zh 属性 `disabledHours`（类型：`number[]`），用于存储或配置已禁用小时数。
   */
  disabledHours: number[];
  /**
   * Property `disabledMinutes` (`number[]`) storing disabled minutes.
   * @zh 属性 `disabledMinutes`（类型：`number[]`），用于存储或配置已禁用分钟数。
   */
  disabledMinutes: number[];
  /**
   * Property `minutes` (`number[]`) storing minutes.
   * @zh 属性 `minutes`（类型：`number[]`），用于存储或配置分钟数。
   */
  minutes: number[];
  /**
   * Property `minutesLabel` (`string[]`) storing minutes label.
   * @zh 属性 `minutesLabel`（类型：`string[]`），用于存储或配置分钟数标签。
   */
  minutesLabel: string[];
  /**
   * Property `selectedHour` (`number`) storing selected hour.
   * @zh 属性 `selectedHour`（类型：`number`），用于存储或配置已选中小时。
   */
  selectedHour: number;
  /**
   * Property `disabledSeconds` (`number[]`) storing disabled seconds.
   * @zh 属性 `disabledSeconds`（类型：`number[]`），用于存储或配置已禁用秒数。
   */
  disabledSeconds: number[];
  /**
   * Property `amDisabled` (`boolean`) storing am disabled.
   * @zh 属性 `amDisabled`（类型：`boolean`），用于存储或配置am已禁用。
   */
  amDisabled?: boolean;
  /**
   * Property `pmDisabled` (`boolean`) storing pm disabled.
   * @zh 属性 `pmDisabled`（类型：`boolean`），用于存储或配置pm已禁用。
   */
  pmDisabled?: boolean;
  /**
   * Property `ampmModel` (`string`) storing ampm model.
   * @zh 属性 `ampmModel`（类型：`string`），用于存储或配置ampm模型。
   */
  ampmModel?: string;
  /**
   * Property `selected` (`dayjs.Dayjs`) storing selected.
   * @zh 属性 `selected`（类型：`dayjs.Dayjs`），用于存储或配置已选中。
   */
  selected: Dayjs;
}

/**
 * Interface `TimePickerVariablesHolder` defining the contract and properties for time picker variables holder.
 * @zh 接口 `TimePickerVariablesHolder`，定义时间选择器VariablesHolder的数据结构契约与属性规范。
 */
interface TimePickerVariablesHolder {
  [index: string]: TimePickerVariables;
}

/**
 * Interface `CalendarRowClasses` defining the contract and properties for calendar row classes.
 * @zh 接口 `CalendarRowClasses`，定义日历行类名集合的数据结构契约与属性规范。
 */
interface CalendarRowClasses {
  [index: number]: string;

  /**
   * Property `classList` (`string`) storing class list.
   * @zh 属性 `classList`（类型：`string`），用于存储或配置类名列表。
   */
  classList: string;
}

/**
 * Interface `CalendarClasses` defining the contract and properties for calendar classes.
 * @zh 接口 `CalendarClasses`，定义日历类名集合的数据结构契约与属性规范。
 */
interface CalendarClasses {
  [index: number]: CalendarRowClasses;
}

/**
 * Interface `Dropdowns` defining the contract and properties for dropdowns.
 * @zh 接口 `Dropdowns`，定义下拉框的数据结构契约与属性规范。
 */
interface Dropdowns {
  /**
   * Property `inMaxYear` (`boolean`) storing in max year.
   * @zh 属性 `inMaxYear`（类型：`boolean`），用于存储或配置在最大值年。
   */
  inMaxYear: boolean;
  /**
   * Property `yearArrays` (`number[]`) storing year arrays.
   * @zh 属性 `yearArrays`（类型：`number[]`），用于存储或配置年数组。
   */
  yearArrays: number[];
  /**
   * Property `maxYear` (`number`) storing max year.
   * @zh 属性 `maxYear`（类型：`number`），用于存储或配置最大值年。
   */
  maxYear: number;
  /**
   * Property `minYear` (`number`) storing min year.
   * @zh 属性 `minYear`（类型：`number`），用于存储或配置最小值年。
   */
  minYear: number;
  /**
   * Property `currentMonth` (`number`) storing current month.
   * @zh 属性 `currentMonth`（类型：`number`），用于存储或配置当前月。
   */
  currentMonth: number;
  /**
   * Property `inMinYear` (`boolean`) storing in min year.
   * @zh 属性 `inMinYear`（类型：`boolean`），用于存储或配置在最小值年。
   */
  inMinYear: boolean;
  /**
   * Property `monthArrays` (`number[]`) storing month arrays.
   * @zh 属性 `monthArrays`（类型：`number[]`），用于存储或配置月数组。
   */
  monthArrays: number[];
  /**
   * Property `currentYear` (`number`) storing current year.
   * @zh 属性 `currentYear`（类型：`number`），用于存储或配置当前年。
   */
  currentYear: number;
}

/**
 * Type alias `CalendarArrayWithProps` representing calendar array with props (`T[] & { firstDay?: Dayjs; lastDay?: Dayjs }`).
 * @zh 类型别名 `CalendarArrayWithProps`，表示日历数组带有属性集合（`T[] & { firstDay?: Dayjs; lastDay?: Dayjs }`）。
 */
type CalendarArrayWithProps<T> = T[] & { firstDay?: Dayjs; lastDay?: Dayjs };

/**
 * Interface `CalendarVariables` defining the contract and properties for calendar variables.
 * @zh 接口 `CalendarVariables`，定义日历Variables的数据结构契约与属性规范。
 */
interface CalendarVariables {
  /**
   * Property `calRows` (`number[]`) storing cal rows.
   * @zh 属性 `calRows`（类型：`number[]`），用于存储或配置cal行列表。
   */
  calRows: number[];
  /**
   * Property `calCols` (`number[]`) storing cal cols.
   * @zh 属性 `calCols`（类型：`number[]`），用于存储或配置cal列列表。
   */
  calCols: number[];
  /**
   * Property `calendar` (`CalendarArrayWithProps<dayjs.Dayjs[]>`) storing calendar.
   * @zh 属性 `calendar`（类型：`CalendarArrayWithProps<dayjs.Dayjs[]>`），用于存储或配置日历。
   */
  calendar: CalendarArrayWithProps<Dayjs[]>;
  /**
   * Property `minDate` (`dayjs.Dayjs`) storing min date.
   * @zh 属性 `minDate`（类型：`dayjs.Dayjs`），用于存储或配置最小值日期。
   */
  minDate: dayjs.Dayjs;
  /**
   * Property `year` (`number`) storing year.
   * @zh 属性 `year`（类型：`number`），用于存储或配置年。
   */
  year: number;
  /**
   * Property `classes` (`CalendarClasses`) storing classes.
   * @zh 属性 `classes`（类型：`CalendarClasses`），用于存储或配置类名集合。
   */
  classes: CalendarClasses;
  /**
   * Property `lastMonth` (`number`) storing last month.
   * @zh 属性 `lastMonth`（类型：`number`），用于存储或配置末尾月。
   */
  lastMonth: number;
  /**
   * Property `minute` (`number`) storing minute.
   * @zh 属性 `minute`（类型：`number`），用于存储或配置分钟。
   */
  minute: number;
  /**
   * Property `second` (`number`) storing second.
   * @zh 属性 `second`（类型：`number`），用于存储或配置秒。
   */
  second: number;
  /**
   * Property `daysInMonth` (`number`) storing days in month.
   * @zh 属性 `daysInMonth`（类型：`number`），用于存储或配置天数在月。
   */
  daysInMonth: number;
  /**
   * Property `dayOfWeek` (`number`) storing day of week.
   * @zh 属性 `dayOfWeek`（类型：`number`），用于存储或配置日的周。
   */
  dayOfWeek: number;
  /**
   * Property `month` (`number`) storing month.
   * @zh 属性 `month`（类型：`number`），用于存储或配置月。
   */
  month: number;
  /**
   * Property `hour` (`number`) storing hour.
   * @zh 属性 `hour`（类型：`number`），用于存储或配置小时。
   */
  hour: number;
  /**
   * Property `firstDay` (`dayjs.Dayjs`) storing first day.
   * @zh 属性 `firstDay`（类型：`dayjs.Dayjs`），用于存储或配置首个日。
   */
  firstDay: dayjs.Dayjs;
  /**
   * Property `lastYear` (`number`) storing last year.
   * @zh 属性 `lastYear`（类型：`number`），用于存储或配置末尾年。
   */
  lastYear: number;
  /**
   * Property `lastDay` (`dayjs.Dayjs`) storing last day.
   * @zh 属性 `lastDay`（类型：`dayjs.Dayjs`），用于存储或配置末尾日。
   */
  lastDay: dayjs.Dayjs;
  /**
   * Property `maxDate` (`dayjs.Dayjs`) storing max date.
   * @zh 属性 `maxDate`（类型：`dayjs.Dayjs`），用于存储或配置最大值日期。
   */
  maxDate: dayjs.Dayjs;
  /**
   * Property `daysInLastMonth` (`number`) storing days in last month.
   * @zh 属性 `daysInLastMonth`（类型：`number`），用于存储或配置天数在末尾月。
   */
  daysInLastMonth: number;
  /**
   * Property `dropdowns` (`Dropdowns`) storing dropdowns.
   * @zh 属性 `dropdowns`（类型：`Dropdowns`），用于存储或配置下拉框。
   */
  dropdowns?: Dropdowns;
}

/**
 * Interface `CalendarVariableHolder` defining the contract and properties for calendar variable holder.
 * @zh 接口 `CalendarVariableHolder`，定义日历VariableHolder的数据结构契约与属性规范。
 */
interface CalendarVariableHolder {
  [index: string]: CalendarVariables;
}

/**
 * Interface `VisibleCalendar` defining the contract and properties for visible calendar.
 * @zh 接口 `VisibleCalendar`，定义可见日历的数据结构契约与属性规范。
 */
interface VisibleCalendar {
  /**
   * Property `month` (`dayjs.Dayjs`) storing month.
   * @zh 属性 `month`（类型：`dayjs.Dayjs`），用于存储或配置月。
   */
  month: Dayjs;
  /**
   * Property `calendar` (`CalendarArrayWithProps<dayjs.Dayjs[]>`) storing calendar.
   * @zh 属性 `calendar`（类型：`CalendarArrayWithProps<dayjs.Dayjs[]>`），用于存储或配置日历。
   */
  calendar: CalendarArrayWithProps<Dayjs[]>;
}

/**
 * Angular component `DaterangepickerComponent` (selector: 'ngx-daterangepicker-material') providing daterangepicker component presentation and interaction in `src/form/daterangepicker`.
 * @zh Angular 组件 `DaterangepickerComponent`（selector: 'ngx-daterangepicker-material'），提供Daterangepicker组件的视图渲染与交互逻辑（位于 `src/form/daterangepicker`）。
 */
@Component({
  selector: 'ngx-daterangepicker-material',
  styleUrls: ['./daterangepicker.component.scss'],
  templateUrl: './daterangepicker.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaterangepickerComponent),
      multi: true
    }
  ],
  standalone: false
})
export class DaterangepickerComponent implements OnInit, OnChanges {
  /**
   * Input property `initialDates` (`[string | dayjs.Dayjs, string | dayjs.Dayjs]`) configuring initial dates (default: `null`).
   * @zh 输入属性 `initialDates`（类型：`[string | dayjs.Dayjs, string | dayjs.Dayjs]`），用于配置初始日期（默认值：`null`）。
   */
  @Input()
  initialDates: [string | Dayjs, string | Dayjs] = null;

  /**
   * Input property `startDate` (`dayjs.Dayjs`) configuring start date (default: `dayjs().utc(true).startOf('day')`).
   * @zh 输入属性 `startDate`（类型：`dayjs.Dayjs`），用于配置开始日期（默认值：`dayjs().utc(true).startOf('day')`）。
   */
  @Input()
  startDate = dayjs().utc(true).startOf('day');

  /**
   * Input property `endDate` (`dayjs.Dayjs`) configuring end date (default: `dayjs().utc(true).endOf('day')`).
   * @zh 输入属性 `endDate`（类型：`dayjs.Dayjs`），用于配置结束日期（默认值：`dayjs().utc(true).endOf('day')`）。
   */
  @Input()
  endDate = dayjs().utc(true).endOf('day');

  /**
   * Input property `dateLimit` (`number`) configuring date limit (default: `null`).
   * @zh 输入属性 `dateLimit`（类型：`number`），用于配置日期限制（默认值：`null`）。
   */
  @Input()
  dateLimit: number = null;

  // general
  /**
   * Input property `autoApply` (`boolean`) configuring auto apply (default: `false`).
   * @zh 输入属性 `autoApply`（类型：`boolean`），用于配置自动应用（默认值：`false`）。
   */
  @Input()
  autoApply = false;

  /**
   * Input property `singleDatePicker` (`boolean`) configuring single date picker (default: `false`).
   * @zh 输入属性 `singleDatePicker`（类型：`boolean`），用于配置单个日期选择器（默认值：`false`）。
   */
  @Input()
  singleDatePicker = false;

  /**
   * Input property `showDropdowns` (`boolean`) configuring show dropdowns (default: `false`).
   * @zh 输入属性 `showDropdowns`（类型：`boolean`），用于配置显示下拉框（默认值：`false`）。
   */
  @Input()
  showDropdowns = false;

  /**
   * Input property `showWeekNumbers` (`boolean`) configuring show week numbers (default: `false`).
   * @zh 输入属性 `showWeekNumbers`（类型：`boolean`），用于配置显示周数字（默认值：`false`）。
   */
  @Input()
  showWeekNumbers = false;

  /**
   * Input property `showISOWeekNumbers` (`boolean`) configuring show iso week numbers (default: `false`).
   * @zh 输入属性 `showISOWeekNumbers`（类型：`boolean`），用于配置显示ISO周数字（默认值：`false`）。
   */
  @Input()
  showISOWeekNumbers = false;

  /**
   * Input property `linkedCalendars` (`boolean`) configuring linked calendars (default: `false`).
   * @zh 输入属性 `linkedCalendars`（类型：`boolean`），用于配置已链接日历（默认值：`false`）。
   */
  @Input()
  linkedCalendars = false;

  /**
   * Input property `autoUpdateInput` (`boolean`) configuring auto update input (default: `true`).
   * @zh 输入属性 `autoUpdateInput`（类型：`boolean`），用于配置自动更新输入属性（默认值：`true`）。
   */
  @Input()
  autoUpdateInput = true;

  /**
   * Input property `alwaysShowCalendars` (`boolean`) configuring always show calendars (default: `false`).
   * @zh 输入属性 `alwaysShowCalendars`（类型：`boolean`），用于配置always显示日历（默认值：`false`）。
   */
  @Input()
  alwaysShowCalendars = false;

  /**
   * Input property `maxSpan` (`boolean`) configuring max span (default: `false`).
   * @zh 输入属性 `maxSpan`（类型：`boolean`），用于配置最大值Span（默认值：`false`）。
   */
  @Input()
  maxSpan = false;

  /**
   * Input property `lockStartDate` (`boolean`) configuring lock start date (default: `false`).
   * @zh 输入属性 `lockStartDate`（类型：`boolean`），用于配置锁定开始日期（默认值：`false`）。
   */
  @Input()
  lockStartDate = false;

  // timepicker variables
  /**
   * Input property `timePicker` (`boolean`) configuring time picker (default: `false`).
   * @zh 输入属性 `timePicker`（类型：`boolean`），用于配置时间选择器（默认值：`false`）。
   */
  @Input()
  timePicker = false;

  /**
   * Input property `timePicker24Hour` (`boolean`) configuring time picker24 hour (default: `false`).
   * @zh 输入属性 `timePicker24Hour`（类型：`boolean`），用于配置时间Picker24小时（默认值：`false`）。
   */
  @Input()
  timePicker24Hour = false;

  /**
   * Input property `timePickerIncrement` (`number`) configuring time picker increment (default: `1`).
   * @zh 输入属性 `timePickerIncrement`（类型：`number`），用于配置时间选择器Increment（默认值：`1`）。
   */
  @Input()
  timePickerIncrement = 1;

  /**
   * Input property `timePickerSeconds` (`boolean`) configuring time picker seconds (default: `false`).
   * @zh 输入属性 `timePickerSeconds`（类型：`boolean`），用于配置时间选择器秒数（默认值：`false`）。
   */
  @Input()
  timePickerSeconds = false;

  // end of timepicker variables
  /**
   * Input property `showClearButton` (`boolean`) configuring show clear button (default: `false`).
   * @zh 输入属性 `showClearButton`（类型：`boolean`），用于配置显示清空按钮（默认值：`false`）。
   */
  @Input()
  showClearButton = false;

  /**
   * Input property `firstMonthDayClass` (`string`) configuring first month day class (default: `null`).
   * @zh 输入属性 `firstMonthDayClass`（类型：`string`），用于配置首个月日类名（默认值：`null`）。
   */
  @Input()
  firstMonthDayClass: string = null;

  /**
   * Input property `lastMonthDayClass` (`string`) configuring last month day class (default: `null`).
   * @zh 输入属性 `lastMonthDayClass`（类型：`string`），用于配置末尾月日类名（默认值：`null`）。
   */
  @Input()
  lastMonthDayClass: string = null;

  /**
   * Input property `emptyWeekRowClass` (`string`) configuring empty week row class (default: `null`).
   * @zh 输入属性 `emptyWeekRowClass`（类型：`string`），用于配置空周行类名（默认值：`null`）。
   */
  @Input()
  emptyWeekRowClass: string = null;

  /**
   * Input property `emptyWeekColumnClass` (`string`) configuring empty week column class (default: `null`).
   * @zh 输入属性 `emptyWeekColumnClass`（类型：`string`），用于配置空周列类名（默认值：`null`）。
   */
  @Input()
  emptyWeekColumnClass: string = null;

  /**
   * Input property `firstDayOfNextMonthClass` (`string`) configuring first day of next month class (default: `null`).
   * @zh 输入属性 `firstDayOfNextMonthClass`（类型：`string`），用于配置首个日的下一个月类名（默认值：`null`）。
   */
  @Input()
  firstDayOfNextMonthClass: string = null;

  /**
   * Input property `lastDayOfPreviousMonthClass` (`string`) configuring last day of previous month class (default: `null`).
   * @zh 输入属性 `lastDayOfPreviousMonthClass`（类型：`string`），用于配置末尾日的上一个月类名（默认值：`null`）。
   */
  @Input()
  lastDayOfPreviousMonthClass: string = null;

  /**
   * Input property `showCustomRangeLabel` (`boolean`) configuring show custom range label.
   * @zh 输入属性 `showCustomRangeLabel`（类型：`boolean`），用于配置显示自定义范围标签。
   */
  @Input()
  showCustomRangeLabel: boolean;

  /**
   * Input property `showCancel` (`boolean`) configuring show cancel (default: `false`).
   * @zh 输入属性 `showCancel`（类型：`boolean`），用于配置显示取消（默认值：`false`）。
   */
  @Input()
  showCancel = false;

  /**
   * Input property `keepCalendarOpeningWithRange` (`boolean`) configuring keep calendar opening with range (default: `false`).
   * @zh 输入属性 `keepCalendarOpeningWithRange`（类型：`boolean`），用于配置keep日历打开带有范围（默认值：`false`）。
   */
  @Input()
  keepCalendarOpeningWithRange = false;

  /**
   * Input property `showRangeLabelOnInput` (`boolean`) configuring show range label on input (default: `false`).
   * @zh 输入属性 `showRangeLabelOnInput`（类型：`boolean`），用于配置显示范围标签当输入属性（默认值：`false`）。
   */
  @Input()
  showRangeLabelOnInput = false;

  /**
   * Input property `customRangeDirection` (`boolean`) configuring custom range direction (default: `false`).
   * @zh 输入属性 `customRangeDirection`（类型：`boolean`），用于配置自定义范围方向（默认值：`false`）。
   */
  @Input()
  customRangeDirection = false;

  /**
   * Input property `drops` (`string`) configuring drops.
   * @zh 输入属性 `drops`（类型：`string`），用于配置放置。
   */
  @Input() drops: string;
  /**
   * Input property `opens` (`string`) configuring opens.
   * @zh 输入属性 `opens`（类型：`string`），用于配置打开。
   */
  @Input() opens: string;
  /**
   * Input property `closeOnAutoApply` (`boolean`) configuring close on auto apply (default: `true`).
   * @zh 输入属性 `closeOnAutoApply`（类型：`boolean`），用于配置关闭当自动应用（默认值：`true`）。
   */
  @Input() closeOnAutoApply = true;
  /**
   * Output event emitter `choosedDate` (`EventEmitter<ChosenDate>`) firing when choosed date occurs.
   * @zh 输出事件 `choosedDate`（类型：`EventEmitter<ChosenDate>`），当触发choosed日期时向外发出事件。
   */
  @Output() choosedDate: EventEmitter<ChosenDate>;
  /**
   * Output event emitter `rangeClicked` (`EventEmitter<DateRange>`) firing when range clicked occurs.
   * @zh 输出事件 `rangeClicked`（类型：`EventEmitter<DateRange>`），当触发范围点击时向外发出事件。
   */
  @Output() rangeClicked: EventEmitter<DateRange>;
  /**
   * Output event emitter `datesUpdated` (`EventEmitter<TimePeriod>`) firing when dates updated occurs.
   * @zh 输出事件 `datesUpdated`（类型：`EventEmitter<TimePeriod>`），当触发日期已更新时向外发出事件。
   */
  @Output() datesUpdated: EventEmitter<TimePeriod>;
  /**
   * Output event emitter `startDateChanged` (`EventEmitter<StartDate>`) firing when start date changed occurs.
   * @zh 输出事件 `startDateChanged`（类型：`EventEmitter<StartDate>`），当触发开始日期已变更时向外发出事件。
   */
  @Output() startDateChanged: EventEmitter<StartDate>;
  /**
   * Output event emitter `endDateChanged` (`EventEmitter<EndDate>`) firing when end date changed occurs.
   * @zh 输出事件 `endDateChanged`（类型：`EventEmitter<EndDate>`），当触发结束日期已变更时向外发出事件。
   */
  @Output() endDateChanged: EventEmitter<EndDate>;
  /**
   * Output event emitter `cancelClicked` (`EventEmitter<void>`) firing when cancel clicked occurs.
   * @zh 输出事件 `cancelClicked`（类型：`EventEmitter<void>`），当触发取消点击时向外发出事件。
   */
  @Output() cancelClicked: EventEmitter<void>;
  /**
   * Output event emitter `clearClicked` (`EventEmitter<void>`) firing when clear clicked occurs.
   * @zh 输出事件 `clearClicked`（类型：`EventEmitter<void>`），当触发清空点击时向外发出事件。
   */
  @Output() clearClicked: EventEmitter<void>;
  /**
   * Template/content query reference `pickerContainer` (`ElementRef<any>`) targeting picker container.
   * @zh 模板/内容视图查询引用 `pickerContainer`（`@ViewChild`），指向选择器容器。
   */
  @ViewChild('pickerContainer', { static: true }) pickerContainer: ElementRef;

  /**
   * Property `chosenLabel` (`string`) storing chosen label.
   * @zh 属性 `chosenLabel`（类型：`string`），用于存储或配置chosen标签。
   */
  public chosenLabel: string;

  /**
   * Property `calendarVariables` (`CalendarVariableHolder`) storing calendar variables (default: `{}`).
   * @zh 属性 `calendarVariables`（类型：`CalendarVariableHolder`），用于存储或配置日历Variables（默认值：`{}`）。
   */
  public calendarVariables: CalendarVariableHolder = {};
  // tooltiptext = []; // for storing tooltiptext
  /**
   * Property `timepickerVariables` (`TimePickerVariablesHolder`) storing timepicker variables (default: `{}`).
   * @zh 属性 `timepickerVariables`（类型：`TimePickerVariablesHolder`），用于存储或配置timepickerVariables（默认值：`{}`）。
   */
  public timepickerVariables: TimePickerVariablesHolder = {};
  /**
   * Property `daterangepicker` (`{ start: FormControl; end: FormControl; }`) storing daterangepicker.
   * @zh 属性 `daterangepicker`（类型：`{ start: FormControl; end: FormControl; }`），用于存储或配置daterangepicker。
   */
  daterangepicker: { start: FormControl; end: FormControl } = { start: new FormControl(), end: new FormControl() };

  /**
   * Property `applyBtn` (`{ disabled: boolean; }`) storing apply btn (default: `{ disabled: false }`).
   * @zh 属性 `applyBtn`（类型：`{ disabled: boolean; }`），用于存储或配置应用按钮（默认值：`{ disabled: false }`）。
   */
  public applyBtn: { disabled: boolean } = { disabled: false };

  // used in template for compile time support of enum values.
  /**
   * Property `sideEnum` (`typeof SideEnum`) storing side enum (default: `SideEnum`).
   * @zh 属性 `sideEnum`（类型：`typeof SideEnum`），用于存储或配置sideEnum（默认值：`SideEnum`）。
   */
  public sideEnum = SideEnum;
  /**
   * Property `chosenRange` (`string`) storing chosen range.
   * @zh 属性 `chosenRange`（类型：`string`），用于存储或配置chosen范围。
   */
  public chosenRange: string;

  /**
   * Property `rangesArray` (`string[]`) storing ranges array (default: `[]`).
   * @zh 属性 `rangesArray`（类型：`string[]`），用于存储或配置范围列表数组（默认值：`[]`）。
   */
  public rangesArray: Array<string> = [];
  // some state information

  /**
   * Property `isShown` (`boolean`) storing is shown (default: `false`).
   * @zh 属性 `isShown`（类型：`boolean`），用于存储或配置是否为已显示（默认值：`false`）。
   */
  public isShown = false;
  /**
   * Property `inline` (`boolean`) storing inline (default: `true`).
   * @zh 属性 `inline`（类型：`boolean`），用于存储或配置inline（默认值：`true`）。
   */
  public inline = true;
  /**
   * Property `leftCalendar` (`VisibleCalendar`) storing left calendar (default: `{ month: null, calendar: [] }`).
   * @zh 属性 `leftCalendar`（类型：`VisibleCalendar`），用于存储或配置左侧位置日历（默认值：`{ month: null, calendar: [] }`）。
   */
  leftCalendar: VisibleCalendar = { month: null, calendar: [] };
  /**
   * Property `rightCalendar` (`VisibleCalendar`) storing right calendar (default: `{ month: null, calendar: [] }`).
   * @zh 属性 `rightCalendar`（类型：`VisibleCalendar`），用于存储或配置右侧位置日历（默认值：`{ month: null, calendar: [] }`）。
   */
  rightCalendar: VisibleCalendar = { month: null, calendar: [] };
  /**
   * Property `showCalInRanges` (`boolean`) storing show cal in ranges (default: `false`).
   * @zh 属性 `showCalInRanges`（类型：`boolean`），用于存储或配置显示Cal在范围列表（默认值：`false`）。
   */
  public showCalInRanges = false;
  /**
   * Property `nowHoveredDate` (`any`) storing now hovered date (default: `null`).
   * @zh 属性 `nowHoveredDate`（类型：`any`），用于存储或配置当前时间悬停日期（默认值：`null`）。
   */
  nowHoveredDate = null;
  /**
   * Property `pickingDate` (`boolean`) storing picking date (default: `false`).
   * @zh 属性 `pickingDate`（类型：`boolean`），用于存储或配置picking日期（默认值：`false`）。
   */
  pickingDate = false;
  // options: any = {}; // should get some opt from user
  // protected

  /**
   * Property `minDateHolder` (`dayjs.Dayjs`) storing min date holder.
   * @zh 属性 `minDateHolder`（类型：`dayjs.Dayjs`），用于存储或配置最小值日期Holder。
   */
  protected minDateHolder: dayjs.Dayjs;
  /**
   * Property `maxDateHolder` (`dayjs.Dayjs`) storing max date holder.
   * @zh 属性 `maxDateHolder`（类型：`dayjs.Dayjs`），用于存储或配置最大值日期Holder。
   */
  protected maxDateHolder: dayjs.Dayjs;
  /**
   * Property `localeHolder` (`LocaleConfig`) storing locale holder (default: `{}`).
   * @zh 属性 `localeHolder`（类型：`LocaleConfig`），用于存储或配置语言区域Holder（默认值：`{}`）。
   */
  protected localeHolder: LocaleConfig = {};
  /**
   * Property `rangesHolder` (`DateRanges`) storing ranges holder (default: `{}`).
   * @zh 属性 `rangesHolder`（类型：`DateRanges`），用于存储或配置范围列表Holder（默认值：`{}`）。
   */
  protected rangesHolder: DateRanges = {};
  /**
   * Property `cachedVersion` (`{ start: Dayjs; end: Dayjs; }`) storing cached version (default: `{ start: null, end: null }`).
   * @zh 属性 `cachedVersion`（类型：`{ start: Dayjs; end: Dayjs; }`），用于存储或配置已缓存Version（默认值：`{ start: null, end: null }`）。
   */
  private cachedVersion: { start: Dayjs; end: Dayjs } = { start: null, end: null };

  /**
   * Creates an instance of `DaterangepickerComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DaterangepickerComponent` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param ref - Injected or initial ref (`ChangeDetectorRef`) / 注入或传入的引用（`ChangeDetectorRef`）
   * @param localeHolderService - Injected or initial locale holder service (`LocaleService`) / 注入或传入的语言区域Holder服务（`LocaleService`）
   */
  constructor(private el: ElementRef, private ref: ChangeDetectorRef, private localeHolderService: LocaleService) {
    this.choosedDate = new EventEmitter();
    this.rangeClicked = new EventEmitter();
    this.datesUpdated = new EventEmitter();
    this.startDateChanged = new EventEmitter();
    this.endDateChanged = new EventEmitter();
    this.cancelClicked = new EventEmitter();
    this.clearClicked = new EventEmitter();
  }

  // accessors
  /**
   * Gets the current min date (`minDate: dayjs.Dayjs`).
   * @zh 获取当前最小值日期（`minDate: dayjs.Dayjs`）。
   */
  get minDate(): dayjs.Dayjs {
    return this.minDateHolder;
  }

  /**
   * Input setter `minDate` updating min date.
   * @zh 输入属性 `minDate` 的设置器，用于更新最小值日期。
   * @param value - New min date value (`string | dayjs.Dayjs`) / 新的最小值日期值（`string | dayjs.Dayjs`）
   */
  @Input()
  set minDate(value: dayjs.Dayjs | string) {
    if (dayjs.isDayjs(value)) {
      this.minDateHolder = value;
    } else if (typeof value === 'string') {
      this.minDateHolder = dayjs(value).utc(true);
    } else {
      this.minDateHolder = null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  /**
   * Gets the current locale (`locale: LocaleConfig`).
   * @zh 获取当前语言区域（`locale: LocaleConfig`）。
   */
  get locale(): LocaleConfig {
    return this.localeHolder;
  }

  /**
   * Input setter `locale` updating locale.
   * @zh 输入属性 `locale` 的设置器，用于更新语言区域。
   * @param value - New locale value (`LocaleConfig`) / 新的语言区域值（`LocaleConfig`）
   */
  @Input() set locale(value: LocaleConfig) {
    this.localeHolder = { ...this.localeHolderService.config, ...value };

    if (value.locale) {
      const tempValue = { ...value }; // make copy of value
      // remove fields being applied from value.locale
      delete tempValue.daysOfWeek;
      delete tempValue.monthNames;
      delete tempValue.firstDay;

      // combine config with locale and customized LocaleConfig
      this.localeHolder = { ...this.localeHolderService.configWithLocale(value.locale), ...tempValue };
    }
  }

  // custom ranges
  // eslint-disable-next-line @typescript-eslint/member-ordering
  /**
   * Gets the current ranges (`ranges: DateRanges`).
   * @zh 获取当前范围列表（`ranges: DateRanges`）。
   */
  get ranges(): DateRanges {
    return this.rangesHolder;
  }

  /**
   * Input setter `ranges` updating ranges.
   * @zh 输入属性 `ranges` 的设置器，用于更新范围列表。
   * @param value - New ranges value (`DateRanges`) / 新的范围列表值（`DateRanges`）
   */
  @Input() set ranges(value: DateRanges) {
    this.rangesHolder = value;
    this.renderRanges();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  /**
   * Gets the current max date (`maxDate: dayjs.Dayjs`).
   * @zh 获取当前最大值日期（`maxDate: dayjs.Dayjs`）。
   */
  get maxDate(): dayjs.Dayjs {
    return this.maxDateHolder;
  }

  /**
   * Input setter `maxDate` updating max date.
   * @zh 输入属性 `maxDate` 的设置器，用于更新最大值日期。
   * @param value - New max date value (`string | dayjs.Dayjs`) / 新的最大值日期值（`string | dayjs.Dayjs`）
   */
  @Input()
  set maxDate(value: dayjs.Dayjs | string) {
    if (dayjs.isDayjs(value)) {
      this.maxDateHolder = value;
    } else if (typeof value === 'string') {
      this.maxDateHolder = dayjs(value).utc(true);
    } else {
      this.maxDateHolder = null;
    }
  }

  /**
   * Executes `isInvalidDate` to handle is invalid date.
   * @zh 执行 `isInvalidDate`，用于是否为无效日期。
   * @param date - date parameter (`dayjs.Dayjs`) / 日期参数（`dayjs.Dayjs`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  @Input()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInvalidDate(date: Dayjs): boolean {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering

  /**
   * Executes `isCustomDate` to handle is custom date.
   * @zh 执行 `isCustomDate`，用于是否为自定义日期。
   * @param date - date parameter (`dayjs.Dayjs`) / 日期参数（`dayjs.Dayjs`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  @Input()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isCustomDate(date: Dayjs): boolean {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering

  /**
   * Executes `isTooltipDate` to handle is tooltip date.
   * @zh 执行 `isTooltipDate`，用于是否为悬浮提示日期。
   * @param date - date parameter (`dayjs.Dayjs`) / 日期参数（`dayjs.Dayjs`）
   * @returns Result of type `string | boolean` / 类型为 `string | boolean` 的返回值
   */
  @Input()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isTooltipDate(date: Dayjs): string | boolean | null {
    return null;
  }

  /**
   * handle click on all element in the component, useful for outside of click
   *
   * @param e event

   * @zh 宿主事件监听方法 `handleInternalClick`，响应 `click` 事件以处理连接手柄内部点击。
   */
  @HostListener('click', ['$event'])
  handleInternalClick(e: MouseEvent): void {
    return e.stopPropagation();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`any`) / 变更集合参数（`any`）
   */
  ngOnChanges(changes): void {
    if ((changes.startDate || changes.endDate) && this.inline) {
      this.updateView();
    }
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.buildLocale();
    const daysOfWeek = [...this.locale.daysOfWeek];
    this.locale.firstDay = this.locale.firstDay % 7;
    if (this.locale.firstDay !== 0) {
      let iterator = this.locale.firstDay;

      while (iterator > 0) {
        daysOfWeek.push(daysOfWeek.shift());
        iterator--;
      }
    }
    this.locale.daysOfWeek = daysOfWeek;

    // Initialize with initialDates if provided
    let leftMonth: Dayjs;
    let rightMonth: Dayjs;

    if (this.initialDates && this.initialDates.length === 2) {
      leftMonth = dayjs.isDayjs(this.initialDates[0]) ? this.initialDates[0].clone() : dayjs(this.initialDates[0]).utc(true);
      rightMonth = dayjs.isDayjs(this.initialDates[1]) ? this.initialDates[1].clone() : dayjs(this.initialDates[1]).utc(true);
    } else {
      leftMonth = dayjs().utc(true);
      rightMonth = leftMonth.clone().add(1, 'month');
    }

    // Set calendar view without selecting dates
    if (!this.startDate || this.startDate.isSame(dayjs().utc(true).startOf('day'))) {
      this.leftCalendar.month = leftMonth.clone();
      this.rightCalendar.month = rightMonth.clone();
    }

    if (this.inline) {
      this.cachedVersion.start = this.startDate?.clone();
      this.cachedVersion.end = this.endDate?.clone();
    }

    if (this.startDate && this.timePicker) {
      this.setStartDate(this.startDate);
      this.renderTimePicker(SideEnum.left);
    }

    if (this.endDate && this.timePicker) {
      this.setEndDate(this.endDate);
      this.renderTimePicker(SideEnum.right);
    }

    this.updateMonthsInView();
    this.renderCalendar(SideEnum.left);
    this.renderCalendar(SideEnum.right);
    this.renderRanges();
  }

  /**
   * Executes `renderRanges` to handle render ranges.
   * @zh 执行 `renderRanges`，用于渲染范围列表。
   */
  renderRanges(): void {
    this.rangesArray = [];
    let start;
    let end;
    if (typeof this.ranges === 'object') {
      for (const range in this.ranges) {
        if (this.ranges[range]) {
          if (typeof this.ranges[range][0] === 'string') {
            start = dayjs(this.ranges[range][0], this.locale.format).utc(true);
          } else {
            start = dayjs(this.ranges[range][0]).utc(true);
          }
          if (typeof this.ranges[range][1] === 'string') {
            end = dayjs(this.ranges[range][1], this.locale.format).utc(true);
          } else {
            end = dayjs(this.ranges[range][1]).utc(true);
          }
          // If the start or end date exceed those allowed by the minDate or maxSpan
          // options, shorten the range to the allowable period.
          if (this.minDate && start.isBefore(this.minDate)) {
            start = this.minDate.clone();
          }
          let maxDate = this.maxDate;
          if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
            maxDate = start.clone().add(this.maxSpan);
          }
          if (maxDate && end.isAfter(maxDate)) {
            end = maxDate.clone();
          }
          // If the end of the range is before the minimum or the start of the range is
          // after the maximum, don't display this range option at all.
          if (
            (this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day')) ||
            (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))
          ) {
            continue;
          }
          // Support unicode chars in the range names.
          const elem = document.createElement('textarea');
          elem.innerHTML = range;
          const rangeHtml = elem.value;
          this.ranges[rangeHtml] = [start, end];
        }
      }
      for (const range in this.ranges) {
        if (this.ranges[range]) {
          this.rangesArray.push(range);
        }
      }
      if (this.showCustomRangeLabel) {
        this.rangesArray.push(this.locale.customRangeLabel);
      }
      this.showCalInRanges = !this.rangesArray.length || this.alwaysShowCalendars;
      if (!this.timePicker) {
        this.startDate = this.startDate.startOf('day');
        this.endDate = this.endDate.endOf('day');
      }
    }
  }

  /**
   * Executes `renderTimePicker` to handle render time picker.
   * @zh 执行 `renderTimePicker`，用于渲染时间选择器。
   * @param side - side parameter (`SideEnum`) / side参数（`SideEnum`）
   */
  renderTimePicker(side: SideEnum): void {
    let selected: Dayjs;
    let minDate: Dayjs;
    const maxDate = this.maxDate;
    if (side === SideEnum.left) {
      selected = this.startDate.clone();
      minDate = this.minDate;
    } else if (side === SideEnum.right && this.endDate) {
      selected = this.endDate.clone();
      minDate = this.startDate;
    } else if (side === SideEnum.right && !this.endDate) {
      // don't have an end date, use the start date then put the selected time for the right side as the time
      selected = this.getDateWithTime(this.startDate, SideEnum.right);
      if (selected.isBefore(this.startDate)) {
        selected = this.startDate.clone(); // set it back to the start date the time was backwards
      }
      minDate = this.startDate;
    }
    const start = this.timePicker24Hour ? 0 : 1;
    const end = this.timePicker24Hour ? 23 : 12;
    this.timepickerVariables[side] = {
      hours: [],
      minutes: [],
      minutesLabel: [],
      seconds: [],
      secondsLabel: [],
      disabledHours: [],
      disabledMinutes: [],
      disabledSeconds: [],
      selectedHour: 0,
      selectedMinute: 0,
      selectedSecond: 0,
      selected
    };
    // generate hours
    for (let i = start; i <= end; i++) {
      let iIn24 = i;
      if (!this.timePicker24Hour) {
        iIn24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : i === 12 ? 0 : i;
      }

      const time = selected.clone().hour(iIn24);
      let disabled = false;
      if (minDate && time.minute(59).isBefore(minDate)) {
        disabled = true;
      }
      if (maxDate && time.minute(0).isAfter(maxDate)) {
        disabled = true;
      }

      this.timepickerVariables[side].hours.push(i);
      if (iIn24 === selected.hour() && !disabled) {
        this.timepickerVariables[side].selectedHour = i;
      } else if (disabled) {
        this.timepickerVariables[side].disabledHours.push(i);
      }
    }

    // generate minutes
    for (let i = 0; i < 60; i += this.timePickerIncrement) {
      const padded = i < 10 ? `0${i}` : `${i}`;
      const time = selected.clone().minute(i);

      let disabled = false;
      if (minDate && time.second(59).isBefore(minDate)) {
        disabled = true;
      }
      if (maxDate && time.second(0).isAfter(maxDate)) {
        disabled = true;
      }
      this.timepickerVariables[side].minutes.push(i);
      this.timepickerVariables[side].minutesLabel.push(padded);
      if (selected.minute() === i && !disabled) {
        this.timepickerVariables[side].selectedMinute = i;
      } else if (disabled) {
        this.timepickerVariables[side].disabledMinutes.push(i);
      }
    }
    // generate seconds
    if (this.timePickerSeconds) {
      for (let i = 0; i < 60; i++) {
        const padded = i < 10 ? `0${i}` : `${i}`;
        const time = selected.clone().second(i);

        let disabled = false;
        if (minDate && time.isBefore(minDate)) {
          disabled = true;
        }
        if (maxDate && time.isAfter(maxDate)) {
          disabled = true;
        }

        this.timepickerVariables[side].seconds.push(i);
        this.timepickerVariables[side].secondsLabel.push(padded);
        if (selected.second() === i && !disabled) {
          this.timepickerVariables[side].selectedSecond = i;
        } else if (disabled) {
          this.timepickerVariables[side].disabledSeconds.push(i);
        }
      }
    }
    // generate AM/PM
    if (!this.timePicker24Hour) {
      if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) {
        this.timepickerVariables[side].amDisabled = true;
      }

      if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) {
        this.timepickerVariables[side].pmDisabled = true;
      }
      if (selected.hour() >= 12) {
        this.timepickerVariables[side].ampmModel = 'PM';
      } else {
        this.timepickerVariables[side].ampmModel = 'AM';
      }
    }
    this.timepickerVariables[side].selected = selected;
  }

  /**
   * Executes `renderCalendar` to handle render calendar.
   * @zh 执行 `renderCalendar`，用于渲染日历。
   * @param side - side parameter (`SideEnum`) / side参数（`SideEnum`）
   */
  renderCalendar(side: SideEnum): void {
    // side enum
    const mainCalendar: VisibleCalendar = side === SideEnum.left ? this.leftCalendar : this.rightCalendar;
    const month: number = mainCalendar.month.month();
    const year: number = mainCalendar.month.year();
    const hour: number = mainCalendar.month.hour();
    const minute: number = mainCalendar.month.minute();
    const second: number = mainCalendar.month.second();
    const daysInMonth: number = dayjs(new Date(year, month)).utc(true).daysInMonth();
    const firstDay: Dayjs = dayjs(new Date(year, month, 1)).utc(true);
    const lastDay: Dayjs = dayjs(new Date(year, month, daysInMonth)).utc(true);
    const lastMonth: number = dayjs(firstDay).utc(true).subtract(1, 'month').month();
    const lastYear: number = dayjs(firstDay).utc(true).subtract(1, 'month').year();
    const daysInLastMonth: number = dayjs(new Date(lastYear, lastMonth)).utc(true).daysInMonth();
    const dayOfWeek: number = firstDay.day();
    // initialize 6 rows x 7 columns array for the calendar
    const calendar: CalendarArrayWithProps<Dayjs[]> = [];
    calendar.firstDay = firstDay;
    calendar.lastDay = lastDay;

    for (let i = 0; i < 6; i++) {
      calendar[i] = [];
    }

    // populate the calendar with date objects
    let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
    if (startDay > daysInLastMonth) {
      startDay -= 7;
    }

    if (dayOfWeek === this.locale.firstDay) {
      startDay = daysInLastMonth - 6;
    }

    let curDate = dayjs(new Date(lastYear, lastMonth, startDay, 12, minute, second)).utc(true);

    for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = dayjs(curDate).utc(true).add(24, 'hours')) {
      if (i > 0 && col % 7 === 0) {
        col = 0;
        row++;
      }
      calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
      curDate = curDate.hour(12);

      if (
        this.minDate &&
        calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
        calendar[row][col].isBefore(this.minDate) &&
        side === 'left'
      ) {
        calendar[row][col] = this.minDate.clone();
      }

      if (
        this.maxDate &&
        calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
        calendar[row][col].isAfter(this.maxDate) &&
        side === 'right'
      ) {
        calendar[row][col] = this.maxDate.clone();
      }
    }

    // make the calendar object available to hoverDate/clickDate
    if (side === SideEnum.left) {
      this.leftCalendar.calendar = calendar;
    } else {
      this.rightCalendar.calendar = calendar;
    }
    //
    // Display the calendar
    //
    let minDate = side === 'left' ? this.minDate : this.startDate;
    let maxDate = this.maxDate;
    // adjust maxDate to reflect the dateLimit setting in order to
    // grey out end dates beyond the dateLimit
    if (this.endDate === null && this.dateLimit) {
      const maxLimit = this.startDate.clone().add(this.dateLimit, 'day').endOf('day');
      if (!maxDate || maxLimit.isBefore(maxDate)) {
        maxDate = maxLimit;
      }

      if (this.customRangeDirection) {
        minDate = this.minDate;
        const minLimit = this.startDate.clone().subtract(this.dateLimit, 'day').endOf('day');
        if (!minDate || minLimit.isAfter(minDate)) {
          minDate = minLimit;
        }
      }
    }

    this.calendarVariables[side] = {
      month,
      year,
      hour,
      minute,
      second,
      daysInMonth,
      firstDay,
      lastDay,
      lastMonth,
      lastYear,
      daysInLastMonth,
      dayOfWeek,
      // other vars
      calRows: Array.from(Array(6).keys()),
      calCols: Array.from(Array(7).keys()),
      classes: {},
      minDate,
      maxDate,
      calendar
    };
    if (this.showDropdowns) {
      const currentMonth: number = calendar[1][1].month();
      const currentYear: number = calendar[1][1].year();
      const realCurrentYear: number = dayjs().utc(true).year();
      const maxYear: number = (maxDate && maxDate.year()) || realCurrentYear + 5;
      const minYear: number = (minDate && minDate.year()) || realCurrentYear - 50;
      const inMinYear: boolean = currentYear === minYear;
      const inMaxYear: boolean = currentYear === maxYear;
      const years: number[] = [];
      for (let y = minYear; y <= maxYear; y++) {
        years.push(y);
      }
      this.calendarVariables[side].dropdowns = {
        currentMonth,
        currentYear,
        maxYear,
        minYear,
        inMinYear,
        inMaxYear,
        monthArrays: Array.from(Array(12).keys()),
        yearArrays: years
      };
    }

    this.buildCells(calendar, side);
  }

  /**
   * Executes `setStartDate` to handle set start date.
   * @zh 执行 `setStartDate`，用于集合开始日期。
   * @param startDate - start date parameter (`string | dayjs.Dayjs`) / 开始日期参数（`string | dayjs.Dayjs`）
   */
  setStartDate(startDate: string | Dayjs): void {
    if (typeof startDate === 'string') {
      this.startDate = dayjs(startDate, this.locale.format).utc(true);
    }

    if (typeof startDate === 'object') {
      this.pickingDate = true;
      this.startDate = dayjs(startDate).utc(true);
    }
    if (!this.timePicker) {
      this.pickingDate = true;
      this.startDate = this.startDate.startOf('day');
    }

    if (this.timePicker && this.timePickerIncrement) {
      this.startDate = this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
    }

    if (this.minDate && this.startDate.isBefore(this.minDate)) {
      this.startDate = this.minDate.clone();
      if (this.timePicker && this.timePickerIncrement) {
        this.startDate = this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }
    }

    if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
      this.startDate = this.maxDate.clone();
      if (this.timePicker && this.timePickerIncrement) {
        this.startDate = this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }
    }

    if (!this.isShown) {
      this.updateElement();
    }
    this.startDateChanged.emit({ startDate: this.startDate });
    this.updateMonthsInView();
  }

  /**
   * Executes `setEndDate` to handle set end date.
   * @zh 执行 `setEndDate`，用于集合结束日期。
   * @param endDate - end date parameter (`string | dayjs.Dayjs`) / 结束日期参数（`string | dayjs.Dayjs`）
   */
  setEndDate(endDate: string | Dayjs): void {
    if (typeof endDate === 'string') {
      this.endDate = dayjs(endDate, this.locale.format).utc(true);
    }

    if (typeof endDate === 'object') {
      this.pickingDate = false;
      this.endDate = dayjs(endDate).utc(true);
    }
    if (!this.timePicker) {
      this.pickingDate = false;
      this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');
    }

    if (this.timePicker && this.timePickerIncrement) {
      this.endDate = this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
    }

    if (this.endDate.isBefore(this.startDate)) {
      this.endDate = this.startDate.clone();
    }

    if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
      this.endDate = this.maxDate.clone();
    }

    if (this.dateLimit && this.startDate.clone().add(this.dateLimit, 'day').isBefore(this.endDate)) {
      this.endDate = this.startDate.clone().add(this.dateLimit, 'day');
    }

    if (!this.isShown) {
      // this.updateElement();
    }
    this.endDateChanged.emit({ endDate: this.endDate });
    this.updateMonthsInView();
  }

  /**
   * Executes `updateView` to handle update view.
   * @zh 执行 `updateView`，用于更新视图。
   */
  updateView(): void {
    if (this.timePicker) {
      this.renderTimePicker(SideEnum.left);
      this.renderTimePicker(SideEnum.right);
    }
    this.updateMonthsInView();
    this.updateCalendars();
  }

  /**
   * Executes `updateMonthsInView` to handle update months in view.
   * @zh 执行 `updateMonthsInView`，用于更新月在视图。
   */
  updateMonthsInView(): void {
    if (this.endDate) {
      // if both dates are visible already, do nothing
      if (
        !this.singleDatePicker &&
        this.leftCalendar.month &&
        this.rightCalendar.month &&
        ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
          (this.startDate && this.rightCalendar && this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) &&
        (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
          this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))
      ) {
        return;
      }
      if (this.startDate) {
        // we want to stay on whatever months are in view if date range is set and both calendar sides have a month already.  e.g. when
        // user clicks on the end date, we want to stay on current month in view
        if (this.leftCalendar.month && this.rightCalendar.month) {
          return;
        }
        this.leftCalendar.month = this.startDate.clone().date(2);
        if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() || this.endDate.year() !== this.startDate.year())) {
          this.rightCalendar.month = this.endDate.clone().date(2);
        } else {
          this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
        }
      }
    } else {
      if (
        this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
        this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')
      ) {
        this.leftCalendar.month = this.startDate.clone().date(2);
        this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
      }
    }
    if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
      this.rightCalendar.month = this.maxDate.clone().date(2);
      this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
    }
  }

  /**
   *  This is responsible for updating the calendars

   * @zh 执行 `updateCalendars`，用于更新日历。
   */
  updateCalendars(): void {
    this.renderCalendar(SideEnum.left);
    this.renderCalendar(SideEnum.right);

    if (this.endDate === null) {
      return;
    }
    this.calculateChosenLabel();
  }

  /**
   * Executes `updateElement` to handle update element.
   * @zh 执行 `updateElement`，用于更新元素。
   */
  updateElement(): void {
    const format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;
    if (!this.singleDatePicker && this.autoUpdateInput) {
      if (this.startDate && this.endDate) {
        // if we use ranges and should show range label on input
        if (
          this.rangesArray.length &&
          this.showRangeLabelOnInput === true &&
          this.chosenRange &&
          this.locale.customRangeLabel !== this.chosenRange
        ) {
          this.chosenLabel = this.chosenRange;
        } else {
          const formattedStartDate = this.localeHolder.locale
            ? this.startDate.locale(this.localeHolder.locale).format(format)
            : this.startDate.format(format);
          const formattedEndDate = this.localeHolder.locale
            ? this.endDate.locale(this.localeHolder.locale).format(format)
            : this.endDate.format(format);

          this.chosenLabel = formattedStartDate + this.locale.separator + formattedEndDate;
        }
      }
    } else if (this.autoUpdateInput) {
      this.chosenLabel = this.localeHolder.locale
        ? this.startDate.locale(this.localeHolder.locale).format(format)
        : this.startDate.format(format);
    }
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   */
  remove(): void {
    this.isShown = false;
  }

  /**
   * this should calculate the label

   * @zh 执行 `calculateChosenLabel`，用于计算Chosen标签。
   */
  calculateChosenLabel(): void {
    if (!this.locale || !this.locale.separator) {
      this.buildLocale();
    }
    let customRange = true;
    let i = 0;
    if (this.rangesArray.length > 0) {
      for (const range in this.ranges) {
        if (this.ranges[range]) {
          if (this.timePicker) {
            const format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
            // ignore times when comparing dates if time picker seconds is not enabled
            if (
              this.startDate.format(format) === this.ranges[range][0].format(format) &&
              this.endDate.format(format) === this.ranges[range][1].format(format)
            ) {
              customRange = false;
              this.chosenRange = this.rangesArray[i];
              break;
            }
          } else {
            // ignore times when comparing dates if time picker is not enabled
            if (
              this.startDate.format('YYYY-MM-DD') === this.ranges[range][0].format('YYYY-MM-DD') &&
              this.endDate.format('YYYY-MM-DD') === this.ranges[range][1].format('YYYY-MM-DD')
            ) {
              customRange = false;
              this.chosenRange = this.rangesArray[i];
              break;
            }
          }
          i++;
        }
      }
      if (customRange) {
        if (this.showCustomRangeLabel) {
          this.chosenRange = this.locale.customRangeLabel;
        } else {
          this.chosenRange = null;
        }
        // if custom label: show calendar
        this.showCalInRanges = true;
      }
    }

    this.updateElement();
  }

  /**
   * Executes `clickApply` to handle click apply.
   * @zh 执行 `clickApply`，用于点击应用。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  clickApply(e?: MouseEvent): void {
    if (!this.singleDatePicker && this.startDate && !this.endDate) {
      if (this.timePicker) {
        this.endDate = this.getDateWithTime(this.startDate, SideEnum.right);
      } else {
        this.endDate = this.startDate.clone();
      }
      this.calculateChosenLabel();
    }
    if (this.isInvalidDate && this.startDate && this.endDate) {
      // get if there are invalid date between range

      let d = this.startDate.clone();
      while (d.isBefore(this.endDate)) {
        if (this.isInvalidDate(d)) {
          this.endDate = d.subtract(1, 'days');
          this.calculateChosenLabel();
          break;
        }
        d = d.add(1, 'days');
      }
    }
    if (this.chosenLabel) {
      this.choosedDate.emit({ chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate });
    }

    this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
    if (e || (this.closeOnAutoApply && !e)) {
      this.hide();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `clickCancel` to handle click cancel.
   * @zh 执行 `clickCancel`，用于点击取消。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  clickCancel(e: MouseEvent): void {
    this.startDate = this.cachedVersion.start;
    this.endDate = this.cachedVersion.end;
    if (this.inline) {
      this.updateView();
    }
    this.cancelClicked.emit();
    this.hide();
  }

  /**
   * called when month is changed
   *
   * @param monthEvent get value in event.target.value
   * @param side left or right

   * @zh 执行 `monthChanged`，用于月已变更。
   */
  monthChanged(monthEvent: Event, side: SideEnum): void {
    const year = this.calendarVariables[side].dropdowns.currentYear;
    const month = parseInt((monthEvent.target as HTMLSelectElement).value, 10);
    this.monthOrYearChanged(month, year, side);
  }

  /**
   * called when year is changed
   *
   * @param yearEvent get value in event.target.value
   * @param side left or right

   * @zh 执行 `yearChanged`，用于年已变更。
   */
  yearChanged(yearEvent: Event, side: SideEnum): void {
    const month = this.calendarVariables[side].dropdowns.currentMonth;
    const year = parseInt((yearEvent.target as HTMLSelectElement).value, 10);
    this.monthOrYearChanged(month, year, side);
  }

  /**
   * called when time is changed
   *
   * @param timeEvent  an event
   * @param side left or right

   * @zh 执行 `timeChanged`，用于时间已变更。
   */
  timeChanged(timeEvent: Event, side: SideEnum): void {
    let hour = parseInt(String(this.timepickerVariables[side].selectedHour), 10);
    const minute = parseInt(String(this.timepickerVariables[side].selectedMinute), 10);
    const second = this.timePickerSeconds ? parseInt(String(this.timepickerVariables[side].selectedSecond), 10) : 0;

    if (!this.timePicker24Hour) {
      const ampm = this.timepickerVariables[side].ampmModel;
      if (ampm === 'PM' && hour < 12) {
        hour += 12;
      }
      if (ampm === 'AM' && hour === 12) {
        hour = 0;
      }
    }

    if (side === SideEnum.left) {
      let start = this.startDate.clone();
      start = start.hour(hour);
      start = start.minute(minute);
      start = start.second(second);
      this.setStartDate(start);
      if (this.singleDatePicker) {
        this.endDate = this.startDate.clone();
      } else if (this.endDate && this.endDate.format('YYYY-MM-DD') === start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
        this.setEndDate(start.clone());
      } else if (!this.endDate && this.timePicker) {
        const startClone = this.getDateWithTime(start, SideEnum.right);

        if (startClone.isBefore(start)) {
          this.timepickerVariables[SideEnum.right].selectedHour = hour;
          this.timepickerVariables[SideEnum.right].selectedMinute = minute;
          this.timepickerVariables[SideEnum.right].selectedSecond = second;
        }
      }
    } else if (this.endDate) {
      let end = this.endDate.clone();
      end = end.hour(hour);
      end = end.minute(minute);
      end = end.second(second);
      this.setEndDate(end);
    }

    // update the calendars so all clickable dates reflect the new time component
    this.updateCalendars();

    // re-render the time pickers because changing one selection can affect what's enabled in another
    this.renderTimePicker(SideEnum.left);
    this.renderTimePicker(SideEnum.right);

    if (this.autoApply) {
      this.clickApply();
    }
  }

  /**
   *  call when month or year changed
   *
   * @param month month number 0 -11
   * @param year year eg: 1995
   * @param side left or right

   * @zh 执行 `monthOrYearChanged`，用于月Or年已变更。
   */
  monthOrYearChanged(month: number, year: number, side: SideEnum): void {
    const isLeft = side === SideEnum.left;
    let newMonth = month;
    let newYear = year;

    if (!isLeft) {
      if (newYear < this.startDate.year() || (newYear === this.startDate.year() && newMonth < this.startDate.month())) {
        newMonth = this.startDate.month();
        newYear = this.startDate.year();
      }
    }

    if (this.minDate) {
      if (newYear < this.minDate.year() || (newYear === this.minDate.year() && newMonth < this.minDate.month())) {
        newMonth = this.minDate.month();
        newYear = this.minDate.year();
      }
    }

    if (this.maxDate) {
      if (newYear > this.maxDate.year() || (newYear === this.maxDate.year() && newMonth > this.maxDate.month())) {
        newMonth = this.maxDate.month();
        newYear = this.maxDate.year();
      }
    }
    this.calendarVariables[side].dropdowns.currentYear = newYear;
    this.calendarVariables[side].dropdowns.currentMonth = newMonth;
    if (isLeft) {
      this.leftCalendar.month = this.leftCalendar.month.month(newMonth).year(newYear);
      if (this.linkedCalendars) {
        this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
      }
    } else {
      this.rightCalendar.month = this.rightCalendar.month.month(newMonth).year(newYear);
      if (this.linkedCalendars) {
        this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
      }
    }
    this.updateCalendars();
  }

  /**
   * Click on previous month
   *
   * @param side left or right calendar

   * @zh 执行 `clickPrev`，用于点击前一个。
   */
  clickPrev(side: SideEnum): void {
    if (side === SideEnum.left) {
      this.leftCalendar.month = this.leftCalendar.month.subtract(1, 'month');
      if (this.linkedCalendars) {
        this.rightCalendar.month = this.rightCalendar.month.subtract(1, 'month');
      }
    } else {
      this.rightCalendar.month = this.rightCalendar.month.subtract(1, 'month');
    }
    this.updateCalendars();
  }

  /**
   * Click on next month
   *
   * @param side left or right calendar

   * @zh 属性 `clickNext`（类型：`(side: SideEnum) => void`），用于存储或配置点击下一个。
   */
  clickNext = (side: SideEnum) => {
    if (side === SideEnum.left) {
      this.leftCalendar.month = this.leftCalendar.month.add(1, 'month');
    } else {
      this.rightCalendar.month = this.rightCalendar.month.add(1, 'month');
      if (this.linkedCalendars) {
        this.leftCalendar.month = this.leftCalendar.month.add(1, 'month');
      }
    }
    this.updateCalendars();
  };

  /**
   * When hovering a date
   *
   * @param e event: get value by e.target.value
   * @param side left or right
   * @param row row position of the current date clicked
   * @param col col position of the current date clicked

   * @zh 执行 `hoverDate`，用于hover日期。
   */
  hoverDate(e: Event, side: SideEnum, row: number, col: number): void {
    const leftCalDate = this.calendarVariables['left'].calendar[row][col];
    const rightCalDate = this.calendarVariables['right'].calendar[row][col];
    if (this.pickingDate) {
      this.nowHoveredDate = side === SideEnum.left ? leftCalDate : rightCalDate;
      // renderCalendar() also rebuilds the entire 42-cell Dayjs date grid from scratch
      // (~1500 dayjs operations) even though hovering never changes which dates are in
      // the grid -- only which of them should be highlighted as "in range". Reuse the
      // already-built grids (cached on leftCalendar/rightCalendar by the last full
      // renderCalendar() call) and only recompute the per-cell CSS classes.
      this.buildCells(this.leftCalendar.calendar, SideEnum.left);
      this.buildCells(this.rightCalendar.calendar, SideEnum.right);
    }

  }


  /**
   * Executes `clickDate` to handle click date.
   * @zh 执行 `clickDate`，用于点击日期。
   * @param e - e parameter (`Event`) / e参数（`Event`）
   * @param side - side parameter (`SideEnum`) / side参数（`SideEnum`）
   * @param row - row parameter (`number`) / 行参数（`number`）
   * @param col - col parameter (`number`) / 列参数（`number`）
   */
  clickDate(e: Event, side: SideEnum, row: number, col: number): void {
    if ((e.target as HTMLTableCellElement).tagName === 'TD') {
      if (!(e.target as HTMLTableCellElement).classList.contains('available')) {
        return;
      }
    } else if ((e.target as HTMLSpanElement).tagName === 'SPAN') {
      if (!(e.target as HTMLSpanElement).parentElement.classList.contains('available')) {
        return;
      }
    }
    if (this.rangesArray.length) {
      this.chosenRange = this.locale.customRangeLabel;
    }

    let date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

    if ((this.endDate || (date.isBefore(this.startDate, 'day') && this.customRangeDirection === false)) && this.lockStartDate === false) {
      // picking start
      if (this.timePicker) {
        date = this.getDateWithTime(date, SideEnum.left);
      }
      this.endDate = null;
      this.setStartDate(date.clone());
    } else if (!this.endDate && date.isBefore(this.startDate) && this.customRangeDirection === false) {
      // special case: clicking the same date for start/end,
      // but the time of the end date is before the start date
      this.setEndDate(this.startDate.clone());
    } else {
      // picking end
      if (this.timePicker) {
        date = this.getDateWithTime(date, SideEnum.right);
      }
      if (date.isBefore(this.startDate, 'day') === true && this.customRangeDirection === true) {
        this.setEndDate(this.startDate);
        this.setStartDate(date.clone());
      } else {
        this.setEndDate(date.clone());
      }

      if (this.autoApply) {
        this.calculateChosenLabel();
      }
    }

    if (this.singleDatePicker) {
      this.setEndDate(this.startDate);
      this.updateElement();
      if (this.autoApply) {
        this.clickApply();
      }
    }

    this.updateView();

    if (this.autoApply && this.startDate && this.endDate) {
      this.clickApply();
    }

    // This is to cancel the blur event handler if the mouse was in one of the inputs
    e.stopPropagation();
  }

  /**
   *  Click on the custom range
   *
   * @param e: Event
   * @param label

   * @zh 执行 `clickRange`，用于点击范围。
   */
  clickRange(e: MouseEvent, label: string): void {
    this.chosenRange = label;
    if (label === this.locale.customRangeLabel) {
      this.isShown = true; // show calendars
      this.showCalInRanges = true;
    } else {
      const dates = this.ranges[label];
      if (this.minDate && dates[0].isBefore(this.minDate)) {
        this.startDate = this.minDate;
      } else {
        this.startDate = dates[0].clone();
      }
      if (this.maxDate && dates[1].isAfter(this.maxDate)) {
        this.endDate = this.maxDate;
      } else {
        this.endDate = dates[1].clone();
      }
      if (this.showRangeLabelOnInput && label !== this.locale.customRangeLabel) {
        this.chosenLabel = label;
      } else {
        this.calculateChosenLabel();
      }
      this.showCalInRanges = !this.rangesArray.length || this.alwaysShowCalendars;

      if (!this.timePicker) {
        this.startDate = this.startDate.startOf('day');
        this.endDate = this.endDate.endOf('day');
      }

      if (!this.alwaysShowCalendars) {
        this.isShown = false; // hide calendars
      }
      this.rangeClicked.emit({ label, dates });
      if (!this.keepCalendarOpeningWithRange || this.autoApply) {
        this.clickApply();
      } else {
        if (!this.alwaysShowCalendars) {
          return this.clickApply();
        }
        if (this.maxDate && this.maxDate.isSame(dates[0], 'month')) {
          this.rightCalendar.month = this.rightCalendar.month.month(dates[0].month());
          this.rightCalendar.month = this.rightCalendar.month.year(dates[0].year());
          this.leftCalendar.month = this.leftCalendar.month.month(dates[0].month() - 1);
          this.leftCalendar.month = this.leftCalendar.month.year(dates[1].year());
        } else {
          this.leftCalendar.month = this.leftCalendar.month.month(dates[0].month());
          this.leftCalendar.month = this.leftCalendar.month.year(dates[0].year());
          // get the right calendar value
          const nextMonth = !this.linkedCalendars ? dates[1].clone() : dates[0].clone().add(1, 'month');
          this.rightCalendar.month = this.rightCalendar.month.month(nextMonth.month());
          this.rightCalendar.month = this.rightCalendar.month.year(nextMonth.year());
        }
        this.updateCalendars();
        if (this.timePicker) {
          this.renderTimePicker(SideEnum.left);
          this.renderTimePicker(SideEnum.right);
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `show` to handle show.
   * @zh 执行 `show`，用于显示。
   * @param e - e parameter (`Event`) / e参数（`Event`）
   */
  show(e?: Event): void {
    if (this.isShown) {
      return;
    }
    this.cachedVersion.start = this.startDate.clone();
    this.cachedVersion.end = this.endDate.clone();
    this.isShown = true;
    this.updateView();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `hide` to handle hide.
   * @zh 执行 `hide`，用于隐藏。
   * @param e - e parameter (`Event`) / e参数（`Event`）
   */
  hide(e?: Event): void {
    if (!this.isShown) {
      return;
    }
    // incomplete date selection, revert to last values
    if (!this.endDate) {
      if (this.cachedVersion.start) {
        this.startDate = this.cachedVersion.start.clone();
      }
      if (this.cachedVersion.end) {
        this.endDate = this.cachedVersion.end.clone();
      }
    }

    // if a new date range was selected, invoke the user callback function
    if (!this.startDate.isSame(this.cachedVersion.start) || !this.endDate.isSame(this.cachedVersion.end)) {
      // this.callback(this.startDate, this.endDate, this.chosenLabel);
    }

    // if picker is attached to a text input, update it
    this.updateElement();
    this.isShown = false;
    this.ref.detectChanges();
  }

  /**
   * update the locale options
   *
   * @param locale

   * @zh 执行 `updateLocale`，用于更新语言区域。
   */
  updateLocale(locale: LocaleConfig): void {
    for (const key in locale) {
      if (Object.prototype.hasOwnProperty.call(locale, key)) {
        this.locale[key] = locale[key];
        if (key === 'customRangeLabel') {
          this.renderRanges();
        }
      }
    }
  }

  /**
   *  clear the daterange picker

   * @zh 执行 `clear`，用于清空。
   */
  clear(): void {
    this.startDate = dayjs().utc(true).startOf('day');
    this.endDate = dayjs().utc(true).endOf('day');
    this.choosedDate.emit({ chosenLabel: '', startDate: null, endDate: null });
    this.datesUpdated.emit({ startDate: null, endDate: null });
    this.clearClicked.emit();
    this.hide();
  }

  /**
   * Find out if the selected range should be disabled if it doesn't
   * fit into minDate and maxDate limitations.

   * @zh 执行 `disableRange`，用于禁用范围。
   */
  disableRange(range: string): boolean {
    if (range === this.locale.customRangeLabel) {
      return false;
    }
    const rangeMarkers = this.ranges[range];
    const areBothBefore = rangeMarkers.every((date) => {
      if (!this.minDate) {
        return false;
      }
      return date.isBefore(this.minDate);
    });

    const areBothAfter = rangeMarkers.every((date) => {
      if (!this.maxDate) {
        return false;
      }
      return date.isAfter(this.maxDate);
    });
    return areBothBefore || areBothAfter;
  }

  /**
   *
   * @param date the date to add time
   * @param side left or right

   * @zh 执行 `getDateWithTime`，用于获取日期带有时间。
   */
  private getDateWithTime(date, side: SideEnum): dayjs.Dayjs {
    if(!!this.timepickerVariables[side]) {
      let hour = parseInt(String(this.timepickerVariables[side].selectedHour), 10);
      if (!this.timePicker24Hour) {
        const ampm = this.timepickerVariables[side].ampmModel;
        if (ampm === 'PM' && hour < 12) {
          hour += 12;
        }
        if (ampm === 'AM' && hour === 12) {
          hour = 0;
        }
      }
      const minute = parseInt(String(this.timepickerVariables[side].selectedMinute), 10);
      const second = this.timePickerSeconds ? parseInt(String(this.timepickerVariables[side].selectedSecond), 10) : 0;
      return date.clone().hour(hour).minute(minute).second(second);
      
    }else{
      return;
    }
  }

  /**
   *  build the locale config

   * @zh 执行 `buildLocale`，用于构建语言区域。
   */
  private buildLocale() {
    this.locale = { ...this.localeHolderService.config, ...this.locale };
    if (!this.locale.format) {
      if (this.timePicker) {
        this.locale.format = dayjs.localeData().longDateFormat('lll');
      } else {
        this.locale.format = dayjs.localeData().longDateFormat('L');
      }
    }
  }

  /**
   * Executes `buildCells` to handle build cells.
   * @zh 执行 `buildCells`，用于构建单元格集合。
   * @param calendar - calendar parameter (`any`) / 日历参数（`any`）
   * @param side - side parameter (`SideEnum`) / side参数（`SideEnum`）
   */
  private buildCells(calendar, side: SideEnum) {
    for (let row = 0; row < 6; row++) {
      this.calendarVariables[side].classes[row] = { classList: '' };
      const rowClasses = [];
      if (
        this.emptyWeekRowClass &&
        Array.from(Array(7).keys()).some((i) => calendar[row][i].month() !== this.calendarVariables[side].month)
      ) {
        rowClasses.push(this.emptyWeekRowClass);
      }
      for (let col = 0; col < 7; col++) {
        const classes = [];
        // empty week row class
        if (this.emptyWeekColumnClass) {
          if (calendar[row][col].month() !== this.calendarVariables[side].month) {
            classes.push(this.emptyWeekColumnClass);
          }
        }
        // highlight today's date
        if (calendar[row][col].isSame(dayjs().utc(true), 'day')) {
          classes.push('today');
        }
        // highlight weekends
        if (calendar[row][col].isoWeekday() > 5) {
          classes.push('weekend');
        }
        // grey out the dates in other months displayed at beginning and end of this calendar
        if (calendar[row][col].month() !== calendar[1][1].month()) {
          classes.push('off');

          // mark the last day of the previous month in this calendar
          if (
            this.lastDayOfPreviousMonthClass &&
            (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) &&
            calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth
          ) {
            classes.push(this.lastDayOfPreviousMonthClass);
          }

          // mark the first day of the next month in this calendar
          if (
            this.firstDayOfNextMonthClass &&
            (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) &&
            calendar[row][col].date() === 1
          ) {
            classes.push(this.firstDayOfNextMonthClass);
          }
        }
        // mark the first day of the current month with a custom class
        if (
          this.firstMonthDayClass &&
          calendar[row][col].month() === calendar[1][1].month() &&
          calendar[row][col].date() === calendar.firstDay.date()
        ) {
          classes.push(this.firstMonthDayClass);
        }
        // mark the last day of the current month with a custom class
        if (
          this.lastMonthDayClass &&
          calendar[row][col].month() === calendar[1][1].month() &&
          calendar[row][col].date() === calendar.lastDay.date()
        ) {
          classes.push(this.lastMonthDayClass);
        }
        // don't allow selection of dates before the minimum date
        if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
          classes.push('off', 'disabled');
        }
        // don't allow selection of dates after the maximum date
        if (this.calendarVariables[side].maxDate && calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
          classes.push('off', 'disabled');
        }
        // don't allow selection of date if a custom function decides it's invalid
        if (this.isInvalidDate(calendar[row][col])) {
          classes.push('off', 'disabled', 'invalid');
        }
        // highlight the currently selected start date
        if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
          classes.push('active', 'start-date');
        }
        // highlight the currently selected end date
        if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
          classes.push('active', 'end-date');
        }
        // highlight dates in-between the selected dates
        if (
          ((this.nowHoveredDate != null && this.pickingDate) || this.endDate != null) &&
          calendar[row][col] > this.startDate &&
          (calendar[row][col] < this.endDate || (calendar[row][col] < this.nowHoveredDate && this.pickingDate)) &&
          !classes.find((el) => el === 'off')
        ) {
          classes.push('in-range');
        }
        // apply custom classes for this date
        const isCustom = this.isCustomDate(calendar[row][col]);
        if (isCustom !== false) {
          if (typeof isCustom === 'string') {
            classes.push(isCustom);
          } else {
            Array.prototype.push.apply(classes, isCustom);
          }
        }
        // apply custom tooltip for this date
        // const isTooltip = this.isTooltipDate(calendar[row][col]);
        // if (isTooltip) {
        //   if (typeof isTooltip === 'string') {
        //     this.tooltiptext[calendar[row][col]] = isTooltip; // setting tooltiptext for custom date
        //   } else {
        //     this.tooltiptext[calendar[row][col]] = 'Put the tooltip as the returned value of isTooltipDate';
        //   }
        // } else {
        //   this.tooltiptext[calendar[row][col]] = '';
        // }
        // store classes var
        let cname = '';
        let disabled = false;
        for (const className of classes) {
          cname += className + ' ';
          if (className === 'disabled') {
            disabled = true;
          }
        }
        if (!disabled) {
          cname += 'available';
        }
        this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
      }
      this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
    }
  }
}
