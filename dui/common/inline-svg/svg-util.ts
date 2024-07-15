import { Renderer2 } from '@angular/core';


export function isUrlSymbol(url: string): boolean {
  return url.charAt(0) === '#' || url.indexOf('.svg#') > -1;
}


export function isSvgSupported(): boolean {
  return typeof SVGRect !== 'undefined';
}


export function createSymbolSvg(
  renderer: Renderer2, svg: SVGElement, symbolId: string): SVGElement {
  const symbol = svg.querySelector(`[id="${symbolId}"]`);
  if (!symbol) {
    throw new Error(`Symbol "${symbolId}" not found`);
  }

  const elSvg = renderer.createElement('svg', 'svg');
  renderer.appendChild(elSvg, symbol);

  const elSvgUse = renderer.createElement('use', 'svg');
  renderer.setAttribute(elSvgUse, 'href', `#${symbolId}`, 'xlink');
  renderer.appendChild(elSvg, elSvgUse);

  return elSvg;
}


export function removeAttributes(element: Element, attrs: Array<string>): void {
  for (let i = 0; i < attrs.length; i++) {
    const elAttr = element.getAttribute(attrs[i]);
    if (elAttr) {
      element.removeAttribute(attrs[i]);
    }
  }
  const innerEls = element.getElementsByTagName('*');
  for (let i = 0; i < innerEls.length; i++) {
    removeAttributes(innerEls[i], attrs);
  }
}

export function setAttributes(element: Element, attrs: { [key: string]: any }): void {
  for (const attr in attrs) {
    element.setAttribute(attr, attrs[attr]);
  }
}
