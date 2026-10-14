import {
  Component,  AfterViewInit,  ElementRef,  Input,  Output,  EventEmitter,  Renderer2,
  SecurityContext,  OnChanges,  SimpleChanges,  HostBinding,  NgZone,  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {  scrollToAnchor,  genHeadingId,  isAnchorLink,  removeTrailingHash,
  rawGithubHref,  isGithubHref,  isRawGithubHref,  renderVideoElements,
} from './markdown-utils/markdown-utils';

import * as showdown from 'showdown';

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

@Component({
  selector: 'dui-markdown',
  styleUrls: ['./markdown.component.scss'],
  templateUrl: './markdown.component.html',
})
export class MarkdownComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  private _content!: string;
  private _simpleLineBreaks = false;
  private _hostedUrl!: string;
  private _anchor!: string;
  private _viewInit = false;
  private _anchorListener?: VoidFunction;

  @HostBinding('class') class = 'dui-markdown';


  @Input()
  set content(content: string) {
    this._content = content;
  }

  @Input()
  set simpleLineBreaks(simpleLineBreaks: boolean) {
    this._simpleLineBreaks = simpleLineBreaks;
  }


  @Input()
  set hostedUrl(hostedUrl: string) {
    this._hostedUrl = hostedUrl;
  }


  @Input()
  set anchor(anchor: string) {
    this._anchor = anchor;
  }

  @Output() contentReady: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private _domSanitizer: DomSanitizer,
    private _ngZone: NgZone
  ) {}

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

  ngOnDestroy(): void {
    this._anchorListener?.();
  }

  refresh(): void {
    if (this._content) {
      this._loadContent(this._content);
    } else if (this._viewInit) {
      this._loadContent(
        (<HTMLElement>this._elementRef.nativeElement).textContent
      );
    }
  }

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

  private handleAnchorClicks(event: Event): void {
    event.preventDefault();
    const url: URL = new URL((<HTMLAnchorElement>event.target).href);
    const hash: string = decodeURI(url.hash);
    scrollToAnchor(this._elementRef.nativeElement, hash, true);
  }

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
