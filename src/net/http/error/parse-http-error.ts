/**
 * @fileoverview `parseHttpError`：把任何形状的错误解析成 `PlatformError`。
 * @zh 把 HttpErrorResponse / 统一错误体 / 老式 {success:false} / aios Result / 2xx+success:false / 断网 / 超时 / 普通 Error 解析成统一的 `PlatformError`。
 */

import { PlatformError, PlatformErrorDetail, PlatformErrorKind } from './platform-error';

/** 翻译函数：返回译文；找不到时返回 key 本身或空串（与 TranslationService.instant 行为一致） */
export type ErrorTranslate = (key: string, params?: Record<string, unknown>) => string;

/** parseHttpError 的可选参数 */
export interface ParseHttpErrorOptions {
  /** 翻译函数（一般传 `TranslationService.instant`）。不传或译不出来时用内置中文兜底 */
  translate?: ErrorTranslate;
  /** 是否在线，默认读 navigator.onLine */
  online?: boolean;
}

/** 内置兜底文案（i18n 未加载时用；与 i18n/dui/zh_CN.json 的 ERROR.* 一致） */
export const ERROR_FALLBACK_TEXT: Record<string, string> = {
  'ERROR.UNKNOWN': '操作失败，请稍后重试',
  'ERROR.NETWORK_OFFLINE': '网络已断开，请检查网络连接后重试',
  'ERROR.UNREACHABLE': '无法连接到服务器，请检查网络；如持续出现请联系管理员',
  'ERROR.TIMEOUT': '请求超时，请稍后重试',
  'ERROR.BAD_REQUEST': '请求参数有误，请检查后重试',
  'ERROR.CLIENT': '请求未能完成，请检查后重试',
  'ERROR.SESSION_EXPIRED': '登录已过期，请重新登录',
  'ERROR.FORBIDDEN': '无权访问',
  'ERROR.NOT_FOUND': '请求的内容不存在',
  'ERROR.CONFLICT': '数据已被修改或存在冲突，请刷新后重试',
  'ERROR.TOO_MANY': '操作过于频繁，请稍后重试',
  'ERROR.SERVER': '系统内部错误，请稍后重试；如持续出现请联系管理员',
  'ERROR.SERVER_WITH_ID': '系统内部错误，请将请求号 {{requestId}} 提供给管理员',
  'ERROR.CHUNK': '页面资源加载失败，请刷新页面后重试',
  'ERROR.TITLE': '出错了',
  'ERROR.REQUEST_ID': '请求号',
  'ERROR.COPY_REQUEST_ID': '复制请求号',
  'ERROR.COPIED': '已复制',
  'ERROR.REPORT': '报告问题',
  'ERROR.CLOSE': '关闭',
};

/**
 * 取一条 i18n 文案：先走传入的翻译函数，译不出来（空或返回 key）用内置兜底，再替换 `{{name}}`。
 * @zh 取 i18n 文案。
 */
export function errorText(key: string, params?: Record<string, unknown>, translate?: ErrorTranslate): string {
  let text = '';
  try {
    text = translate ? translate(key, params) : '';
  } catch {
    text = '';
  }
  if (!text || text === key) {
    text = ERROR_FALLBACK_TEXT[key] ?? '';
  }
  return fill(text, params);
}

function fill(text: string, params?: Record<string, unknown>): string {
  if (!params || !text) {
    return text;
  }
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m: string, k: string) => (k in params ? String(params[k]) : m));
}

/** 把后端 message_args（位置参数）套进 `{0}` / `{{0}}` 占位符 */
function fillPositional(text: string, args: unknown[]): string {
  return text.replace(/\{\{\s*(\d+)\s*\}\}|\{(\d+)\}/g, (m: string, a?: string, b?: string) => {
    const i = Number(a ?? b);
    return i < args.length ? String(args[i]) : m;
  });
}

const ANGULAR_HTTP_FAILURE = /^Http failure/i;

interface HttpErrorLike {
  status?: number;
  statusText?: string;
  error?: unknown;
  headers?: { get(name: string): string | null };
  name?: string;
  url?: string | null;
}

/**
 * 解析任意错误为 `PlatformError`。绝不把 Angular 的 `HttpErrorResponse.message`（英文 + URL）当作展示文案。
 *
 * 文案优先级：message_key 翻译（带 message_args）→ body.message → 按状态码的 i18n 兜底。
 * 请求号：body.request_id（兼容 requestId）→ 响应头 X-Request-ID。
 *
 * @param err HttpErrorResponse、成功响应体（2xx + success:false）、Error、字符串等
 * @zh 解析任意错误。
 */
