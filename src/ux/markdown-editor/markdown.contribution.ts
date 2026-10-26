/**
 * @fileoverview Module `src/ux/markdown-editor/markdown.contribution.ts` providing markdown contribution definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/markdown.contribution.ts`，提供Markdown文档contribution相关的定义与实现。
 */


import { registerLanguage } from './contribution';
import {conf, language} from "./markdown";

/**
 * Executes `activateMarkdownMath` to handle activate markdown math.
 * @zh 执行 `activateMarkdownMath`，用于激活Markdown文档Math。
 */
export function activateMarkdownMath() {
	registerLanguage({
		id: 'markdown-math',
		extensions: ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn', '.mdtxt', '.mdtext'],
		aliases: ['Markdown', 'markdown'],
		loader: () => {
			return Promise.resolve({
				conf: conf,
				language: language
			})
		}
	});
}
