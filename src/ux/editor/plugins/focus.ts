/**
 * @fileoverview Module `src/ux/editor/plugins/focus.ts` providing focus definitions and implementation.
 * @zh 模块文件 `src/ux/editor/plugins/focus.ts`，提供聚焦相关的定义与实现。
 */

import { Plugin, PluginKey } from 'prosemirror-state';

/**
 * Constant/variable `focusPlugin` defining focus plugin in `src/ux/editor/plugins`.
 * @zh 常量/变量 `focusPlugin`，定义 `src/ux/editor/plugins` 中的聚焦Plugin。
 */
const focusPlugin = (cb: () => void): Plugin => {
  return new Plugin({
    key: new PluginKey('focus'),
    props: {
      handleDOMEvents: {
        focus: () => {
          cb();
          return false;
        },
      },
    },
  });
};

export default focusPlugin;
