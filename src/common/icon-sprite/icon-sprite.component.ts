/**
 * @fileoverview Module `src/common/icon-sprite/icon-sprite.component.ts` providing icon sprite component definitions and implementation.
 * @zh 模块文件 `src/common/icon-sprite/icon-sprite.component.ts`，提供图标sprite组件相关的定义与实现。
 */

import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
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
  templateUrl: './icon-sprite.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class IconSpriteComponent implements OnChanges {

  /**
   * The icon reference: either `symbolId` (resolved against {@link IconSpriteService}'s base
   * path) or a full `url#symbolId` string.
   * @zh 图标引用：可以是 `symbolId`（基于 {@link IconSpriteService} 的基础路径解析），
   * 也可以是完整的 `url#symbolId` 字符串。
   */
  @Input() public src: string;
  /**
   * @zh 应用到宿主 SVG 元素上的 CSS 类名。
   * @zh 应用到宿主 SVG 元素上的 CSS 类名。
   */
  @Input() public classes = 'icon';
  /**
   * @zh SVG 的宽度。
   * @zh SVG 的宽度。
   */
  @Input() public width = '100%';
  /**
   * @zh SVG 的高度。
   * @zh SVG 的高度。
   */
  @Input() public height: string;
  /**
   * @zh SVG 的 `viewBox` 属性。
   * @zh SVG 的 `viewBox` 属性。
   */
  @Input() public viewBox: string;
  /**
   * @zh SVG 的 `preserveAspectRatio` 属性。
   * @zh SVG 的 `preserveAspectRatio` 属性。
   */
  @Input() public preserveAspectRatio = 'xMinYMax meet';
  /**
   * One `[name, value]` attribute tuple, or an array of them, to set on the rendered SVG element.
   * @zh 一个 `[名称, 值]` 属性元组，或元组数组，用于设置到渲染出的 SVG 元素上。
   */
  @Input() public attribute: [string, string] | Array<[string, string]>;
  /**
   * @zh SVG 的无障碍标题（`<title>` 文本）。
   * @zh SVG 的无障碍标题（`<title>` 文本）。
   */
  @Input() public title: string;
  /**
   * Creates an instance of `IconSpriteComponent` and initializes its dependencies and internal state.
   * @zh 创建 `IconSpriteComponent` 实例，并初始化其依赖项与内部状态。
   * @param iconSpriteService - Injected or initial icon sprite service (`IconSpriteService`) / 注入或传入的图标Sprite服务（`IconSpriteService`）
   */
  constructor(
    private iconSpriteService: IconSpriteService
  ) {}
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    if (this.src && !this.src.includes('#') && this.iconSpriteService.spritePath) {
      this.src = `${ this.iconSpriteService.getPath() }#${ this.src }`;
    }
  }
}
