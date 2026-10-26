/**
 * @fileoverview Module `src/ux/markdown-editor/formatting.ts` providing formatting definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/formatting.ts`，提供formatting相关的定义与实现。
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import {editor, KeyCode, KeyMod} from 'monaco-editor';
import { fixMarker } from './listEditing';
import {TextDocument, TextEditor} from "./vscode-monaco";
import {Position, Selection, Range, WorkspaceEdit} from "./extHostTypes";

/**
 * Executes `addKeybinding` to handle add keybinding.
 * @zh 执行 `addKeybinding`，用于添加Keybinding。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 * @param name - name parameter (`String`) / 名称参数（`String`）
 * @param fun - fun parameter (`CallableFunction`) / fun参数（`CallableFunction`）
 * @param keybindings - keybindings parameter (`number[]`) / keybindings参数（`number[]`）
 * @param label - label parameter (`string`) / 标签参数（`string`）
 * @param context - context parameter (`string`) / 上下文参数（`string`）
 * @param contextMenuGroupId - context menu group id parameter (`any`) / 上下文菜单分组唯一标识参数（`any`）
 */
export function addKeybinding(editor: TextEditor, name: String, fun: CallableFunction, keybindings: number[], label?: string, context?: string, contextMenuGroupId = "markdown.extension.editing") {
    editor.addAction({
        contextMenuGroupId: contextMenuGroupId,
        contextMenuOrder: 0,
        id: "markdown.extension.editing." + name,
        keybindingContext: context,
        keybindings: keybindings,
        label: label,
        precondition: "",
        run(_: editor.ICodeEditor): void | Promise<void> {
            fun(editor)
            return undefined;
        }
    });
}

/**
 * Executes `activateFormatting` to handle activate formatting.
 * @zh 执行 `activateFormatting`，用于激活Formatting。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
export function activateFormatting(editor: TextEditor) {
    addKeybinding(editor, "toggleBold", toggleBold, [KeyMod.CtrlCmd | KeyCode.KeyB], "Toggle bold");
    addKeybinding(editor, "toggleItalic", toggleItalic, [KeyMod.CtrlCmd | KeyCode.KeyI], "Toggle italic");
    addKeybinding(editor, "toggleCodeSpan", toggleCodeSpan, [KeyMod.CtrlCmd | KeyCode.Backquote], "Toggle code span");
    addKeybinding(editor, "toggleStrikethrough", toggleStrikethrough, [KeyMod.Alt | KeyCode.KeyS], "Toggle strikethrough");
    addKeybinding(editor, "toggleMath", toggleMath, [KeyMod.CtrlCmd | KeyCode.KeyM], "Toggle math");
    addKeybinding(editor, "toggleMathReverse", toggleMathReverse, [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyM], "Toggle math reverse");
    addKeybinding(editor, "toggleHeadingUp", toggleHeadingUp, [KeyMod.WinCtrl | KeyMod.Shift | KeyCode.BracketLeft], "Heading up");
    addKeybinding(editor, "toggleHeadingDown", toggleHeadingDown, [KeyMod.WinCtrl | KeyMod.Shift | KeyCode.BracketRight], "Heading down");
    addKeybinding(editor, "toggleList", toggleList, [KeyMod.CtrlCmd | KeyCode.KeyL], "Toggle list");
    // addKeybinding(editor, paste, [KeyMod.CtrlCmd | KeyCode.KEY_B], "Toggle bold");
}

/**
 * Here we store Regexp to check if the text is the single link.

 * @zh 常量/变量 `singleLinkRegex`，定义 `src/ux/markdown-editor` 中的单个链接正则表达式。
 */
const singleLinkRegex: RegExp = createLinkRegex();

// Return Promise because need to chain operations in unit tests

/**
 * Executes `toggleBold` to handle toggle bold.
 * @zh 执行 `toggleBold`，用于开关Bold。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
function toggleBold(editor: TextEditor) {
    return styleByWrapping(editor, '**');
}

/**
 * Executes `toggleItalic` to handle toggle italic.
 * @zh 执行 `toggleItalic`，用于开关Italic。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
function toggleItalic(editor: TextEditor) {
    // let indicator = workspace.getConfiguration('markdown.extension.italic').get<string>('indicator');
    return styleByWrapping(editor, '*');
}

/**
 * Executes `toggleCodeSpan` to handle toggle code span.
 * @zh 执行 `toggleCodeSpan`，用于开关编码Span。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
function toggleCodeSpan(editor: TextEditor) {
    return styleByWrapping(editor, '`');
}

/**
 * Executes `toggleStrikethrough` to handle toggle strikethrough.
 * @zh 执行 `toggleStrikethrough`，用于开关Strikethrough。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
function toggleStrikethrough(editor: TextEditor) {
    return styleByWrapping(editor, '~~');
}

/**
 * Constant/variable `maxHeading` defining max heading in `src/ux/markdown-editor`.
 * @zh 常量/变量 `maxHeading`，定义 `src/ux/markdown-editor` 中的最大值Heading。
 */
