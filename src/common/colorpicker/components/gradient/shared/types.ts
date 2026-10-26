/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/shared/types.ts` providing types definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/shared/types.ts`，提供类型列表相关的定义与实现。
 */

/**
 * Type alias `ColorsProps` representing colors props (`{ value: string index?: number left?: number }`).
 * @zh 类型别名 `ColorsProps`，表示颜色列表属性集合（`{ value: string index?: number left?: number }`）。
 */
export type ColorsProps = {
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string
  /**
   * Property `index` (`number`) storing index.
   * @zh 属性 `index`（类型：`number`），用于存储或配置索引。
   */
  index?: number
  /**
   * Property `left` (`number`) storing left.
   * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
   */
  left?: number
}

/**
 * Type alias `GradientProps` representing gradient props (`{ value: string index: number left: number }`).
 * @zh 类型别名 `GradientProps`，表示渐变属性集合（`{ value: string index: number left: number }`）。
 */
export type GradientProps = {
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string
  /**
   * Property `index` (`number`) storing index.
   * @zh 属性 `index`（类型：`number`），用于存储或配置索引。
   */
  index: number
  /**
   * Property `left` (`number`) storing left.
   * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
   */
  left: number
}

/**
 * Type alias `LocalesProps` representing locales props (`{ CONTROLS: controlsProps }`).
 * @zh 类型别名 `LocalesProps`，表示本地属性集合（`{ CONTROLS: controlsProps }`）。
 */
export type LocalesProps = {
  /**
   * Property `CONTROLS` (`controlsProps`) storing controls.
   * @zh 属性 `CONTROLS`（类型：`controlsProps`），用于存储或配置控件集合。
   */
  CONTROLS: controlsProps
}

/**
 * Type alias `controlsProps` representing controls props (`{ SOLID: string GRADIENT: string }`).
 * @zh 类型别名 `controlsProps`，表示控件集合属性集合（`{ SOLID: string GRADIENT: string }`）。
 */
type controlsProps = {
  /**
   * Property `SOLID` (`string`) storing solid.
   * @zh 属性 `SOLID`（类型：`string`），用于存储或配置SOLID。
   */
  SOLID: string
  /**
   * Property `GRADIENT` (`string`) storing gradient.
   * @zh 属性 `GRADIENT`（类型：`string`），用于存储或配置渐变。
   */
  GRADIENT: string
}

/**
 * Type alias `ThemeProps` representing theme props (`{ light: ThemeMode dark: ThemeMode }`).
 * @zh 类型别名 `ThemeProps`，表示主题属性集合（`{ light: ThemeMode dark: ThemeMode }`）。
 */
export type ThemeProps = {
  /**
   * Property `light` (`ThemeMode`) storing light.
   * @zh 属性 `light`（类型：`ThemeMode`），用于存储或配置浅色。
   */
  light: ThemeMode
  /**
   * Property `dark` (`ThemeMode`) storing dark.
   * @zh 属性 `dark`（类型：`ThemeMode`），用于存储或配置深色。
   */
  dark: ThemeMode
}

/**
 * Type alias `ThemeMode` representing theme mode (`{ color?: string background?: string highlights?: string accent?: stri...`).
 * @zh 类型别名 `ThemeMode`，表示主题模式（`{ color?: string background?: string highlights?: string accent?: stri...`）。
 */
export type ThemeMode = {
  /**
   * Property `color` (`string`) storing color.
   * @zh 属性 `color`（类型：`string`），用于存储或配置颜色。
   */
  color?: string
  /**
   * Property `background` (`string`) storing background.
   * @zh 属性 `background`（类型：`string`），用于存储或配置背景。
   */
  background?: string
  /**
   * Property `highlights` (`string`) storing highlights.
   * @zh 属性 `highlights`（类型：`string`），用于存储或配置highlights。
   */
  highlights?: string
  /**
   * Property `accent` (`string`) storing accent.
   * @zh 属性 `accent`（类型：`string`），用于存储或配置强调色。
   */
  accent?: string
}
