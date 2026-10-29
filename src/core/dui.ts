/**
 * @fileoverview Module `src/core/dui.ts` providing dui definitions and implementation.
 * @zh 模块文件 `src/core/dui.ts`，提供DUI相关的定义与实现。
 */

import { ChangeDetectorRef, ComponentRef } from '@angular/core';
import { AbstractControlOptions, FormArray, FormControl, FormGroup } from '@angular/forms';

import { DuiBase } from '@dotos/dui/base';
import { FieldConfigCache, FieldType, ValueChangeEvent, assignModelValue2, clone, defineHiddenProp, findControl, getFieldValue, registerControl } from '@dotos/dui/core/form';
import { Subject } from 'rxjs';
import { ComponentBase, DuiPlugin } from './component.base';

// @dynamic
/**
 * Class `Dui` encapsulating dui data structures and logic in `src/core`.
 * @zh 类 `Dui`，封装 `src/core` 中的DUI数据结构与处理逻辑。
 */
export class Dui extends DuiBase{

  /**
   * Property `navigator` (`Navigator`) storing navigator (default: `navigator`).
   * @zh 属性 `navigator`（类型：`Navigator`），用于存储或配置navigator（默认值：`navigator`）。
   */
  public static navigator = navigator;

  /**
   * Property `idSeed` (`number`) storing id seed (default: `0`).
   * @zh 属性 `idSeed`（类型：`number`），用于存储或配置唯一标识Seed（默认值：`0`）。
   */
  public static idSeed = 0;

  /**
   * Property `DOC` (`Document`) storing doc (default: `document`).
   * @zh 属性 `DOC`（类型：`Document`），用于存储或配置文档（默认值：`document`）。
   */
  public static DOC = document;

  /**
   * Property `pluginsCache` (`Map<string, unknown>`) storing plugins cache (default: `new Map<string, any>()`).
   * @zh 属性 `pluginsCache`（类型：`Map<string, unknown>`），用于存储或配置plugins缓存（默认值：`new Map<string, any>()`）。
   */
  private static pluginsCache = new Map<string, unknown>();

  /**
   * Property `UID_PROPERTY_` (`string`) storing uid property (default: `'dui_' + ((Math.random() * 1e9) >>> 0)`).
   * @zh 属性 `UID_PROPERTY_`（类型：`string`），用于存储或配置UID属性（默认值：`'dui_' + ((Math.random() * 1e9) >>> 0)`）。
   */
  public static UID_PROPERTY_ = 'dui_' + ((Math.random() * 1e9) >>> 0);

  /**
   * Counter for UID.

   * @zh 属性 `uidCounter_`（类型：`number`），用于存储或配置uid计数器（默认值：`0`）。
   */
  public static uidCounter_ = 0;

  /**
   * Property `getHashCode` (`(obj: any) => any`) storing get hash code (default: `Dui.getUid`).
   * @zh 属性 `getHashCode`（类型：`(obj: any) => any`），用于存储或配置获取Hash编码（默认值：`Dui.getUid`）。
   */
  public static getHashCode = Dui.getUid;

  /**
   * Property `removeHashCode` (`(obj: any) => void`) storing remove hash code (default: `Dui.removeUid`).
   * @zh 属性 `removeHashCode`（类型：`(obj: any) => void`），用于存储或配置移除Hash编码（默认值：`Dui.removeUid`）。
   */
  public static removeHashCode = Dui.removeUid;

  /**
   * Executes `generateGUID` to handle generate guid.
   * @zh 执行 `generateGUID`，用于生成全局唯一标识。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public static generateGUID(): string {
    function S4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return S4() + S4();
  }

  /**
   * Executes `getParam` to handle get param.
   * @zh 执行 `getParam`，用于获取参数。
   * @param path - path parameter (`string`) / 路径参数（`string`）
   * @returns Result of type `Record<string, unknown>` / 类型为 `Record<string, unknown>` 的返回值
   */
  public static getParam(path: string) {
    let params: Record<string, unknown> = {};
    if (path.indexOf('?') !== -1) {
      let paramString = path.substring(path.indexOf('?') + 1, path.length);
      let p = paramString.split('&');
      for (let i = 0; i < p.length; i++) {
        let paramPair = p[i].split('=');
        params[paramPair[0]] = paramPair[1];
      }
    }
    return params;
  }

