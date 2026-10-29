/**
 * @fileoverview Module `src/ux/markdown-editor/vscode-monaco.ts` providing vscode monaco definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/vscode-monaco.ts`，提供vscodeMonaco编辑器相关的定义与实现。
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    EndOfLine,
    Position,
    Range,
    Selection,
    TextEditorRevealType, WorkspaceEdit,
} from './extHostTypes';

import {
    editor,
    Selection as _Selection,
    IRange,
    Uri,
    Thenable
} from "monaco-editor";
import {regExpLeadsToEndlessLoop} from "./vscode-utils";
import {ensureValidWordDefinition, getWordAtText} from "./wordHelper";

import * as TypeConverters from './vscode-converters'
import {TextLine} from "./vscode-common";

/**
 * Constant/variable `_modeId2WordDefinition` defining mode id2 word definition in `src/ux/markdown-editor`.
 * @zh 常量/变量 `_modeId2WordDefinition`，定义 `src/ux/markdown-editor` 中的模式Id2WordDefinition。
 */
const _modeId2WordDefinition = new Map<string, RegExp>();

/**
 * Executes `setWordDefinitionFor` to handle set word definition for.
 * @zh 执行 `setWordDefinitionFor`，用于集合WordDefinition用于。
 * @param modeId - mode id parameter (`string`) / 模式唯一标识参数（`string`）
 * @param wordDefinition - word definition parameter (`RegExp`) / wordDefinition参数（`RegExp`）
 */
export function setWordDefinitionFor(modeId: string, wordDefinition: RegExp | undefined): void {
    _modeId2WordDefinition.set(modeId, wordDefinition);
}

/**
 * Executes `getWordDefinitionFor` to handle get word definition for.
 * @zh 执行 `getWordDefinitionFor`，用于获取WordDefinition用于。
 * @param modeId - mode id parameter (`string`) / 模式唯一标识参数（`string`）
 * @returns Result of type `RegExp` / 类型为 `RegExp` 的返回值
 */
export function getWordDefinitionFor(modeId: string): RegExp | undefined {
    return _modeId2WordDefinition.get(modeId);
}

/**
 * Executes `revealRangeInEditor` to handle reveal range in editor.
 * @zh 执行 `revealRangeInEditor`，用于reveal范围在编辑器。
 * @param _editor - editor parameter (`editor.ICodeEditor`) / 编辑器参数（`editor.ICodeEditor`）
 * @param range - range parameter (`IRange`) / 范围参数（`IRange`）
 * @param revealType - reveal type parameter (`TextEditorRevealType`) / reveal类型参数（`TextEditorRevealType`）
 */
function revealRangeInEditor(_editor: editor.ICodeEditor, range: IRange, revealType: TextEditorRevealType): void {
    switch (revealType) {
        case TextEditorRevealType.Default:
        case undefined:
            _editor.revealRange(range, editor.ScrollType.Smooth);
            break;
        case TextEditorRevealType.InCenter:
            _editor.revealRangeInCenter(range, editor.ScrollType.Smooth);
            break;
        case TextEditorRevealType.InCenterIfOutsideViewport:
            _editor.revealRangeInCenterIfOutsideViewport(range, editor.ScrollType.Smooth);
            break;
        case TextEditorRevealType.AtTop:
            _editor.revealRangeAtTop(range, editor.ScrollType.Smooth);
            break;
        default:
            console.warn(`Unknown revealType: ${revealType}`);
            break;
    }
}

/**
 * Class `TextDocument` encapsulating text document data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `TextDocument`，封装 `src/ux/markdown-editor` 中的文本文档对象数据结构与处理逻辑。
 */
export class TextDocument {
    /**
     * Property `uri` (`Uri`) storing uri.
     * @zh 属性 `uri`（类型：`Uri`），用于存储或配置资源标识。
     */
    readonly uri: Uri;
    /**
     * Property `version` (`number`) storing version.
     * @zh 属性 `version`（类型：`number`），用于存储或配置version。
     */
    readonly version: number;

