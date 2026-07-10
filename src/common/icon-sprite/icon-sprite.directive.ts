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

  @Input() attribute: [string, string] | Array<[string, string]>;

  constructor(
    public renderer: Renderer2,
    public el: ElementRef
  ) {}

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
