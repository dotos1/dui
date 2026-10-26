/**
 * @fileoverview Module `src/common/inline-svg/inline-svg.component.ts` providing inline svg component definitions and implementation.
 * @zh 模块文件 `src/common/inline-svg/inline-svg.component.ts`，提供inlineSVG矢量图组件相关的定义与实现。
 */

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
  /**
   * @zh 触发注入此组件的 {@link InlineSVGDirective} 实例。
   * @zh 触发注入此组件的 {@link InlineSVGDirective} 实例。
   */
  @Input() context: InlineSVGDirective;
  /**
   * @zh 待插入的 SVG/HTML 内容元素。
   * @zh 待插入的 SVG/HTML 内容元素。
   */
  @Input() content: HTMLElement | SVGElement;
  /**
   * Input property `replaceContents` (`boolean`) configuring replace contents.
   * @zh 插入内容前是否替换宿主原有内容。
   * @zh 插入内容前是否替换宿主原有内容。
   */
  @Input() replaceContents: boolean;
  /**
   * Input property `prepend` (`boolean`) configuring prepend.
   * @zh 前置插入而不是追加。
   * @zh 前置插入而不是追加。
   */
  @Input() prepend: boolean;

  /**
   * Property `_el` (`ElementRef`) storing el.
   * @internal
   * @zh 属性 `_el`（类型：`ElementRef`），用于存储或配置DOM元素。
   */
  _el: ElementRef;

  /**
   * Creates an instance of `InlineSVGComponent` and initializes its dependencies and internal state.
   * @zh 创建 `InlineSVGComponent` 实例，并初始化其依赖项与内部状态。
   * @param _inlineSVGService - Injected or initial inline svg service (`InlineSVGService`) / 注入或传入的inlineSVG矢量图服务（`InlineSVGService`）
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   */
  constructor(private _inlineSVGService: InlineSVGService, el: ElementRef) {
    this._el = el;
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    this._updateContent();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this._updateContent();
    }
  }

  /**
   * Executes `_updateContent` to handle update content.
   * @zh 执行 `_updateContent`，用于更新内容。
   */
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
