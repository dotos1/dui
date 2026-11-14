/**
 * @fileoverview Module `src/micro-app/micro-app.module.ts` providing NgModule wrapper `DuiMicroAppModule`.
 * @zh 模块文件 `src/micro-app/micro-app.module.ts`，提供向后兼容 NgModule 导入的包装模块 `DuiMicroAppModule`。
 */

import { NgModule } from '@angular/core';
import { DuiMicroAppComponent } from './micro-app.component';

/**
 * Compatibility NgModule importing and re-exporting standalone `DuiMicroAppComponent`.
 * @zh 兼容传统 NgModule 消费者的微应用包装模块，导入并重导出 `DuiMicroAppComponent`。
 */
@NgModule({
  imports: [DuiMicroAppComponent],
  exports: [DuiMicroAppComponent],
})
export class DuiMicroAppModule {}
