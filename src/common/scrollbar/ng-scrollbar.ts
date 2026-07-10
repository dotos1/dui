import { Component, effect, untracked, viewChild, Signal, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ViewportAdapter } from './viewport';
import { NgScrollbarCore } from './ng-scrollbar-core';
import { NG_SCROLLBAR } from './utils/scrollbar-base';
import { Scrollbars } from './scrollbars/scrollbars';

/**
 * Custom scrollbar component: wraps projected content in an internally-managed scrollable
 * viewport and renders custom scrollbar overlays over it.
 * @zh 自定义滚动条组件：将投影内容包裹在内部管理的可滚动视口中，并在其上渲染自定义滚动条覆层。
 */
@Component({
  standalone: true,
  selector: 'ng-scrollbar:not([externalViewport])',
  exportAs: 'ngScrollbar',
  imports: [Scrollbars],
  template: `
    <div #contentWrapper>
      <ng-content/>
      <scrollbars/>
    </div>
  `,
  styleUrls: ['./ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbar },
    ViewportAdapter
  ]
})
export class NgScrollbar extends NgScrollbarCore {

  contentWrapper: Signal<ElementRef<HTMLElement>> = viewChild.required('contentWrapper');

  _scrollbars: Signal<Scrollbars> = viewChild.required(Scrollbars);

  constructor() {
    effect(() => {
      const contentWrapper: HTMLElement = this.contentWrapper().nativeElement;
      untracked(() => {
        this.viewport.init(this.nativeElement, contentWrapper);
      });
    });
    super();
  }
}
