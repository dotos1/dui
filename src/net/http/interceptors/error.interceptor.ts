/**
 * @fileoverview Module `src/net/http/interceptors/error.interceptor.ts` providing error interceptor definitions and implementation.
 * @zh 模块文件 `src/net/http/interceptors/error.interceptor.ts`，提供错误拦截器相关的定义与实现。
 */

import { Injectable, InjectionToken, Injector, Optional, Inject } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { TranslationService } from "@dotos1/dui/translator";
import { ErrorNotifyService } from "../error/error-notify.service";
import { parseHttpError, parseSuccessFalse } from "../error/parse-http-error";
import { SKIP_GLOBAL_ERROR } from "../error/platform-error";

/**
 * ErrorInterceptor 配置。
 * @zh ErrorInterceptor 配置。
 */
export interface ErrorInterceptorOptions {
  /**
   * 收到 401 时是否直接提示「登录已过期」，默认 false。
   * 401 常有「刷新令牌后重试」的恢复路径，此时提示是误报；宿主在刷新失败、跳锁屏之前调用
   * `ErrorNotifyService.sessionExpired()` 即可。若宿主没有刷新逻辑，设为 true。
   */
  notifyOn401?: boolean;
  /**
   * 2xx + success:false 是否全局提示，默认 false（与改前行为一致：不弹）。
   * 迁移顺序：宿主页面先加 SKIP_GLOBAL_ERROR 或清理自弹，再打开此开关，否则会双弹。
   */
  notifyOnSuccessFalse?: boolean;
}

/**
 * ErrorInterceptor 配置令牌。
 * @zh ErrorInterceptor 配置令牌。
 */
export const ERROR_INTERCEPTOR_OPTIONS = new InjectionToken<ErrorInterceptorOptions>('ERROR_INTERCEPTOR_OPTIONS');

/** 界面语言请求头 */
export const LANG_HEADER = 'X-Dotos-Lang';

/** 相对地址或同源才带语言头（跨域请求带自定义头会触发预检，且不该把界面语言发给第三方） */
function isSameOriginUrl(url: string): boolean {
  if (!/^(https?:)?\/\//i.test(url)) {
    return true;
  }
  try {
    return typeof location !== 'undefined' && new URL(url, location.href).origin === location.origin;
  } catch {
    return false;
  }
}

/** 已提示过的错误对象（同一个错误经多层拦截器 / 重试只提示一次） */
const handled = new WeakSet<object>();

/**
 * Injectable Angular service `ErrorInterceptor` managing error interceptor state and operations in `src/net/http/interceptors`.
 * 统一错误拦截：用 `parseHttpError` 解析后交给 `ErrorNotifyService`，绝不展示 Angular 的 `HttpErrorResponse.message`。
 * 403 统一「无权访问」；请求带 `SKIP_GLOBAL_ERROR` 上下文时由页面自理；2xx + success:false 同样识别并提示一次。
 * 错误对象原样继续抛出，调用方的 error 回调不受影响。
 * @zh 可注入的 Angular 服务 `ErrorInterceptor`，统一解析并提示 HTTP 错误。
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * Creates an instance of `ErrorInterceptor` and initializes its dependencies and internal state.
   * @zh 创建 `ErrorInterceptor` 实例，并初始化其依赖项与内部状态。
   * @param injector - 注入器（惰性取 ErrorNotifyService，避免循环依赖）
   * @param options - 可选配置 / optional options
   */
  constructor(
    private injector: Injector,
    @Optional() @Inject(ERROR_INTERCEPTOR_OPTIONS) private options?: ErrorInterceptorOptions,
  ) { }

  /**
   * Executes `intercept` to handle intercept.
   * @zh 执行 `intercept`，用于拦截。
   * @param req - req parameter (`HttpRequest<unknown>`) / 请求参数（`HttpRequest<unknown>`）
   * @param next - next parameter (`HttpHandler`) / 下一个参数（`HttpHandler`）
   * @returns Result of type `Observable<HttpEvent<unknown>>` / 类型为 `Observable<HttpEvent<unknown>>` 的返回值
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    req = this.withLangHeader(req);
    // 历史约定：URL 含 timeout 的请求（轮询类）不重试也不提示
    if (req.url.indexOf('timeout') !== -1) {
      return next.handle(req);
    }
    const skip = req.context.get(SKIP_GLOBAL_ERROR);
    const isIdempotent = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
    let retried = false;
    return next.handle(req).pipe(
      tap(event => {
        if (!skip && event instanceof HttpResponse && this.options?.notifyOnSuccessFalse === true) {
          try {
            const failure = parseSuccessFalse(event.body, event.status, event.headers, { translate: this.notify.translate });
            if (failure) {
              this.notify.show(failure);
            }
          } catch (e) {
            console.error('[ErrorInterceptor] notify failed', e);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (!retried && isIdempotent && !(error.status >= 400 && error.status < 500)) {
          retried = true;
          return next.handle(req);
        }
        return throwError(() => error);
      }),
      catchError((error: unknown) => {
        if (!skip && !isHandled(error)) {
          try {
            this.handle(error);
          } catch (e) {
            // 提示自身出错不能吞掉原始错误：调用方必须仍收到原 error
            console.error('[ErrorInterceptor] notify failed', e);
          }
        }
        return throwError(() => error);
      })
    );
  }

  /** 给发往后端（相对地址或同源）的请求加 `X-Dotos-Lang: <当前界面语言>`，后端据此渲染错误文案 */
  private withLangHeader(req: HttpRequest<unknown>): HttpRequest<unknown> {
    if (req.headers.has(LANG_HEADER) || !isSameOriginUrl(req.url)) {
      return req;
    }
    const lang = this.currentLang();
    return lang ? req.clone({ setHeaders: { [LANG_HEADER]: lang } }) : req;
  }

  private currentLang(): string | undefined {
    try {
      const ts = this.injector.get(TranslationService, null);
      return ts?.translate?.currentLang || ts?.userLang || undefined;
    } catch {
      // 宿主没配翻译：不带该头，由后端按 Accept-Language / 默认语言
      return undefined;
    }
  }

  private get notify(): ErrorNotifyService {
    return this.injector.get(ErrorNotifyService);
  }

  private handle(error: unknown): void {
    if (error && typeof error === 'object') {
      handled.add(error);
    }
    const pe = parseHttpError(error, { translate: this.notify.translate });
    if (pe.status === 401) {
      if (this.options?.notifyOn401) {
        this.notify.sessionExpired();
      }
      return;
    }
    this.notify.show(pe);
  }
}

function isHandled(error: unknown): boolean {
  return !!error && typeof error === 'object' && handled.has(error);
}
