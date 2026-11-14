/**
 * @fileoverview Module `src/ux/markdown/markdown.component.ts` providing markdown component definitions and implementation.
 * @zh 模块文件 `src/ux/markdown/markdown.component.ts`，提供Markdown文档组件相关的定义与实现。
 */

import {
  Component,  AfterViewInit,  ElementRef,  Input,  Output,  EventEmitter,  Renderer2,
  SecurityContext,  OnChanges,  SimpleChanges,  HostBinding,  NgZone,  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {  scrollToAnchor,  genHeadingId,  isAnchorLink,  removeTrailingHash,
  rawGithubHref,  isGithubHref,  isRawGithubHref,  renderVideoElements,
} from './markdown-utils/markdown-utils';

import * as showdown from 'showdown';

/**
 * Executes `generateAbsoluteHref` to handle generate absolute href.
 * @zh 执行 `generateAbsoluteHref`，用于生成AbsoluteHref。
 * @param currentHref - current href parameter (`string`) / 当前Href参数（`string`）
 * @param relativeHref - relative href parameter (`string`) / relativeHref参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function generateAbsoluteHref(
  currentHref: string,
  relativeHref: string
): string {
  if (currentHref && relativeHref) {
    const currentUrl: URL = new URL(currentHref);
    const path: string = currentUrl.pathname.split('/').slice(1, -1).join('/');
    const correctUrl: URL = new URL(currentHref);
    if (relativeHref.startsWith('/')) {
      const orgAndRepo: string = path.split('/').slice(0, 3).join('/');
      correctUrl.pathname = `${orgAndRepo}${relativeHref}`;
    } else {
      correctUrl.pathname = `${path}/${relativeHref}`;
    }
    return correctUrl.href;
  }
  return '';
}

/**
 * Executes `normalizeHtmlHrefs` to handle normalize html hrefs.
 * @zh 执行 `normalizeHtmlHrefs`，用于归一化HTML内容Hrefs。
 * @param html - html parameter (`string`) / HTML内容参数（`string`）
 * @param currentHref - current href parameter (`string`) / 当前Href参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function normalizeHtmlHrefs(html: string, currentHref: string): string {
  if (currentHref) {
    const document: Document = new DOMParser().parseFromString(
      html,
      'text/html'
    );
    document
      .querySelectorAll<HTMLAnchorElement>('a[href]')
      .forEach((link: HTMLAnchorElement) => {
        const url: URL = new URL(link.href);
        const originalHash: string = url.hash;
        if (isAnchorLink(link)) {
          if (originalHash) {
            url.hash = genHeadingId(originalHash);
            link.href = url.hash;
          }
        } else if (url.host === window.location.host) {
          if (url.pathname.endsWith('.md')) {

            const hrefWithoutHash: string = removeTrailingHash(
              link.getAttribute('href')
            );

            url.href = generateAbsoluteHref(currentHref, hrefWithoutHash);

            if (originalHash) {
              url.hash = genHeadingId(originalHash);
            }
            link.href = url.href;
          }
          link.target = '_blank';
        } else {
          // url is absolute
          if (url.pathname.endsWith('.md')) {
            if (originalHash) {
              url.hash = genHeadingId(originalHash);
            }
            link.href = url.href;
          }
          link.target = '_blank';
        }
      });

    return document.body.innerHTML;
  }
  return html;
}

/**
 * Executes `normalizeImageSrcs` to handle normalize image srcs.
 * @zh 执行 `normalizeImageSrcs`，用于归一化图像源路径。
 * @param html - html parameter (`string`) / HTML内容参数（`string`）
 * @param currentHref - current href parameter (`string`) / 当前Href参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function normalizeImageSrcs(html: string, currentHref: string): string {
  if (currentHref) {
    const document: Document = new DOMParser().parseFromString(
      html,
      'text/html'
    );
    document
      .querySelectorAll<HTMLImageElement>('img[src]')
      .forEach((image: HTMLImageElement) => {
        const src = image.getAttribute('src') ?? '';
        try {
          /* tslint:disable-next-line:no-unused-expression */
          new URL(src);
          if (isGithubHref(src)) {
            image.src = rawGithubHref(src);
          }
        } catch {
          image.src = generateAbsoluteHref(
            isGithubHref(currentHref)
              ? rawGithubHref(currentHref)
              : currentHref,
            src
          );
        }
        // gh svgs need to have ?sanitize=true
        if (isRawGithubHref(image.src)) {
          const url: URL = new URL(image.src);
          if (url.pathname.endsWith('.svg')) {
            url.searchParams.set('sanitize', 'true');
            image.src = url.href;
          }
        }
      });

    return document.body.innerHTML;
  }
  return html;
}

