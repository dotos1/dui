/**
 * @fileoverview Lightweight internal Markdown renderer component for testdui documentation pages.
 * @zh `testdui` 文档站内部使用的轻量级零依赖 Markdown 渲染组件，替代已下沉至 `@dotos1/duix` 的重型渲染包。
 */

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Escapes HTML special characters in plain text or code snippets.
 * @zh 转义纯文本或代码片段中的 HTML 特殊字符。
 * @param raw - raw string (`string`) / 待转义原始字符串（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Formats inline Markdown syntax (inline code, bold, italic, links).
 * @zh 解析并转换行内 Markdown 语法（行内代码、加粗、斜体与超链接）。
 * @param text - inline text (`string`) / 行内文本（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function renderInlineMarkdown(text: string): string {
  const codeTokens: string[] = [];
  let working = text.replace(/`([^`]+)`/g, (_match, code: string) => {
    const idx = codeTokens.length;
    codeTokens.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000CODE_${idx}\u0000`;
  });

  working = escapeHtml(working);
  working = working.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  working = working.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  working = working.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|#[^\s)]*)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return working.replace(/\u0000CODE_(\d+)\u0000/g, (_m, idxStr: string) => {
    return codeTokens[Number(idxStr)] ?? '';
  });
}

/**
 * Converts static documentation Markdown into clean HTML markup.
 * @zh 将文档站静态 Markdown 文本转换为结构化 HTML 字符串（支持标题、表格、列表、围栏代码块与段落）。
 * @param markdown - markdown source (`string`) / Markdown 源文本（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function convertMarkdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) {
    return '';
  }
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const htmlParts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced code block
    if (trimmed.startsWith('```')) {
      const lang = escapeHtml(trimmed.slice(3).trim());
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      if (i < lines.length) {
        i++;
      }
      const clsAttr = lang ? ` class="language-${lang}"` : '';
      htmlParts.push(`<pre><code${clsAttr}>${codeLines.join('\n')}</code></pre>`);
      continue;
    }

    // Headings
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      htmlParts.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    // GFM Table
    if (
      trimmed.startsWith('|') &&
      i + 1 < lines.length &&
      /^\|\s*[-:]+/.test(lines[i + 1].trim())
    ) {
      const parseCells = (row: string): string[] =>
        row
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => renderInlineMarkdown(c.trim()));

      const headers = parseCells(trimmed);
      i += 2;
      const bodyRows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = parseCells(lines[i]);
        bodyRows.push(`<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`);
        i++;
      }
      htmlParts.push(
        `<table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${bodyRows.join('')}</tbody></table>`
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(`<li>${renderInlineMarkdown(lines[i].trim().replace(/^[-*]\s+/, ''))}</li>`);
        i++;
      }
      htmlParts.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !/^#{1,6}\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*]\s+/.test(lines[i].trim())
    ) {
      paraLines.push(renderInlineMarkdown(lines[i].trim()));
      i++;
    }
    if (paraLines.length > 0) {
      htmlParts.push(`<p>${paraLines.join(' ')}</p>`);
    }
  }

  return htmlParts.join('\n');
}

/**
 * Angular component `DocsMarkdownComponent` rendering static Markdown content in documentation pages.
 * @zh Angular 组件 `DocsMarkdownComponent`，在文档站页面中安全渲染静态 Markdown 内容。
 */
@Component({
  selector: 'app-docs-markdown',
  template: '<div [innerHTML]="renderedHtml"></div>',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsMarkdownComponent implements OnChanges {
  /**
   * Host CSS class binding reusing `.dui-markdown` theme rules.
   * @zh 宿主类名绑定，复用 `.dui-markdown` 主题样式规则。
   */
  @HostBinding('class') readonly hostClass = 'dui-markdown';

  /**
   * Input Markdown text to render.
   * @zh 待渲染的 Markdown 源字符串。
   */
  @Input() content = '';

  /**
   * Sanitized HTML output bound to innerHTML.
   * @zh 经过安全清理后的 HTML 字符串。
   */
  renderedHtml = '';

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnChanges(_changes: SimpleChanges): void {
    const rawHtml = convertMarkdownToHtml(this.content);
    this.renderedHtml = this.sanitizer.sanitize(SecurityContext.HTML, rawHtml) ?? '';
  }
}