    /**
     * Property `model` (`editor.ITextModel`) storing model.
     * @zh 属性 `model`（类型：`editor.ITextModel`），用于存储或配置模型。
     */
    readonly model: editor.ITextModel;

    /**
     * Property `_textLines` (`TextLine[]`) storing text lines (default: `[]`).
     * @zh 属性 `_textLines`（类型：`TextLine[]`），用于存储或配置文本线段（默认值：`[]`）。
     */
    private _textLines: TextLine[] = [];

    /**
     * Creates an instance of `TextDocument` and initializes its dependencies and internal state.
     * @zh 创建 `TextDocument` 实例，并初始化其依赖项与内部状态。
     * @param model - Injected or initial model (`editor.ITextModel`) / 注入或传入的模型（`editor.ITextModel`）
     */
    constructor(model: editor.ITextModel) {
        this.model = model;
        this.languageId = getLanguageId(model)
    }

    /**
     * Gets the current eol (`eol: EndOfLine`).
     * @zh 获取当前eol（`eol: EndOfLine`）。
     */
    get eol(): EndOfLine {
        switch (this.model.getEOL()) {
            case '\n': {
                return EndOfLine.LF
            }
            case '\r\n': {
                return EndOfLine.CRLF
            }
            default: {
                throw new Error("invalid argument")
            }
        }
    };

    /**
     * Gets the current file name (`fileName: string`).
     * @zh 获取当前文件名称（`fileName: string`）。
     */
    get fileName(): string {
        return ''
    }

    /**
     * Gets the current is closed (`isClosed: boolean`).
     * @zh 获取当前是否为是否关闭（`isClosed: boolean`）。
     */
    get isClosed(): boolean {
        return false
    }

    /**
     * Gets the current is dirty (`isDirty: boolean`).
     * @zh 获取当前是否为是否已修改（`isDirty: boolean`）。
     */
    get isDirty(): boolean {
        return false
    }

    /**
     * Gets the current is untitled (`isUntitled: boolean`).
     * @zh 获取当前是否为Untitled（`isUntitled: boolean`）。
     */
    get isUntitled(): boolean {
        return true;
    }

    /**
     * Property `languageId` (`string`) storing language id.
     * @zh 属性 `languageId`（类型：`string`），用于存储或配置语言唯一标识。
     */
    readonly languageId: string;

    /**
     * Gets the current line count (`lineCount: number`).
     * @zh 获取当前线段计数（`lineCount: number`）。
     */
    get lineCount(): number {
        return this.model.getLineCount()
    }


    /**
     * Gets the current lines (`_lines: string[]`).
     * @zh 获取当前线段（`_lines: string[]`）。
     */
    private get _lines(): string[] {
        return this.model.getLinesContent()
    }

    /**
     * Executes `getText` to handle get text.
     * @zh 执行 `getText`，用于获取文本。
     * @param range - range parameter (`Range`) / 范围参数（`Range`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    getText(range?: Range): string {
        if (!range) {
            return this.model.getValue()
        }
        return this.model.getValueInRange(TypeConverters.Range.from(range));
    }

    /**
     * Executes `lineAt` to handle line at.
     * @zh 执行 `lineAt`，用于线段位于。
     * @param lineOrPosition - line or position parameter (`number | Position`) / 线段Or位置参数（`number | Position`）
     * @returns Result of type `TextLine` / 类型为 `TextLine` 的返回值
     */
    lineAt(lineOrPosition: number | Position): TextLine {
        let line: number | undefined;
        if (lineOrPosition instanceof Position) {
            line = lineOrPosition.line;
        } else if (typeof lineOrPosition === 'number') {
            line = lineOrPosition;
        }

        if (typeof line !== 'number' || line < 0 || line >= this._lines.length) {
            throw new Error('Illegal value for `line`');
        }

        let result = this._textLines[line];
        if (!result || result.lineNumber !== line || result.text !== this._lines[line]) {

            const text = this._lines[line];
            const firstNonWhitespaceCharacterIndex = /^(\s*)/.exec(text)![1].length;
            const range = new Range(line, 0, line, text.length);
            const rangeIncludingLineBreak = line < this._lines.length - 1
                ? new Range(line, 0, line + 1, 0)
                : range;

            result = Object.freeze({
                lineNumber: line,
                range,
                rangeIncludingLineBreak,
                text,
                firstNonWhitespaceCharacterIndex, //TODO@api, rename to 'leadingWhitespaceLength'
                isEmptyOrWhitespace: firstNonWhitespaceCharacterIndex === text.length
            });

            this._textLines[line] = result;
        }

        return result;
    }

