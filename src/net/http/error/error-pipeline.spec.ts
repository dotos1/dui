import { HttpClient, HttpContext, provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from '@dotos1/dui/common/toastr';
import { ErrorInterceptor, ERROR_INTERCEPTOR_OPTIONS } from '../interceptors/error.interceptor';
import { ErrorNotifyService } from './error-notify.service';
import { ErrorReportPayload, PlatformErrorHandler } from './platform-error-handler';
import { SKIP_GLOBAL_ERROR, sanitizeUrl } from './platform-error';
import { RequestRingBuffer, RequestRingBufferInterceptor } from './request-ring-buffer';

// 同时兼容 karma(jasmine) 与 jest：不用 jest.* / jasmine.* 专有 API，手写桩
function fakeToastr() {
  const calls: string[] = [];
  return { calls, error: (m: string) => { calls.push(m); } };
}
function fakeDialog() {
  const calls: { data: { error: { requestId?: string }; onReport?: unknown } }[] = [];
  return { calls, open: (_c: unknown, cfg: { data: { error: { requestId?: string }; onReport?: unknown } }) => { calls.push(cfg); } };
}

function setup(options?: object) {
  const toastr = fakeToastr();
  const dialog = fakeDialog();
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
      { provide: HTTP_INTERCEPTORS, useClass: RequestRingBufferInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      { provide: ToastrService, useValue: toastr },
      { provide: MatDialog, useValue: dialog },
      ...(options ? [{ provide: ERROR_INTERCEPTOR_OPTIONS, useValue: options }] : []),
    ],
  });
  return {
    http: TestBed.inject(HttpClient),
    ctl: TestBed.inject(HttpTestingController),
    toastr, dialog,
    buffer: TestBed.inject(RequestRingBuffer),
    notify: TestBed.inject(ErrorNotifyService),
  };
}

describe('ErrorInterceptor + ErrorNotifyService', () => {
  it('500：只弹一次对话框（带请求号），不弹 toast；错误原样抛给调用方', () => {
    const { http, ctl, toastr, dialog } = setup();
    let caught: unknown;
    http.post('/api/a', {}).subscribe({ error: e => (caught = e) });
    ctl.expectOne('/api/a').flush({ success: false, code: 'SYS.INTERNAL', message: '系统内部错误，请将请求号 R5 提供给管理员', request_id: 'R5' }, { status: 500, statusText: 'x' });
    expect(dialog.calls.length).toBe(1);
    expect(dialog.calls[0].data.error.requestId).toBe('R5');
    expect(toastr.calls.length).toBe(0);
    expect((caught as { status: number }).status).toBe(500);
  });

  it('403：toast 一次「无权访问」', () => {
    const { http, ctl, toastr } = setup();
    http.post('/api/a', {}).subscribe({ error: () => undefined });
    ctl.expectOne('/api/a').flush(null, { status: 403, statusText: 'Forbidden' });
    expect(toastr.calls.length).toBe(1);
    expect(toastr.calls[0]).toBe('无权访问');
  });

  it('状态 0：toast 一次，且不含 Angular 英文 / URL', () => {
    const { http, ctl, toastr } = setup();
    http.post('/api/a?token=zzz', {}).subscribe({ error: () => undefined });
    ctl.expectOne(r => r.url.startsWith("/api/a")).error(new ProgressEvent('error'));
    expect(toastr.calls.length).toBe(1);
    expect(toastr.calls[0]).not.toMatch(/Http failure|\/api\/a|zzz/);
  });

  it('2xx + success:false：默认不弹（与改前一致）', () => {
    const { http, ctl, toastr } = setup();
    http.post('/api/a', {}).subscribe();
    ctl.expectOne('/api/a').flush({ success: false, message: '井号重复' });
    expect(toastr.calls.length).toBe(0);
  });

  it('2xx + success:false：notifyOnSuccessFalse 开启后只弹一次，调用方仍收到响应', () => {
    const { http, ctl, toastr } = setup({ notifyOnSuccessFalse: true });
    let got: unknown;
    http.post('/api/a', {}).subscribe(v => (got = v));
    ctl.expectOne('/api/a').flush({ success: false, message: '井号重复' });
    expect(toastr.calls.length).toBe(1);
    expect(toastr.calls[0]).toBe('井号重复');
    expect(got).toEqual({ success: false, message: '井号重复' });
  });

  it('401：默认不弹（可能正在刷新令牌）；notifyOn401 时弹一次「登录已过期」', () => {
    let s = setup();
    s.http.post('/api/a', {}).subscribe({ error: () => undefined });
    s.ctl.expectOne('/api/a').flush(null, { status: 401, statusText: 'x' });
    expect(s.toastr.calls.length).toBe(0);
    TestBed.resetTestingModule();
    s = setup({ notifyOn401: true });
    s.http.post('/api/a', {}).subscribe({ error: () => undefined });
    s.ctl.expectOne('/api/a').flush(null, { status: 401, statusText: 'x' });
    expect(s.toastr.calls.length).toBe(1);
    expect(s.toastr.calls[0]).toBe('登录已过期，请重新登录');
  });

  it('SKIP_GLOBAL_ERROR：页面自理，全局不弹（错误与 2xx+success:false 都豁免）', () => {
    let { http, ctl, toastr, dialog } = setup();
    const context = new HttpContext().set(SKIP_GLOBAL_ERROR, true);
    TestBed.resetTestingModule();
    ({ http, ctl, toastr, dialog } = setup({ notifyOnSuccessFalse: true }));
    http.post('/api/a', {}, { context }).subscribe({ error: () => undefined });
    ctl.expectOne('/api/a').flush(null, { status: 500, statusText: 'x' });
    http.post('/api/b', {}, { context }).subscribe();
    ctl.expectOne('/api/b').flush({ success: false, message: 'x' });
    expect(toastr.calls.length).toBe(0);
    expect(dialog.calls.length).toBe(0);
  });

  it('GET 5xx 重试一次后仍失败：只弹一次', () => {
    const { http, ctl, dialog } = setup();
    http.get('/api/a').subscribe({ error: () => undefined });
    ctl.expectOne('/api/a').flush(null, { status: 503, statusText: 'x' });
    ctl.expectOne('/api/a').flush(null, { status: 503, statusText: 'x' });
    expect(dialog.calls.length).toBe(1);
  });

  it('3 秒内相同指纹去重；窗口过后再弹', () => {
    const { http, ctl, toastr, notify } = setup();
    const fail = () => {
      http.post('/api/a', {}).subscribe({ error: () => undefined });
      ctl.expectOne('/api/a').flush({ success: false, message: '同一个错' }, { status: 400, statusText: 'x' });
    };
    fail();
    fail();
    expect(notify.dedupeMs).toBe(3000);
    expect(toastr.calls.length).toBe(1);
    notify.dedupeMs = 0; // 等价于窗口已过
    fail();
    expect(toastr.calls.length).toBe(2);
  });

  it('不同文案不互相去重', () => {
    const { notify, toastr } = setup();
    notify.notify({ success: false, message: 'A' });
    notify.notify({ success: false, message: 'B' });
    expect(toastr.calls.length).toBe(2);
  });

  it('对话框带 onReport 钩子（设置后才有）', () => {
    const { notify, dialog } = setup();
    const hook = () => undefined;
    notify.show({ kind: 'server', status: 500, message: 'm', requestId: 'R', critical: true });
    expect(dialog.calls[0].data.onReport).toBeUndefined();
    notify.dedupeMs = 0;
    notify.reportHandler = hook;
    notify.show({ kind: 'server', status: 500, message: 'm', requestId: 'R', critical: true });
    expect(dialog.calls[1].data.onReport).toBe(hook);
  });
});

