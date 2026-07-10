import {AfterViewInit,ChangeDetectionStrategy,Component,ElementRef,Input,OnChanges, SimpleChanges} from '@angular/core';
import { InlineSVGDirective } from './inline-svg.directive';
import { InlineSVGService } from './inline-svg.service';

/**
 * Internal host component that {@link InlineSVGDirective} injects (via `injectComponent`)
 * to render fetched SVG content as an actual child component rather than raw DOM insertion.
 * @zh {@link InlineSVGDirective} 在设置 `injectComponent` 时注入的内部宿主组件，
 * 用于将获取到的 SVG 内容作为真正的子组件渲染，而不是直接插入原始 DOM。
 */
@Component({
  selector: 'inline-svg',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineSVGComponent implements AfterViewInit, OnChanges {
  /** @zh 触发注入此组件的 {@link InlineSVGDirective} 实例。 */
  @Input() context: InlineSVGDirective;
  /** @zh 待插入的 SVG/HTML 内容元素。 */
  @Input() content: HTMLElement | SVGElement;
  /** @zh 插入内容前是否替换宿主原有内容。 */
  @Input() replaceContents: boolean;
  /** @zh 前置插入而不是追加。 */
  @Input() prepend: boolean;

  /** @internal */
  _el: ElementRef;

  constructor(private _inlineSVGService: InlineSVGService, el: ElementRef) {
    this._el = el;
  }

  ngAfterViewInit(): void {
    this._updateContent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this._updateContent();
    }
  }

  private _updateContent(): void {
    this._inlineSVGService.insertEl(
      this.context,
      this._el.nativeElement,
      this.content,
      this.replaceContents,
      this.prepend
    );
  }
}
