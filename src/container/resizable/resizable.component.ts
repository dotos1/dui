/**
 * @fileoverview Module `src/container/resizable/resizable.component.ts` providing resizable component definitions and implementation.
 * @zh 模块文件 `src/container/resizable/resizable.component.ts`，提供是否可调尺寸组件相关的定义与实现。
 */

import {
  Component, ElementRef, Renderer2, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, OnChanges,
  AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy
} from '@angular/core';
import { PositionStore } from '@dotos1/dui/core/position';
import {
  IPoint, IPosionOptions, ISize, IPositionState, IPositionEvent, IRectangle, IResizable
} from '@dotos1/dui/core/position';
import { RESIZE_INIT, MOUSE_DOWN, RESIZE_STOP, RESIZE } from '@dotos1/dui/core/position';
import { resizeReducer, defaultBound } from '@dotos1/dui/core/position';
import { Dui } from '@dotos1/dui/core';

/**
 * Angular component `ResizableComponent` (selector: '[Resizable]') providing resizable component presentation and interaction in `src/container/resizable`.
 * @zh Angular 组件 `ResizableComponent`（selector: '[Resizable]'），提供是否可调尺寸组件的视图渲染与交互逻辑（位于 `src/container/resizable`）。
 */
@Component({
  selector: '[Resizable]',
  providers: [PositionStore],
  templateUrl: 'resizable.component.html',
  styleUrls: ['resizable.component.scss'],
  host: {
     hostID: 'dui-resizable' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ResizableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy, IResizable {

  // Resize start event.
  /**
   * Output event emitter `resizeStart` (`EventEmitter<IPositionEvent>`) firing when resize start occurs.
   * @zh 输出事件 `resizeStart`（类型：`EventEmitter<IPositionEvent>`），当触发调整尺寸开始时向外发出事件。
   */
  @Output() resizeStart = new EventEmitter<IPositionEvent>();
  // Resizing event.
  /**
   * Output event emitter `resizing` (`EventEmitter<IPositionEvent>`) firing when resizing occurs.
   * @zh 输出事件 `resizing`（类型：`EventEmitter<IPositionEvent>`），当触发调整尺寸中时向外发出事件。
   */
  @Output() resizing = new EventEmitter<IPositionEvent>();
  // Resize end event.
  /**
   * Output event emitter `resizeEnd` (`EventEmitter<IPositionEvent>`) firing when resize end occurs.
   * @zh 输出事件 `resizeEnd`（类型：`EventEmitter<IPositionEvent>`），当触发调整尺寸结束时向外发出事件。
   */
  @Output() resizeEnd = new EventEmitter<IPositionEvent>();
  // Width of the element.
  /**
   * Input property `resizableConf` (`IResizable`) configuring resizable conf.
   * @zh 输入属性 `resizableConf`（类型：`IResizable`），用于配置是否可调尺寸Conf。
   */
  @Input() resizableConf: IResizable;

  // Width of the element.
  /**
   * Property `width` (`number`) storing width.
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
   */
  public width: number;
  // Height of the element.
  /**
   * Property `height` (`number`) storing height.
   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  public height: number;
  // x coordinate of the element.
  /**
   * Property `x` (`number`) storing x.
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
   */
  public x: number;
  // y coordinate of the element.
  /**
   * Property `y` (`number`) storing y.
   * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
   */
  public y: number;
  // Maximum width.
  /**
   * Property `maxWidth` (`number`) storing max width (default: `Infinity`).
   * @zh 属性 `maxWidth`（类型：`number`），用于存储或配置最大值宽度（默认值：`Infinity`）。
   */
  public maxWidth = Infinity;
  // Minimum width.
  /**
   * Property `minWidth` (`number`) storing min width (default: `0`).
   * @zh 属性 `minWidth`（类型：`number`），用于存储或配置最小值宽度（默认值：`0`）。
   */
  public minWidth = 0;
  // Maximum height.
  /**
   * Property `maxHeight` (`number`) storing max height (default: `Infinity`).
   * @zh 属性 `maxHeight`（类型：`number`），用于存储或配置最大值高度（默认值：`Infinity`）。
   */
  public maxHeight = Infinity;
  // Minimum height.
  /**
   * Property `minHeight` (`number`) storing min height (default: `0`).
   * @zh 属性 `minHeight`（类型：`number`），用于存储或配置最小值高度（默认值：`0`）。
   */
  public minHeight = 0;
  // Disable the resize.
  /**
   * Property `resizable` (`boolean`) storing resizable (default: `false`).
   * @zh 属性 `resizable`（类型：`boolean`），用于存储或配置是否可调尺寸（默认值：`false`）。
   */
  public resizable: boolean = false;
  // An array which contains the resize directions.
  /**
   * Property `directions` (`string[]`) storing directions (default: `['bottom', 'right']`).
   * @zh 属性 `directions`（类型：`string[]`），用于存储或配置方向（默认值：`['bottom', 'right']`）。
   */
  public directions: string[] = ['bottom', 'right'];
  // Resize in a grid.
  /**
   * Property `grid` (`ISize`) storing grid (default: `{ width: 1, height: 1 }`).
   * @zh 属性 `grid`（类型：`ISize`），用于存储或配置网格表格（默认值：`{ width: 1, height: 1 }`）。
   */
  public grid: ISize = { width: 1, height: 1 };
  // Bound the resize.
  /**
   * Property `bound` (`IRectangle`) storing bound (default: `null`).
   * @zh 属性 `bound`（类型：`IRectangle`），用于存储或配置已绑定（默认值：`null`）。
   */
  public bound: IRectangle = null;
  // Resize ratio.
  /**
   * Property `ratio` (`number`) storing ratio (default: `null`).
   * @zh 属性 `ratio`（类型：`number`），用于存储或配置比例（默认值：`null`）。
   */
  public ratio: number = null;

  /**
   * Property `_unlistenFns` (`(() => void)[]`) storing unlisten fns (default: `[]`).
   * @zh 属性 `_unlistenFns`（类型：`(() => void)[]`），用于存储或配置取消监听函数（默认值：`[]`）。
   */
  private _unlistenFns: Array<() => void> = [];

  /**
   * Creates an instance of `ResizableComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ResizableComponent` 实例，并初始化其依赖项与内部状态。
   * @param _el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param _store - Injected or initial store (`PositionStore`) / 注入或传入的状态仓库（`PositionStore`）
   * @param _renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(private _el: ElementRef,
    private _store: PositionStore,
    private _renderer: Renderer2,
    public detectRef: ChangeDetectorRef,
    private _ngZone: NgZone) { }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, 'ngresizable');
    this._store.addReducer(resizeReducer);
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    Dui.apply(this, this.resizableConf);
    if (!this.resizable) {
      this.directions = [];
    }
    this.setSize(
      { width: this.width, height: this.height },
      { x: this.x, y: this.y }
    );
  }


  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    this.emitAction(RESIZE_INIT, {
      x: 0,
      y: 0
    }, {
      x: this._el.nativeElement.offsetLeft,
      y: this._el.nativeElement.offsetTop
    }, {
      width: this._el.nativeElement.offsetWidth,
      height: this._el.nativeElement.offsetHeight
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._unbindDocumentListeners();
  }

  /**
   * Executes `_bindDocumentListeners` to handle bind document listeners.
   * @zh 执行 `_bindDocumentListeners`，用于绑定文档对象监听器列表。
   */
  private _bindDocumentListeners() {
    this._unbindDocumentListeners();
    this._ngZone.runOutsideAngular(() => {
      this._unlistenFns.push(
        this._renderer.listen('document', 'mousemove', (e) => this.onMouseMove(e)),
        this._renderer.listen('document', 'touchmove', (e) => this.onMouseMove(e)),
        this._renderer.listen('document', 'mouseup', () => this._ngZone.run(() => this.onMouseUp())),
        this._renderer.listen('document', 'touchend', () => this._ngZone.run(() => this.onMouseUp()))
      );
    });
  }

  /**
   * Executes `_unbindDocumentListeners` to handle unbind document listeners.
   * @zh 执行 `_unbindDocumentListeners`，用于解绑文档对象监听器列表。
   */
  private _unbindDocumentListeners() {
    while (this._unlistenFns.length > 0) {
      const unlisten = this._unlistenFns.pop();
      if (unlisten) {
        unlisten();
      }
    }
  }

  /**
   * Executes `onMouseMove` to handle on mouse move.
   * @zh 执行 `onMouseMove`，用于当鼠标移动。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onMouseMove(e) {
    if (e.touches) {
      e = e.touches[0];
    }
    if (this._state && this._state.isResizing) {
      this.emitAction(RESIZE, {
        x: e.clientX,
        y: e.clientY
      });
      const csize = this._state.currentSize;
      const cpos = this._state.currentPosition;
      this.setSize(csize, cpos);
      this.emitEvent(this.resizing);
    }
  }

  /**
   * Executes `onMouseDown` to handle on mouse down.
   * @zh 执行 `onMouseDown`，用于当鼠标向下。
   * @param e - e parameter (`any`) / e参数（`any`）
   * @param dir - dir parameter (`any`) / 目录参数（`any`）
   */
  onMouseDown(e, dir) {
    if (e.touches) {
      e = e.touches[0];
    }
    this._bindDocumentListeners();
    this.emitAction(MOUSE_DOWN, {
      x: e.clientX,
      y: e.clientY
    }, {
      x: this._el.nativeElement.offsetLeft,
      y: this._el.nativeElement.offsetTop
    }, {
      width: this._el.nativeElement.offsetWidth,
      height: this._el.nativeElement.offsetHeight
    }, dir);
    this.emitEvent(this.resizeStart);
  }

  /**
   * Executes `onMouseUp` to handle on mouse up.
   * @zh 执行 `onMouseUp`，用于当鼠标向上。
   */
  onMouseUp() {
    this._unbindDocumentListeners();
    if (!this._state || !this._state.isResizing) {
      return;
    }
    this.emitAction(RESIZE_STOP, { x: 0, y: 0 }, { x: 0, y: 0 });
    this.emitEvent(this.resizeEnd);
  }

  /**
   * Executes `emitAction` to handle emit action.
   * @zh 执行 `emitAction`，用于发出动作。
   * @param action - action parameter (`String`) / 动作参数（`String`）
   * @param mousePosition - mouse position parameter (`IPoint`) / 鼠标位置参数（`IPoint`）
   * @param startPosition - start position parameter (`IPoint`) / 开始位置参数（`IPoint`）
   * @param startSize - start size parameter (`ISize`) / 开始尺寸参数（`ISize`）
   * @param startDirection - start direction parameter (`string`) / 开始方向参数（`string`）
   */
  private emitAction(action: String, mousePosition: IPoint, startPosition?: IPoint, startSize?: ISize, startDirection?: string) {
    const options: IPosionOptions = {
      minSize: { width: this.minWidth, height: this.minHeight },
      maxSize: { width: this.maxWidth, height: this.maxHeight },
      grid: this.grid,
      ratio: this.ratio,
      resizable: this.resizable,
      directions: this.directions,
      bound: this.bound || defaultBound
    };
    this._store.emitAction(action, mousePosition, startPosition, options, startSize, startDirection);
  }

  /**
   * Executes `emitEvent` to handle emit event.
   * @zh 执行 `emitEvent`，用于发出事件。
   * @param output - output parameter (`EventEmitter<IPositionEvent>`) / 输出事件参数（`EventEmitter<IPositionEvent>`）
   */
  private emitEvent(output: EventEmitter<IPositionEvent>) {
    const payload = {
      position: this._state.currentPosition,
      size: this._state.currentSize,
      direction: this._state.direction
    };
    if (NgZone.isInAngularZone()) {
      output.next(payload);
    } else {
      this._ngZone.run(() => output.next(payload));
    }
  }

  /**
   * Gets the current state (`_state: IPositionState`).
   * @zh 获取当前状态（`_state: IPositionState`）。
   */
  private get _state(): IPositionState {
    return this._store.state;
  }
  /**
   * Executes `restore` to handle restore.
   * @zh 执行 `restore`，用于还原。
   */
  public restore() {
    const csize = this._state.currentSize;
    const cpos = this._state.currentPosition;
    this.setSize(csize, cpos);
  }
  /**
   * Executes `setSize` to handle set size.
   * @zh 执行 `setSize`，用于集合尺寸。
   * @param size - size parameter (`ISize`) / 尺寸参数（`ISize`）
   * @param pos - pos parameter (`IPoint`) / 位置参数（`IPoint`）
   */
  public setSize(size: ISize, pos: IPoint) {
    this.width = size.width;
    this.height = size.height;
    this.x = pos.x;
    this.y = pos.y;
    this._renderer.setStyle(this._el.nativeElement, 'width', this.width + 'px');
    this._renderer.setStyle(this._el.nativeElement, 'height', this.height + 'px');
    this._renderer.setStyle(this._el.nativeElement, 'left', this.x + 'px');
    this._renderer.setStyle(this._el.nativeElement, 'top', this.y + 'px');
  }
}
