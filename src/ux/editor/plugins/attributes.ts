/**
 * @fileoverview Module `src/ux/editor/plugins/attributes.ts` providing attributes definitions and implementation.
 * @zh 模块文件 `src/ux/editor/plugins/attributes.ts`，提供属性列表相关的定义与实现。
 */

import { Plugin, PluginKey } from 'prosemirror-state';

/**
 * Constant/variable `attributesPlugin` defining attributes plugin in `src/ux/editor/plugins`.
 * @zh 常量/变量 `attributesPlugin`，定义 `src/ux/editor/plugins` 中的属性列表Plugin。
 */
const attributesPlugin = (attributes = {}): Plugin => {
  return new Plugin({
    key: new PluginKey('attributes'),
    props: {
      attributes,
    },
  });
};

export default attributesPlugin;
