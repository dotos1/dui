/**
 * @fileoverview Module `src/ux/markdown-editor/completion.ts` providing completion definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/completion.ts`，提供completion相关的定义与实现。
 */

import * as TypeConverters from './vscode-converters'
import {CancellationToken, editor, languages, Position as _Position} from 'monaco-editor';
import {TextDocument, TextEditor,} from './vscode-monaco'
import {Range, SnippetString, Position} from './extHostTypes'
import {slugify} from './util';
import {buildToc} from './toc';
import * as latex from './latex'
/**
 * Constant/variable `completionActivated` defining completion activated in `src/ux/markdown-editor`.
 * @zh 常量/变量 `completionActivated`，定义 `src/ux/markdown-editor` 中的completion已激活。
 */
let completionActivated = false

/**
 * Executes `activateCompletion` to handle activate completion.
 * @zh 执行 `activateCompletion`，用于激活Completion。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
export function activateCompletion(editor: TextEditor) {
    if (!completionActivated) {
        let provider = new MdCompletionItemProvider();
        languages.registerCompletionItemProvider(editor.languageId, provider);
        completionActivated = true;
    }
}

/**
 * Executes `completionList` to handle completion list.
 * @zh 执行 `completionList`，用于completion列表。
 * @param items - items parameter (`languages.CompletionItem[]`) / 条目列表参数（`languages.CompletionItem[]`）
 * @returns Result of type `languages.CompletionList` / 类型为 `languages.CompletionList` 的返回值
 */
function completionList(items: languages.CompletionItem[]): languages.CompletionList {
    return {suggestions: items.map((v, _,) => Object.assign({}, v))};
}

/**
 * Executes `newCompletionItem` to handle new completion item.
 * @zh 执行 `newCompletionItem`，用于新Completion条目。
 * @param text - text parameter (`string`) / 文本参数（`string`）
 * @param kind - kind parameter (`languages.CompletionItemKind`) / 种类参数（`languages.CompletionItemKind`）
 * @returns Result of type `languages.CompletionItem` / 类型为 `languages.CompletionItem` 的返回值
 */
function newCompletionItem(text: string, kind: languages.CompletionItemKind): languages.CompletionItem {
    return {
        label: text,
        kind: kind,
        additionalTextEdits: undefined,
        command: undefined,
        commitCharacters: undefined,
        detail: undefined,
        documentation: undefined,
        filterText: undefined,
        insertTextRules: undefined,
        preselect: false,
        range: undefined,
        sortText: undefined,
        insertText: undefined
    }
}

/**
 * Class `MdCompletionItemProvider` encapsulating md completion item provider data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `MdCompletionItemProvider`，封装 `src/ux/markdown-editor` 中的MdCompletion条目提供者数据结构与处理逻辑。
 */