/**
 * Executes `addIdsToHeadings` to handle add ids to headings.
 * @zh 执行 `addIdsToHeadings`，用于添加标识列表转换为Headings。
 * @param html - html parameter (`string`) / HTML内容参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function addIdsToHeadings(html: string): string {
  if (html) {
    const document: Document = new DOMParser().parseFromString(
      html,
      'text/html'
    );
    document
      .querySelectorAll('h1, h2, h3, h4, h5, h6')
      .forEach((heading: Element) => {
        const id: string = genHeadingId(heading.innerHTML);
        heading.setAttribute('id', id);
      });
    return document.body.innerHTML;
  }
  return html;
}

/**
 * Angular component `MarkdownComponent` (selector: 'dui-markdown') providing markdown component presentation and interaction in `src/ux/markdown`.
 * @zh Angular 组件 `MarkdownComponent`（selector: 'dui-markdown'），提供Markdown文档组件的视图渲染与交互逻辑（位于 `src/ux/markdown`）。
 */
@Component({
  selector: 'dui-markdown',
  styleUrls: ['./markdown.component.scss'],
  templateUrl: './markdown.component.html',
  standalone: false,
})
export class MarkdownComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  /**
   * Property `_content` (`string`) storing content.
   * @zh 属性 `_content`（类型：`string`），用于存储或配置内容。
   */
  private _content!: string;
  /**
   * Property `_simpleLineBreaks` (`boolean`) storing simple line breaks (default: `false`).
   * @zh 属性 `_simpleLineBreaks`（类型：`boolean`），用于存储或配置simple线段Breaks（默认值：`false`）。
   */
  private _simpleLineBreaks = false;
  /**
   * Property `_hostedUrl` (`string`) storing hosted url.
   * @zh 属性 `_hostedUrl`（类型：`string`），用于存储或配置已宿主链接地址。
   */
  private _hostedUrl!: string;
  /**
   * Property `_anchor` (`string`) storing anchor.
   * @zh 属性 `_anchor`（类型：`string`），用于存储或配置锚点。
   */
  private _anchor!: string;
  /**
   * Property `_viewInit` (`boolean`) storing view init (default: `false`).
   * @zh 属性 `_viewInit`（类型：`boolean`），用于存储或配置视图初始化（默认值：`false`）。
   */
  private _viewInit = false;
  /**
   * Property `_anchorListener` (`VoidFunction`) storing anchor listener.
   * @zh 属性 `_anchorListener`（类型：`VoidFunction`），用于存储或配置锚点监听器。
   */
  private _anchorListener?: VoidFunction;

  /**
   * Host binding `class` bound to host attribute/property `class` for class.
   * @zh 宿主绑定属性 `class`，绑定至宿主元素 `class` 以控制类名。
   */
  @HostBinding('class') class = 'dui-markdown';


  /**
   * Input setter `content` updating content.
   * @zh 输入属性 `content` 的设置器，用于更新内容。
   * @param content - New content value (`string`) / 新的内容值（`string`）
   */
  @Input()
  set content(content: string) {
    this._content = content;
  }

  /**
   * Input setter `simpleLineBreaks` updating simple line breaks.
   * @zh 输入属性 `simpleLineBreaks` 的设置器，用于更新simple线段Breaks。
   * @param simpleLineBreaks - New simple line breaks value (`boolean`) / 新的simple线段Breaks值（`boolean`）
   */
  @Input()
  set simpleLineBreaks(simpleLineBreaks: boolean) {
    this._simpleLineBreaks = simpleLineBreaks;
  }


  /**
   * Input setter `hostedUrl` updating hosted url.
   * @zh 输入属性 `hostedUrl` 的设置器，用于更新已宿主链接地址。
   * @param hostedUrl - New hosted url value (`string`) / 新的已宿主链接地址值（`string`）
   */
  @Input()
  set hostedUrl(hostedUrl: string) {
    this._hostedUrl = hostedUrl;
  }


  /**
   * Input setter `anchor` updating anchor.
   * @zh 输入属性 `anchor` 的设置器，用于更新锚点。
   * @param anchor - New anchor value (`string`) / 新的锚点值（`string`）
   */
  @Input()
  set anchor(anchor: string) {
    this._anchor = anchor;
  }

  /**
   * Output event emitter `contentReady` (`EventEmitter<void>`) firing when content ready occurs.
   * @zh 输出事件 `contentReady`（类型：`EventEmitter<void>`），当触发内容就绪时向外发出事件。
   */
  @Output() contentReady: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Creates an instance of `MarkdownComponent` and initializes its dependencies and internal state.
   * @zh 创建 `MarkdownComponent` 实例，并初始化其依赖项与内部状态。
   * @param _renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _domSanitizer - Injected or initial dom sanitizer (`DomSanitizer`) / 注入或传入的DOM节点安全清理器（`DomSanitizer`）
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private _domSanitizer: DomSanitizer,
    private _ngZone: NgZone
  ) {}

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  ngOnChanges(changes: SimpleChanges): void {
    // only anchor changed
    if (
      changes['anchor'] &&
      !changes['content'] &&
      !changes['simpleLineBreaks'] &&
      !changes['hostedUrl']
    ) {
      scrollToAnchor(this._elementRef.nativeElement, this._anchor, true);
    } else {
      this.refresh();
    }
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    if (!this._content) {
      this._loadContent(
        (<HTMLElement>this._elementRef.nativeElement).textContent
      );
    }
    this._viewInit = true;
    this._ngZone.runOutsideAngular(() => {
      this._anchorListener = this._renderer.listen(
        this._elementRef.nativeElement,
        'click',
        (event: MouseEvent) => {
          const element: HTMLElement = <HTMLElement>event.srcElement;
          if (
            element.matches('a[href]') &&
            isAnchorLink(<HTMLAnchorElement>element)
          ) {
            this.handleAnchorClicks(event);
          }
        }
      );
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._anchorListener?.();
  }

  /**
   * Executes `refresh` to handle refresh.
   * @zh 执行 `refresh`，用于刷新。
   */
  refresh(): void {
    if (this._content) {
      this._loadContent(this._content);
    } else if (this._viewInit) {
      this._loadContent(
        (<HTMLElement>this._elementRef.nativeElement).textContent
      );
    }
  }

  /**
   * Executes `_loadContent` to handle load content.
   * @zh 执行 `_loadContent`，用于加载内容。
   * @param markdown - markdown parameter (`string`) / Markdown文档参数（`string`）
   */
  private _loadContent(markdown: string | null): void {
    if (markdown && markdown.trim().length > 0) {
      // Clean container
      this._renderer.setProperty(
        this._elementRef.nativeElement,
        'innerHTML',
        ''
      );
      this._elementFromString(this._render(markdown));
    }
    // TODO: timeout required since resizing of html elements occurs which causes a change in the scroll position
    this._ngZone.runOutsideAngular(() =>
      setTimeout(
        () =>
          scrollToAnchor(this._elementRef.nativeElement, this._anchor, true),
        250
      )
    );
    this.contentReady.emit();
  }

  /**
   * Executes `handleAnchorClicks` to handle handle anchor clicks.
   * @zh 执行 `handleAnchorClicks`，用于连接手柄锚点点击。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  private handleAnchorClicks(event: Event): void {
    event.preventDefault();
    const url: URL = new URL((<HTMLAnchorElement>event.target).href);
    const hash: string = decodeURI(url.hash);
    scrollToAnchor(this._elementRef.nativeElement, hash, true);
  }

  /**
   * Executes `_elementFromString` to handle element from string.
   * @zh 执行 `_elementFromString`，用于元素从字符串。
   * @param markupStr - markup str parameter (`string`) / markup字符串参数（`string`）
   * @returns Result of type `HTMLDivElement` / 类型为 `HTMLDivElement` 的返回值
   */
  private _elementFromString(markupStr: string): HTMLDivElement {
     const div: HTMLDivElement = this._renderer.createElement('div');
    this._renderer.appendChild(this._elementRef.nativeElement, div);
    const html: string =
      this._domSanitizer.sanitize(SecurityContext.HTML, markupStr) ?? '';
    const htmlWithAbsoluteHrefs: string = normalizeHtmlHrefs(
      html,
      this._hostedUrl
    );
    const htmlWithAbsoluteImgSrcs: string = normalizeImageSrcs(
      htmlWithAbsoluteHrefs,
      this._hostedUrl
    );
    const htmlWithHeadingIds: string = addIdsToHeadings(
      htmlWithAbsoluteImgSrcs
    );
    const htmlWithVideos: SafeHtml = renderVideoElements(htmlWithHeadingIds);
    this._renderer.setProperty(div, 'innerHTML', htmlWithVideos);
    return div;
  }

  /**
   * Executes `_render` to handle render.
   * @zh 执行 `_render`，用于渲染。
   * @param markdown - markdown parameter (`string`) / Markdown文档参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private _render(markdown: string): string {
    // Trim leading and trailing newlines
    markdown = markdown
      .replace(/^(\s|\t)*\n+/g, '')
      .replace(/(\s|\t)*\n+(\s|\t)*$/g, '');
    // Split markdown by line characters
    let lines: string[] = markdown.split('\n');

    // check how much indentation is used by the first actual markdown line
    const firstLineWhitespaceMatch = lines[0].match(/^(\s|\t)*/);
    const firstLineWhitespace: string = firstLineWhitespaceMatch
      ? firstLineWhitespaceMatch[0]
      : '';

    const startingWhitespaceRegex = new RegExp('^' + firstLineWhitespace);
    lines = lines.map(function (line: string): string {
      return line.replace(startingWhitespaceRegex, '');
    });

    const markdownToParse: string = lines.join('\n');

    const converter: showdown.Converter = new showdown.Converter();
    converter.setOption('ghCodeBlocks', true);
    converter.setOption('tasklists', true);
    converter.setOption('tables', true);
    converter.setOption('literalMidWordUnderscores', true);
    converter.setOption('simpleLineBreaks', this._simpleLineBreaks);
    converter.setOption('emoji', true);
    return converter.makeHtml(markdownToParse);
  }
}
