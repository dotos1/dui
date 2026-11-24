/**
 * @fileoverview 错误提示统一出口 `ErrorNotifyService`：toast / 对话框分级，3 秒内相同指纹去重。
 * @zh 错误提示统一出口。
 */

import { Injectable, Injector, NgZone, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from '@dotos1/dui/common/toastr';
import { TranslationService } from '@dotos1/dui/translator';
import { ErrorDialogComponent } from './error-dialog.component';
import { ErrorTranslate, errorText, parseHttpError, renderPlatformError } from './parse-http-error';
import { PlatformError } from './platform-error';

/** 报告问题钩子（S5 接上报接口时由宿主设置） */
export type ErrorReportHandler = (error: PlatformError) => void;

/**
 * 错误提示统一出口。拦截器、ErrorHandler、页面都应通过它弹错误，不要直接 `toastr.error(error.message)`。
 *
 * - 对话框：5xx，以及带整改指南（`solution`）或字段明细（`details`）的错误（所有 4xx 定制错误）。
 *   依次显示 标题 → 下一步 → 解决步骤 → 字段问题 → 帮助文档 → 请求号（可复制）→「报告问题」（设置了钩子时）。
 *   对话框打开期间又来的错误合并进同一个对话框分条显示，不叠多个对话框。
 * - toast：只留给没有任何指南的轻量提示。
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
  /** 当前对话框里显示的错误（对话框打开期间追加） */
  private readonly dialogErrors = signal<PlatformError[]>([]);
  private dialogRef?: MatDialogRef<ErrorDialogComponent>;

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
    this.zone.run(() => (this.useDialog(error) ? this.showInDialog(error) : this.openToast(error)));
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

  /** 哪些错误用对话框：5xx，或带整改指南 / 字段明细；子类可覆盖 */
  protected useDialog(error: PlatformError): boolean {
    return error.critical || !!error.solution?.length || !!error.solutionKey || !!error.details?.length;
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
    const r = renderPlatformError(error, this.translate);
    const text = r.hint && !r.message.includes(r.hint) ? `${r.message} ${r.hint}` : r.message;
    toastr.error(text);
  }

  private showInDialog(error: PlatformError): void {
    if (this.dialogRef) {
      // 对话框已开：合并进去，不再叠一个
      this.dialogErrors.update(list => [...list, error]);
      return;
    }
    this.dialogErrors.set([error]);
    const ref = this.injector.get(MatDialog).open(ErrorDialogComponent, {
      role: 'alertdialog',
      autoFocus: 'dialog',
      restoreFocus: true,
      maxWidth: '95vw',
      data: { errors: this.dialogErrors.asReadonly(), onReport: this.reportHandler },
    });
    this.dialogRef = ref;
    ref?.afterClosed?.().subscribe(() => {
      if (this.dialogRef === ref) {
        this.dialogRef = undefined;
        this.dialogErrors.set([]);
      }
    });
    if (!ref?.afterClosed) {
      this.dialogRef = undefined;
    }
  }
}

function isPlatformError(e: unknown): e is PlatformError {
  const o = e as PlatformError;
  return !!o && typeof o === 'object' && typeof o.message === 'string' && typeof o.kind === 'string' && typeof o.critical === 'boolean';
}
