/**
 * convert all properties in an interface to a number

 * @zh 类型别名 `Numberify`，表示Numberify（`{ [P in keyof T]: number; }`）。
 */
export type Numberify<T> = {
  [P in keyof T]: number;
};


/**
 * Interface `RGB` defining the contract and properties for rgb.
 * @zh 接口 `RGB`，定义RGB颜色的数据结构契约与属性规范。
 */
export interface RGB {
  /**
   * Property `r` (`string | number`) storing r.
   * @zh 属性 `r`（类型：`string | number`），用于存储或配置r。
   */
  r: number | string;
  /**
   * Property `g` (`string | number`) storing g.
   * @zh 属性 `g`（类型：`string | number`），用于存储或配置g。
   */
  g: number | string;
  /**
   * Property `b` (`string | number`) storing b.
   * @zh 属性 `b`（类型：`string | number`），用于存储或配置b。
   */
  b: number | string;
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
 * The HSL model describes colors in terms of hue, saturation,
 * and lightness (also called luminance).
 * @link https://en.wikibooks.org/wiki/Color_Models:_RGB,_HSV,_HSL#HSL

 * @zh 接口 `HSL`，定义HSL颜色的数据结构契约与属性规范。
 */
export interface HSL {
  /**
   * Property `h` (`string | number`) storing h.
   * @zh 属性 `h`（类型：`string | number`），用于存储或配置h。
   */
  h: number | string;
  /**
   * Property `s` (`string | number`) storing s.
   * @zh 属性 `s`（类型：`string | number`），用于存储或配置s。
   */
  s: number | string;
  /**
   * Property `l` (`string | number`) storing l.
   * @zh 属性 `l`（类型：`string | number`），用于存储或配置l。
   */
  l: number | string;
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
 * The HSV, or HSB, model describes colors in terms of
 * hue, saturation, and value (brightness).
 * @link https://en.wikibooks.org/wiki/Color_Models:_RGB,_HSV,_HSL#HSV

 * @zh 接口 `HSV`，定义HSV颜色的数据结构契约与属性规范。
 */
export interface HSV {
  /**
   * Property `h` (`string | number`) storing h.
   * @zh 属性 `h`（类型：`string | number`），用于存储或配置h。
   */
  h: number | string;
  /**
   * Property `s` (`string | number`) storing s.
   * @zh 属性 `s`（类型：`string | number`），用于存储或配置s。
   */
  s: number | string;
  /**
   * Property `v` (`string | number`) storing v.
   * @zh 属性 `v`（类型：`string | number`），用于存储或配置v。
   */
  v: number | string;
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