    /**
     * Executes `offsetAt` to handle offset at.
     * @zh 执行 `offsetAt`，用于偏移量位于。
     * @param position - position parameter (`Position`) / 位置参数（`Position`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    offsetAt(position: Position): number {
        return this.model.getOffsetAt(TypeConverters.Position.from(position))
    }

    /**
     * Executes `positionAt` to handle position at.
     * @zh 执行 `positionAt`，用于位置位于。
     * @param offset - offset parameter (`number`) / 偏移量参数（`number`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    positionAt(offset: number): Position {
        return TypeConverters.Position.to(this.model.getPositionAt(offset))
    }

    /**
     * Executes `save` to handle save.
     * @zh 执行 `save`，用于保存。
     * @returns Result of type `Thenable<boolean>` / 类型为 `Thenable<boolean>` 的返回值
     */
    save(): Thenable<boolean> {
        throw new Error("Not implemented")
    }

    /**
     * Executes `validateRange` to handle validate range.
     * @zh 执行 `validateRange`，用于校验范围。
     * @param range - range parameter (`Range`) / 范围参数（`Range`）
     * @returns Result of type `Range` / 类型为 `Range` 的返回值
     */
    validateRange(range: Range): Range {
        if (!(range instanceof Range)) {
            throw new Error('Invalid argument');
        }

        const start = this.validatePosition(range.start);
        const end = this.validatePosition(range.end);

        if (start === range.start && end === range.end) {
            return range;
        }
        return new Range(start.line, start.character, end.line, end.character);
    }

    /**
     * Executes `validatePosition` to handle validate position.
     * @zh 执行 `validatePosition`，用于校验位置。
     * @param position - position parameter (`Position`) / 位置参数（`Position`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    validatePosition(position: Position): Position {
        if (!(position instanceof Position)) {
            throw new Error('Invalid argument');
        }

        let {line, character} = position;
        let hasChanged = false;

        if (line < 0) {
            line = 0;
            character = 0;
            hasChanged = true;
        } else if (line >= this._lines.length) {
            line = this._lines.length - 1;
            character = this._lines[line].length;
            hasChanged = true;
        } else {
            const maxCharacter = this._lines[line].length;
            if (character < 0) {
                character = 0;
                hasChanged = true;
            } else if (character > maxCharacter) {
                character = maxCharacter;
                hasChanged = true;
            }
        }

        if (!hasChanged) {
            return position;
        }
        return new Position(line, character);
    }

    /**
     * Executes `getWordRangeAtPosition` to handle get word range at position.
     * @zh 执行 `getWordRangeAtPosition`，用于获取Word范围位于位置。
     * @param _position - position parameter (`Position`) / 位置参数（`Position`）
     * @param regexp - regexp parameter (`RegExp`) / regexp参数（`RegExp`）
     * @returns Result of type `Range` / 类型为 `Range` 的返回值
     */
    getWordRangeAtPosition(_position: Position, regexp?: RegExp): Range | undefined {
        const position = this.validatePosition(_position);

        if (!regexp) {
            // use default when custom-regexp isn't provided
            regexp = getWordDefinitionFor(this.languageId);

        } else if (regExpLeadsToEndlessLoop(regexp)) {
            // use default when custom-regexp is bad
            console.warn(`[getWordRangeAtPosition]: ignoring custom regexp '${regexp.source}' because it matches the empty string.`);
            regexp = getWordDefinitionFor(this.languageId);
        }

        const wordAtText = getWordAtText(
            position.character + 1,
            ensureValidWordDefinition(regexp),
            this._lines[position.line],
            0
        );

        if (wordAtText) {
            return new Range(position.line, wordAtText.startColumn - 1, position.line, wordAtText.endColumn - 1);
        }
        return undefined;
    }
}