const maxHeading = '######';

/**
 * Executes `toggleHeadingUp` to handle toggle heading up.
 * @zh 执行 `toggleHeadingUp`，用于开关Heading向上。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
function toggleHeadingUp(editor: TextEditor) {
    let lineIndex = editor.selection.active.line;
    let lineText = editor.document.lineAt(lineIndex).text;

    return editor.edit((editBuilder) => {
        if (!lineText.startsWith('#')) { // Not a heading
            editBuilder.insert(new Position(lineIndex, 0), '# ');
        } else if (lineText.startsWith(maxHeading)) { // Reset heading at 6 level
            let deleteIndex = lineText.startsWith(maxHeading + ' ') ? maxHeading.length + 1 : maxHeading.length;
            editBuilder.delete(new Range(new Position(lineIndex, 0), new Position(lineIndex, deleteIndex)));
        } else {
            editBuilder.insert(new Position(lineIndex, 0), '#');
        }
    });
}

/**
 * Executes `toggleHeadingDown` to handle toggle heading down.
 * @zh 执行 `toggleHeadingDown`，用于开关Heading向下。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
function toggleHeadingDown(editor: TextEditor) {
    let lineIndex = editor.selection.active.line;
    let lineText = editor.document.lineAt(lineIndex).text;

    editor.edit((editBuilder) => {
        if (lineText.startsWith('# ')) { // Heading level 1
            editBuilder.delete(new Range(new Position(lineIndex, 0), new Position(lineIndex, 2)));
        } else if (lineText.startsWith('#')) { // Heading (but not level 1)
            editBuilder.delete(new Range(new Position(lineIndex, 0), new Position(lineIndex, 1)));
        } else { // No heading
            editBuilder.insert(new Position(lineIndex, 0), maxHeading + ' ');
        }
    });
}

/**
 * Enumeration `MathBlockState` defining supported math block state constants.
 * @zh 枚举 `MathBlockState`，定义支持的Math块状态常量集合。
 */
enum MathBlockState {
    // State 1: not in any others states
    /**
     * Enum member `MathBlockState.NONE` representing none.
     * @zh 枚举项 `MathBlockState.NONE`，表示无。
     */
    NONE,
    // State 2: $|$
    /**
     * Enum member `MathBlockState.INLINE` representing inline.
     * @zh 枚举项 `MathBlockState.INLINE`，表示INLINE。
     */
    INLINE,
    // State 3: $$ | $$
    /**
     * Enum member `MathBlockState.SINGLE_DISPLAYED` representing single displayed.
     * @zh 枚举项 `MathBlockState.SINGLE_DISPLAYED`，表示单个已展示。
     */
    SINGLE_DISPLAYED,
    // State 4:
    // $$
    // |
    // $$
    /**
     * Enum member `MathBlockState.MULTI_DISPLAYED` representing multi displayed.
     * @zh 枚举项 `MathBlockState.MULTI_DISPLAYED`，表示多已展示。
     */
    MULTI_DISPLAYED
}

/**
 * Executes `getMathState` to handle get math state.
 * @zh 执行 `getMathState`，用于获取Math状态。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 * @param cursor - cursor parameter (`Position`) / 光标参数（`Position`）
 * @returns Result of type `MathBlockState` / 类型为 `MathBlockState` 的返回值
 */
function getMathState(editor: TextEditor, cursor: Position): MathBlockState {
    if (getContext(editor, cursor, '$') === '$|$') {
        return MathBlockState.INLINE;
    } else if (getContext(editor, cursor, '$$ ', ' $$') === '$$ | $$') {
        return MathBlockState.SINGLE_DISPLAYED;
    } else if (
        editor.document.lineAt(cursor.line).text === ''
        && cursor.line > 0
        && editor.document.lineAt(cursor.line - 1).text === '$$'
        && cursor.line < editor.document.lineCount - 1
        && editor.document.lineAt(cursor.line + 1).text === '$$'
    ) {
        return MathBlockState.MULTI_DISPLAYED
    } else {
        return MathBlockState.NONE;
    }
}

