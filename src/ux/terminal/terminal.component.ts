import { Component,  ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Subject, Observable, Subscription } from 'rxjs';
import { ResizeObserver } from '@juggle/resize-observer';
import { ResizeEvent } from '@dotos/dui/common/resize-element';
import { NgTerminal } from './terminal';

@Component({
  selector: 'dui-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalComponent implements  OnChanges, AfterViewInit, NgTerminal, OnDestroy {
  private term: Terminal;
  private fitAddon: FitAddon;
  private keyInputSubject: Subject<string> = new Subject<string>();
  private keyEventSubject = new Subject<{ key: string; domEvent: KeyboardEvent; }>();
  private requestRenderFromAPI = new Subject<{
    rowChanged?: boolean, columnChanged?: boolean
    , dragged?: { draggedWidth: string, draggedHeight: string }
    , hostResized?: { width: string, height: string }
    , whenTerminalDimensionIsOverOuterDiv?: { width: string, height: string }
  }>();
  private allLogsSubject = new Subject<{
    rowChanged: boolean
    , columnChanged: boolean
    , dragged?: { draggedWidth: string, draggedHeight: string }
    , hostResized?: { width: string, height: string }
    , whenTerminalDimensionIsOverOuterDiv?: { width: string, height: string }
  }>();

  private keyInputSubjectSubscription: Subscription;
  private keyEventSubjectSubscription: Subscription;
  private allLogsSubjectSubscription: Subscription;
  private requestRenderSubscription: Subscription;
  private resizableObservers: ResizeObserver[] = [];
  private h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  private dataSource: Observable<string>;
  private dataSourceSubscription: Subscription;
  private readonly paddingSize = 5;
  stylesForDiv: Partial<CSSStyleDeclaration> = { 'display': 'block' };

   @Output('keyInput')
   keyInputEmitter = new EventEmitter<string>();

   @Output('keyEvent')
   keyEventEmitter = new EventEmitter<{ key: string; domEvent: KeyboardEvent; }>();


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
  get _dataSource() {
    return this.dataSource;
  }

  @Input('rows')
  _rowsInput?: number;

  @Input('cols')
  _colsInput?: number;

  @Input('minWidth')
  _minWidthInput?: number;

  @Input('minHeight')
  _minHeightInput?: number;

  @Input('draggable')
  set draggable(draggable: boolean) {
    this._draggableInput = draggable;
  }

  get draggable() {
    return this._draggableInput;
  }

  @Input('xtermOptions')
  set xtermOptions(val){
    this._xtermOptions=val;
  }
  get xtermOptions(){
    return this._xtermOptions;
  }

  @Input('theme')
  set theme(val){
    this._theme=val;
  }
  get theme(){
    return this._theme;
  }
  _theme:any;

  _xtermOptions?: ITerminalOptions & { theme?: any};

  lastDraggedPosition: { width: string, height: string };

  _draggableInput?: boolean = false;

  _stylesInput: any = {};

  setMinWidth(width: number): void {
    this._minWidthInput = width;
  }

  setMinHeight(height: number): void {
    this._minHeightInput = height;
  }

  setDraggable(draggable: boolean): void {
    this._draggableInput = draggable;
    this.lastDraggedPosition = undefined;
    this.ref.markForCheck();
  }

  setXtermOptions(options: ITerminalOptions & { theme?: any }): void {
    this._xtermOptions = options;
    this.requestRenderFromAPI.next({});
  }

  setRows(rows: number): void {
    if (this._rowsInput != rows) {
      this._rowsInput = rows;
      this.requestRenderFromAPI.next({ rowChanged: true });
    }
  }

  setCols(cols: number): void {
    if (this._colsInput != cols) {
      this._colsInput = cols;
      this.requestRenderFromAPI.next({ columnChanged: true });
    }
  }

  setStyle(styleObject: any): void {
    if (JSON.stringify(this._stylesInput ?? {}) != JSON.stringify(styleObject ?? {})) {
      this._stylesInput = styleObject;
      this.requestRenderFromAPI.next({});
    }
  }
  @ViewChild('terminal', { static: true })
  terminalOuter: ElementRef;

  @ViewChild('resizeBox', { static: true })
  resizeBox: ElementRef;

  private getNextOrWait() {
    if (!this.hostRef.nativeElement.isConnected) {
      this.stopAndPolling();
    } else {
      this.releaseNextOne();
    }
  }
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

  interval: ReturnType<typeof setInterval>;


  private releaseNextOne = () => {
    if (!this.interval) {
      let list = this.waitingQueue.splice(0, 1);
      if (list.length == 1) {
        this.allLogsSubject.next(list[0]);
      }
    }
  }

  private waitingQueue: {
    rowChanged: boolean
    , columnChanged: boolean
    , dragged?: { draggedWidth: string, draggedHeight: string }
    , hostResized?: { width: string, height: string }
    , whenTerminalDimensionIsOverOuterDiv?: { width: string, height: string }
  }[] = [];

  constructor(private renderer: Renderer2, private ref: ChangeDetectorRef, private hostRef: ElementRef) {
    this.requestRenderSubscription = this.requestRenderFromAPI.subscribe(change => {
      let changeWithDefault = {
        rowChanged: false, columnChanged: false, ...change
      };
      this.pushToWaitingQueue(changeWithDefault);
      this.getNextOrWait();
    });
  }
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

  private setOuterDimensions(left: number, top: number, width: number, height: number) {
    this.requestRenderFromAPI.next({
      rowChanged: false, columnChanged: false
      , dragged: { draggedWidth: `${width}px`, draggedHeight: `${height}px` }
    });
  }


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


  ngAfterViewInit() {
    this.fitAddon = new FitAddon();
    this.term = new Terminal();
    this.term.open(this.terminalOuter.nativeElement);
    this.term.loadAddon(this.fitAddon);
    this.observableSetup();
    this.requestRenderFromAPI.next({});
  }

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

  resizeHandleStyleRule?: CSSStyleRule;
  resizeHandleActiveStyleRule?: CSSStyleRule;


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
    const core = (this.underlying as any)._core;
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

  write(chars: string) {
    this.term?.write(chars);
  }

  writeln(chars: string) {
    this.term?.writeln(chars);
  }

  get keyInput(): Observable<string> {
    return this.keyInputSubject;
  }

  onData(): Observable<string> {
    return this.keyInputSubject;
  }

  get keyEventInput(): Observable<{ key: string; domEvent: KeyboardEvent; }> {
    return this.keyEventSubject;
  }

  onKey(): Observable<{ key: string; domEvent: KeyboardEvent; }> {
    return this.keyEventSubject;
  }

  get underlying(): Terminal {
    return this.term;
  }

  get isDraggableOnEdgeActivated() {

    return this._draggableInput;
  }


  onResizeEnd(left: number, top: number, width: number, height: number): void {
    this.setOuterDimensions(left, top, width, height);
  }


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
