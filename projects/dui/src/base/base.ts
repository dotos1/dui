
import {
  isUndefined, isNullOrUndefined, merge, setImmediate, setValue,
  getValue, isBlazor, extend
} from './util';
import { addClass, removeClass } from './dom';
import { Observer } from './observer';

// @dynamic
export const defaultCulture: string = 'en-US';

export interface DomElements extends HTMLElement {
  dui_instances: Object[];
}

const isColEName: RegExp = new RegExp('\]');

/* tslint:disable:no-any */
export interface AngularEventEmitter {
  subscribe?: (generatorOrNext?: any, error?: any, complete?: any) => any;
}

export declare type EmitType<T> = AngularEventEmitter & ((arg?: T, ...rest: any[]) => void);

export abstract class Base<ElementType extends HTMLElement> {
  public element: ElementType;
  public isDestroyed: boolean;
  protected isProtectedOnChange: boolean = true;
  protected properties: { [key: string]: Object } = {};
  protected changedProperties: { [key: string]: Object } = {};
  protected oldProperties: { [key: string]: Object } = {};
  protected refreshing: boolean = false;
  public isServerRendered: boolean = false;
  public allowServerDataBinding: boolean = true;
  public ignoreCollectionWatch: boolean = false;
  protected bulkChanges: { [key: string]: Object } = {};

  protected finalUpdate: Function = (): void => { };
  protected modelObserver: Observer;
  protected childChangedProperties: { [key: string]: Object } = {};
  protected abstract getModuleName(): string;
  protected abstract onPropertyChanged(newProperties: Object, oldProperties?: Object): void;
  /** Property base section */
  /**
   * Function used to set bunch of property at a time.
   * private
   * param  {Object} prop - JSON object which holds components properties.
   * param  {boolean} muteOnChange? - Specifies to true when we set properties.
   */
  public setProperties(prop: any, muteOnChange?: boolean): void {
    const prevDetection: boolean = this.isProtectedOnChange;
    this.isProtectedOnChange = !!muteOnChange;
    merge(this, prop);
    if (muteOnChange !== true) {
      merge(this.changedProperties, prop);
      this.dataBind();
    }
    this.finalUpdate();
    this.changedProperties = {};
    this.oldProperties = {};
    this.isProtectedOnChange = prevDetection;
  };
  /**
   * Calls for child element data bind
   * param {Object} obj
   * param {Object} parent
   * returns {void}
   */
  // tslint:disable-next-line:no-any
  private static callChildDataBind(obj: Object, parent: { [key: string]: any }): void {
    const keys: string[] = Object.keys(obj);
    for (const key of keys) {
      if (parent[key] instanceof Array) {
        for (const obj of parent[key]) {
          if (obj.dataBind !== undefined) {
            obj.dataBind();
          }
        }
      } else {
        parent[key].dataBind();
      }
    }
  }

  protected clearChanges(): void {
    this.finalUpdate();
    this.changedProperties = {};
    this.oldProperties = {};
    this.childChangedProperties = {};
  }

  /**
   * Bind property changes immediately to components
   */
  public dataBind(): void {
    Base.callChildDataBind(this.childChangedProperties, this);
    if (Object.getOwnPropertyNames(this.changedProperties).length) {
      const prevDetection: boolean = this.isProtectedOnChange;
      const newChanges: Object = this.changedProperties;
      const oldChanges: Object = this.oldProperties;
      this.clearChanges();
      this.isProtectedOnChange = true;
      this.onPropertyChanged(newChanges, oldChanges);
      this.isProtectedOnChange = prevDetection;
    }
  };


  /* tslint:disable:no-any */
  public serverDataBind(newChanges?: { [key: string]: any }): void {
    if (!isBlazor()) {
      return;
    }
    newChanges = newChanges ? newChanges : {};
    extend(this.bulkChanges, {}, newChanges, true);
    if (this.allowServerDataBinding) {
      const sfBlazor: string = 'sfBlazor';
      (window as any)[sfBlazor].updateModel(this);
      this.bulkChanges = {};
    }
  }
  protected saveChanges(key: string, newValue: any, oldValue: any): void {
    if (this.isProtectedOnChange) { return; }
    this.oldProperties[key] = oldValue;
    this.changedProperties[key] = newValue;
    this.finalUpdate();
    this.finalUpdate = setImmediate(this.dataBind.bind(this));
  };

