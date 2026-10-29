/**
 * @fileoverview Module `src/common/inline-svg/svg-util.ts` providing svg util definitions and implementation.
 * @zh 模块文件 `src/common/inline-svg/svg-util.ts`，提供SVG矢量图工具相关的定义与实现。
 */

import { Renderer2 } from '@angular/core';


/**
 * Executes `isUrlSymbol` to handle is url symbol.
 * @zh 执行 `isUrlSymbol`，用于是否为链接地址Symbol。
 * @param url - url parameter (`string`) / 链接地址参数（`string`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isUrlSymbol(url: string): boolean {
  return url.charAt(0) === '#' || url.indexOf('.svg#') > -1;
}


/**
 * Executes `isSvgSupported` to handle is svg supported.
 * @zh 执行 `isSvgSupported`，用于是否为SVG矢量图Supported。
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isSvgSupported(): boolean {
  return typeof SVGRect !== 'undefined';
}


/**
 * Executes `createSymbolSvg` to handle create symbol svg.
 * @zh 执行 `createSymbolSvg`，用于创建SymbolSVG矢量图。
 * @param renderer - renderer parameter (`Renderer2`) / 渲染器参数（`Renderer2`）
 * @param svg - svg parameter (`SVGElement`) / SVG矢量图参数（`SVGElement`）
 * @param symbolId - symbol id parameter (`string`) / symbol唯一标识参数（`string`）
 * @returns Result of type `SVGElement` / 类型为 `SVGElement` 的返回值
 */
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


/**
 * Executes `removeAttributes` to handle remove attributes.
 * @zh 执行 `removeAttributes`，用于移除属性列表。
 * @param element - element parameter (`Element`) / 元素参数（`Element`）
 * @param attrs - attrs parameter (`string[]`) / 属性集合参数（`string[]`）
 */
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

/**
 * Executes `setAttributes` to handle set attributes.
 * @zh 执行 `setAttributes`，用于集合属性列表。
 * @param element - element parameter (`any`) / 元素参数（`any`）
 * @param attrs - attrs parameter (`{ [key: string]: unknown; }`) / 属性集合参数（`{ [key: string]: unknown; }`）
 */
export function setAttributes(element, attrs: { [key: string]: unknown }): void {
  for (const attr in attrs) {
    element.setAttribute(attr, attrs[attr]);
  }
}
