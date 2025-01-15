
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Injector, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import {forEach}  from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AbstractPanel } from './abstract.panel';
import { IArea } from './interface/IArea';
import { IPoint } from './interface/IPoint';
import { ILayoutTogglable } from './layout-toggle';

@Component({
  selector: 'panel',
  styleUrls: ['./panel.component.scss'],
  templateUrl: './panel.component.html',
  host: {
    '[style.flex]': 'flex',
    'hostID': crypto.randomUUID().toString()
  }
})


export class PanelComponent extends AbstractPanel implements ILayoutTogglable,OnChanges,OnInit,AfterViewInit,OnDestroy {
  @Input() override config: any = {};

  @Input() override layout = 'fit';

  @Input()
  public set children(v: Array<PanelComponent>) {
    forEach(v, (panel) => {
      panel.ownerCt = this;
      this.addArea(panel);
    });
  }

  public override xtype: string = 'panel';

  @Output() dragStart = new EventEmitter<{ gutterNum: number, sizes: number[] }>(false);

  @Output() dragProgress = new EventEmitter<{ gutterNum: number, sizes: number[] }>(false);

  @Output() dragEnd = new EventEmitter<{ gutterNum: number, sizes: number[] }>(false);

  @Output() gutterClick = new EventEmitter<{ gutterNum: number, sizes: number[] }>(false);

  private transitionEndInternal = new Subject<number[]>();

  @Output() transitionEnd = (<Observable<number[]>>this.transitionEndInternal.asObservable()).pipe(debounceTime(20));

  private _gutterColor: string = '';
  @Input() set gutterColor(v: string) {
    this._gutterColor = (typeof v === 'string' && v !== '') ? v : '';
    this.detectRef.markForCheck();
  }
  get gutterColor(): string {
    return this._gutterColor;
  }

  public override _fxLayout: 'row' | 'column' = 'row';

  @Input() override set fxLayout(v: 'row' | 'column') {
    v = (v === 'row') ? 'row' : 'column';
    this._fxLayout = v;
    [...this.displayedAreas, ...this.hidedAreas].forEach(area => {
      area.comp.setStyleVisibleAndDir(area.comp.visible, this.isDragging, this._fxLayout);
    });
    this.doLayout(false, false);
  }

  override get fxLayout(): 'row' | 'column' {
    return this._fxLayout;
  }

  private _useTransition: boolean = false;

  @Input() set useTransition(v: boolean) {
    v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
    this._useTransition = v;
  }

  get useTransition(): boolean {
    return this._useTransition;
  }


  public isViewInitialized: boolean = false;

  private isDragging: boolean = false;

  private draggingWithoutMove: boolean = false;

  private currentGutterNum: number = 0;

  private readonly dragListeners: Function[] = [];

  public hasNorthSouth: boolean = false;

  public hasWestEast: boolean = false;

  public hasOutlet: boolean = false;

  private readonly dragStartValues = {
    sizePixelContainer: 0,
    sizePixelA: 0,
    sizePixelB: 0,
    sizePercentA: 0,
    sizePercentB: 0,
  };


  override set displayedAreas(displayedAreas:IArea[]) {
    super.displayedAreas=displayedAreas;
  }

  override get displayedAreas():IArea[] {
    return super.displayedAreas;
  }

  override set hidedAreas(hidedAreas:IArea[]) {
    super.hidedAreas= hidedAreas;
  }

  override get hidedAreas():IArea[] {
    return super.hidedAreas;
  }

  constructor(
    protected override _element: ElementRef,
    protected override renderer: Renderer2,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef) {
    super(_element, renderer, resolver, injector, detectRef);
    this.el = this._element.nativeElement;
  }

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(changes['config'].currentValue);
    }
  }

  // private
  override init(config: any) {
    if(config){
      this.fxLayout=config.fxLayout;
      super.init(config);
    }
  }

  public override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.isViewInitialized = true;
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.ownerCt && this.ownerCt.xtype === 'panel') {
      this.ownerCt.removeArea(this);
    }
  }


  protected override _addItem(comp, index) {
    super._addItem(comp, index);
    if (this.layout === 'border') {
      this.addArea(comp);
    }
  }

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

  public updateArea(comp: PanelComponent, resetOrders: boolean, resetSizes: boolean): void {
    const item = this.displayedAreas.find(a => a.comp === comp);
    if (item) {
      this.doLayout(resetOrders, resetSizes);
    }
  }

  public showArea(comp: PanelComponent): void {
    const area = this.hidedAreas.find(a => a.comp === comp);
    if (area) {
      comp.setStyleVisibleAndDir(comp.visible, this.isDragging, this.fxLayout);
      const areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
      this.displayedAreas.push(...areas);
      this.doLayout(true, true);
    }
  }

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

  private refreshStyleSizes(): void {
    const sumGutterSize = this._getNbGutters() * this.gutterSize;
    this.displayedAreas.forEach(area => {
      area.comp.setStyleFlexbasis(`calc( ${area.size * 100}% - ${area.size * sumGutterSize}px )`, this.isDragging);
    });
  }

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

  private stopDragging(e?:any): void {
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
