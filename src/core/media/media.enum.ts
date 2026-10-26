/**
 * @fileoverview Module `src/core/media/media.enum.ts` providing media enum definitions and implementation.
 * @zh 模块文件 `src/core/media/media.enum.ts`，提供媒体enum相关的定义与实现。
 */

/**
 * Enumeration `Media` defining supported media constants.
 * @zh 枚举 `Media`，定义支持的媒体常量集合。
 */
export enum Media {
  /**
   * Enum member `Media.Mobile` = 'mobile' representing mobile.
   * @zh 枚举项 `Media.Mobile` = 'mobile'，表示Mobile。
   */
  Mobile = 'mobile',
  /**
   * Enum member `Media.Tablet` = 'tablet' representing tablet.
   * @zh 枚举项 `Media.Tablet` = 'tablet'，表示Tablet。
   */
  Tablet = 'tablet',
  /**
   * Enum member `Media.Desktop` = 'desktop' representing desktop.
   * @zh 枚举项 `Media.Desktop` = 'desktop'，表示Desktop。
   */
  Desktop = 'desktop'
}

/**
 * Enumeration `MediaOrientation` defining supported media orientation constants.
 * @zh 枚举 `MediaOrientation`，定义支持的媒体方向常量集合。
 */
export enum MediaOrientation {
  /**
   * Enum member `MediaOrientation.Portrait` = 'portrait' representing portrait.
   * @zh 枚举项 `MediaOrientation.Portrait` = 'portrait'，表示Portrait。
   */
  Portrait = 'portrait',
  /**
   * Enum member `MediaOrientation.Landscape` = 'landscape' representing landscape.
   * @zh 枚举项 `MediaOrientation.Landscape` = 'landscape'，表示Landscape。
   */
  Landscape = 'landscape'
}

/**
 * Constant/variable `MediaBreakpoints` defining media breakpoints in `src/core/media`.
 * @zh 常量/变量 `MediaBreakpoints`，定义 `src/core/media` 中的媒体Breakpoints。
 */
export const MediaBreakpoints = {
  xs: 'screen and (max-width: 599px)',
  sm: 'screen and (min-width: 600px) and (max-width: 959px)',
  md: 'screen and (min-width: 960px) and (max-width: 1279px)',
  lg: 'screen and (min-width: 1280px) and (max-width: 1919px)',
  xl: 'screen and (min-width: 1920px) and (max-width: 5000px)',
  'lt-sm': 'screen and (max-width: 599px)',
  'lt-md': 'screen and (max-width: 959px)',
  'lt-lg': 'screen and (max-width: 1279px)',
  'lt-xl': 'screen and (max-width: 1919px)',
  'gt-xs': 'screen and (min-width: 600px)',
  'gt-sm': 'screen and (min-width: 960px)',
  'gt-md': 'screen and (min-width: 1280px)',
  'gt-lg': 'screen and (min-width: 1920px)',
  'gt-xl': 'screen and (min-width: 5001px)',
  'md-lg': 'screen and (min-width: 960px) and (max-width: 1819px)'
};