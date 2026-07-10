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

  private _renderer: Renderer2;
  private _ranScripts: { [url: string]: boolean } = {};

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
  evalScripts(svg: SVGElement, url: string, evalMode: string): void {
    const scripts = svg.querySelectorAll('script');
    const scriptsToEval = [];

    // Fetch scripts from SVG
    for (let i = 0; i < scripts.length; i++) {
      const scriptType = scripts[i].getAttribute('type');

      if (!scriptType || scriptType === 'application/ecmascript' || scriptType === 'application/javascript') {
        const script = scripts[i].innerText || scripts[i].textContent;
        scriptsToEval.push(script);
        this._renderer.removeChild(scripts[i].parentNode, scripts[i]);
      }
    }

    // Run scripts in closure as needed
    if (scriptsToEval.length > 0 && (evalMode === SVGScriptEvalMode.ALWAYS ||
      (evalMode === SVGScriptEvalMode.ONCE && !this._ranScripts[url]))) {
      for (let i = 0; i < scriptsToEval.length; i++) {
        new Function(scriptsToEval[i])(window);
      }

      this._ranScripts[url] = true;
    }
  }

}
