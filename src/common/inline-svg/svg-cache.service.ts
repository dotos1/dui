/**
 * @fileoverview Module `src/common/inline-svg/svg-cache.service.ts` providing svg cache service definitions and implementation.
 * @zh 模块文件 `src/common/inline-svg/svg-cache.service.ts`，提供SVG矢量图缓存服务相关的定义与实现。
 */

import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, map, share } from 'rxjs/operators';
import { InlineSVGConfig } from './inline-svg.config';
import { parseSanitizedSvg } from '@dotos1/dui/base';

/**
 * Injectable Angular service `SVGCacheService` managing svg cache service state and operations in `src/common/inline-svg`.
 * @zh 可注入的 Angular 服务 `SVGCacheService`，管理 `src/common/inline-svg` 中的SVG矢量图缓存服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class SVGCacheService {
  /**
   * Property `_cache` (`Map<string, SVGElement>`) storing cache.
   * @zh 属性 `_cache`（类型：`Map<string, SVGElement>`），用于存储或配置缓存。
   */
  private static _cache: Map<string, SVGElement>;
  /**
   * Property `_inProgressReqs` (`Map<string, Observable<SVGElement>>`) storing in progress reqs.
   * @zh 属性 `_inProgressReqs`（类型：`Map<string, Observable<SVGElement>>`），用于存储或配置在进度条请求。
   */
  private static _inProgressReqs: Map<string, Observable<SVGElement>>;

  /**
   * Property `_imageCache` (`any`) storing image cache.
   * @zh 属性 `_imageCache`（类型：`any`），用于存储或配置图像缓存。
   */
  private static _imageCache;
  /**
   * Property `_imageInProgressReqs` (`any`) storing image in progress reqs.
   * @zh 属性 `_imageInProgressReqs`（类型：`any`），用于存储或配置图像在进度条请求。
   */
  private static _imageInProgressReqs;

  /**
   * Property `_baseUrl` (`string`) storing base url.
   * @zh 属性 `_baseUrl`（类型：`string`），用于存储或配置基础链接地址。
   */
  private _baseUrl: string;

  /**
   * Property `_http` (`HttpClient`) storing http.
   * @zh 属性 `_http`（类型：`HttpClient`），用于存储或配置HTTP。
   */
  private _http: HttpClient;
  /**
   * Property `_renderer` (`Renderer2`) storing renderer.
   * @zh 属性 `_renderer`（类型：`Renderer2`），用于存储或配置渲染器。
   */
  private _renderer: Renderer2;

  /**
   * Creates an instance of `SVGCacheService` and initializes its dependencies and internal state.
   * @zh 创建 `SVGCacheService` 实例，并初始化其依赖项与内部状态。
   * @param _appBase - Injected or initial app base (`string`) / 注入或传入的app基础（`string`）
   * @param _location - Injected or initial location (`PlatformLocation`) / 注入或传入的location（`PlatformLocation`）
   * @param _config - Injected or initial config (`InlineSVGConfig`) / 注入或传入的配置（`InlineSVGConfig`）
   * @param httpClient - Injected or initial http client (`HttpClient`) / 注入或传入的HTTPClient（`HttpClient`）
   * @param httpBackend - Injected or initial http backend (`HttpBackend`) / 注入或传入的HTTPBackend（`HttpBackend`）
   * @param rendererFactory - Injected or initial renderer factory (`RendererFactory2`) / 注入或传入的渲染器工厂（`RendererFactory2`）
   */
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
      SVGCacheService._imageCache = new Map<string, unknown>();
    }
    if (!SVGCacheService._imageInProgressReqs) {
      SVGCacheService._imageInProgressReqs = new Map<string, Observable<unknown>>();
    }
  }

  /**
   * Fetches (or returns the cached/in-flight) raw image resource text at the given URL.
   * @zh 获取（或返回缓存/正在进行中）给定 URL 处的原始图像资源文本。
   */
  getImage(url: string, resolveImageUrl: boolean, cache: boolean = true) {
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
          SVGCacheService._imageInProgressReqs.delete(imageUrl);
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

  /**
   * Executes `_svgElementFromString` to handle svg element from string.
   * @zh 执行 `_svgElementFromString`，用于SVG矢量图元素从字符串。
   * @param str - str parameter (`string`) / 字符串参数（`string`）
   * @returns Result of type `SVGElement` / 类型为 `SVGElement` 的返回值
   */
  private _svgElementFromString(str: string): SVGElement | never {
    // 先解析、净化,再进活文档(b8c5e5c 复核)。那次提交是先 div.innerHTML = str
    // 再净化:innerHTML 那一刻 <img src=x onerror=…> 之类已经在当前文档里创建并
    // 开始加载,事后再删属性来不及。现在在 DOMParser 的惰性文档里完成,规则
    // (含 <set attributeName="href">、带空白的 javascript:)见 sanitize-dom.ts。
    const svg = parseSanitizedSvg(str);
    if (!svg) {
      throw new Error('No SVG found in loaded contents');
    }
    return svg;
  }

  /**
   * Executes `_cloneSVG` to handle clone svg.
   * @zh 执行 `_cloneSVG`，用于克隆SVG矢量图。
   * @param svg - svg parameter (`SVGElement`) / SVG矢量图参数（`SVGElement`）
   * @returns Result of type `SVGElement` / 类型为 `SVGElement` 的返回值
   */
  private _cloneSVG(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
  }
}
