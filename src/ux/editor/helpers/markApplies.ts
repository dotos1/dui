/**
 * @fileoverview Module `src/ux/editor/helpers/markApplies.ts` providing mark applies definitions and implementation.
 * @zh 模块文件 `src/ux/editor/helpers/markApplies.ts`，提供标记应用相关的定义与实现。
 */

import { MarkType, Node as PrmosemirroNode } from 'prosemirror-model';
import { SelectionRange } from 'prosemirror-state';

/**
 * Constant/variable `markApplies` defining mark applies in `src/ux/editor/helpers`.
 * @zh 常量/变量 `markApplies`，定义 `src/ux/editor/helpers` 中的标记应用。
 */
export const markApplies = (doc: PrmosemirroNode, ranges: readonly SelectionRange[], type: MarkType): boolean => {
  for (const range of ranges) {
    const { $from, $to } = range;

    let canApply = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;

    doc.nodesBetween($from.pos, $to.pos, (node: PrmosemirroNode): boolean => {
      if (canApply) {
        return false;
      }

      canApply = node.inlineContent && node.type.allowsMarkType(type);
      return true;
    });

    if (canApply) {
      return true;
    }
  }
  return false;
};

export default markApplies;
