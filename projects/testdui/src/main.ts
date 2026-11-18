/**
 * @fileoverview Module `projects/testdui/src/main.ts` providing main definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/main.ts`，提供主相关的定义与实现。
 */

// 显式加载 JIT 编译器：文档站「在线代码实时沙箱」在 production 构建下也要用 ɵcompileComponent 运行时编译模板
import '@angular/compiler';
import { provideZoneChangeDetection } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

platformBrowser()
  .bootstrapModule(AppModule, {
    applicationProviders: [provideZoneChangeDetection({ eventCoalescing: true })],
  })
  .catch((err: unknown) => console.error(err));
