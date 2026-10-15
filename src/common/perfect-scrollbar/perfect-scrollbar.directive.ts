import PerfectScrollbar from 'perfect-scrollbar';

import { Subject, fromEvent } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import {
    Directive,
    DoCheck,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    KeyValueDiffer,
    KeyValueDiffers,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    PLATFORM_ID,
    SimpleChanges,
    booleanAttribute,
} from '@angular/core';

import { Geometry, Position } from './perfect-scrollbar.interfaces';

import {
    PERFECT_SCROLLBAR_CONFIG,
    PerfectScrollbarConfig,
    PerfectScrollbarConfigInterface,
    PerfectScrollbarEvent,
    PerfectScrollbarEvents,
} from './perfect-scrollbar.interfaces';

/**
 * Wraps the `perfect-scrollbar` library on the host element, providing custom scrollbars
 * and scroll event outputs (`psScrollY`, `psYReachEnd`, etc.).
 * @zh 在宿主元素上封装 `perfect-scrollbar` 库，提供自定义滚动条以及滚动事件输出
 * （`psScrollY`、`psYReachEnd` 等）。
 */
@Directive({
    selector: '[perfectScrollbar]',
    exportAs: 'ngxPerfectScrollbar',
})
export class PerfectScrollbarDirective implements OnInit, OnDestroy, DoCheck, OnChanges {
    private instance: PerfectScrollbar | null = null;

    private ro: ResizeObserver | null = null;

    private timeout: number | null = null;
    private animation: number | null = null;

    private configDiff: KeyValueDiffer<string, any> | null = null;

    private ngDestroy = new Subject<void>();

    /** @zh 是否禁用自定义滚动条（禁用后销毁底层 Perfect Scrollbar 实例）。 */
    @Input({ transform: booleanAttribute }) disabled: boolean = false;

    /** @zh 传给底层 Perfect Scrollbar 实例的配置项。 */
    @Input('perfectScrollbar') config?: PerfectScrollbarConfigInterface;

    /** @zh 垂直滚动时发出。 */
    @Output() psScrollY = new EventEmitter<any>();
    /** @zh 水平滚动时发出。 */
    @Output() psScrollX = new EventEmitter<any>();

    /** @zh 向上滚动时发出。 */
    @Output() psScrollUp = new EventEmitter<any>();
    /** @zh 向下滚动时发出。 */
    @Output() psScrollDown = new EventEmitter<any>();
    /** @zh 向左滚动时发出。 */
    @Output() psScrollLeft = new EventEmitter<any>();
    /** @zh 向右滚动时发出。 */
    @Output() psScrollRight = new EventEmitter<any>();

    /** @zh 垂直方向滚动到底部时发出。 */
    @Output() psYReachEnd = new EventEmitter<any>();
    /** @zh 垂直方向滚动到顶部时发出。 */
    @Output() psYReachStart = new EventEmitter<any>();
    /** @zh 水平方向滚动到右侧末端时发出。 */
    @Output() psXReachEnd = new EventEmitter<any>();
    /** @zh 水平方向滚动到左侧起始位置时发出。 */
    @Output() psXReachStart = new EventEmitter<any>();

    constructor(
        private zone: NgZone,
        private differs: KeyValueDiffers,
        public elementRef: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional()
        @Inject(PERFECT_SCROLLBAR_CONFIG)
        private defaults: PerfectScrollbarConfigInterface,
    ) {}

    ngOnInit(): void {
        if (!this.disabled && isPlatformBrowser(this.platformId)) {
            // config 变化(ngDoCheck)或 disabled 切回 false 时 ngOnInit 会被再次
            // 调用,而上一轮 destroyScrollbar() 已经把 ngDestroy complete 了。判断要看
            // isStopped:Subject.closed 只在 unsubscribe() 后才为 true,complete()
            // 之后仍是 false(b8c5e5c 复核)。用 closed 判断等于从不重建:这一轮
            // 绑的 fromEvent 挂在已停止的 Subject 上,之后 next() 是空操作,
            // 销毁时这些监听永远解不掉,组件没了还在 emit。
            if (this.ngDestroy.isStopped) {
                this.ngDestroy = new Subject<void>();
            }
            const config = new PerfectScrollbarConfig(this.defaults);

            config.assign(this.config); // Custom configuration

            this.zone.runOutsideAngular(() => {
                this.instance = new PerfectScrollbar(this.elementRef.nativeElement, config);
            });

            if (!this.configDiff) {
                this.configDiff = this.differs.find(this.config || {}).create();

                this.configDiff.diff(this.config || {});
            }

            this.zone.runOutsideAngular(() => {
                this.ro = new ResizeObserver(() => {
                    this.update();
                });

                if (this.elementRef.nativeElement.children[0]) {
                    this.ro.observe(this.elementRef.nativeElement.children[0]);
                }

                this.ro.observe(this.elementRef.nativeElement);
            });

            this.zone.runOutsideAngular(() => {
                PerfectScrollbarEvents.forEach((eventName: PerfectScrollbarEvent) => {
                    const eventType = eventName.replace(/([A-Z])/g, c => `-${c.toLowerCase()}`);

                    fromEvent<Event>(this.elementRef.nativeElement, eventType)
                        .pipe(auditTime(20), takeUntil(this.ngDestroy))
                        .subscribe((event: Event) => {
                            this[eventName].emit(event);
                        });
                });
            });
        }
    }