describe('RequestRingBuffer', () => {
  it('只留最近 20 条；URL 敏感参数值被替换；不存请求体；记录状态/耗时/request_id', () => {
    const { http, ctl, buffer } = setup();
    for (let i = 0; i < 23; i++) {
      http.post(`/api/p${i}?token=SECRET&x=1&Ticket=T&captcha=c&code=9&password=p&secret=s&name=ok`, { password: 'BODYPW' }).subscribe({ error: () => undefined });
      ctl.expectOne(r => r.url.startsWith(`/api/p${i}?`)).flush(i === 22 ? { request_id: 'RID' } : {}, { status: i === 22 ? 400 : 200, statusText: 'x' });
    }
    const snap = buffer.snapshot();
    expect(snap.length).toBe(20);
    expect(snap[0].url).toContain('/api/p3');
    const last = snap[19];
    expect(last.status).toBe(400);
    expect(last.requestId).toBe('RID');
    expect(last.method).toBe('POST');
    expect(typeof last.durationMs).toBe('number');
    const dump = JSON.stringify(snap);
    expect(dump).not.toMatch(/SECRET|BODYPW|=T&|=c&|=9&|=p&|=s&/);
    expect(dump).toContain('x=1');
    expect(dump).toContain('name=ok');
    expect(Object.keys(last)).not.toContain('body');
  });

  it('sanitizeUrl：去 hash，保留非敏感参数', () => {
    expect(sanitizeUrl('/a?access_token=1&b=2#frag')).toBe('/a?access_token=***&b=2');
    expect(sanitizeUrl('/a')).toBe('/a');
    expect(sanitizeUrl(null)).toBe('');
  });
});

describe('PlatformErrorHandler', () => {
  it('未捕获异常走 ErrorNotifyService 一次，并把 router.url（脱敏）与最近请求交给 report', () => {
    const toastr = fakeToastr();
    TestBed.configureTestingModule({
      providers: [
        { provide: ToastrService, useValue: toastr },
        { provide: MatDialog, useValue: fakeDialog() },
        { provide: Router, useValue: { url: '/p?ticket=ABC&a=1' } },
      ],
    });
    TestBed.inject(RequestRingBuffer).record({ time: 1, method: 'GET', url: '/x', status: 200, durationMs: 3 });
    const reports: unknown[] = [];
    class H extends PlatformErrorHandler { override report(p: ErrorReportPayload) { reports.push(p); } }
    const h = new H(TestBed.inject(Injector));
    const origError = console.error;
    console.error = () => undefined;
    try {
      h.handleError(new TypeError('boom is not a function'));
      h.handleError({ rejection: new TypeError('boom is not a function') });
    } finally {
      console.error = origError;
    }
    expect(toastr.calls.length).toBe(1);
    expect(toastr.calls[0]).not.toContain('boom');
    const p = reports[0] as { url: string; recentRequests: unknown[]; message: string };
    expect(p.url).toBe('/p?ticket=***&a=1');
    expect(p.recentRequests.length).toBe(1);
    expect(p.message).toContain('boom');
    expect(reports.length).toBe(2);
  });
});
