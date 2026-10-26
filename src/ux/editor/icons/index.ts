/**
 * @fileoverview Module `src/ux/editor/icons/index.ts` providing index definitions and implementation.
 * @zh 模块文件 `src/ux/editor/icons/index.ts`，提供索引相关的定义与实现。
 */

// Icons source: https://material.io/

import bold from './bold';
import italic from './italic';
import code from './code';
import underline from './underline';
import strike from './strike';
import orderedList from './ordered_list';
import bulletList from './bullet_list';
import quote from './quote';
import link from './link';
import unlink from './unlink';
import image from './image';
import alignLeft from './align_left';
import alignCenter from './align_center';
import alignRight from './align_right';
import alignJustify from './align_justify';
import textColor from './text_color';
import colorFill from './color_fill';
import horizontalRule from './horizontal_rule';
import formatClear from './format_clear';

/**
 * Constant/variable `DEFAULT_ICON_HEIGHT` defining default icon height in `src/ux/editor/icons`.
 * @zh 常量/变量 `DEFAULT_ICON_HEIGHT`，定义 `src/ux/editor/icons` 中的默认图标高度。
 */
const DEFAULT_ICON_HEIGHT = 20;
/**
 * Constant/variable `DEFAULT_ICON_WIDTH` defining default icon width in `src/ux/editor/icons`.
 * @zh 常量/变量 `DEFAULT_ICON_WIDTH`，定义 `src/ux/editor/icons` 中的默认图标宽度。
 */
const DEFAULT_ICON_WIDTH = 20;
/**
 * Constant/variable `DEFAULT_ICON_FILL` defining default icon fill in `src/ux/editor/icons`.
 * @zh 常量/变量 `DEFAULT_ICON_FILL`，定义 `src/ux/editor/icons` 中的默认图标填充。
 */
const DEFAULT_ICON_FILL = 'currentColor';

/**
 * Constant/variable `icons` defining icons in `src/ux/editor/icons`.
 * @zh 常量/变量 `icons`，定义 `src/ux/editor/icons` 中的图标集合。
 */
const icons = {
  bold,
  italic,
  code,
  underline,
  strike,
  ordered_list: orderedList,
  bullet_list: bulletList,
  blockquote: quote,
  link,
  unlink,
  image,
  align_left: alignLeft,
  align_center: alignCenter,
  align_right: alignRight,
  align_justify: alignJustify,
  text_color: textColor,
  color_fill: colorFill,
  horizontal_rule: horizontalRule,
  format_clear: formatClear,
};

/**
 * Class `Icon` encapsulating icon data structures and logic in `src/ux/editor/icons`.
 * @zh 类 `Icon`，封装 `src/ux/editor/icons` 中的图标数据结构与处理逻辑。
 */
class Icon {
  /**
   * Executes `get` to handle get.
   * @zh 执行 `get`，用于获取。
   * @param name - name parameter (`keyof typeof icons`) / 名称参数（`keyof typeof icons`）
   * @param fill - fill parameter (`any`) / 填充参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  static get(name: string, fill = DEFAULT_ICON_FILL): string {
    const path = icons[name] || '<path></path>';
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill=${fill}
        height=${DEFAULT_ICON_HEIGHT}
        width=${DEFAULT_ICON_WIDTH}
      >
        ${path}
      </svg>
    `;
  }
}

export default Icon;
