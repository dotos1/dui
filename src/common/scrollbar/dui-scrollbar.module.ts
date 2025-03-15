import { NgModule, Provider } from '@angular/core';
import { DuiScrollbar } from './dui-scrollbar';
import { ScrollViewport } from './viewport';
import { DuiScrollbarExt } from './dui-scrollbar-ext';
import { DUI_SCROLLBAR_OPTIONS, DUI_SCROLLBAR_POLYFILL, DuiScrollbarOptions } from './dui-scrollbar.model';
import { AsyncDetection } from './async-detection';
import { defaultOptions } from './dui-scrollbar.default';
import { SyncSpacer } from './sync-spacer';

@NgModule({
  imports: [
    DuiScrollbar,
    ScrollViewport,
    DuiScrollbarExt,
    AsyncDetection,
    SyncSpacer
  ],
  exports: [
    DuiScrollbar,
    ScrollViewport,
    DuiScrollbarExt,
    AsyncDetection,
    SyncSpacer
  ]
})
export class DuiScrollbarModule {
}

export function provideScrollbarOptions(options: DuiScrollbarOptions): Provider[] {
  return [
    {
      provide: DUI_SCROLLBAR_OPTIONS,
      useValue: { ...defaultOptions, ...options }
    }
  ]
}

export function provideScrollbarPolyfill(url: string): Provider[] {
  return [
    {
      provide: DUI_SCROLLBAR_POLYFILL,
      useValue: url
    }
  ]
}
