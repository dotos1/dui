/**
 * @fileoverview Module `src/container/tabpanel/tabpanel.component.ts` providing tabpanel component definitions and implementation.
 * @zh 模块文件 `src/container/tabpanel/tabpanel.component.ts`，提供tabpanel组件相关的定义与实现。
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { DuiConfig } from '@dotos/dui/base';
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
import { AbstractPanel } from '../panel/abstract.panel';
import { ComponentBase } from '@dotos/dui/core';
import { ContainerItem } from '../container.main';

const isRenderedItem = (c: ContainerItem): c is ComponentBase => !!(c as ComponentBase).reference;
import { PanelComponent } from '../panel/panel.component';

/**
 * Angular component `TabPanel` (selector: 'tabpanel') providing tab panel presentation and interaction in `src/container/tabpanel`.
 * @zh Angular 组件 `TabPanel`（selector: 'tabpanel'），提供选项卡面板的视图渲染与交互逻辑（位于 `src/container/tabpanel`）。
 */
@Component({
  selector: 'tabpanel',
  styleUrls: ['./tabpanel.component.scss'],
  templateUrl: './tabpanel.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  host: { hostID: 'dui-tabpanel' + Math.random().toString(36).substring(2, 15) }
})
export class TabPanel extends AbstractPanel implements OnChanges, OnDestroy {

  /**
   * Input property `config` (`DuiConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() override config: DuiConfig = {};

  /**
   * Property `xtype` (`string`) storing xtype (default: `'tabpanel'`).
   * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型（默认值：`'tabpanel'`）。
   */
  public override xtype: string = 'tabpanel';

  /**
   * Property `resizeTabs` (`boolean`) storing resize tabs (default: `false`).
   * @zh 属性 `resizeTabs`（类型：`boolean`），用于存储或配置调整尺寸选项卡组（默认值：`false`）。
   */
  public resizeTabs: boolean = false;

  /**
   * Property `tabPosition` (`MatTabHeaderPosition`) storing tab position (default: `'above'`).
   * @zh 属性 `tabPosition`（类型：`MatTabHeaderPosition`），用于存储或配置选项卡位置（默认值：`'above'`）。
   */
  public tabPosition: MatTabHeaderPosition = 'above';

  /**
   * Property `activeTab` (`number`) storing active tab (default: `0`).
   * @zh 属性 `activeTab`（类型：`number`），用于存储或配置激活选项卡（默认值：`0`）。
   */
  public activeTab: number = 0;

  /**
   * Property `oldTab` (`number`) storing old tab (default: `0`).
   * @zh 属性 `oldTab`（类型：`number`），用于存储或配置旧选项卡（默认值：`0`）。
   */
  public oldTab: number = 0;

  /**
   * Property `tabs` (`any[]`) storing tabs (default: `[]`).
   * @zh 属性 `tabs`（类型：`any[]`），用于存储或配置选项卡组（默认值：`[]`）。
   */
  public tabs = [];

  // 显式声明该变量以防止编译期因 dynamic assign 报错
  /**
   * Property `noload` (`boolean`) storing noload (default: `false`).
   * @zh 属性 `noload`（类型：`boolean`），用于存储或配置noload（默认值：`false`）。
   */
  public noload: boolean = false;

  /**
   * Template/content query reference `_tabContainer` (`QueryList<ViewContainerRef>`) targeting tab container.
   * @zh 模板/内容视图查询引用 `_tabContainer`（`@ViewChildren`），指向选项卡容器。
   */
  @ViewChildren('tabpanel', { read: ViewContainerRef }) public _tabContainer: QueryList<ViewContainerRef>;

  /**
   * Creates an instance of `TabPanel` and initializes its dependencies and internal state.
   * @zh 创建 `TabPanel` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(
    protected override _element: ElementRef,
    protected override renderer: Renderer2,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef) {
    super(_element, renderer, resolver, injector, detectRef);
    this.el = this._element.nativeElement;
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    this.tabs = config.items;
    this.detectRef.detectChanges();
    delete this.items;
    super.init(config);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }


  /**
   * Executes `onAdd` to handle on add.
   * @zh 执行 `onAdd`，用于当添加。
   * @param c - c parameter (`any`) / c参数（`any`）
   */
  /** 标签页：子组件插到对应标签的视图容器里，不走 Container 的 onAdded/onAdd 流程（沿用原行为） */
  protected override addOne(comp: ContainerItem): ComponentBase {
    const component = isRenderedItem(comp) ? comp : this.lookupComponent(this.applyDefaults(comp));
    const index = this.items.length;
    const tabArray = this._tabContainer.toArray();
    this.items.add(component);
    tabArray[index].insert(component.reference.hostView);
    this.trigger('add', { panel: this, component: comp, index: index });
    return component;
  }

