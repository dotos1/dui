/**
 * @fileoverview Module `src/ux/editor/commands/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */

import Mark from './Mark';
import Blockquote from './Blockquote';
import HorizontalRule from './HorizontalRule';
import ListItem from './ListItem';
import Heading from './Heading';
import TextAlign from './TextAlign';
import Link from './Link';
import Image from './Image';
import TextColor from './TextColor';
import FormatClear from './FormatClear';

/**
 * Constant/variable `STRONG` defining strong in `src/ux/editor/commands`.
 * @zh 常量/变量 `STRONG`，定义 `src/ux/editor/commands` 中的STRONG。
 */
export const STRONG = new Mark('strong');
/**
 * Constant/variable `EM` defining em in `src/ux/editor/commands`.
 * @zh 常量/变量 `EM`，定义 `src/ux/editor/commands` 中的EM。
 */
export const EM = new Mark('em');
/**
 * Constant/variable `CODE` defining code in `src/ux/editor/commands`.
 * @zh 常量/变量 `CODE`，定义 `src/ux/editor/commands` 中的编码。
 */
export const CODE = new Mark('code');
/**
 * Constant/variable `UNDERLINE` defining underline in `src/ux/editor/commands`.
 * @zh 常量/变量 `UNDERLINE`，定义 `src/ux/editor/commands` 中的UNDERLINE。
 */
export const UNDERLINE = new Mark('u');
/**
 * Constant/variable `STRIKE` defining strike in `src/ux/editor/commands`.
 * @zh 常量/变量 `STRIKE`，定义 `src/ux/editor/commands` 中的STRIKE。
 */
export const STRIKE = new Mark('s');
/**
 * Constant/variable `BLOCKQUOTE` defining blockquote in `src/ux/editor/commands`.
 * @zh 常量/变量 `BLOCKQUOTE`，定义 `src/ux/editor/commands` 中的BLOCKQUOTE。
 */
export const BLOCKQUOTE = new Blockquote();
/**
 * Constant/variable `HORIZONTAL_RULE` defining horizontal rule in `src/ux/editor/commands`.
 * @zh 常量/变量 `HORIZONTAL_RULE`，定义 `src/ux/editor/commands` 中的水平规则。
 */
export const HORIZONTAL_RULE = new HorizontalRule();
/**
 * Constant/variable `FORMAT_CLEAR` defining format clear in `src/ux/editor/commands`.
 * @zh 常量/变量 `FORMAT_CLEAR`，定义 `src/ux/editor/commands` 中的格式化清空。
 */
export const FORMAT_CLEAR = new FormatClear();
/**
 * Constant/variable `UL` defining ul in `src/ux/editor/commands`.
 * @zh 常量/变量 `UL`，定义 `src/ux/editor/commands` 中的UL。
 */
export const UL = new ListItem(true);
/**
 * Constant/variable `OL` defining ol in `src/ux/editor/commands`.
 * @zh 常量/变量 `OL`，定义 `src/ux/editor/commands` 中的OL。
 */
export const OL = new ListItem(false);
/**
 * Constant/variable `H1` defining h1 in `src/ux/editor/commands`.
 * @zh 常量/变量 `H1`，定义 `src/ux/editor/commands` 中的H1。
 */
export const H1 = new Heading(1);
/**
 * Constant/variable `H2` defining h2 in `src/ux/editor/commands`.
 * @zh 常量/变量 `H2`，定义 `src/ux/editor/commands` 中的H2。
 */
export const H2 = new Heading(2);
/**
 * Constant/variable `H3` defining h3 in `src/ux/editor/commands`.
 * @zh 常量/变量 `H3`，定义 `src/ux/editor/commands` 中的H3。
 */
export const H3 = new Heading(3);
/**
 * Constant/variable `H4` defining h4 in `src/ux/editor/commands`.
 * @zh 常量/变量 `H4`，定义 `src/ux/editor/commands` 中的H4。
 */
export const H4 = new Heading(4);
/**
 * Constant/variable `H5` defining h5 in `src/ux/editor/commands`.
 * @zh 常量/变量 `H5`，定义 `src/ux/editor/commands` 中的H5。
 */
export const H5 = new Heading(5);
/**
 * Constant/variable `H6` defining h6 in `src/ux/editor/commands`.
 * @zh 常量/变量 `H6`，定义 `src/ux/editor/commands` 中的H6。
 */
export const H6 = new Heading(6);
/**
 * Constant/variable `ALIGN_LEFT` defining align left in `src/ux/editor/commands`.
 * @zh 常量/变量 `ALIGN_LEFT`，定义 `src/ux/editor/commands` 中的对齐左侧位置。
 */
export const ALIGN_LEFT = new TextAlign('left');
/**
 * Constant/variable `ALIGN_CENTER` defining align center in `src/ux/editor/commands`.
 * @zh 常量/变量 `ALIGN_CENTER`，定义 `src/ux/editor/commands` 中的对齐居中。
 */
export const ALIGN_CENTER = new TextAlign('center');
/**
 * Constant/variable `ALIGN_RIGHT` defining align right in `src/ux/editor/commands`.
 * @zh 常量/变量 `ALIGN_RIGHT`，定义 `src/ux/editor/commands` 中的对齐右侧位置。
 */
export const ALIGN_RIGHT = new TextAlign('right');
/**
 * Constant/variable `ALIGN_JUSTIFY` defining align justify in `src/ux/editor/commands`.
 * @zh 常量/变量 `ALIGN_JUSTIFY`，定义 `src/ux/editor/commands` 中的对齐JUSTIFY。
 */
export const ALIGN_JUSTIFY = new TextAlign('justify');
/**
 * Constant/variable `LINK` defining link in `src/ux/editor/commands`.
 * @zh 常量/变量 `LINK`，定义 `src/ux/editor/commands` 中的链接。
 */
export const LINK = new Link();
/**
 * Constant/variable `IMAGE` defining image in `src/ux/editor/commands`.
 * @zh 常量/变量 `IMAGE`，定义 `src/ux/editor/commands` 中的图像。
 */
export const IMAGE = new Image();
/**
 * Constant/variable `TEXT_COLOR` defining text color in `src/ux/editor/commands`.
 * @zh 常量/变量 `TEXT_COLOR`，定义 `src/ux/editor/commands` 中的文本颜色。
 */
export const TEXT_COLOR = new TextColor('text_color', 'color');
/**
 * Constant/variable `TEXT_BACKGROUND_COLOR` defining text background color in `src/ux/editor/commands`.
 * @zh 常量/变量 `TEXT_BACKGROUND_COLOR`，定义 `src/ux/editor/commands` 中的文本背景颜色。
 */
export const TEXT_BACKGROUND_COLOR = new TextColor('text_background_color', 'backgroundColor');


export * from './applyMark';
export * from './Blockquote';
export * from './FormatClear';
export * from './Heading';
export * from './HorizontalRule';
export * from './Image';
export * from './Link';
export * from './ListItem';
export * from './Mark';
export * from './removeLink';
export * from './removeMark';
export * from './TextAlign';
export * from './TextColor';
export * from './types';