/**
 * Modify the document, change from `oldMathBlockState` to `newMathBlockState`.
 * @param editor
 * @param cursor
 * @param oldMathBlockState
 * @param newMathBlockState

 * @zh 执行 `setMathState`，用于集合Math状态。
 */
function setMathState(editor: TextEditor, cursor: Position, oldMathBlockState: MathBlockState, newMathBlockState: MathBlockState) {
    // Step 1: Delete old math block.
    editor.edit(editBuilder => {
        let rangeToBeDeleted: Range
        switch (oldMathBlockState) {
            case MathBlockState.NONE:
                rangeToBeDeleted = new Range(cursor, cursor);
                break;
            case MathBlockState.INLINE:
                rangeToBeDeleted = new Range(new Position(cursor.line, cursor.character - 1), new Position(cursor.line, cursor.character + 1));
                break;
            case MathBlockState.SINGLE_DISPLAYED:
                rangeToBeDeleted = new Range(new Position(cursor.line, cursor.character - 3), new Position(cursor.line, cursor.character + 3));
                break;
            case MathBlockState.MULTI_DISPLAYED:
                rangeToBeDeleted = new Range(new Position(cursor.line - 1, 0), new Position(cursor.line + 1, 2));
                break;
        }
        editBuilder.delete(rangeToBeDeleted)
    }).then(() => {
        // Step 2: Insert new math block.
        editor.edit(editBuilder => {
            let newCursor = editor.selection.active;
            let stringToBeInserted: string
            switch (newMathBlockState) {
                case MathBlockState.NONE:
                    stringToBeInserted = ''
                    break;
                case MathBlockState.INLINE:
                    stringToBeInserted = '$$'
                    break;
                case MathBlockState.SINGLE_DISPLAYED:
                    stringToBeInserted = '$$  $$'
                    break;
                case MathBlockState.MULTI_DISPLAYED:
                    stringToBeInserted = '$$\n\n$$'
                    break;
            }
            editBuilder.insert(newCursor, stringToBeInserted);
        }).then(() => {
            // Step 3: Move cursor to the middle.
            let newCursor = editor.selection.active;
            let newPosition: Position;
            switch (newMathBlockState) {
                case MathBlockState.NONE:
                    newPosition = newCursor
                    break;
                case MathBlockState.INLINE:
                    newPosition = newCursor.with(newCursor.line, newCursor.character - 1)
                    break;
                case MathBlockState.SINGLE_DISPLAYED:
                    newPosition = newCursor.with(newCursor.line, newCursor.character - 3)
                    break;
                case MathBlockState.MULTI_DISPLAYED:
                    newPosition = newCursor.with(newCursor.line - 1, 0)
                    break;
            }
            editor.selection = new Selection(newPosition, newPosition);
        })
    });
}

/**
 * Constant/variable `transTable` defining trans table in `src/ux/markdown-editor`.
 * @zh 常量/变量 `transTable`，定义 `src/ux/markdown-editor` 中的trans表格。
 */
const transTable = [
    MathBlockState.NONE,
    MathBlockState.INLINE,
    MathBlockState.MULTI_DISPLAYED,
    MathBlockState.SINGLE_DISPLAYED
];

/**
 * Constant/variable `reverseTransTable` defining reverse trans table in `src/ux/markdown-editor`.
 * @zh 常量/变量 `reverseTransTable`，定义 `src/ux/markdown-editor` 中的反向Trans表格。
 */
const reverseTransTable = new Array(...transTable).reverse();

/**
 * Executes `toggleMath` to handle toggle math.
 * @zh 执行 `toggleMath`，用于开关Math。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
function toggleMath(editor: TextEditor) {
    _toggleMath(editor, transTable)
}

/**
 * Executes `toggleMathReverse` to handle toggle math reverse.
 * @zh 执行 `toggleMathReverse`，用于开关Math反向。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
function toggleMathReverse(editor: TextEditor) {
    _toggleMath(editor, reverseTransTable)
}

/**
 * Executes `_toggleMath` to handle toggle math.
 * @zh 执行 `_toggleMath`，用于开关Math。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 * @param transTable - trans table parameter (`MathBlockState[]`) / trans表格参数（`MathBlockState[]`）
 */
