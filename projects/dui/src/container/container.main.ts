import { ViewContainerRef } from '@angular/core';
import { ChangeDetectorRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentBase, Dui } from '@dotos/dui/core';
import { MixedCollection } from '@dotos/dui/core/cache';
import { FormExt } from '@dotos/dui/core/form';
import * as _ from 'lodash';

/**
 *
 用于承载其它任何组件，容器负责一些基础性的行为，也就是装载子项、添加、插入和移除子项。
 根据容纳子项的不同，所产生的可视效果，需委托任意布局类layout中的一种来指点特定的布局逻辑（layout logic）。
 此类被于继承而且一般情况下不应通过关键字new来直接实例化。
 * xtype container
 */

export class Container extends ComponentBase {


  public layout: any;

  /**
   *一个单独项，或子组件组成的数组，加入到此容器中。每一项的对象类型是基于dui.
   Component可传入一个组件的配置对象即是lazy-rendering的做法，
   这样做的好处是组件不会立即渲染，减低直接构建组件对象带来的开销。
   要发挥"lazy instantiation延时初始化"的特性，应对组件所属的登记类型的dui.Componentxtype属性进行配置。
   */
  public items: any;

  /** cfg {boolean} autoDestroy
   * 若为true容器会自动销毁容器下面全部的组件，否则的话必须手动执行销毁过程（默认为true）。
   */

  public autoDestroy: boolean = true;

  public defaults: any;

  public viewContainer: ViewContainerRef;

  public form: FormGroup;

  constructor(
    public resolver: ComponentFactoryResolver,
    public injector: Injector,
    public override detectRef: ChangeDetectorRef) {
    super(detectRef);
    //  this.el = _elementRef.nativeElement;
  }

  // private
  override init(config: any) {
    super.init(config);
  }

  // private
  public initItems() {
    if (!this.items) {
      this.items = new MixedCollection(false, this.getComponentId);
      this.getLayout();
    }
  }

  // private - used as the key lookup function for the items collection
  getComponentId(comp) {
    return comp.id;
  }


  add(comp): any {
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
      this.items.add(comp);
      if (comp.onAdded) {
        comp.onAdded(this, index);
      }
      this.viewContainer.insert(comp.reference.hostView, index);
      this.onAdd(comp);
    } else {
      const component = this.lookupComponent(this.applyDefaults(comp));
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
  onAdd(c) {
  }


  // private
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override onAdded(container, pos) {
    this.ownerCt = container;
  }

  /**
   * 把插件(Component)插入到容器指定的位置（按索引）。执行插入之前触发beforeadd事件，插入完毕触发add事件
   *  组件插入到容器collection集合的索引
   *  欲加入的组件
   */
  insert(index: number, comp): any {
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
  applyDefaults(c) {
    let d = this.defaults;
    if (d) {
      if (_.isFunction(d)) {
        d = d.call(this, c);
      }
      Dui.apply(c, d);
    }
    return c;
  }

  // private
  onBeforeAdd(item) {
    if (item.ownerCt) {
      item.ownerCt.remove(item, false);
    }
    return true;
  }

  remove(comp, autoDestroy: boolean): ComponentBase {
    const c = this.getComponent(comp);
    this.doRemove(c, autoDestroy);
    return c;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onRemove(c?) { }

  doRemove(c, autoDestroy) {
    this.items.remove(c);
    this.onRemove(c);
    if (autoDestroy === true || autoDestroy !== false && this.autoDestroy) {
      c.destroy();
    }
  }

  removeAll(autoDestroy: boolean): Array<any> {
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


  getComponent(comp: any): any {
    if (_.isObjectLike(comp)) {
      comp = comp['id'];
    }
    if (this.items) {
      return this.items.get(comp);
    } else {
      return undefined;
    }
  }

  // private
  lookupComponent(comp) {
    if (!comp.events) {
      return this.createComponent(comp);
    }
    return comp;
  }

  // private
  createComponent(config) {
    if (config.render) {
      return config;
    }
    if (config.isField) {
      if (_.isUndefined(this.form)) {
        this.form = new FormGroup({});
      }
      if (_.isUndefined(config.value)) {
        const v = {};
        FormExt.initFieldValue(v, config);
      }
    }
    const component = Dui.create(Dui.apply({ ownerCt: this }, config), this);
    delete component.ownerCt;
    return component;
  }

  getLayout(): any {
    return this.layout;
  }

  // private
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

  cascade(fn: Function, scope?: Object, args?: Array<any>): Container {
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

  findById(id: string): any {
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

  findByType(xtype: string | Object, shallow: boolean): Array<any> {
    return this.findBy(
      (c) => {
        return c.isXType(xtype, shallow);
      });
  }

  find(prop: string, value: string): Array<any> {
    return this.findBy(
      (c) => {
        return c[prop] === value;
      });
  }

  findBy(fn: Function, scope?: any): Array<any> {
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

  get(key: string | number): ComponentBase {
    return this.getComponent(key);
  }
}
