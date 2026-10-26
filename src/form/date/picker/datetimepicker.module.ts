/**
 * @fileoverview Module `src/form/date/picker/datetimepicker.module.ts` providing datetimepicker module definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/datetimepicker.module.ts`，提供日期时间选择器模块相关的定义与实现。
 */

import {A11yModule} from "@angular/cdk/a11y";
import {OverlayModule} from "@angular/cdk/overlay";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatDatetimepickerCalendar} from "./calendar";
import {MatDatetimepickerCalendarBody} from "./calendar-body";
import {MatDatetimepickerClock} from "./clock";
import {MatDatetimepicker, MatDatetimepickerContent} from "./datetimepicker";
import {MatDatetimepickerInput} from "./datetimepicker-input";
import {MatDatetimepickerToggle} from "./datetimepicker-toggle";
import {MatDatetimepickerMonthView} from "./month-view";
import {MatDatetimepickerYearView} from "./year-view";
import {MatDatetimepickerMultiYearView} from "./multi-year-view";

/**
 * Angular module `MatDatetimepickerModule` declaring and exporting mat datetimepicker module components, directives, pipes, and providers.
 * @zh Angular 模块 `MatDatetimepickerModule`，声明并导出Material日期时间选择器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        OverlayModule,
        A11yModule
    ],
    declarations: [
        MatDatetimepickerCalendar,
        MatDatetimepickerCalendarBody,
        MatDatetimepickerClock,
        MatDatetimepicker,
        MatDatetimepickerToggle,
        MatDatetimepickerInput,
        MatDatetimepickerContent,
        MatDatetimepickerMonthView,
        MatDatetimepickerYearView,
        MatDatetimepickerMultiYearView
    ],
    exports: [
        MatDatetimepickerCalendar,
        MatDatetimepickerCalendarBody,
        MatDatetimepickerClock,
        MatDatetimepicker,
        MatDatetimepickerToggle,
        MatDatetimepickerInput,
        MatDatetimepickerContent,
        MatDatetimepickerMonthView,
        MatDatetimepickerYearView,
        MatDatetimepickerMultiYearView
    ]
})
export class MatDatetimepickerModule {
}