function _toggleMath(editor: TextEditor, transTable: MathBlockState[]) {
    if (!editor.selection.isEmpty) return;
    let cursor = editor.selection.active;

    let oldMathBlockState = getMathState(editor, cursor)
    let currentStateIndex = transTable.indexOf(oldMathBlockState);
    setMathState(editor, cursor, oldMathBlockState, transTable[(currentStateIndex + 1) % transTable.length])
}

/**
 * Executes `toggleList` to handle toggle list.
 * @zh 执行 `toggleList`，用于开关列表。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 */
function toggleList(editor: TextEditor) {
    const doc = editor.document;
    let batchEdit = new WorkspaceEdit();

    editor.selections.forEach(selection => {
        if (selection.isEmpty) {
            toggleListSingleLine(doc, selection.active.line, batchEdit);
        } else {
            for (let i = selection.start.line; i <= selection.end.line; i++) {
                toggleListSingleLine(doc, i, batchEdit);
            }
        }
    });

    return editor.applyEdit(batchEdit, [])
        .then(() => fixMarker(editor));
}

/**
 * Executes `toggleListSingleLine` to handle toggle list single line.
 * @zh 执行 `toggleListSingleLine`，用于开关列表单个线段。
 * @param doc - doc parameter (`TextDocument`) / 文档参数（`TextDocument`）
 * @param line - line parameter (`number`) / 线段参数（`number`）
 * @param wsEdit - ws edit parameter (`WorkspaceEdit`) / ws编辑参数（`WorkspaceEdit`）
 */
function toggleListSingleLine(doc: TextDocument, line: number, wsEdit: WorkspaceEdit) {
    const lineText = doc.lineAt(line).text;
    const indentation = lineText.trim().length === 0 ? lineText.length : lineText.indexOf(lineText.trim());
    const lineTextContent = lineText.substr(indentation);

    if (lineTextContent.startsWith("- ")) {
        wsEdit.replace(doc.uri, new Range(line, indentation, line, indentation + 2), "* ");
    } else if (lineTextContent.startsWith("* ")) {
        wsEdit.replace(doc.uri, new Range(line, indentation, line, indentation + 2), "+ ");
    } else if (lineTextContent.startsWith("+ ")) {
        wsEdit.replace(doc.uri, new Range(line, indentation, line, indentation + 2), "1. ");
    } else if (/^\d\. /.test(lineTextContent)) {
        wsEdit.replace(doc.uri, new Range(line, indentation + 1, line, indentation + 2), ")");
    } else if (/^\d\) /.test(lineTextContent)) {
        wsEdit.delete(doc.uri, new Range(line, indentation, line, indentation + 3));
    } else {
        wsEdit.insert(doc.uri, new Position(line, indentation), "- ");
    }
}

// async function paste() {
//     const editor = window.activeTextEditor;
//     const selection = editor.selection;
//     if (selection.isSingleLine && !isSingleLink(editor.document.getText(selection))) {
//         const text = await env.clipboard.readText();
//         if (isSingleLink(text)) {
//             return commands.executeCommand("editor.action.insertSnippet", { "snippet": `[$TM_SELECTED_TEXT$0](${text})` });
//         }
//     }
//     return commands.executeCommand("editor.action.clipboardPasteAction");
// }

/**
 * Creates Regexp to check if the text is a link (further detailes in the isSingleLink() documentation).
 *
 * @return Regexp

 * @zh 执行 `createLinkRegex`，用于创建链接正则表达式。
 */
function createLinkRegex(): RegExp {
    // unicode letters range(must not be a raw string)
    const ul = '\\u00a1-\\uffff';
    // IP patterns
    const ipv4_re = '(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}';
    const ipv6_re = '\\[[0-9a-f:\\.]+\\]';  // simple regex (in django it is validated additionally)


    // Host patterns
    const hostname_re = '[a-z' + ul + '0-9](?:[a-z' + ul + '0-9-]{0,61}[a-z' + ul + '0-9])?';
    // Max length for domain name labels is 63 characters per RFC 1034 sec. 3.1
    const domain_re = '(?:\\.(?!-)[a-z' + ul + '0-9-]{1,63})*';

    const tld_re = ''
        + '\\.'                               // dot
        + '(?!-)'                             // can't start with a dash
        + '(?:[a-z' + ul + '-]{2,63}'         // domain label
        + '|xn--[a-z0-9]{1,59})'              // or punycode label
        // + '(?<!-)'                            // can't end with a dash
        + '\\.?'                              // may have a trailing dot
    ;

    const host_re = '(' + hostname_re + domain_re + tld_re + '|localhost)';
    const pattern = ''
        + '^(?:[a-z0-9\\.\\-\\+]*)://'  // scheme is not validated (in django it is validated additionally)
        + '(?:[^\\s:@/]+(?::[^\\s:@/]*)?@)?'  // user: pass authentication
        + '(?:' + ipv4_re + '|' + ipv6_re + '|' + host_re + ')'
        + '(?::\\d{2,5})?'  // port
        + '(?:[/?#][^\\s]*)?'  // resource path
        + '$' // end of string
    ;

    return new RegExp(pattern, 'i');
}

