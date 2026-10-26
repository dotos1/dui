/**
 * @fileoverview Module `src/common/carousel/carousel.component.ts` providing carousel component definitions and implementation.
 * @zh 模块文件 `src/common/carousel/carousel.component.ts`，提供carousel组件相关的定义与实现。
 */

import { animate, style, AnimationBuilder } from '@angular/animations';
import { ListKeyManager } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { interval, BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatCarousel, Orientation, SvgIconOverrides } from './carousel';
import { MatCarouselSlideComponent } from './carousel-slide/carousel-slide.component';

/**
 * Enumeration `Direction` defining supported direction constants.
 * @zh 枚举 `Direction`，定义支持的方向常量集合。
 */
enum Direction {
  /**
   * Enum member `Direction.Left` representing left.
   * @zh 枚举项 `Direction.Left`，表示左侧位置。
   */
  Left,
  /**
   * Enum member `Direction.Right` representing right.
   * @zh 枚举项 `Direction.Right`，表示右侧位置。
   */
  Right,
  /**
   * Enum member `Direction.Index` representing index.
   * @zh 枚举项 `Direction.Index`，表示索引。
   */
  Index
}

/**
 * A Material-styled image/content carousel with autoplay, keyboard navigation, mouse-wheel
 * and swipe/pan gesture support. Slides are projected as {@link MatCarouselSlideComponent}.
 * @zh Material 风格的图片/内容轮播组件，支持自动播放、键盘导航、鼠标滚轮以及滑动/拖拽手势。
 * 幻灯片以 {@link MatCarouselSlideComponent} 的形式投影进来。
 */
