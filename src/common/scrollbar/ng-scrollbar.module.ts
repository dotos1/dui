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

export function provideScrollbarOptions(options: NgScrollbarOptions): Provider[] {
  return [
    {
      provide: NG_SCROLLBAR_OPTIONS,
      useValue: { ...defaultOptions, ...options }
    }
  ]
}

export function provideScrollbarPolyfill(url: string): Provider[] {
  return [
    {
      provide: NG_SCROLLBAR_POLYFILL,
      useValue: url
    }
  ]
}
