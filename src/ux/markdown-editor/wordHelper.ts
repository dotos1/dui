/**
 * @fileoverview Module `src/ux/markdown-editor/wordHelper.ts` providing word helper definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/wordHelper.ts`，提供word辅助工具相关的定义与实现。
 */

/* eslint-disable no-cond-assign */

import {editor} from "monaco-editor";

/**
 * Constant/variable `USUAL_WORD_SEPARATORS` defining usual word separators in `src/ux/markdown-editor`.
 * @zh 常量/变量 `USUAL_WORD_SEPARATORS`，定义 `src/ux/markdown-editor` 中的USUALWORDSEPARATORS。
 */
export const USUAL_WORD_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';


/**
 * Executes `createWordRegExp` to handle create word reg exp.
 * @zh 执行 `createWordRegExp`，用于创建WordRegExp。
 * @param allowInWords - allow in words parameter (`string`) / 允许在Words参数（`string`）
 * @returns Result of type `RegExp` / 类型为 `RegExp` 的返回值
 */
function createWordRegExp(allowInWords: string = ''): RegExp {
	let source = '(-?\\d*\\.\\d\\w*)|([^';
	for (const sep of USUAL_WORD_SEPARATORS) {
		if (allowInWords.indexOf(sep) >= 0) {
			continue;
		}
		source += '\\' + sep;
	}
	source += '\\s]+)';
	return new RegExp(source, 'g');
}

// catches numbers (including floating numbers) in the first group, and alphanum in the second
/**
 * Constant/variable `DEFAULT_WORD_REGEXP` defining default word regexp in `src/ux/markdown-editor`.
 * @zh 常量/变量 `DEFAULT_WORD_REGEXP`，定义 `src/ux/markdown-editor` 中的默认WORDREGEXP。
 */
export const DEFAULT_WORD_REGEXP = createWordRegExp();

/**
 * Executes `ensureValidWordDefinition` to handle ensure valid word definition.
 * @zh 执行 `ensureValidWordDefinition`，用于ensure有效WordDefinition。
 * @param wordDefinition - word definition parameter (`RegExp | null`) / wordDefinition参数（`RegExp | null`）
 * @returns Result of type `RegExp` / 类型为 `RegExp` 的返回值
 */
export function ensureValidWordDefinition(wordDefinition?: RegExp | null): RegExp {
	let result: RegExp = DEFAULT_WORD_REGEXP;

	if (wordDefinition && (wordDefinition instanceof RegExp)) {
		if (!wordDefinition.global) {
			let flags = 'g';
			if (wordDefinition.ignoreCase) {
				flags += 'i';
			}
			if (wordDefinition.multiline) {
				flags += 'm';
			}
			if ((wordDefinition as unknown as { unicode? }).unicode) {
				flags += 'u';
			}
			result = new RegExp(wordDefinition.source, flags);
		} else {
			result = wordDefinition;
		}
	}

	result.lastIndex = 0;

	return result;
}

/**
 * Executes `getWordAtPosFast` to handle get word at pos fast.
 * @zh 执行 `getWordAtPosFast`，用于获取Word位于位置Fast。
 * @param column - column parameter (`number`) / 列参数（`number`）
 * @param wordDefinition - word definition parameter (`RegExp`) / wordDefinition参数（`RegExp`）
 * @param text - text parameter (`string`) / 文本参数（`string`）
 * @param textOffset - text offset parameter (`number`) / 文本偏移量参数（`number`）
 * @returns Result of type `editor.IWordAtPosition | null` / 类型为 `editor.IWordAtPosition | null` 的返回值
 */
function getWordAtPosFast(column: number, wordDefinition: RegExp, text: string, textOffset: number): editor.IWordAtPosition | null {
	// find whitespace enclosed text around column and match from there

	let pos = column - 1 - textOffset;
	let start = text.lastIndexOf(' ', pos - 1) + 1;

	wordDefinition.lastIndex = start;
	let match: RegExpMatchArray | null;
	while (match = wordDefinition.exec(text)) {
		const matchIndex = match.index || 0;
		if (matchIndex <= pos && wordDefinition.lastIndex >= pos) {
			return {
				word: match[0],
				startColumn: textOffset + 1 + matchIndex,
				endColumn: textOffset + 1 + wordDefinition.lastIndex
			};
		}
	}

	return null;
}


/**
 * Executes `getWordAtPosSlow` to handle get word at pos slow.
 * @zh 执行 `getWordAtPosSlow`，用于获取Word位于位置Slow。
 * @param column - column parameter (`number`) / 列参数（`number`）
 * @param wordDefinition - word definition parameter (`RegExp`) / wordDefinition参数（`RegExp`）
 * @param text - text parameter (`string`) / 文本参数（`string`）
 * @param textOffset - text offset parameter (`number`) / 文本偏移量参数（`number`）
 * @returns Result of type `editor.IWordAtPosition | null` / 类型为 `editor.IWordAtPosition | null` 的返回值
 */
function getWordAtPosSlow(column: number, wordDefinition: RegExp, text: string, textOffset: number): editor.IWordAtPosition | null {

	let pos = column - 1 - textOffset;
	wordDefinition.lastIndex = 0;

	let match: RegExpMatchArray | null;
	while (match = wordDefinition.exec(text)) {
		const matchIndex = match.index || 0;
		if (matchIndex > pos) {
			// |nW -> matched only after the pos
			return null;

		} else if (wordDefinition.lastIndex >= pos) {
			// W|W -> match encloses pos
			return {
				word: match[0],
				startColumn: textOffset + 1 + matchIndex,
				endColumn: textOffset + 1 + wordDefinition.lastIndex
			};
		}
	}

	return null;
}

/**
 * Executes `getWordAtText` to handle get word at text.
 * @zh 执行 `getWordAtText`，用于获取Word位于文本。
 * @param column - column parameter (`number`) / 列参数（`number`）
 * @param wordDefinition - word definition parameter (`RegExp`) / wordDefinition参数（`RegExp`）
 * @param text - text parameter (`string`) / 文本参数（`string`）
 * @param textOffset - text offset parameter (`number`) / 文本偏移量参数（`number`）
 * @returns Result of type `editor.IWordAtPosition | null` / 类型为 `editor.IWordAtPosition | null` 的返回值
 */
export function getWordAtText(column: number, wordDefinition: RegExp, text: string, textOffset: number): editor.IWordAtPosition | null {

	// if `words` can contain whitespace character we have to use the slow variant
	// otherwise we use the fast variant of finding a word
	wordDefinition.lastIndex = 0;
	let match = wordDefinition.exec(text);
	if (!match) {
		return null;
	}
	// todo@joh the `match` could already be the (first) word
	const ret = match[0].indexOf(' ') >= 0
		// did match a word which contains a space character -> use slow word find
		? getWordAtPosSlow(column, wordDefinition, text, textOffset)
		// sane word definition -> use fast word find
		: getWordAtPosFast(column, wordDefinition, text, textOffset);

	// both (getWordAtPosFast and getWordAtPosSlow) leave the wordDefinition-RegExp
	// in an undefined state and to not confuse other users of the wordDefinition
	// we reset the lastIndex
	wordDefinition.lastIndex = 0;

	return ret;
}
