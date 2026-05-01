import {
  Component, ElementRef,   AfterViewInit, OnInit, OnDestroy, HostListener,
  ChangeDetectionStrategy, NgZone
} from '@angular/core';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';
import { TREE_EVENTS } from '../constants/events';

@Component({
  selector: 'tree-viewport',
  styles: [],
  providers: [TreeVirtualScroll],
     changeDetection: ChangeDetectionStrategy.OnPush, 
  templateUrl: 'tree-viewport.component.html',
  host: { 
    hostID: 'tree-viewport' + Math.random().toString(36).substring(2, 15),

  }
})

export class TreeViewportComponent implements AfterViewInit, OnInit, OnDestroy {


  private readonly scrollEventHandler: ($event: Event) => void;

  constructor(
    private elementRef: ElementRef,
    public virtualScroll: TreeVirtualScroll,
    private ngZone: NgZone) {
      this.scrollEventHandler = this.setViewport.bind(this);
  }

  ngOnInit() {
    this.virtualScroll.init();
  }

  ngAfterViewInit() {
     this.ngZone.runOutsideAngular(() => {
      this.elementRef.nativeElement.addEventListener('scroll', this.scrollEventHandler, { passive: true });
    });
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

  onScroll(e) {
    this.setViewport();
  }
  setViewport() {
      this.virtualScroll.setViewport(this.elementRef.nativeElement);
  }
}
