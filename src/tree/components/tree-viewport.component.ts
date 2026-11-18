/**
 * @fileoverview Module `src/tree/components/tree-viewport.component.ts` providing tree viewport component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree-viewport.component.ts`，提供树形控件视口组件相关的定义与实现。
 */

import {
  Component, ElementRef, AfterViewInit, OnInit, OnDestroy, HostListener,
  ChangeDetectionStrategy, NgZone,
  ChangeDetectorRef, ViewRef
} from '@angular/core';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';
import { TREE_EVENTS } from '../constants/events';
import { autorun } from 'mobx';
/**
 * Angular component `TreeViewportComponent` (selector: 'tree-viewport') providing tree viewport component presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeViewportComponent`（selector: 'tree-viewport'），提供树形控件视口组件的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'tree-viewport',
  styles: [],
  providers: [TreeVirtualScroll],
  changeDetection: ChangeDetectionStrategy.OnPush, 
  templateUrl: 'tree-viewport.component.html',
  host: { 
    hostID: 'tree-viewport' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})

export class TreeViewportComponent implements AfterViewInit, OnInit, OnDestroy {

 /**
  * Property `scrollEventHandler` (`($event: Event) => void`) storing scroll event handler.
  * @zh 属性 `scrollEventHandler`（类型：`($event: Event) => void`），用于存储或配置滚动事件处理器。
  */
 private scrollEventHandler: ($event: Event) => void;
  /**
   * Property `resizeObserver` (`ResizeObserver`) storing resize observer.
   * @zh 属性 `resizeObserver`（类型：`ResizeObserver`），用于存储或配置调整尺寸观察者。
   */
  private resizeObserver: ResizeObserver; 
  /**
   * Property `disposeAutorun` (`() => void`) storing dispose autorun.
   * @zh 属性 `disposeAutorun`（类型：`() => void`），用于存储或配置释放Autorun。
   */
  private disposeAutorun: () => void;

  /**
   * Creates an instance of `TreeViewportComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeViewportComponent` 实例，并初始化其依赖项与内部状态。
   * @param elementRef - Injected or initial element ref (`ElementRef<HTMLElement>`) / 注入或传入的元素引用（`ElementRef<HTMLElement>`）
   * @param virtualScroll - Injected or initial virtual scroll (`TreeVirtualScroll`) / 注入或传入的虚拟滚动滚动（`TreeVirtualScroll`）
   * @param cdr - Injected or initial cdr (`ChangeDetectorRef`) / 注入或传入的cdr（`ChangeDetectorRef`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    public virtualScroll: TreeVirtualScroll,
    private cdr: ChangeDetectorRef ,
    private ngZone: NgZone) {
   
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.virtualScroll.init();
       this.ngZone.runOutsideAngular(() => {
      this.disposeAutorun = autorun(() => {

        requestAnimationFrame(() => {
          this.ngZone.run(() => {
            if (this.cdr && !(this.cdr as ViewRef).destroyed) {
              this.cdr.markForCheck();
              this.cdr.detectChanges();
            }
          });
        });
      });
    });
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
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

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
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

  /**
   * Executes `getTotalHeight` to handle get total height.
   * @zh 执行 `getTotalHeight`，用于获取总计高度。
   */
  getTotalHeight() {
    return this.virtualScroll.isEnabled() ? this.virtualScroll.totalHeight + 'px' : 'auto';
  }


  /**
   * Property `setViewport` (`() => void`) storing set viewport.
   * @zh 属性 `setViewport`（类型：`() => void`），用于存储或配置集合视口。
   */
  setViewport = this.throttle(() => {
    this.virtualScroll.setViewport(this.elementRef.nativeElement);
  }, 17);
  
    /**
     * Executes `throttle` to handle throttle.
     * @zh 执行 `throttle`，用于节流。
     * @param func - func parameter (`any`) / func参数（`any`）
     * @param timeFrame - time frame parameter (`any`) / 时间框架参数（`any`）
     */
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