/**
 * Executes `getLanguageId` to handle get language id.
 * @zh 执行 `getLanguageId`，用于获取语言唯一标识。
 * @param model - model parameter (`editor.ITextModel`) / 模型参数（`editor.ITextModel`）
 */
function getLanguageId(model: editor.ITextModel) {
    // @ts-ignore
    return model.getLanguageId();
}

/**
 * Class `TextEditor` encapsulating text editor data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `TextEditor`，封装 `src/ux/markdown-editor` 中的文本编辑器数据结构与处理逻辑。
 */
export class TextEditor {
    /**
     * Property `editor` (`editor.IStandaloneCodeEditor`) storing editor.
     * @zh 属性 `editor`（类型：`editor.IStandaloneCodeEditor`），用于存储或配置编辑器。
     */
    public readonly editor: editor.IStandaloneCodeEditor;
    /**
     * Property `_disposed` (`boolean`) storing disposed (default: `false`).
     * @zh 属性 `_disposed`（类型：`boolean`），用于存储或配置已释放（默认值：`false`）。
     */
    private _disposed: boolean = false;

    /**
     * Gets the current language id (`languageId: string`).
     * @zh 获取当前语言唯一标识（`languageId: string`）。
     */
    public get languageId(): string {
        return getLanguageId(this.editor.getModel())
    }

    /**
     * Creates an instance of `TextEditor` and initializes its dependencies and internal state.
     * @zh 创建 `TextEditor` 实例，并初始化其依赖项与内部状态。
     * @param editor - Injected or initial editor (`editor.IStandaloneCodeEditor`) / 注入或传入的编辑器（`editor.IStandaloneCodeEditor`）
     */
    constructor(editor: editor.IStandaloneCodeEditor) {
        this.editor = editor;
    }

    /**
     * Gets the current document (`document: TextDocument`).
     * @zh 获取当前文档对象（`document: TextDocument`）。
     */
    get document(): TextDocument {
        return new TextDocument(this.editor.getModel())
    }

    /**
     * Gets the current selection (`selection: Selection`).
     * @zh 获取当前selection（`selection: Selection`）。
     */
    get selection(): Selection {
        return TypeConverters.Selection.to(this.editor.getSelection())
    }

    /**
     * Sets the selection (`selection`).
     * @zh 设置selection（`selection`）。
     * @param value - New selection value (`Selection`) / 新的selection值（`Selection`）
     */
    set selection(value: Selection) {
        this.editor.setSelection(TypeConverters.Selection.from(value))
    }

    /**
     * Gets the current selections (`selections: Selection[]`).
     * @zh 获取当前selections（`selections: Selection[]`）。
     */
    get selections(): Selection[] {
        return this.editor.getSelections().map(s => TypeConverters.Selection.to(s))
    }

    /**
     * Sets the selections (`selections`).
     * @zh 设置selections（`selections`）。
     * @param value - New selections value (`Selection[]`) / 新的selections值（`Selection[]`）
     */
    set selections(value: Selection[]) {
        this.editor.setSelections(value.map(s => TypeConverters.Selection.from(s)))
    }

    /**
     * Gets the current visible ranges (`visibleRanges: Range[]`).
     * @zh 获取当前可见范围列表（`visibleRanges: Range[]`）。
     */
    get visibleRanges(): Range[] {
        return this.editor.getVisibleRanges().map(r => TypeConverters.Range.to(r))
    }

