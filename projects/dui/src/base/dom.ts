

import { EventHandler } from './event-handler';
import { isNullOrUndefined } from './util';

// @dynamic
const SVG_REG = /^svg|^path|^g/;

export function createElement(tagName: string, properties?:
  { id?: string, className?: string, innerHTML?: string, styles?: string, attrs?: { [key: string]: string } }): HTMLElement {

  const element: Element = (SVG_REG.test(tagName) ? document.createElementNS('http://www.w3.org/2000/svg', tagName) : document.createElement(tagName));
  if (typeof (properties) === 'undefined') {
    return <HTMLElement>element;
  }
  element.innerHTML = (properties.innerHTML ? properties.innerHTML : '');

  if (properties.className !== undefined) {
    element.className = properties.className;
  }
  if (properties.id !== undefined) {
    element.id = properties.id;
  }
  if (properties.styles !== undefined) {
    element.setAttribute('style', properties.styles);
  }
  if (properties.attrs !== undefined) {
    // eslint-disable-next-line no-use-before-define
    attributes(element, properties.attrs);
  }
  return <HTMLElement>element;
}

export function addClass(elements: Element[] | NodeList, classes: string | string[]): Element[] | NodeList {
  const classList: string[] = getClassList(classes);
  for (const ele of (elements as Element[])) {
    for (const className of classList) {
      if (!ele.classList.contains(className)) {
        ele.classList.add(className);
      }
    }
  }
  return elements;
}

export function removeClass(elements: Element[] | NodeList, classes: string | string[]): Element[] | NodeList {
  const classList: string[] = getClassList(classes);
  for (const ele of (elements as Element[])) {
    if (ele.className !== '') {
      for (const className of classList) {
        ele.classList.remove(className);
      }
    }
  }
  return elements;
}

function getClassList(classes: string | string[]): string[] {
  let classList: string[] = [];
  if (typeof classes === 'string') {
    classList.push(classes);
  } else {
    classList = classes;
  }
  return classList;
}

export function isVisible(element: Element | Node): boolean {
  const ele: HTMLElement = <HTMLElement>element;
  return (ele.style.visibility === '' && ele.offsetWidth > 0);
}

export function prepend(fromElements: Element[] | NodeList, toElement: Element, isEval?: boolean): Element[] | NodeList {
  const docFrag: DocumentFragment = document.createDocumentFragment();
  for (const ele of (fromElements as Element[])) {
    docFrag.appendChild(ele);
  }
  toElement.insertBefore(docFrag, toElement.firstElementChild);
  if (isEval) {
    executeScript(toElement);
  }
  return fromElements;
}

export function append(fromElements: Element[] | NodeList, toElement: Element, isEval?: boolean): Element[] | NodeList {
  const docFrag: DocumentFragment = document.createDocumentFragment();
  for (const ele of <Element[]>fromElements) {
    docFrag.appendChild(ele);
  }
  toElement.appendChild(docFrag);
  if (isEval) {
    executeScript(toElement);
  }
  return fromElements;
}


function executeScript(ele: Element): void {
  const eleArray: NodeList = ele.querySelectorAll('script');
  eleArray.forEach((element: any) => {
    const script: HTMLScriptElement = document.createElement('script');
    script.text = element.innerHTML;
    document.head.appendChild(script);
    detach(script);
  });
}

/**
 * The function used to remove the element from the
 * param  {Element|Node|HTMLElement} element - An element that is going to detach from the Dom
 * private
 */
export function detach(element: Element | Node | HTMLElement): Element {
  const parentNode: Node = element.parentNode;

    return <Element>parentNode.removeChild(element);

}

/**
 * The function used to remove the element from Dom also clear the bounded events
 * param  {Element|Node|HTMLElement} element - An element remove from the Dom
 * private
 */
export function remove(element: Element | Node | HTMLElement): void {
  if (element) {
    const parentNode: any = element.parentNode;
    EventHandler.clearEvents(<Element>element);
    parentNode.removeChild(element);
  }
}

