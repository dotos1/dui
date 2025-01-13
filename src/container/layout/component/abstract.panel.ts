
import { ChangeDetectorRef, ComponentFactoryResolver, Directive, ElementRef, Injector, Input, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Container } from '@dotos/dui/container';
import {isArray,each}  from 'lodash-es';
import { getInputPositiveNumber, getInputboolean } from '../utils';
import { LayoutComponent } from './layout.component';

@Directive()
export class AbstractPanel extends Container implements OnChanges,OnInit,OnDestroy {


  @Input() config: any = {};

  public el: any;

  public override style: any;

  private _order: number | null = null

  @Input() set order(v: number | null) {
    this._order = getInputPositiveNumber(v, null)
    this.split.updateArea(this, true, false)
  }

  get order(): number | null {
    return this._order
  }

  private _size: number | null = null

  @Input() set size(v: number | null) {
    this._size = getInputPositiveNumber(v, null)
    this.split.updateArea(this, false, true)
  }

  get size(): number | null {
    return this._size
  }

  private _minSize: number | null = null

  @Input() set minSize(v: number | null) {
    this._minSize = getInputPositiveNumber(v, null)
    this.split.updateArea(this, false, true)
  }

  get minSize(): number | null {
    return this._minSize
  }

  private _maxSize: number | null = null

  @Input() set maxSize(v: number | null) {
    this._maxSize = getInputPositiveNumber(v, null)
    this.split.updateArea(this, false, true)
  }

  get maxSize(): number | null {
    return this._maxSize
  }

  private _lockSize = false

  @Input() set lockSize(v: boolean) {
    this._lockSize = getInputboolean(v)
    this.split.updateArea(this, false, true)
  }

  get lockSize(): boolean {
    return this._lockSize
  }

  private _visible = true

  @Input() set visible(v: boolean) {
    this._visible = getInputboolean(v)

    if (this._visible) {
      this.split.showArea(this)
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-hidden')
    } else {
      this.split.hideArea(this)
      this.renderer.addClass(this.elRef.nativeElement, 'dui-hidden')
    }
  }

  get visible(): boolean {
    return this._visible
  }

  private transitionListener: Function
  private readonly lockListeners: Array<Function> = []

  constructor(
    public elRef: ElementRef,
    public renderer: Renderer2,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private split: LayoutComponent,
  ) {
    super(resolver, injector, detectRef);
    this.el = this.elRef.nativeElement;
    this.renderer.addClass(this.elRef.nativeElement, 'dui-split-area')
  }

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
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
  }

  public override ngOnInit(): void {
    this.split.addArea(this)
    this.ngZone.runOutsideAngular(() => {
      this.transitionListener = this.renderer.listen(
        this.elRef.nativeElement,
        'transitionend',
        (event: TransitionEvent) => {
          // Limit only flex-basis transition to trigger the event
          if (event.propertyName === 'flex-basis') {
            this.split.notify('transitionEnd', -1)
          }
        },
      )
    })
  }

  public setStyleOrder(value: number): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'order', value)
  }

  public setStyleFlex(grow: number, shrink: number, basis: string, isMin: boolean, isMax: boolean): void {
    // Need 3 separated properties to work on IE11 (https://github.com/angular/flex-layout/issues/323)
    this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', grow)
    this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', shrink)
    this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', basis)

    if (isMin === true) {
      this.renderer.addClass(this.elRef.nativeElement, 'dui-min')
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-min')
    }

    if (isMax === true) {
      this.renderer.addClass(this.elRef.nativeElement, 'dui-max')
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-max')
    }
  }

  public lockEvents(): void {
    this.ngZone.runOutsideAngular(() => {
      this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'selectstart', () => false))
      this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'dragstart', () => false))
    })
  }

  public unlockEvents(): void {
    while (this.lockListeners.length > 0) {
      const fct = this.lockListeners.pop()
      if (fct) {
        fct()
      }
    }
  }

  public override ngOnDestroy(): void {
    this.unlockEvents()
    if (this.transitionListener) {
      this.transitionListener()
    }
    this.split.removeArea(this)
  }

  public collapse(newSize = 0, gutter: 'left' | 'right' = 'right'): void {
    this.split.collapseArea(this, newSize, gutter)
  }

  public expand(): void {
    this.split.expandArea(this)
  }

  override add(comp): any {
    this.initItems();
    const args = arguments.length > 1;
    if (args || isArray(comp)) {
      const result = [];
      each(args ? arguments : comp,
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
