/**
 * @fileoverview Module `src/ux/editor/helpers/markInputRule.ts` providing mark input rule definitions and implementation.
 * @zh 模块文件 `src/ux/editor/helpers/markInputRule.ts`，提供标记输入属性规则相关的定义与实现。
 */

import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';

/**
 * Constant/variable `markInputRule` defining mark input rule in `src/ux/editor/helpers`.
 * @zh 常量/变量 `markInputRule`，定义 `src/ux/editor/helpers` 中的标记输入属性规则。
 */
export const markInputRule = (regexp: RegExp, markType: MarkType, attrs?: Record<string, unknown>): InputRule => {
  return new InputRule(regexp, (state, match, start, end) => {
    const { tr } = state;

    const from = start;
    let to = end;

    if (match[2]) {
      const textStart = start + match[0].indexOf(match[2]);
      const textEnd = textStart + match[2].length;

      if (textEnd < end) {
        tr.delete(textEnd, end);
      }

      if (textStart > start) {
        tr.delete(start, textStart);
      }

      to = start + match[2].length;
    }

    return tr.addMark(from, to, markType.create(attrs));
  });
};

export default markInputRule;
