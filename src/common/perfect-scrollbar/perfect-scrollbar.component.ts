/**
 * @fileoverview Module `src/common/perfect-scrollbar/perfect-scrollbar.component.ts` providing perfect scrollbar component definitions and implementation.
 * @zh 模块文件 `src/common/perfect-scrollbar/perfect-scrollbar.component.ts`，提供perfect滚动条组件相关的定义与实现。
 */

import { Subject, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, mapTo, takeUntil } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID,
    ViewChild,
    ViewEncapsulation,
    booleanAttribute, ChangeDetectionStrategy,
} from '@angular/core';

import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';

import {
    PerfectScrollbarConfigInterface,
    PerfectScrollbarEvent,
    PerfectScrollbarEvents,
} from './perfect-scrollbar.interfaces';

/**
 * Component wrapper around {@link PerfectScrollbarDirective} that additionally renders
 * scroll-position indicator overlays and supports edge-propagation of wheel/touch scrolling.
 * @zh {@link PerfectScrollbarDirective} 的组件版封装，额外渲染滚动位置指示条覆层，
 * 并支持在到达边缘时向外传播滚轮/触摸滚动。
 */
@Component({
    selector: 'perfect-scrollbar',
    exportAs: 'ngxPerfectScrollbar',
    templateUrl: './perfect-scrollbar.component.html',
    styleUrls: [
        './perfect-scrollbar.scss',
        './perfect-scrollbar.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class PerfectScrollbarComponent implements OnInit, OnDestroy, DoCheck {
    /**
     * Property `states` (`{ left?: any; right?: any; top?: any; bottom?: any; }`) storing states (default: `{}`).
     * @zh 记录当前是否处于左/右/上/下边缘状态，驱动指示条显示。
     * @zh 记录当前是否处于左/右/上/下边缘状态，驱动指示条显示。
     */
    public states: { left?; right?; top?; bottom? } = {};

    /**
     * Property `indicatorX` (`boolean`) storing indicator x (default: `false`).
     * @zh 水平方向的边缘指示条当前是否显示。
     * @zh 水平方向的边缘指示条当前是否显示。
     */
    public indicatorX: boolean = false;
    /**
     * Property `indicatorY` (`boolean`) storing indicator y (default: `false`).
     * @zh 垂直方向的边缘指示条当前是否显示。
     * @zh 垂直方向的边缘指示条当前是否显示。
     */
    public indicatorY: boolean = false;

    /**
     * Property `interaction` (`boolean`) storing interaction (default: `false`).
     * @zh 用户当前是否正在滚轮/触摸交互中（用于边缘滚动传播判断）。
     * @zh 用户当前是否正在滚轮/触摸交互中（用于边缘滚动传播判断）。
     */
    public interaction: boolean = false;

    /**
     * Property `scrollPositionX` (`number`) storing scroll position x (default: `0`).
     * @zh 属性 `scrollPositionX`（类型：`number`），用于存储或配置滚动位置X坐标（默认值：`0`）。
     */
    private scrollPositionX: number = 0;
    /**
     * Property `scrollPositionY` (`number`) storing scroll position y (default: `0`).
     * @zh 属性 `scrollPositionY`（类型：`number`），用于存储或配置滚动位置Y坐标（默认值：`0`）。
     */
    private scrollPositionY: number = 0;

    /**
     * Property `scrollDirectionX` (`number`) storing scroll direction x (default: `0`).
     * @zh 属性 `scrollDirectionX`（类型：`number`），用于存储或配置滚动方向X坐标（默认值：`0`）。
     */
    private scrollDirectionX: number = 0;
    /**
     * Property `scrollDirectionY` (`number`) storing scroll direction y (default: `0`).
     * @zh 属性 `scrollDirectionY`（类型：`number`），用于存储或配置滚动方向Y坐标（默认值：`0`）。
     */
    private scrollDirectionY: number = 0;

    /**
     * Property `usePropagationX` (`boolean`) storing use propagation x (default: `false`).
     * @zh 属性 `usePropagationX`（类型：`boolean`），用于存储或配置使用事件冒泡X坐标（默认值：`false`）。
     */
    private usePropagationX: boolean = false;
    /**
     * Property `usePropagationY` (`boolean`) storing use propagation y (default: `false`).
     * @zh 属性 `usePropagationY`（类型：`boolean`），用于存储或配置使用事件冒泡Y坐标（默认值：`false`）。
     */
    private usePropagationY: boolean = false;

    /**
     * Property `allowPropagationX` (`boolean`) storing allow propagation x (default: `false`).
     * @zh 属性 `allowPropagationX`（类型：`boolean`），用于存储或配置允许事件冒泡X坐标（默认值：`false`）。
     */
    private allowPropagationX: boolean = false;
    /**
     * Property `allowPropagationY` (`boolean`) storing allow propagation y (default: `false`).
     * @zh 属性 `allowPropagationY`（类型：`boolean`），用于存储或配置允许事件冒泡Y坐标（默认值：`false`）。
     */
    private allowPropagationY: boolean = false;

    /**
     * Property `stateTimeout` (`number`) storing state timeout (default: `null`).
     * @zh 属性 `stateTimeout`（类型：`number`），用于存储或配置状态延时器（默认值：`null`）。
     */
    private stateTimeout: number | null = null;

    /**
     * Property `ngDestroy` (`Subject<void>`) storing ng destroy (default: `new Subject<void>()`).
     * @zh 属性 `ngDestroy`（类型：`Subject<void>`），用于存储或配置Angular销毁（默认值：`new Subject<void>()`）。
     */
    private readonly ngDestroy = new Subject<void>();

    /**
     * Property `stateUpdate` (`Subject<string>`) storing state update (default: `new Subject<string>()`).
     * @zh 属性 `stateUpdate`（类型：`Subject<string>`），用于存储或配置状态更新（默认值：`new Subject<string>()`）。
     */
    private readonly stateUpdate = new Subject<string>();

    /**
     * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
     * @zh 是否禁用自定义滚动条。
     * @zh 是否禁用自定义滚动条。
     */
    @Input({ transform: booleanAttribute }) disabled: boolean = false;

    /**
     * @zh 是否使用 Perfect Scrollbar 的默认样式类。
     * @zh 是否使用 Perfect Scrollbar 的默认样式类。
     */
    @Input({ transform: booleanAttribute }) usePSClass: boolean = true;

    /**
     * When enabled, scrolling past an edge propagates to the parent scrollable ancestor,
     * with a brief indicator shown at the edge.
     * @zh 启用后，滚动超出边缘时会向父级可滚动祖先传播，并在边缘短暂显示指示条。
     */
    @HostBinding('class.ps-show-limits')
    @Input({ transform: booleanAttribute })
    autoPropagation: boolean = false;

    /**
     * Input property `scrollIndicators` (`boolean`) configuring scroll indicators (default: `false`).
     * @zh 是否显示滚动位置指示条覆层。
     * @zh 是否显示滚动位置指示条覆层。
     */
    @HostBinding('class.ps-show-active')
    @Input({ transform: booleanAttribute })
    scrollIndicators: boolean = false;

    /**
     * @zh 传给底层 Perfect Scrollbar 实例的配置项。
     * @zh 传给底层 Perfect Scrollbar 实例的配置项。
     */
    @Input() config?: PerfectScrollbarConfigInterface;

    /**
     * Output event emitter `psScrollY` (`EventEmitter<any>`) firing when ps scroll y occurs.
     * @zh 垂直滚动时发出。
     * @zh 垂直滚动时发出。
     */
    @Output() psScrollY = new EventEmitter();
    /**
     * Output event emitter `psScrollX` (`EventEmitter<any>`) firing when ps scroll x occurs.
     * @zh 水平滚动时发出。
     * @zh 水平滚动时发出。
     */
    @Output() psScrollX = new EventEmitter();

    /**
     * Output event emitter `psScrollUp` (`EventEmitter<any>`) firing when ps scroll up occurs.
     * @zh 向上滚动时发出。
     * @zh 向上滚动时发出。
     */
    @Output() psScrollUp = new EventEmitter();
    /**
     * Output event emitter `psScrollDown` (`EventEmitter<any>`) firing when ps scroll down occurs.
     * @zh 向下滚动时发出。
     * @zh 向下滚动时发出。
     */
    @Output() psScrollDown = new EventEmitter();
    /**
     * Output event emitter `psScrollLeft` (`EventEmitter<any>`) firing when ps scroll left occurs.
     * @zh 向左滚动时发出。
     * @zh 向左滚动时发出。
     */
    @Output() psScrollLeft = new EventEmitter();
    /**
     * Output event emitter `psScrollRight` (`EventEmitter<any>`) firing when ps scroll right occurs.
     * @zh 向右滚动时发出。
     * @zh 向右滚动时发出。
     */
    @Output() psScrollRight = new EventEmitter();

    /**
     * Output event emitter `psYReachEnd` (`EventEmitter<any>`) firing when ps y reach end occurs.
     * @zh 垂直方向滚动到底部时发出。
     * @zh 垂直方向滚动到底部时发出。
     */
    @Output() psYReachEnd = new EventEmitter();
    /**
     * Output event emitter `psYReachStart` (`EventEmitter<any>`) firing when ps y reach start occurs.
     * @zh 垂直方向滚动到顶部时发出。
     * @zh 垂直方向滚动到顶部时发出。
     */
    @Output() psYReachStart = new EventEmitter();
    /**
     * Output event emitter `psXReachEnd` (`EventEmitter<any>`) firing when ps x reach end occurs.
     * @zh 水平方向滚动到右侧末端时发出。
     * @zh 水平方向滚动到右侧末端时发出。
     */
    @Output() psXReachEnd = new EventEmitter();
    /**
     * Output event emitter `psXReachStart` (`EventEmitter<any>`) firing when ps x reach start occurs.
     * @zh 水平方向滚动到左侧起始位置时发出。
     * @zh 水平方向滚动到左侧起始位置时发出。
     */
    @Output() psXReachStart = new EventEmitter();

    /**
     * @zh 内部使用的底层 {@link PerfectScrollbarDirective} 引用。
     * @zh 内部使用的底层 {@link PerfectScrollbarDirective} 引用。
     */
    @ViewChild(PerfectScrollbarDirective, { static: true })
    directiveRef?: PerfectScrollbarDirective;

    /**
     * Creates an instance of `PerfectScrollbarComponent` and initializes its dependencies and internal state.
     * @zh 创建 `PerfectScrollbarComponent` 实例，并初始化其依赖项与内部状态。
     * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
     * @param cdRef - Injected or initial cd ref (`ChangeDetectorRef`) / 注入或传入的cd引用（`ChangeDetectorRef`）
     * @param platformId - Injected or initial platform id (`Object`) / 注入或传入的platform唯一标识（`Object`）
     */
    constructor(
        private zone: NgZone,
        private cdRef: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

    /**
     * Angular lifecycle hook invoked once after component or directive inputs are initialized.
     * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
     */
    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.stateUpdate
                .pipe(
                    takeUntil(this.ngDestroy),
                    distinctUntilChanged((a, b) => a === b && !this.stateTimeout),
                )
                .subscribe((state: string) => {
                    if (this.stateTimeout && typeof window !== 'undefined') {
                        window.clearTimeout(this.stateTimeout);

                        this.stateTimeout = null;
                    }

                    if (state === 'x' || state === 'y') {
                        this.interaction = false;

                        if (state === 'x') {
                            this.indicatorX = false;

                            this.states.left = false;
                            this.states.right = false;

                            if (this.autoPropagation && this.usePropagationX) {
                                this.allowPropagationX = false;
                            }
                        } else if (state === 'y') {
                            this.indicatorY = false;

                            this.states.top = false;
                            this.states.bottom = false;

                            if (this.autoPropagation && this.usePropagationY) {
                                this.allowPropagationY = false;
                            }
                        }
                    } else {
                        if (state === 'left' || state === 'right') {
                            this.states.left = false;
                            this.states.right = false;

                            this.states[state] = true;

                            if (this.autoPropagation && this.usePropagationX) {
                                this.indicatorX = true;
                            }
                        } else if (state === 'top' || state === 'bottom') {
                            this.states.top = false;
                            this.states.bottom = false;

                            this.states[state] = true;

                            if (this.autoPropagation && this.usePropagationY) {
                                this.indicatorY = true;
                            }
                        }

                        if (this.autoPropagation && typeof window !== 'undefined') {
                            this.stateTimeout = window.setTimeout(() => {
                                this.indicatorX = false;
                                this.indicatorY = false;

                                this.stateTimeout = null;

                                if (this.interaction && (this.states.left || this.states.right)) {
                                    this.allowPropagationX = true;
                                }

                                if (this.interaction && (this.states.top || this.states.bottom)) {
                                    this.allowPropagationY = true;
                                }

                                this.cdRef.markForCheck();
                            }, 500);
                        }
                    }

                    this.cdRef.markForCheck();
                    this.cdRef.detectChanges();
                });

            this.zone.runOutsideAngular(() => {
                if (this.directiveRef) {
                    const element = this.directiveRef.elementRef.nativeElement;

                    fromEvent<WheelEvent>(element, 'wheel')
                        .pipe(takeUntil(this.ngDestroy))
                        .subscribe((event: WheelEvent) => {
                            if (!this.disabled && this.autoPropagation) {
                                const scrollDeltaX = event.deltaX;
                                const scrollDeltaY = event.deltaY;

                                this.checkPropagation(event, scrollDeltaX, scrollDeltaY);
                            }
                        });

                    fromEvent<TouchEvent>(element, 'touchmove')
                        .pipe(takeUntil(this.ngDestroy))
                        .subscribe((event: TouchEvent) => {
                            if (!this.disabled && this.autoPropagation) {
                                const scrollPositionX = event.touches[0].clientX;
                                const scrollPositionY = event.touches[0].clientY;

                                const scrollDeltaX = scrollPositionX - this.scrollPositionX;
                                const scrollDeltaY = scrollPositionY - this.scrollPositionY;

                                this.checkPropagation(event, scrollDeltaX, scrollDeltaY);

                                this.scrollPositionX = scrollPositionX;
                                this.scrollPositionY = scrollPositionY;
                            }
                        });

                    merge(
                        fromEvent(element, 'ps-scroll-x').pipe(mapTo('x')),
                        fromEvent(element, 'ps-scroll-y').pipe(mapTo('y')),
                        fromEvent(element, 'ps-x-reach-end').pipe(mapTo('right')),
                        fromEvent(element, 'ps-y-reach-end').pipe(mapTo('bottom')),
                        fromEvent(element, 'ps-x-reach-start').pipe(mapTo('left')),
                        fromEvent(element, 'ps-y-reach-start').pipe(mapTo('top')),
                    )
                        .pipe(takeUntil(this.ngDestroy))
                        .subscribe((state: string) => {
                            if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
                                this.stateUpdate.next(state);
                            }
                        });
                }
            });

            window.setTimeout(() => {
                PerfectScrollbarEvents.forEach((eventName: PerfectScrollbarEvent) => {
                    if (this.directiveRef) {
                        this.directiveRef[eventName] = this[eventName];
                    }
                });
            }, 0);
        }
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.ngDestroy.next();
            this.ngDestroy.unsubscribe();

            if (this.stateTimeout && typeof window !== 'undefined') {
                window.clearTimeout(this.stateTimeout);
            }
        }
    }

    /**
     * Angular lifecycle hook invoked during every change-detection run for custom change detection.
     * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
     */
    ngDoCheck(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.disabled && this.autoPropagation && this.directiveRef) {
                const element = this.directiveRef.elementRef.nativeElement;

                this.usePropagationX = element.classList.contains('ps--active-x');

                this.usePropagationY = element.classList.contains('ps--active-y');
            }
        }
    }

    /**
     * Executes `checkPropagation` to handle check propagation.
     * @zh 执行 `checkPropagation`，用于检查事件冒泡。
     * @param event - event parameter (`any`) / 事件参数（`any`）
     * @param deltaX - delta x parameter (`number`) / 增量X坐标参数（`number`）
     * @param deltaY - delta y parameter (`number`) / 增量Y坐标参数（`number`）
     */
    private checkPropagation(event, deltaX: number, deltaY: number): void {
        this.interaction = true;

        const scrollDirectionX = deltaX < 0 ? -1 : 1;
        const scrollDirectionY = deltaY < 0 ? -1 : 1;

        if (
            (this.usePropagationX && this.usePropagationY) ||
            (this.usePropagationX && (!this.allowPropagationX || this.scrollDirectionX !== scrollDirectionX)) ||
            (this.usePropagationY && (!this.allowPropagationY || this.scrollDirectionY !== scrollDirectionY))
        ) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!!deltaX) {
            this.scrollDirectionX = scrollDirectionX;
        }

        if (!!deltaY) {
            this.scrollDirectionY = scrollDirectionY;
        }

        // stateUpdate.next('interaction') above already synchronously runs the
        // subscribe callback in ngOnInit(), which ends with its own
        // markForCheck()+detectChanges() (see the unconditional call at the end of that
        // callback) -- calling detectChanges() again here duplicated that work on every
        // wheel/touchmove event. distinctUntilChanged() only ever suppresses that
        // callback for a same-state repeat while no propagation timeout is pending, which
        // is exactly the case where nothing template-relevant changed either.
        this.stateUpdate.next('interaction');
    }
}