    /**
     * Executes `edit` to handle edit.
     * @zh 执行 `edit`，用于编辑。
     * @param callback - callback parameter (`(edit: TextEditorEdit) => void`) / 回调函数参数（`(edit: TextEditorEdit) => void`）
     * @param options - options parameter (`{ undoStopBefore: boolean; undoStopAfter: boolean; }`) / 配置选项参数（`{ undoStopBefore: boolean; undoStopAfter: boolean; }`）
     * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
     */
    edit(callback: (edit: TextEditorEdit) => void, options: { undoStopBefore: boolean; undoStopAfter: boolean; } = {
        undoStopBefore: true,
        undoStopAfter: true
    }): Promise<void> {
        if (this._disposed) {
            return Promise.reject(new Error('TextEditor#edit not possible on closed editors'));
        }
        const edit = new TextEditorEdit(this.document, options);
        callback(edit);
        return this._applyEdit(edit);
    }

    /**
     * Executes `_applyEdit` to handle apply edit.
     * @zh 执行 `_applyEdit`，用于应用编辑。
     * @param editBuilder - edit builder parameter (`TextEditorEdit`) / 编辑构建器参数（`TextEditorEdit`）
     * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
     */
    private _applyEdit(editBuilder: TextEditorEdit): Promise<void> {
        const editData = editBuilder.finalize();

        // return when there is nothing to do
        if (editData.edits.length === 0 && !editData.setEndOfLine) {
            return Promise.resolve(null);
        }

        // check that the edits are not overlapping (i.e. illegal)
        const editRanges = editData.edits.map(edit => edit.range);

        // sort ascending (by end and then by start)
        editRanges.sort((a, b) => {
            if (a.end.line === b.end.line) {
                if (a.end.character === b.end.character) {
                    if (a.start.line === b.start.line) {
                        return a.start.character - b.start.character;
                    }
                    return a.start.line - b.start.line;
                }
                return a.end.character - b.end.character;
            }
            return a.end.line - b.end.line;
        });

        // check that no edits are overlapping
        for (let i = 0, count = editRanges.length - 1; i < count; i++) {
            const rangeEnd = editRanges[i].end;
            const nextRangeStart = editRanges[i + 1].start;

            if (nextRangeStart.isBefore(rangeEnd)) {
                // overlapping ranges
                return Promise.reject(
                    new Error('Overlapping ranges are not allowed!')
                );
            }
        }

        // prepare data for serialization
        const edits = editData.edits.map((edit): editor.IIdentifiedSingleEditOperation => {
            return {
                range: TypeConverters.Range.from(edit.range),
                text: edit.text,
                forceMoveMarkers: edit.forceMoveMarkers
            };
        });

        this.editor.getModel().pushEditOperations(this.editor.getSelections(), edits,
            (): _Selection[] => {
                return [];
            })

        return Promise.resolve(null)
    }

    // insertSnippet(snippet: SnippetString, where?: Position | readonly Position[] | Range | readonly Range[], options: { undoStopBefore: boolean; undoStopAfter: boolean; } = {
    //     undoStopBefore: true,
    //     undoStopAfter: true
    // }): Promise<boolean> {}

    // hide(): void {
    //     throw new Error("Not implemented")
    // }

    /**
     * Executes `revealRange` to handle reveal range.
     * @zh 执行 `revealRange`，用于reveal范围。
     * @param range - range parameter (`Range`) / 范围参数（`Range`）
     * @param revealType - reveal type parameter (`TextEditorRevealType`) / reveal类型参数（`TextEditorRevealType`）
     */
    // @ts-ignore
    // show(column?: ViewColumn): void {
    //     throw new Error("Not implemented")
    // }

    revealRange(range: Range, revealType?: TextEditorRevealType): void {
        revealRangeInEditor(this.editor, TypeConverters.Range.from(range), revealType)
    }

