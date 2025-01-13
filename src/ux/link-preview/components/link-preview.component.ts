import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { OpenGraphMetaData } from '../interfaces/open-graph-meta-data';
import { LinkPreviewCacheService } from '../services/link-preview-cache.service';
import { LinkPreviewLoadingManager } from '../services/link-preview-loading.manager';
import { LinkPreviewLoadingSpinner } from './link-preview-loading-spinner';

type HtmlLinkTarget = '_blank' | '_self' | '_parent' | '_top' | FrameName;
type FrameName = string;

@Component({
  selector: 'link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.scss']
})
export class LinkPreviewComponent implements OnChanges, OnDestroy {
  /** Plain links string array */
  @Input()
  public links: string[] = [];

  /** Input string to parse for links */
  @Input()
  public parseForLinksStr: string;

  /** Method that does the API request, provide as class member arrow function from parent */
  @Input()
  public getApiEndpoint$: (requestUrl: string) => Observable<any>;

  /** API route where to get the meta data from, component will build the full request url
   * Schema: api.example.com/api/get-meta-data?url=d3d3LmV4YW1wbGUuY29t
   */
  @Input()
  public apiRoute: string;

  /** Target url will be attached as encodeURI(btoa(url)), so it must be decoded on the server */
  @Input()
  public queryParamName = 'url';

  /** boolean: show image in preview */
  @Input()
  public showImage = true;

  /** boolean: show site name in preview */
  @Input()
  public showSiteName = true;

  /** boolean: show title in preview */
  @Input()
  public showTitle = true;

  /** boolean: show description in preview */
  @Input()
  public showDescription = true;

  /** boolean: show link url in preview */
  @Input()
  public showLinkUrl = false;

  /** boolean: use cache to display previews faster on next rendering */
  @Input()
  public useCache = true;

  /** number: max age the data cache of a link preview should be used */
  @Input()
  public maxCacheAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days

  /** boolean: show loading indicator */
  @Input()
  public showLoadingIndicator = true;

  /**
   * boolean: whether the <a href="..."></a> link should be clickable.
   * This is a question of context security. Otherwise use (previewClick) event.
   */
  @Input()
  public useHtmlLinkDefaultClickEvent = false;

  /**
   * HtmlLinkTarget: where the HTML link should be opened on click.
   * Only has an effect if [useHtmlLinkDefaultClickEvent]="true"
   */
  @Input()
  public htmlLinkTarget: HtmlLinkTarget = '_blank';

  /** Event emitter: on click to handle the click event, emits the clicked URL */
  @Output()
  public previewClicked = new EventEmitter<string>();

  /** Scanned links[] from @Input() links & @Input() parseForLinks */
  private scannedLinks: string[] = [];

  /** Array of metadata objects where the preview is rendered from */
  public previews: OpenGraphMetaData[] = [];

  private loadingMgr = new LinkPreviewLoadingManager();
  public loadingSpinner = this.sanitizer.bypassSecurityTrustHtml(LinkPreviewLoadingSpinner);
  public showLoadingSpinner = false;

  private subscriptions: Subscription[] = [];

  constructor(private sanitizer: DomSanitizer, private cacheSvc: LinkPreviewCacheService) {
    this.subscribeLoadingMgrHasJobs();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  ngOnChanges(): void {
    this.init();
  }

  /**
   * Subscribe to loading manager has jobs stream
   */
  private subscribeLoadingMgrHasJobs(): void {
    this.subscriptions.push(
      this.loadingMgr.hasPendingJobs$.subscribe(hasJobs => {
        this.showLoadingSpinner = hasJobs;
      })
    );
  }

  /**
   * Unsubscribe all subscriptions
   */
  private unsubscribeAll(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  /**
   * Init preview
   */
  private init(): void {
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
      this.getApiEndpoint$(requestUrl)
        .pipe(
          map((resp: OpenGraphMetaData) => {
            resp.timestampMs = new Date().valueOf();
            return resp;
          })
        )
        .subscribe((resp: OpenGraphMetaData) => {
          this.cacheSvc.updateCacheItem(encodedLink, resp);
          this.loadingMgr.removeTask(encodedLink);
          this.previews.push(resp);
        });
    }
  }

  /**
   * Check if cache item is outdated by max-cache-age
   */
  private isCacheOutdated(item: OpenGraphMetaData): boolean {
    const now = new Date().valueOf();
    const maxValidTimestamp = now - this.maxCacheAgeMs;
    return maxValidTimestamp > item.timestampMs;
  }

  /**
   * On link click emit to EventEmitter
   */
  public onLinkClick(url: string): void {
    this.previewClicked.emit(url);
  }
  public disableDefaultLink(event: MouseEvent): void {
    if (!this.useHtmlLinkDefaultClickEvent) {
      event.preventDefault();
    }
  }

  /**
   * Encode string url safe
   */
  private encodeUrlSafe(url: string): string {
    return encodeURI(btoa(url));
  }

  /**
   * Check required input parameters
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
