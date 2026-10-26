/**
 * @fileoverview Module `src/form/daterangepicker/daterangepicker.module.ts` providing daterangepicker module definitions and implementation.
 * @zh 模块文件 `src/form/daterangepicker/daterangepicker.module.ts`，提供daterangepicker模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DaterangepickerComponent } from './daterangepicker.component';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { LocaleConfig, LOCALE_CONFIG } from './daterangepicker.config';
import { LocaleService } from './locale.service';

/**
 * Angular module `NgxDaterangepickerMd` declaring and exporting ngx daterangepicker md components, directives, pipes, and providers.
 * @zh Angular 模块 `NgxDaterangepickerMd`，声明并导出NgxDaterangepickerMd相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [DaterangepickerComponent, DaterangepickerDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [],
  exports: [DaterangepickerComponent, DaterangepickerDirective]
})
export class NgxDaterangepickerMd {
  /**
   * Creates an instance of `NgxDaterangepickerMd` and initializes its dependencies and internal state.
   * @zh 创建 `NgxDaterangepickerMd` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {}

  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`LocaleConfig`) / 配置参数（`LocaleConfig`）
   * @returns Result of type `ModuleWithProviders<NgxDaterangepickerMd>` / 类型为 `ModuleWithProviders<NgxDaterangepickerMd>` 的返回值
   */
  static forRoot(config: LocaleConfig = {}): ModuleWithProviders<NgxDaterangepickerMd> {
    return {
      ngModule: NgxDaterangepickerMd,
      providers: [
        { provide: LOCALE_CONFIG, useValue: config },
        { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
      ]
    };
  }
}