/**
 * The function helps to set multiple attributes to an element
 * param  {Element|Node} element - An element that need to set attributes.
 * param  {{[key:string]:string}} attributes - JSON Object that is going to as attributes.
 * private
 */
export function attributes(element: Element | Node, attributes: { [key: string]: string }): Element {
  const keys: string[] = Object.keys(attributes);
  const ele: Element = <Element>element;
  for (const key of keys) {
    ele.setAttribute(key, attributes[key]);
  }
  return ele;
}

/**
 * The function selects the element from giving context.
 * param  {string} selector - Selector string need fetch element from the
 * param  {Document|Element=document} context - It is an optional type, That specifies a Dom context.
 * private
 */
export function selectNode(selector: string, context: Document | Element = document): any {
  return context.querySelector(selector);
}

/**
 * The function selects an array of element from the given context.
 * param  {string} selector - Selector string need fetch element from the
 * param  {Document|Element=document} context - It is an optional type, That specifies a Dom context.
 * private
 */
export function selectAll(selector: string, context: Document | Element = document): HTMLElement[] {
  const nodeList: NodeList = context.querySelectorAll(selector);
  return <HTMLElement[] & NodeList>nodeList;
}

/**
 * Returns single closest parent element based on class selector.
 * param  {Element} element - An element that need to find the closest element.
 * param  {string} selector - A classSelector of closest element.
 * private
 */
export function closest(element: Element | Node, selector: string): Element|null {
  let el: Element = <Element>element;
  if (typeof el.closest === 'function') {
    return el.closest(selector);
  }

  while (el && el.nodeType === 1) {
    if (matches(el, selector)) {
      return el;
    }
    el = <Element>el.parentNode;
  }
  return null;
}

/**
 * Returns all sibling elements of the given element.
 * param  {Element|Node} element - An element that need to get siblings.
 * private
 */
export function siblings(element: Element | Node): Element[] {
  const siblings: Element[] = [];
  const parentNode=<(Node & ParentNode)>element.parentNode;
  const childNodes: Node[] = Array.prototype.slice.call(parentNode.childNodes);
  for (const curNode of childNodes) {
    if (curNode.nodeType === Node.ELEMENT_NODE && element !== curNode) {
      siblings.push(<Element>curNode);
    }
  }
  return <Element[]>siblings;
}

/**
 * set the value if not exist. Otherwise set the existing value
 * param  {HTMLElement} element - An element to which we need to set value.
 * param  {string} property - Property need to get or set.
 * param  {string} value - value need to set.
 * private
 */
export function getAttributeOrDefault(element: HTMLElement, property: string, value: string): string |null{
  let attrVal: string |null= element.getAttribute(property);
  if (isNullOrUndefined(attrVal)) {
    element.setAttribute(property, value.toString());
    attrVal = value;
  }
  return attrVal;
}

/**
 * Set the style attributes to Html element.
 * param {HTMLElement} element - Element which we want to set attributes
 * param {any} attrs - Set the given attributes to element
 * return {void}
 * private
 */
export function setStyleAttribute(element: HTMLElement, attrs: { [key: string]: object }|any): void {
  if (attrs !== undefined) {
    Object.keys(attrs).forEach((key: string) => {
      (<any>element).style[key] = attrs[key];
    });
  }
}

/**
 * Method for add and remove classes to a dom element.
 * param {Element} element - Element for add and remove classes
 * param {string[]} addClasses - List of classes need to be add to the element
 * param {string[]} removeClasses - List of classes need to be remove from the element
 * return {void}
 * private
 */
export function classList(element: Element, addClasses: string[], removeClasses: string[]): void {
  addClass([element], addClasses);
  removeClass([element], removeClasses);
}
/**
 * Method to check whether the element matches the given selector.
 * param {Element} element - Element to compare with the selector.
 * param {string} selector - String selector which element will satisfy.
 * return {void}
 * private
 */
export function matches(element: Element, selector: string): boolean {
  const matches: Function = element.matches  || element.webkitMatchesSelector;
  if (matches) {
    return matches.call(element, selector);
  } else {
    return [].indexOf.call(document.querySelectorAll(selector), <never>element) !== -1;
  }
}
