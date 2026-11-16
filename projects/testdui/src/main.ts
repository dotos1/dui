/**
 * @fileoverview Module `projects/testdui/src/main.ts` providing main definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/main.ts`，提供主相关的定义与实现。
 */

import { provideZoneChangeDetection } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

platformBrowser()
  .bootstrapModule(AppModule, {
    applicationProviders: [provideZoneChangeDetection({ eventCoalescing: true })],
  })
  .catch((err: unknown) => console.error(err));
