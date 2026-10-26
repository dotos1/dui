/**
 * @fileoverview Module `src/ux/editor/plugins/editable.ts` providing editable definitions and implementation.
 * @zh 模块文件 `src/ux/editor/plugins/editable.ts`，提供是否可编辑相关的定义与实现。
 */

import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';

/**
 * Constant/variable `editablePlugin` defining editable plugin in `src/ux/editor/plugins`.
 * @zh 常量/变量 `editablePlugin`，定义 `src/ux/editor/plugins` 中的是否可编辑Plugin。
 */
const editablePlugin = (editable = true): Plugin => {
  return new Plugin({
    key: new PluginKey('editable'),
    state: {
      init(): boolean {
        return editable;
      },
      apply(tr: Transaction, previousVal: boolean): boolean {
        return tr.getMeta('UPDATE_EDITABLE') ?? previousVal;
      },
    },
    props: {
      editable(state: EditorState): boolean {
        return this.getState(state);
      },
      attributes(state: EditorState): Record<string, string> | null {
        //@ts-ignore
        const isEnabled = this.getState(state);
        if (isEnabled) {
          return null;
        }
        return {
          class: 'Editor__Content--Disabled',
        };
      },
    },
  });
};

export default editablePlugin;
