import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Clipboard } from '@angular/cdk/clipboard';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { ToastrService } from '@dotos1/dui/common/toastr';
import { ThemeService } from '@dotos1/dui/theme';
import { TranslationService } from '@dotos1/dui/translator';
import { ErrorInterceptor } from '../interceptors/error.interceptor';
import { ErrorDialogComponent } from './error-dialog.component';
import { ErrorNotifyService } from './error-notify.service';
import { PlatformError } from './platform-error';
import * as fs from 'fs';
import * as path from 'path';

// 同时兼容 karma 与 jest：不用框架专有 API，手写桩
type Cfg = { data: { errors: () => PlatformError[] } };
function stubs(lang = 'zh_CN', themeType: 'light' | 'dark' = 'light') {
  const toasts: string[] = [];
  const opened: Cfg[] = [];
  const closed = new Subject<unknown>();
  const langChange = new Subject<unknown>();
  const translate = { currentLang: lang, onLangChange: langChange, onTranslationChange: new Subject<unknown>() };
  const dict: Record<string, Record<string, string>> = {
    zh_CN: { 'ERROR.SOLUTION_STEPS': '解决步骤', 'ERROR.EXPECTED': '期望' },
    en_US: { 'ERROR.SOLUTION_STEPS': 'Steps to resolve', 'ERROR.EXPECTED': 'Expected' },
  };
  const ts = {
    translate,
    get userLang() { return translate.currentLang; },
    instant: (k: string) => dict[translate.currentLang]?.[k] ?? k,
  };
  const theme = { type: themeType };
  TestBed.configureTestingModule({
    imports: [NoopAnimationsModule],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      { provide: ToastrService, useValue: { error: (m: string) => toasts.push(m) } },
      { provide: MatDialog, useValue: { open: (_c: unknown, cfg: Cfg) => { opened.push(cfg); return { afterClosed: () => closed.asObservable() }; } } },
      { provide: TranslationService, useValue: ts },
      { provide: ThemeService, useValue: { getTheme: () => theme } },
    ],
  });
  return { toasts, opened, closed, translate, langChange, theme, get http() { return TestBed.inject(HttpClient); }, get ctl() { return TestBed.inject(HttpTestingController); }, get notify() { return TestBed.inject(ErrorNotifyService); } };
}

const guide4xx = { success: false, code: 'DATA.NOT_FOUND', status: 404, message: '找不到井 W-102', hint: '请确认是否已删除', solution: ['1. 打开数据管理', '2. 恢复后重试'], request_id: 'R1' };

describe('提示形态：对话框 vs toast', () => {
  it('带 solution 的 4xx 弹对话框，不弹 toast', () => {
    const { http, ctl, toasts, opened } = stubs();
    http.get('/api/a').subscribe({ error: () => undefined });
    ctl.expectOne('/api/a').flush(guide4xx, { status: 404, statusText: 'x' });
    expect(opened.length).toBe(1);
    expect(toasts.length).toBe(0);
    expect(opened[0].data.errors()[0].solution).toEqual(['打开数据管理', '恢复后重试']);
  });

  it('只有 details 的 400 也弹对话框', () => {
    const { http, ctl, toasts, opened } = stubs();
    http.post('/api/a', {}).subscribe({ error: () => undefined });
    ctl.expectOne('/api/a').flush({ success: false, message: '参数有误', details: [{ field: 'x', expected: 'a' }] }, { status: 400, statusText: 'x' });
    expect(opened.length).toBe(1);
    expect(toasts.length).toBe(0);
  });

  it('没有任何指南的 4xx 走 toast（hint 附在后面）', () => {
    const { http, ctl, toasts, opened } = stubs();
    http.post('/api/a', {}).subscribe({ error: () => undefined });
    ctl.expectOne('/api/a').flush({ success: false, message: '井号重复', hint: '换一个井号' }, { status: 409, statusText: 'x' });
    expect(opened.length).toBe(0);
    expect(toasts).toEqual(['井号重复 换一个井号']);
  });

  it('5xx 对话框含请求号', () => {
    const { http, ctl, opened } = stubs();
    http.post('/api/a', {}).subscribe({ error: () => undefined });
    ctl.expectOne('/api/a').flush({ success: false, code: 'SYS.INTERNAL', message: '系统内部错误', request_id: 'R500' }, { status: 500, statusText: 'x' });
    expect(opened.length).toBe(1);
    expect(opened[0].data.errors()[0].requestId).toBe('R500');
  });

  it('同一指纹 3 秒内不重复弹', () => {
    const { notify, opened } = stubs();
    const e = { kind: 'client', status: 404, code: 'A', message: 'm', solution: ['s'], critical: false } as PlatformError;
    expect(notify.show(e)).toBe(true);
    expect(notify.show({ ...e })).toBe(false);
    expect(opened.length).toBe(1);
  });

  it('多个错误同时到来：合并进一个对话框，不叠多个；关闭后再来才新开', () => {
    const { notify, opened, closed } = stubs();
    const mk = (code: string) => ({ kind: 'client', status: 400, code, message: code, solution: ['s'], critical: false }) as PlatformError;
    notify.show(mk('A'));
    notify.show(mk('B'));
    notify.show(mk('C'));
    expect(opened.length).toBe(1);
    expect(opened[0].data.errors().map(e => e.code)).toEqual(['A', 'B', 'C']);
    closed.next(undefined);
    notify.show(mk('D'));
    expect(opened.length).toBe(2);
    expect(opened[1].data.errors().map(e => e.code)).toEqual(['D']);
  });
});

