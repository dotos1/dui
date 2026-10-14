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
import { isArray, each } from 'lodash-es';
import { AbstractPanel } from '../panel/abstract.panel';
import { PanelComponent } from '../panel/panel.component';

@Component({
  selector: 'tabpanel',
  styleUrls: ['./tabpanel.component.scss'],
  templateUrl: './tabpanel.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  host: { hostID: 'dui-tabpanel' + Math.random().toString(36).substring(2, 15) }
})
export class TabPanel extends AbstractPanel implements OnChanges, OnDestroy {

  @Input() override config: any = {};

  public override xtype: string = 'tabpanel';

  public resizeTabs: boolean = false;

  public tabPosition: MatTabHeaderPosition = 'above';

  public activeTab: number = 0;

  public oldTab: number = 0;

  public tabs: any[] = [];

  // 显式声明该变量以防止编译期因 dynamic assign 报错
  public noload: boolean = false;

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
      let tabArray = this._tabContainer.toArray();
      this.items.add(comp);
      tabArray[index].insert(comp.reference.hostView);
      this.trigger('add', { panel: this, component: comp, index: index });
    } else {
      const component = this.lookupComponent(this.applyDefaults(comp));
      const index = this.items.length;
      let tabArray = this._tabContainer.toArray();
      this.items.add(component);
      tabArray[index].insert(component.reference.hostView);
      this.trigger('add', { panel: this, component: comp, index: index });
      return component;
    }
  }

  override onAdd(c) {
    super.onAdd(c);
    this.tabs.push({ title: c.title ?? c.titile, disable: c.disable });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override onBeforeAdd(item) {
    super.onBeforeAdd(arguments);
    return true;
  }

  override onRemove(c) {
    super.onRemove.call(this, c);

    if (c === this.activeTab) {
      // 保持原始的移除注释逻辑，可按需恢复
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

  focusChange(event: MatTabChangeEvent) {}

  setActiveTab(val: number) {
    this.activeTab = val;
  }

  getActiveTab(): number {
    return this.activeTab;
  }

  getItem(item): PanelComponent {
    return this.getComponent(item);
  }


  public findTabIndexByObjectId(targetObjectId: any): number {
    if (targetObjectId === undefined || targetObjectId === null) {
      return -1;
    }

    if (Array.isArray(this.tabs)) {
      const tabIndex = this.tabs.findIndex(tab => tab && tab.objectId === targetObjectId);
      if (tabIndex > -1) {
        return tabIndex;
      }
    }
    const matchedComponents = this.find("objectId", targetObjectId);
    if (matchedComponents && matchedComponents.length > 0) {
      const component = matchedComponents[0];

      if (this.items) {
        let directIndex = -1;
        if (typeof this.items.indexOf === 'function') {
          directIndex = this.items.indexOf(component);
        } else if (Array.isArray(this.items.items)) {
          directIndex = this.items.items.indexOf(component);
        }

        if (directIndex > -1) {
          return directIndex;
        }
        let parent = component.ownerCt;
        let currentComp = component;
        while (parent && parent !== this) {
          currentComp = parent;
          parent = parent.ownerCt;
        }
        if (parent === this) {
          if (typeof this.items.indexOf === 'function') {
            return this.items.indexOf(currentComp);
          } else if (Array.isArray(this.items.items)) {
            return this.items.items.indexOf(currentComp);
          }
        }
      }
    }
    return -1;
  }
  public switchTabByObjectId(params: any, parentTab?: any): void {
    if (!params || !params.objectId) {
      return;
    }

    if (parentTab && params.objectId !== parentTab.objectId) {
      const targetIndex = this.findTabIndexByObjectId(params.objectId);

      if (targetIndex > -1) {
        this.noload = true;
        this.setActiveTab(targetIndex); 
      } else {
        console.warn(`[TabPanel] 未能在页签列表中匹配到 objectId：${params.objectId}`);
      }
    }
  }

public findTabIndex(idOrObjectId: any): number {
    if (idOrObjectId === undefined || idOrObjectId === null) {
      return -1;
    }
    if (Array.isArray(this.tabs)) {
      const index = this.tabs.findIndex(tab => 
        tab && (tab.id === idOrObjectId || tab.objectId === idOrObjectId)
      );
      if (index > -1) {
        return index;
      }
    }
    const matchedByObjectId = this.findTabIndexByObjectId(idOrObjectId);
    if (matchedByObjectId > -1) {
      return matchedByObjectId;
    }
    const matchedComponents = this.find("id", idOrObjectId);
    if (matchedComponents && matchedComponents.length > 0) {
      const component = matchedComponents[0];
      if (this.items) {
        let directIndex = -1;
        if (typeof this.items.indexOf === 'function') {
          directIndex = this.items.indexOf(component);
        } else if (Array.isArray(this.items.items)) {
          directIndex = this.items.items.indexOf(component);
        }
        if (directIndex > -1) return directIndex;

        let parent = component.ownerCt;
        let currentComp = component;
        while (parent && parent !== this) {
          currentComp = parent;
          parent = parent.ownerCt;
        }
        if (parent === this) {
          if (typeof this.items.indexOf === 'function') {
            return this.items.indexOf(currentComp);
          } else if (Array.isArray(this.items.items)) {
            return this.items.items.indexOf(currentComp);
          }
        }
      }
    }
    return -1;
  }

  public setTabVisibility(idOrObjectId: any, visible: boolean): void {
    const tabIndex = this.findTabIndex(idOrObjectId);
    if (tabIndex === -1) {
      console.warn(`[TabPanel] 找不到指定的 id 或 objectId: ${idOrObjectId}`);
      return;
    }
    const tab = this.tabs[tabIndex];
    const isHidden = !visible;
    if (tab.hidden === isHidden) {
      return; 
    }
    tab.hidden = isHidden;
    if(visible){
      this.setActiveTab(tabIndex);
    }else{
      if (this.activeTab === tabIndex) {
        const nextActiveIndex = this.findNextVisibleTabIndex(tabIndex);
        if (nextActiveIndex > -1) {
          this.setActiveTab(nextActiveIndex);
        }
      }
    }
    this.detectRef.detectChanges();
  }

  private findNextVisibleTabIndex(currentIndex: number): number {
    if (!Array.isArray(this.tabs)) {
      return -1;
    }
    for (let i = currentIndex + 1; i < this.tabs.length; i++) {
      if (!this.tabs[i].hidden) return i;
    }
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!this.tabs[i].hidden) return i;
    }
    return -1;
  }

  public hideTab(idOrObjectId: any): void {
    this.setTabVisibility(idOrObjectId, false);
  }

  public showTab(idOrObjectId: any): void {
    this.setTabVisibility(idOrObjectId, true);
  }
  
  public hideTabAll(): void {
    if (!Array.isArray(this.tabs)) {
      return;
    }
    this.tabs.forEach(tab => {
      if (tab) {
        tab.hidden = true;
      }
    });
    this.setActiveTab(-1);
    this.detectRef.detectChanges();
  }


  public showTabAll(): void {
    if (!Array.isArray(this.tabs)) {
      return;
    }
    this.tabs.forEach(tab => {
      if (tab) {
        tab.hidden = false;
      }
    });
    if (this.activeTab === -1 && this.tabs.length > 0) {
      this.setActiveTab(0);
    }
    this.detectRef.detectChanges();
  }
}