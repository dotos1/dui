/**
 * @fileoverview Module `src/ux/editor/Locals.ts` providing locals definitions and implementation.
 * @zh 模块文件 `src/ux/editor/Locals.ts`，提供本地相关的定义与实现。
 */

/**
 * Constant/variable `defaults` defining defaults in `src/ux/editor`.
 * @zh 常量/变量 `defaults`，定义 `src/ux/editor` 中的默认值集合。
 */
export const defaults: Record<string, string> = {
  // menu
  bold: 'Bold',
  italic: 'Italic',
  code: 'Code',
  underline: 'Underline',
  strike: 'Strike',
  blockquote: 'Blockquote',
  bullet_list: 'Bullet List',
  ordered_list: 'Ordered List',
  heading: 'Heading',
  h1: 'Header 1',
  h2: 'Header 2',
  h3: 'Header 3',
  h4: 'Header 4',
  h5: 'Header 5',
  h6: 'Header 6',
  align_left: 'Left Align',
  align_center: 'Center Align',
  align_right: 'Right Align',
  align_justify: 'Justify',
  text_color: 'Text Color',
  background_color: 'Background Color',
  horizontal_rule: 'Horizontal rule',
  format_clear: 'Clear Formatting',
  insertLink: 'Insert Link',
  removeLink: 'Remove Link',
  insertImage: 'Insert Image',

  // pupups, forms, others...
  url: 'URL',
  text: 'Text',
  openInNewTab: 'Open in new tab',
  insert: 'Insert',
  altText: 'Alt Text',
  title: 'Title',
  remove: 'Remove',
};

/**
 * Type alias `LocalsKeys` representing locals keys (`keyof typeof defaults`).
 * @zh 类型别名 `LocalsKeys`，表示本地键列表（`keyof typeof defaults`）。
 */
export type LocalsKeys = keyof typeof defaults;

/**
 * Class `Locals` encapsulating locals data structures and logic in `src/ux/editor`.
 * @zh 类 `Locals`，封装 `src/ux/editor` 中的本地数据结构与处理逻辑。
 */
class Locals {
  /**
   * Property `locals` (`any`) storing locals (default: `defaults`).
   * @zh 属性 `locals`（类型：`any`），用于存储或配置本地（默认值：`defaults`）。
   */
  locals = defaults;

  /**
   * Creates an instance of `Locals` and initializes its dependencies and internal state.
   * @zh 创建 `Locals` 实例，并初始化其依赖项与内部状态。
   * @param newLocals - Injected or initial new locals (`Partial<Record<LocalsKeys, string>>`) / 注入或传入的新本地（`Partial<Record<LocalsKeys, string>>`）
   */
  constructor(newLocals: Partial<Record<LocalsKeys, string>> = {}) {
    this.locals = { ...defaults, ...newLocals };
  }

  /**
   * Property `get` (`any`) storing get.
   * @zh 属性 `get`（类型：`any`），用于存储或配置获取。
   */
  get = (key: string):string => {
    return this.locals[key] ?? '';
  };
}

export default Locals;