class MdCompletionItemProvider implements languages.CompletionItemProvider {
    /**
     * Property `triggerCharacters` (`any[]`) storing trigger characters (default: `['(', '\\', '/', '[', '#']`).
     * @zh 属性 `triggerCharacters`（类型：`any[]`），用于存储或配置触发字符（默认值：`['(', '\\', '/', '[', '#']`）。
     */
    triggerCharacters = ['(', '\\', '/', '[', '#']
    // Suffixes explained:
    // \cmd         -> 0
    // \cmd{$1}     -> 1
    // \cmd{$1}{$2} -> 2
    //
    // Use linebreak to mimic the structure of the KaTeX [Support Table](https://katex.org/docs/supported.html)
    /**
     * Property `mathCompletions` (`languages.CompletionItem[]`) storing math completions.
     * @zh 属性 `mathCompletions`（类型：`languages.CompletionItem[]`），用于存储或配置mathCompletions。
     */
    mathCompletions: languages.CompletionItem[];
    /**
     * Creates an instance of `MdCompletionItemProvider` and initializes its dependencies and internal state.
     * @zh 创建 `MdCompletionItemProvider` 实例，并初始化其依赖项与内部状态。
     */
    constructor() {
        // \cmd
        let c1 = latex._c1.map(cmd => {
            let item = newCompletionItem('\\' + cmd, languages.CompletionItemKind.Function);
            item.insertText = cmd;
            return item;
        });
        // \cmd{$1}
        let c2 = latex._c2.map(cmd => {
            let item = newCompletionItem('\\' + cmd, languages.CompletionItemKind.Function);
            item.insertText = new SnippetString(`${cmd}\{$1\}`).value;
            item.insertTextRules = languages.CompletionItemInsertTextRule.InsertAsSnippet

            return item;
        });
        // \cmd{$1}{$2}
        let c3 = latex._c3.map(cmd => {
            let item = newCompletionItem('\\' + cmd, languages.CompletionItemKind.Function);
            item.insertText = new SnippetString(`${cmd}\{$1\}\{$2\}`).value;
            item.insertTextRules = languages.CompletionItemInsertTextRule.InsertAsSnippet

            return item;
        });
        let envSnippet = newCompletionItem('\\begin', languages.CompletionItemKind.Snippet);
        envSnippet.insertText = new SnippetString('begin{${1|aligned,alignedat,array,bmatrix,Bmatrix,cases,darray,dcases,gathered,matrix,pmatrix,vmatrix,Vmatrix|}}\n\t$2\n\\end{$1}').value;
        envSnippet.insertTextRules = languages.CompletionItemInsertTextRule.InsertAsSnippet

        this.mathCompletions = [...c1, ...c2, ...c3, envSnippet];
        // Sort
        this.mathCompletions.forEach(item => {
            item.sortText = (typeof item.label === 'string' ? item.label : item.label.label).replace(/[a-zA-Z]/g, c => {
                if (/[a-z]/.test(c)) {
                    return `0${c}`;
                } else {
                    return `1${c.toLowerCase()}`;
                }
            });
        });
    }

    /**
     * Executes `provideCompletionItems` to handle provide completion items.
     * @zh 执行 `provideCompletionItems`，用于提供Completion条目列表。
     * @param model - model parameter (`editor.ITextModel`) / 模型参数（`editor.ITextModel`）
     * @param _position - position parameter (`_Position`) / 位置参数（`_Position`）
     * @param _context - context parameter (`languages.CompletionContext`) / 上下文参数（`languages.CompletionContext`）
     * @param _token - token parameter (`CancellationToken`) / 令牌参数（`CancellationToken`）
     * @returns Result of type `languages.ProviderResult<languages.CompletionList>` / 类型为 `languages.ProviderResult<languages.CompletionList>` 的返回值
     */
    provideCompletionItems(model: editor.ITextModel, _position: _Position, _context: languages.CompletionContext, _token: CancellationToken): languages.ProviderResult<languages.CompletionList> {
        let document = new TextDocument(model)
        let position = TypeConverters.Position.to(_position)

        const lineTextBefore = document.lineAt(position.line).text.substring(0, position.character);
        const lineTextAfter = document.lineAt(position.line).text.substring(position.character);

        let matches;
        if (
            (matches = lineTextBefore.match(/\\[^$]*$/)) !== null
        ) {
            /* ┌────────────────┐
               │ Math functions │
               └────────────────┘ */
            if (
                /(^|[^\$])\$(|[^ \$].*)\\\w*$/.test(lineTextBefore)
                && lineTextAfter.includes('$')
            ) {
                return completionList(this.mathCompletions);
            } else {
                const textBefore = document.getText(new Range(new Position(0, 0), position));
                const textAfter = document.getText().substr(document.offsetAt(position));

                if (
                    (matches = textBefore.match(/\$\$/g)) !== null
                    && matches.length % 2 !== 0
                    && textAfter.includes('\$\$')
                ) {
                    // Complete math functions ($$ ... $$)
                    return completionList(this.mathCompletions)
                } else {
                    return completionList([]);
                }
            }
        } else if (/\[[^\]]*?\]\[[^\]]*$/.test(lineTextBefore)) {
            /* ┌───────────────────────┐
               │ Reference link labels │
               └───────────────────────┘ */
            let startIndex = lineTextBefore.lastIndexOf('[');
            const range = new Range(position.with({character: startIndex + 1}), position);
            return new Promise((res, _) => {
                const lines = document.getText().split(/\r?\n/);
                const usageCounts = lines.reduce((useCounts, currentLine) => {
                    let match: RegExpExecArray;
                    const pattern = /\[[^\]]+\]\[([^\]]*?)\]/g;
                    while ((match = pattern.exec(currentLine)) !== null) {
                        let usedRef = match[1];
                        if (!useCounts.has(usedRef)) {
                            useCounts.set(usedRef, 0);
                        }
                        useCounts.set(usedRef, useCounts.get(usedRef) + 1);
                    }
                    return useCounts;
                }, new Map<string, number>());
                let refLabels = lines.reduce((prev, curr) => {
                    let match;
                    if ((match = /^\[([^\]]*?)\]: (\S*)( .*)?/.exec(curr)) !== null) {
                        const ref = match[1];
                        let item = newCompletionItem(ref, languages.CompletionItemKind.Reference);
                        const usages = usageCounts.get(ref) || 0;
                        item.insertText = ref
                        item.documentation = {value: (match[2])};
                        item.detail = usages === 1 ? `1 usage` : `${usages} usages`;
                        // Prefer unused items
                        item.sortText = usages === 0 ? `0-${ref}` : item.sortText = `1-${ref}`;
                        item.range = TypeConverters.Range.from(range);
                        prev.push(item);
                    }
                    return prev;
                }, []);

