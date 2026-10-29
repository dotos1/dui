/**
 * @fileoverview Module `src/container/container.main.ts` providing container main definitions and implementation.
 * @zh 模块文件 `src/container/container.main.ts`，提供容器主相关的定义与实现。
 */

import { ChangeDetectorRef, ComponentFactoryResolver, Injector, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentBase, Dui, DuiConfig } from '@dotos/dui/core';
import { MixedCollection } from '@dotos/dui/core/cache';
import {isArray,each,isFunction,isObjectLike,isUndefined} from 'lodash-es';

/** 容器子项：配置对象，或已创建的组件实例 */
export type ContainerItem = DuiConfig | ComponentBase;

/** 已渲染（带 ComponentRef）的组件实例 */
function isRendered(c: ContainerItem): c is ComponentBase {
  return !!(c as ComponentBase).reference;
}

/** 按属性名读组件上的任意字段（find 用） */
function readProp(o: object, prop: string): unknown {
  return (o as Record<string, unknown>)[prop];
}

/**
 *
 用于承载其它任何组件，容器负责一些基础性的行为，也就是装载子项、添加、插入和移除子项。
 根据容纳子项的不同，所产生的可视效果，需委托任意布局类layout中的一种来指点特定的布局逻辑（layout logic）。
 此类被于继承而且一般情况下不应通过关键字new来直接实例化。
 * xtype container

 * @zh 用于承载其它任何组件，容器负责一些基础性的行为，也就是装载子项、添加、插入和移除子项。
 */

export class Container extends ComponentBase {


  /**
   * Property `layout` (`string | DuiConfig`) storing layout.
   * @zh 属性 `layout`（类型：`string | DuiConfig`），用于存储或配置布局。
   */
  public layout: string | DuiConfig;

  /**
   *一个单独项，或子组件组成的数组，加入到此容器中。每一项的对象类型是基于dui.
   Component可传入一个组件的配置对象即是lazy-rendering的做法，
   这样做的好处是组件不会立即渲染，减低直接构建组件对象带来的开销。
   要发挥"lazy instantiation延时初始化"的特性，应对组件所属的登记类型的dui.Componentxtype属性进行配置。

   * @zh 一个单独项，或子组件组成的数组，加入到此容器中。每一项的对象类型是基于dui.
   */
  public items: MixedCollection<ComponentBase>;

  /** cfg {boolean} autoDestroy
   * 若为true容器会自动销毁容器下面全部的组件，否则的话必须手动执行销毁过程（默认为true）。

   * @zh cfg {boolean} autoDestroy
   */

  public autoDestroy: boolean = true;

  /**
   * Property `defaults` (`DuiConfig | ((this: Container, item: ContainerItem) => DuiConfig)`) storing defaults.
   * @zh 属性 `defaults`（类型：`DuiConfig | ((this: Container, item: ContainerItem) => DuiConfig)`），用于存储或配置默认值集合。
   */
  /** 子项缺省配置：对象，或按子项返回配置的函数 */
  public defaults: DuiConfig | ((this: Container, item: ContainerItem) => DuiConfig);

  /**
   * Property `viewContainer` (`ViewContainerRef`) storing view container.
   * @zh 属性 `viewContainer`（类型：`ViewContainerRef`），用于存储或配置视图容器。
   */
  public viewContainer: ViewContainerRef;

  /**
   * Property `form` (`FormGroup<any>`) storing form.
   * @zh 属性 `form`（类型：`FormGroup<any>`），用于存储或配置表单。
   */
  public form: FormGroup;

  /**
   * Creates an instance of `Container` and initializes its dependencies and internal state.
   * @zh 创建 `Container` 实例，并初始化其依赖项与内部状态。
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(
    public resolver: ComponentFactoryResolver,
    public injector: Injector,
    public override detectRef: ChangeDetectorRef) {
    super(detectRef);
    //  this.el = _elementRef.nativeElement;
  }

  // private
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`DuiConfig`) / 配置参数（`DuiConfig`）
   */
  override init(config?: DuiConfig): void {
    super.init(config);
  }

  /**
   * 取出 init 时由配置对象（Dui.apply）拷到 `this.items` 上的子项配置——此时它还是配置数组，
   * 不是 MixedCollection——清掉该字段，再逐个创建并添加。
   */
  protected addConfiguredItems(): void {
    const raw: unknown = this.items;
    if (!raw) {
      return;
    }
    delete this.items;
    if (raw instanceof MixedCollection) {
      return;
    }
    this.add(raw as ContainerItem | ContainerItem[]);
  }

