/**
 * @fileoverview Module `src/tree/components/tree-viewport.component.ts` providing Signal-driven tree viewport component without MobX.
 * @zh 模块文件 `src/tree/components/tree-viewport.component.ts`，提供基于原生 Angular Signal 的树形控件滚动视口组件实现（零 MobX 依赖）。
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TREE_EVENTS } from '../constants/events';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';
import { TreeModel } from '../models/tree.model';

/**
 * Angular component `TreeViewportComponent` (selector: 'tree-viewport') providing tree viewport presentation and scroll synchronization in `src/tree/components`.
 * @zh Angular 组件 `TreeViewportComponent`（selector: 'tree-viewport'），提供树形控件视口高度计算与滚动同步逻辑。
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
  standalone: false,
})
export class TreeViewportComponent implements AfterViewInit, OnInit, OnDestroy {
  private scrollEventHandler?: ($event: Event) => void;
  private resizeObserver?: ResizeObserver;
  private disposeLayout?: () => void;
  private destroyed = false;

  /**
   * Creates an instance of `TreeViewportComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeViewportComponent` 实例，并注入视口元素、虚拟滚动及树模型服务。
   * @param elementRef - Injected or initial element ref (`ElementRef<HTMLElement>`) / 注入或传入的视口宿主元素（`ElementRef<HTMLElement>`）
   * @param virtualScroll - Injected or initial virtual scroll (`TreeVirtualScroll`) / 注入或传入的虚拟滚动服务（`TreeVirtualScroll`）
   * @param cdr - Injected or initial cdr (`ChangeDetectorRef`) / 注入或传入的变更检测引用（`ChangeDetectorRef`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的 Angular 区域（`NgZone`）
   * @param treeModel - Injected or initial tree model (`TreeModel`) / 注入或传入的树形控件模型（`TreeModel`）
   */
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    public virtualScroll: TreeVirtualScroll,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private treeModel: TreeModel,
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：初始化虚拟滚动控制器并订阅布局重算通知。
   */
  ngOnInit(): void {
    this.virtualScroll.init();
    this.disposeLayout = this.treeModel.subscribeToLayout(() => {
      if (!this.destroyed) {
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：挂载被动滚动监听与 `ResizeObserver` 自适应视口尺寸检测。
   */
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.scrollEventHandler = (): void => {
        requestAnimationFrame(() => {
          if (!this.destroyed) {
            this.setViewport();
            this.cdr.markForCheck();
          }
        });
      };
      this.elementRef.nativeElement.addEventListener('scroll', this.scrollEventHandler, { passive: true });

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          requestAnimationFrame(() => {
            if (!this.destroyed) {
              this.setViewport();
              this.cdr.markForCheck();
            }
          });
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
      }
    });

    setTimeout(() => {
      if (!this.destroyed) {
        this.setViewport();
        this.virtualScroll.fireEvent({ eventName: TREE_EVENTS.initialized });
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：清理滚动事件、`ResizeObserver` 与虚拟滚动订阅。
   */
  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.disposeLayout) {
      this.disposeLayout();
      this.disposeLayout = undefined;
    }
    this.virtualScroll.clear();
    const el: HTMLElement = this.elementRef.nativeElement;
    if (this.scrollEventHandler) {
      el.removeEventListener('scroll', this.scrollEventHandler);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  /**
   * Executes `getTotalHeight` to compute CSS height string of virtual scroll content.
   * @zh 执行 `getTotalHeight`，读取 Signal 计算得到的虚拟滚动总高度样式值。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getTotalHeight(): string {
    return this.virtualScroll.isEnabled() ? this.virtualScroll.totalHeight + 'px' : 'auto';
  }

  /**
   * Property `setViewport` throttled callback syncing viewport scroll metrics.
   * @zh 属性函数 `setViewport`，以节流方式同步视口尺寸与滚动位置。
   */
  setViewport: () => void = this.throttle(() => {
    this.virtualScroll.setViewport(this.elementRef.nativeElement);
  }, 17);

  private throttle(func: () => void, timeFrame: number): () => void {
    let lastTime = 0;
    return (): void => {
      const now = Date.now();
      if (now - lastTime >= timeFrame) {
        func();
        lastTime = now;
      }
    };
  }
}
