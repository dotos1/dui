/**
 * @fileoverview 错误提示统一出口 `ErrorNotifyService`：toast / 对话框分级，3 秒内相同指纹去重。
 * @zh 错误提示统一出口。
 */

import { Injectable, Injector, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from '@dotos1/dui/common/toastr';
import { TranslationService } from '@dotos1/dui/translator';
import { ErrorDialogComponent } from './error-dialog.component';
import { ErrorTranslate, errorText, parseHttpError } from './parse-http-error';
import { PlatformError } from './platform-error';

/** 报告问题钩子（S5 接上报接口时由宿主设置） */
export type ErrorReportHandler = (error: PlatformError) => void;

/**
 * 错误提示统一出口。拦截器、ErrorHandler、页面都应通过它弹错误，不要直接 `toastr.error(error.message)`。
 *
 * - 5xx（`critical`）用对话框，显示请求号 + 「复制请求号」+（设置了钩子时）「报告问题」；其余用 toast。
 * - 3 秒内相同指纹（kind + status + code + 文案）只弹一次。
 * @zh 错误提示统一出口。
 */
@Injectable({ providedIn: 'root' })
export class ErrorNotifyService {
  /** 去重窗口（毫秒） */
  dedupeMs = 3000;
  /** 「报告问题」钩子；未设置时对话框不显示该按钮 */
  reportHandler?: ErrorReportHandler;

  private readonly recent = new Map<string, number>();

  constructor(private readonly injector: Injector, private readonly zone: NgZone) {}

  /** 翻译函数（TranslationService 不可用时返回 undefined，由内置中文兜底） */
  get translate(): ErrorTranslate | undefined {
    try {
      const ts = this.injector.get(TranslationService, null);
      return ts ? (key, params) => ts.instant(key, params) as string : undefined;
    } catch {
      // 宿主没配翻译（如缺 TranslateStore）：用内置中文兜底，提示链路不能因此中断
      return undefined;
    }
  }

  /** 解析任意错误并提示。返回解析结果；被去重时 `shown` 为 false */
  notify(err: unknown): { error: PlatformError; shown: boolean } {
    const error = isPlatformError(err) ? err : parseHttpError(err, { translate: this.translate });
    return { error, shown: this.show(error) };
  }

  /** 提示一个已解析的错误；返回是否真的弹了（false = 被去重） */
  show(error: PlatformError): boolean {
    if (!this.accept(error)) {
      return false;
    }
    this.zone.run(() => (this.useDialog(error) ? this.openDialog(error) : this.openToast(error)));
    return true;
  }

  /** 会话过期提示（401 刷新失败后、跳锁屏前由宿主调用；与拦截器的 401 提示共用去重） */
  sessionExpired(): boolean {
    return this.show({
      kind: 'auth',
      status: 401,
      code: 'AUTH.SESSION_EXPIRED',
      message: errorText('ERROR.SESSION_EXPIRED', undefined, this.translate),
      critical: false,
    });
  }

  /** 哪些错误用对话框；子类可覆盖 */
  protected useDialog(error: PlatformError): boolean {
    return error.critical;
  }

  private accept(error: PlatformError): boolean {
    const now = Date.now();
    for (const [k, t] of this.recent) {
      if (now - t >= this.dedupeMs) {
        this.recent.delete(k);
      }
    }
    const fp = `${error.kind}|${error.status}|${error.code ?? ''}|${error.message}`;
    if (this.recent.has(fp)) {
      return false;
    }
    this.recent.set(fp, now);
    return true;
  }

  private openToast(error: PlatformError): void {
    const toastr = this.injector.get(ToastrService);
    const text = error.hint && !error.message.includes(error.hint) ? `${error.message} ${error.hint}` : error.message;
    toastr.error(text);
  }

  private openDialog(error: PlatformError): void {
    const tr = this.translate;
    const t = (k: string) => errorText(k, undefined, tr);
    this.injector.get(MatDialog).open(ErrorDialogComponent, {
      data: {
        error,
        texts: {
          title: t('ERROR.TITLE'),
          requestId: t('ERROR.REQUEST_ID'),
          copy: t('ERROR.COPY_REQUEST_ID'),
          copied: t('ERROR.COPIED'),
          report: t('ERROR.REPORT'),
          close: t('ERROR.CLOSE'),
        },
        onReport: this.reportHandler,
      },
    });
  }
}

function isPlatformError(e: unknown): e is PlatformError {
  const o = e as PlatformError;
  return !!o && typeof o === 'object' && typeof o.message === 'string' && typeof o.kind === 'string' && typeof o.critical === 'boolean';
}
