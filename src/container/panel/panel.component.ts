/**
 * @fileoverview Module `src/container/panel/panel.component.ts` providing panel component definitions and implementation.
 * @zh 模块文件 `src/container/panel/panel.component.ts`，提供面板组件相关的定义与实现。
 */


import { DuiConfig } from '@dotos1/dui/base';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import {forEach}  from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractPanel } from './abstract.panel';
import { IArea } from './interface/IArea';
import { IPoint } from './interface/IPoint';
import { ILayoutTogglable } from './layout-toggle';

/**
 * Angular component `PanelComponent` (selector: 'panel') providing panel component presentation and interaction in `src/container/panel`.
 * @zh Angular 组件 `PanelComponent`（selector: 'panel'），提供面板组件的视图渲染与交互逻辑（位于 `src/container/panel`）。
 */
@Component({
  selector: 'panel',
  styleUrls: ['./panel.component.scss'],
  templateUrl: './panel.component.html',
  host: {
    '[style.flex]': 'flex',
    hostID: 'dui-panel' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})


export class PanelComponent extends AbstractPanel implements ILayoutTogglable,OnChanges,OnInit,AfterViewInit,OnDestroy {
  /**
   * Input property `config` (`DuiConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() override config: DuiConfig = {};

  /**
   * Input property `layout` (`string`) configuring layout (default: `'fit'`).
   * @zh 输入属性 `layout`（类型：`string`），用于配置布局（默认值：`'fit'`）。
   */
  @Input() override layout = 'fit';

  /**
   * Input setter `children` updating children.
   * @zh 输入属性 `children` 的设置器，用于更新子级列表。
   * @param v - New children value (`PanelComponent[]`) / 新的子级列表值（`PanelComponent[]`）
   */
  @Input()
  public set children(v: Array<PanelComponent>) {
    forEach(v, (panel) => {
      panel.ownerCt = this;
      this.addArea(panel);
    });
  }

  /**
   * Property `xtype` (`string`) storing xtype (default: `'panel'`).
   * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型（默认值：`'panel'`）。
   */
  public override xtype: string = 'panel';

  /**
   * Output event emitter `dragStart` (`EventEmitter<{ gutterNum: number; sizes: number[]; }>`) firing when drag start occurs.
   * @zh 输出事件 `dragStart`（类型：`EventEmitter<{ gutterNum: number; sizes: number[]; }>`），当触发拖拽开始时向外发出事件。
   */
  @Output() dragStart = new EventEmitter<{ gutterNum: number, sizes: number[] }>(false);

  /**
   * Output event emitter `dragProgress` (`EventEmitter<{ gutterNum: number; sizes: number[]; }>`) firing when drag progress occurs.
   * @zh 输出事件 `dragProgress`（类型：`EventEmitter<{ gutterNum: number; sizes: number[]; }>`），当触发拖拽进度条时向外发出事件。
   */
  @Output() dragProgress = new EventEmitter<{ gutterNum: number, sizes: number[] }>(false);

  /**
   * Output event emitter `dragEnd` (`EventEmitter<{ gutterNum: number; sizes: number[]; }>`) firing when drag end occurs.
   * @zh 输出事件 `dragEnd`（类型：`EventEmitter<{ gutterNum: number; sizes: number[]; }>`），当触发拖拽结束时向外发出事件。
   */
  @Output() dragEnd = new EventEmitter<{ gutterNum: number, sizes: number[] }>(false);

  /**
   * Output event emitter `gutterClick` (`EventEmitter<{ gutterNum: number; sizes: number[]; }>`) firing when gutter click occurs.
   * @zh 输出事件 `gutterClick`（类型：`EventEmitter<{ gutterNum: number; sizes: number[]; }>`），当触发分隔槽点击时向外发出事件。
   */
  @Output() gutterClick = new EventEmitter<{ gutterNum: number, sizes: number[] }>(false);

  /**
   * Property `transitionEndInternal` (`Subject<number[]>`) storing transition end internal (default: `new Subject<number[]>()`).
   * @zh 属性 `transitionEndInternal`（类型：`Subject<number[]>`），用于存储或配置过渡动画结束内部（默认值：`new Subject<number[]>()`）。
   */
  private transitionEndInternal = new Subject<number[]>();

  /**
   * Output event emitter `transitionEnd` (`Observable<number[]>`) firing when transition end occurs.
   * @zh 输出事件 `transitionEnd`（类型：`Observable<number[]>`），当触发过渡动画结束时向外发出事件。
   */
  @Output() transitionEnd = (<Observable<number[]>>this.transitionEndInternal.asObservable()).pipe(debounceTime(20));

  /**
   * Property `_gutterColor` (`string`) storing gutter color (default: `''`).
   * @zh 属性 `_gutterColor`（类型：`string`），用于存储或配置分隔槽颜色（默认值：`''`）。
   */
  private _gutterColor: string = '';
  /**
   * Input setter `gutterColor` updating gutter color.
   * @zh 输入属性 `gutterColor` 的设置器，用于更新分隔槽颜色。
   * @param v - New gutter color value (`string`) / 新的分隔槽颜色值（`string`）
   */
  @Input() set gutterColor(v: string) {
    this._gutterColor = (typeof v === 'string' && v !== '') ? v : '';
    this.detectRef.markForCheck();
  }
  /**
   * Gets the current gutter color (`gutterColor: string`).
   * @zh 获取当前分隔槽颜色（`gutterColor: string`）。
   */
  get gutterColor(): string {
    return this._gutterColor;
  }

  /**
   * Property `_fxLayout` (`"row" | "column"`) storing fx layout (default: `'row'`).
   * @zh 属性 `_fxLayout`（类型：`"row" | "column"`），用于存储或配置fx布局（默认值：`'row'`）。
   */
  public override _fxLayout: 'row' | 'column' = 'row';

  /**
   * Input setter `fxLayout` updating fx layout.
   * @zh 输入属性 `fxLayout` 的设置器，用于更新fx布局。
   * @param v - New fx layout value (`"row" | "column"`) / 新的fx布局值（`"row" | "column"`）
   */
  @Input() override set fxLayout(v: 'row' | 'column') {
    v = (v === 'row') ? 'row' : 'column';
    this._fxLayout = v;
    [...this.displayedAreas, ...this.hidedAreas].forEach(area => {
      area.comp.setStyleVisibleAndDir(area.comp.visible, this.isDragging, this._fxLayout);
    });
    this.doLayout(false, false);
  }

  /**
   * Gets the current fx layout (`fxLayout: 'row' | 'column'`).
   * @zh 获取当前fx布局（`fxLayout: 'row' | 'column'`）。
   */
  override get fxLayout(): 'row' | 'column' {
    return this._fxLayout;
  }

  /**
   * Property `_useTransition` (`boolean`) storing use transition (default: `false`).
   * @zh 属性 `_useTransition`（类型：`boolean`），用于存储或配置使用过渡动画（默认值：`false`）。
   */
  private _useTransition: boolean = false;

  /**
   * Input setter `useTransition` updating use transition.
   * @zh 输入属性 `useTransition` 的设置器，用于更新使用过渡动画。
   * @param v - New use transition value (`boolean`) / 新的使用过渡动画值（`boolean`）
   */
  @Input() set useTransition(v: boolean) {
    v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
    this._useTransition = v;
  }

  /**
   * Gets the current use transition (`useTransition: boolean`).
   * @zh 获取当前使用过渡动画（`useTransition: boolean`）。
   */
  get useTransition(): boolean {
    return this._useTransition;
  }


  /**
   * Property `isViewInitialized` (`boolean`) storing is view initialized (default: `false`).
   * @zh 属性 `isViewInitialized`（类型：`boolean`），用于存储或配置是否为视图已初始化（默认值：`false`）。
   */
  public isViewInitialized: boolean = false;

  /**
   * Property `isDragging` (`boolean`) storing is dragging (default: `false`).
   * @zh 属性 `isDragging`（类型：`boolean`），用于存储或配置是否为拖拽中（默认值：`false`）。
   */
  private isDragging: boolean = false;

  /**
   * Property `draggingWithoutMove` (`boolean`) storing dragging without move (default: `false`).
   * @zh 属性 `draggingWithoutMove`（类型：`boolean`），用于存储或配置拖拽中不含移动（默认值：`false`）。
   */
  private draggingWithoutMove: boolean = false;

  /**
   * Property `currentGutterNum` (`number`) storing current gutter num (default: `0`).
   * @zh 属性 `currentGutterNum`（类型：`number`），用于存储或配置当前分隔槽数值（默认值：`0`）。
   */
  private currentGutterNum: number = 0;

  /**
   * Property `dragListeners` (`Function[]`) storing drag listeners (default: `[]`).
   * @zh 属性 `dragListeners`（类型：`Function[]`），用于存储或配置拖拽监听器列表（默认值：`[]`）。
   */
  private readonly dragListeners: Function[] = [];

  /**
   * Property `hasNorthSouth` (`boolean`) storing has north south (default: `false`).
   * @zh 属性 `hasNorthSouth`（类型：`boolean`），用于存储或配置是否包含NorthSouth（默认值：`false`）。
   */
  public hasNorthSouth: boolean = false;

  /**
   * Property `hasWestEast` (`boolean`) storing has west east (default: `false`).
   * @zh 属性 `hasWestEast`（类型：`boolean`），用于存储或配置是否包含WestEast（默认值：`false`）。
   */
  public hasWestEast: boolean = false;

  /**
   * Property `hasOutlet` (`boolean`) storing has outlet (default: `false`).
   * @zh 属性 `hasOutlet`（类型：`boolean`），用于存储或配置是否包含Outlet（默认值：`false`）。
   */
  public hasOutlet: boolean = false;

  /**
   * Property `dragStartValues` (`{…}`) storing drag start values.
   * @zh 属性 `dragStartValues`（类型：`{…}`），用于存储或配置拖拽开始值列表。
   */
  private readonly dragStartValues = {
    sizePixelContainer: 0,
    sizePixelA: 0,
    sizePixelB: 0,
    sizePercentA: 0,
    sizePercentB: 0,
  };


  /**
   * Sets the displayed areas (`displayedAreas`).
   * @zh 设置已展示区域集合（`displayedAreas`）。
   * @param displayedAreas - New displayed areas value (`IArea[]`) / 新的已展示区域集合值（`IArea[]`）
   */
  override set displayedAreas(displayedAreas:IArea[]) {
    super.displayedAreas=displayedAreas;
  }

  /**
   * Gets the current displayed areas (`displayedAreas: IArea[]`).
   * @zh 获取当前已展示区域集合（`displayedAreas: IArea[]`）。
   */
  override get displayedAreas():IArea[] {
    return super.displayedAreas;
  }

  /**
   * Sets the hided areas (`hidedAreas`).
   * @zh 设置已隐藏区域集合（`hidedAreas`）。
   * @param hidedAreas - New hided areas value (`IArea[]`) / 新的已隐藏区域集合值（`IArea[]`）
   */
  override set hidedAreas(hidedAreas:IArea[]) {
    super.hidedAreas= hidedAreas;
  }

  /**
   * Gets the current hided areas (`hidedAreas: IArea[]`).
   * @zh 获取当前已隐藏区域集合（`hidedAreas: IArea[]`）。
   */
  override get hidedAreas():IArea[] {
    return super.hidedAreas;
  }

  /**
   * Creates an instance of `PanelComponent` and initializes its dependencies and internal state.
   * @zh 创建 `PanelComponent` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(
    protected override _element: ElementRef,
    protected override renderer: Renderer2,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef) {
    super(_element, renderer, injector, detectRef);
    this.el = this._element.nativeElement;
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(changes['config'].currentValue);
    }
  }

  // private
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    if(config){
      this.fxLayout=config.fxLayout;
      super.init(config);
    }
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  public override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.isViewInitialized = true;
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  public override ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.ownerCt && this.ownerCt.xtype === 'panel') {
      this.ownerCt.removeArea(this);
    }
  }


  /**
   * Executes `_addItem` to handle add item.
   * @zh 执行 `_addItem`，用于添加条目。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @param index - index parameter (`any`) / 索引参数（`any`）
   */
  protected override _addItem(comp, index) {
    super._addItem(comp, index);
    if (this.layout === 'border') {
      this.addArea(comp);
    }
  }

  /**
   * Executes `addArea` to handle add area.
   * @zh 执行 `addArea`，用于添加区域。
   * @param comp - comp parameter (`PanelComponent`) / 组件参数（`PanelComponent`）
   */
  public addArea(comp: PanelComponent): void {
    const newArea: IArea = {
      comp,
      order: 0,
      size: 0,
    };
    if (comp.visible === true) {
      if(this.layout== "border"){
        this.displayedAreas.push(newArea);
      }
    } else {
      this.hidedAreas.push(newArea);
    }
    comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.fxLayout);
  }

  /**
   * Executes `removeArea` to handle remove area.
   * @zh 执行 `removeArea`，用于移除区域。
   * @param comp - comp parameter (`PanelComponent`) / 组件参数（`PanelComponent`）
   */
  public removeArea(comp: PanelComponent): void {
    if (this.displayedAreas.some(a => a.comp === comp)) {
      const area = <IArea>this.displayedAreas.find(a => a.comp === comp);
      this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
      this.doLayout(true, true);
    } else if (this.hidedAreas.some(a => a.comp === comp)) {
      const area = <IArea>this.hidedAreas.find(a => a.comp === comp);
      this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
    }
  }

  /**
   * Executes `updateArea` to handle update area.
   * @zh 执行 `updateArea`，用于更新区域。
   * @param comp - comp parameter (`PanelComponent`) / 组件参数（`PanelComponent`）
   * @param resetOrders - reset orders parameter (`boolean`) / 重置顺序参数（`boolean`）
   * @param resetSizes - reset sizes parameter (`boolean`) / 重置尺寸列表参数（`boolean`）
   */
  public updateArea(comp: PanelComponent, resetOrders: boolean, resetSizes: boolean): void {
    const item = this.displayedAreas.find(a => a.comp === comp);
    if (item) {
      this.doLayout(resetOrders, resetSizes);
    }
  }

  /**
   * Executes `showArea` to handle show area.
   * @zh 执行 `showArea`，用于显示区域。
   * @param comp - comp parameter (`PanelComponent`) / 组件参数（`PanelComponent`）
   */
  public showArea(comp: PanelComponent): void {
    const area = this.hidedAreas.find(a => a.comp === comp);
    if (area) {
      comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.fxLayout);
      const areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
      this.displayedAreas.push(...areas);
      this.doLayout(true, true);
    }
  }

  /**
   * Executes `hideArea` to handle hide area.
   * @zh 执行 `hideArea`，用于隐藏区域。
   * @param comp - comp parameter (`PanelComponent`) / 组件参数（`PanelComponent`）
   */
  public hideArea(comp: PanelComponent): void {
    const area = this.displayedAreas.find(a => a.comp === comp);
    if (area) {
      comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.fxLayout);
      const areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
      // tslint:disable-next-line:no-shadowed-variable
      areas.forEach(area => {
        area.order = 0;
        area.size = 0;
      });
      this.hidedAreas.push(...areas);
      this.doLayout(true, true);
    }
  }

  /**
   * Executes `doLayout` to handle do layout.
   * @zh 执行 `doLayout`，用于执行布局。
   * @param resetOrders - reset orders parameter (`boolean`) / 重置顺序参数（`boolean`）
   * @param resetSizes - reset sizes parameter (`boolean`) / 重置尺寸列表参数（`boolean`）
   */
  public override doLayout(resetOrders: boolean, resetSizes: boolean): void {
    this.stopDragging();
    if (resetOrders === true) {
      if (this.displayedAreas.every(a => a.comp.order !== null)) {
        this.displayedAreas.sort((a, b) => (<number>a.comp.order) - (<number>b.comp.order));
      }
      this.displayedAreas.forEach((area, i) => {
        area.order = i * 2;
        area.comp.setStyleOrder(area.order);
      });
    }

    if (resetSizes === true) {
      let containerSizePixel = this._getNbGutters() * this.gutterSize;
      if (this.fxLayout === 'row') {
        containerSizePixel = this.width ? this.width : this.el['offsetWidth'];
      } else {
        containerSizePixel = this.height ? this.height : this.el['offsetHeight'];
      }
      const totalUserSize = <number>this.displayedAreas.reduce((total: number, s: IArea) => s.comp.size ? total + s.comp.size : total, 0);

      if (this.displayedAreas.every(a => a.comp.size !== null) && totalUserSize > .999 && totalUserSize < 1.001) {
        this.displayedAreas.forEach(area => {
          area.size = <number>area.comp.size;
        });
      } else {
        let leftSize = 1.0;
        this.displayedAreas.forEach(area => {
          const comp = area.comp;
          if (this.fxLayout === 'row') {
            if (comp.width) {
              //  let compWidth:number= comp.width ? comp.width : comp.el['offsetWidth'];
              area.size = comp.width / containerSizePixel;
              leftSize = leftSize - area.size;
            } else {
              area.size = leftSize;
            }
          } else {
            if (comp.height) {
              //  let compWidth:number= comp.width ? comp.width : comp.el['offsetWidth'];
              area.size = comp.height / containerSizePixel;
              leftSize = leftSize - area.size;
            } else {
              area.size = leftSize;
            }
          }
        });
      }
    }
    this.refreshStyleSizes();
    this.detectRef.markForCheck();
  }

  /**
   * Executes `refreshStyleSizes` to handle refresh style sizes.
   * @zh 执行 `refreshStyleSizes`，用于刷新样式尺寸列表。
   */
  private refreshStyleSizes(): void {
    const sumGutterSize = this._getNbGutters() * this.gutterSize;
    this.displayedAreas.forEach(area => {
      area.comp.setStyleFlexbasis(`calc( ${area.size * 100}% - ${area.size * sumGutterSize}px )`, this.isDragging);
    });
  }

  /**
   * Executes `startDragging` to handle start dragging.
   * @zh 执行 `startDragging`，用于开始拖拽中。
   * @param startEvent - start event parameter (`MouseEvent | TouchEvent`) / 开始事件参数（`MouseEvent | TouchEvent`）
   * @param gutterOrder - gutter order parameter (`number`) / 分隔槽顺序参数（`number`）
   * @param gutterNum - gutter num parameter (`number`) / 分隔槽数值参数（`number`）
   */
  public startDragging(startEvent: MouseEvent | TouchEvent, gutterOrder: number, gutterNum: number): void {
    startEvent.preventDefault();

    // Place code here to allow '(gutterClick)' event even if '[disabled]="true"'.
    this.currentGutterNum = gutterNum;
    this.draggingWithoutMove = true;
    this.dragListeners.push(this.renderer.listen('document', 'mouseup', (e: MouseEvent) => this.stopDragging(e)));
    this.dragListeners.push(this.renderer.listen('document', 'touchend', (e: TouchEvent) => this.stopDragging(e)));
    this.dragListeners.push(this.renderer.listen('document', 'touchcancel', (e: TouchEvent) => this.stopDragging(e)));

    if (this.disabled) {
      return;
    }

    const areaA = this.displayedAreas.find(a => a.order === gutterOrder - 1);
    const areaB = this.displayedAreas.find(a => a.order === gutterOrder + 1);

    if (!areaA || !areaB) {
      return;
    }

    const prop = (this.fxLayout === 'row') ? 'offsetWidth' : 'offsetHeight';
    this.dragStartValues.sizePixelContainer = this.el[prop];
    this.dragStartValues.sizePixelA = areaA.comp.getSizePixel(prop);
    this.dragStartValues.sizePixelB = areaB.comp.getSizePixel(prop);
    this.dragStartValues.sizePercentA = areaA.size;
    this.dragStartValues.sizePercentB = areaB.size;

    let start: IPoint;
    if (startEvent instanceof MouseEvent) {
      start = {
        x: startEvent.screenX,
        y: startEvent.screenY,
      };
    } else if (startEvent instanceof TouchEvent) {
      start = {
        x: startEvent.touches[0].screenX,
        y: startEvent.touches[0].screenY,
      };
    } else {
      return;
    }
    this.dragListeners.push(this.renderer.listen('document', 'mousemove', (e: MouseEvent) => this.dragEvent(e, start, areaA, areaB)));
    this.dragListeners.push(this.renderer.listen('document', 'touchmove', (e: TouchEvent) => this.dragEvent(e, start, areaA, areaB)));
    areaA.comp.lockEvents();
    areaB.comp.lockEvents();
    this.isDragging = true;
    this.notify('start');
  }

  /**
   * Executes `dragEvent` to handle drag event.
   * @zh 执行 `dragEvent`，用于拖拽事件。
   * @param event - event parameter (`MouseEvent | TouchEvent`) / 事件参数（`MouseEvent | TouchEvent`）
   * @param start - start parameter (`IPoint`) / 开始参数（`IPoint`）
   * @param areaA - area a parameter (`IArea`) / 区域A参数（`IArea`）
   * @param areaB - area b parameter (`IArea`) / 区域B参数（`IArea`）
   */
  private dragEvent(event: MouseEvent | TouchEvent, start: IPoint, areaA: IArea, areaB: IArea): void {
    if (!this.isDragging) {
      return;
    }
    let end: IPoint;
    if (event instanceof MouseEvent) {
      end = {
        x: event.screenX,
        y: event.screenY,
      };
    } else if (event instanceof TouchEvent) {
      end = {
        x: event.touches[0].screenX,
        y: event.touches[0].screenY,
      };
    } else {
      return;
    }
    this.draggingWithoutMove = false;
    this.drag(start, end, areaA, areaB);
  }

  /**
   * Executes `drag` to handle drag.
   * @zh 执行 `drag`，用于拖拽。
   * @param start - start parameter (`IPoint`) / 开始参数（`IPoint`）
   * @param end - end parameter (`IPoint`) / 结束参数（`IPoint`）
   * @param areaA - area a parameter (`IArea`) / 区域A参数（`IArea`）
   * @param areaB - area b parameter (`IArea`) / 区域B参数（`IArea`）
   */
  private drag(start: IPoint, end: IPoint, areaA: IArea, areaB: IArea): void {

    let offsetPixel = (this.fxLayout === 'row') ? (start.x - end.x) : (start.y - end.y);
    if (this.dir === 'rtl') {
      offsetPixel = -offsetPixel;
    }

    const minASize = areaA.comp.minSize ? areaA.comp.minSize : this.gutterSize;
    const minBSize = areaB.comp.minSize ? areaB.comp.minSize : this.gutterSize;

    const prop = (this.fxLayout === 'row') ? 'offsetWidth' : 'offsetHeight';
    const sizePixelContainer = this.el[prop];
    const maxASize = areaA.comp.maxSize ? areaA.comp.maxSize : sizePixelContainer;
    // const maxBSize = areaB.comp.maxSize ? areaB.comp.maxSize : this.gutterSize;

    let newSizePixelA = this.dragStartValues.sizePixelA - offsetPixel;
    const newSizePixelB = this.dragStartValues.sizePixelB + offsetPixel;

    if (newSizePixelA < this.gutterSize && newSizePixelB < this.gutterSize) {
      // WTF.. get out of here!
      return;
    } else if (newSizePixelA < minASize) {
      //  newSizePixelB += newSizePixelA;
      newSizePixelA = minASize;
    } else if (newSizePixelA > maxASize) {
      //  newSizePixelB += newSizePixelA;
      newSizePixelA = maxASize;
    } else if (newSizePixelB < minBSize) {
      return;
      //  newSizePixelB = minBSize;
      //  newSizePixelA += newSizePixelB;
    }

    if (newSizePixelA === 0) {
      areaB.size += areaA.size;
      areaA.size = 0;
    } else if (newSizePixelB === 0) {
      areaA.size += areaB.size;
      areaB.size = 0;
    } else {
      // NEW_PERCENT = START_PERCENT / START_PIXEL * NEW_PIXEL;
      if (this.dragStartValues.sizePercentA === 0) {
        areaB.size = this.dragStartValues.sizePercentB / this.dragStartValues.sizePixelB * newSizePixelB;
        areaA.size = this.dragStartValues.sizePercentB - areaB.size;
      } else if (this.dragStartValues.sizePercentB === 0) {
        areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
        areaB.size = this.dragStartValues.sizePercentA - areaA.size;
      } else {
        areaA.size = this.dragStartValues.sizePercentA / this.dragStartValues.sizePixelA * newSizePixelA;
        areaB.size = (this.dragStartValues.sizePercentA + this.dragStartValues.sizePercentB) - areaA.size;
      }
    }
    this.refreshStyleSizes();
    this.notify('progress');
  }

  /**
   * Executes `stopDragging` to handle stop dragging.
   * @zh 执行 `stopDragging`，用于停止拖拽中。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  private stopDragging(e?): void {
    if(e){
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.isDragging === false && this.draggingWithoutMove === false) {
      return;
    }
    this.displayedAreas.forEach(area => {
      area.comp.unlockEvents();
    });
    while (this.dragListeners.length > 0) {
      const fct = this.dragListeners.pop();
      if (fct) {
        fct();
      }
    }
    if (this.draggingWithoutMove === true) {
      this.notify('click');
    } else {
      this.notify('end');
    }
    this.isDragging = false;
    this.draggingWithoutMove = false;
  }

  /**
   * Executes `notify` to handle notify.
   * @zh 执行 `notify`，用于通知。
   * @param type - type parameter (`"progress" | "click" | "end" | "start" | "transitionEnd"`) / 类型参数（`"progress" | "click" | "end" | "start" | "transitionEnd"`）
   */
  public notify(type: 'start' | 'progress' | 'end' | 'click' | 'transitionEnd'): void {
    const areasSize: number[] = this.displayedAreas.map(a => a.size * 100);
    switch (type) {
      case 'start':
        return this.dragStart.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
      case 'progress':
        return this.dragProgress.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
      case 'end':
        return this.dragEnd.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
      case 'click':
        return this.gutterClick.emit({ gutterNum: this.currentGutterNum, sizes: areasSize });
      case 'transitionEnd':
        return this.transitionEndInternal.next(areasSize);
      default:
        return null;
    }
  }
}
