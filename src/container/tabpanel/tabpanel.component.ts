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
    // 保持您的原始属性拼写 (c.titile)
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

  /**
   * ==========================================
   * 新增辅助方法 1：基于 objectId 查询对应的数字 Index
   * ==========================================
   * @param targetObjectId 要查找的唯一标识
   * @returns 匹配的 Tab 索引，若找不到则返回 -1
   */
  public findTabIndexByObjectId(targetObjectId: any): number {
    if (targetObjectId === undefined || targetObjectId === null) {
      return -1;
    }

    // 1. 优先尝试直接在 tabs 数组配置数据中查找
    if (Array.isArray(this.tabs)) {
      const tabIndex = this.tabs.findIndex(tab => tab && tab.objectId === targetObjectId);
      if (tabIndex > -1) {
        return tabIndex;
      }
    }

    // 2. 尝试在渲染出来的组件实例中查找 (调用 Container 基类中的 find 方法)
    const matchedComponents = this.find("objectId", targetObjectId);
    if (matchedComponents && matchedComponents.length > 0) {
      const component = matchedComponents[0];

      if (this.items) {
        // 2.1 若是直属子组件，直接获取其在 MixedCollection 中的索引
        let directIndex = -1;
        if (typeof this.items.indexOf === 'function') {
          directIndex = this.items.indexOf(component);
        } else if (Array.isArray(this.items.items)) {
          directIndex = this.items.items.indexOf(component);
        }

        if (directIndex > -1) {
          return directIndex;
        }

        // 2.2 兜底：若匹配组件存在于更深层次的容器中，溯源至当前 TabPanel 的直属子组件
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

  /**
   * ==========================================
   * 新增辅助方法 2：根据 objectId 执行安全的页签切换逻辑
   * ==========================================
   * @param params 带有新标签 objectId 的参数对象
   * @param parentTab 当前父页签对象
   */
  public switchTabByObjectId(params: any, parentTab?: any): void {
    if (!params || !params.objectId) {
      return;
    }

    // 判断条件：若存在父级页签，且当前的 objectId 与父页签不一致时触发
    if (parentTab && params.objectId !== parentTab.objectId) {
      const targetIndex = this.findTabIndexByObjectId(params.objectId);

      if (targetIndex > -1) {
        this.noload = true;
        this.setActiveTab(targetIndex); // 安全传递转换后的数字索引 (number)
      } else {
        console.warn(`[TabPanel] 未能在页签列表中匹配到 objectId：${params.objectId}`);
      }
    }
  }
}