/**
 * @fileoverview Module `src/core/style/style.module.ts` providing style module definitions and implementation.
 * @zh 模块文件 `src/core/style/style.module.ts`，提供样式模块相关的定义与实现。
 */

import {NgModule} from '@angular/core';
import {CdkMonitorFocus, FOCUS_ORIGIN_MONITOR_PROVIDER} from './focus-origin-monitor';
import {PlatformModule} from '@angular/cdk/platform';
/**
 * Angular module `StyleModule` declaring and exporting style module components, directives, pipes, and providers.
 * @zh Angular 模块 `StyleModule`，声明并导出样式模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [PlatformModule],
  declarations: [CdkMonitorFocus],
  exports: [CdkMonitorFocus],
  providers: [FOCUS_ORIGIN_MONITOR_PROVIDER],
})
export class StyleModule {}