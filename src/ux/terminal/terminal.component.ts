/**
 * @fileoverview Module `src/ux/terminal/terminal.component.ts` providing terminal component definitions and implementation.
 * @zh 模块文件 `src/ux/terminal/terminal.component.ts`，提供终端组件相关的定义与实现。
 */

import { DuiStyle } from '@dotos/dui/base';
import { Component,  ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Subject, Observable, Subscription } from 'rxjs';
import { ResizeObserver } from '@juggle/resize-observer';
import { ResizeEvent } from '@dotos/dui/common/resize-element';
import { NgTerminal } from './terminal';

/**
 * Angular component `TerminalComponent` (selector: 'dui-terminal') providing terminal component presentation and interaction in `src/ux/terminal`.
 * @zh Angular 组件 `TerminalComponent`（selector: 'dui-terminal'），提供终端组件的视图渲染与交互逻辑（位于 `src/ux/terminal`）。
 */
@Component({
  selector: 'dui-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalComponent implements  OnChanges, AfterViewInit, NgTerminal, OnDestroy {
  /**
   * Property `term` (`Terminal`) storing term.
   * @zh 属性 `term`（类型：`Terminal`），用于存储或配置term。
   */
  private term: Terminal;
  /**
   * Property `fitAddon` (`FitAddon`) storing fit addon.
   * @zh 属性 `fitAddon`（类型：`FitAddon`），用于存储或配置适配Addon。
   */
  private fitAddon: FitAddon;
  /**
   * Property `keyInputSubject` (`Subject<string>`) storing key input subject (default: `new Subject<string>()`).
   * @zh 属性 `keyInputSubject`（类型：`Subject<string>`），用于存储或配置键输入属性主题流（默认值：`new Subject<string>()`）。
   */
  private keyInputSubject: Subject<string> = new Subject<string>();
  /**
   * Property `keyEventSubject` (`Subject<{ key: string; domEvent: KeyboardEvent; }>`) storing key event subject.
   * @zh 属性 `keyEventSubject`（类型：`Subject<{ key: string; domEvent: KeyboardEvent; }>`），用于存储或配置键事件主题流。
   */
  private keyEventSubject = new Subject<{ key: string; domEvent: KeyboardEvent; }>();
  /**
   * Property `requestRenderFromAPI` (`Subject<{…}>`) storing request render from api.
   * @zh 属性 `requestRenderFromAPI`（类型：`Subject<{…}>`），用于存储或配置请求渲染从API接口。
   */
  private requestRenderFromAPI = new Subject<{
    rowChanged?: boolean, columnChanged?: boolean
    , dragged?: { draggedWidth: string, draggedHeight: string }
    , hostResized?: { width: string, height: string }
    , whenTerminalDimensionIsOverOuterDiv?: { width: string, height: string }
  }>();
  /**
   * Property `allLogsSubject` (`Subject<{…}>`) storing all logs subject.
   * @zh 属性 `allLogsSubject`（类型：`Subject<{…}>`），用于存储或配置全部日志主题流。
   */
  private allLogsSubject = new Subject<{
    rowChanged: boolean
    , columnChanged: boolean
    , dragged?: { draggedWidth: string, draggedHeight: string }
    , hostResized?: { width: string, height: string }
    , whenTerminalDimensionIsOverOuterDiv?: { width: string, height: string }
  }>();

  /**
   * Property `keyInputSubjectSubscription` (`Subscription`) storing key input subject subscription.
   * @zh 属性 `keyInputSubjectSubscription`（类型：`Subscription`），用于存储或配置键输入属性主题流订阅对象。
   */
  private keyInputSubjectSubscription: Subscription;
  /**
   * Property `keyEventSubjectSubscription` (`Subscription`) storing key event subject subscription.
   * @zh 属性 `keyEventSubjectSubscription`（类型：`Subscription`），用于存储或配置键事件主题流订阅对象。
   */
  private keyEventSubjectSubscription: Subscription;
  /**
   * Property `allLogsSubjectSubscription` (`Subscription`) storing all logs subject subscription.
   * @zh 属性 `allLogsSubjectSubscription`（类型：`Subscription`），用于存储或配置全部日志主题流订阅对象。
   */
  private allLogsSubjectSubscription: Subscription;
  /**
   * Property `requestRenderSubscription` (`Subscription`) storing request render subscription.
   * @zh 属性 `requestRenderSubscription`（类型：`Subscription`），用于存储或配置请求渲染订阅对象。
   */
  private requestRenderSubscription: Subscription;
  /**
   * Property `resizableObservers` (`ResizeObserver[]`) storing resizable observers (default: `[]`).
   * @zh 属性 `resizableObservers`（类型：`ResizeObserver[]`），用于存储或配置是否可调尺寸观察者（默认值：`[]`）。
   */
  private resizableObservers: ResizeObserver[] = [];
  /**
   * Property `h` (`number`) storing h.
   * @zh 属性 `h`（类型：`number`），用于存储或配置h。
   */
  private h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  /**
   * Property `dataSource` (`Observable<string>`) storing data source.
   * @zh 属性 `dataSource`（类型：`Observable<string>`），用于存储或配置数据源。
   */
  private dataSource: Observable<string>;
  /**
   * Property `dataSourceSubscription` (`Subscription`) storing data source subscription.
   * @zh 属性 `dataSourceSubscription`（类型：`Subscription`），用于存储或配置数据源订阅对象。
   */
  private dataSourceSubscription: Subscription;
  /**
   * Property `paddingSize` (`5`) storing padding size (default: `5`).
   * @zh 属性 `paddingSize`（类型：`5`），用于存储或配置内边距尺寸（默认值：`5`）。
   */
  private readonly paddingSize = 5;
  /**
   * Property `stylesForDiv` (`Partial<CSSStyleDeclaration>`) storing styles for div (default: `{ 'display': 'block' }`).
   * @zh 属性 `stylesForDiv`（类型：`Partial<CSSStyleDeclaration>`），用于存储或配置样式集合用于Div（默认值：`{ 'display': 'block' }`）。
   */
  stylesForDiv: Partial<CSSStyleDeclaration> = { 'display': 'block' };

   /**
    * Output event emitter `keyInput` (`EventEmitter`) firing when key input emitter occurs.
    * @zh 输出事件 `keyInput`（类型：`EventEmitter`），当触发键输入属性发射器时向外发出事件。
    */
   @Output('keyInput')
   keyInputEmitter = new EventEmitter<string>();

   /**
    * Output event emitter `keyEvent` (`EventEmitter`) firing when key event emitter occurs.
    * @zh 输出事件 `keyEvent`（类型：`EventEmitter`），当触发键事件发射器时向外发出事件。
    */
   @Output('keyEvent')
   keyEventEmitter = new EventEmitter<{ key: string; domEvent: KeyboardEvent; }>();


  /**
   * Input setter `_dataSource` updating data source.
   * @zh 输入属性 `_dataSource` 的设置器，用于更新数据源。
   * @param ds - New data source value (`Observable<string>`) / 新的数据源值（`Observable<string>`）
   */
  @Input('dataSource')
  set _dataSource(ds) {
    if (this.dataSourceSubscription != null) {
      this.dataSourceSubscription.unsubscribe();
      this.dataSourceSubscription = null;
    }
    this.dataSource = ds;
    if (this.dataSource) {
      this.dataSourceSubscription = this.dataSource.subscribe((data) => {
        this.writeln(data);
      });
    }
  }
  /**
   * Gets the current data source (`_dataSource: any`).
   * @zh 获取当前数据源（`_dataSource: any`）。
   */
  get _dataSource() {
    return this.dataSource;
  }

  /**
   * Input property `rows` (`number`) configuring rows input.
   * @zh 输入属性 `rows`（类型：`number`），用于配置行列表输入属性。
   */
  @Input('rows')
  _rowsInput?: number;

  /**
   * Input property `cols` (`number`) configuring cols input.
   * @zh 输入属性 `cols`（类型：`number`），用于配置列列表输入属性。
   */
  @Input('cols')
  _colsInput?: number;

  /**
   * Input property `minWidth` (`number`) configuring min width input.
   * @zh 输入属性 `minWidth`（类型：`number`），用于配置最小值宽度输入属性。
   */
  @Input('minWidth')
  _minWidthInput?: number;

  /**
   * Input property `minHeight` (`number`) configuring min height input.
   * @zh 输入属性 `minHeight`（类型：`number`），用于配置最小值高度输入属性。
   */
  @Input('minHeight')
  _minHeightInput?: number;

  /**
   * Input setter `draggable` updating draggable.
   * @zh 输入属性 `draggable` 的设置器，用于更新是否可拖拽。
   * @param draggable - New draggable value (`boolean`) / 新的是否可拖拽值（`boolean`）
   */
  @Input('draggable')
  set draggable(draggable: boolean) {
    this._draggableInput = draggable;
  }

  /**
   * Gets the current draggable (`draggable: any`).
   * @zh 获取当前是否可拖拽（`draggable: any`）。
   */
  get draggable() {
    return this._draggableInput;
  }

  /**
   * Input setter `xtermOptions` updating xterm options.
   * @zh 输入属性 `xtermOptions` 的设置器，用于更新xterm配置选项。
   * @param val - New xterm options value (`any`) / 新的xterm配置选项值（`any`）
   */
  @Input('xtermOptions')
  set xtermOptions(val){
    this._xtermOptions=val;
  }
  /**
   * Gets the current xterm options (`xtermOptions: any`).
   * @zh 获取当前xterm配置选项（`xtermOptions: any`）。
   */
  get xtermOptions(){
    return this._xtermOptions;
  }

  /**
   * Input setter `theme` updating theme.
   * @zh 输入属性 `theme` 的设置器，用于更新主题。
   * @param val - New theme value (`any`) / 新的主题值（`any`）
   */
  @Input('theme')
  set theme(val){
    this._theme=val;
  }
  /**
   * Gets the current theme (`theme: any`).
   * @zh 获取当前主题（`theme: any`）。
   */
  get theme(){
    return this._theme;
  }
  /**
   * Property `_theme` (`any`) storing theme.
   * @zh 属性 `_theme`（类型：`any`），用于存储或配置主题。
   */
  _theme;

  /**
   * Property `_xtermOptions` (`any`) storing xterm options.
   * @zh 属性 `_xtermOptions`（类型：`any`），用于存储或配置xterm配置选项。
   */
  _xtermOptions?;

  /**
   * Property `lastDraggedPosition` (`{ width: string; height: string; }`) storing last dragged position.
   * @zh 属性 `lastDraggedPosition`（类型：`{ width: string; height: string; }`），用于存储或配置末尾Dragged位置。
   */
  lastDraggedPosition: { width: string, height: string };

  /**
   * Property `_draggableInput` (`boolean`) storing draggable input (default: `false`).
   * @zh 属性 `_draggableInput`（类型：`boolean`），用于存储或配置是否可拖拽输入属性（默认值：`false`）。
   */
  _draggableInput?: boolean = false;

  /**
   * Property `_stylesInput` (`DuiStyle`) storing styles input (default: `{}`).
   * @zh 属性 `_stylesInput`（类型：`DuiStyle`），用于存储或配置样式集合输入属性（默认值：`{}`）。
   */
  _stylesInput: DuiStyle = {};

  /**
   * Executes `setMinWidth` to handle set min width.
   * @zh 执行 `setMinWidth`，用于集合最小值宽度。
   * @param width - width parameter (`number`) / 宽度参数（`number`）
   */
  setMinWidth(width: number): void {
    this._minWidthInput = width;
  }

  /**
   * Executes `setMinHeight` to handle set min height.
   * @zh 执行 `setMinHeight`，用于集合最小值高度。
   * @param height - height parameter (`number`) / 高度参数（`number`）
   */
  setMinHeight(height: number): void {
    this._minHeightInput = height;
  }

  /**
   * Executes `setDraggable` to handle set draggable.
   * @zh 执行 `setDraggable`，用于集合是否可拖拽。
   * @param draggable - draggable parameter (`boolean`) / 是否可拖拽参数（`boolean`）
   */
  setDraggable(draggable: boolean): void {
    this._draggableInput = draggable;
    this.lastDraggedPosition = undefined;
    this.ref.markForCheck();
  }

  /**
   * Executes `setXtermOptions` to handle set xterm options.
   * @zh 执行 `setXtermOptions`，用于集合Xterm配置选项。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   */
  setXtermOptions(options): void {
    this._xtermOptions = options;
    this.requestRenderFromAPI.next({});
  }

  /**
   * Executes `setRows` to handle set rows.
   * @zh 执行 `setRows`，用于集合行列表。
   * @param rows - rows parameter (`number`) / 行列表参数（`number`）
   */
  setRows(rows: number): void {
    if (this._rowsInput != rows) {
      this._rowsInput = rows;
      this.requestRenderFromAPI.next({ rowChanged: true });
    }
  }

  /**
   * Executes `setCols` to handle set cols.
   * @zh 执行 `setCols`，用于集合列列表。
   * @param cols - cols parameter (`number`) / 列列表参数（`number`）
   */
  setCols(cols: number): void {
    if (this._colsInput != cols) {
      this._colsInput = cols;
      this.requestRenderFromAPI.next({ columnChanged: true });
    }
  }

  /**
   * Executes `setStyle` to handle set style.
   * @zh 执行 `setStyle`，用于集合样式。
   * @param styleObject - style object parameter (`any`) / 样式对象参数（`any`）
   */
  setStyle(styleObject): void {
    if (JSON.stringify(this._stylesInput ?? {}) != JSON.stringify(styleObject ?? {})) {
      this._stylesInput = styleObject;
      this.requestRenderFromAPI.next({});
    }
  }
  /**
   * Template/content query reference `terminalOuter` (`ElementRef<any>`) targeting terminal outer.
   * @zh 模板/内容视图查询引用 `terminalOuter`（`@ViewChild`），指向终端外部。
   */
  @ViewChild('terminal', { static: true })
  terminalOuter: ElementRef;

  /**
   * Template/content query reference `resizeBox` (`ElementRef<any>`) targeting resize box.
   * @zh 模板/内容视图查询引用 `resizeBox`（`@ViewChild`），指向调整尺寸盒子容器。
   */
  @ViewChild('resizeBox', { static: true })
  resizeBox: ElementRef;

  /**
   * Executes `getNextOrWait` to handle get next or wait.
   * @zh 执行 `getNextOrWait`，用于获取下一个OrWait。
   */
  private getNextOrWait() {
    if (!this.hostRef.nativeElement.isConnected) {
      this.stopAndPolling();
    } else {
      this.releaseNextOne();
    }
  }
  /**
   * Executes `pushToWaitingQueue` to handle push to waiting queue.
   * @zh 执行 `pushToWaitingQueue`，用于推入转换为Waiting队列。
   * @param item - item parameter (`{…}`) / 条目参数（`{…}`）
   */
  private pushToWaitingQueue(item: {
    rowChanged: boolean
    , columnChanged: boolean
    , dragged?: { draggedWidth: string, draggedHeight: string }
    , hostResized?: { width: string, height: string }
    , whenTerminalDimensionIsOverOuterDiv?: { width: string, height: string }
  }) {
    this.waitingQueue.push(item);
    this.releaseNextOne();
  }

  /**
   * Executes `stopAndPolling` to handle stop and polling.
   * @zh 执行 `stopAndPolling`，用于停止AndPolling。
   */
  private stopAndPolling() {
    const pollFunction = () => {
      if (this.interval)
        return;
      const interval = setInterval(() => {
        if (this.hostRef.nativeElement.isConnected) {
          clearInterval(interval);
          this.interval = undefined;
          this.releaseNextOne();
        }
      }, 500);
      this.interval = interval;
    }
    pollFunction();
  }

  /**
   * Property `interval` (`number`) storing interval.
   * @zh 属性 `interval`（类型：`number`），用于存储或配置间隔定时器。
   */
  interval: ReturnType<typeof setInterval>;


  /**
   * Property `releaseNextOne` (`() => void`) storing release next one.
   * @zh 属性 `releaseNextOne`（类型：`() => void`），用于存储或配置release下一个One。
   */
  private releaseNextOne = () => {
    if (!this.interval) {
      let list = this.waitingQueue.splice(0, 1);
      if (list.length == 1) {
        this.allLogsSubject.next(list[0]);
      }
    }
  }

  /**
   * Property `waitingQueue` (`{…}[]`) storing waiting queue (default: `[]`).
   * @zh 属性 `waitingQueue`（类型：`{…}[]`），用于存储或配置waiting队列（默认值：`[]`）。
   */
  private waitingQueue: {
    rowChanged: boolean
    , columnChanged: boolean
    , dragged?: { draggedWidth: string, draggedHeight: string }
    , hostResized?: { width: string, height: string }
    , whenTerminalDimensionIsOverOuterDiv?: { width: string, height: string }
  }[] = [];

  /**
   * Creates an instance of `TerminalComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TerminalComponent` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param ref - Injected or initial ref (`ChangeDetectorRef`) / 注入或传入的引用（`ChangeDetectorRef`）
   * @param hostRef - Injected or initial host ref (`ElementRef<any>`) / 注入或传入的宿主引用（`ElementRef<any>`）
   */
  constructor(private renderer: Renderer2, private ref: ChangeDetectorRef, private hostRef: ElementRef) {
    this.requestRenderSubscription = this.requestRenderFromAPI.subscribe(change => {
      let changeWithDefault = {
        rowChanged: false, columnChanged: false, ...change
      };
      this.pushToWaitingQueue(changeWithDefault);
      this.getNextOrWait();
    });
  }
  /**
   * Executes `observableSetup` to handle observable setup.
   * @zh 执行 `observableSetup`，用于可观察流Setup。
   */
  private observableSetup() {
    this.term.onData((input) => {
      this.keyInputSubject.next(input);
    });
    this.term.onKey(e => {
      this.keyEventSubject.next(e);
    });
    this.keyInputSubjectSubscription = this.keyInputSubject.subscribe((data) => {
      this.keyInputEmitter.emit(data);
    })
    this.keyEventSubjectSubscription = this.keyEventSubject.subscribe((e) => {
      this.keyEventEmitter.emit(e);
    });

    this.resizableObservers = [this.observeTerminalDimension(), this.observeHostDimension()];
    this.allLogsSubjectSubscription = this.allLogsSubject.subscribe((change) => {
      if (change)
        this.coordinateOuterAndTerminal(change);
      else
        this.coordinateOuterAndTerminal(change);
      this.getNextOrWait();
    });
    this.getNextOrWait();
  }

  /**
   * Executes `setOuterDimensions` to handle set outer dimensions.
   * @zh 执行 `setOuterDimensions`，用于集合外部维度列表。
   * @param left - left parameter (`number`) / 左侧位置参数（`number`）
   * @param top - top parameter (`number`) / 顶部位置参数（`number`）
   * @param width - width parameter (`number`) / 宽度参数（`number`）
   * @param height - height parameter (`number`) / 高度参数（`number`）
   */
  private setOuterDimensions(left: number, top: number, width: number, height: number) {
    this.requestRenderFromAPI.next({
      rowChanged: false, columnChanged: false
      , dragged: { draggedWidth: `${width}px`, draggedHeight: `${height}px` }
    });
  }


  /**
   * Executes `applyStyleToDiv` to handle apply style to div.
   * @zh 执行 `applyStyleToDiv`，用于应用样式转换为Div。
   */
  private applyStyleToDiv() {
    Object.keys(this.stylesForDiv).map(key => {
      return { key, value: this.stylesForDiv[key] }
    }).forEach(({ key, value }) => {
      if (value)
        this.renderer.setStyle(this.resizeBox.nativeElement, key, value);
      else {
        this.renderer.removeStyle(this.resizeBox.nativeElement, key);
      }
    });
    // this.stylesForDiv = this.stylesForDiv; //invalidate
  } 


  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    this.fitAddon = new FitAddon();
    this.term = new Terminal();
    this.term.open(this.terminalOuter.nativeElement);
    this.term.loadAddon(this.fitAddon);
    this.observableSetup();
    this.requestRenderFromAPI.next({});
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes?: SimpleChanges) {
    if (changes?.['_rowsInput']) {
      if (changes?.['_rowsInput']?.previousValue != changes?.['_rowsInput']?.currentValue) {
        this.requestRenderFromAPI.next({ rowChanged: true });
      }
    }
    if (changes?.['_colsInput']) {
      if (changes?.['_colsInput']?.previousValue != changes?.['_colsInput']?.currentValue) {
        this.requestRenderFromAPI.next({ columnChanged: true });
      }
    }
    // this.requestRenderFromAPI.next({});
  }

  /**
   * Property `resizeHandleStyleRule` (`CSSStyleRule`) storing resize handle style rule.
   * @zh 属性 `resizeHandleStyleRule`（类型：`CSSStyleRule`），用于存储或配置调整尺寸连接手柄样式规则。
   */
  resizeHandleStyleRule?: CSSStyleRule;
  /**
   * Property `resizeHandleActiveStyleRule` (`CSSStyleRule`) storing resize handle active style rule.
   * @zh 属性 `resizeHandleActiveStyleRule`（类型：`CSSStyleRule`），用于存储或配置调整尺寸连接手柄激活样式规则。
   */
  resizeHandleActiveStyleRule?: CSSStyleRule;


  /**
   * Executes `coordinateOuterAndTerminal` to handle coordinate outer and terminal.
   * @zh 执行 `coordinateOuterAndTerminal`，用于坐标外部And终端。
   * @param changeList - change list parameter (`{…}`) / 变更列表参数（`{…}`）
   */
  private coordinateOuterAndTerminal(changeList: {
    rowChanged: boolean
    , columnChanged: boolean
    , dragged?: { draggedWidth: string, draggedHeight: string }
    , hostResized?: { width: string, height: string }
    , whenTerminalDimensionIsOverOuterDiv?: { width: string, height: string }
  }) {
    // apply options to the xterm terminal
    if(this.theme&&this._xtermOptions){
      this._xtermOptions['theme']=this.theme;
    }
    this.term.options = { ...this._xtermOptions };

    if (this._xtermOptions?.theme?.background) {
      if (!this.resizeHandleStyleRule)
        this.resizeHandleStyleRule = this.findCssStyleRule(".resize-handle[");
      if (this.resizeHandleStyleRule)
        this.resizeHandleStyleRule.style.backgroundColor = this._xtermOptions.theme.background;
    }
    if (this._xtermOptions?.theme?.border) {
      if (!this.resizeHandleActiveStyleRule)
        this.resizeHandleActiveStyleRule = this.findCssStyleRule(".handle-active");
      if (this.resizeHandleActiveStyleRule)
        this.resizeHandleActiveStyleRule.style.backgroundColor = this._xtermOptions.theme.border;
    }

    this.stylesForDiv = {
      ...this.stylesForDiv
      , ...this._stylesInput
      , width: this.stylesForDiv.width
      , height: this.stylesForDiv.height
    };

    if (changeList.dragged) {
      this.stylesForDiv.width = changeList.dragged.draggedWidth;
      this.stylesForDiv.height = changeList.dragged.draggedHeight;
      this.lastDraggedPosition = { width: changeList.dragged.draggedWidth, height: changeList.dragged.draggedHeight };
    } else if (!this._rowsInput && !this._colsInput && !(this.draggable && this.lastDraggedPosition)) {

      this.stylesForDiv.width = '100%';
      this.stylesForDiv.height = '100%';
    }
    this.applyStyleToDiv();

    if (changeList.rowChanged || changeList.columnChanged) {
      this.term.resize(this._colsInput ?? this.term.cols, this._rowsInput ?? this.term.rows);
    } else {
      this.term.element.style.paddingLeft = `${this.paddingSize}px`;
      this.term.element.style.paddingRight = `${this.paddingSize}px`;
      this.fitAddon.fit();
      this.term.element.style.padding = '0px';
    }

    // coordinate difference between terminal and outer
    let xtermScreen = this.term.element.getElementsByClassName('xterm-screen')[0];
    let xtermViewport = this.term.element.getElementsByClassName('xterm-viewport')[0];
    const terminalWidth = xtermScreen.clientWidth;
    const terminalHeight = xtermScreen.clientHeight;
    const core = (this.underlying as unknown as { _core? })._core;
    const scrollWidth: number = core.viewport.scrollBarWidth as number;

    // It fixes that the viewport's width doesn't changes after calling fit()
    this.renderer.setStyle(xtermViewport, 'width', `${terminalWidth + scrollWidth}px`);
    this.stylesForDiv = {
      ...this.stylesForDiv, width: `${terminalWidth + scrollWidth + this.paddingSize * 2}px`
      , height: `${terminalHeight + this.paddingSize * 2}px`
    };
    this.applyStyleToDiv();
    this.ref.markForCheck();
  }

  /**
   * Executes `observeTerminalDimension` to handle observe terminal dimension.
   * @zh 执行 `observeTerminalDimension`，用于观察终端维度。
   */
  observeTerminalDimension() {
    let viewport: HTMLDivElement | undefined = this.terminalOuter.nativeElement.querySelector('.xterm-viewport');
    if (viewport) {
      const resizeObserver = new ResizeObserver(entries => {
        const divWidth = parseFloat(getComputedStyle(this.terminalOuter.nativeElement).width);
        const divHeight = parseFloat(getComputedStyle(this.terminalOuter.nativeElement).height);
        let width: number = undefined;
        let height: number = undefined;
        for (let entry of entries) {
          if (entry.contentBoxSize) {
            if (entry.target instanceof HTMLElement) {
              width = parseFloat(getComputedStyle(entry.target).width);
              height = parseFloat(getComputedStyle(entry.target).height);
            }
          } else {
            width = parseFloat(getComputedStyle(entry.target).width);
            height = parseFloat(getComputedStyle(entry.target).height);
          }
        }
        if (width > divWidth || height > divHeight) {
          this.requestRenderFromAPI.next({ whenTerminalDimensionIsOverOuterDiv: { width: `${width}px`, height: `${height}px` } });
        }
      });
      resizeObserver.observe(viewport);
      return resizeObserver;
    } else {
      console.error("Invalid state is detected. xterm element should exist below .terminal-outer.")
      return null;
    }
  }

  /**
   * Executes `observeHostDimension` to handle observe host dimension.
   * @zh 执行 `observeHostDimension`，用于观察宿主维度。
   */
  observeHostDimension() {
    let hostElement: HTMLDivElement | undefined = this.hostRef.nativeElement;
    if (hostElement) {
      const resizeObserver = new ResizeObserver(entries => {
        let width: number = undefined;
        let height: number = undefined;
        for (let entry of entries) {
          if (entry.contentBoxSize) {
            if (entry.target instanceof HTMLElement) {
              width = parseFloat(getComputedStyle(entry.target).width);
              height = parseFloat(getComputedStyle(entry.target).height);
            }
          } else {
            width = parseFloat(getComputedStyle(entry.target).width);
            height = parseFloat(getComputedStyle(entry.target).height);
          }
        }
        this.requestRenderFromAPI.next({ hostResized: { width: `${width}px`, height: `${height}px` } });
      });
      resizeObserver.observe(hostElement);
      return resizeObserver;
    } else {
      console.error("Invalid state is detected. xterm element should exist below .terminal-outer.")
      return null;
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    if (this.keyInputSubjectSubscription)
      this.keyInputSubjectSubscription.unsubscribe();
    if (this.dataSourceSubscription)
      this.dataSourceSubscription.unsubscribe();
    if (this.keyEventSubjectSubscription)
      this.keyEventSubjectSubscription.unsubscribe();
    if (this.requestRenderSubscription)
      this.requestRenderSubscription.unsubscribe();
    if (this.allLogsSubjectSubscription)
      this.allLogsSubjectSubscription.unsubscribe();
    if (this.interval)
      clearInterval(this.interval);
    if (this.term){
      this.term.dispose();
    }
     
    this.resizableObservers.forEach(ob => ob?.disconnect());
  }

  /**
   * Executes `write` to handle write.
   * @zh 执行 `write`，用于写入。
   * @param chars - chars parameter (`string`) / 字符参数（`string`）
   */
  write(chars: string) {
    this.term?.write(chars);
  }

  /**
   * Executes `writeln` to handle writeln.
   * @zh 执行 `writeln`，用于writeln。
   * @param chars - chars parameter (`string`) / 字符参数（`string`）
   */
  writeln(chars: string) {
    this.term?.writeln(chars);
  }

  /**
   * Gets the current key input (`keyInput: Observable<string>`).
   * @zh 获取当前键输入属性（`keyInput: Observable<string>`）。
   */
  get keyInput(): Observable<string> {
    return this.keyInputSubject;
  }

  /**
   * Executes `onData` to handle on data.
   * @zh 执行 `onData`，用于当数据。
   * @returns Result of type `Observable<string>` / 类型为 `Observable<string>` 的返回值
   */
  onData(): Observable<string> {
    return this.keyInputSubject;
  }

  /**
   * Gets the current key event input (`keyEventInput: Observable<{ key: string; domEvent: KeyboardEvent; }>`).
   * @zh 获取当前键事件输入属性（`keyEventInput: Observable<{ key: string; domEvent: KeyboardEvent; }>`）。
   */
  get keyEventInput(): Observable<{ key: string; domEvent: KeyboardEvent; }> {
    return this.keyEventSubject;
  }

  /**
   * Executes `onKey` to handle on key.
   * @zh 执行 `onKey`，用于当键。
   * @returns Result of type `Observable<{ key: string; domEvent: KeyboardEvent; }>` / 类型为 `Observable<{ key: string; domEvent: KeyboardEvent; }>` 的返回值
   */
  onKey(): Observable<{ key: string; domEvent: KeyboardEvent; }> {
    return this.keyEventSubject;
  }

  /**
   * Gets the current underlying (`underlying: Terminal`).
   * @zh 获取当前underlying（`underlying: Terminal`）。
   */
  get underlying(): Terminal {
    return this.term;
  }

  /**
   * Gets the current is draggable on edge activated (`isDraggableOnEdgeActivated: any`).
   * @zh 获取当前是否为是否可拖拽当边/连线已激活（`isDraggableOnEdgeActivated: any`）。
   */
  get isDraggableOnEdgeActivated() {

    return this._draggableInput;
  }


  /**
   * Executes `onResizeEnd` to handle on resize end.
   * @zh 执行 `onResizeEnd`，用于当调整尺寸结束。
   * @param left - left parameter (`number`) / 左侧位置参数（`number`）
   * @param top - top parameter (`number`) / 顶部位置参数（`number`）
   * @param width - width parameter (`number`) / 宽度参数（`number`）
   * @param height - height parameter (`number`) / 高度参数（`number`）
   */
  onResizeEnd(left: number, top: number, width: number, height: number): void {
    this.setOuterDimensions(left, top, width, height);
  }


  /**
   * Executes `validatorFactory` to handle validator factory.
   * @zh 执行 `validatorFactory`，用于校验器工厂。
   * @returns Result of type `(re: ResizeEvent) => boolean` / 类型为 `(re: ResizeEvent) => boolean` 的返回值
   */
  validatorFactory(): (re: ResizeEvent) => boolean {
    return (re: ResizeEvent) => {
      if (this._draggableInput) {
        // let left = re.rectangle.left, 
        // top = re.rectangle.top, 
       let width = re.rectangle.width, 
        height = re.rectangle.height;
        if ((width < (this._minWidthInput ?? 100)) || (height < (this._minHeightInput ?? 50))) {
          return false;
        } else return true;
      } else
        return false;
    }
  }

  /**
   * Executes `findCssStyleRule` to handle find css style rule.
   * @zh 执行 `findCssStyleRule`，用于查找CSS样式样式规则。
   * @param containingSelector - containing selector parameter (`string`) / containing选择器参数（`string`）
   */
  private findCssStyleRule(containingSelector: string) {
    for (let i = 0; i < document.styleSheets.length; i++) {
      let sheet = document.styleSheets.item(i);
      if(sheet){
        try {
          let classes = sheet.cssRules;
          for (let i = 0; i < classes.length; i++) {
            let rule = classes.item(i) as CSSStyleRule;
            if ('selectorText' in rule)
              if (rule.selectorText.includes(containingSelector))
                return rule;
          }
        } catch (e) {
          continue
        }
      }
    }
    return null;
  }
}