export function parseHttpError(err: unknown, options: ParseHttpErrorOptions = {}): PlatformError {
  const t = (key: string, params?: Record<string, unknown>) => errorText(key, params, options.translate);

  // 字符串：当作已成文案（如 throwError('xxx')），但过滤 Angular 的英文拼接
  if (typeof err === 'string') {
    const msg = err.trim();
    return base('client', 0, msg && !ANGULAR_HTTP_FAILURE.test(msg) ? msg : t('ERROR.UNKNOWN'));
  }
  if (err == null || typeof err !== 'object') {
    return base('client', 0, t('ERROR.UNKNOWN'));
  }

  const e = err as HttpErrorLike;
  const isHttp = typeof e.status === 'number' && ('error' in e || 'headers' in e || 'statusText' in e);

  // 非 HTTP 错误：Error / TimeoutError / 其它对象
  if (!isHttp) {
    if (e.name === 'TimeoutError') {
      return base('timeout', 408, t('ERROR.TIMEOUT'));
    }
    if (looksLikeBody(err)) {
      return fromBody(err as Record<string, unknown>, 0, undefined, t, options);
    }
    if (isChunkLoadError(err)) {
      return base('client', 0, t('ERROR.CHUNK'));
    }
    return base('client', 0, t('ERROR.UNKNOWN'));
  }

  const status = e.status as number;
  const headerRequestId = e.headers?.get?.('X-Request-ID') ?? undefined;

  if (status === 0) {
    const online = options.online ?? (typeof navigator === 'undefined' ? true : navigator.onLine !== false);
    return base('network', 0, t(online ? 'ERROR.UNREACHABLE' : 'ERROR.NETWORK_OFFLINE'), headerRequestId);
  }

  const body = coerceBody(e.error);
  if (body) {
    return fromBody(body, status, headerRequestId, t, options);
  }
  return fromStatus(status, t, headerRequestId);
}

/**
 * 2xx 响应体是否表示业务失败：`success === false`，或 aios Result（无 success 字段、数字 code ≥ 400 且带 message）。
 * 是则返回解析后的 `PlatformError`，否则返回 `null`。
 * @zh 识别 2xx + 业务失败。
 */
export function parseSuccessFalse(body: unknown, status = 200, headers?: { get(name: string): string | null }, options: ParseHttpErrorOptions = {}): PlatformError | null {
  const b = coerceBody(body);
  if (!b) {
    return null;
  }
  const aiosFail = b['success'] === undefined && typeof b['code'] === 'number' && b['code'] >= 400 && b['code'] < 600 && typeof b['message'] === 'string';
  if (b['success'] !== false && !aiosFail) {
    return null;
  }
  const t = (key: string, params?: Record<string, unknown>) => errorText(key, params, options.translate);
  const pe = fromBody(b, aiosFail ? (b['code'] as number) : status, headers?.get?.('X-Request-ID') ?? undefined, t, options);
  // 2xx + success:false 一律按业务拒绝处理（不弹对话框）
  if (pe.status >= 200 && pe.status < 300) {
    pe.kind = 'business';
    pe.critical = false;
  }
  return pe;
}

function looksLikeBody(o: unknown): boolean {
  const b = o as Record<string, unknown>;
  return !(o instanceof Error) && (b['success'] === false || typeof b['message_key'] === 'string' || typeof b['request_id'] === 'string');
}

function isChunkLoadError(err: unknown): boolean {
  const e = err as { name?: string; message?: string; rejection?: unknown };
  if (e?.rejection) {
    return isChunkLoadError(e.rejection);
  }
  const text = `${e?.name ?? ''} ${e?.message ?? ''}`;
  return /ChunkLoadError|Loading chunk .* failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i.test(text);
}

