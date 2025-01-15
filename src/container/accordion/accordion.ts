
import { Component, SimpleChanges, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, ChangeDetectorRef, ElementRef, Renderer2, OnChanges } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Dui } from '@dotos/dui/core';
import { AbstractPanel } from '../panel/abstract.panel';


/** Accordion's display modes. */
export type AccordionDisplayMode = 'default' | 'flat';

/** Used to generate unique ID for each accordion. */
let nextId = 0;
/**
 * Directive for a Exterial Design Accordion.
 */
@Component({
  selector: 'accordion',
  inputs: ['multi', 'displayMode', 'hideToggle'],
  styleUrls: ['./accordion.scss'],
  templateUrl: './accordion.html',
  exportAs: 'duiAccordion',
  host: {
    class: 'accordion',
    
  }
})
export class Accordion extends AbstractPanel implements OnChanges{

  /** A readonly id value to use for unique selection coordination. */
  override readonly id = `cdk-accordion-${nextId++}`;

  /** Whether the accordion should allow multiple expanded accordion items simulateously. */
  @Input() get multi(): boolean { return this._multi; }
  set multi(multi: boolean) { this._multi = coerceBooleanProperty(multi); }
  private _multi: boolean = false;

  /** Whether the expansion indicator should be hidden. */
  @Input() get hideToggle(): boolean { return this._hideToggle; }
  set hideToggle(show: boolean) { this._hideToggle = coerceBooleanProperty(show); }
  private _hideToggle: boolean = false;


  @Input() displayMode: AccordionDisplayMode = 'default';

  @Input() override config: any = {};

  public override xtype: string = 'accordion';

//@ts-ignore
  @ViewChild('expansiongroup', { read: ViewContainerRef }) public override viewContainer: ViewContainerRef;

  public override _fxLayout: 'row' | 'column' = 'column';

  @Input() override set fxLayout(v: 'row' | 'column') {
    v = (v === 'row') ? 'row' : 'column';
    this._fxLayout = v;
  }

  override get fxLayout(): 'row' | 'column' {
    return this._fxLayout;
  }

  constructor(
    protected override _element: ElementRef,
    protected override renderer: Renderer2,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef) {
    super(_element, renderer, resolver, injector, detectRef);
  }

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  // private
  override init(config: any) {
    config = config || {};

    this.initFieldExpression(config);
    Dui.apply(this, config);

    if (this.viewContainer) {
      this.viewContainer.clear();
    }
    let items = this.items;
    if (items) {
      delete this.items;
      this.add(items);
    }
  }
}
