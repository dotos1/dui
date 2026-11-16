/**
 * @fileoverview Module `projects/testdui/src/app/docs/components/live-code-editor/live-code-editor.component.ts` providing a lightweight zero-dependency live code editor.
 * @zh 模块文件 `projects/testdui/src/app/docs/components/live-code-editor/live-code-editor.component.ts`，提供零新增依赖的轻量在线代码编辑器（行号栏 + highlight.js 高亮层 + 透明 textarea）。
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import hljs from 'highlight.js';

/**
 * Type alias `LiveCodeLanguage` representing languages supported by the live editor.
 * @zh 类型别名 `LiveCodeLanguage`，表示在线编辑器支持的语言。
 */
export type LiveCodeLanguage = 'html' | 'json' | 'typescript';

/**
 * Maps editor language to highlight.js grammar name.
 * @zh 编辑器语言到 highlight.js 语法名的映射。
 */
const HLJS_GRAMMAR: Record<LiveCodeLanguage, string> = {
  html: 'xml',
  json: 'json',
  typescript: 'typescript',
};

/**
 * Escapes HTML special characters for the plain-text fallback.
 * @zh 高亮失败时的纯文本兜底转义。
 * @param text - Raw text / 原始文本
 * @returns Escaped HTML / 转义后的 HTML
 */
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Angular component `LiveCodeEditorComponent` (selector: 'app-live-code-editor') providing an editable, syntax-highlighted code surface.
 * @zh Angular 组件 `LiveCodeEditorComponent`（selector: 'app-live-code-editor'），提供带行号、语法高亮、同步滚动的在线代码编辑区；不使用 Monaco，避免静态部署下 Worker 404。
 */
