/**
 * @fileoverview Module `src/core/services/highlight-transform.service.spec.ts` providing highlight transform service spec definitions and implementation.
 * @zh 模块文件 `src/core/services/highlight-transform.service.spec.ts`，提供highlight转换服务spec相关的定义与实现。
 */

import { HighlightTransformService } from './highlight-transform.service';

/** b8c5e5c 复核:在 Text 节点上高亮,不二次转义,重复执行幂等。 */
describe('HighlightTransformService(b8c5e5c 复核)', () => {
  const svc = new HighlightTransformService();
  const text = (html: string) => { const d = document.createElement('div'); d.innerHTML = html; return d; };

  it('已有实体不被二次转义,搜 "amp" 不切坏实体', () => {
    const r = svc.highlight('a &amp; b amp', 'amp');
    const d = text(r.text);
    expect(d.textContent).toBe('a & b amp');
    expect(d.querySelectorAll('span.dui-highlight').length).toBe(1);
  });
  it('重复执行幂等', () => {
    const once = svc.highlight('foo bar foo', 'foo').text;
    const twice = svc.highlight(once, 'foo').text;
    expect(twice).toBe(once);
    expect(text(twice).querySelectorAll('span.dui-highlight').length).toBe(2);
  });
  it('不在标签 / 属性里插 span', () => {
    const r = svc.highlight('<b title="foo">foo</b>', 'foo');
    const d = text(r.text);
    expect(d.querySelector('b')!.getAttribute('title')).toBe('foo');
    expect(d.querySelectorAll('span.dui-highlight').length).toBe(1);
    expect(r.changed).toBeTrue();
  });
  it('纯文本里的 "<" 不被当成标签', () => {
    expect(text(svc.highlight('1 < 2 foo', 'foo').text).textContent).toBe('1 < 2 foo');
  });
});
