import {
  Component, ElementRef, Renderer2, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, OnChanges,
  AfterViewInit, OnDestroy, NgZone
} from '@angular/core';
import { PositionStore } from '@dotos/dui/core/position';
import {
  IPoint, IPosionOptions, ISize, IPositionState, IPositionEvent, IRectangle, IResizable
} from '@dotos/dui/core/position';
import { RESIZE_INIT, MOUSE_DOWN, RESIZE_STOP, RESIZE } from '@dotos/dui/core/position';
import { resizeReducer, defaultBound } from '@dotos/dui/core/position';
import { Dui } from '@dotos/dui/core';

@Component({
  selector: '[Resizable]',
  providers: [PositionStore],
  templateUrl: 'resizable.component.html',
  styleUrls: ['resizable.component.scss'],
  host: {
     hostID: 'dui-resizable' + Math.random().toString(36).substring(2, 15),
  }
})
export class ResizableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy, IResizable {

  // Resize start event.
  @Output() resizeStart = new EventEmitter<IPositionEvent>();
  // Resizing event.
  @Output() resizing = new EventEmitter<IPositionEvent>();
  // Resize end event.
  @Output() resizeEnd = new EventEmitter<IPositionEvent>();
  // Width of the element.
  @Input() resizableConf: IResizable;

  // Width of the element.
  public width: number;
  // Height of the element.
  public height: number;
  // x coordinate of the element.
  public x: number;
  // y coordinate of the element.
  public y: number;
  // Maximum width.
  public maxWidth = Infinity;
  // Minimum width.
  public minWidth = 0;
  // Maximum height.
  public maxHeight = Infinity;
  // Minimum height.
  public minHeight = 0;
  // Disable the resize.
  public resizable: boolean = false;
  // An array which contains the resize directions.
  public directions: string[] = ['bottom', 'right'];
  // Resize in a grid.
  public grid: ISize = { width: 1, height: 1 };
  // Bound the resize.
  public bound: IRectangle = null;
  // Resize ratio.
  public ratio: number = null;

  private _unlistenFns: Array<() => void> = [];

  constructor(private _el: ElementRef,
    private _store: PositionStore,
    private _renderer: Renderer2,
    public detectRef: ChangeDetectorRef,
    private _ngZone: NgZone) { }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, 'ngresizable');
    this._store.addReducer(resizeReducer);
  }

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

  ngOnDestroy() {
    this._unbindDocumentListeners();
  }

  private _bindDocumentListeners() {
    this._unbindDocumentListeners();
    this._ngZone.runOutsideAngular(() => {
      this._unlistenFns.push(
        this._renderer.listen('document', 'mousemove', (e: any) => this.onMouseMove(e)),
        this._renderer.listen('document', 'touchmove', (e: any) => this.onMouseMove(e)),
        this._renderer.listen('document', 'mouseup', () => this._ngZone.run(() => this.onMouseUp())),
        this._renderer.listen('document', 'touchend', () => this._ngZone.run(() => this.onMouseUp()))
      );
    });
  }

  private _unbindDocumentListeners() {
    while (this._unlistenFns.length > 0) {
      const unlisten = this._unlistenFns.pop();
      if (unlisten) {
        unlisten();
      }
    }
  }

  onMouseMove(e: any) {
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

  onMouseDown(e: any, dir: any) {
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

  onMouseUp() {
    this._unbindDocumentListeners();
    if (!this._state || !this._state.isResizing) {
      return;
    }
    this.emitAction(RESIZE_STOP, { x: 0, y: 0 }, { x: 0, y: 0 });
    this.emitEvent(this.resizeEnd);
  }

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

  private get _state(): IPositionState {
    return this._store.state;
  }
  public restore() {
    const csize = this._state.currentSize;
    const cpos = this._state.currentPosition;
    this.setSize(csize, cpos);
  }
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