describe('X-Dotos-Lang 请求头', () => {
  it('相对地址带当前界面语言，语言切换后随之变化', () => {
    const { http, ctl, translate } = stubs('zh_CN');
    http.get('/api/a').subscribe();
    expect(ctl.expectOne('/api/a').request.headers.get('X-Dotos-Lang')).toBe('zh_CN');
    translate.currentLang = 'ar_SA';
    http.get('/api/b').subscribe();
    expect(ctl.expectOne('/api/b').request.headers.get('X-Dotos-Lang')).toBe('ar_SA');
  });

  it('跨域第三方地址不带', () => {
    const { http, ctl } = stubs();
    http.get('https://third.example.com/x').subscribe();
    expect(ctl.expectOne('https://third.example.com/x').request.headers.has('X-Dotos-Lang')).toBe(false);
  });

  it('URL 含 timeout 的轮询请求同样带头', () => {
    const { http, ctl } = stubs();
    http.get('/api/poll/timeout').subscribe();
    expect(ctl.expectOne('/api/poll/timeout').request.headers.get('X-Dotos-Lang')).toBe('zh_CN');
  });
});

describe('ErrorDialogComponent', () => {
  function render(errors: PlatformError[], onReport?: (e: PlatformError) => void, themeType: 'light' | 'dark' = 'light') {
    const s = stubs('zh_CN', themeType);
    const list = signal(errors);
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { errors: list, onReport } },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
        { provide: Clipboard, useValue: { copy: () => true } },
      ],
    });
    const fixture = TestBed.createComponent(ErrorDialogComponent);
    fixture.detectChanges();
    return { toasts: s.toasts, opened: s.opened, closed: s.closed, translate: s.translate, langChange: s.langChange, theme: s.theme, fixture, list, el: fixture.nativeElement as HTMLElement };
  }
  const full: PlatformError = {
    kind: 'client', status: 404, code: 'DATA.NOT_FOUND', message: '找不到井', hint: '先确认', critical: false,
    solution: ['打开数据管理', '恢复后重试'], helpUrl: '/docs/a.html', requestId: 'R7',
    details: [{ field: 'wellId', expected: '非空', actual: '', hint: '填写井号' }],
  };

  it('依次显示：标题、下一步、编号步骤（ol）、字段清单、帮助链接（新标签）、请求号、报告', () => {
    const reported: string[] = [];
    const { el } = render([full], e => reported.push(e.code ?? ''));
    expect(el.querySelector('h2')?.textContent).toContain('找不到井');
    expect(el.querySelector('.dui-error-dialog__hint')?.textContent).toContain('先确认');
    const steps = Array.from(el.querySelectorAll('ol > li')).map(li => li.textContent?.trim());
    expect(steps).toEqual(['打开数据管理', '恢复后重试']);
    expect(el.querySelector('ul.dui-error-dialog__fields')?.textContent).toContain('wellId');
    expect(el.querySelector('dl')?.textContent).toContain('非空');
    const a = el.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe('/docs/a.html');
    expect(a.target).toBe('_blank');
    expect(a.rel).toContain('noopener');
    expect(el.querySelector('code')?.textContent).toBe('R7');
    const buttons = Array.from(el.querySelectorAll('button')).map(b => b.textContent?.trim());
    ['复制', '报告问题', '关闭'].forEach(b => expect(buttons).toContain(b));
    (Array.from(el.querySelectorAll('button')).find(b => b.textContent?.includes('报告问题')) as HTMLButtonElement).click();
    expect(reported).toEqual(['DATA.NOT_FOUND']);
  });

  it('5xx 没有 solution 时显示通用步骤与请求号', () => {
    const { el } = render([{ kind: 'server', status: 500, message: '系统内部错误', requestId: 'R500', critical: true }]);
    expect(el.querySelectorAll('ol > li').length).toBe(3);
    expect(el.querySelector('code')?.textContent).toBe('R500');
  });

  it('多条错误：标题为数量，每条分节显示；追加后刷新', () => {
    const { el, list, fixture } = render([full, { ...full, message: '另一个', requestId: 'R8' }]);
    expect(el.querySelectorAll('section').length).toBe(2);
    expect(el.querySelector('h2')?.textContent).toContain('2');
    list.update(l => [...l, { ...full, message: '第三个', requestId: 'R9' }]);
    fixture.detectChanges();
    expect(el.querySelectorAll('section').length).toBe(3);
  });

  it('界面语言切换后固定文案随之切换', () => {
    const { el, fixture, translate, langChange } = render([full]);
    expect(el.textContent).toContain('解决步骤');
    translate.currentLang = 'en_US';
    langChange.next(undefined);
    fixture.detectChanges();
    expect(el.textContent).toContain('Steps to resolve');
    expect(el.textContent).not.toContain('解决步骤');
  });

  it('暗色主题取自 themeService.getTheme()', () => {
    const light = render([full]);
    expect(light.el.classList.contains('dui-error-dialog--dark')).toBe(false);
  });

  it('暗色主题：加暗色类', () => {
    const dark = render([full], undefined, 'dark');
    dark.fixture.detectChanges();
    expect(dark.el.classList.contains('dui-error-dialog--dark')).toBe(true);
  });
});

describe('ar_SA（RTL）：对话框样式只用逻辑属性', () => {
  it('组件源码里没有物理方向 CSS', () => {
    const src = fs.readFileSync(path.join(__dirname, 'error-dialog.component.ts'), 'utf8');
    const styles = src.slice(src.indexOf('styles:'));
    const physical = /(margin|padding|border)-(left|right|top|bottom)|(^|[\s;{])(left|right|top|bottom)\s*:|text-align\s*:\s*(left|right)|float\s*:|(^|[\s;{])(width|height|max-width|min-width|max-height)\s*:/m;
    expect(styles).not.toMatch(physical);
    expect(styles).toContain('padding-inline-start');
  });
});