/** body 可能是对象、JSON 字符串；其它（Blob、ProgressEvent、HTML 字符串）返回 null */
function coerceBody(raw: unknown): Record<string, unknown> | null {
  if (raw && typeof raw === 'object' && !isBinary(raw) && !isProgressEvent(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (s.startsWith('{')) {
      try {
        const parsed: unknown = JSON.parse(s);
        return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
      } catch {
        return null;
      }
    }
  }
  return null;
}

function isBinary(o: object): boolean {
  return (typeof Blob !== 'undefined' && o instanceof Blob) || (typeof ArrayBuffer !== 'undefined' && o instanceof ArrayBuffer);
}

function isProgressEvent(o: object): boolean {
  return typeof ProgressEvent !== 'undefined' && o instanceof ProgressEvent;
}

function base(kind: PlatformErrorKind, status: number, message: string, requestId?: string): PlatformError {
  return { kind, status, message, requestId, critical: kind === 'server' };
}

function kindOfStatus(status: number): PlatformErrorKind {
  if (status === 401) { return 'auth'; }
  if (status === 403) { return 'forbidden'; }
  if (status === 408 || status === 504) { return 'timeout'; }
  if (status >= 500) { return 'server'; }
  if (status >= 400) { return 'client'; }
  return 'business';
}

function fromStatus(status: number, t: (k: string, p?: Record<string, unknown>) => string, requestId?: string): PlatformError {
  const kind = kindOfStatus(status);
  let message: string;
  if (status === 400) { message = t('ERROR.BAD_REQUEST'); }
  else if (status === 401) { message = t('ERROR.SESSION_EXPIRED'); }
  else if (status === 403) { message = t('ERROR.FORBIDDEN'); }
  else if (status === 404) { message = t('ERROR.NOT_FOUND'); }
  else if (status === 408 || status === 504) { message = t('ERROR.TIMEOUT'); }
  else if (status === 409) { message = t('ERROR.CONFLICT'); }
  else if (status === 429) { message = t('ERROR.TOO_MANY'); }
  else if (status >= 500) {
    message = requestId ? t('ERROR.SERVER_WITH_ID', { requestId }) : t('ERROR.SERVER');
  } else if (status >= 400) { message = t('ERROR.CLIENT'); }
  else { message = t('ERROR.UNKNOWN'); }
  return base(kind, status, message, requestId);
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

function fromBody(
  body: Record<string, unknown>,
  httpStatus: number,
  headerRequestId: string | undefined,
  t: (k: string, p?: Record<string, unknown>) => string,
  options: ParseHttpErrorOptions
): PlatformError {
  // 统一体的 status 与响应行一致；响应行为 0（非 HTTP 来源）时才采用 body.status
  const status = httpStatus || (typeof body['status'] === 'number' ? (body['status'] as number) : 0);
  const requestId = str(body['request_id']) ?? str(body['requestId']) ?? headerRequestId;

  // code：统一体为字符串；兼容期 aios 数字 code + error_code 字符串
  let code: string | undefined;
  let legacyCode: number | undefined;
  if (typeof body['code'] === 'string') { code = str(body['code']); }
  else if (typeof body['code'] === 'number') { legacyCode = body['code'] as number; }
  code = code ?? str(body['error_code']) ?? str(body['errorCode']);

  const messageKey = str(body['message_key']);
  const messageArgs = Array.isArray(body['message_args']) ? (body['message_args'] as unknown[]) : undefined;
  let serverMessage = str(body['message']) ?? str(body['msg']) ?? str(body['error_description']);
  if (serverMessage && ANGULAR_HTTP_FAILURE.test(serverMessage)) {
    serverMessage = undefined;
  }

  let message: string | undefined;
  if (messageKey) {
    const params: Record<string, unknown> = {};
    (messageArgs ?? []).forEach((a, i) => (params[String(i)] = a));
    let translated = '';
    try {
      translated = options.translate ? options.translate(messageKey, params) : '';
    } catch {
      translated = '';
    }
    if (translated && translated !== messageKey) {
      message = fillPositional(fill(translated, params), messageArgs ?? []);
    }
  }
  message = message ?? serverMessage;

  const fallback = fromStatus(status || 500, t, requestId);
  if (!message) {
    message = fallback.message;
  }

  const rawDetails = body['details'];
  const details: PlatformErrorDetail[] | undefined = Array.isArray(rawDetails)
    ? rawDetails.filter((d: unknown) => !!d && typeof d === 'object').map((d: unknown) => d as PlatformErrorDetail)
    : undefined;

  const kind = status ? kindOfStatus(status) : 'business';
  return {
    kind,
    status,
    code,
    legacyCode,
    message,
    serverMessage,
    messageKey,
    messageArgs,
    details: details && details.length ? details : undefined,
    hint: str(body['hint']) ?? str(body['solution']),
    requestId,
    critical: kind === 'server',
  };
}