  override onAdd(c) {
    super.onAdd(c);
    this.tabs.push({ title: c.title ?? c.titile, disable: c.disable });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onBeforeAdd` to handle on before add.
   * @zh 执行 `onBeforeAdd`，用于当之前添加。
   * @param item - item parameter (`ComponentBase`) / 条目参数（`ComponentBase`）
   */
  override onBeforeAdd(item: ComponentBase): boolean {
    super.onBeforeAdd(item);
    return true;
  }

  /**
   * Executes `onRemove` to handle on remove.
   * @zh 执行 `onRemove`，用于当移除。
   * @param c - c parameter (`any`) / c参数（`any`）
   */
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

  /**
   * Executes `tabChange` to handle tab change.
   * @zh 执行 `tabChange`，用于选项卡变更。
   * @param event - event parameter (`MatTabChangeEvent`) / 事件参数（`MatTabChangeEvent`）
   */
  tabChange(event: MatTabChangeEvent) {
    this.oldTab = this.activeTab;
    this.activeTab = event.index;
    this.trigger("tabChange", event);
  }

  /**
   * Executes `focusChange` to handle focus change.
   * @zh 执行 `focusChange`，用于聚焦变更。
   * @param event - event parameter (`MatTabChangeEvent`) / 事件参数（`MatTabChangeEvent`）
   */
  focusChange(event: MatTabChangeEvent) {}

  /**
   * Executes `setActiveTab` to handle set active tab.
   * @zh 执行 `setActiveTab`，用于集合激活选项卡。
   * @param val - val parameter (`number`) / 值参数（`number`）
   */
  setActiveTab(val: number) {
    this.activeTab = val;
  }

  /**
   * Executes `getActiveTab` to handle get active tab.
   * @zh 执行 `getActiveTab`，用于获取激活选项卡。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getActiveTab(): number {
    return this.activeTab;
  }

  /**
   * Executes `getItem` to handle get item.
   * @zh 执行 `getItem`，用于获取条目。
   * @param item - item parameter (`string | number | ComponentBase`) / 条目参数（`string | number | ComponentBase`）
   * @returns Result of type `PanelComponent` / 类型为 `PanelComponent` 的返回值
   */
  getItem(item: ComponentBase | string | number): PanelComponent {
    return this.getComponent(item) as PanelComponent;
  }


  /**
   * Executes `findTabIndexByObjectId` to handle find tab index by object id.
   * @zh 执行 `findTabIndexByObjectId`，用于查找选项卡索引按对象唯一标识。
   * @param targetObjectId - target object id parameter (`any`) / 目标对象唯一标识参数（`any`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  public findTabIndexByObjectId(targetObjectId): number {
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
  /**
   * Executes `switchTabByObjectId` to handle switch tab by object id.
   * @zh 执行 `switchTabByObjectId`，用于切换开关选项卡按对象唯一标识。
   * @param params - params parameter (`any`) / 参数集合参数（`any`）
   * @param parentTab - parent tab parameter (`any`) / 父级选项卡参数（`any`）
   */
  public switchTabByObjectId(params, parentTab?): void {
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

/**
 * Executes `findTabIndex` to handle find tab index.
 * @zh 执行 `findTabIndex`，用于查找选项卡索引。
 * @param idOrObjectId - id or object id parameter (`any`) / 唯一标识Or对象唯一标识参数（`any`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
public findTabIndex(idOrObjectId): number {
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

  /**
   * Executes `setTabVisibility` to handle set tab visibility.
   * @zh 执行 `setTabVisibility`，用于集合选项卡Visibility。
   * @param idOrObjectId - id or object id parameter (`any`) / 唯一标识Or对象唯一标识参数（`any`）
   * @param visible - visible parameter (`boolean`) / 可见参数（`boolean`）
   */
  public setTabVisibility(idOrObjectId, visible: boolean): void {
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

  /**
   * Executes `findNextVisibleTabIndex` to handle find next visible tab index.
   * @zh 执行 `findNextVisibleTabIndex`，用于查找下一个可见选项卡索引。
   * @param currentIndex - current index parameter (`number`) / 当前索引参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
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

  /**
   * Executes `hideTab` to handle hide tab.
   * @zh 执行 `hideTab`，用于隐藏选项卡。
   * @param idOrObjectId - id or object id parameter (`any`) / 唯一标识Or对象唯一标识参数（`any`）
   */
  public hideTab(idOrObjectId): void {
    this.setTabVisibility(idOrObjectId, false);
  }

  /**
   * Executes `showTab` to handle show tab.
   * @zh 执行 `showTab`，用于显示选项卡。
   * @param idOrObjectId - id or object id parameter (`any`) / 唯一标识Or对象唯一标识参数（`any`）
   */
  public showTab(idOrObjectId): void {
    this.setTabVisibility(idOrObjectId, true);
  }
  
  /**
   * Executes `hideTabAll` to handle hide tab all.
   * @zh 执行 `hideTabAll`，用于隐藏选项卡全部。
   */
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


  /**
   * Executes `showTabAll` to handle show tab all.
   * @zh 执行 `showTabAll`，用于显示选项卡全部。
   */
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