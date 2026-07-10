import { Component, Input, OnChanges } from '@angular/core';
import { IconSpriteService } from './icon-sprite.service';

/**
 * Renders an SVG icon from a sprite sheet via `<use>`. If `src` doesn't already
 * contain a `#symbolId` fragment, it's resolved against {@link IconSpriteService}'s base path.
 * @zh 通过 `<use>` 从雪碧图（sprite sheet）中渲染 SVG 图标。若 `src` 尚未包含 `#symbolId` 片段，
 * 则会基于 {@link IconSpriteService} 的基础路径进行解析。
 */
@Component({
  selector: 'svg-icon-sprite',
  styleUrls: ['./icon-sprite.component.scss'],
  templateUrl: './icon-sprite.component.html'
})
export class IconSpriteComponent implements OnChanges {

  @Input() public src: string;
  @Input() public classes = 'icon';
  @Input() public width = '100%';
  @Input() public height: string;
  @Input() public viewBox: string;
  @Input() public preserveAspectRatio = 'xMinYMax meet';
  @Input() public attribute: [string, string] | Array<[string, string]>;
  @Input() public title: string;
  constructor(
    private iconSpriteService: IconSpriteService
  ) {}
  ngOnChanges() {
    if (this.src && !this.src.includes('#') && this.iconSpriteService.spritePath) {
      this.src = `${ this.iconSpriteService.getPath() }#${ this.src }`;
    }
  }
}