    /**
     * Executes `applyEdit` to handle apply edit.
     * @zh 执行 `applyEdit`，用于应用编辑。
     * @param edit - edit parameter (`WorkspaceEdit`) / 编辑参数（`WorkspaceEdit`）
     * @param newSelections - new selections parameter (`Selection[]`) / 新Selections参数（`Selection[]`）
     * @returns Result of type `Thenable<void>` / 类型为 `Thenable<void>` 的返回值
     */
    // @ts-ignore
    // setDecorations(decorationType: TextEditorDecorationType, rangesOrOptions: Range[] | DecorationOptions[]): void {
    //     throw new Error("Not implemented")
    // }

    applyEdit(edit: WorkspaceEdit, newSelections?: Selection[]): Thenable<void> {
        if (!newSelections) {
            newSelections = []
        }
        this.editor.getModel().pushEditOperations(this.editor.getSelections(), TypeConverters.WorkspaceEdit.from(edit),
            (): _Selection[] => {
                return newSelections.map(s => TypeConverters.Selection.from(s));
            })

        return Promise.resolve(null)
    }

    /**
     * Executes `addAction` to handle add action.
     * @zh 执行 `addAction`，用于添加动作。
     * @param param - param parameter (`{…}`) / 参数参数（`{…}`）
     */
    addAction(param: { contextMenuOrder: number; keybindingContext: string; run(editor: editor.ICodeEditor): (void | Promise<void>); id: string; label: string; precondition: string; contextMenuGroupId: string; keybindings: number[] }) {
        this.editor.addAction(param)
    }

    /**
     * Executes `executeCommand` to handle execute command.
     * @zh 执行 `executeCommand`，用于执行命令。
     * @param commandId - command id parameter (`string`) / 命令唯一标识参数（`string`）
     * @param rest - rest parameter (`any[]`) / rest参数（`any[]`）
     * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
     */
    executeCommand(commandId: string, ...rest): Promise<void> {
        switch (commandId) {
            case 'type':
                this.editor.trigger('keyboard', commandId, rest[0])
                return Promise.resolve()
            case 'tab':
            case 'deleteLeft':
                this.editor.trigger('keyboard', commandId, undefined)
                return Promise.resolve()
            default:
                let action = this.editor.getAction(commandId)
                if (action) {
                    if (action.isSupported()) {
                        return action.run();
                    }
                } else {
                    new Error("unknown action id " + commandId)
                }
        }
        return Promise.resolve(null)
    }

    /**
     * Executes `getConfiguration` to handle get configuration.
     * @zh 执行 `getConfiguration`，用于获取配置项。
     * @param configurationId - configuration id parameter (`string`) / 配置项唯一标识参数（`string`）
     */
    getConfiguration(configurationId: string) {
        switch (configurationId) {
            case '':
                break
            default:
                return new UndefinedConfiguration()
        }
        return null
    }
}

/**
 * Class `UndefinedConfiguration` encapsulating undefined configuration data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `UndefinedConfiguration`，封装 `src/ux/markdown-editor` 中的未定义配置项数据结构与处理逻辑。
 */
class UndefinedConfiguration {
    /**
     * Executes `get` to handle get.
     * @zh 执行 `get`，用于获取。
     * @param _ - _ parameter (`string`) / _参数（`string`）
     * @returns Result of type `T` / 类型为 `T` 的返回值
     */
    get<T>(_: string): T {
        return undefined;
    }
}

/**
 * Interface `ITextEditOperation` defining the contract and properties for i text edit operation.
 * @zh 接口 `ITextEditOperation`，定义I文本编辑Operation的数据结构契约与属性规范。
 */
export interface ITextEditOperation {
    /**
     * Property `range` (`Range`) storing range.
     * @zh 属性 `range`（类型：`Range`），用于存储或配置范围。
     */
    range: Range;
    /**
     * Property `text` (`string`) storing text.
     * @zh 属性 `text`（类型：`string`），用于存储或配置文本。
     */
    text: string | null;
    /**
     * Property `forceMoveMarkers` (`boolean`) storing force move markers.
     * @zh 属性 `forceMoveMarkers`（类型：`boolean`），用于存储或配置force移动标记点。
     */
    forceMoveMarkers: boolean;
}

