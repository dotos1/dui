import {
  Component, ElementRef,   AfterViewInit, OnInit, OnDestroy, HostListener,
  ChangeDetectionStrategy, NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';
import { TREE_EVENTS } from '../constants/events';
import { autorun } from 'mobx';
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

 private scrollEventHandler: ($event: Event) => void;
  private resizeObserver: ResizeObserver; 
  private disposeAutorun: any; 

  constructor(
    private elementRef: ElementRef,
    public virtualScroll: TreeVirtualScroll,
    private cdr: ChangeDetectorRef ,
    private ngZone: NgZone) {
   
  }

  ngOnInit() {
    this.virtualScroll.init();
       this.ngZone.runOutsideAngular(() => {
      this.disposeAutorun = autorun(() => {

        requestAnimationFrame(() => {
          this.ngZone.run(() => {
            if (this.cdr && !(this.cdr as any).destroyed) {
              this.cdr.markForCheck();
              this.cdr.detectChanges();
            }
          });
        });
      });
    });
  }

  ngAfterViewInit() {
     this.ngZone.runOutsideAngular(() => {
      this.scrollEventHandler = () => {
        requestAnimationFrame(() => this.setViewport());
      };
     this.elementRef.nativeElement.addEventListener('scroll', this.scrollEventHandler, { passive: true });
      
      this.resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => this.setViewport());
      });
      this.resizeObserver.observe(this.elementRef.nativeElement);
    });

    setTimeout(() => {
      this.setViewport();
      this.virtualScroll.fireEvent({ eventName: TREE_EVENTS.initialized });
    });
  }

  ngOnDestroy() {
     if (this.disposeAutorun) {
      this.disposeAutorun();
    }
    this.virtualScroll.clear();
    let el: HTMLElement = this.elementRef.nativeElement;
    el.removeEventListener('scroll', this.scrollEventHandler);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  getTotalHeight() {
    return this.virtualScroll.isEnabled() ? this.virtualScroll.totalHeight + 'px' : 'auto';
  }


  setViewport = this.throttle(() => {
    this.virtualScroll.setViewport(this.elementRef.nativeElement);
  }, 17);
  
    private throttle(func, timeFrame) {
    let lastTime = 0;
    return function () {
      let now = Date.now();
      if (now - lastTime >= timeFrame) {
        func();
        lastTime = now;
      }
    };
  }
}
