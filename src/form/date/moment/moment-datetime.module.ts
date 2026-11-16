/**
 * @fileoverview Module `src/form/date/moment/moment-datetime.module.ts` providing moment datetime module definitions and implementation.
 * @zh 模块文件 `src/form/date/moment/moment-datetime.module.ts`，提供moment日期时间模块相关的定义与实现。
 */

import { NgModule } from "@angular/core";
import {
  MatMomentDateModule,
  MomentDateModule
} from "@angular/material-moment-adapter";
import {
  DatetimeAdapter,
  MAT_DATETIME_FORMATS
} from "@dotos1/dui/form/date/adapter";
import { MomentDatetimeAdapter } from "./moment-datetime-adapter";
import { MAT_MOMENT_DATETIME_FORMATS } from "./moment-datetime-formats";

export * from "./moment-datetime-adapter";
export * from "./moment-datetime-formats";

/**
 * Angular module `MomentDatetimeModule` declaring and exporting moment datetime module components, directives, pipes, and providers.
 * @zh Angular 模块 `MomentDatetimeModule`，声明并导出Moment日期时间模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [MomentDateModule],
  providers: [
    {
      provide: DatetimeAdapter,
      useClass: MomentDatetimeAdapter
    }
  ]
})
export class MomentDatetimeModule {
}

/**
 * Angular module `MatMomentDatetimeModule` declaring and exporting mat moment datetime module components, directives, pipes, and providers.
 * @zh Angular 模块 `MatMomentDatetimeModule`，声明并导出MaterialMoment日期时间模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [MomentDatetimeModule, MatMomentDateModule],
  providers: [{ provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }]
})
export class MatMomentDatetimeModule {
}
