/**
 * @fileoverview Module `src/common/inline-svg/inline-svg.service.ts` providing inline svg service definitions and implementation.
 * @zh 模块文件 `src/common/inline-svg/inline-svg.service.ts`，提供inlineSVG矢量图服务相关的定义与实现。
 */

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { InlineSVGDirective } from './inline-svg.directive';
import { SVGScriptEvalMode } from './inline-svg.config';

/**
 * Low-level DOM insertion and inline `<script>` evaluation helper used by
 * {@link InlineSVGDirective}/{@link InlineSVGComponent}.
 * @zh {@link InlineSVGDirective}/{@link InlineSVGComponent} 使用的底层 DOM 插入与内联 `<script>` 执行辅助服务。
 */
@Injectable({
  providedIn: 'root'
})
export class InlineSVGService {

  /**
   * Property `_renderer` (`Renderer2`) storing renderer.
   * @zh 属性 `_renderer`（类型：`Renderer2`），用于存储或配置渲染器。
   */
  private _renderer: Renderer2;
  /**
   * Property `_ranScripts` (`{ [url: string]: boolean; }`) storing ran scripts (default: `{}`).
   * @zh 属性 `_ranScripts`（类型：`{ [url: string]: boolean; }`），用于存储或配置ranScripts（默认值：`{}`）。
   */
  private _ranScripts: { [url: string]: boolean } = {};

  /**
   * Creates an instance of `InlineSVGService` and initializes its dependencies and internal state.
   * @zh 创建 `InlineSVGService` 实例，并初始化其依赖项与内部状态。
   * @param rendererFactory - Injected or initial renderer factory (`RendererFactory2`) / 注入或传入的渲染器工厂（`RendererFactory2`）
   */
  constructor(rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Inserts the given content element into the parent element, optionally replacing existing
   * content or prepending instead of appending; tracks the previously-inserted SVG for cleanup.
   * @zh 将给定的内容元素插入父元素中，可选地替换现有内容或前置插入而非追加；
   * 跟踪上一次插入的 SVG 以便后续清理。
   */
  insertEl(
    dir: InlineSVGDirective,
    parentEl: HTMLElement,
    content: HTMLElement | SVGElement,
    replaceContents: boolean,
    prepend: boolean) {
    if (replaceContents && !prepend) {
      const parentNode = dir._prevSVG && dir._prevSVG.parentNode;
      if (parentNode) {
        this._renderer.removeChild(parentNode, dir._prevSVG);
      }

      parentEl.innerHTML = '';
    }

    if (prepend) {
      this._renderer.insertBefore(parentEl, content, parentEl.firstChild);
    } else {
      this._renderer.appendChild(parentEl, content);
    }

    if (content.nodeName === 'svg') {
      dir._prevSVG = content as SVGElement;
    }
  }


  /**
   * Extracts and executes the `<script>` tags found inside the given SVG, honoring the
   * `always`/`once`/`never` eval mode.
   * @zh 提取并执行给定 SVG 内的 `<script>` 标签，遵循 `always`/`once`/`never` 求值模式。
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  evalScripts(svg: SVGElement, url: string, evalMode: string): void {
    const scripts = svg.querySelectorAll('script');

    // Strip scripts from SVG for security
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].parentNode) {
        this._renderer.removeChild(scripts[i].parentNode, scripts[i]);
      }
    }
  }

}