  /**
   * Executes `getComponent` to handle get component.
   * @zh 执行 `getComponent`，用于获取组件。
   * @param id - id parameter (`string`) / 唯一标识参数（`string`）
   * @param container - container parameter (`any`) / 容器参数（`any`）
   */
  public static getComponent(id: string, container) {
    if (container.findById(id) != null) {
      return container.findById(id);
    } else {
      return container;
    }
  }

  /**
   * Executes `create` to handle create.
   * @zh 执行 `create`，用于创建。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public static create(config, comp?) {
    const resolver = comp.resolver;
    const injector = comp.injector;
    if(config.xtype){
      const factory = Dui.getComponentFactory(config.xtype);
      if (factory) {
        const component = factory.componentType;
        const componentFactory = resolver.resolveComponentFactory(component);
        const componentRef = componentFactory.create(injector);
        const comp = componentRef.instance;
        comp.reference = componentRef;
        comp.rendered = true;
        if (comp.init != undefined) {
          comp.init(config);
        }
        return comp;
      } else {
        throw new Error(config.xtype + ' not exits in factory');
      }
    }
  }
  /**
   * Executes `createField` to handle create field.
   * @zh 执行 `createField`，用于创建字段。
   * @param field - field parameter (`any`) / 字段参数（`any`）
   * @param parent - parent parameter (`any`) / 父级参数（`any`）
   */
  public static createField(field, parent?){
    const resolver = parent.resolver;
    const injector = parent.injector;
    const factory = Dui.getComponentFactory('dui-field');
    let obj;
    if(field.model==undefined){
      field.model={};
    }
    if(field.option==undefined){
      field.option={};
      Dui.initOption(field);
    }
    if(field.modelOptions==undefined){
      field.modelOptions={};
      field.modelOptions.updateOn='change';
      field.modelOptions.debounce=0;
    }
    Dui.addFormControl(field);
    if (factory != undefined) {
      const component = factory.componentType;
      const componentFactory = resolver.resolveComponentFactory(component);
      const componentRef = componentFactory.create(injector);
      const comp = componentRef.instance;
      comp.field = field;
      comp.init();
      comp.reference = componentRef;
      comp.rendered = true;
      parent.app.attachView(componentRef.hostView);
      componentRef.changeDetectorRef.detectChanges();
      obj = comp;
    } else {
      throw new Error('dui-field not exits in factory');
    }
    return obj;
  }

