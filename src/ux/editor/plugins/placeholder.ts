/**
 * @fileoverview Module `src/ux/editor/plugins/placeholder.ts` providing placeholder definitions and implementation.
 * @zh 模块文件 `src/ux/editor/plugins/placeholder.ts`，提供占位提示相关的定义与实现。
 */

import { Plugin, EditorState, PluginKey, Transaction } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';

/**
 * Constant/variable `PLACEHOLDER_CLASSNAME` defining placeholder classname in `src/ux/editor/plugins`.
 * @zh 常量/变量 `PLACEHOLDER_CLASSNAME`，定义 `src/ux/editor/plugins` 中的占位提示CLASSNAME。
 */
const PLACEHOLDER_CLASSNAME = 'Editor__Placeholder';

/**
 * Constant/variable `placeholderPlugin` defining placeholder plugin in `src/ux/editor/plugins`.
 * @zh 常量/变量 `placeholderPlugin`，定义 `src/ux/editor/plugins` 中的占位提示Plugin。
 */
const placeholderPlugin = (text?: string): Plugin => {
  return new Plugin({
    key: new PluginKey('placeholder'),
    state: {
      init(): string {
        return text ?? '';
      },
      apply(tr: Transaction, previousVal: string): string {
        const placeholder = tr.getMeta('UPDATE_PLACEHOLDER') ?? previousVal;
        return placeholder;
      },
    },
    props: {
      decorations(state: EditorState): DecorationSet {
        const { doc } = state;
        const { textContent, childCount } = doc;

        const placeholder = this.getState(state);

        if (!placeholder || childCount > 1) {
          return DecorationSet.empty;
        }

        const decorations: Decoration[] = [];

        const decorate = (node: ProseMirrorNode, pos: number) => {
          if (node.type.isBlock && node.childCount === 0 && textContent.length === 0) {
            const from = pos;
            const to = pos + node.nodeSize;

            const placeholderNode = Decoration.node(from, to, {
              'class': PLACEHOLDER_CLASSNAME,
              'data-placeholder': placeholder,
              'data-align': node.attrs['align'] ?? null,
            });

            decorations.push(placeholderNode);
          }

          return false;
        };

        doc.descendants(decorate);
        return DecorationSet.create(doc, decorations);
      },
    },
  });
};

export default placeholderPlugin;
