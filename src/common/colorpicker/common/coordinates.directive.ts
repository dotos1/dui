/**
 * @fileoverview Module `src/common/colorpicker/common/coordinates.directive.ts` providing coordinates directive definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/coordinates.directive.ts`，提供坐标指令相关的定义与实现。
 */

import {  Directive,  ElementRef,  HostListener,  NgModule,  OnDestroy,  OnInit,  Output,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * Tracks mouse/touch drag coordinates relative to the host element, used by the
 * saturation/hue/alpha/shade sliders to compute their new values.
 * @zh 跟踪相对于宿主元素的鼠标/触摸拖拽坐标，供饱和度/色相/透明度/明暗滑块用来计算新值。
 */
@Directive({ selector: '[ngx-color-coordinates]' })
export class CoordinatesDirective implements OnInit, OnDestroy {
  /**
   * Output event emitter `coordinatesChange` (`Subject<{…}>`) firing when coordinates change occurs.
   * @zh 拖拽/点击坐标（相对宿主元素）变化时发出。
   * @zh 拖拽/点击坐标（相对宿主元素）变化时发出。
   */
  @Output()
  coordinatesChange = new Subject<{
    x: number;
    y: number;
    top: number;
    left: number;
    containerWidth: number;
    containerHeight: number;
    $event;
  }>();
  /**
   * Property `mousechange` (`Subject<{ x: number; y: number; $event: any; isTouch: boolean; }>`) storing mousechange.
   * @zh 属性 `mousechange`（类型：`Subject<{ x: number; y: number; $event: any; isTouch: boolean; }>`），用于存储或配置mousechange。
   */
  private mousechange = new Subject<{
    x: number;
    y: number;
    $event;
    isTouch: boolean;
  }>();

  /**
   * Property `mouseListening` (`boolean`) storing mouse listening (default: `false`).
   * @zh 属性 `mouseListening`（类型：`boolean`），用于存储或配置鼠标监听（默认值：`false`）。
   */
  private mouseListening = false;
  /**
   * Property `sub` (`Subscription`) storing sub.
   * @zh 属性 `sub`（类型：`Subscription`），用于存储或配置子。
   */
  private sub: Subscription;
  /**
   * @hidden Handles pointer/touch movement while dragging, forwarding raw coordinates.
   * @zh 内部使用，处理拖拽过程中的指针/触摸移动，转发原始坐标。
   */
  @HostListener('window:mousemove', ['$event', '$event.pageX', '$event.pageY'])
  @HostListener('window:touchmove', [
    '$event',
    '$event.touches[0].clientX',
    '$event.touches[0].clientY',
    'true',
  ])
  mousemove($event: Event, x: number, y: number, isTouch = false) {
    if (this.mouseListening) {
      $event.preventDefault();
      this.mousechange.next({ $event, x, y, isTouch });
    }
  }
  /**
   * @hidden Stops listening to pointer/touch movement.
   * @zh 内部使用，停止监听指针/触摸移动。
   */
  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  mouseup() {
    this.mouseListening = false;
  }
  /**
   * @hidden Starts a drag: begins listening to pointer/touch movement.
   * @zh 内部使用，开始一次拖拽：开始监听指针/触摸移动。
   */
  @HostListener('mousedown', ['$event', '$event.pageX', '$event.pageY'])
  @HostListener('touchstart', [
    '$event',
    '$event.touches[0].clientX',
    '$event.touches[0].clientY',
    'true',
  ])
  mousedown($event: Event, x: number, y: number, isTouch = false) {
    $event.preventDefault();
    this.mouseListening = true;
    this.mousechange.next({ $event, x, y, isTouch });
  }

  /**
   * Creates an instance of `CoordinatesDirective` and initializes its dependencies and internal state.
   * @zh 创建 `CoordinatesDirective` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   */
  constructor(private el: ElementRef) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.sub = this.mousechange
      .pipe(
        // limit times it is updated for the same area
        distinctUntilChanged((p, q) => p.x === q.x && p.y === q.y),
      )
      .subscribe(n => this.handleChange(n.x, n.y, n.$event, n.isTouch));
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /**
   * Converts raw page coordinates into container-relative top/left/width/height and
   * emits `coordinatesChange`.
   * @zh 将原始页面坐标转换为相对容器的 top/left/宽/高，并发出 `coordinatesChange`。
   */
  handleChange(x: number, y: number, $event: Event, isTouch: boolean) {
    const containerWidth = this.el.nativeElement.clientWidth;
    const containerHeight = this.el.nativeElement.clientHeight;
    const left =
      x -
      (this.el.nativeElement.getBoundingClientRect().left + window.pageXOffset);
    let top = y - this.el.nativeElement.getBoundingClientRect().top;

    if (!isTouch) {
      top = top - window.pageYOffset;
    }
    this.coordinatesChange.next({
      x,
      y,
      top,
      left,
      containerWidth,
      containerHeight,
      $event,
    });
  }
}

/**
 * Angular module `CoordinatesModule` declaring and exporting coordinates module components, directives, pipes, and providers.
 * @zh Angular 模块 `CoordinatesModule`，声明并导出坐标模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [CoordinatesDirective],
  exports: [CoordinatesDirective],
})
export class CoordinatesModule {}
