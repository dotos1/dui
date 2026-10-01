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
  /** @zh 拖拽/点击坐标（相对宿主元素）变化时发出。 */
  @Output()
  coordinatesChange = new Subject<{
    x: number;
    y: number;
    top: number;
    left: number;
    containerWidth: number;
    containerHeight: number;
    $event: any;
  }>();
  private mousechange = new Subject<{
    x: number;
    y: number;
    $event: any;
    isTouch: boolean;
  }>();

  private mouseListening = false;
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

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.sub = this.mousechange
      .pipe(
        // limit times it is updated for the same area
        distinctUntilChanged((p, q) => p.x === q.x && p.y === q.y),
      )
      .subscribe(n => this.handleChange(n.x, n.y, n.$event, n.isTouch));
  }

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

@NgModule({
  declarations: [CoordinatesDirective],
  exports: [CoordinatesDirective],
})
export class CoordinatesModule {}