  // private
  /**
   * Executes `initItems` to handle init items.
   * @zh 执行 `initItems`，用于初始化条目列表。
   */
  public initItems(): void {
    if (!this.items) {
      this.items = new MixedCollection<ComponentBase>(false, this.getComponentId);
      this.getLayout();
    }
  }

  // private - used as the key lookup function for the items collection
  /**
   * Executes `getComponentId` to handle get component id.
   * @zh 执行 `getComponentId`，用于获取组件唯一标识。
   * @param comp - comp parameter (`ComponentBase`) / 组件参数（`ComponentBase`）
   */
  getComponentId(comp: ComponentBase): string {
    return comp.id;
  }


  /**
   * Executes `add` to handle add.
   * @zh 执行 `add`，用于添加。
   * @param comp - comp parameter (`ContainerItem`) / 组件参数（`ContainerItem`）
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  add(comp: ContainerItem): ComponentBase;
  add(comps: ContainerItem[]): ComponentBase[];
  add(first: ContainerItem, ...more: ContainerItem[]): ComponentBase[];
  add(comp: ContainerItem | ContainerItem[]): ComponentBase | ComponentBase[];
  add(comp: ContainerItem | ContainerItem[], ...more: ContainerItem[]): ComponentBase | ComponentBase[] {
    this.initItems();
    if (more.length > 0 || isArray(comp)) {
      const list: ContainerItem[] = more.length > 0 ? [comp as ContainerItem, ...more] : (comp as ContainerItem[]);
      const result: ComponentBase[] = [];
      each(list, (c: ContainerItem) => {
        result.push(this.addOne(c));
      });
      return result;
    }
    return this.addOne(comp as ContainerItem);
  }

  /**
   * 添加单个子项：已创建的组件实例直接挂上；配置对象先套 defaults 再创建。
   * 子类改变挂载方式时覆写 `_addItem`，改变整个单项流程时覆写本方法。
   */
  protected addOne(comp: ContainerItem): ComponentBase {
    if (isRendered(comp)) {
      this._addItem(comp, this.items.length);
      // 原来这条路径没有返回值，Toolbar.addSeparator / addSpacer / addText / addItem 等
      // 声明返回组件、实际拿到 undefined；现在返回加进来的实例
      return comp;
    }
    const component = this.lookupComponent(this.applyDefaults(comp));
    if (!component) {
      // 复核 F11：配置里 xtype 写错或缺失时 Dui.create 返回空，原来静默返回 null，这里给出告警
      console.warn('[dui] Container.add：子项没有创建出组件（xtype 缺失或未注册），已跳过', comp);
      return null;
    }
    this._addItem(component, this.items.length);
    return component;
  }

