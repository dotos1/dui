import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    NgZone,
    OnDestroy,
    Output,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { Container } from '@dotos/dui/container';
import {isArray,each}  from 'lodash-es';
import { Observable, Subject, Subscriber } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SplitAreaDirective } from '../directive/split-area.directive';
import {
    IArea,
    IAreaSnapshot,
    IOutputAreaSizes,
    IOutputData,
    IPoint,
    ISplitSnapshot,
} from '../interface';
import {
    getAreaMaxSize,
    getAreaMinSize,
    getElementPixelSize,
    getGutterSideAbsorptionCapacity,
    getInputPositiveNumber,
    getInputboolean,
    getKeyboardEndpoint,
    getPointFromEvent,
    isTouchEvent,
    isUserSizesValid,
    pointDeltaEquals,
    updateAreaSize,
} from '../utils';
import { DuiPanelComponent } from './panel.component';
/**
 * angular-split
 *
 *
 *  PERCENT MODE ([unit]="'percent'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |       20                 30                 20                 15                 15      | <-- [size]="x"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |calc(20% - 8px)    calc(30% - 12px)   calc(20% - 8px)    calc(15% - 6px)    calc(15% - 6px)| <-- CSS flex-basis property (with flex-grow&shrink at 0)
 * |     152px              228px              152px              114px              114px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *  flex-basis = calc( { area.size }% - { area.size/100 * nbGutter*gutterSize }px );
 *
 *
 *  PIXEL MODE ([unit]="'pixel'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |      100                250                 *                 150                100      | <-- [size]="y"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |   0 0 100px          0 0 250px           1 1 auto          0 0 150px          0 0 100px   | <-- CSS flex property (flex-grow/flex-shrink/flex-basis)
 * |     100px              250px              200px              150px              100px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *
 */
