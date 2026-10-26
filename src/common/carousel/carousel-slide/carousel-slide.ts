/**
 * @fileoverview Module `src/common/carousel/carousel-slide/carousel-slide.ts` providing carousel slide definitions and implementation.
 * @zh 模块文件 `src/common/carousel/carousel-slide/carousel-slide.ts`，提供carouselslide相关的定义与实现。
 */

import { SafeStyle } from '@angular/platform-browser';

/**
 * Interface `MatCarouselSlide` defining the contract and properties for mat carousel slide.
 * @zh 接口 `MatCarouselSlide`，定义MaterialCarouselSlide的数据结构契约与属性规范。
 */
export interface MatCarouselSlide {
  /**
   * Property `image` (`SafeStyle`) storing image.
   * @zh 属性 `image`（类型：`SafeStyle`），用于存储或配置图像。
   */
  image: SafeStyle;
  /**
   * Property `overlayColor` (`string`) storing overlay color.
   * @zh 属性 `overlayColor`（类型：`string`），用于存储或配置浮层颜色。
   */
  overlayColor: string;
  /**
   * Property `hideOverlay` (`boolean`) storing hide overlay.
   * @zh 属性 `hideOverlay`（类型：`boolean`），用于存储或配置隐藏浮层。
   */
  hideOverlay: boolean;
  /**
   * Property `disabled` (`boolean`) storing disabled.
   * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  disabled: boolean;
}
