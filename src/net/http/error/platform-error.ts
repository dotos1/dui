/**
 * @fileoverview 平台统一错误模型 `PlatformError`，由 `parseHttpError` 产出，供拦截器、提示服务、ErrorHandler 共用。
 * @zh 平台统一错误模型。
 */

import { HttpContextToken } from '@angular/common/http';

/**
 * 错误分类。
 * @zh 错误分类：business 业务拒绝；auth 未登录/过期；forbidden 无权限；network 断网/跨域/不可达；timeout 超时；server 5xx；client 其它 4xx 或前端自身异常。
 */
export type PlatformErrorKind = 'business' | 'auth' | 'forbidden' | 'network' | 'timeout' | 'server' | 'client';

/**
 * 参数类错误的字段明细（统一错误体 `details[]`）。
 * @zh 参数类错误的字段明细。
 */
export interface PlatformErrorDetail {
  /** 字段名（后端已渲染的显示名或原始字段名） */
  field?: string;
  /** 字段名翻译键（如 `field.wellId`），前端有对应译文时优先用 */
  fieldKey?: string;
  code?: string;
  message?: string;
  /** 期望值 / 格式（已脱敏截断） */
  expected?: string;
  /** 实际值（已脱敏截断） */
  actual?: string;
  /** 怎么改 */
  hint?: string;
  /** 怎么改的翻译键 */
  hintKey?: string;
}

/**
 * 平台统一错误。`message` 是可直接展示给用户的文案，永远不是 Angular 的 `HttpErrorResponse.message`。
 * @zh 平台统一错误。
 */
export interface PlatformError {
  kind: PlatformErrorKind;
  /** HTTP 状态码；断网 / 非 HTTP 错误为 0 */
  status: number;
  /** 字符串错误码（如 `DATA.NOT_FOUND`）；服务端没给则为空 */
  code?: string;
  /** 兼容期 aios 的数字 code */
  legacyCode?: number;
  /** 可直接展示的文案 */
  message: string;
  /** 服务端原始 `message`（日志/上报用，不一定展示） */
  serverMessage?: string;
  messageKey?: string;
  messageArgs?: unknown[];
  details?: PlatformErrorDetail[];
  /** 一句话下一步建议 */
  hint?: string;
  hintKey?: string;
  /** 整改指南：有序步骤（已去掉「1.」之类的序号前缀，由有序列表自行编号）。数组与换行字符串两种来源都归一为数组 */
  solution?: string[];
  solutionKey?: string;
  /** 帮助文档链接（只保留 http(s) 与站内相对路径） */
  helpUrl?: string;
  /** 请求号（body.request_id 或响应头 X-Request-ID） */
  requestId?: string;
  /** 是否需要对话框级别展示（5xx） */
  critical: boolean;
}

/**
 * 请求级开关：设为 true 表示该请求的错误由页面自己处理，全局拦截器不弹提示（仍会进请求环形缓冲）。
 * 用法：`http.get(url, { context: new HttpContext().set(SKIP_GLOBAL_ERROR, true) })`
 * @zh 请求级开关：页面自理错误，全局不弹。
 */
export const SKIP_GLOBAL_ERROR = new HttpContextToken<boolean>(() => false);

/**
 * 去掉 URL 查询串中敏感参数的值（token / ticket / captcha / code / password / secret 等）和 hash。
 * 供请求环形缓冲、Profiler、ErrorHandler 采集 router.url 时共用。
 * @zh 脱敏 URL 查询串。
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }
  const noHash = url.split('#')[0];
  const qi = noHash.indexOf('?');
  if (qi < 0) {
    return noHash;
  }
  const query = noHash.slice(qi + 1)
    .split('&')
    .map(pair => {
      const ei = pair.indexOf('=');
      if (ei < 0) {
        return pair;
      }
      const name = pair.slice(0, ei);
      return SENSITIVE_PARAM.test(safeDecode(name)) ? `${name}=***` : pair;
    })
    .join('&');
  return noHash.slice(0, qi + 1) + query;
}

const SENSITIVE_PARAM = /(token|ticket|captcha|code|passw(or)?d|pwd|secret)/i;

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
