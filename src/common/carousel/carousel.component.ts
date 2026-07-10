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

enum Direction {
  Left,
  Right,
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
  /** @zh 切换幻灯片时的过渡动画时长/缓动函数。 */
  @Input() public timings = '250ms ease-in';
  /** @zh 用于覆盖左右箭头图标的自定义 SVG 图标配置。 */
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

  /** @zh 是否隐藏左右箭头。 */
  @Input() public hideArrows = true;
  /** @zh 是否隐藏底部指示点。 */
  @Input() public hideIndicators = true;
  /** @zh Material 主题色。 */
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

  /** @zh 是否保持幻灯片宽高比。 */
  @Input() public maintainAspectRatio = true;
  /** @zh 保持宽高比时使用的高度占宽度的百分比。 */
  @Input() public proportion = 25;
  /** @zh 幻灯片高度（`maintainAspectRatio` 为 `false` 时使用）。 */
  @Input() public slideHeight = '100%';

  /**
   * Limits the number of projected slides actually rendered/used.
   * @zh 限制实际渲染/使用的投影幻灯片数量。
   */
  @Input()
  public set slides(value: number) {
    this.slides$.next(value);
  }

  /** @zh 是否启用左右方向键导航。 */
  @Input() public useKeyboard = false;
  /** @zh 是否启用鼠标滚轮切换幻灯片。 */
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

  /** @zh 投影进来的全部 {@link MatCarouselSlideComponent} 幻灯片。 */
  @ContentChildren(MatCarouselSlideComponent) public slidesList: QueryList<
    MatCarouselSlideComponent
  >;
  @ViewChild('carouselContainer') private carouselContainer: ElementRef<
    HTMLDivElement
  >;
  @ViewChild('carouselList') private carouselList: ElementRef<HTMLElement>;
  /** @zh 内部使用，管理幻灯片焦点/激活状态的 CDK 键盘管理器。 */
  public listKeyManager: ListKeyManager<MatCarouselSlideComponent>;

  private _autoplay = true;
  private autoplay$ = new Subject<boolean>();

  private interval$ = new BehaviorSubject<number>(5000);
  private slides$ = new BehaviorSubject<number>(null);

  private _maxWidth = 'auto';
  private maxWidth$ = new Subject<number>();

  private _loop = true;
  private loop$ = new Subject<boolean>();

  private _orientation: Orientation = 'ltr';
  private orientation$ = new Subject<Orientation>();

  private timer$: Observable<number>;
  private timerStop$ = new Subject<void>();

  private destroy$ = new Subject<void>();
  private playing = false;

  constructor(
    private animationBuilder: AnimationBuilder,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId
  ) {}

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
  public onMouseWheel(event: any): void {
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
  public onPan(event: any, slideElem: HTMLElement): void {
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
  public onPanEnd(event: any, slideElem: HTMLElement): void {
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

  private getOffset(): number {
    const offset = this.listKeyManager.activeItemIndex * this.getWidth();
    const sign = this.orientation === 'rtl' ? 1 : -1;
    return sign * offset;
  }

  private getTranslation(offset: number): string {
    return `translateX(${offset}px)`;
  }

  private getWidth(): number {
    return this.carouselContainer.nativeElement.clientWidth;
  }

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

  private resetSlides(slides: number): void {
    this.slidesList.reset(this.slidesList.toArray().slice(0, slides));
  }

  private resetTimer(value: number): void {
    this.timer$ = interval(value);
  }

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

  private stopTimer(): void {
    this.timerStop$.next();
  }
}