    private destroyScrollbar(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.ngDestroy.next();
            this.ngDestroy.complete();

            if (this.ro) {
                this.ro.disconnect();
            }

            if (this.timeout && typeof window !== 'undefined') {
                window.clearTimeout(this.timeout);
            }

            if (this.animation && typeof window !== 'undefined') {
                window.cancelAnimationFrame(this.animation);
                this.animation = null;
            }

            this.zone.runOutsideAngular(() => {
                if (this.instance) {
                    this.instance.destroy();
                }
            });

            this.instance = null;
        }
    }

    ngOnDestroy(): void {
        this.destroyScrollbar();
    }

    ngDoCheck(): void {
        if (!this.disabled && this.configDiff && isPlatformBrowser(this.platformId)) {
            const changes = this.configDiff.diff(this.config || {});

            if (changes) {
                this.destroyScrollbar();

                this.ngOnInit();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const disabled = changes['disabled'];
        if (disabled && !disabled.isFirstChange() && isPlatformBrowser(this.platformId)) {
            if (disabled.currentValue !== disabled.previousValue) {
                if (disabled.currentValue === true) {
                    this.destroyScrollbar();
                } else if (disabled.currentValue === false) {
                    this.ngOnInit();
                }
            }
        }
    }

    /**
     * Returns the underlying `perfect-scrollbar` library instance, or `null` if not initialized.
     * @zh 返回底层 `perfect-scrollbar` 库实例，未初始化时返回 `null`。
     */
    public ps(): PerfectScrollbar | null {
        return this.instance;
    }

    /**
     * Recalculates the scrollbar geometry (debounced); call after content size changes.
     * @zh 重新计算滚动条几何信息（带防抖）；在内容尺寸变化后调用。
     */
    public update(): void {
        if (typeof window !== 'undefined') {
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }

            this.timeout = window.setTimeout(() => {
                if (!this.disabled && this.configDiff) {
                    try {
                        this.zone.runOutsideAngular(() => {
                            if (this.instance) {
                                this.instance.update();
                            }
                        });
                    } catch (error) {
                        // Update can be finished after destroy so catch errors
                    }
                }
            }, 0);
        }
    }

    /**
     * Returns the host element's current scroll position/size as a {@link Geometry}, using the
     * given DOM property prefix (`scroll`/`offset`/`client`).
     * @zh 使用给定的 DOM 属性前缀（`scroll`/`offset`/`client`），
     * 以 {@link Geometry} 形式返回宿主元素当前的滚动位置/尺寸。
     */
    public geometry(prefix: string = 'scroll'): Geometry {
        return new Geometry(
            this.elementRef.nativeElement[prefix + 'Left'],
            this.elementRef.nativeElement[prefix + 'Top'],
            this.elementRef.nativeElement[prefix + 'Width'],
            this.elementRef.nativeElement[prefix + 'Height'],
        );
    }

    /**
     * Returns the current scroll position, either relative to the scrollbar's "reach" state
     * or absolute (native `scrollLeft`/`scrollTop`) if `absolute` is `true`.
     * @zh 返回当前滚动位置；默认相对于滚动条的"到达边缘"状态，`absolute` 为 `true` 时
     * 返回绝对位置（原生 `scrollLeft`/`scrollTop`）。
     */
    public position(absolute: boolean = false): Position {
        if (!absolute && this.instance) {
            return new Position(this.instance.reach.x || 0, this.instance.reach.y || 0);
        } else {
            return new Position(this.elementRef.nativeElement.scrollLeft, this.elementRef.nativeElement.scrollTop);
        }
    }

    /**
     * Whether the host element is currently scrollable in the given direction
     * (`'any'`, `'both'`, `'x'`, or `'y'`).
     * @zh 宿主元素当前在给定方向上是否可滚动（`'any'`、`'both'`、`'x'` 或 `'y'`）。
     */
    public scrollable(direction: string = 'any'): boolean {
        const element = this.elementRef.nativeElement;

        if (direction === 'any') {
            return element.classList.contains('ps--active-x') || element.classList.contains('ps--active-y');
        } else if (direction === 'both') {
            return element.classList.contains('ps--active-x') && element.classList.contains('ps--active-y');
        } else {
            return element.classList.contains('ps--active-' + direction);
        }
    }

    /**
     * Scrolls to the given `x`/`y` position, optionally animated over `speed` ms. If only `x` is
     * given, it's treated as a vertical (`scrollTop`) target.
     * @zh 滚动到给定的 `x`/`y` 位置，可选地在 `speed` 毫秒内动画过渡。若只提供 `x`，
     * 则视为垂直方向（`scrollTop`）目标。
     */
    public scrollTo(x: number, y?: number, speed?: number): void {
        if (!this.disabled) {
            if (y == null && speed == null) {
                this.animateScrolling('scrollTop', x, speed);
            } else {
                if (x != null) {
                    this.animateScrolling('scrollLeft', x, speed);
                }

                if (y != null) {
                    this.animateScrolling('scrollTop', y, speed);
                }
            }
        }
    }

    /**
     * Scrolls horizontally to the given `x` position, optionally animated over `speed` ms.
     * @zh 水平滚动到给定的 `x` 位置，可选地在 `speed` 毫秒内动画过渡。
     */
    public scrollToX(x: number, speed?: number): void {
        this.animateScrolling('scrollLeft', x, speed);
    }

    /**
     * Scrolls vertically to the given `y` position, optionally animated over `speed` ms.
     * @zh 垂直滚动到给定的 `y` 位置，可选地在 `speed` 毫秒内动画过渡。
     */
    public scrollToY(y: number, speed?: number): void {
        this.animateScrolling('scrollTop', y, speed);
    }

    /**
     * Scrolls to the top, offset by `offset` pixels, optionally animated over `speed` ms.
     * @zh 滚动到顶部（可偏移 `offset` 像素），可选地在 `speed` 毫秒内动画过渡。
     */
    public scrollToTop(offset?: number, speed?: number): void {
        this.animateScrolling('scrollTop', offset || 0, speed);
    }

    /**
     * Scrolls to the left edge, offset by `offset` pixels, optionally animated over `speed` ms.
     * @zh 滚动到左侧边缘（可偏移 `offset` 像素），可选地在 `speed` 毫秒内动画过渡。
     */
    public scrollToLeft(offset?: number, speed?: number): void {
        this.animateScrolling('scrollLeft', offset || 0, speed);
    }

    /**
     * Scrolls to the right edge, offset by `offset` pixels, optionally animated over `speed` ms.
     * @zh 滚动到右侧边缘（可偏移 `offset` 像素），可选地在 `speed` 毫秒内动画过渡。
     */
    public scrollToRight(offset?: number, speed?: number): void {
        const left = this.elementRef.nativeElement.scrollWidth - this.elementRef.nativeElement.clientWidth;

        this.animateScrolling('scrollLeft', left - (offset || 0), speed);
    }

    /**
     * Scrolls to the bottom edge, offset by `offset` pixels, optionally animated over `speed` ms.
     * @zh 滚动到底部边缘（可偏移 `offset` 像素），可选地在 `speed` 毫秒内动画过渡。
     */
    public scrollToBottom(offset?: number, speed?: number): void {
        const top = this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.clientHeight;

        this.animateScrolling('scrollTop', top - (offset || 0), speed);
    }

    /**
     * Scrolls the given element (or CSS selector resolved within the host) into view,
     * offset by `offset` pixels, optionally animated over `speed` ms.
     * @zh 将给定元素（或在宿主内解析的 CSS 选择器）滚动到可视区域内，
     * 可偏移 `offset` 像素，可选地在 `speed` 毫秒内动画过渡。
     */
    public scrollToElement(element: HTMLElement | string, offset?: number, speed?: number): void {
        if (typeof element === 'string') {
            element = this.elementRef.nativeElement.querySelector(element) as HTMLElement;
        }

        if (element) {
            const elementPos = element.getBoundingClientRect();

            const scrollerPos = this.elementRef.nativeElement.getBoundingClientRect();

            if (this.elementRef.nativeElement.classList.contains('ps--active-x')) {
                const currentPos = this.elementRef.nativeElement['scrollLeft'];

                const position = elementPos.left - scrollerPos.left + currentPos;

                this.animateScrolling('scrollLeft', position + (offset || 0), speed);
            }

            if (this.elementRef.nativeElement.classList.contains('ps--active-y')) {
                const currentPos = this.elementRef.nativeElement['scrollTop'];

                const position = elementPos.top - scrollerPos.top + currentPos;

                this.animateScrolling('scrollTop', position + (offset || 0), speed);
            }
        }
    }

    private animateScrolling(target: string, value: number, speed?: number): void {
        if (this.animation) {
            window.cancelAnimationFrame(this.animation);

            this.animation = null;
        }

        if (!speed || typeof window === 'undefined') {
            this.elementRef.nativeElement[target] = value;
        } else if (value !== this.elementRef.nativeElement[target]) {
            let newValue = 0;
            let scrollCount = 0;

            let oldTimestamp = performance.now();
            let oldValue = this.elementRef.nativeElement[target];

            const cosParameter = (oldValue - value) / 2;

            const step = (newTimestamp: number) => {
                scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));

                newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

                // Only continue animation if scroll position has not changed
                if (this.elementRef.nativeElement[target] === oldValue) {
                    if (scrollCount >= Math.PI) {
                        this.animateScrolling(target, value, 0);
                    } else {
                        this.elementRef.nativeElement[target] = newValue;

                        // On a zoomed out page the resulting offset may differ
                        oldValue = this.elementRef.nativeElement[target];

                        oldTimestamp = newTimestamp;

                        this.animation = window.requestAnimationFrame(step);
                    }
                }
            };

            this.animation = window.requestAnimationFrame(step);
        }
    }
}