@Component({
  selector: 'dui-layout',
  exportAs: 'duiLayout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [`./layout.component.scss`],
  templateUrl: './layout.component.html',
  encapsulation: ViewEncapsulation.Emulated,
})
export class LayoutComponent
  extends Container
  implements AfterViewInit, OnDestroy
{
  @Input() config: any = {};

  public el: any;

  @Input() gutterClickDeltaPx = 2;

  @Input() gutterAriaLabel: string;



  @Input() set direction(v: 'horizontal' | 'vertical') {
    this._direction = v === 'vertical' ? 'vertical' : 'horizontal';
    this.renderer.addClass(this.elRef.nativeElement, `dui-${this._direction}`);
    this.renderer.removeClass(
      this.elRef.nativeElement,
      `dui-${this._direction === 'vertical' ? 'horizontal' : 'vertical'}`
    );
    this.build(false, false);
  }

  get direction(): 'horizontal' | 'vertical' {
    return this._direction;
  }

  @Input() set unit(v: 'percent' | 'pixel') {
    this._unit = v === 'pixel' ? 'pixel' : 'percent';
    this.renderer.addClass(this.elRef.nativeElement, `dui-${this._unit}`);
    this.renderer.removeClass(
      this.elRef.nativeElement,
      `dui-${this._unit === 'pixel' ? 'percent' : 'pixel'}`
    );
    this.build(false, true);
  }

  get unit(): 'percent' | 'pixel' {
    return this._unit;
  }

  @Input() set gutterSize(v: number | null) {
    this._gutterSize = getInputPositiveNumber(v, 11);
    this.build(false, false);
  }

  get gutterSize(): number | null {
    return this._gutterSize;
  }

  @Input() set gutterStep(v: number) {
    this._gutterStep = getInputPositiveNumber(v, 1);
  }

  get gutterStep(): number {
    return this._gutterStep;
  }

  @Input() set restrictMove(v: boolean) {
    this._restrictMove = getInputboolean(v);
  }

  get restrictMove(): boolean {
    return this._restrictMove;
  }

  @Input() set useTransition(v: boolean) {
    this._useTransition = getInputboolean(v);
    if (this._useTransition) {
      this.renderer.addClass(this.elRef.nativeElement, 'dui-transition');
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-transition');
    }
  }

  get useTransition(): boolean {
    return this._useTransition;
  }

  @Input() override set disable(v: boolean) {
    this.disabled = getInputboolean(v);
    if (this.disabled) {
      this.renderer.addClass(this.elRef.nativeElement, 'dui-disabled');
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-disabled');
    }
  }

  override get disable(): boolean {
    return this.disabled;
  }

  @Input() set dir(v: 'ltr' | 'rtl') {
    this._dir = v === 'rtl' ? 'rtl' : 'ltr';
    this.renderer.setAttribute(this.elRef.nativeElement, 'dir', this._dir);
  }

  get dir(): 'ltr' | 'rtl' {
    return this._dir;
  }

  @Input() set gutterDblClickDuration(v: number) {
    this._gutterDblClickDuration = getInputPositiveNumber(v, 0);
  }

  get gutterDblClickDuration(): number {
    return this._gutterDblClickDuration;
  }
  @Output() get transitionEnd(): Observable<IOutputAreaSizes> {
    return new Observable(
      (subscriber) => (this.transitionEndSubscriber = subscriber)
    ).pipe(
      //@ts-ignore
      debounceTime<IOutputAreaSizes>(20)
    );
  }

  constructor(
    private ngZone: NgZone,
    private elRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef
  ) {
    super(resolver, injector, detectRef);
    this.el = this.elRef.nativeElement;
    // To force adding default class, could be override by user @Input() or not
    this.direction = this._direction;
  }
  private _direction: 'horizontal' | 'vertical' = 'horizontal';

  private _unit: 'percent' | 'pixel' = 'percent';

  private _gutterSize: number | null = 9;

  private _gutterStep = 1;

  private _restrictMove = false;

  private _useTransition = false;

  private _dir: 'ltr' | 'rtl' = 'ltr';

  private _gutterDblClickDuration = 0;

  @Output() dragStart = new EventEmitter<IOutputData>(false);
  @Output() dragEnd = new EventEmitter<IOutputData>(false);
  @Output() gutterClick = new EventEmitter<IOutputData>(false);
  @Output() gutterDblClick = new EventEmitter<IOutputData>(false);

  private transitionEndSubscriber: Subscriber<IOutputAreaSizes>;

  private dragProgressSubject: Subject<IOutputData> = new Subject();
  dragProgress$: Observable<IOutputData> =
    this.dragProgressSubject.asObservable();

  private isDragging = false;
  private isWaitingClear = false;
  private isWaitingInitialMove = false;
  private dragListeners: Array<Function> = [];
  private snapshot: ISplitSnapshot | null = null;
  private startPoint: IPoint | null = null;
  private endPoint: IPoint | null = null;

  public readonly displayedAreas: Array<IArea> = [];
  private readonly hiddenAreas: Array<IArea> = [];

  @ViewChildren('gutterEls') private gutterEls: QueryList<ElementRef>;

  /** @zh 分隔条上被动 touchstart 监听的解绑函数，*ngFor 变化与销毁时都要用。 */
  private gutterTouchListeners: Array<() => void> = [];

  _clickTimeout: number | null = null;

  public override ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      // To avoid transition at first rendering
      setTimeout(() =>
        this.renderer.addClass(this.elRef.nativeElement, 'dui-init')
      );
    });

    this.bindGutterTouchStart();
    this.gutterEls.changes.subscribe(() => this.bindGutterTouchStart());
  }

  /**
   * Registers the gutters' `touchstart` as a passive listener.
   * @zh 把分隔条的 touchstart 注册成被动监听。
   *
   * <p>模板里写 {@code (touchstart)="..."} 时，Angular 只能注册成非被动的，
   * 浏览器就必须等这个回调跑完才敢滚页面 —— Chrome 为此报
   * "Added non-passive event listener to a scroll-blocking 'touchstart' event"。
   *
   * <p>原来非被动是为了在 {@link startMouseDrag} 里 {@code preventDefault()} 拦住页面滚动。
   * 现在改由 CSS 的 {@code touch-action: none} 来拦：浏览器一看这个元素声明了不滚，
   * 就不用再问监听器了 —— 既没有了那条警告，手指按下到开始拖动之间的延迟也一并没了。
   */
  private bindGutterTouchStart(): void {
    this.unbindGutterTouchStart();

    this.gutterEls.forEach((gutterEl: ElementRef, index: number) => {
      const el: HTMLElement = gutterEl.nativeElement;
      // 第 index 个分隔条夹在第 index 与第 index+1 个区域之间，
      // 与模板里 *ngFor 的下标一一对应（分隔条只在 last === false 时渲染）。
      const handler = (event: TouchEvent) =>
        this.startMouseDrag(event, index * 2 + 1, index + 1);

      el.addEventListener('touchstart', handler, { passive: true });
      this.gutterTouchListeners.push(() =>
        el.removeEventListener('touchstart', handler)
      );
    });
  }

  private unbindGutterTouchStart(): void {
    this.gutterTouchListeners.forEach((unbind) => unbind());
    this.gutterTouchListeners = [];
  }

  private getNbGutters(): number {
    return this.displayedAreas.length === 0
      ? 0
      : this.displayedAreas.length - 1;
  }

  public addArea(component: SplitAreaDirective | DuiPanelComponent): void {
    const newArea: IArea = {
      component,
      order: 0,
      size: 0,
      minSize: null,
      maxSize: null,
      sizeBeforeCollapse: null,
      gutterBeforeCollapse: 0,
    };
    if (component.visible === true) {
      this.displayedAreas.push(newArea);
      this.build(true, true);
    } else {
      this.hiddenAreas.push(newArea);
    }
  }

  public removeArea(component: SplitAreaDirective | DuiPanelComponent): void {
    if (this.displayedAreas.some((a) => a.component === component)) {
      const area = this.displayedAreas.find((a) => a.component === component);
      this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
      this.build(true, true);
    } else if (this.hiddenAreas.some((a) => a.component === component)) {
      const area = this.hiddenAreas.find((a) => a.component === component);
      this.hiddenAreas.splice(this.hiddenAreas.indexOf(area), 1);
    }
  }

  public updateArea(
    component: SplitAreaDirective | DuiPanelComponent,
    resetOrders: boolean,
    resetSizes: boolean
  ): void {
    if (component.visible === true) {
      this.build(resetOrders, resetSizes);
    }
  }

  public showArea(component: SplitAreaDirective | DuiPanelComponent): void {
    const area = this.hiddenAreas.find((a) => a.component === component);
    if (area === undefined) {
      return;
    }
    const areas = this.hiddenAreas.splice(this.hiddenAreas.indexOf(area), 1);
    this.displayedAreas.push(...areas);
    this.build(true, true);
  }

  public hideArea(comp: SplitAreaDirective | DuiPanelComponent): void {
    const area = this.displayedAreas.find((a) => a.component === comp);
    if (area === undefined) {
      return;
    }
    const areas = this.displayedAreas.splice(
      this.displayedAreas.indexOf(area),
      1
    );
    areas.forEach((item) => {
      item.order = 0;
      item.size = 0;
    });
    this.hiddenAreas.push(...areas);

    this.build(true, true);
  }

  public getVisibleAreaSizes(): IOutputAreaSizes {
    return this.displayedAreas.map((a) => (a.size === null ? '*' : a.size));
  }

  public setVisibleAreaSizes(sizes: IOutputAreaSizes): boolean {
    if (sizes.length !== this.displayedAreas.length) {
      return false;
    }
    const formattedSizes = sizes.map((s) => getInputPositiveNumber(s, null));
    const isValid = isUserSizesValid(this.unit, formattedSizes);
    if (isValid === false) {
      return false;
    }
    this.displayedAreas.forEach(
         // @ts-ignore
      (area, i) => (area.component._size = formattedSizes[i])
    );
    this.build(false, true);
    return true;
  }

  private build(resetOrders: boolean, resetSizes: boolean): void {
    this.stopDragging();

    // ¤ AREAS ORDER

    if (resetOrders === true) {
      // If user provided 'order' for each area, use it to sort them.
      if (this.displayedAreas.every((a) => a.component.order !== null)) {
        this.displayedAreas.sort(
          (a, b) => <number>a.component.order - <number>b.component.order
        );
      }

      // Then set real order with multiples of 2, numbers between will be used by gutters.
      this.displayedAreas.forEach((area, i) => {
        area.order = i * 2;
        area.component.setStyleOrder(area.order);
      });
    }

    // ¤ AREAS SIZE

    if (resetSizes === true) {
      const useUserSizes = isUserSizesValid(
        this.unit,
        this.displayedAreas.map((a) => a.component.size)
      );

      switch (this.unit) {
        case 'percent': {
          const defaultSize = 100 / this.displayedAreas.length;

          this.displayedAreas.forEach((area) => {
            area.size = useUserSizes
              ? <number>area.component.size
              : defaultSize;
            area.minSize = getAreaMinSize(area);
            area.maxSize = getAreaMaxSize(area);
          });
          break;
        }
        case 'pixel': {
          if (useUserSizes) {
            this.displayedAreas.forEach((area) => {
              area.size = area.component.size;
              area.minSize = getAreaMinSize(area);
              area.maxSize = getAreaMaxSize(area);
            });
          } else {
            const wildcardSizeAreas = this.displayedAreas.filter(
              (a) => a.component.size === null
            );

            // No wildcard area > Need to select one arbitrarily > first
            if (
              wildcardSizeAreas.length === 0 &&
              this.displayedAreas.length > 0
            ) {
              this.displayedAreas.forEach((area, i) => {
                area.size = i === 0 ? null : area.component.size;
                area.minSize = i === 0 ? null : getAreaMinSize(area);
                area.maxSize = i === 0 ? null : getAreaMaxSize(area);
              });
            } else if (wildcardSizeAreas.length > 1) {
              // More than one wildcard area > Need to keep only one arbitrarily > first
              let alreadyGotOne = false;
              this.displayedAreas.forEach((area) => {
                if (area.component.size === null) {
                  if (alreadyGotOne === false) {
                    area.size = null;
                    area.minSize = null;
                    area.maxSize = null;
                    alreadyGotOne = true;
                  } else {
                    area.size = 100;
                    area.minSize = null;
                    area.maxSize = null;
                  }
                } else {
                  area.size = area.component.size;
                  area.minSize = getAreaMinSize(area);
                  area.maxSize = getAreaMaxSize(area);
                }
              });
            }
          }
          break;
        }
      }
    }

    this.refreshStyleSizes();
    this.cdRef.markForCheck();
  }

  private refreshStyleSizes(): void {
    ///////////////////////////////////////////
    // PERCENT MODE
    if (this.unit === 'percent') {
      // Only one area > flex-basis 100%
      if (this.displayedAreas.length === 1) {
        this.displayedAreas[0].component.setStyleFlex(
          0,
          0,
          `100%`,
          false,
          false
        );
      } else {
        // Multiple areas > use each percent basis
        const sumGutterSize = this.getNbGutters() * this.gutterSize;
        this.displayedAreas.forEach((area) => {
          area.component.setStyleFlex(
            0,
            0,
            `calc( ${area.size}% - ${
              (<number>area.size / 100) * sumGutterSize
            }px )`,
            area.minSize !== null && area.minSize === area.size,
            area.maxSize !== null && area.maxSize === area.size
          );
        });
      }
    } else if (this.unit === 'pixel') {
      ///////////////////////////////////////////
      // PIXEL MODE
      this.displayedAreas.forEach((area) => {
        // Area with wildcard size
        if (area.size === null) {
          if (this.displayedAreas.length === 1) {
            area.component.setStyleFlex(1, 1, `100%`, false, false);
          } else {
            area.component.setStyleFlex(1, 1, `auto`, false, false);
          }
        } else {
          // Area with pixel size
          // Only one area > flex-basis 100%
          if (this.displayedAreas.length === 1) {
            area.component.setStyleFlex(0, 0, `100%`, false, false);
          } else {
            // Multiple areas > use each pixel basis
            area.component.setStyleFlex(
              0,
              0,
              `${area.size}px`,
              area.minSize !== null && area.minSize === area.size,
              area.maxSize !== null && area.maxSize === area.size
            );
          }
        }
      });
    }
  }

  public clickGutter(event: MouseEvent | TouchEvent, gutterNum: number): void {
    const tempPoint = getPointFromEvent(event);

    // Be sure mouseup/touchend happened if touch/cursor is not moved.
    if (
      this.startPoint &&
      this.startPoint.x === tempPoint.x &&
      this.startPoint.y === tempPoint.y &&
      (!this.isDragging || this.isWaitingInitialMove)
    ) {
      // If timeout in progress and new click > clearTimeout & dblClickEvent
      if (this._clickTimeout !== null) {
        window.clearTimeout(this._clickTimeout);
        this._clickTimeout = null;
        this.notify('dblclick', gutterNum);
        this.stopDragging();
      } else {
        // Else start timeout to call clickEvent at end
        this._clickTimeout = window.setTimeout(() => {
          this._clickTimeout = null;
          this.notify('click', gutterNum);
          this.stopDragging();
        }, this.gutterDblClickDuration);
      }
    }
  }

  public startKeyboardDrag(event: any, gutterOrder: number, gutterNum: number) {
    if (this.disabled === true || this.isWaitingClear === true) {
      return;
    }
    const endPoint = getKeyboardEndpoint(event, this.direction);
    if (endPoint === null) {
      return;
    }
    this.endPoint = endPoint;
    this.startPoint = getPointFromEvent(event);

    event.preventDefault();
    event.stopPropagation();

    this.setupForDragEvent(gutterOrder, gutterNum);
    this.startDragging();
    this.drag();
    this.stopDragging();
  }

  public startMouseDrag(
    event: MouseEvent | TouchEvent,
    gutterOrder: number,
    gutterNum: number
  ): void {
    // 触摸事件走的是被动监听（见 bindGutterTouchStart），那里 preventDefault 是空操作，
    // 调了只会让 Chrome 再报一条 "Unable to preventDefault inside passive event listener"。
    // 触摸时阻止页面滚动的是 .dui-split-gutter 上的 touch-action: none。
    if (!isTouchEvent(event)) {
      event.preventDefault();
    }
    event.stopPropagation();

    this.startPoint = getPointFromEvent(event);
    if (
      this.startPoint === null ||
      this.disabled === true ||
      this.isWaitingClear === true
    ) {
      return;
    }

    this.setupForDragEvent(gutterOrder, gutterNum);

    this.dragListeners.push(
      this.renderer.listen('document', 'mouseup', this.stopDragging.bind(this))
    );
    this.dragListeners.push(
      this.renderer.listen('document', 'touchend', this.stopDragging.bind(this))
    );
    this.dragListeners.push(
      this.renderer.listen(
        'document',
        'touchcancel',
        this.stopDragging.bind(this)
      )
    );

    this.ngZone.runOutsideAngular(() => {
      this.dragListeners.push(
        this.renderer.listen(
          'document',
          'mousemove',
          this.mouseDragEvent.bind(this)
        )
      );
      // touchmove 同理：手势起点在分隔条上，touch-action: none 已经决定了这一串
      // 手势不滚页面，这里不需要再靠 preventDefault 拦一次，注册成被动即可。
      const touchMove = this.mouseDragEvent.bind(this);
      document.addEventListener('touchmove', touchMove, { passive: true });
      this.dragListeners.push(() =>
        document.removeEventListener('touchmove', touchMove)
      );
    });

    this.startDragging();
  }

  private setupForDragEvent(gutterOrder: number, gutterNum: number) {
    this.snapshot = {
      gutterNum,
      lastSteppedOffset: 0,
      allAreasSizePixel:
        getElementPixelSize(this.elRef, this.direction) -
        this.getNbGutters() * this.gutterSize,
      allInvolvedAreasSizePercent: 100,
      areasBeforeGutter: [],
      areasAfterGutter: [],
    };

    this.displayedAreas.forEach((area) => {
      const areaSnapshot: IAreaSnapshot = {
        area,
        sizePixelAtStart: getElementPixelSize(
          area.component.elRef,
          this.direction
        ),
        sizePercentAtStart: this.unit === 'percent' ? area.size : -1, // If pixel mode, anyway, will not be used.
      };

      if (area.order < gutterOrder) {
        if (this.restrictMove === true) {
          this.snapshot.areasBeforeGutter = [areaSnapshot];
        } else {
          this.snapshot.areasBeforeGutter.unshift(areaSnapshot);
        }
      } else if (area.order > gutterOrder) {
        if (this.restrictMove === true) {
          if (this.snapshot.areasAfterGutter.length === 0) {
            this.snapshot.areasAfterGutter = [areaSnapshot];
          }
        } else {
          this.snapshot.areasAfterGutter.push(areaSnapshot);
        }
      }
    });

    this.snapshot.allInvolvedAreasSizePercent = [
      ...this.snapshot.areasBeforeGutter,
      ...this.snapshot.areasAfterGutter,
    ].reduce((t, a) => t + a.sizePercentAtStart, 0);

    if (
      this.snapshot.areasBeforeGutter.length === 0 ||
      this.snapshot.areasAfterGutter.length === 0
    ) {
      return;
    }
  }

  private startDragging() {
    this.displayedAreas.forEach((area) => area.component.lockEvents());
    this.isDragging = true;
    this.isWaitingInitialMove = true;
  }

  private mouseDragEvent(event: MouseEvent | TouchEvent): void {
    // 鼠标一路仍要 preventDefault —— 否则拖动会顺带选中页面上的文字。
    if (!isTouchEvent(event)) {
      event.preventDefault();
    }
    event.stopPropagation();

    const tempPoint = getPointFromEvent(event);
    if (
      this._clickTimeout !== null &&
      !pointDeltaEquals(this.startPoint, tempPoint, this.gutterClickDeltaPx)
    ) {
      window.clearTimeout(this._clickTimeout);
      this._clickTimeout = null;
    }

    if (this.isDragging === false) {
      return;
    }

    this.endPoint = getPointFromEvent(event);
    if (this.endPoint === null) {
      return;
    }
    this.drag();
  }

  private drag() {
    if (this.isWaitingInitialMove) {
      if (
        this.startPoint.x !== this.endPoint.x ||
        this.startPoint.y !== this.endPoint.y
      ) {
        this.ngZone.run(() => {
          this.isWaitingInitialMove = false;

          this.renderer.addClass(this.elRef.nativeElement, 'dui-dragging');
          this.renderer.addClass(
            this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement,
            'dui-dragged'
          );

          this.notify('start', this.snapshot.gutterNum);
        });
      } else {
        return;
      }
    }

    // Calculate steppedOffset

    let offset =
      this.direction === 'horizontal'
        ? this.startPoint.x - this.endPoint.x
        : this.startPoint.y - this.endPoint.y;
    if (this.dir === 'rtl' && this.direction === 'horizontal') {
      offset = -offset;
    }
    const steppedOffset =
      Math.round(offset / this.gutterStep) * this.gutterStep;

    if (steppedOffset === this.snapshot.lastSteppedOffset) {
      return;
    }

    this.snapshot.lastSteppedOffset = steppedOffset;

    // Need to know if each gutter side areas could reacts to steppedOffset

    let areasBefore = getGutterSideAbsorptionCapacity(
      this.unit,
      this.snapshot.areasBeforeGutter,
      -steppedOffset,
      this.snapshot.allAreasSizePixel
    );
    let areasAfter = getGutterSideAbsorptionCapacity(
      this.unit,
      this.snapshot.areasAfterGutter,
      steppedOffset,
      this.snapshot.allAreasSizePixel
    );

    // Each gutter side areas can't absorb all offset
    if (areasBefore.remain !== 0 && areasAfter.remain !== 0) {
      if (Math.abs(areasBefore.remain) === Math.abs(areasAfter.remain)) {
      } else if (Math.abs(areasBefore.remain) > Math.abs(areasAfter.remain)) {
        areasAfter = getGutterSideAbsorptionCapacity(
          this.unit,
          this.snapshot.areasAfterGutter,
          steppedOffset + areasBefore.remain,
          this.snapshot.allAreasSizePixel
        );
      } else {
        areasBefore = getGutterSideAbsorptionCapacity(
          this.unit,
          this.snapshot.areasBeforeGutter,
          -(steppedOffset - areasAfter.remain),
          this.snapshot.allAreasSizePixel
        );
      }
    } else if (areasBefore.remain !== 0) {
      // Areas before gutter can't absorbs all offset > need to recalculate sizes for areas after gutter.
      areasAfter = getGutterSideAbsorptionCapacity(
        this.unit,
        this.snapshot.areasAfterGutter,
        steppedOffset + areasBefore.remain,
        this.snapshot.allAreasSizePixel
      );
    } else if (areasAfter.remain !== 0) {
      // Areas after gutter can't absorbs all offset > need to recalculate sizes for areas before gutter.
      areasBefore = getGutterSideAbsorptionCapacity(
        this.unit,
        this.snapshot.areasBeforeGutter,
        -(steppedOffset - areasAfter.remain),
        this.snapshot.allAreasSizePixel
      );
    }

    if (this.unit === 'percent') {
      // Hack because of browser messing up with sizes using calc(X% - Ypx) -> el.getBoundingClientRect()
      // If not there, playing with gutters makes total going down to 99.99875% then 99.99286%, 99.98986%,..
      const all = [...areasBefore.list, ...areasAfter.list];
      const areaToReset = all.find(
        (a) =>
          a.percentAfterAbsorption !== 0 &&
          a.percentAfterAbsorption !== a.areaSnapshot.area.minSize &&
          a.percentAfterAbsorption !== a.areaSnapshot.area.maxSize
      );

      if (areaToReset) {
        areaToReset.percentAfterAbsorption =
          this.snapshot.allInvolvedAreasSizePercent -
          all
            .filter((a) => a !== areaToReset)
            .reduce((total, a) => total + a.percentAfterAbsorption, 0);
      }
    }

    // Now we know areas could absorb steppedOffset, time to really update sizes

    areasBefore.list.forEach((item) => updateAreaSize(this.unit, item));
    areasAfter.list.forEach((item) => updateAreaSize(this.unit, item));

    this.refreshStyleSizes();
    this.notify('progress', this.snapshot.gutterNum);
  }

  private stopDragging(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.isDragging === false) {
      return;
    }

    this.displayedAreas.forEach((area) => area.component.unlockEvents());

    while (this.dragListeners.length > 0) {
      const fct = this.dragListeners.pop();
      if (fct) {
        fct();
      }
    }

    // Warning: Have to be before "notify('end')"
    // because "notify('end')"" can be linked to "[size]='x'" > "build()" > "stopDragging()"
    this.isDragging = false;

    // If moved from starting point, notify end
    if (this.isWaitingInitialMove === false) {
      this.notify('end', this.snapshot.gutterNum);
    }

    this.renderer.removeClass(this.elRef.nativeElement, 'dui-dragging');
    this.renderer.removeClass(
      this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement,
      'dui-dragged'
    );
    this.snapshot = null;
    this.isWaitingClear = true;

    // Needed to let (click)="clickGutter(...)" event run and verify if mouse moved or not
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.startPoint = null;
        this.endPoint = null;
        this.isWaitingClear = false;
      });
    });
  }

  public notify(
    type: 'start' | 'progress' | 'end' | 'click' | 'dblclick' | 'transitionEnd',
    gutterNum: number
  ): void {
    const sizes = this.getVisibleAreaSizes();

    if (type === 'start') {
      this.dragStart.emit({ gutterNum, sizes });
    } else if (type === 'end') {
      this.dragEnd.emit({ gutterNum, sizes });
    } else if (type === 'click') {
      this.gutterClick.emit({ gutterNum, sizes });
    } else if (type === 'dblclick') {
      this.gutterDblClick.emit({ gutterNum, sizes });
    } else if (type === 'transitionEnd') {
      if (this.transitionEndSubscriber) {
        this.ngZone.run(() => this.transitionEndSubscriber.next(sizes));
      }
    } else if (type === 'progress') {
      // Stay outside zone to allow users do what they want about change detection mechanism.
      this.dragProgressSubject.next({ gutterNum, sizes });
    }
  }

  public override ngOnDestroy(): void {
    this.stopDragging();
    this.unbindGutterTouchStart();
  }

  public collapseArea(
    comp: SplitAreaDirective | DuiPanelComponent,
    newSize: number,
    gutter: 'left' | 'right'
  ): void {
    const area = this.displayedAreas.find((a) => a.component === comp);
    if (area === undefined) {
      return;
    }
    const whichGutter = gutter === 'right' ? 1 : -1;
    if (!area.sizeBeforeCollapse) {
      area.sizeBeforeCollapse = area.size;
      area.gutterBeforeCollapse = whichGutter;
    }
    area.size = newSize;
    const gtr = this.gutterEls.find(
      (f) => f.nativeElement.style.order === `${area.order + whichGutter}`
    );
    if (gtr) {
      this.renderer.addClass(gtr.nativeElement, 'dui-split-gutter-collapsed');
    }
    this.updateArea(comp, false, false);
  }

  public expandArea(comp: SplitAreaDirective | DuiPanelComponent): void {
    const area = this.displayedAreas.find((a) => a.component === comp);
    if (area === undefined) {
      return;
    }
    if (!area.sizeBeforeCollapse) {
      return;
    }
    area.size = area.sizeBeforeCollapse;
    area.sizeBeforeCollapse = null;
    const gtr = this.gutterEls.find(
      (f) =>
        f.nativeElement.style.order ===
        `${area.order + area.gutterBeforeCollapse}`
    );
    if (gtr) {
      this.renderer.removeClass(
        gtr.nativeElement,
        'dui-split-gutter-collapsed'
      );
    }
    this.updateArea(comp, false, false);
  }
  public getAriaAreaSizeText(size: number | null): string {
    if (size === null) {
      return null;
    }
    return size.toFixed(0) + ' ' + this.unit;
  }
  override add(comp): any {
    this.initItems();
    const args = arguments.length > 1;
    if (args || isArray(comp)) {
      const result = [];
      each(args ? arguments : comp, (c) => {
        result.push(this.add(c));
      });
      return result;
    }
    if (comp.reference) {
      const index = this.items.length;
      this._addItem(comp, index);
    } else {
      const component = this.lookupComponent(this.applyDefaults(comp));
      const index = this.items.length;
      this._addItem(component, index);
      return component;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override remove(c: any, ad?: boolean): any {
    const comp = super.remove(c, false);
    if (comp) {
      const index = this.viewContainer.indexOf(comp.reference.hostView);
      this.viewContainer.remove(index);
    }
  }

  protected _addItem(comp, index) {
    this.items.add(comp);
    if (comp.onAdded) {
      comp.onAdded(this, index);
    }
    this.viewContainer.insert(comp.reference.hostView);
    this.onAdd(comp);
    this.trigger('add', this);
  }

  public havePanel(comp: any): boolean {
    return this.getComponent(comp) !== undefined;
  }
}
