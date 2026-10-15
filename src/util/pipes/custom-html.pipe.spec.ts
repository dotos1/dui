import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './custom-html.pipe';

/** b8c5e5c 复核:DOM 级净化。不误伤正文,拦得住带空白 / 实体的 javascript:。 */
describe('SanitizeHtmlPipe(b8c5e5c 复核)', () => {
  let pipe: SanitizeHtmlPipe;
  const html = (v: string): string => (pipe.transform(v) as any).changingThisBreaksApplicationSecurity ?? '';
  const dom = (v: string) => { const d = document.createElement('div'); d.innerHTML = html(v); return d; };

  beforeEach(() => { pipe = new SanitizeHtmlPipe(TestBed.inject(DomSanitizer)); });

  it('正文里的 "onset = 5" 不被删', () => {
    expect(dom('<p>set onset = 5 ms</p>').textContent).toBe('set onset = 5 ms');
  });
  it('属性值里出现 " onx=" 不破坏属性', () => {
    const a = dom('<a title="x onclick=1 y" href="/doc">t</a>').querySelector('a')!;
    expect(a.getAttribute('title')).toBe('x onclick=1 y');
    expect(a.getAttribute('href')).toBe('/doc');
  });
  it('删除事件属性与 script', () => {
    const d = dom('<img src="x.png" onerror="alert(1)"><script>alert(1)</script>');
    expect(d.querySelector('img')!.hasAttribute('onerror')).toBeFalse();
    expect(d.querySelector('script')).toBeNull();
  });
  it('带空白 / 实体的 javascript: 链接被删', () => {
    const d = dom('<a id="a" href="java&#x09;script:alert(1)">x</a><a id="b" href=" &#x6A;avascript:alert(1)">y</a>');
    expect(d.querySelector('#a')!.hasAttribute('href')).toBeFalse();
    expect(d.querySelector('#b')!.hasAttribute('href')).toBeFalse();
  });
  it('form action / formaction 的 javascript: 被删', () => {
    const d = dom('<form action="javascript:alert(1)"><button formaction="javascript:alert(2)">b</button></form>');
    expect(d.querySelector('form')!.hasAttribute('action')).toBeFalse();
    expect(d.querySelector('button')!.hasAttribute('formaction')).toBeFalse();
  });
  it('svg <set attributeName=href> 被删', () => {
    const d = dom('<svg><a><set attributeName="href" to="javascript:alert(1)"></set><text>t</text></a></svg>');
    expect(d.querySelector('set')).toBeNull();
  });
  it('iframe / object / embed 被删,style 保留', () => {
    const d = dom('<div style="color: red">k</div><iframe src="/x"></iframe><object data="x"></object><embed src="x">');
    expect(d.querySelector('iframe,object,embed')).toBeNull();
    expect((d.querySelector('div') as HTMLElement).style.color).toBe('red');
  });
  it('开头的 <style> 元素不丢', () => {
    expect(dom('<style>.x{color:red}</style><div class="x">k</div>').querySelector('style')).not.toBeNull();
  });
});
