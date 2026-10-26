/**
 * @fileoverview Module `src/common/icon-sprite/icon-sprite.directive.ts` providing icon sprite directive definitions and implementation.
 * @zh 模块文件 `src/common/icon-sprite/icon-sprite.directive.ts`，提供图标sprite指令相关的定义与实现。
 */

import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';


/**
 * Sets one or more arbitrary attributes on the host SVG element, given as
 * `[name, value]` tuple(s) via `attribute`.
 * @zh 通过 `attribute` 输入的 `[名称, 值]` 元组，为宿主 SVG 元素设置一个或多个任意属性。
 */
@Directive({
  selector: '[svgIconSpriteAttr]'
})
export class IconSpriteDirective implements OnInit {

  /**
   * One `[name, value]` attribute tuple, or an array of them, to set on the host SVG element.
   * @zh 一个 `[名称, 值]` 属性元组，或元组数组，用于设置到宿主 SVG 元素上。
   */
  @Input() attribute: [string, string] | Array<[string, string]>;

  /**
   * Creates an instance of `IconSpriteDirective` and initializes its dependencies and internal state.
   * @zh 创建 `IconSpriteDirective` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   */
  constructor(
    public renderer: Renderer2,
    public el: ElementRef
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    if (Array.isArray(this.attribute[0])) {
      const attributeArr = this.attribute as Array<[string, string]>;

      attributeArr.forEach((obj) => {
        this.renderer.setAttribute(this.el.nativeElement, obj[0], obj[1] ? obj[1] : '');
      });
    } else {
      const attribute = this.attribute as [string, string];

      if (attribute[0]) {
        this.renderer.setAttribute(this.el.nativeElement, attribute[0], attribute[1] ? attribute[1] : '');
      }
    }
  }
}
