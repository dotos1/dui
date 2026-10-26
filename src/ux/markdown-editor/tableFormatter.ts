/**
 * @fileoverview Module `src/ux/markdown-editor/tableFormatter.ts` providing table formatter definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/tableFormatter.ts`，提供表格格式化器相关的定义与实现。
 */


import {CancellationToken, editor, languages, Thenable, Range as _Range} from "monaco-editor";
import {TextDocument, TextEditor} from "./vscode-monaco";

import {EndOfLine, Range} from './extHostTypes'

import * as TypeConverters from './vscode-converters'

/**
 * Executes `activateTableFormatter` to handle activate table formatter.
 * @zh 执行 `activateTableFormatter`，用于激活表格格式化器。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
export function activateTableFormatter(editor: TextEditor) {
    languages.registerDocumentFormattingEditProvider(editor.languageId, new MarkdownDocumentFormatter());
}

/**
 * Executes `deactivate` to handle deactivate.
 * @zh 执行 `deactivate`，用于deactivate。
 */
export function deactivate() {
}

/**
 * Class `MarkdownDocumentFormatter` encapsulating markdown document formatter data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `MarkdownDocumentFormatter`，封装 `src/ux/markdown-editor` 中的Markdown文档文档对象格式化器数据结构与处理逻辑。
 */
class MarkdownDocumentFormatter implements languages.DocumentFormattingEditProvider {
    /**
     * Executes `provideDocumentFormattingEdits` to handle provide document formatting edits.
     * @zh 执行 `provideDocumentFormattingEdits`，用于提供文档对象Formatting编辑。
     * @param model - model parameter (`editor.ITextModel`) / 模型参数（`editor.ITextModel`）
     * @param options - options parameter (`languages.FormattingOptions`) / 配置选项参数（`languages.FormattingOptions`）
     * @param _ - _ parameter (`CancellationToken`) / _参数（`CancellationToken`）
     * @returns Result of type `languages.TextEdit[] | Thenable<languages.TextEdit[]>` / 类型为 `languages.TextEdit[] | Thenable<languages.TextEdit[]>` 的返回值
     */
    public provideDocumentFormattingEdits(model: editor.ITextModel, options: languages.FormattingOptions, _: CancellationToken): languages.TextEdit[] | Thenable<languages.TextEdit[]> {
        let edits: languages.TextEdit[] = [];
        let document = new TextDocument(model)
        let tables = this.detectTables(document.getText());
        if (tables !== null) {
            tables.forEach(table => {
                edits.push({range: TypeConverters.Range.from(this.getRange(document, table)), text: this.formatTable(table, document, options)});
            });
            return edits;
        } else {
            return [];
        }
    }

    /**
     * Executes `detectTables` to handle detect tables.
     * @zh 执行 `detectTables`，用于检测表格。
     * @param text - text parameter (`string`) / 文本参数（`string`）
     */
    private detectTables(text: string) {
        const lineBreak = '\\r?\\n';
        const contentLine = '\\|?.*\\|.*\\|?';
        const hyphenLine = '[ \\t]*\\|?( *:?-+:? *\\|)+( *:?-+:? *\\|?)[ \\t]*';
        const tableRegex = new RegExp(contentLine + lineBreak + hyphenLine + '(?:' + lineBreak + contentLine + ')*', 'g');
        return text.match(tableRegex);
    }

    /**
     * Executes `getRange` to handle get range.
     * @zh 执行 `getRange`，用于获取范围。
     * @param document - document parameter (`TextDocument`) / 文档对象参数（`TextDocument`）
     * @param text - text parameter (`string`) / 文本参数（`string`）
     * @returns Result of type `Range` / 类型为 `Range` 的返回值
     */
    private getRange(document: TextDocument, text: string): Range {
        let documentText = document.getText();
        let start = document.positionAt(documentText.indexOf(text));
        let end = document.positionAt(documentText.indexOf(text) + text.length);
        return new Range(start, end);
    }

    /**
     * Return the indentation of a table as a string of spaces by reading it from the first line.
     * In case of `markdown.extension.table.normalizeIndentation` is `enabled` it is rounded to the closest multiple of
     * the configured `tabSize`.

     * @zh 执行 `getTableIndentation`，用于获取表格Indentation。
     */
    private getTableIndentation(text: string, options: languages.FormattingOptions) {
        // let doNormalize = workspace.getConfiguration('markdown.extension.tableFormatter').get<boolean>('normalizeIndentation');
        let doNormalize = true;
        let indentRegex = new RegExp(/^(\s*)\S/u);
        let match = text.match(indentRegex);
        let spacesInFirstLine = match[1].length;
        let tabStops = Math.round(spacesInFirstLine / options.tabSize);
        let spaces = doNormalize ? " ".repeat(options.tabSize * tabStops) : " ".repeat(spacesInFirstLine);
        return spaces;
    }