@Component({
  selector: 'mat-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class MatCarouselComponent
  implements AfterContentInit, AfterViewInit, MatCarousel, OnDestroy {
  /**
   * Input property `timings` (`string`) configuring timings (default: `'250ms ease-in'`).
   * @zh 切换幻灯片时的过渡动画时长/缓动函数。
   * @zh 切换幻灯片时的过渡动画时长/缓动函数。
   */
  @Input() public timings = '250ms ease-in';
  /**
   * @zh 用于覆盖左右箭头图标的自定义 SVG 图标配置。
   * @zh 用于覆盖左右箭头图标的自定义 SVG 图标配置。
   */
  @Input() public svgIconOverrides: SvgIconOverrides;

  /**
   * Enables automatic slide advancing on the interval set by `interval`.
   * @zh 是否按 `interval` 设置的间隔自动切换幻灯片。
   */
  @Input()
  public set autoplay(value: boolean) {
    this.autoplay$.next(value);
    this._autoplay = value;
  }

  /**
   * Autoplay interval in milliseconds.
   * @zh 自动播放间隔（毫秒）。
   */
  @Input()
  public set interval(value: number) {
    this.interval$.next(value);
  }

  /**
   * Wraps back to the first/last slide when navigating past the ends.
   * @zh 导航超出两端时是否循环回到第一张/最后一张幻灯片。
   */
  public get loop(): boolean {
    return this._loop;
  }
  /**
   * Wraps back to the first/last slide when navigating past the ends.
   * @zh 导航超出两端时是否循环回到第一张/最后一张幻灯片。
   */
  @Input()
  public set loop(value: boolean) {
    this.loop$.next(value);
    this._loop = value;
  }

  /**
   * Input property `hideArrows` (`boolean`) configuring hide arrows (default: `true`).
   * @zh 是否隐藏左右箭头。
   * @zh 是否隐藏左右箭头。
   */
  @Input() public hideArrows = true;
  /**
   * Input property `hideIndicators` (`boolean`) configuring hide indicators (default: `true`).
   * @zh 是否隐藏底部指示点。
   * @zh 是否隐藏底部指示点。
   */
  @Input() public hideIndicators = true;
  /**
   * @zh Material 主题色。
   * @zh Material 主题色。
   */
  @Input() public color: ThemePalette = 'accent';

  /**
   * The carousel's maximum width.
   * @zh 轮播组件的最大宽度。
   */
  public get maxWidth(): string {
    return this._maxWidth;
  }
  /**
   * The carousel's maximum width.
   * @zh 轮播组件的最大宽度。
   */
  @Input()
  public set maxWidth(value: string) {
    this._maxWidth = value;
    this.maxWidth$.next(0);
  }

  /**
   * Input property `maintainAspectRatio` (`boolean`) configuring maintain aspect ratio (default: `true`).
   * @zh 是否保持幻灯片宽高比。
   * @zh 是否保持幻灯片宽高比。
   */
  @Input() public maintainAspectRatio = true;
  /**
   * Input property `proportion` (`number`) configuring proportion (default: `25`).
   * @zh 保持宽高比时使用的高度占宽度的百分比。
   * @zh 保持宽高比时使用的高度占宽度的百分比。
   */
  @Input() public proportion = 25;
  /**
   * Input property `slideHeight` (`string`) configuring slide height (default: `'100%'`).
   * @zh 幻灯片高度（`maintainAspectRatio` 为 `false` 时使用）。
   * @zh 幻灯片高度（`maintainAspectRatio` 为 `false` 时使用）。
   */
  @Input() public slideHeight = '100%';

  /**
   * Limits the number of projected slides actually rendered/used.
   * @zh 限制实际渲染/使用的投影幻灯片数量。
   */
  @Input()
  public set slides(value: number) {
    this.slides$.next(value);
  }

  /**
   * Input property `useKeyboard` (`boolean`) configuring use keyboard (default: `false`).
   * @zh 是否启用左右方向键导航。
   * @zh 是否启用左右方向键导航。
   */
  @Input() public useKeyboard = false;
  /**
   * Input property `useMouseWheel` (`boolean`) configuring use mouse wheel (default: `false`).
   * @zh 是否启用鼠标滚轮切换幻灯片。
   * @zh 是否启用鼠标滚轮切换幻灯片。
   */
  @Input() public useMouseWheel = false;

  /**
   * The carousel's text/layout direction: `'ltr'` or `'rtl'`.
   * @zh 轮播组件的文字/布局方向：`'ltr'` 或 `'rtl'`。
   */
  public get orientation(): Orientation {
    return this._orientation;
  }
  /**
   * The carousel's text/layout direction: `'ltr'` or `'rtl'`.
   * @zh 轮播组件的文字/布局方向：`'ltr'` 或 `'rtl'`。
   */
  @Input()
  public set orientation(value: Orientation) {
    this.orientation$.next(value);
    this._orientation = value;
  }

  /**
   * Emits the new active slide index after each slide transition completes.
   * @zh 每次幻灯片切换动画完成后，发出新的当前幻灯片索引。
   */
  @Output()
  public change: EventEmitter<number> = new EventEmitter<number>();

  /**
   * The currently active slide's index.
   * @zh 当前激活幻灯片的索引。
   */
  public get currentIndex(): number {
    if (this.listKeyManager) {
      return this.listKeyManager.activeItemIndex;
    }

    return 0;
  }
  /**
   * The currently active {@link MatCarouselSlideComponent}.
   * @zh 当前激活的 {@link MatCarouselSlideComponent}。
   */
  public get currentSlide(): MatCarouselSlideComponent {
    if (this.listKeyManager) {
      return this.listKeyManager.activeItem;
    }

    return null;
  }

  /**
   * @zh 投影进来的全部 {@link MatCarouselSlideComponent} 幻灯片。
   * @zh 投影进来的全部 {@link MatCarouselSlideComponent} 幻灯片。
   */
  @ContentChildren(MatCarouselSlideComponent) public slidesList: QueryList<
    MatCarouselSlideComponent
  >;
  /**
   * Template/content query reference `carouselContainer` (`@ViewChild`) targeting carousel container.
   * @zh 模板/内容视图查询引用 `carouselContainer`（`@ViewChild`），指向carousel容器。
   */
  @ViewChild('carouselContainer') private carouselContainer: ElementRef<
    HTMLDivElement
  >;
  /**
   * Template/content query reference `carouselList` (`@ViewChild`) targeting carousel list.
   * @zh 模板/内容视图查询引用 `carouselList`（`@ViewChild`），指向carousel列表。
   */
  @ViewChild('carouselList') private carouselList: ElementRef<HTMLElement>;
  /**
   * @zh 内部使用，管理幻灯片焦点/激活状态的 CDK 键盘管理器。
   * @zh 内部使用，管理幻灯片焦点/激活状态的 CDK 键盘管理器。
   */
  public listKeyManager: ListKeyManager<MatCarouselSlideComponent>;

  /**
   * Property `_autoplay` (`boolean`) storing autoplay (default: `true`).
   * @zh 属性 `_autoplay`（类型：`boolean`），用于存储或配置autoplay（默认值：`true`）。
   */
  private _autoplay = true;
  /**
   * Property `autoplay$` (`Subject`) storing autoplay (default: `new Subject<boolean>()`).
   * @zh 属性 `autoplay$`（类型：`Subject`），用于存储或配置autoplay（默认值：`new Subject<boolean>()`）。
   */
  private autoplay$ = new Subject<boolean>();

  /**
   * Property `interval$` (`BehaviorSubject`) storing interval (default: `new BehaviorSubject<number>(5000)`).
   * @zh 属性 `interval$`（类型：`BehaviorSubject`），用于存储或配置间隔定时器（默认值：`new BehaviorSubject<number>(5000)`）。
   */
  private interval$ = new BehaviorSubject<number>(5000);
  /**
   * Property `slides$` (`BehaviorSubject`) storing slides (default: `new BehaviorSubject<number>(null)`).
   * @zh 属性 `slides$`（类型：`BehaviorSubject`），用于存储或配置slides（默认值：`new BehaviorSubject<number>(null)`）。
   */
  private slides$ = new BehaviorSubject<number>(null);

  /**
   * Property `_maxWidth` (`string`) storing max width (default: `'auto'`).
   * @zh 属性 `_maxWidth`（类型：`string`），用于存储或配置最大值宽度（默认值：`'auto'`）。
   */
  private _maxWidth = 'auto';
  /**
   * Property `maxWidth$` (`Subject`) storing max width (default: `new Subject<number>()`).
   * @zh 属性 `maxWidth$`（类型：`Subject`），用于存储或配置最大值宽度（默认值：`new Subject<number>()`）。
   */
  private maxWidth$ = new Subject<number>();

  /**
   * Property `_loop` (`boolean`) storing loop (default: `true`).
   * @zh 属性 `_loop`（类型：`boolean`），用于存储或配置loop（默认值：`true`）。
   */
  private _loop = true;
  /**
   * Property `loop$` (`Subject`) storing loop (default: `new Subject<boolean>()`).
   * @zh 属性 `loop$`（类型：`Subject`），用于存储或配置loop（默认值：`new Subject<boolean>()`）。
   */
  private loop$ = new Subject<boolean>();

  /**
   * Property `_orientation` (`Orientation`) storing orientation (default: `'ltr'`).
   * @zh 属性 `_orientation`（类型：`Orientation`），用于存储或配置方向（默认值：`'ltr'`）。
   */
  private _orientation: Orientation = 'ltr';
  /**
   * Property `orientation$` (`Subject`) storing orientation (default: `new Subject<Orientation>()`).
   * @zh 属性 `orientation$`（类型：`Subject`），用于存储或配置方向（默认值：`new Subject<Orientation>()`）。
   */
  private orientation$ = new Subject<Orientation>();

  /**
   * Property `timer$` (`Observable<number>`) storing timer.
   * @zh 属性 `timer$`（类型：`Observable<number>`），用于存储或配置定时器。
   */
  private timer$: Observable<number>;
  /**
   * Property `timerStop$` (`Subject`) storing timer stop (default: `new Subject<void>()`).
   * @zh 属性 `timerStop$`（类型：`Subject`），用于存储或配置定时器停止（默认值：`new Subject<void>()`）。
   */
  private timerStop$ = new Subject<void>();

  /**
   * Property `destroy$` (`Subject`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `destroy$`（类型：`Subject`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private destroy$ = new Subject<void>();
  /**
   * Property `playing` (`boolean`) storing playing (default: `false`).
   * @zh 属性 `playing`（类型：`boolean`），用于存储或配置playing（默认值：`false`）。
   */
  private playing = false;

  /**
   * Creates an instance of `MatCarouselComponent` and initializes its dependencies and internal state.
   * @zh 创建 `MatCarouselComponent` 实例，并初始化其依赖项与内部状态。
   * @param animationBuilder - Injected or initial animation builder (`AnimationBuilder`) / 注入或传入的动画构建器（`AnimationBuilder`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param platformId - Injected or initial platform id (`any`) / 注入或传入的platform唯一标识（`any`）
   */
  constructor(
    private animationBuilder: AnimationBuilder,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  public ngAfterContentInit(): void {
    this.listKeyManager = new ListKeyManager(this.slidesList)
      .withVerticalOrientation(false)
      .withHorizontalOrientation(this._orientation)
      .withWrap(this._loop);

    this.listKeyManager.updateActiveItem(0);
    this.listKeyManager.change
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.playAnimation());
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  public ngAfterViewInit(): void {
    this.autoplay$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.stopTimer();
      this.startTimer(value);
    });

    this.interval$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.stopTimer();
      this.resetTimer(value);
      this.startTimer(this._autoplay);
    });

    this.maxWidth$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.slideTo(0));

    this.loop$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.listKeyManager.withWrap(value));

    this.orientation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.listKeyManager.withHorizontalOrientation(value));

    this.slides$
      .pipe(
        takeUntil(this.destroy$),
        filter(value => value && value < this.slidesList.length)
      )
      .subscribe(value => this.resetSlides(value));
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Advances to the next slide.
   * @zh 切换到下一张幻灯片。
   */
  public next(): void {
    this.goto(Direction.Right);
  }

  /**
   * Goes back to the previous slide.
   * @zh 切换到上一张幻灯片。
   */
  public previous(): void {
    this.goto(Direction.Left);
  }

  /**
   * Jumps directly to the slide at the given index.
   * @zh 直接跳转到指定索引的幻灯片。
   */
  public slideTo(index: number): void {
    this.goto(Direction.Index, index);
  }

  /**
   * @hidden Handles keyboard navigation when `useKeyboard` is enabled.
   * @zh 内部使用，当 `useKeyboard` 启用时处理键盘导航。
   */
  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    if (this.useKeyboard && !this.playing) {
      this.listKeyManager.onKeydown(event);
    }
  }

  /**
   * @hidden Pauses autoplay while the pointer is over the carousel.
   * @zh 内部使用，指针悬停在轮播组件上方时暂停自动播放。
   */
  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.stopTimer();
  }

  /**
   * @hidden Resumes autoplay once the pointer leaves the carousel.
   * @zh 内部使用，指针离开轮播组件后恢复自动播放。
   */
  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.startTimer(this._autoplay);
  }

  /**
   * @hidden Handles mouse-wheel scrolling to navigate slides when `useMouseWheel` is enabled.
   * @zh 内部使用，当 `useMouseWheel` 启用时处理鼠标滚轮滚动以切换幻灯片。
   */
  @HostListener('mousewheel', ['$event'])
  public onMouseWheel(event): void {
    if (this.useMouseWheel) {
      event.preventDefault(); // prevent window to scroll
      const Δ = Math.sign(event.wheelDelta);

      if (Δ < 0) {
        this.next();
      } else if (Δ > 0) {
        this.previous();
      }
    }
  }

  /**
   * @hidden Re-syncs slide position on window resize.
   * @zh 内部使用，在窗口尺寸变化时重新同步幻灯片位置。
   */
  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onResize(event: Event): void {
    this.slideTo(0);
  }

  /**
   * Handles an in-progress pan/swipe gesture, translating the slide list to follow the pointer.
   * @zh 处理正在进行中的滑动/拖拽手势，使幻灯片列表跟随指针平移。
   */
  public onPan(event, slideElem: HTMLElement): void {
    // https://github.com/angular/angular/issues/10541#issuecomment-346539242
    // if y velocity is greater, it's a panup/pandown, so ignore.
    if (Math.abs(event.velocityY) > Math.abs(event.velocityX)) {
      return;
    }
    let Δx = event.deltaX;
    if (this.isOutOfBounds()) {
      Δx *= 0.2; // decelerate movement;
    }

    this.renderer.setStyle(slideElem, 'cursor', 'grabbing');
    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transform',
      this.getTranslation(this.getOffset() + Δx)
    );
  }

  /**
   * Handles the end of a pan/swipe gesture: advances/reverts to the nearest slide based on
   * how far the pointer moved.
   * @zh 处理滑动/拖拽手势结束：根据指针移动距离前进到下一张或还原到当前幻灯片。
   */
  public onPanEnd(event, slideElem: HTMLElement): void {
    this.renderer.removeStyle(slideElem, 'cursor');

    if (
      !this.isOutOfBounds() &&
      Math.abs(event.deltaX) > this.getWidth() * 0.25
    ) {
      if (event.deltaX <= 0) {
        this.next();
        return;
      }
      this.previous();
      return;
    }
    this.playAnimation(); // slide back, don't change current index
  }

  /**
   * Executes `isOutOfBounds` to handle is out of bounds.
   * @zh 执行 `isOutOfBounds`，用于是否为输出的边界框。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private isOutOfBounds(): boolean {
    const sign = this.orientation === 'rtl' ? -1 : 1;
    const left =
      sign *
      (this.carouselList.nativeElement.getBoundingClientRect().left -
        this.carouselList.nativeElement.offsetParent.getBoundingClientRect()
          .left);
    const lastIndex = this.slidesList.length - 1;
    const width = -this.getWidth() * lastIndex;

    return (
      (this.listKeyManager.activeItemIndex === 0 && left >= 0) ||
      (this.listKeyManager.activeItemIndex === lastIndex && left <= width)
    );
  }

  /**
   * Executes `isVisible` to handle is visible.
   * @zh 执行 `isVisible`，用于是否为可见。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private isVisible(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const elem = this.carouselContainer.nativeElement;
    const docViewTop = window.pageYOffset;
    const docViewBottom = docViewTop + window.innerHeight;
    const elemOffset = elem.getBoundingClientRect();
    const elemTop = docViewTop + elemOffset.top;
    const elemBottom = elemTop + elemOffset.height;

    return elemBottom <= docViewBottom || elemTop >= docViewTop;
  }

  /**
   * Executes `getOffset` to handle get offset.
   * @zh 执行 `getOffset`，用于获取偏移量。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private getOffset(): number {
    const offset = this.listKeyManager.activeItemIndex * this.getWidth();
    const sign = this.orientation === 'rtl' ? 1 : -1;
    return sign * offset;
  }

  /**
   * Executes `getTranslation` to handle get translation.
   * @zh 执行 `getTranslation`，用于获取翻译文本。
   * @param offset - offset parameter (`number`) / 偏移量参数（`number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getTranslation(offset: number): string {
    return `translateX(${offset}px)`;
  }

  /**
   * Executes `getWidth` to handle get width.
   * @zh 执行 `getWidth`，用于获取宽度。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private getWidth(): number {
    return this.carouselContainer.nativeElement.clientWidth;
  }

  /**
   * Executes `goto` to handle goto.
   * @zh 执行 `goto`，用于goto。
   * @param direction - direction parameter (`Direction`) / 方向参数（`Direction`）
   * @param index - index parameter (`number`) / 索引参数（`number`）
   */
  private goto(direction: Direction, index?: number): void {
    if (!this.playing) {
      const rtl = this.orientation === 'rtl';

      switch (direction) {
        case Direction.Left:
          return rtl
            ? this.listKeyManager.setNextItemActive()
            : this.listKeyManager.setPreviousItemActive();
        case Direction.Right:
          return rtl
            ? this.listKeyManager.setPreviousItemActive()
            : this.listKeyManager.setNextItemActive();
        case Direction.Index:
          return this.listKeyManager.setActiveItem(index);
      }
    }
  }

  /**
   * Executes `playAnimation` to handle play animation.
   * @zh 执行 `playAnimation`，用于play动画。
   */
  private playAnimation(): void {
    const translation = this.getTranslation(this.getOffset());
    const factory = this.animationBuilder.build(
      animate(this.timings, style({ transform: translation }))
    );
    const animation = factory.create(this.carouselList.nativeElement);

    animation.onStart(() => (this.playing = true));
    animation.onDone(() => {
      this.change.emit(this.currentIndex);
      this.playing = false;
      this.renderer.setStyle(
        this.carouselList.nativeElement,
        'transform',
        translation
      );
      animation.destroy();
    });
    animation.play();
  }

  /**
   * Executes `resetSlides` to handle reset slides.
   * @zh 执行 `resetSlides`，用于重置Slides。
   * @param slides - slides parameter (`number`) / slides参数（`number`）
   */
  private resetSlides(slides: number): void {
    this.slidesList.reset(this.slidesList.toArray().slice(0, slides));
  }

  /**
   * Executes `resetTimer` to handle reset timer.
   * @zh 执行 `resetTimer`，用于重置定时器。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  private resetTimer(value: number): void {
    this.timer$ = interval(value);
  }

  /**
   * Executes `startTimer` to handle start timer.
   * @zh 执行 `startTimer`，用于开始定时器。
   * @param autoplay - autoplay parameter (`boolean`) / autoplay参数（`boolean`）
   */
  private startTimer(autoplay: boolean): void {
    if (!autoplay) {
      return;
    }

    this.timer$
      .pipe(
        takeUntil(this.timerStop$),
        takeUntil(this.destroy$),
        filter(() => this.isVisible())
      )
      .subscribe(() => {
        this.listKeyManager.withWrap(true).setNextItemActive();
        this.listKeyManager.withWrap(this.loop);
      });
  }

  /**
   * Executes `stopTimer` to handle stop timer.
   * @zh 执行 `stopTimer`，用于停止定时器。
   */
  private stopTimer(): void {
    this.timerStop$.next();
  }
}
