/**
 * @fileoverview Module `src/form/date/adapter/adapter.module.ts` providing adapter module definitions and implementation.
 * @zh 模块文件 `src/form/date/adapter/adapter.module.ts`，提供适配器模块相关的定义与实现。
 */

import { NgModule } from "@angular/core";
import { MatNativeDateModule, NativeDateModule } from "@angular/material/core";
import { DatetimeAdapter } from "./datetime-adapter";
import { MAT_DATETIME_FORMATS } from "./datetime-formats";
import { NativeDatetimeAdapter } from "./native-datetime-adapter";
import { MAT_NATIVE_DATETIME_FORMATS } from "./native-datetime-formats";

// tslint:disable max-classes-per-file
/**
 * Angular module `NativeDatetimeModule` declaring and exporting native datetime module components, directives, pipes, and providers.
 * @zh Angular 模块 `NativeDatetimeModule`，声明并导出原生日期时间模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [NativeDateModule],
  providers: [
    {
      provide: DatetimeAdapter,
      useClass: NativeDatetimeAdapter
    }
  ]
})
export class NativeDatetimeModule {
}

/**
 * Angular module `MatNativeDatetimeModule` declaring and exporting mat native datetime module components, directives, pipes, and providers.
 * @zh Angular 模块 `MatNativeDatetimeModule`，声明并导出Material原生日期时间模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    NativeDatetimeModule,
    MatNativeDateModule
  ],
  providers: [{ provide: MAT_DATETIME_FORMATS, useValue: MAT_NATIVE_DATETIME_FORMATS }]
})
export class MatNativeDatetimeModule {
}
