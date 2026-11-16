/**
 * @fileoverview Module `src/ux/link-preview/components/link-preview.component.ts` providing link preview component definitions and implementation.
 * @zh 模块文件 `src/ux/link-preview/components/link-preview.component.ts`，提供链接预览组件相关的定义与实现。
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { OpenGraphMetaData } from '../interfaces/open-graph-meta-data';
import { LinkPreviewCacheService } from '../services/link-preview-cache.service';
import { LinkPreviewLoadingManager } from '../services/link-preview-loading.manager';
import { LinkPreviewLoadingSpinner } from './link-preview-loading-spinner';

/**
 * Type alias `HtmlLinkTarget` representing html link target (`'_blank' | '_self' | '_parent' | '_top' | FrameName`).
 * @zh 类型别名 `HtmlLinkTarget`，表示HTML内容链接目标（`'_blank' | '_self' | '_parent' | '_top' | FrameName`）。
 */
type HtmlLinkTarget = '_blank' | '_self' | '_parent' | '_top' | FrameName;
/**
 * Type alias `FrameName` representing frame name (`string`).
 * @zh 类型别名 `FrameName`，表示框架名称（`string`）。
 */
type FrameName = string;

/**
 * Angular component `LinkPreviewComponent` (selector: 'link-preview') providing link preview component presentation and interaction in `src/ux/link-preview/components`.
 * @zh Angular 组件 `LinkPreviewComponent`（selector: 'link-preview'），提供链接预览组件的视图渲染与交互逻辑（位于 `src/ux/link-preview/components`）。
 */
@Component({
  selector: 'link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  
})
export class LinkPreviewComponent implements OnChanges, OnDestroy {
  /**
   * Plain links string array
   * @zh 输入属性 `links`（类型：`string[]`），用于配置链接（默认值：`[]`）。
   */
  @Input()
  public links: string[] = [];

  /**
   * Input string to parse for links
   * @zh 输入属性 `parseForLinksStr`（类型：`string`），用于配置解析用于链接字符串。
   */
  @Input()
  public parseForLinksStr: string;

  /**
   * Method that does the API request, provide as class member arrow function from parent
   * @zh 输入属性 `getApiEndpoint$`（类型：`(requestUrl: string) => Observable<unknown>`），用于配置获取API接口Endpoint。
   */
  @Input()
  public getApiEndpoint$: (requestUrl: string) => Observable<unknown>;

  /** API route where to get the meta data from, component will build the full request url
   * Schema: api.example.com/api/get-meta-data?url=d3d3LmV4YW1wbGUuY29t

   * @zh 输入属性 `apiRoute`（类型：`string`），用于配置API接口Route。
   */
  @Input()
  public apiRoute: string;

  /**
   * Target url will be attached as encodeURI(btoa(url)), so it must be decoded on the server
   * @zh 输入属性 `queryParamName`（类型：`string`），用于配置查询参数名称（默认值：`'url'`）。
   */
  @Input()
  public queryParamName = 'url';

  /**
   * boolean: show image in preview
   * @zh 输入属性 `showImage`（类型：`boolean`），用于配置显示图像（默认值：`true`）。
   */
  @Input()
  public showImage = true;

  /**
   * boolean: show site name in preview
   * @zh 输入属性 `showSiteName`（类型：`boolean`），用于配置显示Site名称（默认值：`true`）。
   */
  @Input()
  public showSiteName = true;

  /**
   * boolean: show title in preview
   * @zh 输入属性 `showTitle`（类型：`boolean`），用于配置显示标题（默认值：`true`）。
   */
  @Input()
  public showTitle = true;

  /**
   * boolean: show description in preview
   * @zh 输入属性 `showDescription`（类型：`boolean`），用于配置显示描述（默认值：`true`）。
   */
  @Input()
  public showDescription = true;

  /**
   * boolean: show link url in preview
   * @zh 输入属性 `showLinkUrl`（类型：`boolean`），用于配置显示链接链接地址（默认值：`false`）。
   */
  @Input()
  public showLinkUrl = false;

  /**
   * boolean: use cache to display previews faster on next rendering
   * @zh 输入属性 `useCache`（类型：`boolean`），用于配置使用缓存（默认值：`true`）。
   */
  @Input()
  public useCache = true;

  /**
   * number: max age the data cache of a link preview should be used
   * @zh 输入属性 `maxCacheAgeMs`（类型：`number`），用于配置最大值缓存Age毫秒（默认值：`1000 * 60 * 60 * 24 * 7`）。
   */
  @Input()
  public maxCacheAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days

  /**
   * boolean: show loading indicator
   * @zh 输入属性 `showLoadingIndicator`（类型：`boolean`），用于配置显示加载中指示器（默认值：`true`）。
   */
  @Input()
  public showLoadingIndicator = true;

