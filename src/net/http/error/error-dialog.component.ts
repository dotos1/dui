/**
 * @fileoverview 错误对话框：标题 → 下一步 → 解决步骤 → 字段问题清单 → 帮助文档 → 请求号（可复制）→「报告问题」。
 * 多个错误同时到来时合并在同一个对话框里分条显示；界面语言切换时文案随之切换。
 * @zh 错误对话框组件。
 */

import { ChangeDetectionStrategy, Component, DestroyRef, Inject, Injector, Signal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Clipboard } from '@angular/cdk/clipboard';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
import { ThemeService } from '@dotos1/dui/theme';
import { TranslationService } from '@dotos1/dui/translator';
import { ErrorTranslate, errorText, renderPlatformError } from './parse-http-error';
import { PlatformError, PlatformErrorDetail } from './platform-error';

/** 对话框数据 */
export interface ErrorDialogData {
  /** 当前要显示的错误列表（服务在对话框打开期间继续追加，对话框随之刷新） */
  errors: Signal<PlatformError[]>;
  /** 提供时显示「报告问题」按钮 */
  onReport?: (error: PlatformError) => void;
}

/** 一条错误的展示模型（已按当前界面语言渲染） */
interface ErrorView {
  error: PlatformError;
  message: string;
  hint?: string;
  solution?: string[];
  details: (PlatformErrorDetail & { label: string })[];
}

/**
 * 错误对话框，由 `ErrorNotifyService` 打开。
 * 无障碍：Esc 可关闭，焦点进入对话框并在关闭后还原；解决步骤是语义化的 `<ol>`，字段问题是 `<ul>` + `<dl>`；
 * 只用逻辑 CSS 属性（ar_SA 为 RTL）。
 * @zh 错误对话框。
 */
@Component({
  selector: 'dui-error-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.dui-error-dialog--dark]': 'dark()' },
  template: `
    <h2 mat-dialog-title>{{ title() }}</h2>
    <mat-dialog-content class="dui-error-dialog__body">
      @for (v of views(); track $index) {
        <section class="dui-error-dialog__item" [attr.aria-labelledby]="'dui-err-msg-' + $index">
          @if (views().length > 1) {
            <h3 class="dui-error-dialog__message" [id]="'dui-err-msg-' + $index">{{ v.message }}</h3>
          }
          @if (v.hint) {
            <p class="dui-error-dialog__hint"><strong>{{ t('ERROR.NEXT_STEP') }}：</strong>{{ v.hint }}</p>
          }
          @if (v.solution?.length) {
            <h4 class="dui-error-dialog__heading">{{ t('ERROR.SOLUTION_STEPS') }}</h4>
            <ol class="dui-error-dialog__steps">
              @for (step of v.solution; track $index) {
                <li>{{ step }}</li>
              }
            </ol>
          }
          @if (v.details.length) {
            <h4 class="dui-error-dialog__heading">{{ t('ERROR.FIELD_ISSUES') }}</h4>
            <ul class="dui-error-dialog__fields">
              @for (d of v.details; track $index) {
                <li>
                  <strong class="dui-error-dialog__field">{{ d.label || t('ERROR.FIELD') }}</strong>
                  @if (d.message) { <span>：{{ d.message }}</span> }
                  <dl class="dui-error-dialog__kv">
                    @if (d.expected) { <dt>{{ t('ERROR.EXPECTED') }}</dt><dd>{{ d.expected }}</dd> }
                    @if (d.actual) { <dt>{{ t('ERROR.ACTUAL') }}</dt><dd>{{ d.actual }}</dd> }
                    @if (d.hint) { <dt>{{ t('ERROR.HOW_TO_FIX') }}</dt><dd>{{ d.hint }}</dd> }
                  </dl>
                </li>
              }
            </ul>
          }
          @if (v.error.helpUrl) {
            <p class="dui-error-dialog__help">
              <a [href]="v.error.helpUrl" target="_blank" rel="noopener noreferrer">{{ t('ERROR.HELP_DOC') }}<span class="dui-error-dialog__sr">{{ t('ERROR.OPENS_NEW_TAB') }}</span></a>
            </p>
          }
          @if (v.error.requestId) {
            <p class="dui-error-dialog__rid">
              <span>{{ t('ERROR.REQUEST_ID') }}：<code>{{ v.error.requestId }}</code></span>
              <button mat-button type="button" (click)="copy(v.error)">{{ copiedId() === v.error.requestId ? t('ERROR.COPIED') : t('ERROR.COPY') }}</button>
            </p>
          }
          @if (data.onReport) {
            <p class="dui-error-dialog__report">
              <button mat-button type="button" (click)="report(v.error)">{{ t('ERROR.REPORT') }}</button>
            </p>
          }
        </section>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button type="button" mat-dialog-close>{{ t('ERROR.CLOSE') }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; }
    .dui-error-dialog__body { max-inline-size: 36rem; }
    .dui-error-dialog__item { padding-block: 0.25rem 0.75rem; }
    .dui-error-dialog__item + .dui-error-dialog__item { border-block-start: 1px solid rgba(128, 128, 128, 0.35); padding-block-start: 0.75rem; }
    .dui-error-dialog--dark .dui-error-dialog__item + .dui-error-dialog__item { border-block-start-color: rgba(255, 255, 255, 0.25); }
    .dui-error-dialog__message { margin-block: 0 0.5rem; font-size: 1rem; overflow-wrap: anywhere; }
    .dui-error-dialog__hint { margin-block: 0 0.5rem; overflow-wrap: anywhere; }
    .dui-error-dialog__heading { margin-block: 0.5rem 0.25rem; font-size: 0.875rem; font-weight: 600; }
    .dui-error-dialog__steps, .dui-error-dialog__fields { margin-block: 0 0.5rem; padding-inline-start: 1.5rem; text-align: start; }
    .dui-error-dialog__steps li { margin-block-end: 0.25rem; overflow-wrap: anywhere; }
    .dui-error-dialog__fields li { margin-block-end: 0.5rem; overflow-wrap: anywhere; }
    .dui-error-dialog__kv { display: grid; grid-template-columns: max-content 1fr; column-gap: 0.75rem; margin-block: 0.25rem 0; padding-inline-start: 0.75rem; border-inline-start: 2px solid rgba(128, 128, 128, 0.45); }
    .dui-error-dialog--dark .dui-error-dialog__kv { border-inline-start-color: rgba(255, 255, 255, 0.4); }
    .dui-error-dialog__kv dt { opacity: 0.7; }
    .dui-error-dialog__kv dd { margin-inline-start: 0; overflow-wrap: anywhere; }
    .dui-error-dialog__help, .dui-error-dialog__report { margin-block: 0.25rem; }
    .dui-error-dialog__rid { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-block: 0.25rem; overflow-wrap: anywhere; }
    .dui-error-dialog__sr { position: absolute; inline-size: 1px; block-size: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  `]
})
export class ErrorDialogComponent {
  /** 刚复制的请求号（对应按钮文案切为「已复制」） */
  readonly copiedId = signal<string | undefined>(undefined);

