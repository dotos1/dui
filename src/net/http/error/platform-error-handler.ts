/**
 * @fileoverview `PlatformErrorHandler`：Angular `ErrorHandler` 基类，把未捕获异常走统一提示，并预留上报钩子。
 * @zh 平台全局 ErrorHandler 基类。
 */

import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorNotifyService } from './error-notify.service';
import { parseHttpError } from './parse-http-error';
import { PlatformError, sanitizeUrl } from './platform-error';
import { RequestRingBuffer, RequestTraceEntry } from './request-ring-buffer';

/** 交给 `report()` 的上报内容（S5 上报接口的数据来源；不含请求体与敏感参数值） */
export interface ErrorReportPayload {
  time: number;
  /** 脱敏后的 router.url */
  url: string;
  name: string;
  /** 错误原文（给开发看，已截断；不展示给用户） */
  message: string;
  /** 堆栈，截断到 4KB */
  stack?: string;
  /** 解析后的平台错误（HTTP 错误才有） */
  platformError?: PlatformError;
  /** 最近 20 条请求 */
  recentRequests: RequestTraceEntry[];
}

const MAX_STACK = 4096;
const MAX_MESSAGE = 1000;

/**
 * 全局 ErrorHandler 基类。宿主注册：`{ provide: ErrorHandler, useClass: PlatformErrorHandler }`，
 * 或继承后覆盖 `report(payload)` 接上报接口（S5）。
 *
 * - 已由 HTTP 拦截器提示过的 `HttpErrorResponse`（未被页面捕获而冒到顶层）只记录不重复弹。
 * - 其它异常通过 `ErrorNotifyService` 提示（带去重），文案是通用「操作失败」，不暴露异常原文。
 * @zh 全局 ErrorHandler 基类。
 */
@Injectable({ providedIn: 'root' })
export class PlatformErrorHandler implements ErrorHandler {
  constructor(protected readonly injector: Injector) {}

  handleError(error: unknown): void {
    const raw = unwrap(error);
    // eslint-disable-next-line no-console
    console.error(raw);
    try {
      if (!(raw instanceof HttpErrorResponse)) {
        const notify = this.injector.get(ErrorNotifyService);
        notify.notify(parseHttpError(raw, { translate: notify.translate }));
      }
      this.report(this.buildPayload(raw));
    } catch (e) {
      // 错误处理自身出错时不能再抛，否则会递归
      // eslint-disable-next-line no-console
      console.error('[PlatformErrorHandler] failed', e);
    }
  }

  /** 上报钩子，默认什么都不做；S5 覆盖它把 payload 发往上报接口（失败须静默） */
  report(payload: ErrorReportPayload): void {
    void payload;
  }

  /** 组装上报内容 */
  protected buildPayload(raw: unknown): ErrorReportPayload {
    const e = raw as { name?: string; message?: string; stack?: string };
    const router = this.injector.get(Router, null);
    const buffer = this.injector.get(RequestRingBuffer, null);
    return {
      time: Date.now(),
      url: sanitizeUrl(router?.url),
      name: String(e?.name ?? typeof raw),
      message: String(raw instanceof HttpErrorResponse ? `HTTP ${raw.status}` : (e?.message ?? raw)).slice(0, MAX_MESSAGE),
      stack: typeof e?.stack === 'string' ? e.stack.slice(0, MAX_STACK) : undefined,
      platformError: raw instanceof HttpErrorResponse ? parseHttpError(raw) : undefined,
      recentRequests: buffer ? buffer.snapshot() : [],
    };
  }
}

/** Angular 会把 Promise 拒绝包成 `{ rejection }`，取出真实原因 */
function unwrap(error: unknown): unknown {
  const r = (error as { rejection?: unknown })?.rejection;
  return r !== undefined ? r : error;
}
