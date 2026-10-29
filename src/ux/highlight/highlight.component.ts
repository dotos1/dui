/**
 * @fileoverview Module `src/ux/highlight/highlight.component.ts` providing highlight component definitions and implementation.
 * @zh 模块文件 `src/ux/highlight/highlight.component.ts`，提供highlight组件相关的定义与实现。
 */

import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  SecurityContext,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import { ICopyCodeTooltips } from './copy-code-button/copy-code-button.component';
import hljs from 'highlight.js';

/**
 * Angular component `HighlightComponent` (selector: 'dui-highlight') providing highlight component presentation and interaction in `src/ux/highlight`.
 * @zh Angular 组件 `HighlightComponent`（selector: 'dui-highlight'），提供Highlight组件的视图渲染与交互逻辑（位于 `src/ux/highlight`）。
 */
@Component({
  selector: 'dui-highlight',
  styleUrls: ['./highlight.component.scss'],
  templateUrl: './highlight.component.html',
  
})
export class HighlightComponent implements AfterViewInit {
  /**
   * Property `_initialized` (`boolean`) storing initialized (default: `false`).
   * @zh 属性 `_initialized`（类型：`boolean`），用于存储或配置已初始化（默认值：`false`）。
   */
  private _initialized: boolean = false;

  /**
   * Property `_content` (`string`) storing content.
   * @zh 属性 `_content`（类型：`string`），用于存储或配置内容。
   */
  private _content: string;
  /**
   * Property `_lang` (`string`) storing lang (default: `'typescript'`).
   * @zh 属性 `_lang`（类型：`string`），用于存储或配置语言（默认值：`'typescript'`）。
   */
  private _lang: string = 'typescript';


  /**
   * Input setter `content` updating content.
   * @zh 输入属性 `content` 的设置器，用于更新内容。
   * @param content - New content value (`string`) / 新的内容值（`string`）
   */
  @Input('content')
  set content(content: string) {
    this._content = content;
    if (this._initialized) {
      this._loadContent(this._content);
    }
  }


  /**
   * Input property `copyCodeToClipboard` (`boolean`) configuring copy code to clipboard (default: `false`).
   * @zh 输入属性 `copyCodeToClipboard`（类型：`boolean`），用于配置复制编码转换为Clipboard（默认值：`false`）。
   */
  @Input() copyCodeToClipboard: boolean = false;


  /**
   * Input property `copyCodeTooltips` (`ICopyCodeTooltips`) configuring copy code tooltips (default: `{}`).
   * @zh 输入属性 `copyCodeTooltips`（类型：`ICopyCodeTooltips`），用于配置复制编码悬浮提示（默认值：`{}`）。
   */
  @Input() copyCodeTooltips: ICopyCodeTooltips = {};

  /**
   * Input setter `codeLang` updating code lang.
   * @zh 输入属性 `codeLang` 的设置器，用于更新编码语言。
   * @param lang - New code lang value (`string`) / 新的编码语言值（`string`）
   */
  @Input()
  set codeLang(lang: string) {
    this.setLanguage(lang);
  }


  /**
   * Property `copyContent` (`string`) storing copy content.
   * @zh 属性 `copyContent`（类型：`string`），用于存储或配置复制内容。
   */
  copyContent: string;

  /**
   * Output event emitter `contentReady` (`EventEmitter<void>`) firing when content ready occurs.
   * @zh 输出事件 `contentReady`（类型：`EventEmitter<void>`），当触发内容就绪时向外发出事件。
   */
  @Output() contentReady: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Template/content query reference `highlightComp` (`ElementRef<any>`) targeting highlight comp.
   * @zh 模板/内容视图查询引用 `highlightComp`（`@ViewChild`），指向highlight组件。
   */
  @ViewChild('highlightComponent') highlightComp: ElementRef;

  /**
   * Template/content query reference `copyComp` (`ElementRef<any>`) targeting copy comp.
   * @zh 模板/内容视图查询引用 `copyComp`（`@ViewChild`），指向复制组件。
   */
  @ViewChild('copyComponent') copyComp: ElementRef;

  /**
   * Template/content query reference `tooltip` (`MatTooltip`) targeting tooltip.
   * @zh 模板/内容视图查询引用 `tooltip`（`@ViewChild`），指向悬浮提示。
   */
  @ViewChild('tooltip') tooltip: MatTooltip;

