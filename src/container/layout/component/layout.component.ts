/**
 * @fileoverview Module `src/container/layout/component/layout.component.ts` providing layout component definitions and implementation.
 * @zh 模块文件 `src/container/layout/component/layout.component.ts`，提供布局组件相关的定义与实现。
 */

import { DuiConfig } from '@dotos1/dui/base';
import { ComponentBase } from '@dotos1/dui/core';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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
import { Container } from '@dotos1/dui/container';
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

 * @zh Angular 组件 `LayoutComponent`（selector: 'dui-layout'），提供布局组件的视图渲染与交互逻辑（位于 `src/container/layout/component`）。
 */
@Component({
  selector: 'dui-layout',
  exportAs: 'duiLayout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [`./layout.component.scss`],
  templateUrl: './layout.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  standalone: false,
})
export class LayoutComponent
  extends Container
  implements AfterViewInit, OnDestroy
{
  /**
   * Input property `config` (`DuiConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() config: DuiConfig = {};

  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  public el;

  /**
   * Input property `gutterClickDeltaPx` (`number`) configuring gutter click delta px (default: `2`).
   * @zh 输入属性 `gutterClickDeltaPx`（类型：`number`），用于配置分隔槽点击增量像素（默认值：`2`）。
   */
  @Input() gutterClickDeltaPx = 2;

  /**
   * Input property `gutterAriaLabel` (`string`) configuring gutter aria label.
   * @zh 输入属性 `gutterAriaLabel`（类型：`string`），用于配置分隔槽Aria标签。
   */
  @Input() gutterAriaLabel: string;



  /**
   * Input setter `direction` updating direction.
   * @zh 输入属性 `direction` 的设置器，用于更新方向。
   * @param v - New direction value (`"horizontal" | "vertical"`) / 新的方向值（`"horizontal" | "vertical"`）
   */
  @Input() set direction(v: 'horizontal' | 'vertical') {
    this._direction = v === 'vertical' ? 'vertical' : 'horizontal';
    this.renderer.addClass(this.elRef.nativeElement, `dui-${this._direction}`);
    this.renderer.removeClass(
      this.elRef.nativeElement,
      `dui-${this._direction === 'vertical' ? 'horizontal' : 'vertical'}`
    );
    this.build(false, false);
  }

  /**
   * Gets the current direction (`direction: 'horizontal' | 'vertical'`).
   * @zh 获取当前方向（`direction: 'horizontal' | 'vertical'`）。
   */
  get direction(): 'horizontal' | 'vertical' {
    return this._direction;
  }

  /**
   * Input setter `unit` updating unit.
   * @zh 输入属性 `unit` 的设置器，用于更新unit。
   * @param v - New unit value (`"percent" | "pixel"`) / 新的unit值（`"percent" | "pixel"`）
   */
  @Input() set unit(v: 'percent' | 'pixel') {
    this._unit = v === 'pixel' ? 'pixel' : 'percent';
    this.renderer.addClass(this.elRef.nativeElement, `dui-${this._unit}`);
    this.renderer.removeClass(
      this.elRef.nativeElement,
      `dui-${this._unit === 'pixel' ? 'percent' : 'pixel'}`
    );
    this.build(false, true);
  }

  /**
   * Gets the current unit (`unit: 'percent' | 'pixel'`).
   * @zh 获取当前unit（`unit: 'percent' | 'pixel'`）。
   */
  get unit(): 'percent' | 'pixel' {
    return this._unit;
  }

  /**
   * Input setter `gutterSize` updating gutter size.
   * @zh 输入属性 `gutterSize` 的设置器，用于更新分隔槽尺寸。
   * @param v - New gutter size value (`number`) / 新的分隔槽尺寸值（`number`）
   */
  @Input() set gutterSize(v: number | null) {
    this._gutterSize = getInputPositiveNumber(v, 11);
    this.build(false, false);
  }

  /**
   * Gets the current gutter size (`gutterSize: number | null`).
   * @zh 获取当前分隔槽尺寸（`gutterSize: number | null`）。
   */
  get gutterSize(): number | null {
    return this._gutterSize;
  }

  /**
   * Input setter `gutterStep` updating gutter step.
   * @zh 输入属性 `gutterStep` 的设置器，用于更新分隔槽步骤。
   * @param v - New gutter step value (`number`) / 新的分隔槽步骤值（`number`）
   */
  @Input() set gutterStep(v: number) {
    this._gutterStep = getInputPositiveNumber(v, 1);
  }

  /**
   * Gets the current gutter step (`gutterStep: number`).
   * @zh 获取当前分隔槽步骤（`gutterStep: number`）。
   */
  get gutterStep(): number {
    return this._gutterStep;
  }

  /**
   * Input setter `restrictMove` updating restrict move.
   * @zh 输入属性 `restrictMove` 的设置器，用于更新restrict移动。
   * @param v - New restrict move value (`boolean`) / 新的restrict移动值（`boolean`）
   */
  @Input() set restrictMove(v: boolean) {
    this._restrictMove = getInputboolean(v);
  }

  /**
   * Gets the current restrict move (`restrictMove: boolean`).
   * @zh 获取当前restrict移动（`restrictMove: boolean`）。
   */
  get restrictMove(): boolean {
    return this._restrictMove;
  }

  /**
   * Input setter `useTransition` updating use transition.
   * @zh 输入属性 `useTransition` 的设置器，用于更新使用过渡动画。
   * @param v - New use transition value (`boolean`) / 新的使用过渡动画值（`boolean`）
   */
  @Input() set useTransition(v: boolean) {
    this._useTransition = getInputboolean(v);
    if (this._useTransition) {
      this.renderer.addClass(this.elRef.nativeElement, 'dui-transition');
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-transition');
    }
  }

  /**
   * Gets the current use transition (`useTransition: boolean`).
   * @zh 获取当前使用过渡动画（`useTransition: boolean`）。
   */
  get useTransition(): boolean {
    return this._useTransition;
  }

  /**
   * Input setter `disable` updating disable.
   * @zh 输入属性 `disable` 的设置器，用于更新禁用。
   * @param v - New disable value (`boolean`) / 新的禁用值（`boolean`）
   */
  @Input() override set disable(v: boolean) {
    this.disabled = getInputboolean(v);
    if (this.disabled) {
      this.renderer.addClass(this.elRef.nativeElement, 'dui-disabled');
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-disabled');
    }
  }

  /**
   * Gets the current disable (`disable: boolean`).
   * @zh 获取当前禁用（`disable: boolean`）。
   */
  override get disable(): boolean {
    return this.disabled;
  }

  /**
   * Input setter `dir` updating dir.
   * @zh 输入属性 `dir` 的设置器，用于更新目录。
   * @param v - New dir value (`"ltr" | "rtl"`) / 新的目录值（`"ltr" | "rtl"`）
   */
  @Input() set dir(v: 'ltr' | 'rtl') {
    this._dir = v === 'rtl' ? 'rtl' : 'ltr';
    this.renderer.setAttribute(this.elRef.nativeElement, 'dir', this._dir);
  }

  /**
   * Gets the current dir (`dir: 'ltr' | 'rtl'`).
   * @zh 获取当前目录（`dir: 'ltr' | 'rtl'`）。
   */
  get dir(): 'ltr' | 'rtl' {
    return this._dir;
  }

  /**
   * Input setter `gutterDblClickDuration` updating gutter dbl click duration.
   * @zh 输入属性 `gutterDblClickDuration` 的设置器，用于更新分隔槽Dbl点击持续时间。
   * @param v - New gutter dbl click duration value (`number`) / 新的分隔槽Dbl点击持续时间值（`number`）
   */
  @Input() set gutterDblClickDuration(v: number) {
    this._gutterDblClickDuration = getInputPositiveNumber(v, 0);
  }

  /**
   * Gets the current gutter dbl click duration (`gutterDblClickDuration: number`).
   * @zh 获取当前分隔槽Dbl点击持续时间（`gutterDblClickDuration: number`）。
   */
  get gutterDblClickDuration(): number {
    return this._gutterDblClickDuration;
  }
  /**
   * Gets the current transition end (`transitionEnd: Observable<IOutputAreaSizes>`).
   * @zh 获取当前过渡动画结束（`transitionEnd: Observable<IOutputAreaSizes>`）。
   */
  @Output() get transitionEnd(): Observable<IOutputAreaSizes> {
    return new Observable(
      (subscriber) => (this.transitionEndSubscriber = subscriber)
    ).pipe(
      //@ts-ignore
      debounceTime<IOutputAreaSizes>(20)
    );
  }

  /**
   * Creates an instance of `LayoutComponent` and initializes its dependencies and internal state.
   * @zh 创建 `LayoutComponent` 实例，并初始化其依赖项与内部状态。
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param elRef - Injected or initial el ref (`ElementRef<any>`) / 注入或传入的DOM元素引用（`ElementRef<any>`）
   * @param cdRef - Injected or initial cd ref (`ChangeDetectorRef`) / 注入或传入的cd引用（`ChangeDetectorRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(
    private ngZone: NgZone,
    private elRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef
  ) {
    super(injector, detectRef);
    this.el = this.elRef.nativeElement;
    // To force adding default class, could be override by user @Input() or not
    this.direction = this._direction;
  }
  /**
   * Property `_direction` (`"horizontal" | "vertical"`) storing direction (default: `'horizontal'`).
   * @zh 属性 `_direction`（类型：`"horizontal" | "vertical"`），用于存储或配置方向（默认值：`'horizontal'`）。
   */
  private _direction: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Property `_unit` (`"percent" | "pixel"`) storing unit (default: `'percent'`).
   * @zh 属性 `_unit`（类型：`"percent" | "pixel"`），用于存储或配置unit（默认值：`'percent'`）。
   */
  private _unit: 'percent' | 'pixel' = 'percent';

  /**
   * Property `_gutterSize` (`number`) storing gutter size (default: `9`).
   * @zh 属性 `_gutterSize`（类型：`number`），用于存储或配置分隔槽尺寸（默认值：`9`）。
   */
  private _gutterSize: number | null = 9;

  /**
   * Property `_gutterStep` (`number`) storing gutter step (default: `1`).
   * @zh 属性 `_gutterStep`（类型：`number`），用于存储或配置分隔槽步骤（默认值：`1`）。
   */
  private _gutterStep = 1;

  /**
   * Property `_restrictMove` (`boolean`) storing restrict move (default: `false`).
   * @zh 属性 `_restrictMove`（类型：`boolean`），用于存储或配置restrict移动（默认值：`false`）。
   */
  private _restrictMove = false;

  /**
   * Property `_useTransition` (`boolean`) storing use transition (default: `false`).
   * @zh 属性 `_useTransition`（类型：`boolean`），用于存储或配置使用过渡动画（默认值：`false`）。
   */
  private _useTransition = false;

  /**
   * Property `_dir` (`"ltr" | "rtl"`) storing dir (default: `'ltr'`).
   * @zh 属性 `_dir`（类型：`"ltr" | "rtl"`），用于存储或配置目录（默认值：`'ltr'`）。
   */
  private _dir: 'ltr' | 'rtl' = 'ltr';

  /**
   * Property `_gutterDblClickDuration` (`number`) storing gutter dbl click duration (default: `0`).
   * @zh 属性 `_gutterDblClickDuration`（类型：`number`），用于存储或配置分隔槽Dbl点击持续时间（默认值：`0`）。
   */
  private _gutterDblClickDuration = 0;

  /**
   * Output event emitter `dragStart` (`EventEmitter<IOutputData>`) firing when drag start occurs.
   * @zh 输出事件 `dragStart`（类型：`EventEmitter<IOutputData>`），当触发拖拽开始时向外发出事件。
   */
  @Output() dragStart = new EventEmitter<IOutputData>(false);
  /**
   * Output event emitter `dragEnd` (`EventEmitter<IOutputData>`) firing when drag end occurs.
   * @zh 输出事件 `dragEnd`（类型：`EventEmitter<IOutputData>`），当触发拖拽结束时向外发出事件。
   */
  @Output() dragEnd = new EventEmitter<IOutputData>(false);
  /**
   * Output event emitter `gutterClick` (`EventEmitter<IOutputData>`) firing when gutter click occurs.
   * @zh 输出事件 `gutterClick`（类型：`EventEmitter<IOutputData>`），当触发分隔槽点击时向外发出事件。
   */
  @Output() gutterClick = new EventEmitter<IOutputData>(false);
  /**
   * Output event emitter `gutterDblClick` (`EventEmitter<IOutputData>`) firing when gutter dbl click occurs.
   * @zh 输出事件 `gutterDblClick`（类型：`EventEmitter<IOutputData>`），当触发分隔槽Dbl点击时向外发出事件。
   */
  @Output() gutterDblClick = new EventEmitter<IOutputData>(false);

  /**
   * Property `transitionEndSubscriber` (`Subscriber<IOutputAreaSizes>`) storing transition end subscriber.
   * @zh 属性 `transitionEndSubscriber`（类型：`Subscriber<IOutputAreaSizes>`），用于存储或配置过渡动画结束Subscriber。
   */
  private transitionEndSubscriber: Subscriber<IOutputAreaSizes>;

  /**
   * Property `dragProgressSubject` (`Subject<IOutputData>`) storing drag progress subject (default: `new Subject()`).
   * @zh 属性 `dragProgressSubject`（类型：`Subject<IOutputData>`），用于存储或配置拖拽进度条主题流（默认值：`new Subject()`）。
   */
  private dragProgressSubject: Subject<IOutputData> = new Subject();
  /**
   * Property `dragProgress$` (`Observable<IOutputData>`) storing drag progress (default: `this.dragProgressSubject.asObservable()`).
   * @zh 属性 `dragProgress$`（类型：`Observable<IOutputData>`），用于存储或配置拖拽进度条（默认值：`this.dragProgressSubject.asObservable()`）。
   */
  dragProgress$: Observable<IOutputData> =
    this.dragProgressSubject.asObservable();

  /**
   * Property `isDragging` (`boolean`) storing is dragging (default: `false`).
   * @zh 属性 `isDragging`（类型：`boolean`），用于存储或配置是否为拖拽中（默认值：`false`）。
   */
  private isDragging = false;
  /**
   * Property `isWaitingClear` (`boolean`) storing is waiting clear (default: `false`).
   * @zh 属性 `isWaitingClear`（类型：`boolean`），用于存储或配置是否为Waiting清空（默认值：`false`）。
   */
  private isWaitingClear = false;
  /**
   * Property `isWaitingInitialMove` (`boolean`) storing is waiting initial move (default: `false`).
   * @zh 属性 `isWaitingInitialMove`（类型：`boolean`），用于存储或配置是否为Waiting初始移动（默认值：`false`）。
   */
  private isWaitingInitialMove = false;
  /**
   * Property `dragListeners` (`Function[]`) storing drag listeners (default: `[]`).
   * @zh 属性 `dragListeners`（类型：`Function[]`），用于存储或配置拖拽监听器列表（默认值：`[]`）。
   */
  private dragListeners: Array<Function> = [];
  /**
   * Property `snapshot` (`ISplitSnapshot`) storing snapshot (default: `null`).
   * @zh 属性 `snapshot`（类型：`ISplitSnapshot`），用于存储或配置snapshot（默认值：`null`）。
   */
  private snapshot: ISplitSnapshot | null = null;
  /**
   * Property `startPoint` (`IPoint`) storing start point (default: `null`).
   * @zh 属性 `startPoint`（类型：`IPoint`），用于存储或配置开始坐标点（默认值：`null`）。
   */
  private startPoint: IPoint | null = null;
  /**
   * Property `endPoint` (`IPoint`) storing end point (default: `null`).
   * @zh 属性 `endPoint`（类型：`IPoint`），用于存储或配置结束坐标点（默认值：`null`）。
   */
  private endPoint: IPoint | null = null;

  /**
   * Property `displayedAreas` (`IArea[]`) storing displayed areas (default: `[]`).
   * @zh 属性 `displayedAreas`（类型：`IArea[]`），用于存储或配置已展示区域集合（默认值：`[]`）。
   */
  public readonly displayedAreas: Array<IArea> = [];
  /**
   * Property `hiddenAreas` (`IArea[]`) storing hidden areas (default: `[]`).
   * @zh 属性 `hiddenAreas`（类型：`IArea[]`），用于存储或配置隐藏区域集合（默认值：`[]`）。
   */
  private readonly hiddenAreas: Array<IArea> = [];

  /**
   * Template/content query reference `gutterEls` (`QueryList<ElementRef<any>>`) targeting gutter els.
   * @zh 模板/内容视图查询引用 `gutterEls`（`@ViewChildren`），指向分隔槽DOM元素。
   */
  @ViewChildren('gutterEls') private gutterEls: QueryList<ElementRef>;

  /**
   * @zh 分隔条上被动 touchstart 监听的解绑函数，*ngFor 变化与销毁时都要用。
   * @zh 分隔条上被动 touchstart 监听的解绑函数，*ngFor 变化与销毁时都要用。
   */
  private gutterTouchListeners: Array<() => void> = [];
  /**
   * Property `gutterElsSub` (`any`) storing gutter els sub.
   * @zh 属性 `gutterElsSub`（类型：`any`），用于存储或配置分隔槽DOM元素子。
   */
  private gutterElsSub?;

  /**
   * Property `_clickTimeout` (`number`) storing click timeout (default: `null`).
   * @zh 属性 `_clickTimeout`（类型：`number`），用于存储或配置点击延时器（默认值：`null`）。
   */
  _clickTimeout: number | null = null;

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  public override ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      // To avoid transition at first rendering
      setTimeout(() =>
        this.renderer.addClass(this.elRef.nativeElement, 'dui-init')
      );
    });

    this.bindGutterTouchStart();
    this.gutterElsSub = this.gutterEls.changes.subscribe(() => this.bindGutterTouchStart());
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

  /**
   * Executes `unbindGutterTouchStart` to handle unbind gutter touch start.
   * @zh 执行 `unbindGutterTouchStart`，用于解绑分隔槽触摸开始。
   */
  private unbindGutterTouchStart(): void {
    this.gutterTouchListeners.forEach((unbind) => unbind());
    this.gutterTouchListeners = [];
  }

  /**
   * Executes `getNbGutters` to handle get nb gutters.
   * @zh 执行 `getNbGutters`，用于获取Nb分隔槽。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private getNbGutters(): number {
    return this.displayedAreas.length === 0
      ? 0
      : this.displayedAreas.length - 1;
  }

  /**
   * Executes `addArea` to handle add area.
   * @zh 执行 `addArea`，用于添加区域。
   * @param component - component parameter (`SplitAreaDirective | DuiPanelComponent`) / 组件参数（`SplitAreaDirective | DuiPanelComponent`）
   */
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

  /**
   * Executes `removeArea` to handle remove area.
   * @zh 执行 `removeArea`，用于移除区域。
   * @param component - component parameter (`SplitAreaDirective | DuiPanelComponent`) / 组件参数（`SplitAreaDirective | DuiPanelComponent`）
   */
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

  /**
   * Executes `updateArea` to handle update area.
   * @zh 执行 `updateArea`，用于更新区域。
   * @param component - component parameter (`SplitAreaDirective | DuiPanelComponent`) / 组件参数（`SplitAreaDirective | DuiPanelComponent`）
   * @param resetOrders - reset orders parameter (`boolean`) / 重置顺序参数（`boolean`）
   * @param resetSizes - reset sizes parameter (`boolean`) / 重置尺寸列表参数（`boolean`）
   */
  public updateArea(
    component: SplitAreaDirective | DuiPanelComponent,
    resetOrders: boolean,
    resetSizes: boolean
  ): void {
    if (component.visible === true) {
      this.build(resetOrders, resetSizes);
    }
  }

  /**
   * Executes `showArea` to handle show area.
   * @zh 执行 `showArea`，用于显示区域。
   * @param component - component parameter (`SplitAreaDirective | DuiPanelComponent`) / 组件参数（`SplitAreaDirective | DuiPanelComponent`）
   */
  public showArea(component: SplitAreaDirective | DuiPanelComponent): void {
    const area = this.hiddenAreas.find((a) => a.component === component);
    if (area === undefined) {
      return;
    }
    const areas = this.hiddenAreas.splice(this.hiddenAreas.indexOf(area), 1);
    this.displayedAreas.push(...areas);
    this.build(true, true);
  }

  /**
   * Executes `hideArea` to handle hide area.
   * @zh 执行 `hideArea`，用于隐藏区域。
   * @param comp - comp parameter (`SplitAreaDirective | DuiPanelComponent`) / 组件参数（`SplitAreaDirective | DuiPanelComponent`）
   */
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

  /**
   * Executes `getVisibleAreaSizes` to handle get visible area sizes.
   * @zh 执行 `getVisibleAreaSizes`，用于获取可见区域尺寸列表。
   * @returns Result of type `IOutputAreaSizes` / 类型为 `IOutputAreaSizes` 的返回值
   */
  public getVisibleAreaSizes(): IOutputAreaSizes {
    return this.displayedAreas.map((a) => (a.size === null ? '*' : a.size));
  }

  /**
   * Executes `setVisibleAreaSizes` to handle set visible area sizes.
   * @zh 执行 `setVisibleAreaSizes`，用于集合可见区域尺寸列表。
   * @param sizes - sizes parameter (`IOutputAreaSizes`) / 尺寸列表参数（`IOutputAreaSizes`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
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

  /**
   * Executes `build` to handle build.
   * @zh 执行 `build`，用于构建。
   * @param resetOrders - reset orders parameter (`boolean`) / 重置顺序参数（`boolean`）
   * @param resetSizes - reset sizes parameter (`boolean`) / 重置尺寸列表参数（`boolean`）
   */
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

  /**
   * Executes `refreshStyleSizes` to handle refresh style sizes.
   * @zh 执行 `refreshStyleSizes`，用于刷新样式尺寸列表。
   */
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

  /**
   * Executes `clickGutter` to handle click gutter.
   * @zh 执行 `clickGutter`，用于点击分隔槽。
   * @param event - event parameter (`MouseEvent | TouchEvent`) / 事件参数（`MouseEvent | TouchEvent`）
   * @param gutterNum - gutter num parameter (`number`) / 分隔槽数值参数（`number`）
   */
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

  /**
   * Executes `startKeyboardDrag` to handle start keyboard drag.
   * @zh 执行 `startKeyboardDrag`，用于开始键盘拖拽。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   * @param gutterOrder - gutter order parameter (`number`) / 分隔槽顺序参数（`number`）
   * @param gutterNum - gutter num parameter (`number`) / 分隔槽数值参数（`number`）
   */
  public startKeyboardDrag(event, gutterOrder: number, gutterNum: number) {
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

  /**
   * Executes `startMouseDrag` to handle start mouse drag.
   * @zh 执行 `startMouseDrag`，用于开始鼠标拖拽。
   * @param event - event parameter (`MouseEvent | TouchEvent`) / 事件参数（`MouseEvent | TouchEvent`）
   * @param gutterOrder - gutter order parameter (`number`) / 分隔槽顺序参数（`number`）
   * @param gutterNum - gutter num parameter (`number`) / 分隔槽数值参数（`number`）
   */
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

  /**
   * Executes `setupForDragEvent` to handle setup for drag event.
   * @zh 执行 `setupForDragEvent`，用于setup用于拖拽事件。
   * @param gutterOrder - gutter order parameter (`number`) / 分隔槽顺序参数（`number`）
   * @param gutterNum - gutter num parameter (`number`) / 分隔槽数值参数（`number`）
   */
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

  /**
   * Executes `startDragging` to handle start dragging.
   * @zh 执行 `startDragging`，用于开始拖拽中。
   */
  private startDragging() {
    this.displayedAreas.forEach((area) => area.component.lockEvents());
    this.isDragging = true;
    this.isWaitingInitialMove = true;
  }

  /**
   * Executes `mouseDragEvent` to handle mouse drag event.
   * @zh 执行 `mouseDragEvent`，用于鼠标拖拽事件。
   * @param event - event parameter (`MouseEvent | TouchEvent`) / 事件参数（`MouseEvent | TouchEvent`）
   */
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

  /**
   * Executes `drag` to handle drag.
   * @zh 执行 `drag`，用于拖拽。
   */
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

  /**
   * Executes `stopDragging` to handle stop dragging.
   * @zh 执行 `stopDragging`，用于停止拖拽中。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
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

  /**
   * Executes `notify` to handle notify.
   * @zh 执行 `notify`，用于通知。
   * @param type - type parameter (`"progress" | "click" | "dblclick" | "end" | "start" | "transitionEnd"`) / 类型参数（`"progress" | "click" | "dblclick" | "end" | "start" | "transitionEnd"`）
   * @param gutterNum - gutter num parameter (`number`) / 分隔槽数值参数（`number`）
   */
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

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  public override ngOnDestroy(): void {
    this.stopDragging();
    this.unbindGutterTouchStart();
    if (this._clickTimeout !== null) {
      clearTimeout(this._clickTimeout);
      this._clickTimeout = null;
    }
    this.gutterElsSub?.unsubscribe();
    this.dragProgressSubject.complete();
    super.ngOnDestroy();
  }

  /**
   * Executes `collapseArea` to handle collapse area.
   * @zh 执行 `collapseArea`，用于折叠区域。
   * @param comp - comp parameter (`SplitAreaDirective | DuiPanelComponent`) / 组件参数（`SplitAreaDirective | DuiPanelComponent`）
   * @param newSize - new size parameter (`number`) / 新尺寸参数（`number`）
   * @param gutter - gutter parameter (`"left" | "right"`) / 分隔槽参数（`"left" | "right"`）
   */
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

  /**
   * Executes `expandArea` to handle expand area.
   * @zh 执行 `expandArea`，用于展开区域。
   * @param comp - comp parameter (`SplitAreaDirective | DuiPanelComponent`) / 组件参数（`SplitAreaDirective | DuiPanelComponent`）
   */
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
  /**
   * Executes `getAriaAreaSizeText` to handle get aria area size text.
   * @zh 执行 `getAriaAreaSizeText`，用于获取Aria区域尺寸文本。
   * @param size - size parameter (`number`) / 尺寸参数（`number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public getAriaAreaSizeText(size: number | null): string {
    if (size === null) {
      return null;
    }
    return size.toFixed(0) + ' ' + this.unit;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param c - c parameter (`string | number | ComponentBase`) / c参数（`string | number | ComponentBase`）
   * @param ad - ad parameter (`boolean`) / ad参数（`boolean`）
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  override remove(c: ComponentBase | string | number, ad?: boolean): ComponentBase {
    const comp = super.remove(c, false);
    if (comp) {
      const index = this.viewContainer.indexOf(comp.reference.hostView);
      this.viewContainer.remove(index);
    }
    return comp;
  }

  /**
   * Executes `_addItem` to handle add item.
   * @zh 执行 `_addItem`，用于添加条目。
   * @param comp - comp parameter (`ComponentBase`) / 组件参数（`ComponentBase`）
   * @param index - index parameter (`number`) / 索引参数（`number`）
   */
  protected override _addItem(comp: ComponentBase, index: number): void {
    this.items.add(comp);
    if (comp.onAdded) {
      comp.onAdded(this, index);
    }
    this.viewContainer.insert(comp.reference.hostView);
    this.onAdd(comp);
    this.trigger('add', this);
  }

  /**
   * Executes `havePanel` to handle have panel.
   * @zh 执行 `havePanel`，用于具有面板。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public havePanel(comp): boolean {
    return this.getComponent(comp) !== undefined;
  }
}
