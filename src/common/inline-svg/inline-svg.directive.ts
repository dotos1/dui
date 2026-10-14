import {
  ComponentFactoryResolver, ComponentRef,Directive, ElementRef,EventEmitter,Inject,
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
  providers: [SVGCacheService]
})
export class InlineSVGDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * URL (or `url#symbolId`) of the SVG to inline.
   * @zh 待内联的 SVG 的 URL（或 `url#symbolId`）。
   */
  @Input() inlineSVG: string;
  /** @zh 是否解析相对 URL。 */
  @Input() resolveSVGUrl: boolean = true;
  /** @zh 插入新 SVG 前是否替换宿主元素原有内容。 */
  @Input() replaceContents: boolean = true;
  /** @zh 前置插入而不是追加。 */
  @Input() prepend: boolean = false;
  /** @zh 是否以 {@link InlineSVGComponent} 组件形式注入（而不是直接操作 DOM）。 */
  @Input() injectComponent: boolean = false;
  /** @zh 是否缓存已获取的 SVG 内容，避免重复请求相同 URL。 */
  @Input() cacheSVG: boolean = true;
  /** @zh 加载完成后设置到 SVG 根元素上的属性键值对。 */
  @Input() setSVGAttributes: { [key: string]: any };
  /** @zh 加载完成后从 SVG 根元素上移除的属性名列表。 */
  @Input() removeSVGAttributes: Array<string>;
  /** @zh 是否强制重新求值 SVG 内的 `<style>` 标签（部分浏览器插入后不生效时使用）。 */
  @Input() forceEvalStyles: boolean = false;
  /** @zh SVG 内联 `<script>` 的执行策略：`always`/`once`/`never`。 */
  @Input() evalScripts: SVGScriptEvalMode = SVGScriptEvalMode.NEVER;
  /** @zh 加载失败时回退显示的 `<img>` URL。 */
  @Input() fallbackImgUrl: string;
  /** @zh SVG 加载完成后的回调，可返回替换后的元素以自定义处理结果。 */
  @Input() onSVGLoaded: (svg: SVGElement, parent: Element | null) => SVGElement;

  /** @zh SVG 成功插入 DOM 后发出。 */
  @Output() onSVGInserted: EventEmitter<SVGElement> = new EventEmitter<SVGElement>();
  /** @zh SVG 加载/插入失败时发出错误信息。 */
  @Output() onSVGFailed: EventEmitter<any> = new EventEmitter<any>();

  /** @internal */
  _prevSVG: SVGElement;

  private _supportsSVG: boolean;
  private _prevUrl: string;
  private _svgComp: ComponentRef<InlineSVGComponent>;

  private _subscription: Subscription;

  constructor(
    private _el: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _resolver: ComponentFactoryResolver,
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

  ngOnInit(): void {
    if (!this._isValidPlatform() || this._isSSRDisabled()) { return; }
    this._insertSVG();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._isValidPlatform() || this._isSSRDisabled()) { return; }
    if (changes['inlineSVG'] || changes['setSVGAttributes']) {
      this._insertSVG();
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

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
        (err: any) => {
          this._fail(err);
        }
      );
  }

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

  private _insertEl(el: HTMLElement | SVGElement): void {
    if (this.injectComponent) {
      if (!this._svgComp) {
        const factory = this._resolver.resolveComponentFactory(InlineSVGComponent);
        this._svgComp = this._viewContainerRef.createComponent(factory);
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

  private _fail(msg: string): void {
    this.onSVGFailed.emit(msg);
    if (this.fallbackImgUrl) {
      const elImg = this._renderer.createElement('IMG');
      this._renderer.setAttribute(elImg, 'src', this.fallbackImgUrl);
      this._insertEl(elImg);
    }
  }

  private _isValidPlatform(): boolean {
    return isPlatformServer(this.platformId) || isPlatformBrowser(this.platformId);
  }

  private _isSSRDisabled(): boolean {
    return isPlatformServer(this.platformId) && this._config && this._config.clientOnly;
  }
}