  public on(eventName: string, handler: Function, scope?: any): void {
    this.modelObserver.on(eventName, handler, scope);
  }
  public addEventListener(eventName: string, handler: Function): void {
    this.modelObserver.on(eventName, handler);
  }
  public off(eventName: string, handler: Function): void {
    this.modelObserver.off(eventName, handler);
  }
  public removeEventListener(eventName: string, handler: Function): void {
    this.modelObserver.off(eventName, handler);
  }
  /**
   * Triggers the handlers in the specified event.
   * private
   * param {string} eventName - Specifies the event to trigger for the specified component properties.
   * Can be a custom event, or any of the standard events.
   * param {Event} eventProp - Additional parameters to pass on to the event properties
   * param {Function} successHandler - this function will invoke after event successfully triggered
   * param {Function} errorHandler - this function will invoke after event if it failured to call.
   * return {void}
   */
  public trigger(
    eventName: string,
    eventProp?: Object,
    successHandler?: Function,
    errorHandler?: Function): void | object {
    if (this.isDestroyed !== true) {
      const prevDetection: boolean = this.isProtectedOnChange;
      this.isProtectedOnChange = false;
      const data: object = this.modelObserver.notify(eventName, eventProp, successHandler, errorHandler) as object;
      if (isColEName.test(eventName)) {
        const handler: Function = getValue(eventName, this);
        if (handler) {
          handler.call(this, eventProp);
          if (successHandler) {
            successHandler.call(this, eventProp);
          }
        } else if (successHandler) {
          successHandler.call(this, eventProp);
        }
      }
      this.isProtectedOnChange = prevDetection;
      return data;
    }
  }

  /**
   * Base constructor accept options and element
   */
  constructor(options?: Object, element?: ElementType | string|undefined) {
    this.modelObserver = new Observer(this);
    if (!isUndefined(element)) {
      if ('string' === typeof (element)) {
        this.element = <ElementType>document.querySelector(<string>element);
      } else {
        this.element = <ElementType>element;
      }
      if (!isNullOrUndefined(this.element)) {
        this.isProtectedOnChange = false;
        this.addInstance();
      }
    }
    if (!isUndefined(options)) {
      this.setProperties(options, true);
    }
    this.isDestroyed = false;
  }

  /**
   * To maintain instance in base class
   */
  protected addInstance(): void {
    // Add module class to the root element
    const moduleClass: string = 'e-' + this.getModuleName().toLowerCase();
    addClass([this.element], ['e-lib', moduleClass]);
    if (!isNullOrUndefined((<DomElements>(this.element as HTMLElement)).dui_instances)) {
      (<DomElements>(this.element as HTMLElement)).dui_instances.push(this);
    } else {
      setValue('dui_instances', [this], (<DomElements>(this.element as HTMLElement)));
    }
  }
  /**
   * To remove the instance from the element
   */
  protected destroy(): void {
    (<DomElements>(this.element as HTMLElement)).dui_instances =
      (<DomElements>(this.element as HTMLElement)).dui_instances.filter((i: Object) => { return i !== this; });
    removeClass([this.element], ['e-' + this.getModuleName()]);
    if ((<DomElements>(this.element as HTMLElement)).dui_instances.length === 0) {
      // Remove module class from the root element
      removeClass([this.element], ['e-lib']);
    }
    this.clearChanges();
    this.modelObserver.destroy();
    this.isDestroyed = true;
  }
}

/**
 * Global function to get the component instance from the rendered element.
 * param elem Specifies the HTMLElement or element id string.
 * param comp Specifies the component module name or Component.
 */
// tslint:disable-next-line:no-any
export function getComponent<T>(elem: HTMLElement | string, comp: string | any | T): T|undefined {
  let instance: T;
  let i: number;
  const ele: HTMLElement |null= typeof elem === 'string' ? document.getElementById(elem) : elem;
  for (i = 0; i < (<DomElements>(ele as HTMLElement)).dui_instances.length; i++) {
    instance = <T>(ele as DomElements).dui_instances[i];
    if (typeof comp === 'string') {
      const compName: string = (instance as { getModuleName: () => string } & T).getModuleName();
      if (comp === compName) {
        return instance;
      }
    } else {
      // tslint:disable-next-line:no-any
      if (instance instanceof <any>comp) {
        return instance;
      }
    }
  }
  return undefined;
}
