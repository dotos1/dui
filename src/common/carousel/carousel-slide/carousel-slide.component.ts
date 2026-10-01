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
  /** @zh 幻灯片背景图片 URL。 */
  @Input() public image: SafeStyle;
  /** @zh 悬浮遮罩的颜色。 */
  @Input() public overlayColor = '#00000040';
  /** @zh 隐藏悬浮遮罩。 */
  @Input() public hideOverlay = false;
  /** @zh 禁用该幻灯片（跳过键盘导航）。 */
  @Input() public disabled = false;

  /** @zh 该幻灯片投影内容的模板引用。 */
  @ViewChild(TemplateRef) public templateRef: TemplateRef<any>;
    
  constructor(public sanitizer: DomSanitizer) {
  }

  public ngOnInit(): void {
    if (this.image) {
      this.image = this.sanitizer.bypassSecurityTrustStyle(`url("${this.image}")`);
    }
  }
}
