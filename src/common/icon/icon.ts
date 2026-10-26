/**
 * @fileoverview Module `src/common/icon/icon.ts` providing icon definitions and implementation.
 * @zh 模块文件 `src/common/icon/icon.ts`，提供图标相关的定义与实现。
 */

/**
 * Class `Icon` encapsulating icon data structures and logic in `src/common/icon`.
 * @zh 类 `Icon`，封装 `src/common/icon` 中的图标数据结构与处理逻辑。
 */
export class Icon {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `id` (`string`) storing id.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id?: string;
  /**
   * Property `filter` (`string[]`) storing filter.
   * @zh 属性 `filter`（类型：`string[]`），用于存储或配置过滤。
   */
  filter?: string[];
  /**
   * Property `aliases` (`string[]`) storing aliases.
   * @zh 属性 `aliases`（类型：`string[]`），用于存储或配置aliases。
   */
  aliases?: string[];
  /**
   * Property `type` (`IconType`) storing type.
   * @zh 属性 `type`（类型：`IconType`），用于存储或配置类型。
   */
  type?: IconType;
}

/**
 * Class `SVGIcon` encapsulating svg icon data structures and logic in `src/common/icon`.
 * @zh 类 `SVGIcon`，封装 `src/common/icon` 中的SVG矢量图图标数据结构与处理逻辑。
 */
export class SVGIcon {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `url` (`string`) storing url.
   * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址。
   */
  url: string;
  /**
   * Property `style` (`any`) storing style.
   * @zh 属性 `style`（类型：`any`），用于存储或配置样式。
   */
  style?;
}

/**
 * Enumeration `IconType` defining supported icon type constants.
 * @zh 枚举 `IconType`，定义支持的图标类型常量集合。
 */
export enum IconType {
  /**
   * Enum member `IconType.FONT` representing font.
   * @zh 枚举项 `IconType.FONT`，表示字体。
   */
  FONT,
  /**
   * Enum member `IconType.SVG` representing svg.
   * @zh 枚举项 `IconType.SVG`，表示SVG矢量图。
   */
  SVG
}