                res(completionList(refLabels));
            });
        } else if (/\[[^\]]*\]\(#[^\)]*$/.test(lineTextBefore)) {
            /* ┌───────────────────────────┐
               │ Anchor tags from headings │
               └───────────────────────────┘ */
            let startIndex = lineTextBefore.lastIndexOf('(');
            let endPosition = position;

            let addClosingParen = false;
            if (/^([^\) ]+\s*|^\s*)\)/.test(lineTextAfter)) {
                // try to detect if user wants to replace a link (i.e. matching closing paren and )
                // Either: ... <CURSOR> something <whitespace> )
                //     or: ... <CURSOR> <whitespace> )
                //     or: ... <CURSOR> )     (endPosition assignment is a no-op for this case)

                // in every case, we want to remove all characters after the cursor and before that first closing paren
                endPosition = position.with({character: +endPosition.character + lineTextAfter.indexOf(')')});
            } else {
                // If no closing paren is found, replace all trailing non-white-space chars and add a closing paren
                // distance to first non-whitespace or EOL
                let toReplace = 0;
                while (toReplace<lineTextAfter.length && ' \t\n\r\v'.indexOf(lineTextAfter.charAt(toReplace)) != -1) {
                    toReplace++;
                }
                endPosition = position.with({character: + endPosition.character + toReplace});

                addClosingParen = true;
            }

            const range = new Range(position.with({character: startIndex + 1}), endPosition);

            return new Promise((res, _) => {
                const toc = buildToc(document);

                const headingCompletions: languages.CompletionItem[] = toc.reduce((prev: languages.CompletionItem[], curr: { text? }) => {
                    let item = newCompletionItem('#' + slugify(curr.text), languages.CompletionItemKind.Reference);

                    let label = typeof item.label === 'string' ? item.label : item.label.label;
                    if (addClosingParen) {
                        item.insertText = label + ')';
                    } else {
                        item.insertText = label
                    }

                    item.documentation = curr.text;
                    item.range = TypeConverters.Range.from(range);
                    prev.push(item);
                    return prev;
                }, []);

                res(completionList(headingCompletions));
            });
        } else {
            return completionList([]);
        }
    }
}
