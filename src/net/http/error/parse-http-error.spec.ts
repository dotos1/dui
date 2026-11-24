import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { errorText, parseHttpError, parseSuccessFalse, renderPlatformError } from './parse-http-error';

const http = (status: number, body: unknown, headers?: Record<string, string>) =>
  new HttpErrorResponse({
    status,
    statusText: 'x',
    url: 'http://h/api/secret?token=abc',
    error: body,
    headers: new HttpHeaders(headers ?? {}),
  });

describe('parseHttpError', () => {
  it('统一错误体：code / message / hint / details / request_id', () => {
    const pe = parseHttpError(http(404, {
      success: false, code: 'DATA.NOT_FOUND', status: 404, message: '找不到编号为 W-102 的井',
      details: [{ field: 'wellId', message: '必填' }], hint: '请确认是否已删除', request_id: 'R1'
    }));
    expect(pe.code).toBe('DATA.NOT_FOUND');
    expect(pe.message).toBe('找不到编号为 W-102 的井');
    expect(pe.hint).toBe('请确认是否已删除');
    expect(pe.details?.length).toBe(1);
    expect(pe.requestId).toBe('R1');
    expect(pe.critical).toBe(false);
  });

  it('message_key 优先，message_args 位置参数填入 {0}', () => {
    const translate = (k: string) => (k === 'error.data.notFound' ? '找不到井 {0}' : k);
    const pe = parseHttpError(http(404, { success: false, code: 'DATA.NOT_FOUND', message: 'raw', message_key: 'error.data.notFound', message_args: ['W-102'] }), { translate });
    expect(pe.message).toBe('找不到井 W-102');
  });

  it('message_key 译不出来时退到 message', () => {
    const translate = (k: string) => k;
    const pe = parseHttpError(http(400, { success: false, message: '井深必填', message_key: 'nope' }), { translate });
    expect(pe.message).toBe('井深必填');
  });

  it('老式 {success:false,message}', () => {
    const pe = parseHttpError(http(400, { success: false, message: '用户名已存在' }));
    expect(pe.message).toBe('用户名已存在');
    expect(pe.code).toBeUndefined();
  });

  it('aios Result：数字 code + error_code 字符串', () => {
    const pe = parseHttpError(http(400, { code: 400, error_code: 'PARAM.INVALID', message: '参数错误' }));
    expect(pe.legacyCode).toBe(400);
    expect(pe.code).toBe('PARAM.INVALID');
    expect(pe.message).toBe('参数错误');
  });

  it('请求号取响应头 X-Request-ID（body 没有时）', () => {
    const pe = parseHttpError(http(500, null, { 'X-Request-ID': 'HDR9' }));
    expect(pe.requestId).toBe('HDR9');
    expect(pe.critical).toBe(true);
    expect(pe.message).toContain('HDR9');
  });

  it('5xx 无体：状态码兜底，且绝不含 Angular 的 Http failure / URL', () => {
    const e = http(502, '<html>Bad Gateway</html>');
    expect(e.message).toContain('Http failure');
    const pe = parseHttpError(e);
    expect(pe.message).not.toMatch(/Http failure|http:\/\/|token=/);
    expect(pe.kind).toBe('server');
  });

  it('JSON 字符串 body 也能解析', () => {
    const pe = parseHttpError(http(400, '{"success":false,"message":"文本里的 JSON"}'));
    expect(pe.message).toBe('文本里的 JSON');
  });

  it('网络断开 status 0：在线=不可达/跨域，离线=断网', () => {
    const e = new HttpErrorResponse({ status: 0, error: new ProgressEvent('error') });
    expect(parseHttpError(e, { online: false }).message).toContain('网络已断开');
    const pe = parseHttpError(e, { online: true });
    expect(pe.kind).toBe('network');
    expect(pe.message).toContain('无法连接到服务器');
    expect(pe.message).not.toContain('Http failure');
  });

  it('超时：408 与 rxjs TimeoutError', () => {
    expect(parseHttpError(http(408, null)).kind).toBe('timeout');
    const te = Object.assign(new Error('Timeout has occurred'), { name: 'TimeoutError' });
    const pe = parseHttpError(te);
    expect(pe.kind).toBe('timeout');
    expect(pe.message).toBe('请求超时，请稍后重试');
  });

  it('401 / 403 / 404 / 409 / 429 状态码兜底', () => {
    expect(parseHttpError(http(401, null)).message).toBe('登录已过期，请重新登录');
    expect(parseHttpError(http(403, null)).message).toBe('无权访问');
    expect(parseHttpError(http(404, null)).kind).toBe('client');
    expect(parseHttpError(http(409, null)).message).toContain('冲突');
    expect(parseHttpError(http(429, null)).message).toContain('频繁');
  });

  it('普通 Error / 字符串 / null：不泄露异常原文', () => {
    expect(parseHttpError(new TypeError('x is undefined')).message).toBe('操作失败，请稍后重试');
    expect(parseHttpError('自定义文案').message).toBe('自定义文案');
    expect(parseHttpError('Http failure response for http://a: 500').message).toBe('操作失败，请稍后重试');
    expect(parseHttpError(null).message).toBe('操作失败，请稍后重试');
  });

  it('chunk 加载失败给专门文案', () => {
    const e = Object.assign(new Error('Loading chunk 12 failed.'), { name: 'ChunkLoadError' });
    expect(parseHttpError(e).message).toContain('刷新页面');
  });

  it('translate 优先于内置兜底，且带 {{requestId}}', () => {
    const translate = (k: string, p?: Record<string, unknown>) => (k === 'ERROR.SERVER_WITH_ID' ? `ID=${p?.['requestId']}` : k);
    expect(parseHttpError(http(500, { request_id: 'Q1' }), { translate }).message).toBe('ID=Q1');
    expect(errorText('ERROR.CLOSE', undefined, translate)).toBe('关闭');
  });

  it('parseSuccessFalse：2xx + success:false、aios Result 识别；正常体返回 null', () => {
    expect(parseSuccessFalse({ success: false, message: '业务拒绝', code: 'DATA.X' })?.kind).toBe('business');
    expect(parseSuccessFalse({ code: 500, message: '服务端错' })?.message).toBe('服务端错');
    expect(parseSuccessFalse({ success: true, data: [] })).toBeNull();
    expect(parseSuccessFalse({ code: 200, message: 'ok', data: 1 })).toBeNull();
    expect(parseSuccessFalse([1, 2])).toBeNull();
    expect(parseSuccessFalse(null)).toBeNull();
  });
});