  /**
   * Executes `initOption` to handle init option.
   * @zh 执行 `initOption`，用于初始化选项。
   * @param field - field parameter (`any`) / 字段参数（`any`）
   */
  static initOption(field){
    const option = field.option;
    field.option.formState = field.option.formState || {};
    if (!option.showError) {
      option.showError =(field: FieldType)=> {
        return (
          field.formControl &&
          field.formControl.invalid &&
          (field.formControl.touched ||
            (field.option.parentForm && field.option.parentForm.submitted) ||
            !!(field.field.validation && field.field.validation.show))
        );
      };
    }
    if (!option.fieldChanges) {
      defineHiddenProp(option, 'fieldChanges', new Subject<ValueChangeEvent>());
    }
    if (!option._hiddenFieldsForCheck) {
      option._hiddenFieldsForCheck = [];
    }
    option._markForCheck = (f) => {
      option.detectChanges(f);
    };
    option.detectChanges = (f: FieldConfigCache) => {
      if (f._componentRefs) {
        f._componentRefs.forEach((ref) => {
          const changeDetectorRef = ref.injector.get(ChangeDetectorRef);
          changeDetectorRef.markForCheck();
        });
      }
      if (f.fieldGroup) {
        f.fieldGroup.forEach((f) => f && option.detectChanges(f));
      }
    };
    option.resetModel = (model?) => {
      model = clone(model ?? option._initialModel);
      if (field.model) {
        Object.keys(field.model).forEach((k) => delete field.model[k]);
        Object.assign(field.model, model || {});
      }
      option.build(field);
      field.form.reset(model);
      if (option.parentForm && option.parentForm.control === field.formControl) {
        (option.parentForm as { submitted: boolean }).submitted = false;
      }
    };
    option.updateInitialValue = () => (option._initialModel = clone(field.model));
    field.option.updateInitialValue();
  }
  /**
   * Executes `assignModelValue` to handle assign model value.
   * @zh 执行 `assignModelValue`，用于赋值模型值。
   * @param model - model parameter (`any`) / 模型参数（`any`）
   * @param path - path parameter (`string | (string | number)[]`) / 路径参数（`string | (string | number)[]`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  public static assignModelValue(model, path: string | (string | number)[], value) {
    assignModelValue2(model, path, value);
  }
  /**
   * Executes `addFormControl` to handle add form control.
   * @zh 执行 `addFormControl`，用于添加表单表单控件。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  public static addFormControl(field: FieldConfigCache) {
    let control = findControl(field);
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };
      if (field.fieldGroup) {
        control = new FormGroup({}, controlOptions);
      } else {
        const value = field.name ? getFieldValue(field) : field.defaultValue;
        control = new FormControl({ value, disabled: false }, controlOptions);
      }
    }
    registerControl(field, control);
  }

  /**
   * Executes `isPluginRegistered` to handle is plugin registered.
   * @zh 执行 `isPluginRegistered`，用于是否为Plugin已注册。
   * @param ptype - ptype parameter (`string`) / ptype参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  static isPluginRegistered(ptype: string): boolean {
    return Dui.pluginsCache.has(ptype);
  }

  /**
   * Executes `registerPlugin` to handle register plugin.
   * @zh 执行 `registerPlugin`，用于注册Plugin。
   * @param ptype - ptype parameter (`string`) / ptype参数（`string`）
   * @param cls - cls parameter (`any`) / cls参数（`any`）
   */
  static registerPlugin(ptype: string, cls) {
    Dui.pluginsCache.set(ptype, cls);
    cls.ptype = ptype;
  }

  /**
   * Executes `createPlugin` to handle create plugin.
   * @zh 执行 `createPlugin`，用于创建Plugin。
   * @param config - config parameter (`{ ptype?: string; }`) / 配置参数（`{ ptype?: string; }`）
   * @param defaultType - default type parameter (`string`) / 默认类型参数（`string`）
   * @returns Result of type `DuiPlugin` / 类型为 `DuiPlugin` 的返回值
   */
  static createPlugin(config: { ptype?: string }, defaultType?: string): DuiPlugin {
    const PluginCls = Dui.pluginsCache.get(config.ptype || defaultType) as (new (c?: object) => DuiPlugin) & Partial<DuiPlugin>;
    if (PluginCls.init) {
      // 已注册的是单例插件对象（带 init），直接用
      return PluginCls as Partial<DuiPlugin> as DuiPlugin;
    } else {
      return new PluginCls(config);
    }
  }


  /**
   * Executes `id` to handle id.
   * @zh 执行 `id`，用于唯一标识。
   * @param el - el parameter (`any`) / DOM元素参数（`any`）
   * @param prefix - prefix parameter (`any`) / 前缀参数（`any`）
   */
  public static id(el?, prefix?) {
    el = Dui.getDom(el, true) || {};
    if (!el.id) {
      el.id = (prefix || 'dui-gen') + (++Dui.idSeed);
    }
    return el.id;
  }

