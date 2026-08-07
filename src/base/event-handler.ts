import { debounce, extend } from './util';


export class EventHandler {
  private static addOrGetEventData(element: Element | HTMLElement | Document): EventOptions[] |undefined{
    //Guard against null/undefined targets so teardown paths (component destroy) never throw.
    if (!element) {
      return undefined;
    }
    if ('__eventList' in element) {
      return (<EventData>element).__eventList.events;
    } else {
      (<EventData>element).__eventList = {};
      return (<EventData>element).__eventList.events = [];
    }
  }

  public static add(
    element: Element | HTMLElement | Document | any,
    eventName: string,
    listener: Function,
    bindTo?: any,
    intDebounce?: number): Function {
    const eventData: EventOptions[] |undefined= EventHandler.addOrGetEventData(element);
    let debounceListener: Function;
    if (intDebounce) {
      debounceListener = debounce(listener, intDebounce);
    } else {
      debounceListener = listener;
    }
    if (bindTo) {
      debounceListener = debounceListener.bind(bindTo);
    }
    const event: string[] = eventName.split(' ');
    if(eventData){
      for (let i = 0; i < event.length; i++) {
        eventData.push({
          name: event[i],
          listener: listener,
          debounce: debounceListener
        });
        element.addEventListener(event[i], <EventListener>debounceListener);
      }
    }
    return debounceListener;
  }

  /**
   * Remove an event listener that has been attached before.
   * param {any} element - Specifies the target html element to remove the event
   * param {string} eventName - A string that specifies the name of the event to remove
   * param {Function} listener - Specifies the function to remove
   * return {void}
   */
  public static remove(element: Element | HTMLElement | Document | any, eventName: string, listener: Function): void {
    const eventData: EventOptions[] |undefined= EventHandler.addOrGetEventData(element);
    if (!eventData) { return; }
    const event: string[] = eventName.split(' ');
    for (let j = 0; j < event.length; j++) {
      let index = -1;
      let debounceListener: Function|undefined;
      if (eventData && eventData.length !== 0) {
        eventData.some((x: EventOptions, i: number) => {
          return x.name === event[j] && x.listener === listener ?
            (index = i, debounceListener = x.debounce, true) : false;
        });
      }
      if (index !== -1) {
        eventData.splice(index, 1);
      }
      if (debounceListener) {
        element.removeEventListener(event[j], <EventListener>debounceListener);
      }
    }
  }

  public static clearEvents(element: Element): void {
    let eventData: EventOptions[] |undefined;
    let copyData: EventOptions[]=[];
    eventData = EventHandler.addOrGetEventData(element);
    if (!eventData) { return; }
    copyData = extend([], copyData, eventData) as EventOptions[];
    for (let i = 0; i < copyData.length; i++) {
      element.removeEventListener(<string>copyData[i].name, <EventListener>copyData[i].debounce);
      eventData.shift();
    }
  }

  /**
   * Trigger particular event of the element.
   * param {any} element - Specifies the target html element to trigger the events
   * param {string} eventName - Specifies the event to trigger for the specified element.
   * Can be a custom event, or any of the standard events.
   * param {any} eventProp - Additional parameters to pass on to the event properties
   * return {void}
   */
  public static trigger(element: HTMLElement, eventName: string, eventProp?: Object): void {
    const eventData: EventOptions[] |undefined= EventHandler.addOrGetEventData(element);
    if (!eventData) { return; }
    for (const event of eventData) {
      if (event.name === eventName) {
        event.debounce.call(this, eventProp);
      }
    }
  }
}

interface EventData extends Element {
  __eventList: EventList;
}

interface EventList {
  events?: EventOptions[];
}

interface EventOptions {
  name: string;
  listener: Function;
  debounce?: Function;
}

/**
 * Common Event argument for all base Essential JavaScript 2 Events.
 * private
 */
export interface BaseEventArgs {
  /**
   * Specifies name of the event.
   */
  name?: string;
}