@Component({
  selector: 'app-live-code-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-code-editor.component.html',
  styleUrls: ['./live-code-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveCodeEditorComponent implements OnChanges, OnDestroy {
  /**
   * Input property `code` (`string`) holding the current source.
   * @zh 输入属性 `code`（类型：`string`），当前源码。
   */
  @Input() code = '';

  /**
   * Input property `language` (`LiveCodeLanguage`) selecting the grammar.
   * @zh 输入属性 `language`（类型：`LiveCodeLanguage`），高亮语法。
   */
  @Input() language: LiveCodeLanguage = 'html';

  /**
   * Input property `readonly` (`boolean`) making the editor read-only.
   * @zh 输入属性 `readonly`（类型：`boolean`），是否只读。
   */
  @Input() readonly = false;

  /**
   * Input property `compileMs` (`number | null`) showing last compile duration.
   * @zh 输入属性 `compileMs`（类型：`number | null`），显示最近一次编译耗时（毫秒）。
   */
  @Input() compileMs: number | null = null;

  /**
   * Input property `label` (`string`) shown in the editor toolbar.
   * @zh 输入属性 `label`（类型：`string`），工具栏标题。
   */
  @Input() label = '';

  /**
   * Output `codeChange` emitting edited source on every keystroke.
   * @zh 输出事件 `codeChange`，每次编辑后发出最新源码。
   */
  @Output() readonly codeChange = new EventEmitter<string>();

  /**
   * Output `run` emitting when user presses Ctrl/Cmd+Enter.
   * @zh 输出事件 `run`，用户按下 Ctrl/Cmd+Enter 时发出，请求立即运行。
   */
  @Output() readonly run = new EventEmitter<void>();

  /**
   * Textarea element reference.
   * @zh 透明输入层 textarea 的引用。
   */
  @ViewChild('input', { static: true }) inputRef: ElementRef<HTMLTextAreaElement>;

  /**
   * Highlight layer element reference.
   * @zh 高亮层 pre 的引用。
   */
  @ViewChild('highlight', { static: true }) highlightRef: ElementRef<HTMLPreElement>;

  /**
   * Gutter element reference.
   * @zh 行号栏的引用。
   */
  @ViewChild('gutter', { static: true }) gutterRef: ElementRef<HTMLDivElement>;

  /**
   * Highlighted HTML for the overlay layer.
   * @zh 高亮层 HTML。
   */
  highlighted = '';

  /**
   * Line numbers for the gutter.
   * @zh 行号数组。
   */
  lineNumbers: number[] = [1];

  /**
   * Current caret line (1-based).
   * @zh 当前光标所在行（从 1 开始）。
   */
  cursorLine = 1;

  /**
   * Current caret column (1-based).
   * @zh 当前光标所在列（从 1 开始）。
   */
  cursorColumn = 1;

  /**
   * Whether copy feedback is visible.
   * @zh 是否显示“已复制”反馈。
   */
  copied = false;

  /**
   * Copy feedback timer handle.
   * @zh 复制反馈计时器。
   */
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Change detector used to refresh OnPush view after async feedback.
   * @zh 变更检测器，用于异步反馈后刷新 OnPush 视图。
   */
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Re-renders highlight and gutter whenever code or language changes.
   * @zh 源码或语言变化时重新渲染高亮层与行号。
   * @param changes - Angular change set / 变更集合
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] || changes['language']) {
      this.render(this.code ?? '');
    }
  }

  /**
   * Clears pending timers.
   * @zh 清理挂起的计时器。
   */
  ngOnDestroy(): void {
    if (this.copyTimer) {
      clearTimeout(this.copyTimer);
    }
  }

  /**
   * Handles textarea input.
   * @zh 处理输入事件：更新高亮与行号并向外发出新源码。
   */
  onInput(): void {
    const value = this.inputRef.nativeElement.value;
    this.code = value;
    this.render(value);
    this.updateCursor();
    this.codeChange.emit(value);
  }

  /**
   * Handles editor shortcuts: Tab inserts two spaces, Ctrl/Cmd+Enter runs.
   * @zh 处理快捷键：Tab 插入 2 个空格；Ctrl/Cmd+Enter 立即运行。
   * @param event - Keyboard event / 键盘事件
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.run.emit();
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      if (this.readonly) {
        return;
      }
      event.preventDefault();
      const ta = this.inputRef.nativeElement;
      ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end');
      this.onInput();
    }
  }

  /**
   * Keeps highlight layer and gutter scrolled in sync with the textarea.
   * @zh 同步高亮层与行号栏的滚动位置。
   */
  onScroll(): void {
    const ta = this.inputRef.nativeElement;
    const pre = this.highlightRef.nativeElement;
    pre.scrollTop = ta.scrollTop;
    pre.scrollLeft = ta.scrollLeft;
    this.gutterRef.nativeElement.scrollTop = ta.scrollTop;
  }

  /**
   * Updates the caret line/column indicator.
   * @zh 更新状态栏中的行列号。
   */
  updateCursor(): void {
    const ta = this.inputRef.nativeElement;
    const before = ta.value.slice(0, ta.selectionStart);
    const lines = before.split('\n');
    this.cursorLine = lines.length;
    this.cursorColumn = lines[lines.length - 1].length + 1;
  }

  /**
   * Copies current source to clipboard.
   * @zh 复制当前源码到剪贴板。
   */
  copy(): void {
    const text = this.inputRef.nativeElement.value;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => undefined);
    }
    this.copied = true;
    if (this.copyTimer) {
      clearTimeout(this.copyTimer);
    }
    this.copyTimer = setTimeout(() => {
      this.copied = false;
      this.copyTimer = null;
      this.cdr.markForCheck();
    }, 1500);
  }

  /**
   * Renders highlighted HTML and line numbers.
   * @zh 生成高亮 HTML 与行号。
   * @param source - Source text / 源码
   */
  private render(source: string): void {
    let html: string;
    try {
      html = hljs.highlight(source, { language: HLJS_GRAMMAR[this.language] ?? 'plaintext', ignoreIllegals: true }).value;
    } catch {
      html = escapeHtml(source);
    }
    // 末尾补换行，保证最后一行（含空行）与 textarea 高度一致
    this.highlighted = html + '\n';
    const count = source.split('\n').length;
    if (count !== this.lineNumbers.length) {
      this.lineNumbers = Array.from({ length: count }, (_, i) => i + 1);
    }
  }
}