  /**
   * Executes `getTarget` to handle get target.
   * @zh 执行 `getTarget`，用于获取目标。
   * @param elem - elem parameter (`any`) / elem参数（`any`）
   * @param selector - selector parameter (`any`) / 选择器参数（`any`）
   */
  public static getTarget(elem, selector) {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype['msMatchesSelector'] ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
          //@ts-ignore
          let matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          //@ts-ignore
          while (--i >= 0 && matches.item(i) !== this) { }
          return i > -1;
        };
    }
    for (; elem && elem !== document; elem = elem.parentElement) {
      if (elem.matches(selector)) { return elem; }
    }
    return null;
  };

  /**
   * Executes `query` to handle query.
   * @zh 执行 `query`，用于查询。
   * @param elem - elem parameter (`any`) / elem参数（`any`）
   * @param selector - selector parameter (`any`) / 选择器参数（`any`）
   * @param result - result parameter (`any`) / 结果参数（`any`）
   */
  public static query(elem, selector, result?) {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype['msMatchesSelector'] ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
           //@ts-ignore
          let matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
             //@ts-ignore
          while (--i >= 0 && matches.item(i) !== this) { }
          return i > -1;
        };
    }
    if (elem.matches(selector)) {
      result.push(elem);
    } else {
      let els = elem.children;
      for (let i = 0; i < els.length; i++) {
        Dui.query(els[i], selector, result);
      }
    }
  };

  /**
   * Executes `getDom` to handle get dom.
   * @zh 执行 `getDom`，用于获取DOM节点。
   * @param el - el parameter (`any`) / DOM元素参数（`any`）
   * @param strict - strict parameter (`any`) / strict参数（`any`）
   */
  public static getDom(el, strict) {
    if (!el || !Dui.DOC) {
      return null;
    }
    if (el.dom) {
      return el.dom;
    } else {
      if (typeof el === 'string') {
        const e = Dui.DOC.getElementById(el);
        if (e && strict) {
          if (el === e.getAttribute('id')) {
            return e;
          } else {
            return null;
          }
        }
        return e;
      } else {
        return el;
      }
    }
  }

  /**
   * Executes `getUid` to handle get uid.
   * @zh 执行 `getUid`，用于获取Uid。
   * @param obj - obj parameter (`any`) / 对象参数（`any`）
   */
  public static getUid(obj) {
    return obj[Dui.UID_PROPERTY_] ||
      (obj[Dui.UID_PROPERTY_] = ++Dui.uidCounter_);
  }

  /**
   * Executes `hasUid` to handle has uid.
   * @zh 执行 `hasUid`，用于是否包含Uid。
   * @param obj - obj parameter (`any`) / 对象参数（`any`）
   */
  public static hasUid(obj) {
    return !!obj[Dui.UID_PROPERTY_];
  }

  /**
   * Executes `removeUid` to handle remove uid.
   * @zh 执行 `removeUid`，用于移除Uid。
   * @param obj - obj parameter (`any`) / 对象参数（`any`）
   */
  public static removeUid(obj) {
    if ('removeAttribute' in obj) {
      obj.removeAttribute(Dui.UID_PROPERTY_);
    }
    /** @preserveTry */
    try {
      delete obj[Dui.UID_PROPERTY_];
    } catch (ex) {
    }
  }

  /**
   * Executes `removeFieldControl` to handle remove field control.
   * @zh 执行 `removeFieldControl`，用于移除字段表单控件。
   * @param form - form parameter (`FormGroup<any> | FormArray<any>`) / 表单参数（`FormGroup<any> | FormArray<any>`）
   * @param key - key parameter (`string | number`) / 键参数（`string | number`）
   */
  public static removeFieldControl(form: FormArray | FormGroup, key: string | number) {
    if (form instanceof FormArray) {
      form.removeAt(key as number);
    } else if (form instanceof FormGroup) {
      form.removeControl(`${key}`);
    }
  }
}
