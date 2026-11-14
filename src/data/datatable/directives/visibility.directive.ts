/**
 * @fileoverview Module `src/data/datatable/directives/visibility.directive.ts` providing visibility directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/directives/visibility.directive.ts`，提供visibility指令相关的定义与实现。
 */

import {
  Directive, Output, EventEmitter, ElementRef, HostBinding, NgZone, OnInit, OnDestroy
} from '@angular/core';

/**
 * Angular directive `VisibilityDirective` (selector: '[visibilityObserver]') attaching visibility directive behavior to host DOM elements.
 * @zh Angular 指令 `VisibilityDirective`（selector: '[visibilityObserver]'），为宿主 DOM 元素附加Visibility指令行为。
 */
@Directive({ selector: '[visibilityObserver]', standalone: false })
export class VisibilityDirective implements OnInit, OnDestroy {
  /**
   * Host binding `isVisible` bound to host attribute/property `class.visible` for is visible.
   * @zh 宿主绑定属性 `isVisible`，绑定至宿主元素 `class.visible` 以控制是否为可见。
   */
  @HostBinding('class.visible')
  isVisible: boolean = false;

  /**
   * Output event emitter `visible` (`EventEmitter<any>`) firing when visible occurs.
   * @zh 输出事件 `visible`（类型：`EventEmitter<any>`），当触发可见时向外发出事件。
   */
  @Output() visible = new EventEmitter();

  /**
   * Property `timeout` (`any`) storing timeout.
   * @zh 属性 `timeout`（类型：`any`），用于存储或配置延时器。
   */
  timeout;

  /**
   * Creates an instance of `VisibilityDirective` and initializes its dependencies and internal state.
   * @zh 创建 `VisibilityDirective` 实例，并初始化其依赖项与内部状态。
   * @param element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   */
  constructor(private element: ElementRef, private zone: NgZone) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.runCheck();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  /**
   * Executes `onVisibilityChange` to handle on visibility change.
   * @zh 执行 `onVisibilityChange`，用于当Visibility变更。
   */
  onVisibilityChange(): void {
    // trigger zone recalc for columns
    this.zone.run(() => {
      this.isVisible = true;
      this.visible.emit(true);
    });
  }

  /**
   * Executes `runCheck` to handle run check.
   * @zh 执行 `runCheck`，用于运行检查。
   */
  runCheck(): void {
    const check = () => {
      // https://davidwalsh.name/offsetheight-visibility
      const { offsetHeight, offsetWidth } = this.element.nativeElement;

      if (offsetHeight && offsetWidth) {
        clearTimeout(this.timeout);
        this.onVisibilityChange();
      } else {
        clearTimeout(this.timeout);
        this.zone.runOutsideAngular(() => {
          this.timeout = setTimeout(() => check(), 50);
        });
      }
    };

    this.timeout = setTimeout(() => check());
  }
}
