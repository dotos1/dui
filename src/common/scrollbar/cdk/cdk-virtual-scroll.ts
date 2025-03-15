import { Directive, inject, effect, untracked, contentChild, Signal } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DuiScrollbarExt } from '../dui-scrollbar-ext';

@Directive({
  standalone: true,
  selector: 'dui-scrollbar[cdkVirtualScrollViewport]'
})
export class DuiScrollbarCdkVirtualScroll {

  private readonly scrollbar: DuiScrollbarExt = inject(DuiScrollbarExt, { self: true });

  private readonly virtualScrollViewportRef: Signal<CdkVirtualScrollViewport> = contentChild(CdkVirtualScrollViewport);

  constructor() {
    this.scrollbar.skipInit = true;

    effect(() => {
      const virtualScrollViewport: CdkVirtualScrollViewport = this.virtualScrollViewportRef();

      untracked(() => {
        if (virtualScrollViewport) {
          const viewport: HTMLElement = virtualScrollViewport.elementRef.nativeElement;
          const contentWrapper: HTMLElement = virtualScrollViewport._contentWrapper.nativeElement;
          const spacer: HTMLElement = virtualScrollViewport.elementRef.nativeElement.querySelector('.cdk-virtual-scroll-spacer');

          this.scrollbar.skipInit = false;
          this.scrollbar.altViewport.set(viewport);
          this.scrollbar.altContentWrapper.set(contentWrapper);
          this.scrollbar.altSpacer.set(spacer);
        }
      });
    });
  }
}
