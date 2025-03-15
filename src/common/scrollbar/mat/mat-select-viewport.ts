import { Directive, effect, inject, untracked } from '@angular/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { _DuiScrollbar, DUI_SCROLLBAR } from '../utils/scrollbar-base';

@Directive({
  standalone: true,
  selector: 'dui-scrollbar[matSelectViewport]'
})
export class DuiScrollbarMatSelectViewport {

  private readonly scrollbar: _DuiScrollbar = inject(DUI_SCROLLBAR, { self: true });

  private readonly matSelect: MatSelect = inject(MatSelect);

  constructor() {
    effect(() => {
      const isVerticallyScrollable: boolean = this.scrollbar.isVerticallyScrollable();

      untracked(() => {
        if (isVerticallyScrollable && this.matSelect.panelOpen) {
          const selected: MatOption | MatOption[] = this.matSelect.selected;
          if (selected) {
            const element: HTMLElement = Array.isArray(selected) ? selected[0]._getHostElement() : selected._getHostElement();
            const height: number = this.scrollbar.nativeElement.clientHeight;
            this.scrollbar.viewport.scrollYTo(element.offsetTop + element.offsetHeight - height);
          }
        }
      });
    });
  }
}