/**
 * Checks if the string is a link. The list of link examples you can see in the tests file
 * `test/linksRecognition.test.ts`. This code ported from django's
 * [URLValidator](https://github.com/django/django/blob/2.2b1/django/core/validators.py#L74) with some simplifyings.
 *
 * @param text string to check
 *
 * @return boolean

 * @zh 执行 `isSingleLink`，用于是否为单个链接。
 */
export function isSingleLink(text: string): boolean {
    return singleLinkRegex.test(text);
}

/**
 * Executes `styleByWrapping` to handle style by wrapping.
 * @zh 执行 `styleByWrapping`，用于样式按Wrapping。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 * @param startPattern - start pattern parameter (`string`) / 开始模式/图案参数（`string`）
 * @param endPattern - end pattern parameter (`string`) / 结束模式/图案参数（`string`）
 */
function styleByWrapping(editor: TextEditor, startPattern: string, endPattern?: string) {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }

    let selections = editor.selections;

    let batchEdit = new WorkspaceEdit();
    let shifts: [Position, number][] = [];
    let newSelections: Selection[] = selections.slice();

    selections.forEach((selection, i) => {
        let cursorPos = selection.active;
        const shift = shifts.map(([pos, s]) => (selection.start.line == pos.line && selection.start.character >= pos.character) ? s : 0)
            .reduce((a, b) => a + b, 0);

        if (selection.isEmpty) {
            // No selected text
            if (startPattern !== '~~' && getContext(editor, cursorPos, startPattern) === `${startPattern}text|${endPattern}`) {
                // `**text|**` to `**text**|`
                let newCursorPos = cursorPos.with({character: cursorPos.character + shift + endPattern.length});
                newSelections[i] = new Selection(newCursorPos, newCursorPos);
                return;
            } else if (getContext(editor, cursorPos, startPattern) === `${startPattern}|${endPattern}`) {
                // `**|**` to `|`
                let start = cursorPos.with({character: cursorPos.character - startPattern.length});
                let end = cursorPos.with({character: cursorPos.character + endPattern.length});
                wrapRange(editor, batchEdit, shifts, newSelections, i, shift, cursorPos, new Range(start, end), false, startPattern);
            } else {
                // Select word under cursor
                let wordRange = editor.document.getWordRangeAtPosition(cursorPos);
                if (wordRange == undefined) {
                    wordRange = selection;
                }
                // One special case: toggle strikethrough in task list
                const currentTextLine = editor.document.lineAt(cursorPos.line);
                if (startPattern === '~~' && /^\s*[\*\+\-] (\[[ x]\] )? */g.test(currentTextLine.text)) {
                    wordRange = currentTextLine.range.with(new Position(cursorPos.line, currentTextLine.text.match(/^\s*[\*\+\-] (\[[ x]\] )? */g)[0].length));
                }
                wrapRange(editor, batchEdit, shifts, newSelections, i, shift, cursorPos, wordRange, false, startPattern);
            }
        } else {
            // Text selected
            wrapRange(editor, batchEdit, shifts, newSelections, i, shift, cursorPos, selection, true, startPattern);
        }
    });

    const hasSelection = editor.selection && !editor.selection.isEmpty;

    return editor.applyEdit(batchEdit, newSelections).then(() => {
        if (!hasSelection) {
            editor.selections = newSelections;
        }
    });
}

/**
 * Add or remove `startPattern`/`endPattern` according to the context
 * @param editor
 * @param options The undo/redo behavior
 * @param cursor cursor position
 * @param range range to be replaced
 * @param isSelected is this range selected
 * @param startPtn
 * @param endPtn

 * @zh 执行 `wrapRange`，用于包裹范围。
 */
