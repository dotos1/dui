import { isNullOrUndefined, getValue } from './util';

export interface BoundOptions {
  handler?: Function;
  context?: Object;
  event?: string;
  id?: string;
}
export class Observer {
  private context: any;
  private ranArray: string[] = [];
  private boundedEvents: { [key: string]: [BoundOptions] } = {};
  constructor(context?: Object) {
    if (isNullOrUndefined(context)) {
      return;
    }
    this.context = context;
  };

  public on(property: string, handler: Function, context?: Object, id?: string): void {
    if (isNullOrUndefined(handler)) {
      return;
    }
    let cntxt: Object = context || this.context;
    if (this.notExist(property)) {
      this.boundedEvents[property] = [{ handler: handler, context: cntxt }];
      return;
    }
    if (id!=undefined) {
      if (this.ranArray.indexOf(id) === -1) {
        this.ranArray.push(id);
        this.boundedEvents[property].push({ handler: handler, context: cntxt, id: id });
      }
    } else if (!this.isHandlerPresent(this.boundedEvents[property], handler)) {
      this.boundedEvents[property].push({ handler: handler, context: cntxt });
    }
  }


  public off(property: string, handler?: Function, id?: string): void {
    if (this.notExist(property)) {
      return;
    }
    let curObject: BoundOptions[] = getValue(property, this.boundedEvents);
    if (handler&&curObject) {
      // eslint-disable-next-line @typescript-eslint/no-inferrable-types
      for (let i: number = 0; i < curObject.length; i++) {
        if (id) {
          if (curObject[i].id === id) {
            curObject.splice(i, 1);
            let indexLocation: number = this.ranArray.indexOf(id);
            if (indexLocation !== -1) {
              this.ranArray.splice(indexLocation, 1);
            }
            break;
          }
        } else if (handler === curObject[i].handler) {
          curObject.splice(i, 1);
          break;
        }
      }
    } else if(this.boundedEvents) {
      delete this.boundedEvents[property];
    }
  }

  public emit(property: string, argument?: Object, successHandler?: Function, errorHandler?: Function): void | Object {
    this.notify(property,argument,successHandler,errorHandler);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public notify(property: string, argument?: Object, successHandler?: Function, errorHandler?: Function): void | Object {
    if (this.notExist(property)) {
      if (successHandler) {
        successHandler.call(this, argument);
      }
      return;
    }
    // if (argument) {
    //   (<{ name: string }>argument).name = property;
    // }
    let curObject: BoundOptions[] = getValue(property, this.boundedEvents).slice(0);
      for (let cur of curObject) {
        if(cur.handler){
          cur.handler.call(cur.context, argument);
        }
      }
      if (successHandler) {
        successHandler.call(this, argument);
      }
  }
  public isJson(value: string): boolean {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }
    return true;
  }
  /**
   * To destroy handlers in the event
   */
  public destroy(): void {
    this.boundedEvents = this.context = undefined;
  }
  /**
   * Returns if the property exists.
   */
  private notExist(prop: string): boolean {
    return this.boundedEvents&&(this.boundedEvents.hasOwnProperty(prop) === false || this.boundedEvents[prop].length <= 0);
  }

  private isHandlerPresent(boundedEvents: BoundOptions[], handler: Function): boolean {
    for (let cur of boundedEvents) {
      if (cur.handler === handler) {
        return true;
      }
    }
    return false;
  }
}