  /**
   * boolean: whether the <a href="..."></a> link should be clickable.
   * This is a question of context security. Otherwise use (previewClick) event.

   * @zh 输入属性 `useHtmlLinkDefaultClickEvent`（类型：`boolean`），用于配置使用HTML内容链接默认点击事件（默认值：`false`）。
   */
  @Input()
  public useHtmlLinkDefaultClickEvent = false;

  /**
   * HtmlLinkTarget: where the HTML link should be opened on click.
   * Only has an effect if [useHtmlLinkDefaultClickEvent]="true"

   * @zh 输入属性 `htmlLinkTarget`（类型：`string`），用于配置HTML内容链接目标（默认值：`'_blank'`）。
   */
  @Input()
  public htmlLinkTarget: HtmlLinkTarget = '_blank';

  /**
   * Event emitter: on click to handle the click event, emits the clicked URL
   * @zh 输出事件 `previewClicked`（类型：`EventEmitter<string>`），当触发预览点击时向外发出事件。
   */
  @Output()
  public previewClicked = new EventEmitter<string>();

  /**
   * Scanned links[] from @Input() links & @Input() parseForLinks
   * @zh 属性 `scannedLinks`（类型：`string[]`），用于存储或配置scanned链接（默认值：`[]`）。
   */
  private scannedLinks: string[] = [];

  /**
   * Array of metadata objects where the preview is rendered from
   * @zh 属性 `previews`（类型：`OpenGraphMetaData[]`），用于存储或配置预览（默认值：`[]`）。
   */
  public previews: OpenGraphMetaData[] = [];

  /**
   * Property `loadingMgr` (`LinkPreviewLoadingManager`) storing loading mgr (default: `new LinkPreviewLoadingManager()`).
   * @zh 属性 `loadingMgr`（类型：`LinkPreviewLoadingManager`），用于存储或配置加载中Mgr（默认值：`new LinkPreviewLoadingManager()`）。
   */
  private loadingMgr = new LinkPreviewLoadingManager();
  /**
   * Property `loadingSpinner` (`any`) storing loading spinner.
   * @zh 属性 `loadingSpinner`（类型：`any`），用于存储或配置加载中加载指示器。
   */
  public loadingSpinner ;
  /**
   * Property `showLoadingSpinner` (`boolean`) storing show loading spinner (default: `false`).
   * @zh 属性 `showLoadingSpinner`（类型：`boolean`），用于存储或配置显示加载中加载指示器（默认值：`false`）。
   */
  public showLoadingSpinner = false;

  /**
   * Property `subscriptions` (`Subscription[]`) storing subscriptions (default: `[]`).
   * @zh 属性 `subscriptions`（类型：`Subscription[]`），用于存储或配置订阅集合（默认值：`[]`）。
   */
  private subscriptions: Subscription[] = [];

