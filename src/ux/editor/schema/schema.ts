/**
 * @fileoverview Module `src/ux/editor/schema/schema.ts` providing schema definitions and implementation.
 * @zh 模块文件 `src/ux/editor/schema/schema.ts`，提供结构定义相关的定义与实现。
 */

import { Schema } from 'prosemirror-model';

import {marks} from './marks';
import {nodes} from './nodes';

/**
 * Constant/variable `schema` defining schema in `src/ux/editor/schema`.
 * @zh 常量/变量 `schema`，定义 `src/ux/editor/schema` 中的结构定义。
 */
export const schema = new Schema({
  marks,
  nodes,
});