/**
 * Interface `IEditData` defining the contract and properties for i edit data.
 * @zh 接口 `IEditData`，定义I编辑数据的数据结构契约与属性规范。
 */
export interface IEditData {
    /**
     * Property `documentVersionId` (`number`) storing document version id.
     * @zh 属性 `documentVersionId`（类型：`number`），用于存储或配置文档对象Version唯一标识。
     */
    documentVersionId: number;
    /**
     * Property `edits` (`ITextEditOperation[]`) storing edits.
     * @zh 属性 `edits`（类型：`ITextEditOperation[]`），用于存储或配置编辑。
     */
    edits: ITextEditOperation[];
    /**
     * Property `setEndOfLine` (`EndOfLine`) storing set end of line.
     * @zh 属性 `setEndOfLine`（类型：`EndOfLine`），用于存储或配置集合结束的线段。
     */
    setEndOfLine: EndOfLine | undefined;
    /**
     * Property `undoStopBefore` (`boolean`) storing undo stop before.
     * @zh 属性 `undoStopBefore`（类型：`boolean`），用于存储或配置撤销停止之前。
     */
    undoStopBefore: boolean;
    /**
     * Property `undoStopAfter` (`boolean`) storing undo stop after.
     * @zh 属性 `undoStopAfter`（类型：`boolean`），用于存储或配置撤销停止之后。
     */
    undoStopAfter: boolean;
}

/**
 * Class `TextEditorEdit` encapsulating text editor edit data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `TextEditorEdit`，封装 `src/ux/markdown-editor` 中的文本编辑器编辑数据结构与处理逻辑。
 */
export class TextEditorEdit {
    /**
     * Property `_document` (`TextDocument`) storing document.
     * @zh 属性 `_document`（类型：`TextDocument`），用于存储或配置文档对象。
     */
    private readonly _document: TextDocument;
    /**
     * Property `_documentVersionId` (`number`) storing document version id.
     * @zh 属性 `_documentVersionId`（类型：`number`），用于存储或配置文档对象Version唯一标识。
     */
    private readonly _documentVersionId: number;
    /**
     * Property `_undoStopBefore` (`boolean`) storing undo stop before.
     * @zh 属性 `_undoStopBefore`（类型：`boolean`），用于存储或配置撤销停止之前。
     */
    private readonly _undoStopBefore: boolean;
    /**
     * Property `_undoStopAfter` (`boolean`) storing undo stop after.
     * @zh 属性 `_undoStopAfter`（类型：`boolean`），用于存储或配置撤销停止之后。
     */
    private readonly _undoStopAfter: boolean;
    /**
     * Property `_collectedEdits` (`ITextEditOperation[]`) storing collected edits (default: `[]`).
     * @zh 属性 `_collectedEdits`（类型：`ITextEditOperation[]`），用于存储或配置collected编辑（默认值：`[]`）。
     */
    private _collectedEdits: ITextEditOperation[] = [];
    /**
     * Property `_setEndOfLine` (`EndOfLine`) storing set end of line (default: `undefined`).
     * @zh 属性 `_setEndOfLine`（类型：`EndOfLine`），用于存储或配置集合结束的线段（默认值：`undefined`）。
     */
    private _setEndOfLine: EndOfLine | undefined = undefined;
    /**
     * Property `_finalized` (`boolean`) storing finalized (default: `false`).
     * @zh 属性 `_finalized`（类型：`boolean`），用于存储或配置finalized（默认值：`false`）。
     */
    private _finalized: boolean = false;

