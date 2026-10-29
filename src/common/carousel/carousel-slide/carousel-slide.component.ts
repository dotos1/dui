/**
 * @fileoverview Module `src/common/carousel/carousel-slide/carousel-slide.component.ts` providing carousel slide component definitions and implementation.
 * @zh 模块文件 `src/common/carousel/carousel-slide/carousel-slide.component.ts`，提供carouselslide组件相关的定义与实现。
 */

import { ListKeyManagerOption } from '@angular/cdk/a11y';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MatCarouselSlide } from './carousel-slide';

/**
 * A single slide projected into {@link MatCarouselComponent}.
 * @zh 投影进 {@link MatCarouselComponent} 的单张幻灯片。
 */
@Component({
  selector: 'mat-carousel-slide',
  templateUrl: './carousel-slide.component.html',
  styleUrls: ['./carousel-slide.component.scss']
})
export class MatCarouselSlideComponent
  implements ListKeyManagerOption, MatCarouselSlide, OnInit {
  /**
   * @zh 幻灯片背景图片 URL。
   * @zh 幻灯片背景图片 URL。
   */
  @Input() public image: SafeStyle;
  /**
   * Input property `overlayColor` (`string`) configuring overlay color (default: `'#00000040'`).
   * @zh 悬浮遮罩的颜色。
   * @zh 悬浮遮罩的颜色。
   */
  @Input() public overlayColor = '#00000040';
  /**
   * Input property `hideOverlay` (`boolean`) configuring hide overlay (default: `false`).
   * @zh 隐藏悬浮遮罩。
   * @zh 隐藏悬浮遮罩。
   */
  @Input() public hideOverlay = false;
  /**
   * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
   * @zh 禁用该幻灯片（跳过键盘导航）。
   * @zh 禁用该幻灯片（跳过键盘导航）。
   */
  @Input() public disabled = false;

  /**
   * Template/content query reference `templateRef` (`TemplateRef<unknown>`) targeting template ref.
   * @zh 该幻灯片投影内容的模板引用。
   * @zh 该幻灯片投影内容的模板引用。
   */
  @ViewChild(TemplateRef) public templateRef: TemplateRef<unknown>;
    
  /**
   * Creates an instance of `MatCarouselSlideComponent` and initializes its dependencies and internal state.
   * @zh 创建 `MatCarouselSlideComponent` 实例，并初始化其依赖项与内部状态。
   * @param sanitizer - Injected or initial sanitizer (`DomSanitizer`) / 注入或传入的安全清理器（`DomSanitizer`）
   */
  constructor(public sanitizer: DomSanitizer) {
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  public ngOnInit(): void {
    if (this.image) {
      this.image = this.sanitizer.bypassSecurityTrustStyle(`url("${this.image}")`);
    }
  }
}