describe('parseHttpError：整改指南与多语言字段', () => {
  const body = {
    success: false, code: 'DATA.NOT_FOUND', status: 404, message: '找不到编号为 W-102 的井',
    message_key: 'error.data.notFound', message_args: ['W-102'],
    hint: '请在『数据管理』确认', hint_key: 'error.data.notFound.hint',
    solution_key: 'error.data.notFound.solution',
    help_url: '/docs/user-guide/data-wells.html#not-found', request_id: 'R9',
  };

  it('solution 数组形状：去掉序号前缀', () => {
    const pe = parseHttpError(http(404, { ...body, solution: ['1. 打开数据管理', '2、若已删除可恢复', '（3）改用正确编号'] }));
    expect(pe.solution).toEqual(['打开数据管理', '若已删除可恢复', '改用正确编号']);
    expect(pe.helpUrl).toBe('/docs/user-guide/data-wells.html#not-found');
    expect(pe.hintKey).toBe('error.data.notFound.hint');
    expect(pe.solutionKey).toBe('error.data.notFound.solution');
  });

  it('solution 换行字符串形状：按行拆分、去空行与序号', () => {
    const pe = parseHttpError(http(400, { ...body, solution: '1. 第一步\n\n2. 第二步\r\n3) 第三步' }));
    expect(pe.solution).toEqual(['第一步', '第二步', '第三步']);
  });

  it('details：field / field_key / code / message / expected / actual / hint 全解析，缺字段不报错', () => {
    const pe = parseHttpError(http(400, {
      ...body,
      details: [
        { field: 'date', field_key: 'field.date', code: 'FORMAT', message: '格式不对', expected: 'yyyy-MM-dd', actual: '2026/11/23', hint: '改成横线分隔', hint_key: 'k.h' },
        { field: 'wellId' },
        'bad',
        { expected: 5, actual: false },
      ],
    }));
    expect(pe.details?.length).toBe(3);
    expect(pe.details?.[0]).toEqual({ field: 'date', fieldKey: 'field.date', code: 'FORMAT', message: '格式不对', expected: 'yyyy-MM-dd', actual: '2026/11/23', hint: '改成横线分隔', hintKey: 'k.h' });
    expect(pe.details?.[1].expected).toBeUndefined();
    expect(pe.details?.[2].expected).toBe('5');
    expect(pe.details?.[2].actual).toBe('false');
  });

  it('help_url 只留 http(s) 与站内路径，javascript: / 协议相对被丢弃', () => {
    expect(parseHttpError(http(400, { ...body, help_url: 'https://dui.dotos.com/x' })).helpUrl).toBe('https://dui.dotos.com/x');
    expect(parseHttpError(http(400, { ...body, help_url: 'javascript:alert(1)' })).helpUrl).toBeUndefined();
    expect(parseHttpError(http(400, { ...body, help_url: '//evil.com/x' })).helpUrl).toBeUndefined();
  });

  it('字段全缺：不报错，guide 字段为空', () => {
    const pe = parseHttpError(http(400, { success: false, message: 'x' }));
    expect(pe.solution).toBeUndefined();
    expect(pe.details).toBeUndefined();
    expect(pe.helpUrl).toBeUndefined();
  });

  it('renderPlatformError：有翻译键按当前语言渲染（键 + args），否则用后端文本', () => {
    const dict: Record<string, string> = {
      'error.data.notFound': 'Well {0} not found',
      'error.data.notFound.hint': 'Check Data Management',
      'error.data.notFound.solution': '1. Open Data Management\n2. Search for {0}',
      'field.date': 'Date',
    };
    const tr = (k: string, p?: Record<string, unknown>) => (dict[k] ?? k).replace(/\{(\d)\}/g, (_m, i: string) => String(p?.[i] ?? ''));
    const pe = parseHttpError(http(404, { ...body, solution: ['1. 后端步骤'], details: [{ field: '日期', field_key: 'field.date' }, { field: '井号', field_key: 'field.nope' }] }));
    const r = renderPlatformError(pe, tr);
    expect(r.message).toBe('Well W-102 not found');
    expect(r.hint).toBe('Check Data Management');
    expect(r.solution).toEqual(['Open Data Management', 'Search for W-102']);
    expect(r.details.map(d => d.label)).toEqual(['Date', '井号']);
    // 没有翻译函数：回到后端渲染文本
    const raw = renderPlatformError(pe);
    expect(raw.message).toBe('找不到编号为 W-102 的井');
    expect(raw.hint).toBe('请在『数据管理』确认');
    expect(raw.solution).toEqual(['后端步骤']);
  });
});
