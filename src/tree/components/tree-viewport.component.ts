import {
  Component, ElementRef,   AfterViewInit, OnInit, OnDestroy, HostListener, 
} from '@angular/core';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';
import { TREE_EVENTS } from '../constants/events';

@Component({
  selector: 'tree-viewport',
  styles: [],
  providers: [TreeVirtualScroll],
  templateUrl: 'tree-viewport.component.html',
  
})

export class TreeViewportComponent implements AfterViewInit, OnInit, OnDestroy {


  private readonly scrollEventHandler: ($event: Event) => void;

  constructor(
    private elementRef: ElementRef,
    public virtualScroll: TreeVirtualScroll) {
      this.scrollEventHandler = this.setViewport.bind(this);
  }

  ngOnInit() {
    this.virtualScroll.init();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setViewport();
      this.virtualScroll.fireEvent({ eventName: TREE_EVENTS.initialized });
    });
  }

  ngOnDestroy() {
    this.virtualScroll.clear();
    let el: HTMLElement = this.elementRef.nativeElement;
    el.removeEventListener('scroll', this.scrollEventHandler);
  }

  getTotalHeight() {
    return this.virtualScroll.isEnabled() && this.virtualScroll.totalHeight + 'px' || '100%';
  }

  @HostListener('scroll', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onScroll(e) {
    this.setViewport();
  }
  setViewport() {
      this.virtualScroll.setViewport(this.elementRef.nativeElement);
  }
}