  private readonly injector = inject(Injector);
  /** 界面语言切换计数；变化后重新渲染所有文案 */
  private readonly langTick = signal(0);
  private readonly translationService = this.tryGet(TranslationService);
  private readonly themeService = this.tryGet(ThemeService);

  /** 暗色（取 themeService.getTheme().type，非 light 都算暗） */
  readonly dark = computed(() => {
    this.langTick();
    const type = this.themeService?.getTheme?.()?.type;
    return !!type && type !== 'light';
  });

  /** 已渲染的错误列表 */
  readonly views = computed<ErrorView[]>(() => {
    this.langTick();
    const tr = this.translate;
    return this.data.errors().map(error => {
      const r = renderPlatformError(error, tr);
      let solution = r.solution;
      if (!solution?.length && error.critical) {
        // 5xx：通用步骤（后端本应带，缺失时前端兜底）
        solution = ['ERROR.GENERIC_STEP_1', 'ERROR.GENERIC_STEP_2', 'ERROR.GENERIC_STEP_3'].map(k => this.t(k));
      }
      return { error, message: r.message, hint: r.hint, solution, details: r.details };
    });
  });

  /** 对话框标题：单条用错误文案，多条用「出现 N 个问题」 */
  readonly title = computed(() => {
    const vs = this.views();
    return vs.length === 1 ? vs[0].message : this.t('ERROR.MULTI_TITLE', { count: vs.length });
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData,
    private readonly clipboard: Clipboard,
    private readonly ref: MatDialogRef<ErrorDialogComponent>,
    destroyRef: DestroyRef
  ) {
    const ts = this.translationService;
    if (ts?.translate) {
      merge(ts.translate.onLangChange, ts.translate.onTranslationChange)
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(() => this.langTick.update(n => n + 1));
    }
  }

  /** 翻译函数（TranslationService 不可用时为 undefined，走内置中文兜底） */
  get translate(): ErrorTranslate | undefined {
    const ts = this.translationService;
    return ts ? (key, params) => ts.instant(key, params) as string : undefined;
  }

  /** 取固定文案 */
  t(key: string, params?: Record<string, unknown>): string {
    this.langTick();
    return errorText(key, params, this.translate);
  }

  /** 复制请求号 */
  copy(error: PlatformError): void {
    if (error.requestId && this.clipboard.copy(error.requestId)) {
      this.copiedId.set(error.requestId);
    }
  }

  /** 触发「报告问题」钩子；只有一条错误时同时关闭对话框 */
  report(error: PlatformError): void {
    this.data.onReport?.(error);
    if (this.data.errors().length <= 1) {
      this.ref.close('report');
    }
  }

  private tryGet<T>(token: new (...args: never[]) => T): T | null {
    try {
      return this.injector.get(token, null);
    } catch {
      // 宿主没配翻译 / 主题（如缺 TranslateStore）：用内置中文与亮色兜底
      return null;
    }
  }
}
