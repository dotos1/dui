/**
 * @fileoverview Module `src/ux/editor/plugins/link.ts` providing link definitions and implementation.
 * @zh 模块文件 `src/ux/editor/plugins/link.ts`，提供链接相关的定义与实现。
 */

import { Fragment, Slice, Node as ProseMirrorNode } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';

/**
 * Constant/variable `HTTP_LINK_REGEX` defining http link regex in `src/ux/editor/plugins`.
 * @zh 常量/变量 `HTTP_LINK_REGEX`，定义 `src/ux/editor/plugins` 中的HTTP链接正则表达式。
 */
const HTTP_LINK_REGEX = /(?:https?:\/\/)?[\w-]+(?:\.[\w-]+)+\.?(?:\d+)?(?:\/\S*)?$/;

/**
 * Constant/variable `linkify` defining linkify in `src/ux/editor/plugins`.
 * @zh 常量/变量 `linkify`，定义 `src/ux/editor/plugins` 中的linkify。
 */
const linkify = (fragment: Fragment): Fragment => {
  const linkified: ProseMirrorNode[] = [];

  fragment.forEach((child: ProseMirrorNode) => {
    if (child.isText) {
      const text = child.text as string;
      let pos = 0;

      const match: RegExpMatchArray | null = HTTP_LINK_REGEX.exec(text);

      if (match) {
        const start = match.index;
        const end = start + match[0].length;
        const { link } = child.type.schema.marks;

        if (start > 0) {
          linkified.push(child.cut(pos, start));
        }

        const urlText = text.slice(start, end);
        linkified.push(
          child.cut(start, end).mark(link.create({ href: urlText }).addToSet(child.marks)),
        );
        pos = end;
      }

      if (pos < text.length) {
        linkified.push(child.cut(pos));
      }
    } else {
      linkified.push(child.copy(linkify(child.content)));
    }
  });

  return Fragment.fromArray(linkified);
};

/**
 * Constant/variable `linkifyPlugin` defining linkify plugin in `src/ux/editor/plugins`.
 * @zh 常量/变量 `linkifyPlugin`，定义 `src/ux/editor/plugins` 中的linkifyPlugin。
 */
const linkifyPlugin = ():Plugin => {
  return new Plugin({
    key: new PluginKey('linkify'),
    props: {
      transformPasted: (slice: Slice) => {
        return new Slice(linkify(slice.content), slice.openStart, slice.openEnd);
      },
    },
  });
};

export default linkifyPlugin;
