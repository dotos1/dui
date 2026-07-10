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
    booleanAttribute,
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
})
export class PerfectScrollbarComponent implements OnInit, OnDestroy, DoCheck {
    /** @zh 记录当前是否处于左/右/上/下边缘状态，驱动指示条显示。 */
    public states: any = {};

    /** @zh 水平方向的边缘指示条当前是否显示。 */
    public indicatorX: boolean = false;
    /** @zh 垂直方向的边缘指示条当前是否显示。 */
    public indicatorY: boolean = false;

    /** @zh 用户当前是否正在滚轮/触摸交互中（用于边缘滚动传播判断）。 */
    public interaction: boolean = false;

    private scrollPositionX: number = 0;
    private scrollPositionY: number = 0;

    private scrollDirectionX: number = 0;
    private scrollDirectionY: number = 0;

    private usePropagationX: boolean = false;
    private usePropagationY: boolean = false;

    private allowPropagationX: boolean = false;
    private allowPropagationY: boolean = false;

    private stateTimeout: number | null = null;

    private readonly ngDestroy = new Subject<void>();

    private readonly stateUpdate = new Subject<string>();

    /** @zh 是否禁用自定义滚动条。 */
    @Input({ transform: booleanAttribute }) disabled: boolean = false;

    /** @zh 是否使用 Perfect Scrollbar 的默认样式类。 */
    @Input({ transform: booleanAttribute }) usePSClass: boolean = true;

    /**
     * When enabled, scrolling past an edge propagates to the parent scrollable ancestor,
     * with a brief indicator shown at the edge.
     * @zh 启用后，滚动超出边缘时会向父级可滚动祖先传播，并在边缘短暂显示指示条。
     */
    @HostBinding('class.ps-show-limits')
    @Input({ transform: booleanAttribute })
    autoPropagation: boolean = false;

    /** @zh 是否显示滚动位置指示条覆层。 */
    @HostBinding('class.ps-show-active')
    @Input({ transform: booleanAttribute })
    scrollIndicators: boolean = false;

    /** @zh 传给底层 Perfect Scrollbar 实例的配置项。 */
    @Input() config?: PerfectScrollbarConfigInterface;

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

    /** @zh 内部使用的底层 {@link PerfectScrollbarDirective} 引用。 */
    @ViewChild(PerfectScrollbarDirective, { static: true })
    directiveRef?: PerfectScrollbarDirective;

    constructor(
        private zone: NgZone,
        private cdRef: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

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

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.ngDestroy.next();
            this.ngDestroy.unsubscribe();

            if (this.stateTimeout && typeof window !== 'undefined') {
                window.clearTimeout(this.stateTimeout);
            }
        }
    }

    ngDoCheck(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.disabled && this.autoPropagation && this.directiveRef) {
                const element = this.directiveRef.elementRef.nativeElement;

                this.usePropagationX = element.classList.contains('ps--active-x');

                this.usePropagationY = element.classList.contains('ps--active-y');
            }
        }
    }

    private checkPropagation(event: any, deltaX: number, deltaY: number): void {
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

        this.stateUpdate.next('interaction');

        this.cdRef.detectChanges();
    }
}