  /**
   * Creates an instance of `LinkPreviewComponent` and initializes its dependencies and internal state.
   * @zh 创建 `LinkPreviewComponent` 实例，并初始化其依赖项与内部状态。
   * @param sanitizer - Injected or initial sanitizer (`DomSanitizer`) / 注入或传入的安全清理器（`DomSanitizer`）
   * @param cacheSvc - Injected or initial cache svc (`LinkPreviewCacheService`) / 注入或传入的缓存Svc（`LinkPreviewCacheService`）
   */
  constructor(private sanitizer: DomSanitizer, private cacheSvc: LinkPreviewCacheService) {
    this.subscribeLoadingMgrHasJobs();
   this. loadingSpinner = this.sanitizer.bypassSecurityTrustHtml(LinkPreviewLoadingSpinner)
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges(): void {
    this.init();
  }

  /**
   * Subscribe to loading manager has jobs stream

   * @zh 执行 `subscribeLoadingMgrHasJobs`，用于订阅加载中Mgr是否包含Jobs。
   */
  private subscribeLoadingMgrHasJobs(): void {
    this.subscriptions.push(
      this.loadingMgr.hasPendingJobs$.subscribe(hasJobs => {
        this.showLoadingSpinner = hasJobs;
      })
    );
  }

  /**
   * Property `requestSubscriptions` (`Subscription[]`) storing request subscriptions (default: `[]`).
   * @zh 属性 `requestSubscriptions`（类型：`Subscription[]`），用于存储或配置请求订阅集合（默认值：`[]`）。
   */
  private requestSubscriptions: Subscription[] = [];

  /**
   * Unsubscribe all subscriptions

   * @zh 执行 `unsubscribeAll`，用于取消订阅全部。
   */
  private unsubscribeAll(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.unsubscribeRequests();
  }

  /**
   * Executes `unsubscribeRequests` to handle unsubscribe requests.
   * @zh 执行 `unsubscribeRequests`，用于取消订阅请求。
   */
  private unsubscribeRequests(): void {
    this.requestSubscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.requestSubscriptions = [];
  }

  /**
   * Init preview

   * @zh 执行 `init`，用于初始化。
   */
  private init(): void {
    this.unsubscribeRequests();
    this.scannedLinks = [];
    this.previews = [];
    this.checkInputParameters();

    // Find links in string
    if (this.parseForLinksStr) {
      // Parse for links and push to links
      const links = this.parseStringForLinks(this.parseForLinksStr);
      this.scannedLinks = this.scannedLinks.concat(links);
    }
    // Add links passed as string[]
    if (this.links && this.links.length) {
      this.scannedLinks = this.scannedLinks.concat(this.links);
    }

    for (const link of this.scannedLinks) {
      this.loadCacheOrGet(link);
    }
  }

  /**
   * Load cache or get from api

   * @zh 执行 `loadCacheOrGet`，用于加载缓存Or获取。
   */
  private loadCacheOrGet(link: string): void {
    const encodedLink = this.encodeUrlSafe(link);
    const requestUrl = this.apiRoute + '?' + this.queryParamName + '=' + encodedLink;

    // Try to load from cache, use encodedLink as key
    const cacheItem = this.cacheSvc.getCacheItem(encodedLink);
    if (this.useCache && cacheItem && !this.isCacheOutdated(cacheItem)) {
      this.previews.push(cacheItem);
    } else {
      this.loadingMgr.addTask(encodedLink);
      const sub = this.getApiEndpoint$(requestUrl)
        .pipe(
          map((resp: OpenGraphMetaData) => {
            resp.timestampMs = new Date().valueOf();
            return resp;
          }),
          finalize(() => this.loadingMgr.removeTask(encodedLink))
        )
        .subscribe((resp: OpenGraphMetaData) => {
          this.cacheSvc.updateCacheItem(encodedLink, resp);
          this.previews.push(resp);
        });
      this.requestSubscriptions.push(sub);
    }
  }

  /**
   * Check if cache item is outdated by max-cache-age

   * @zh 执行 `isCacheOutdated`，用于是否为缓存Outdated。
   */
  private isCacheOutdated(item: OpenGraphMetaData): boolean {
    const now = new Date().valueOf();
    const maxValidTimestamp = now - this.maxCacheAgeMs;
    return maxValidTimestamp > item.timestampMs;
  }

  /**
   * On link click emit to EventEmitter

   * @zh 执行 `onLinkClick`，用于当链接点击。
   */
  public onLinkClick(url: string): void {
    this.previewClicked.emit(url);
  }
  /**
   * Executes `disableDefaultLink` to handle disable default link.
   * @zh 执行 `disableDefaultLink`，用于禁用默认链接。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  public disableDefaultLink(event: MouseEvent): void {
    if (!this.useHtmlLinkDefaultClickEvent) {
      event.preventDefault();
    }
  }

  /**
   * Encode string url safe

   * @zh 执行 `encodeUrlSafe`，用于编码链接地址安全。
   */
  private encodeUrlSafe(url: string): string {
    return encodeURI(btoa(url));
  }

  /**
   * Check required input parameters

   * @zh 执行 `checkInputParameters`，用于检查输入属性参数列表。
   */
  private checkInputParameters(): void {
    if (!this.apiRoute) {
      throw new Error('<link-preview></link-preview> Missing [apiRoute] input parameter');
    }
    if (!this.getApiEndpoint$) {
      throw new Error('<link-preview></link-preview> Missing [getApiEndpoint$] input parameter');
    }
  }

  /**
   * Parse string for links

   * @zh 执行 `parseStringForLinks`，用于解析字符串用于链接。
   */
  private parseStringForLinks(msg: string): string[] {
    const links = msg.match(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*)/gim
    );

    if (links) {
      return links;
    } else {
      return [];
    }
  }

  /**
   * Get sanitized image url due data often contains url errors

   * @zh 执行 `getSanitizedImageUrl`，用于获取Sanitized图像链接地址。
   */
  public getSanitizedImageUrl(p: OpenGraphMetaData): string {
    if (p['og:image']) {
      if (p['og:image'].startsWith('http')) {
        return p['og:image'];
      } else if (p['og:image'].startsWith('www')) {
        return p['og:image'];
      } else if (p['og:image'].startsWith('//www')) {
        return 'https://' + p['og:image'].slice(2);
      } else if (p['og:image'].startsWith('/yts/')) {
        return 'https://' + p.source + p['og:image'];
      }
    }
    return null;
  }
}
