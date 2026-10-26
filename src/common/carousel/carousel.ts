/**
 * @fileoverview Module `src/common/carousel/carousel.ts` providing carousel definitions and implementation.
 * @zh 模块文件 `src/common/carousel/carousel.ts`，提供carousel相关的定义与实现。
 */

import { ThemePalette } from '@angular/material/core';

/**
 * Interface `MatCarousel` defining the contract and properties for mat carousel.
 * @zh 接口 `MatCarousel`，定义MaterialCarousel的数据结构契约与属性规范。
 */
export interface MatCarousel {
  // Animations.
  /**
   * Property `timings` (`string`) storing timings.
   * @zh 属性 `timings`（类型：`string`），用于存储或配置timings。
   */
  timings: string;
  /**
   * Property `autoplay` (`boolean`) storing autoplay.
   * @zh 属性 `autoplay`（类型：`boolean`），用于存储或配置autoplay。
   */
  autoplay: boolean;
  /**
   * Property `interval` (`number`) storing interval.
   * @zh 属性 `interval`（类型：`number`），用于存储或配置间隔定时器。
   */
  interval: number;
  // Navigation.
  /**
   * Property `loop` (`boolean`) storing loop.
   * @zh 属性 `loop`（类型：`boolean`），用于存储或配置loop。
   */
  loop: boolean;
  /**
   * Property `hideArrows` (`boolean`) storing hide arrows.
   * @zh 属性 `hideArrows`（类型：`boolean`），用于存储或配置隐藏箭头。
   */
  hideArrows: boolean;
  /**
   * Property `hideIndicators` (`boolean`) storing hide indicators.
   * @zh 属性 `hideIndicators`（类型：`boolean`），用于存储或配置隐藏指示器。
   */
  hideIndicators: boolean;
  // Appearance.
  /**
   * Property `color` (`ThemePalette`) storing color.
   * @zh 属性 `color`（类型：`ThemePalette`），用于存储或配置颜色。
   */
  color: ThemePalette;
  /**
   * Property `maxWidth` (`string`) storing max width.
   * @zh 属性 `maxWidth`（类型：`string`），用于存储或配置最大值宽度。
   */
  maxWidth: string;
  /**
   * Property `proportion` (`number`) storing proportion.
   * @zh 属性 `proportion`（类型：`number`），用于存储或配置proportion。
   */
  proportion: number;
  /**
   * Property `slides` (`number`) storing slides.
   * @zh 属性 `slides`（类型：`number`），用于存储或配置slides。
   */
  slides: number;
  /**
   * Property `svgIconOverrides` (`SvgIconOverrides`) storing svg icon overrides.
   * @zh 属性 `svgIconOverrides`（类型：`SvgIconOverrides`），用于存储或配置SVG矢量图图标Overrides。
   */
  svgIconOverrides: SvgIconOverrides;
  // Accessibility.
  /**
   * Property `useKeyboard` (`boolean`) storing use keyboard.
   * @zh 属性 `useKeyboard`（类型：`boolean`），用于存储或配置使用键盘。
   */
  useKeyboard: boolean;
  /**
   * Property `useMouseWheel` (`boolean`) storing use mouse wheel.
   * @zh 属性 `useMouseWheel`（类型：`boolean`），用于存储或配置使用鼠标滚轮。
   */
  useMouseWheel: boolean;
  /**
   * Property `orientation` (`Orientation`) storing orientation.
   * @zh 属性 `orientation`（类型：`Orientation`），用于存储或配置方向。
   */
  orientation: Orientation;
}

/**
 * Type alias `Orientation` representing orientation (`'ltr' | 'rtl'`).
 * @zh 类型别名 `Orientation`，表示方向（`'ltr' | 'rtl'`）。
 */
export type Orientation = 'ltr' | 'rtl';
/**
 * Interface `SvgIconOverrides` defining the contract and properties for svg icon overrides.
 * @zh 接口 `SvgIconOverrides`，定义SVG矢量图图标Overrides的数据结构契约与属性规范。
 */
export interface SvgIconOverrides {
  /**
   * Property `arrowBack` (`string`) storing arrow back.
   * @zh 属性 `arrowBack`（类型：`string`），用于存储或配置箭头返回。
   */
  arrowBack: string;
  /**
   * Property `arrowForward` (`string`) storing arrow forward.
   * @zh 属性 `arrowForward`（类型：`string`），用于存储或配置箭头向前。
   */
  arrowForward: string;
}
