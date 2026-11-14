/**
 * @fileoverview Module `src/common/inline-svg/inline-svg.directive.ts` providing inline svg directive definitions and implementation.
 * @zh 模块文件 `src/common/inline-svg/inline-svg.directive.ts`，提供inlineSVG矢量图指令相关的定义与实现。
 */

import {
  ComponentRef, Directive, ElementRef, EventEmitter, Inject,
  Input,OnChanges,OnDestroy,OnInit,Optional,Output,PLATFORM_ID,Renderer2,SimpleChanges, ViewContainerRef,
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Subscription } from 'rxjs';

import { InlineSVGComponent } from './inline-svg.component';
import { SVGCacheService } from './svg-cache.service';
import { InlineSVGService } from './inline-svg.service';
import { SVGScriptEvalMode, InlineSVGConfig } from './inline-svg.config';
import * as SvgUtil from './svg-util';

/**
 * Fetches an SVG file by URL and inlines its markup into the DOM (instead of using `<img>`),
 * so its internal styles/scripts run and its parts can be targeted with CSS.
 * @zh 按 URL 获取 SVG 文件并将其内容内联插入 DOM（而不是使用 `<img>`），
 * 这样其内部样式/脚本可以生效，且各部分可以被 CSS 选中。
 */
@Directive({
  selector: '[inlineSVG]',
  providers: [SVGCacheService],
  standalone: false
})
export class InlineSVGDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * URL (or `url#symbolId`) of the SVG to inline.
   * @zh 待内联的 SVG 的 URL（或 `url#symbolId`）。
   */
  @Input() inlineSVG: string;
  /**
   * @zh 是否解析相对 URL。
   * @zh 是否解析相对 URL。
   */
  @Input() resolveSVGUrl: boolean = true;
  /**
   * @zh 插入新 SVG 前是否替换宿主元素原有内容。
   * @zh 插入新 SVG 前是否替换宿主元素原有内容。
   */
  @Input() replaceContents: boolean = true;
  /**
   * Input property `prepend` (`boolean`) configuring prepend (default: `false`).
   * @zh 前置插入而不是追加。
   * @zh 前置插入而不是追加。
   */
  @Input() prepend: boolean = false;
  /**
   * @zh 是否以 {@link InlineSVGComponent} 组件形式注入（而不是直接操作 DOM）。
   * @zh 是否以 {@link InlineSVGComponent} 组件形式注入（而不是直接操作 DOM）。
   */
  @Input() injectComponent: boolean = false;
  /**
   * @zh 是否缓存已获取的 SVG 内容，避免重复请求相同 URL。
   * @zh 是否缓存已获取的 SVG 内容，避免重复请求相同 URL。
   */
  @Input() cacheSVG: boolean = true;
  /**
   * @zh 加载完成后设置到 SVG 根元素上的属性键值对。
   * @zh 加载完成后设置到 SVG 根元素上的属性键值对。
   */
  @Input() setSVGAttributes: { [key: string]: unknown };
  /**
   * @zh 加载完成后从 SVG 根元素上移除的属性名列表。
   * @zh 加载完成后从 SVG 根元素上移除的属性名列表。
   */
  @Input() removeSVGAttributes: Array<string>;
  /**
   * @zh 是否强制重新求值 SVG 内的 `<style>` 标签（部分浏览器插入后不生效时使用）。
   * @zh 是否强制重新求值 SVG 内的 `<style>` 标签（部分浏览器插入后不生效时使用）。
   */
  @Input() forceEvalStyles: boolean = false;
  /**
   * @zh SVG 内联 `<script>` 的执行策略：`always`/`once`/`never`。
   * @zh SVG 内联 `<script>` 的执行策略：`always`/`once`/`never`。
   */
  @Input() evalScripts: SVGScriptEvalMode = SVGScriptEvalMode.NEVER;
  /**
   * @zh 加载失败时回退显示的 `<img>` URL。
   * @zh 加载失败时回退显示的 `<img>` URL。
   */
  @Input() fallbackImgUrl: string;
  /**
   * @zh SVG 加载完成后的回调，可返回替换后的元素以自定义处理结果。
   * @zh SVG 加载完成后的回调，可返回替换后的元素以自定义处理结果。
   */
  @Input() onSVGLoaded: (svg: SVGElement, parent: Element | null) => SVGElement;

  /**
   * @zh SVG 成功插入 DOM 后发出。
   * @zh SVG 成功插入 DOM 后发出。
   */
  @Output() onSVGInserted: EventEmitter<SVGElement> = new EventEmitter<SVGElement>();
  /**
   * @zh SVG 加载/插入失败时发出错误信息。
   * @zh SVG 加载/插入失败时发出错误信息。
   */
  @Output() onSVGFailed = new EventEmitter();

  /**
   * Property `_prevSVG` (`SVGElement`) storing prev svg.
   * @internal
   * @zh 属性 `_prevSVG`（类型：`SVGElement`），用于存储或配置前一个SVG矢量图。
   */
  _prevSVG: SVGElement;

  /**
   * Property `_supportsSVG` (`boolean`) storing supports svg.
   * @zh 属性 `_supportsSVG`（类型：`boolean`），用于存储或配置supportsSVG矢量图。
   */
  private _supportsSVG: boolean;
  /**
   * Property `_prevUrl` (`string`) storing prev url.
   * @zh 属性 `_prevUrl`（类型：`string`），用于存储或配置前一个链接地址。
   */
  private _prevUrl: string;
  /**
   * Property `_svgComp` (`ComponentRef<InlineSVGComponent>`) storing svg comp.
   * @zh 属性 `_svgComp`（类型：`ComponentRef<InlineSVGComponent>`），用于存储或配置SVG矢量图组件。
   */
  private _svgComp: ComponentRef<InlineSVGComponent>;

  /**
   * Property `_subscription` (`Subscription`) storing subscription.
   * @zh 属性 `_subscription`（类型：`Subscription`），用于存储或配置订阅对象。
   */
  private _subscription: Subscription;

  /**
   * Creates an instance of `InlineSVGDirective` and initializes its dependencies and internal state.
   * @zh 创建 `InlineSVGDirective` 实例，并初始化其依赖项与内部状态。
   * @param _el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param _viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   * @param _resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param _svgCache - Injected or initial svg cache (`SVGCacheService`) / 注入或传入的SVG矢量图缓存（`SVGCacheService`）
   * @param _renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _inlineSVGService - Injected or initial inline svg service (`InlineSVGService`) / 注入或传入的inlineSVG矢量图服务（`InlineSVGService`）
   * @param _config - Injected or initial config (`InlineSVGConfig`) / 注入或传入的配置（`InlineSVGConfig`）
   * @param platformId - Injected or initial platform id (`Object`) / 注入或传入的platform唯一标识（`Object`）
   */
  constructor(
    private _el: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _svgCache: SVGCacheService,
    private _renderer: Renderer2,
    private _inlineSVGService: InlineSVGService,
    @Optional() private _config: InlineSVGConfig,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this._supportsSVG = SvgUtil.isSvgSupported();

    // Check if the browser supports embed SVGs
    if (!isPlatformServer(this.platformId) && !this._supportsSVG) {
      this._fail('Embed SVG are not supported by this browser');
    }
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    if (!this._isValidPlatform() || this._isSSRDisabled()) { return; }
    this._insertSVG();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this._isValidPlatform() || this._isSSRDisabled()) { return; }
    if (changes['inlineSVG'] || changes['setSVGAttributes']) {
      this._insertSVG();
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  /**
   * Executes `_insertSVG` to handle insert svg.
   * @zh 执行 `_insertSVG`，用于插入SVG矢量图。
   */
  private _insertSVG(): void {
    if (!isPlatformServer(this.platformId) && !this._supportsSVG) { return; }
    if (!this.inlineSVG) {
      this._fail('No URL passed to [inlineSVG]');
      return;
    }
    if (this.inlineSVG === this._prevUrl) {
      return;
    }
    this._prevUrl = this.inlineSVG;

    this._subscription = this._svgCache.getSVG(this.inlineSVG, this.resolveSVGUrl, this.cacheSVG)
      .subscribe(
        (svg: SVGElement) => {

          if (SvgUtil.isUrlSymbol(this.inlineSVG)) {
            const symbolId = this.inlineSVG.split('#')[1];
            svg = SvgUtil.createSymbolSvg(this._renderer, svg, symbolId);
          }
          this._processSvg(svg);
        },
        (err) => {
          this._fail(err);
        }
      );
  }

  /**
   * Executes `_processSvg` to handle process svg.
   * @zh 执行 `_processSvg`，用于处理SVG矢量图。
   * @param svg - svg parameter (`SVGElement`) / SVG矢量图参数（`SVGElement`）
   */
  private _processSvg(svg: SVGElement) {
    if (!svg) { return; }

    if (this.removeSVGAttributes && isPlatformBrowser(this.platformId)) {
      SvgUtil.removeAttributes(svg, this.removeSVGAttributes);
    }

    if (this.setSVGAttributes) {
      SvgUtil.setAttributes(svg, this.setSVGAttributes);
    }

    if (this.onSVGLoaded) {
      svg = this.onSVGLoaded(svg, this._el.nativeElement);
    }

    this._insertEl(svg);

    if (isPlatformBrowser(this.platformId)) {
      this._inlineSVGService.evalScripts(svg, this.inlineSVG, this.evalScripts);
    }

    if (this.forceEvalStyles) {
      const styleTags = svg.querySelectorAll('style');
      Array.from(styleTags).forEach(tag => tag.textContent += '');
    }

    this.onSVGInserted.emit(svg);
  }

  /**
   * Executes `_insertEl` to handle insert el.
   * @zh 执行 `_insertEl`，用于插入DOM元素。
   * @param el - el parameter (`HTMLElement | SVGElement`) / DOM元素参数（`HTMLElement | SVGElement`）
   */
  private _insertEl(el: HTMLElement | SVGElement): void {
    if (this.injectComponent) {
      if (!this._svgComp) {
        this._svgComp = this._viewContainerRef.createComponent(InlineSVGComponent);
      }

      this._svgComp.instance.context = this;
      this._svgComp.instance.replaceContents = this.replaceContents;
      this._svgComp.instance.prepend = this.prepend;
      this._svgComp.instance.content = el;

      // Force element to be inside the directive element inside of adjacent
      this._renderer.appendChild(
        this._el.nativeElement,
        this._svgComp.injector.get(InlineSVGComponent)._el.nativeElement
      );
    } else {
      this._inlineSVGService.insertEl(this, this._el.nativeElement, el, this.replaceContents, this.prepend);
    }
  }

  /**
   * Executes `_fail` to handle fail.
   * @zh 执行 `_fail`，用于失败。
   * @param msg - msg parameter (`string`) / msg参数（`string`）
   */
  private _fail(msg: string): void {
    this.onSVGFailed.emit(msg);
    if (this.fallbackImgUrl) {
      const elImg = this._renderer.createElement('IMG');
      this._renderer.setAttribute(elImg, 'src', this.fallbackImgUrl);
      this._insertEl(elImg);
    }
  }

  /**
   * Executes `_isValidPlatform` to handle is valid platform.
   * @zh 执行 `_isValidPlatform`，用于是否为有效Platform。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private _isValidPlatform(): boolean {
    return isPlatformServer(this.platformId) || isPlatformBrowser(this.platformId);
  }

  /**
   * Executes `_isSSRDisabled` to handle is ssr disabled.
   * @zh 执行 `_isSSRDisabled`，用于是否为SSR已禁用。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private _isSSRDisabled(): boolean {
    return isPlatformServer(this.platformId) && this._config && this._config.clientOnly;
  }
}
