/* eslint-disable @typescript-eslint/no-unused-vars */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Injector,
    Input,
    OnChanges, OnDestroy,
    QueryList,
    Renderer2,
    SimpleChanges,
    ViewChildren, ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { MatTabChangeEvent, MatTabHeaderPosition } from '@angular/material/tabs';
import {isArray,each}  from 'lodash-es';
import { AbstractPanel } from '../panel/abstract.panel';
import { PanelComponent } from '../panel/panel.component';

@Component({
  selector: 'tabpanel',
  styleUrls: ['./tabpanel.component.scss'],
  templateUrl: './tabpanel.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  host: { 'hostID': crypto.randomUUID().toString()}
})

export class TabPanel extends AbstractPanel implements OnChanges,OnDestroy{

  @Input() override config: any = {};

  public override xtype: string = 'tabpanel';

  public resizeTabs: boolean = false;

  public tabPosition: MatTabHeaderPosition = 'above';

  public activeTab = 0;

  public oldTab = 0;

  public tabs: any[] = [];

  @ViewChildren('tabpanel', { read: ViewContainerRef }) public _tabContainer: QueryList<ViewContainerRef>;

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
      this.init(this.config);
    }
  }


  override init(config: any) {
    this.tabs = config.items;
    this.detectRef.detectChanges();
    delete this.items;
    super.init(config);
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
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
      let tabArray=this._tabContainer.toArray();
      this.items.add(comp);
      tabArray[index].insert(comp.reference.hostView);
      this.trigger('add', { panel: this, component: comp, index: index });
    } else {
      const component = this.lookupComponent(this.applyDefaults(comp));
      const index = this.items.length;
      let tabArray=this._tabContainer.toArray();
      this.items.add(component);
      tabArray[index].insert(component.reference.hostView);
      this.trigger('add', { panel: this, component: comp, index: index });
      return component;
    }
  }

  override onAdd(c) {
    super.onAdd(c);
    this.tabs.push({ title: c.titile, disable: c.disable });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override onBeforeAdd(item) {
    super.onBeforeAdd(arguments);
    return true;
  }
  override onRemove(c) {
    super.onRemove.call(this, c);

    if (c === this.activeTab) {
      // let next = this.stack.next();
      // if (next) {
      //   this.setActiveTab(next);
      // } else {
      //   if (this.items.getCount() > 0) {
      //     this.setActiveTab(0);
      //   } else {
      //     this.setActiveTab(null);
      //   }
      // }
    }
  }

  tabChange(event: MatTabChangeEvent) {
    this.oldTab = this.activeTab;
    this.activeTab = event.index;
    this.trigger("tabChange", event);
  }

  focusChange(event: MatTabChangeEvent) {

  }

  setActiveTab(val: number) {
    this.activeTab = val;
  }
  getActiveTab(): number {
    return this.activeTab;
  }

  getItem(item): PanelComponent {
    return this.getComponent(item);
  }
}
