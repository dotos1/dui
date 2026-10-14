import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnDestroy, OnInit, Output,
  Renderer2,
  ViewChild,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { BehaviorSubject, forkJoin, fromEvent, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import elementResizeDetectorMaker from 'element-resize-detector';
import { IframeEvent, IframeEventName } from '../interfaces/iframe-event';
import { Dui } from '@dotos/dui/core';
import { DomSanitizer } from '@angular/platform-browser';


/**
 * Wraps a native `<iframe>` with lifecycle events (click/keyup/unload/resize) proxied out via
 * `iframeEvent`, plus optional auto-resize and injection of extra stylesheets/CSS into the frame.
 * @zh 封装原生 `<iframe>`，将其生命周期事件（点击/按键/卸载/尺寸变化）通过 `iframeEvent` 代理输出，
 * 并支持自动调整高度以及向 iframe 内注入额外样式表/CSS。
 */
@Component({
  selector: 'dui-iframe',
  template: `
        <div class="dui-iframe" *ngIf="$loading | async">
            <ng-content></ng-content>
        </div>
        <iframe #iframe [src]="source | safe" frameborder="0" class="dui-iframe" [ngStyle]="$styling | async" [scrolling]="scrolling"></iframe>
    `,
  styles: [`
        :host {
            position: relative;
            display: block;
            overflow: hidden;
            width:100%;
            height:100%;
        }
        .dui-iframe {
            overflow: hidden;
            width: 100%;
            height:100%;
        }
        .dui-iframe-loading {
            height: 100%;
            width: 100%;
            position: absolute;
            z-index: 1;
        }
        .dui-iframe-loading::after {
            background: #fff;
            content: '';
            display: block;
            height: 100%;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: -1;
            left: 0;
        }
    `]
})
export class IframeComponent implements OnInit, OnChanges,AfterViewInit, OnDestroy {
  /** @zh 底层原生 `<iframe>` 元素的引用。 */
  @ViewChild('iframe') iframe: ElementRef;

  /**
   * Bulk-applies arbitrary properties onto this component (via `Dui.apply`) whenever it changes.
   * @zh 每当变化时，通过 `Dui.apply` 将任意属性批量应用到本组件上。
   */
  @Input() config: any = {};

  /**
   * The native `<iframe scrolling>` attribute value.
   * @zh 原生 `<iframe scrolling>` 属性值。
   */
  @Input() scrolling='no';

  /**
   * Debounce time (ms) applied to auto-resize height updates.
   * @zh 自动调整高度更新时应用的防抖时间（毫秒）。
   */
  get resizeDebounceMillis(): number {
    return this._resizeDebounceMillis;
  }

  /**
   * Debounce time (ms) applied to auto-resize height updates.
   * @zh 自动调整高度更新时应用的防抖时间（毫秒）。
   */
  @Input() set resizeDebounceMillis(value: number) {
    if (this._resizeDebounceMillis !== value) {
      this._resizeDebounceMillis = value;
      this.updateStyles();
    } else {
      this._resizeDebounceMillis = value;
    }

  }
  /**
   * Whether the iframe's height auto-adjusts to fit its (same-origin) content.
   * @zh iframe 高度是否根据其（同源）内容自动调整。
   */
  get autoResize(): boolean {
    return this._autoResize;
  }

  /**
   * Whether the iframe's height auto-adjusts to fit its (same-origin) content.
   * @zh iframe 高度是否根据其（同源）内容自动调整。
   */
  @Input() set autoResize(value: boolean) {
    this._autoResize = value;
  }
  /**
   * External stylesheet URLs injected into the (same-origin) iframe document once loaded.
   * @zh 加载完成后注入到（同源）iframe 文档中的外部样式表 URL 列表。
   */
  get styleUrls(): Array<string> {
    return this._styleUrls;
  }

  /**
   * External stylesheet URLs injected into the (same-origin) iframe document once loaded.
   * @zh 加载完成后注入到（同源）iframe 文档中的外部样式表 URL 列表。
   */
  @Input() set styleUrls(value: Array<string>) {
    this._styleUrls = value;
  }
  /**
   * Inline CSS text injected into the (same-origin) iframe document once loaded.
   * @zh 加载完成后注入到（同源）iframe 文档中的内联 CSS 文本。
   */
  get styles(): string {
    return this._styles;
  }

  /**
   * Inline CSS text injected into the (same-origin) iframe document once loaded.
   * @zh 加载完成后注入到（同源）iframe 文档中的内联 CSS 文本。
   */
  @Input() set styles(value: string) {
    this._styles = value;
  }
  /**
   * The (sanitized, trusted) URL currently loaded in the iframe.
   * @zh 当前加载到 iframe 中的（经过清理、受信任的）URL。
   */
  get source(): any {
    return this._source;
  }

  /**
   * The URL to load in the iframe; sanitized and marked as a trusted resource URL.
   * @zh 要在 iframe 中加载的 URL；会被清理并标记为受信任的资源 URL。
   */
  @Input() set source(value: string) {
    this._source = value;
  }

  /**
   * Emits lifecycle/interaction events from the iframe (click, keyup, load, unload, resize, etc.).
   * @zh 发出来自 iframe 的生命周期/交互事件（点击、按键、加载、卸载、尺寸变化等）。
   */
  @Output() iframeEvent: EventEmitter<IframeEvent> = new EventEmitter();

  /** @zh 内部使用，转发 iframe 内部的点击事件。 */
  $iframeClick: ReplaySubject<MouseEvent> = new ReplaySubject<MouseEvent>(1);
  /** @zh 内部使用，转发 iframe 内部的按键事件。 */
  $iframeKeyUp: ReplaySubject<KeyboardEvent> = new ReplaySubject<KeyboardEvent>(1);
  /** @zh 内部使用，转发 iframe 内部的卸载事件。 */
  $iframeUnload: ReplaySubject<BeforeUnloadEvent> = new ReplaySubject<BeforeUnloadEvent>(1);
  /**
   * Emits `true` while the iframe content/stylesheets are still loading, `false` once ready,
   * or `null` if loading failed (e.g. cross-origin error).
   * @zh 当 iframe 内容/样式表仍在加载时发出 `true`，加载完成后发出 `false`，
   * 加载失败（如跨域错误）时发出 `null`。
   */
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  /** @zh 内部使用，根据内容高度变化推导出的样式流，用于自动调整高度。 */
  $styling: Observable<any>;
  /** @zh 同源 iframe 的 `document` 对象，跨域时不可用。 */
  iframeDocument: Document;
  /** @zh 同源 iframe 的 `document.body` 元素，跨域时不可用。 */
  iframeBody: HTMLElement;
  /** @zh 当前处于活动状态的 iframe 内容 URL。 */
  activeSource: string;
  /** @zh 内部使用的元素尺寸变化检测器实例。 */
  elementResizeDetector: elementResizeDetectorMaker.Erd;
  private eventListeners: Array<any> = [];
  private $unsubscribe = new Subject();
  /** @zh 底层原生 `<iframe>` 元素的引用（内部使用，与 `iframe` 指向同一元素）。 */
  @ViewChild('iframe') elementRef: ElementRef;
  private _source: any;
  private _styles: string;
  private $bodyHeight: Subject<number> = new Subject<number>();
  private _styleUrls: Array<string>;
  private _autoResize = true;
  private _resizeDebounceMillis = 50;
  
  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
     private cdr: ChangeDetectorRef) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  /**
   * Applies the given config object's properties onto this component instance.
   * @zh 将给定配置对象的属性应用到本组件实例上。
   */
  init(config: any) {
    Dui.apply(this, config);
  }

  private updateStyles() {
    this.$styling = this.$bodyHeight.pipe(
      distinctUntilChanged(),
      debounceTime(this.resizeDebounceMillis),
      tap(() => this.emitEvent('iframe-resized')),
      map((height) => ({ 'height.px': height })));
  }

  private addStyleSheets(styleUrls) {
    if (styleUrls.length > 0) {

      // create placeholder for subjects
      const loadSubjects: Array<Subject<string>> = [];

      // loop through all style sheets...
      styleUrls.map((styleUrl: string) => {

        // create link element
        const linkElement: HTMLElement = this.iframeDocument.createElement('link');
        linkElement['rel'] = 'stylesheet';
        linkElement['type'] = 'text/css';
        linkElement['href'] = styleUrl;

        // create load subject that will emit once the stylesheet has loaded
        const loadSubject: Subject<string> = new Subject<string>();
        loadSubjects.push(loadSubject);

        // listen to load event on link
        const stylesheetLoadListener = this.renderer.listen(linkElement, 'load', () => {
          this.iframeBody.style.overflow = 'inherit';
          this.emitEvent('iframe-stylesheet-loaded', styleUrl);
          loadSubject.next(styleUrl);
          loadSubject.complete();
          return true;
        });

        // push listener to array so that we can remove them later
        this.eventListeners.push(stylesheetLoadListener);

        // add link to iframe head
        this.iframeDocument.head.appendChild(linkElement);

        // emit load event
        this.emitEvent('iframe-stylesheet-load', styleUrl);
      });

      forkJoin(loadSubjects)
        .pipe(
          takeUntil(this.$unsubscribe)
        )
        .subscribe(() => {
          if (styleUrls.length > 1) {
            this.emitEvent('iframe-all-stylesheets-loaded', styleUrls);
          }
          this.$loading.next(false);
        });
    }
  }

  private addCss(styles: string) {
    const styleElement = this.iframeDocument.createElement('style');
    styleElement.appendChild(this.iframeDocument.createTextNode(styles));
    this.iframeDocument.getElementsByTagName('head')[0].appendChild(styleElement);
    this.emitEvent('iframe-styles-added');
  }

  private addElementResizeDetector(body: HTMLElement, style: any) {
    this.elementResizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });
    this.elementResizeDetector.listenTo(body, () => {
      const offsetHeight = body.offsetHeight;
      const marginTop = parseInt(style.getPropertyValue('margin-top'), 10);
      const marginBottom = parseInt(style.getPropertyValue('margin-bottom'), 10);
      const height = offsetHeight + marginTop + marginBottom;
      this.$bodyHeight.next(height);
    });
  }

  private removeElementResizeDetector() {
    if (this.iframeBody && this.elementResizeDetector) {
      this.elementResizeDetector.uninstall(this.iframeBody);
    }
  }

  private emitEvent(eventName: IframeEventName, resource?: string) {
    const iframeEvent: IframeEvent = { event: eventName, src: this.activeSource };
    if (resource) {
      iframeEvent.resource = resource;
    }
    this.iframeEvent.emit(iframeEvent);
  }

  /**
   * Reloads the iframe's current document (same-origin only).
   * @zh 重新加载 iframe 当前文档（仅限同源）。
   */
  reload() {
    if (this.iframeDocument && this.iframeDocument.location) {
      this.iframeDocument.location.reload();
    }
  }

  ngOnInit() {
    this.activeSource = this.source;
    this.$loading.pipe(
      filter(value => value === false || value === null),
      takeUntil(this.$unsubscribe)
    ).subscribe((res) => {
      this.emitEvent(res === null ? 'iframe-loaded-with-errors' : 'iframe-loaded');
    });
    this.updateStyles();
  }

  ngAfterViewInit() {
    const iframe = this.elementRef.nativeElement;
    this.$iframeClick
      .pipe(
        takeUntil(this.$unsubscribe)
      ).subscribe(() => {
        this.emitEvent('iframe-click');
      });
    this.$iframeKeyUp
      .pipe(
        takeUntil(this.$unsubscribe)
      ).subscribe(() => {
        this.emitEvent('iframe-keyup');
      });
    this.$iframeUnload
      .pipe(
        takeUntil(this.$unsubscribe)
      ).subscribe(() => {
        this.$loading.next(true);
        this.emitEvent('iframe-unloaded');
        this.iframeBody.style.overflow = 'hidden';
        this.cdr.detectChanges();
      });

    fromEvent(iframe, 'load')
      .pipe(
        takeUntil(this.$unsubscribe)
      )
      .subscribe(() => {
        try {
          this.activeSource = iframe.contentWindow.location.href;
          this.iframeDocument = iframe.contentDocument;
          this.iframeBody = this.iframeDocument.body;

          // add inline css
          if (this.styles) {
            this.addCss(this.styles);
          }

          // add external stylesheets
          if (this.styleUrls && this.styleUrls.length > 0) {
            this.addStyleSheets(this.styleUrls);
          } else {
            this.$loading.next(false);
          }

          // add element resize detector
          if (this.autoResize) {
            this.addElementResizeDetector(this.iframeBody, iframe.contentWindow.getComputedStyle(this.iframeBody));
          }

          // add click listener
          const clickListener = this.renderer.listen(
            iframe.contentWindow,
            'click',
            ($event: MouseEvent) => this.$iframeClick.next($event)
          );
          this.eventListeners.push(clickListener);

          // add key up listener
          const keyUpListener = this.renderer.listen(
            iframe.contentWindow,
            'keyup',
            ($event: KeyboardEvent) => this.$iframeKeyUp.next($event)
          );
          this.eventListeners.push(keyUpListener);

          // add unload listener
          const unloadListener = this.renderer.listen(
            iframe.contentWindow,
            'beforeunload',
            ($event: BeforeUnloadEvent) => this.$iframeUnload.next($event)
          );
          this.eventListeners.push(unloadListener);
        } catch (error) {
          console.log('Event listeners and/or styles and resize listener could not be added due to a cross-origin frame error.');
          console.warn(error);
          this.$loading.next(null);

        }
      });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next(undefined);
    this.$unsubscribe.complete();
    this.eventListeners.map((listener) => listener());
    if (this.autoResize) {
      this.removeElementResizeDetector();
    }
  }
}
