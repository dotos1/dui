/**
 * @fileoverview Module `src/common/inline-svg/svg-cache.service.spec.ts` providing svg cache service spec definitions and implementation.
 * @zh 模块文件 `src/common/inline-svg/svg-cache.service.spec.ts`，提供SVG矢量图缓存服务spec相关的定义与实现。
 */

import { SVGCacheService } from './svg-cache.service';

/** b8c5e5c 复核:SVG 在惰性文档里解析、净化后再进活文档。 */
describe('SVGCacheService._svgElementFromString(b8c5e5c 复核)', () => {
  const svc: any = Object.create(SVGCacheService.prototype);
  svc._renderer = { createElement: (t: string) => document.createElement(t) };
  const parse = (s: string): SVGElement => svc._svgElementFromString(s);

  it('去掉 <set attributeName="href"> 对链接的改写', () => {
    const svg = parse('<svg xmlns="http://www.w3.org/2000/svg"><a href="#"><set attributeName="href" to="javascript:alert(1)"/><circle r="5"/></a></svg>');
    expect(svg.querySelector('set')).toBeNull();
    expect(svg.querySelector('circle')).not.toBeNull();
  });
  it('带空白的 javascript: 被删', () => {
    const svg = parse('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="java&#x09;script:alert(1)"><text>t</text></a></svg>');
    const a = svg.querySelector('a')!;
    expect(a.getAttribute('xlink:href')).toBeNull();
    expect(a.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toBeNull();
  });
  it('保留 style 与正常的 xlink:href,返回 SVG 命名空间的元素', () => {
    const svg = parse('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#ic" style="fill: red"/></svg>');
    const use = svg.querySelector('use')!;
    expect(use.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toBe('#ic');
    expect(use.getAttribute('style')).toContain('fill');
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
  });
  it('缺 xmlns 的片段照样能解析', () => {
    const svg = parse('<svg viewBox="0 0 1 1"><path d="M0 0" onclick="alert(1)"/></svg>');
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(svg.querySelector('path')!.hasAttribute('onclick')).toBeFalse();
  });
  it('没有 svg 时抛错', () => {
    expect(() => parse('<div>no</div>')).toThrow();
  });
});