  /**
   * Creates an instance of `HighlightComponent` and initializes its dependencies and internal state.
   * @zh 创建 `HighlightComponent` 实例，并初始化其依赖项与内部状态。
   * @param _renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _domSanitizer - Injected or initial dom sanitizer (`DomSanitizer`) / 注入或传入的DOM节点安全清理器（`DomSanitizer`）
   * @param cdr - Injected or initial cdr (`ChangeDetectorRef`) / 注入或传入的cdr（`ChangeDetectorRef`）
   */
  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private _domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    if (!this._content) {
      this._loadContent((<HTMLElement>this.highlightComp.nativeElement).textContent);
    } else {
      this._loadContent(this._content);
    }
    this._initialized = true;
  }

  /**
   * General method to parse a string of code into HTML Elements and load them into the container

   * @zh 执行 `_loadContent`，用于加载内容。
   */
  private _loadContent(code: string): void {
    if (code && code.trim().length > 0) {
      // Clean container
      this._renderer.setProperty(this._elementRef.nativeElement, 'innerHTML', '');
      // Parse html string into actual HTML elements.
      this._elementFromString(this._render(code));
      if (this.copyCodeToClipboard) {
        this._renderer.appendChild(this._elementRef.nativeElement, this.copyComp.nativeElement);
      }
      this.cdr.detectChanges();
    }
    this.contentReady.emit();
  }

  /**
   * Executes `_elementFromString` to handle element from string.
   * @zh 执行 `_elementFromString`，用于元素从字符串。
   * @param codeStr - code str parameter (`string`) / 编码字符串参数（`string`）
   * @returns Result of type `HTMLPreElement` / 类型为 `HTMLPreElement` 的返回值
   */
  private _elementFromString(codeStr: string): HTMLPreElement {
    // Renderer2 doesnt have a parsing method, so we have to sanitize and use [innerHTML]
    // to parse the string into DOM element for now.
    const preElement: HTMLPreElement = this._renderer.createElement('pre');
    this._renderer.appendChild(this._elementRef.nativeElement, preElement);
    const codeElement: HTMLElement = this._renderer.createElement('code');
    this._renderer.appendChild(preElement, codeElement);
    // Set .highlight class into <code> element
    this._renderer.addClass(codeElement, 'highlight');
    codeElement.innerHTML = this._domSanitizer.sanitize(SecurityContext.HTML, codeStr);
    return preElement;
  }

  /**
   * Executes `setLanguage` to handle set language.
   * @zh 执行 `setLanguage`，用于集合语言。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   */
  setLanguage(lang: string): void {
    if (!lang) {
      throw new Error(
        'Error: language attribute must be defined in TdHighlightComponent.'
      );
    }
    this._lang = lang;
    if (this._initialized) {
      this._loadContent(this._content);
    }
  }
  /**
   * Executes `_render` to handle render.
   * @zh 执行 `_render`，用于渲染。
   * @param contents - contents parameter (`string`) / 内容参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private _render(contents: string): string {
    // Trim leading and trailing newlines
    contents = contents.replace(/^(\s|\t)*\n+/g, '').replace(/(\s|\t)*\n+(\s|\t)*$/g, '');
    // Split markup by line characters
    let lines: string[] = contents.split('\n');

    // check how much indentation is used by the first actual code line
    const firstLineWhitespace: string = lines[0].match(/^(\s|\t)*/)[0];

    // Remove all indentation spaces so code can be parsed correctly
    const startingWhitespaceRegex: RegExp = new RegExp('^' + firstLineWhitespace);
    lines = lines.map(function (line: string): string {
      return line
        .replace('=""', '') // remove empty values
        .replace(startingWhitespaceRegex, '')
        .replace(/\s+$/, ''); // remove trailing white spaces
    });

    const codeToParse: string = lines
      .join('\n')
      .replace(/\{ \{/gi, '{{')
      .replace(/\} \}/gi, '}}')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>'); // replace with < and > to render HTML in Angular
    this.copyContent = codeToParse;
    // Parse code with highlight.js depending on language
    const highlightedCode = hljs.highlight(codeToParse, { language: this._lang, ignoreIllegals: true });
    highlightedCode.value = highlightedCode.value
      .replace(/=<span class="hljs-value">""<\/span>/gi, '')
      .replace('<head>', '')
      .replace('<head/>', '');
    return highlightedCode.value;
  }
}