    /**
     * Executes `formatTable` to handle format table.
     * @zh 执行 `formatTable`，用于格式化表格。
     * @param text - text parameter (`string`) / 文本参数（`string`）
     * @param doc - doc parameter (`TextDocument`) / 文档参数（`TextDocument`）
     * @param options - options parameter (`languages.FormattingOptions`) / 配置选项参数（`languages.FormattingOptions`）
     */
    private formatTable(text: string, doc: TextDocument, options: languages.FormattingOptions) {
        let indentation = this.getTableIndentation(text, options);

        let rows: string[] = [];
        let rowsNoIndentPattern = new RegExp(/^\s*(\S.*)$/gum);
        let match = null;
        while ((match = rowsNoIndentPattern.exec(text)) !== null) {
            rows.push(match[1].trim());
        }

        // Desired width of each column
        let colWidth: number[] = [];
        // Alignment of each column        
        let colAlign: string[] = []
        // Regex to extract cell content.
        // Known issue: `\\|` is not correctly parsed as a valid delimiter
        let fieldRegExp = new RegExp(/(?:((?:\\\||`.*?`|[^\|])*)\|)/gu);
        let cjkRegex = /[\u3000-\u9fff\uff01-\uff60]/g;

        let lines = rows.map((row, num) => {
            // Normalize
            if (row.startsWith('|')) {
                row = row.slice(1);
            }
            if (!row.endsWith('|')) {
                row = row + '|';
            }

            let field = null;
            let values = [];
            let i = 0;
            while ((field = fieldRegExp.exec(row)) !== null) {
                let cell = field[1].trim();
                values.push(cell);

                // Ignore length of dash-line to enable width reduction
                if (num != 1) {
                    // Treat CJK characters as 2 English ones because of Unicode stuff
                    let length = cjkRegex.test(cell) ? cell.length + cell.match(cjkRegex).length : cell.length;
                    colWidth[i] = colWidth[i] > length ? colWidth[i] : length;
                }

                i++;
            }
            return values;
        });

        // Normalize the num of hyphen, use Math.max to determine minimum length based on dash-line format
        lines[1] = lines[1].map((cell, i) => {
            if (/:-+:/.test(cell)) {
                //:---:
                colWidth[i] = Math.max(colWidth[i], 5);
                colAlign[i] = 'c';
                return ':' + '-'.repeat(colWidth[i] - 2) + ':';
            } else if (/:-+/.test(cell)) {
                //:---
                colWidth[i] = Math.max(colWidth[i], 4);
                colAlign[i] = 'l';
                return ':' + '-'.repeat(colWidth[i] - 1);
            } else if (/-+:/.test(cell)) {
                //---:
                colWidth[i] = Math.max(colWidth[i], 4);
                colAlign[i] = 'r';
                return '-'.repeat(colWidth[i] - 1) + ':';
            } else if (/-+/.test(cell)) {
                //---
                colWidth[i] = Math.max(colWidth[i], 3);
                colAlign[i] = 'l';
                return '-'.repeat(colWidth[i]);
            } else {
                colAlign[i] = 'l';
                return '';
            }
        });

        return lines.map(row => {
            let cells = row.map((cell, i) => {
                let cellLength = colWidth[i];
                if (cjkRegex.test(cell)) {
                    cellLength -= cell.match(cjkRegex).length;
                }
                //return (cell + ' '.repeat(cellLength)).slice(0, cellLength);
                return this.alignText(cell, colAlign[i], cellLength);
            });
            return indentation + '| ' + cells.join(' | ') + ' |';
        }).join(doc.eol === EndOfLine.LF ? '\n' : '\r\n');
    }

    /**
     * Executes `alignText` to handle align text.
     * @zh 执行 `alignText`，用于对齐文本。
     * @param text - text parameter (`string`) / 文本参数（`string`）
     * @param align - align parameter (`string`) / 对齐参数（`string`）
     * @param length - length parameter (`number`) / 长度参数（`number`）
     */
    private alignText(text: string, align: string, length: number) {
        if (align === 'c' && length > text.length) {
            return (' '.repeat(Math.floor((length - text.length) / 2)) + text + ' '.repeat(length)).slice(0, length);
        } else if (align === 'r') {
            return (' '.repeat(length) + text).slice(-length);
        } else {
            return (text + ' '.repeat(length)).slice(0, length);
        }
    }
}
