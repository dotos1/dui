/**
 * @fileoverview Module `src/ux/editor/input-rules/auto-link.ts` providing auto link definitions and implementation.
 * @zh 模块文件 `src/ux/editor/input-rules/auto-link.ts`，提供自动链接相关的定义与实现。
 */

import { InputRule } from 'prosemirror-inputrules';

/**
 * Constant/variable `autoLink` defining auto link in `src/ux/editor/input-rules`.
 * @zh 常量/变量 `autoLink`，定义 `src/ux/editor/input-rules` 中的自动链接。
 */
export const autoLink = (): InputRule => {
  const urlRegEx = /(?:https?:\/\/)?[\w-]+(?:\.[\w-]+)+\.?(?:\d+)?(?:\/\S*)?$/;
  return new InputRule(urlRegEx, (state, match, start, end) => {
    const { schema } = state;

    const tr = state.tr.insertText(match[0], start, end); // Replace existing text with entire match
    const mark = schema.marks['link'].create({ href: match[0] });

    return tr.addMark(start, start + match[0].length, mark);
  });
};
