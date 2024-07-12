import { ChangeDetectorRef, ComponentRef} from '@angular/core';
import { AbstractControlOptions, FormArray, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';

import { DuiBase } from '@dotos/dui/base';
import { FieldType,FieldConfigCache, ValueChangeEvent } from '@dotos/dui/core/form';
import { findControl, registerControl } from '@dotos/dui/core/form';
import { clone, defineHiddenProp, getFieldValue } from '@dotos/dui/core/form';
import { assignModelValue2 } from '@dotos/dui/core/form';
import { Subject } from 'rxjs';
import { ComponentBase } from './component.base';

// @dynamic
export class Dui extends DuiBase{

  public static navigator = navigator;

  public static idSeed = 0;

  public static DOC = document;

  private static pluginsCache: Map<string, any> = new Map<string, any>();

  public static UID_PROPERTY_ = 'dui_' + ((Math.random() * 1e9) >>> 0);

  /**
   * Counter for UID.
   */
  public static uidCounter_ = 0;

  public static getHashCode = Dui.getUid;

  public static removeHashCode = Dui.removeUid;

  public static generateGUID(): string {
    function S4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return S4() + S4();
  }

  public static getParam(path: string): any {
    let params = {};
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

  public static getComponent(id: string, container: any) {
    if (container.findById(id) != null) {
      return container.findById(id);
    } else {
      return container;
    }
  }

  public static create(config: any, comp?: any): any {
    const resolver = comp.resolver;
    const injector = comp.injector;
    if(config.xtype){
      const factory: any = Dui.getComponentFactory(config.xtype);
      if (factory) {
        const component = factory.componentType;
        const componentFactory = resolver.resolveComponentFactory(component);
        const componentRef: ComponentRef<any> = componentFactory.create(injector);
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
  public static createField(field:any, parent?: any){
    const resolver = parent.resolver;
    const injector = parent.injector;
    const factory: any = Dui.getComponentFactory('dui-field');
    let obj:any;
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
      const componentRef: ComponentRef<any> = componentFactory.create(injector);
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
    option.resetModel = (model?: any) => {
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
  public static assignModelValue(model: any, path: string | (string | number)[], value: any) {
    assignModelValue2(model, path, value);
  }
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

  static isPluginRegistered(ptype: string): boolean {
    return Dui.pluginsCache.has(ptype);
  }

  static registerPlugin(ptype: string, cls) {
    Dui.pluginsCache.set(ptype, cls);
    cls.ptype = ptype;
  }

  static createPlugin(config: any, defaultType?: string): ComponentBase {
    const PluginCls = Dui.pluginsCache.get(config.ptype || defaultType);
    if (PluginCls.init) {
      return PluginCls;
    } else {
      return new PluginCls(config);
    }
  }


  public static id(el?, prefix?) {
    el = Dui.getDom(el, true) || {};
    if (!el.id) {
      el.id = (prefix || 'dui-gen') + (++Dui.idSeed);
    }
    return el.id;
  }

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

  public static query(elem: any, selector, result?) {
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

  public static getUid(obj:any) {
    return obj[Dui.UID_PROPERTY_] ||
      (obj[Dui.UID_PROPERTY_] = ++Dui.uidCounter_);
  }

  public static hasUid(obj) {
    return !!obj[Dui.UID_PROPERTY_];
  }

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

  public static removeFieldControl(form: FormArray | FormGroup, key: string | number) {
    if (form instanceof FormArray) {
      form.removeAt(key as number);
    } else if (form instanceof FormGroup) {
      form.removeControl(`${key}`);
    }
  }
}