function wrapRange(editor: TextEditor, wsEdit: WorkspaceEdit, shifts: [Position, number][], newSelections: Selection[], i: number, shift: number, cursor: Position, range: Range, isSelected: boolean, startPtn: string, endPtn?: string) {
    if (endPtn == undefined) {
        endPtn = startPtn;
    }

    let text = editor.document.getText(range);
    const prevSelection = newSelections[i];
    const ptnLength = (startPtn + endPtn).length;

    let newCursorPos = cursor.with({character: cursor.character + shift});
    let newSelection: Selection;
    if (isWrapped(text, startPtn)) {
        // remove start/end patterns from range
        wsEdit.replace(editor.document.uri, range, text.substr(startPtn.length, text.length - ptnLength));

        shifts.push([range.end, -ptnLength]);

        // Fix cursor position
        if (!isSelected) {
            if (!range.isEmpty) { // means quick styling
                if (cursor.character == range.end.character) {
                    newCursorPos = cursor.with({character: cursor.character + shift - ptnLength});
                } else {
                    newCursorPos = cursor.with({character: cursor.character + shift - startPtn.length});
                }
            } else { // means `**|**` -> `|`
                newCursorPos = cursor.with({character: cursor.character + shift + startPtn.length});
            }
            newSelection = new Selection(newCursorPos, newCursorPos);
        } else {
            newSelection = new Selection(
                prevSelection.start.with({character: prevSelection.start.character + shift}),
                prevSelection.end.with({character: prevSelection.end.character + shift - ptnLength})
            );
        }
    } else {
        // add start/end patterns around range
        wsEdit.replace(editor.document.uri, range, startPtn + text + endPtn);

        shifts.push([range.end, ptnLength]);

        // Fix cursor position
        if (!isSelected) {
            if (!range.isEmpty) { // means quick styling
                if (cursor.character == range.end.character) {
                    newCursorPos = cursor.with({character: cursor.character + shift + ptnLength});
                } else {
                    newCursorPos = cursor.with({character: cursor.character + shift + startPtn.length});
                }
            } else { // means `|` -> `**|**`
                newCursorPos = cursor.with({character: cursor.character + shift + startPtn.length});
            }
            newSelection = new Selection(newCursorPos, newCursorPos);
        } else {
            newSelection = new Selection(
                prevSelection.start.with({character: prevSelection.start.character + shift}),
                prevSelection.end.with({character: prevSelection.end.character + shift + ptnLength})
            );
        }
    }

    newSelections[i] = newSelection;
}

/**
 * Executes `isWrapped` to handle is wrapped.
 * @zh 执行 `isWrapped`，用于是否为Wrapped。
 * @param text - text parameter (`string`) / 文本参数（`string`）
 * @param startPattern - start pattern parameter (`string`) / 开始模式/图案参数（`string`）
 * @param endPattern - end pattern parameter (`string`) / 结束模式/图案参数（`string`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
function isWrapped(text: string, startPattern: string, endPattern?: string): boolean {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }
    return text.startsWith(startPattern) && text.endsWith(endPattern);
}

/**
 * Executes `getContext` to handle get context.
 * @zh 执行 `getContext`，用于获取上下文。
 * @param editor - editor parameter (`TextEditor`) / 编辑器参数（`TextEditor`）
 * @param cursorPos - cursor pos parameter (`Position`) / 光标位置参数（`Position`）
 * @param startPattern - start pattern parameter (`string`) / 开始模式/图案参数（`string`）
 * @param endPattern - end pattern parameter (`string`) / 结束模式/图案参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function getContext(editor: TextEditor, cursorPos: Position, startPattern: string, endPattern?: string): string {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }

    let startPositionCharacter = cursorPos.character - startPattern.length;
    let endPositionCharacter = cursorPos.character + endPattern.length;

    if (startPositionCharacter < 0) {
        startPositionCharacter = 0;
    }

    let leftText = editor.document.getText(new Range(cursorPos.line, startPositionCharacter, cursorPos.line, cursorPos.character));
    let rightText = editor.document.getText(new Range(cursorPos.line, cursorPos.character, cursorPos.line, endPositionCharacter));

    if (rightText == endPattern) {
        if (leftText == startPattern) {
            return `${startPattern}|${endPattern}`;
        } else {
            return `${startPattern}text|${endPattern}`;
        }
    }
    return '|';
}
