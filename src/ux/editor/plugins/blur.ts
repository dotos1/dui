/**
 * @fileoverview Module `src/ux/editor/plugins/blur.ts` providing blur definitions and implementation.
 * @zh 模块文件 `src/ux/editor/plugins/blur.ts`，提供失焦相关的定义与实现。
 */

import { Plugin, PluginKey } from 'prosemirror-state';

/**
 * Constant/variable `blurPlugin` defining blur plugin in `src/ux/editor/plugins`.
 * @zh 常量/变量 `blurPlugin`，定义 `src/ux/editor/plugins` 中的失焦Plugin。
 */
const blurPlugin = (cb: () => void):Plugin => {
  return new Plugin({
    key: new PluginKey('blur'),
    props: {
      handleDOMEvents: {
        blur: () => {
          cb();
          return false;
        },
      },
    },
  });
};

export default blurPlugin;
