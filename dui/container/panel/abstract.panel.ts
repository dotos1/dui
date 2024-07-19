
import { AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, Directive, ElementRef, HostBinding, Injector, Input, OnDestroy, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import * as _ from 'lodash-es';
import { Container } from '../container.main';
import { IArea } from './interface/IArea';

@Directive()
export class AbstractPanel extends Container implements AfterViewInit,OnDestroy{


  @Input() config: any = {};

  public state = 'none';

  public autoLoad: any;


  public collapsed = false;


  public flex: string = '';

  el: any;


  public override style: any;

  public inTab: boolean = false;

  @Input()
  public overflowX: string = "auto";

  @Input()
  public overflowY: string = "auto";

  @ViewChild('panel', { read: ViewContainerRef }) public override viewContainer: ViewContainerRef;

  @HostBinding('style.flex-direction') get cssFlexdirection() {
    return (this.fxLayout === 'row') ? 'row' : 'column';
  }
  @HostBinding('style.min-width') get cssMinwidth() {
    return (this.fxLayout === 'row') ? `${this._getNbGutters() * this.gutterSize}px` : null;
  }

  @HostBinding('style.min-height') get cssMinheight() {
    return (this.fxLayout === 'column') ? `${this._getNbGutters() * this.gutterSize}px` : null;
  }
  @HostBinding('style.width') get cssWidth() {
    if(this.width){
      return `${this.width}px`;
    }else if(this._fxLayout=='row'&&this.size!=null){
      return (this.size*100)+'%';
    }else{
      return '100%'
    }
  }

  @HostBinding('style.height') get cssHeight() {
    if(this.height){
      return `${this.height}px`;
    }else if(this._fxLayout=='column'&&this.size!=null){
      return (this.size*100)+'%';
    }else{
      return '100%'
    }
  }

  @HostBinding('style.overflow-x') get cssOverflowX() {
    return this.overflowX ? `${this.overflowX}` : 'auto';
  }

  @HostBinding('style.overflow-y') get cssOverflowY() {
    return this.overflowY ? `${this.overflowY}` : 'auto';
  }

  @Input('opened') opened: boolean = false;

  private _gutterSize: number = 1;
  @Input() set gutterSize(v: number) {
    v = Number(v);
    this._gutterSize = (!isNaN(v) && v > 0) ? v : 1;
    this.doLayout(false, false);
  }
  get gutterSize(): number {
    return this._gutterSize;
  }

   @Input()   override disabled: boolean = false;

  private _width: number | null = null;

  @Input() set width(v:any) {
    v = Number(v);
    this._width = (!isNaN(v) && v > 0) ? v : null;
    this.doLayout(false, false);
  }

  get width(): any {
    return this._width;
  }

  private _height: any = null;
  @Input() set height(v: any) {
    v = Number(v);
    this._height = (!isNaN(v) && v > 0) ? v : null;
    this.doLayout(false, false);
  }
  get height(): any {
    return this._height;
  }

  private _order: number | null = null;

  @Input() set order(v: number | null) {
    v = Number(v);
    this._order = !isNaN(v) ? v : null;
    if (this.ownerCt) {
      this.ownerCt.updateArea(this, true, false);
    }
  }

  get order(): number | null {
    return this._order;
  }


  private _size: number | null = null;

  @Input() set size(v: number | null) {
    v = Number(v);
    this._size = (!isNaN(v) && v >= 0 && v <= 100) ? (v / 100) : null;
    if (this.ownerCt) {
      this.ownerCt.updateArea(this, false, true);
    }
  }

  get size(): number | null {
    return this._size;
  }

  private _minSize: number = 0;

  @Input() set minSize(v: number) {
    v = Number(v);
    this._minSize = (!isNaN(v) && v > 0) ? v : 0;
    if (this.ownerCt) {
      this.ownerCt.updateArea(this, false, true);
    }
  }

  get minSize(): number {
    return this._minSize;
  }


  private _maxSize: number = 0;

  @Input() set maxSize(v: number) {
    v = Number(v);
    this._maxSize = (!isNaN(v) && v > 0) ? v : 0;
    if (this.ownerCt) {
      this.ownerCt.updateArea(this, false, true);
    }
  }

  get maxSize(): number {
    return this._maxSize;
  }


  private _visible: boolean = true;

  @Input() set visible(v: boolean) {
    v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
    this._visible = v;
    if (this.ownerCt) {
      if (this.visible) {
        this.ownerCt.showArea(this);
      } else {
        this.ownerCt.hideArea(this);
      }
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  private _split: boolean = false;

  @Input() set split(v: boolean) {
    this._split = v;
  }

  get split(): boolean {
    return this._split;
  }

  private _dir: 'ltr' | 'rtl' = 'ltr';

  @Input() set dir(v: 'ltr' | 'rtl') {
    v = (v === 'rtl') ? 'rtl' : 'ltr';
    this._dir = v;
  }

  get dir(): 'ltr' | 'rtl' {
    return this._dir;
  }

  public _fxLayout: 'row' | 'column' = 'row';

  @Input() set fxLayout(v: 'row' | 'column') {
    v = (v === 'row') ? 'row' : 'column';
    this._fxLayout = v;
     this.doLayout(false, false);
  }

  get fxLayout(): 'row' | 'column' {
    return this._fxLayout;
  }

  set displayedAreas(displayedAreas:IArea[]) {

    this._displayedAreas=displayedAreas;
  }

  get displayedAreas():IArea[] {

    return this._displayedAreas;
  }

  public  _displayedAreas: IArea[] = [];

  set hidedAreas(hidedAreas:IArea[]) {
    hidedAreas  }

  get hidedAreas():IArea[] {
    return this._hidedAreas;
  }

  public  _hidedAreas: IArea[] = [];

  private  lockListeners: Function[] = [];

  constructor(
    protected _element: ElementRef,
    protected renderer: Renderer2,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef
  ) {
    super(resolver, injector, detectRef);
    this.el = this._element.nativeElement;
  }


  // private
  override init(config: any) {

    super.init(config);

    this.detectRef.detectChanges();
    if (this.viewContainer) {
      this.viewContainer.clear();
    }
    const items = this.items;
    if (items) {
      delete this.items;
      this.add(items);
    }
    this.doLayout(true, true);
  }

  public override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.doLayout(true, true);
  }

  public override ngOnDestroy(): void {
    this.detectRef.detach();
    if (this.ownerCt && this.ownerCt.xtype === 'panel') {
      this.ownerCt.removeArea(this);
    }
  }

  public setActive(comp: any): void {
    if (_.isObjectLike(comp)) {
      comp = comp['id'];
    }
    if (this.items) {
      this.items.each(item => {
        if (item.id === comp) {
          item.show()
        } else {
          item.hide();
        }
      });
    }
    this.detectRef.markForCheck();
  }

  protected _getNbGutters(): number {
    return this.displayedAreas.length - 1;
  }

  public lockEvents(): void {
    this.lockListeners.push(this.renderer.listen(this.el, 'selectstart', () => false));
    this.lockListeners.push(this.renderer.listen(this.el, 'dragstart', () => false));
  }
  public unlockEvents(): void {
    while (this.lockListeners.length > 0) {
      const fct = this.lockListeners.pop();
      if (fct) {
        fct();
      }
    }
  }

  public setStyleVisibleAndDir(isVisible: boolean, isDragging: boolean, direction: 'row' | 'column'): void {
    if (isVisible === false) {
      this.setStyleFlexbasis('0', isDragging);
      this.renderer.setStyle(this.el, 'overflow-x', 'hidden');
      this.renderer.setStyle(this.el, 'overflow-y', 'hidden');
      if (direction === 'column') {
        this.renderer.setStyle(this.el, 'max-width', '0');
      }
    } else {
      this.renderer.setStyle(this.el, 'overflow-x', 'hidden');
      this.renderer.setStyle(this.el, 'overflow-y', 'auto');
      this.renderer.removeStyle(this.el, 'max-width');
    }
    if (direction === 'row') {
      this.renderer.setStyle(this.el, 'height', '100%');
      this.renderer.removeStyle(this.el, 'width');
    } else {
      this.renderer.setStyle(this.el, 'width', '100%');
      this.renderer.removeStyle(this.el, 'height');
    }
  }

  public setStyleOrder(value: number): void {
    this.renderer.setStyle(this.el, 'order', value);
  }

  public setStyleFlexbasis(value: string, isDragging: boolean): void {
    // If component not yet initialized or gutter being dragged, disable transition
    if (this.ownerCt.isViewInitialized === false || isDragging === true) {
      this._setStyleTransition(false);
    } else {
      this._setStyleTransition(this.ownerCt.useTransition);
    }
    this.renderer.setStyle(this.el, 'flex-basis', value);
  }

  private _setStyleTransition(useTransition: boolean): void {
    if (useTransition) {
      this.renderer.setStyle(this.el, 'transition', `flex-basis 0.3s`);
    } else {
      this.renderer.removeStyle(this.el, 'transition');
    }
  }
  public getSizePixel(prop: 'offsetWidth' | 'offsetHeight'): number {
    return this.el[prop];
  }


  // private
  initEvents() {

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  doLayout(shallow: boolean, force?: boolean): void {

  }

  override add(comp): any {
    this.initItems();
    const args = arguments.length > 1;
    if (args || _.isArray(comp)) {
      const result = [];
      _.each(args ? arguments : comp,
        (c) => {
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
