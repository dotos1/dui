import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core'

import { LayoutComponent } from '../component/layout.component'
import { getInputboolean, getInputPositiveNumber } from '../utils'

@Directive({
  selector: 'dui-split-area, [dui-split-area]',
  exportAs: 'asSplitArea',
})
export class SplitAreaDirective implements OnInit, OnDestroy {
  private _order: number | null = null;

  private _id: string = null;

  @Input() set id(v: string) {
    this._id =v ;
  }
  
  get id(): string {
    return this._id
  }

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
    private ngZone: NgZone,
    public elRef: ElementRef,
    private renderer: Renderer2,
    private split: LayoutComponent,
  ) {
    this.renderer.addClass(this.elRef.nativeElement, 'dui-split-area')
  }

  public ngOnInit(): void {
    this.split.addArea(this)

    this.ngZone.runOutsideAngular(() => {
      this.transitionListener = this.renderer.listen(
        this.elRef.nativeElement,
        'transitionend',
        (event: TransitionEvent) => {
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

  public ngOnDestroy(): void {
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
}
