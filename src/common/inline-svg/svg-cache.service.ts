import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, map, share } from 'rxjs/operators';
import { InlineSVGConfig } from './inline-svg.config';

@Injectable({
  providedIn: 'root'
})
export class SVGCacheService {
  private static _cache: Map<string, SVGElement>;
  private static _inProgressReqs: Map<string, Observable<SVGElement>>;

  private static _imageCache: Map<string, any>;
  private static _imageInProgressReqs: Map<string, Observable<any>>;

  private _baseUrl: string;

  private _http: HttpClient;
  private _renderer: Renderer2;

  constructor(
    @Optional() @Inject(APP_BASE_HREF) private _appBase: string,
    @Optional() private _location: PlatformLocation,
    @Optional() private _config: InlineSVGConfig,
    httpClient: HttpClient,
    httpBackend: HttpBackend,
    rendererFactory: RendererFactory2
  ) {
    this._http = _config && !_config.bypassHttpClientInterceptorChain
      ? httpClient
      : new HttpClient(httpBackend);

    this._renderer = rendererFactory.createRenderer(null, null);

    this.setBaseUrl();

    if (!SVGCacheService._cache) {
      SVGCacheService._cache = new Map<string, SVGElement>();
    }
    if (!SVGCacheService._inProgressReqs) {
      SVGCacheService._inProgressReqs = new Map<string, Observable<SVGElement>>();
    }

    if (!SVGCacheService._imageCache) {
      SVGCacheService._imageCache = new Map<string, any>();
    }
    if (!SVGCacheService._imageInProgressReqs) {
      SVGCacheService._imageInProgressReqs = new Map<string, Observable<any>>();
    }
  }

  /**
   * Fetches (or returns the cached/in-flight) raw image resource text at the given URL.
   * @zh 获取（或返回缓存/正在进行中）给定 URL 处的原始图像资源文本。
   */
  getImage(url: string, resolveImageUrl: boolean, cache: boolean = true): Observable<any> {
    const imageUrl = (resolveImageUrl ? this.getAbsoluteUrl(url) : url).replace(/#.+$/, '');
    if (cache && SVGCacheService._imageCache.has(imageUrl)) {
      return of(SVGCacheService._imageCache.get(imageUrl));
    }
    if (SVGCacheService._imageInProgressReqs.has(imageUrl)) {
      return SVGCacheService._imageInProgressReqs.get(imageUrl);
    }
    const req = this._http.get(imageUrl, { responseType: 'text' })
      .pipe(
        finalize(() => {
          SVGCacheService._inProgressReqs.delete(imageUrl);
        }),
        share(),
        map((res: string) => {
          SVGCacheService._imageCache.set(imageUrl, res);
          return res;
        })
      );
    SVGCacheService._imageInProgressReqs.set(imageUrl, req);
    return req;
  }

  /**
   * Fetches (or returns a clone of the cached/in-flight) parsed SVG element at the given URL.
   * @zh 获取（或返回缓存/正在进行中的已解析 SVG 元素的克隆）给定 URL 处的 SVG。
   */
  getSVG(url: string, resolveSVGUrl: boolean, cache: boolean = true): Observable<SVGElement> {
    const svgUrl = (resolveSVGUrl
      ? this.getAbsoluteUrl(url)
      : url).replace(/#.+$/, '');
    if (cache && SVGCacheService._cache.has(svgUrl)) {
      return of(this._cloneSVG(SVGCacheService._cache.get(svgUrl)));
    }

    if (SVGCacheService._inProgressReqs.has(svgUrl)) {
      return SVGCacheService._inProgressReqs.get(svgUrl);
    }
    const req = this._http.get(svgUrl, { responseType: 'text' })
      .pipe(
        finalize(() => {
          SVGCacheService._inProgressReqs.delete(svgUrl);
        }),
        share(),
        map((svgText: string) => {

          const svgEl = this._svgElementFromString(svgText);
          SVGCacheService._cache.set(svgUrl, svgEl);
          return this._cloneSVG(svgEl);
        })
      );
    SVGCacheService._inProgressReqs.set(svgUrl, req);
    return req;
  }

  /**
   * Resolves and caches the base URL used to make relative SVG/image URLs absolute
   * (from injected config, `APP_BASE_HREF`, or the document's `<base>` tag).
   * @zh 解析并缓存用于将相对 SVG/图片 URL 转为绝对路径的基础 URL
   * （来自注入的配置、`APP_BASE_HREF`，或文档的 `<base>` 标签）。
   */
  setBaseUrl(): void {
    if (this._config) {
      this._baseUrl = this._config.baseUrl;
    } else if (this._appBase !== null) {
      this._baseUrl = this._appBase;
    } else if (this._location !== null) {
      this._baseUrl = this._location.getBaseHrefFromDOM();
    }
  }

  /**
   * Resolves the given URL to an absolute URL using the cached base URL.
   * @zh 使用缓存的基础 URL，将给定 URL 解析为绝对路径。
   */
  getAbsoluteUrl(url: string): string {
    if (this._baseUrl && !/^https?:\/\//i.test(url)) {
      url = this._baseUrl + url;
      if (url.indexOf('//') === 0) {
        url = url.substring(1);
      }
    }
    const base = this._renderer.createElement('BASE');
    base.href = url;
    return base.href;
  }

  private _svgElementFromString(str: string): SVGElement | never {
    const div = this._renderer.createElement('DIV');
    div.innerHTML = str;
    const svg = div.querySelector('svg') as SVGElement;
    if (!svg) {
      throw new Error('No SVG found in loaded contents');
    }
    return svg;
  }

  private _cloneSVG(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
  }
}