  /** 把已创建的子组件登记进 items 并插入视图 */
  protected _addItem(comp: ComponentBase, index: number): void {
    this.items.add(comp);
    if (comp.onAdded) {
      comp.onAdded(this, index);
    }
    this.viewContainer.insert(comp.reference.hostView, index);
    this.onAdd(comp);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onAdd` to handle on add.
   * @zh 执行 `onAdd`，用于当添加。
   * @param c - c parameter (`ComponentBase`) / c参数（`ComponentBase`）
   */
  onAdd(c: ComponentBase): void {
  }


  // private
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onAdded` to handle on added.
   * @zh 执行 `onAdded`，用于当已添加。
   * @param container - container parameter (`ComponentBase`) / 容器参数（`ComponentBase`）
   * @param pos - pos parameter (`number`) / 位置参数（`number`）
   */
  override onAdded(container: ComponentBase, pos?: number): void {
    this.ownerCt = container;
  }

  /**
   * 把插件(Component)插入到容器指定的位置（按索引）。执行插入之前触发beforeadd事件，插入完毕触发add事件
   *  组件插入到容器collection集合的索引
   *  欲加入的组件

   * @zh 把插件(Component)插入到容器指定的位置（按索引）。执行插入之前触发beforeadd事件，插入完毕触发add事件
   */
  insert(index: number, comp: ContainerItem): ComponentBase;
  insert(index: number, first: ContainerItem, ...more: ContainerItem[]): ComponentBase[];
  insert(index: number, comp: ContainerItem, ...more: ContainerItem[]): ComponentBase | ComponentBase[] {
    this.initItems();
    if (more.length > 0) {
      const list = [comp, ...more];
      const result: ComponentBase[] = [];
      for (let i = list.length - 1; i >= 0; --i) {
        result.push(this.insert(index, list[i]));
      }
      return result;
    }
    const c = this.lookupComponent(this.applyDefaults(comp));
    if (!c) {
      // 复核 F11：与 add 一致，没创建出组件时告警并跳过（原来会在 c.ownerCt 处抛 TypeError）
      console.warn('[dui] Container.insert：子项没有创建出组件（xtype 缺失或未注册），已跳过', comp);
      return null;
    }
    index = Math.min(index, this.items.length);
    if (c.ownerCt === this) {
      this.items.remove(c);
    }
    this.items.insert(index, c);
    c.onAdded(this, index);
    this.onAdd(c);
    return c;
  }

  // private
  /**
   * Executes `applyDefaults` to handle apply defaults.
   * @zh 执行 `applyDefaults`，用于应用默认值集合。
   * @param c - c parameter (`C`) / c参数（`C`）
   */
  applyDefaults<C extends ContainerItem>(c: C): C {
    const defaults = this.defaults;
    if (defaults) {
      const d = typeof defaults === 'function' ? defaults.call(this, c) : defaults;
      Dui.apply(c, d);
    }
    return c;
  }

  // private
  /**
   * Executes `onBeforeAdd` to handle on before add.
   * @zh 执行 `onBeforeAdd`，用于当之前添加。
   * @param item - item parameter (`ComponentBase`) / 条目参数（`ComponentBase`）
   */
  onBeforeAdd(item: ComponentBase): boolean {
    if (item.ownerCt) {
      item.ownerCt.remove(item, false);
    }
    return true;
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param comp - comp parameter (`string | number | ComponentBase`) / 组件参数（`string | number | ComponentBase`）
   * @param autoDestroy - auto destroy parameter (`boolean`) / 自动销毁参数（`boolean`）
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  remove(comp: ComponentBase | string | number, autoDestroy?: boolean): ComponentBase {
    const c = this.getComponent(comp);
    this.doRemove(c, autoDestroy);
    return c;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onRemove` to handle on remove.
   * @zh 执行 `onRemove`，用于当移除。
   * @param c - c parameter (`ComponentBase`) / c参数（`ComponentBase`）
   */
  public onRemove(c?: ComponentBase): void { }

  /**
   * Executes `doRemove` to handle do remove.
   * @zh 执行 `doRemove`，用于执行移除。
   * @param c - c parameter (`ComponentBase`) / c参数（`ComponentBase`）
   * @param autoDestroy - auto destroy parameter (`boolean`) / 自动销毁参数（`boolean`）
   */
  doRemove(c: ComponentBase, autoDestroy?: boolean): void {
    this.items.remove(c);
    this.onRemove(c);
    if (autoDestroy === true || autoDestroy !== false && this.autoDestroy) {
      c.destroy();
    }
  }

  /**
   * Executes `removeAll` to handle remove all.
   * @zh 执行 `removeAll`，用于移除全部。
   * @param autoDestroy - auto destroy parameter (`boolean`) / 自动销毁参数（`boolean`）
   * @returns Result of type `ComponentBase[]` / 类型为 `ComponentBase[]` 的返回值
   */
  removeAll(autoDestroy?: boolean): ComponentBase[] {
    this.initItems();
    const rem: ComponentBase[] = [], items: ComponentBase[] = [];
    this.items.each((i) => {
      rem.push(i);
    });
    for (let i = 0, len = rem.length; i < len; ++i) {
      const item = rem[i];
      this.remove(item, autoDestroy);
      if (item.ownerCt !== this) {
        items.push(item);
      }
    }
    return items;
  }


  /**
   * Executes `getComponent` to handle get component.
   * @zh 执行 `getComponent`，用于获取组件。
   * @param comp - comp parameter (`string | number | ComponentBase`) / 组件参数（`string | number | ComponentBase`）
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  getComponent(comp: ComponentBase | string | number): ComponentBase | undefined {
    const key = isObjectLike(comp) ? (comp as ComponentBase).id : (comp as string | number);
    if (this.items) {
      return this.items.get(key);
    } else {
      return undefined;
    }
  }

  // private
  /**
   * Executes `lookupComponent` to handle lookup component.
   * @zh 执行 `lookupComponent`，用于查找表组件。
   * @param comp - comp parameter (`ContainerItem`) / 组件参数（`ContainerItem`）
   */
  lookupComponent(comp: ContainerItem): ComponentBase {
    // 已创建的组件实例（ExtJS 里带 events）直接用；配置对象则创建
    if (!(comp as { events?: unknown }).events) {
      return this.createComponent(comp as DuiConfig);
    }
    return comp as ComponentBase;
  }

  // private
  /**
   * Executes `createComponent` to handle create component.
   * @zh 执行 `createComponent`，用于创建组件。
   * @param config - config parameter (`DuiConfig | ComponentBase`) / 配置参数（`DuiConfig | ComponentBase`）
   */
  createComponent(config: DuiConfig | ComponentBase): ComponentBase {
    if (isRendered(config) || (config as DuiConfig).render) {
      return config as ComponentBase;
    }
    if (config.isField) {
      if (isUndefined(this.form)) {
        this.form = new FormGroup({});
      }
    }
    const component = Dui.create(Dui.apply({ ownerCt: this }, config), this);
    if (component) {
      delete component.ownerCt;
    }
    return component;
  }

  /**
   * Executes `getLayout` to handle get layout.
   * @zh 执行 `getLayout`，用于获取布局。
   * @returns Result of type `string | DuiConfig` / 类型为 `string | DuiConfig` 的返回值
   */
  getLayout(): string | DuiConfig {
    return this.layout;
  }

  // private
  /**
   * Executes `beforeDestroy` to handle before destroy.
   * @zh 执行 `beforeDestroy`，用于之前销毁。
   */
  override beforeDestroy(): void {
    let c: ComponentBase;
    if (this.items) {
      // eslint-disable-next-line no-cond-assign
      while (c = this.items.first()) {
        this.doRemove(c, true);
      }
    }
    Dui.destroy(this.layout);
    super.beforeDestroy();
  }

  /**
   * Executes `cascade` to handle cascade.
   * @zh 执行 `cascade`，用于cascade。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   * @param scope - scope parameter (`Object`) / scope参数（`Object`）
   * @param args - args parameter (`unknown[]`) / 参数列表参数（`unknown[]`）
   * @returns Result of type `Container` / 类型为 `Container` 的返回值
   */
  cascade(fn: Function, scope?: Object, args?: unknown[]): Container {
    if (fn.apply(scope || this, args || [this]) !== false) {
      if (this.items && this.items.items) {
        const cs = this.items.items;
        for (let i = 0, len = cs.length; i < len; i++) {
          const child = cs[i] as ComponentBase & { cascade?: Container['cascade'] };
          if (child.cascade) {
            child.cascade(fn, scope, args);
          } else {
            fn.apply(scope || cs[i], args || [cs[i]]);
          }
        }
      }
    }
    return this;
  }

  /**
   * Executes `findById` to handle find by id.
   * @zh 执行 `findById`，用于查找按唯一标识。
   * @param id - id parameter (`string`) / 唯一标识参数（`string`）
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  findById(id: string): ComponentBase | null {
    let m: ComponentBase = null;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ct = this;
    this.cascade(
      (c: ComponentBase) => {
        if (ct !== c && c.id === id) {
          m = c;
          return false;
        }else{
          return true;
        }
      });
    return m;
  }

  /**
   * Executes `findByType` to handle find by type.
   * @zh 执行 `findByType`，用于查找按类型。
   * @param xtype - xtype parameter (`string | Object`) / 扩展类型参数（`string | Object`）
   * @param shallow - shallow parameter (`boolean`) / shallow参数（`boolean`）
   * @returns Result of type `ComponentBase[]` / 类型为 `ComponentBase[]` 的返回值
   */
  findByType(xtype: string | Object, shallow: boolean): ComponentBase[] {
    return this.findBy(
      (c: ComponentBase) => {
        return c.isXType(xtype, shallow);
      });
  }

  /**
   * Executes `find` to handle find.
   * @zh 执行 `find`，用于查找。
   * @param prop - prop parameter (`string`) / 属性参数（`string`）
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @returns Result of type `ComponentBase[]` / 类型为 `ComponentBase[]` 的返回值
   */
  find(prop: string, value: string): ComponentBase[] {
    return this.findBy(
      (c: ComponentBase) => {
        return readProp(c, prop) === value;
      });
  }

  /**
   * Executes `findBy` to handle find by.
   * @zh 执行 `findBy`，用于查找按。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   * @param scope - scope parameter (`object`) / scope参数（`object`）
   * @returns Result of type `ComponentBase[]` / 类型为 `ComponentBase[]` 的返回值
   */
  findBy(fn: Function, scope?: object): ComponentBase[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const m: ComponentBase[] = [], ct = this;
    this.cascade(
      (c: ComponentBase) => {
        if (ct !== c && fn.call(scope || c, c, ct) === true) {
          m.push(c);
        }
      });
    return m;
  }

  /**
   * Executes `get` to handle get.
   * @zh 执行 `get`，用于获取。
   * @param key - key parameter (`string | number`) / 键参数（`string | number`）
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  get(key: string | number): ComponentBase {
    return this.getComponent(key);
  }
}
