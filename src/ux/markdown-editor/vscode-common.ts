/**
 * @fileoverview Module `src/ux/markdown-editor/vscode-common.ts` providing vscode common definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/vscode-common.ts`，提供vscode通用相关的定义与实现。
 */

import {Range} from "./extHostTypes";

/**
 * Interface `TextLine` defining the contract and properties for text line.
 * @zh 接口 `TextLine`，定义文本线段的数据结构契约与属性规范。
 */
export interface TextLine {

    /**
     * Property `lineNumber` (`number`) storing line number.
     * @zh 属性 `lineNumber`（类型：`number`），用于存储或配置线段数字。
     */
    readonly lineNumber: number;


    /**
     * Property `text` (`string`) storing text.
     * @zh 属性 `text`（类型：`string`），用于存储或配置文本。
     */
    readonly text: string;

 
    /**
     * Property `range` (`Range`) storing range.
     * @zh 属性 `range`（类型：`Range`），用于存储或配置范围。
     */
    readonly range: Range;


    /**
     * Property `rangeIncludingLineBreak` (`Range`) storing range including line break.
     * @zh 属性 `rangeIncludingLineBreak`（类型：`Range`），用于存储或配置范围Including线段Break。
     */
    readonly rangeIncludingLineBreak: Range;


    /**
     * Property `firstNonWhitespaceCharacterIndex` (`number`) storing first non whitespace character index.
     * @zh 属性 `firstNonWhitespaceCharacterIndex`（类型：`number`），用于存储或配置首个NonWhitespace字符索引。
     */
    readonly firstNonWhitespaceCharacterIndex: number;


    /**
     * Property `isEmptyOrWhitespace` (`boolean`) storing is empty or whitespace.
     * @zh 属性 `isEmptyOrWhitespace`（类型：`boolean`），用于存储或配置是否为空OrWhitespace。
     */
    readonly isEmptyOrWhitespace: boolean;
}
