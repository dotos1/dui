/**
 * @fileoverview Module `projects/testdui/src/main.ts` providing main definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/main.ts`，提供主相关的定义与实现。
 */

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
