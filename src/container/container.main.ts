/**
 * @fileoverview Module `src/container/container.main.ts` providing container main definitions and implementation.
 * @zh 模块文件 `src/container/container.main.ts`，提供容器主相关的定义与实现。
 */

import { ChangeDetectorRef, ComponentFactoryResolver, Injector, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentBase, Dui } from '@dotos/dui/core';
import { MixedCollection } from '@dotos/dui/core/cache';
import { FormExt } from '@dotos/dui/core/form';
import {isArray,each,isFunction,isObjectLike,isUndefined} from 'lodash-es';

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
   * Property `layout` (`any`) storing layout.
   * @zh 属性 `layout`（类型：`any`），用于存储或配置布局。
   */
  public layout;

  /**
   *一个单独项，或子组件组成的数组，加入到此容器中。每一项的对象类型是基于dui.
   Component可传入一个组件的配置对象即是lazy-rendering的做法，
   这样做的好处是组件不会立即渲染，减低直接构建组件对象带来的开销。
   要发挥"lazy instantiation延时初始化"的特性，应对组件所属的登记类型的dui.Componentxtype属性进行配置。

   * @zh 一个单独项，或子组件组成的数组，加入到此容器中。每一项的对象类型是基于dui.
   */
  public items;

  /** cfg {boolean} autoDestroy
   * 若为true容器会自动销毁容器下面全部的组件，否则的话必须手动执行销毁过程（默认为true）。

   * @zh cfg {boolean} autoDestroy
   */

  public autoDestroy: boolean = true;

  /**
   * Property `defaults` (`any`) storing defaults.
   * @zh 属性 `defaults`（类型：`any`），用于存储或配置默认值集合。
   */
  public defaults;

  /**
   * Property `viewContainer` (`ViewContainerRef`) storing view container.
   * @zh 属性 `viewContainer`（类型：`ViewContainerRef`），用于存储或配置视图容器。
   */
  public viewContainer: ViewContainerRef;

  /**
   * Property `form` (`FormGroup`) storing form.
   * @zh 属性 `form`（类型：`FormGroup`），用于存储或配置表单。
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
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
  }

  // private
  /**
   * Executes `initItems` to handle init items.
   * @zh 执行 `initItems`，用于初始化条目列表。
   */
  public initItems() {
    if (!this.items) {
      this.items = new MixedCollection(false, this.getComponentId);
      this.getLayout();
    }
  }

  // private - used as the key lookup function for the items collection
  /**
   * Executes `getComponentId` to handle get component id.
   * @zh 执行 `getComponentId`，用于获取组件唯一标识。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   */
  getComponentId(comp) {
    return comp.id;
  }


  /**
   * Executes `add` to handle add.
   * @zh 执行 `add`，用于添加。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  add(comp) {
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
      this.items.add(comp);
      if (comp.onAdded) {
        comp.onAdded(this, index);
      }
      this.viewContainer.insert(comp.reference.hostView, index);
      this.onAdd(comp);
    } else {
      const component = this.lookupComponent(this.applyDefaults(comp));
      if (!component) {
        return null;
      }
      const index = this.items.length;
      this.items.add(component);
      if (component.onAdded) {
        component.onAdded(this, index);
      }
      this.viewContainer.insert(component.reference.hostView, index);
      this.onAdd(component);
      return component;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onAdd` to handle on add.
   * @zh 执行 `onAdd`，用于当添加。
   * @param c - c parameter (`any`) / c参数（`any`）
   */
  onAdd(c) {
  }


  // private
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onAdded` to handle on added.
   * @zh 执行 `onAdded`，用于当已添加。
   * @param container - container parameter (`any`) / 容器参数（`any`）
   * @param pos - pos parameter (`any`) / 位置参数（`any`）
   */
  override onAdded(container, pos) {
    this.ownerCt = container;
  }

  /**
   * 把插件(Component)插入到容器指定的位置（按索引）。执行插入之前触发beforeadd事件，插入完毕触发add事件
   *  组件插入到容器collection集合的索引
   *  欲加入的组件

   * @zh 把插件(Component)插入到容器指定的位置（按索引）。执行插入之前触发beforeadd事件，插入完毕触发add事件
   */
  insert(index: number, comp) {
    const args = arguments, length = args.length, result = [];
    let i, c;
    this.initItems();
    if (length > 2) {
      for (i = length - 1; i >= 1; --i) {
        result.push(this.insert(index, args[i]));
      }
      return result;
    }
    c = this.lookupComponent(this.applyDefaults(comp));
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
   * @param c - c parameter (`any`) / c参数（`any`）
   */
  applyDefaults(c) {
    let d = this.defaults;
    if (d) {
      if (isFunction(d)) {
        d = d.call(this, c);
      }
      Dui.apply(c, d);
    }
    return c;
  }

  // private
  /**
   * Executes `onBeforeAdd` to handle on before add.
   * @zh 执行 `onBeforeAdd`，用于当之前添加。
   * @param item - item parameter (`any`) / 条目参数（`any`）
   */
  onBeforeAdd(item) {
    if (item.ownerCt) {
      item.ownerCt.remove(item, false);
    }
    return true;
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @param autoDestroy - auto destroy parameter (`boolean`) / 自动销毁参数（`boolean`）
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  remove(comp, autoDestroy: boolean): ComponentBase {
    const c = this.getComponent(comp);
    this.doRemove(c, autoDestroy);
    return c;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onRemove` to handle on remove.
   * @zh 执行 `onRemove`，用于当移除。
   * @param c - c parameter (`any`) / c参数（`any`）
   */
  public onRemove(c?) { }

  /**
   * Executes `doRemove` to handle do remove.
   * @zh 执行 `doRemove`，用于do移除。
   * @param c - c parameter (`any`) / c参数（`any`）
   * @param autoDestroy - auto destroy parameter (`any`) / 自动销毁参数（`any`）
   */
  doRemove(c, autoDestroy) {
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
   * @returns Result of type `Array<any>` / 类型为 `Array<any>` 的返回值
   */
  removeAll(autoDestroy: boolean) {
    this.initItems();
    let item;
    const rem = [], items = [];
    this.items.each((i) => {
      rem.push(i);
    });
    for (let i = 0, len = rem.length; i < len; ++i) {
      item = rem[i];
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
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  getComponent(comp) {
    if (isObjectLike(comp)) {
      comp = comp['id'];
    }
    if (this.items) {
      return this.items.get(comp);
    } else {
      return undefined;
    }
  }

  // private
  /**
   * Executes `lookupComponent` to handle lookup component.
   * @zh 执行 `lookupComponent`，用于查找表组件。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   */
  lookupComponent(comp) {
    if (!comp.events) {
      return this.createComponent(comp);
    }
    return comp;
  }

  // private
  /**
   * Executes `createComponent` to handle create component.
   * @zh 执行 `createComponent`，用于创建组件。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  createComponent(config) {
    if (config.render) {
      return config;
    }
    if (config.isField) {
      if (isUndefined(this.form)) {
        this.form = new FormGroup({});
      }
      if (isUndefined(config.value)) {
        const v = {};
        FormExt.initFieldValue(v, config);
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
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  getLayout() {
    return this.layout;
  }

  // private
  /**
   * Executes `beforeDestroy` to handle before destroy.
   * @zh 执行 `beforeDestroy`，用于之前销毁。
   */
  override beforeDestroy() {
    let c;
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
   * @param args - args parameter (`Array<any>`) / 参数列表参数（`Array<any>`）
   * @returns Result of type `Container` / 类型为 `Container` 的返回值
   */
  cascade(fn: Function, scope?: Object, args?): Container {
    if (fn.apply(scope || this, args || [this]) !== false) {
      if (this.items && this.items.items) {
        const cs = this.items.items;
        for (let i = 0, len = cs.length; i < len; i++) {
          if (cs[i].cascade) {
            cs[i].cascade(fn, scope, args);
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
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  findById(id: string) {
    let m = null;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ct = this;
    this.cascade(
      (c) => {
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
   * @returns Result of type `Array<any>` / 类型为 `Array<any>` 的返回值
   */
  findByType(xtype: string | Object, shallow: boolean) {
    return this.findBy(
      (c) => {
        return c.isXType(xtype, shallow);
      });
  }

  /**
   * Executes `find` to handle find.
   * @zh 执行 `find`，用于查找。
   * @param prop - prop parameter (`string`) / 属性参数（`string`）
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @returns Result of type `Array<any>` / 类型为 `Array<any>` 的返回值
   */
  find(prop: string, value: string) {
    return this.findBy(
      (c) => {
        return c[prop] === value;
      });
  }

  /**
   * Executes `findBy` to handle find by.
   * @zh 执行 `findBy`，用于查找按。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   * @param scope - scope parameter (`any`) / scope参数（`any`）
   * @returns Result of type `Array<any>` / 类型为 `Array<any>` 的返回值
   */
  findBy(fn: Function, scope?) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const m = [], ct = this;
    this.cascade(
      (c) => {
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
