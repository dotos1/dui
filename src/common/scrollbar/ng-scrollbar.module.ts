/**
 * @fileoverview Module `src/common/scrollbar/ng-scrollbar.module.ts` providing ng scrollbar module definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/ng-scrollbar.module.ts`，提供Angular滚动条模块相关的定义与实现。
 */

import { NgModule, Provider } from '@angular/core';
import { NgScrollbar } from './ng-scrollbar';
import { ScrollViewport } from './viewport';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { NG_SCROLLBAR_OPTIONS, NG_SCROLLBAR_POLYFILL, NgScrollbarOptions } from './ng-scrollbar.model';
import { AsyncDetection } from './async-detection';
import { defaultOptions } from './ng-scrollbar.default';
import { SyncSpacer } from './sync-spacer';

/**
 * Convenience `NgModule` bundling {@link NgScrollbar}, {@link ScrollViewport},
 * {@link NgScrollbarExt}, `AsyncDetection` and `SyncSpacer` (all standalone) for NgModule-based apps.
 * @zh 便捷 `NgModule`，将 {@link NgScrollbar}、{@link ScrollViewport}、{@link NgScrollbarExt}、
 * `AsyncDetection`、`SyncSpacer`（均为 standalone）打包，供基于 NgModule 的应用使用。
 */
@NgModule({
  imports: [
    NgScrollbar,
    ScrollViewport,
    NgScrollbarExt,
    AsyncDetection,
    SyncSpacer
  ],
  exports: [
    NgScrollbar,
    ScrollViewport,
    NgScrollbarExt,
    AsyncDetection,
    SyncSpacer
  ]
})
export class NgScrollbarModule {
}

/**
 * Executes `provideScrollbarOptions` to handle provide scrollbar options.
 * @zh 执行 `provideScrollbarOptions`，用于提供滚动条配置选项。
 * @param options - options parameter (`NgScrollbarOptions`) / 配置选项参数（`NgScrollbarOptions`）
 * @returns Result of type `Provider[]` / 类型为 `Provider[]` 的返回值
 */
export function provideScrollbarOptions(options: NgScrollbarOptions): Provider[] {
  return [
    {
      provide: NG_SCROLLBAR_OPTIONS,
      useValue: { ...defaultOptions, ...options }
    }
  ]
}

/**
 * Executes `provideScrollbarPolyfill` to handle provide scrollbar polyfill.
 * @zh 执行 `provideScrollbarPolyfill`，用于提供滚动条Polyfill。
 * @param url - url parameter (`string`) / 链接地址参数（`string`）
 * @returns Result of type `Provider[]` / 类型为 `Provider[]` 的返回值
 */
export function provideScrollbarPolyfill(url: string): Provider[] {
  return [
    {
      provide: NG_SCROLLBAR_POLYFILL,
      useValue: url
    }
  ]
}
