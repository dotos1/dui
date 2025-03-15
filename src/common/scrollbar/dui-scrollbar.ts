import { Component, effect, untracked, viewChild, Signal, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ViewportAdapter } from './viewport';
import { DuiScrollbarCore } from './dui-scrollbar-core';
import { DUI_SCROLLBAR } from './utils/scrollbar-base';
import { Scrollbars } from './scrollbars/scrollbars';

@Component({
  standalone: true,
  selector: 'dui-scrollbar:not([externalViewport])',
  exportAs: 'ngScrollbar',
  imports: [Scrollbars],
  template: `
    <div #contentWrapper>
      <ng-content/>
      <scrollbars/>
    </div>
  `,
  styleUrls: ['./dui-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DUI_SCROLLBAR, useExisting: DuiScrollbar },
    ViewportAdapter
  ]
})
export class DuiScrollbar extends DuiScrollbarCore {

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
