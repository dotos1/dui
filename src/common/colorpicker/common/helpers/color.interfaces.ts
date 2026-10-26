/**
 * @fileoverview Module `src/common/colorpicker/common/helpers/color.interfaces.ts` providing color interfaces definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/helpers/color.interfaces.ts`，提供颜色interfaces相关的定义与实现。
 */

/**
 * Interface `RGB` defining the contract and properties for rgb.
 * @zh 接口 `RGB`，定义RGB颜色的数据结构契约与属性规范。
 */
export interface RGB {
  /**
   * Property `r` (`number`) storing r.
   * @zh 属性 `r`（类型：`number`），用于存储或配置r。
   */
  r: number;
  /**
   * Property `g` (`number`) storing g.
   * @zh 属性 `g`（类型：`number`），用于存储或配置g。
   */
  g: number;
  /**
   * Property `b` (`number`) storing b.
   * @zh 属性 `b`（类型：`number`），用于存储或配置b。
   */
  b: number;
}

/**
 * Interface `RGBA` defining the contract and properties for rgba.
 * @zh 接口 `RGBA`，定义RGBA颜色的数据结构契约与属性规范。
 */
export interface RGBA extends RGB {
  /**
   * Property `a` (`number`) storing a.
   * @zh 属性 `a`（类型：`number`），用于存储或配置a。
   */
  a: number;
}

/**
 * Interface `HSL` defining the contract and properties for hsl.
 * @zh 接口 `HSL`，定义HSL颜色的数据结构契约与属性规范。
 */
export interface HSL {
  /**
   * Property `h` (`number`) storing h.
   * @zh 属性 `h`（类型：`number`），用于存储或配置h。
   */
  h: number;
  /**
   * Property `s` (`number`) storing s.
   * @zh 属性 `s`（类型：`number`），用于存储或配置s。
   */
  s: number;
  /**
   * Property `l` (`number`) storing l.
   * @zh 属性 `l`（类型：`number`），用于存储或配置l。
   */
  l: number;
}

/**
 * Interface `HSLA` defining the contract and properties for hsla.
 * @zh 接口 `HSLA`，定义HSLA颜色的数据结构契约与属性规范。
 */
export interface HSLA extends HSL {
  /**
   * Property `a` (`number`) storing a.
   * @zh 属性 `a`（类型：`number`），用于存储或配置a。
   */
  a: number;
}

/**
 * Interface `HSV` defining the contract and properties for hsv.
 * @zh 接口 `HSV`，定义HSV颜色的数据结构契约与属性规范。
 */
export interface HSV {
  /**
   * Property `h` (`number`) storing h.
   * @zh 属性 `h`（类型：`number`），用于存储或配置h。
   */
  h: number;
  /**
   * Property `s` (`number`) storing s.
   * @zh 属性 `s`（类型：`number`），用于存储或配置s。
   */
  s: number;
  /**
   * Property `v` (`number`) storing v.
   * @zh 属性 `v`（类型：`number`），用于存储或配置v。
   */
  v: number;
}

/**
 * Interface `HSVA` defining the contract and properties for hsva.
 * @zh 接口 `HSVA`，定义HSVA的数据结构契约与属性规范。
 */
export interface HSVA extends HSV {
  /**
   * Property `a` (`number`) storing a.
   * @zh 属性 `a`（类型：`number`），用于存储或配置a。
   */
  a: number;
}

/**
 * Interface `HSVAsource` defining the contract and properties for hsv asource.
 * @zh 接口 `HSVAsource`，定义HSV颜色Asource的数据结构契约与属性规范。
 */
export interface HSVAsource extends HSVA {
  /**
   * Property `source` (`string`) storing source.
   * @zh 属性 `source`（类型：`string`），用于存储或配置源。
   */
  source: string;
}

/**
 * Interface `HSLAsource` defining the contract and properties for hsl asource.
 * @zh 接口 `HSLAsource`，定义HSL颜色Asource的数据结构契约与属性规范。
 */
export interface HSLAsource extends HSLA {
  /**
   * Property `source` (`string`) storing source.
   * @zh 属性 `source`（类型：`string`），用于存储或配置源。
   */
  source: string;
}

/**
 * Interface `Color` defining the contract and properties for color.
 * @zh 接口 `Color`，定义颜色的数据结构契约与属性规范。
 */
export interface Color {
  /**
   * Property `hex` (`string`) storing hex.
   * @zh 属性 `hex`（类型：`string`），用于存储或配置十六进制颜色。
   */
  hex: string;
  /**
   * Property `rgb` (`RGBA`) storing rgb.
   * @zh 属性 `rgb`（类型：`RGBA`），用于存储或配置RGB颜色。
   */
  rgb: RGBA;
  /**
   * Property `hsl` (`HSLA`) storing hsl.
   * @zh 属性 `hsl`（类型：`HSLA`），用于存储或配置HSL颜色。
   */
  hsl: HSLA;
  /**
   * Property `hsv` (`HSVA`) storing hsv.
   * @zh 属性 `hsv`（类型：`HSVA`），用于存储或配置HSV颜色。
   */
  hsv: HSVA;
  /**
   * Property `oldHue` (`number`) storing old hue.
   * @zh 属性 `oldHue`（类型：`number`），用于存储或配置旧色相。
   */
  oldHue: number;
  /**
   * Property `source` (`string`) storing source.
   * @zh 属性 `source`（类型：`string`），用于存储或配置源。
   */
  source: string;
}

/**
 * Interface `Shape` defining the contract and properties for shape.
 * @zh 接口 `Shape`，定义图形的数据结构契约与属性规范。
 */
export interface Shape {
  /**
   * Property `color` (`string`) storing color.
   * @zh 属性 `color`（类型：`string`），用于存储或配置颜色。
   */
  color: string;
  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  title: string;
}