    /**
     * Creates an instance of `TextEditorEdit` and initializes its dependencies and internal state.
     * @zh 创建 `TextEditorEdit` 实例，并初始化其依赖项与内部状态。
     * @param document - Injected or initial document (`TextDocument`) / 注入或传入的文档对象（`TextDocument`）
     * @param options - Injected or initial options (`{ undoStopBefore: boolean; undoStopAfter: boolean; }`) / 注入或传入的配置选项（`{ undoStopBefore: boolean; undoStopAfter: boolean; }`）
     */
    constructor(document: TextDocument, options: { undoStopBefore: boolean; undoStopAfter: boolean; }) {
        this._document = document;
        this._documentVersionId = document.version;
        this._undoStopBefore = options.undoStopBefore;
        this._undoStopAfter = options.undoStopAfter;
    }

    /**
     * Executes `finalize` to handle finalize.
     * @zh 执行 `finalize`，用于finalize。
     * @returns Result of type `IEditData` / 类型为 `IEditData` 的返回值
     */
    finalize(): IEditData {
        this._finalized = true;
        return {
            documentVersionId: this._documentVersionId,
            edits: this._collectedEdits,
            setEndOfLine: this._setEndOfLine,
            undoStopBefore: this._undoStopBefore,
            undoStopAfter: this._undoStopAfter
        };
    }

    /**
     * Executes `_throwIfFinalized` to handle throw if finalized.
     * @zh 执行 `_throwIfFinalized`，用于throwIfFinalized。
     */
    private _throwIfFinalized() {
        if (this._finalized) {
            throw new Error('Edit is only valid while callback runs');
        }
    }

    /**
     * Executes `replace` to handle replace.
     * @zh 执行 `replace`，用于替换。
     * @param location - location parameter (`Position | Range | Selection`) / location参数（`Position | Range | Selection`）
     * @param value - value parameter (`string`) / 值参数（`string`）
     */
    replace(location: Position | Range | Selection, value: string): void {
        this._throwIfFinalized();
        let range: Range | null = null;

        if (location instanceof Position) {
            range = new Range(location, location);
        } else if (location instanceof Range) {
            range = location;
        } else {
            throw new Error('Unrecognized location');
        }

        this._pushEdit(range, value, false);
    }

    /**
     * Executes `insert` to handle insert.
     * @zh 执行 `insert`，用于插入。
     * @param location - location parameter (`Position`) / location参数（`Position`）
     * @param value - value parameter (`string`) / 值参数（`string`）
     */
    insert(location: Position, value: string): void {
        this._throwIfFinalized();
        this._pushEdit(new Range(location, location), value, true);
    }

    /**
     * Executes `delete` to handle delete.
     * @zh 执行 `delete`，用于删除。
     * @param location - location parameter (`Range | Selection`) / location参数（`Range | Selection`）
     */
    delete(location: Range | Selection): void {
        this._throwIfFinalized();
        let range: Range | null = null;

        if (location instanceof Range) {
            range = location;
        } else {
            throw new Error('Unrecognized location');
        }

        this._pushEdit(range, null, true);
    }

    /**
     * Executes `_pushEdit` to handle push edit.
     * @zh 执行 `_pushEdit`，用于推入编辑。
     * @param range - range parameter (`Range`) / 范围参数（`Range`）
     * @param text - text parameter (`string`) / 文本参数（`string`）
     * @param forceMoveMarkers - force move markers parameter (`boolean`) / force移动标记点参数（`boolean`）
     */
    private _pushEdit(range: Range, text: string | null, forceMoveMarkers: boolean): void {
        const validRange = this._document.validateRange(range);
        this._collectedEdits.push({
            range: validRange,
            text: text,
            forceMoveMarkers: forceMoveMarkers
        });
    }

    /**
     * Executes `setEndOfLine` to handle set end of line.
     * @zh 执行 `setEndOfLine`，用于集合结束的线段。
     * @param endOfLine - end of line parameter (`EndOfLine`) / 结束的线段参数（`EndOfLine`）
     */
    setEndOfLine(endOfLine: EndOfLine): void {
        this._throwIfFinalized();
        if (endOfLine !== EndOfLine.LF && endOfLine !== EndOfLine.CRLF) {
            throw new Error('Illegal argument endOfLine');
        }

        this._setEndOfLine = endOfLine;
    }
}
