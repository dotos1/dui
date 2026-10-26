/**
 * @fileoverview Module `src/ux/markdown-editor/vscode-converters.ts` providing vscode converters definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/vscode-converters.ts`，提供vscodeconverters相关的定义与实现。
 */

import {editor, Range as _Range, Position as _Position, IRange, Selection as _Selection, IPosition} from "monaco-editor";

import * as vscode from "./extHostTypes";

/**
 * Interface `PositionLike` defining the contract and properties for position like.
 * @zh 接口 `PositionLike`，定义位置Like的数据结构契约与属性规范。
 */
export interface PositionLike {
    /**
     * Property `line` (`number`) storing line.
     * @zh 属性 `line`（类型：`number`），用于存储或配置线段。
     */
    line: number;
    /**
     * Property `character` (`number`) storing character.
     * @zh 属性 `character`（类型：`number`），用于存储或配置字符。
     */
    character: number;
}

/**
 * Interface `RangeLike` defining the contract and properties for range like.
 * @zh 接口 `RangeLike`，定义范围Like的数据结构契约与属性规范。
 */
export interface RangeLike {
    /**
     * Property `start` (`PositionLike`) storing start.
     * @zh 属性 `start`（类型：`PositionLike`），用于存储或配置开始。
     */
    start: PositionLike;
    /**
     * Property `end` (`PositionLike`) storing end.
     * @zh 属性 `end`（类型：`PositionLike`），用于存储或配置结束。
     */
    end: PositionLike;
}

/**
 * Interface `SelectionLike` defining the contract and properties for selection like.
 * @zh 接口 `SelectionLike`，定义SelectionLike的数据结构契约与属性规范。
 */
export interface SelectionLike extends RangeLike {
    /**
     * Property `anchor` (`PositionLike`) storing anchor.
     * @zh 属性 `anchor`（类型：`PositionLike`），用于存储或配置锚点。
     */
    anchor: PositionLike;
    /**
     * Property `active` (`PositionLike`) storing active.
     * @zh 属性 `active`（类型：`PositionLike`），用于存储或配置激活。
     */
    active: PositionLike;
}

export namespace Selection {

    /**
     * Executes `to` to handle to.
     * @zh 执行 `to`，用于转换为。
     * @param selection - selection parameter (`_Selection`) / selection参数（`_Selection`）
     * @returns Result of type `vscode.Selection` / 类型为 `vscode.Selection` 的返回值
     */
    export function to(selection: _Selection): vscode.Selection {
        const {selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn} = selection;
        const start = new vscode.Position(selectionStartLineNumber - 1, selectionStartColumn - 1);
        const end = new vscode.Position(positionLineNumber - 1, positionColumn - 1);
        return new vscode.Selection(start, end);
    }

    /**
     * Executes `from` to handle from.
     * @zh 执行 `from`，用于从。
     * @param selection - selection parameter (`SelectionLike`) / selection参数（`SelectionLike`）
     * @returns Result of type `_Selection` / 类型为 `_Selection` 的返回值
     */
    export function from(selection: SelectionLike): _Selection {
        const {anchor, active} = selection;
        return new _Selection(
            anchor.line + 1,
            anchor.character + 1,
            active.line + 1,
            active.character + 1);
    }
}
export namespace Range {

    /**
     * Executes `from` to handle from.
     * @zh 执行 `from`，用于从。
     * @param range - range parameter (`undefined`) / 范围参数（`undefined`）
     * @returns Result of type `undefined` / 类型为 `undefined` 的返回值
     */
    export function from(range: undefined): undefined;
    /**
     * Executes `from` to handle from.
     * @zh 执行 `from`，用于从。
     * @param range - range parameter (`RangeLike`) / 范围参数（`RangeLike`）
     * @returns Result of type `_Range` / 类型为 `_Range` 的返回值
     */
    export function from(range: RangeLike): _Range;
    /**
     * Executes `from` to handle from.
     * @zh 执行 `from`，用于从。
     * @param range - range parameter (`RangeLike | undefined`) / 范围参数（`RangeLike | undefined`）
     * @returns Result of type `_Range | undefined` / 类型为 `_Range | undefined` 的返回值
     */
    export function from(range: RangeLike | undefined): _Range | undefined;
    /**
     * Executes `from` to handle from.
     * @zh 执行 `from`，用于从。
     * @param range - range parameter (`RangeLike | undefined`) / 范围参数（`RangeLike | undefined`）
     * @returns Result of type `_Range | undefined` / 类型为 `_Range | undefined` 的返回值
     */
    export function from(range: RangeLike | undefined): _Range | undefined {
        if (!range) {
            return undefined;
        }
        const {start, end} = range;
        return new _Range(
            start.line + 1,
            start.character + 1,
            end.line + 1,
            end.character + 1
        );
    }

    /**
     * Executes `to` to handle to.
     * @zh 执行 `to`，用于转换为。
     * @param range - range parameter (`undefined`) / 范围参数（`undefined`）
     * @returns Result of type `vscode.Range` / 类型为 `vscode.Range` 的返回值
     */
    export function to(range: undefined): vscode.Range;
    /**
     * Executes `to` to handle to.
     * @zh 执行 `to`，用于转换为。
     * @param range - range parameter (`IRange`) / 范围参数（`IRange`）
     * @returns Result of type `vscode.Range` / 类型为 `vscode.Range` 的返回值
     */
    export function to(range: IRange): vscode.Range;
    /**
     * Executes `to` to handle to.
     * @zh 执行 `to`，用于转换为。
     * @param range - range parameter (`IRange | undefined`) / 范围参数（`IRange | undefined`）
     * @returns Result of type `vscode.Range | undefined` / 类型为 `vscode.Range | undefined` 的返回值
     */
    export function to(range: IRange | undefined): vscode.Range | undefined;
    /**
     * Executes `to` to handle to.
     * @zh 执行 `to`，用于转换为。
     * @param range - range parameter (`IRange | undefined`) / 范围参数（`IRange | undefined`）
     * @returns Result of type `vscode.Range | undefined` / 类型为 `vscode.Range | undefined` 的返回值
     */
    export function to(range: IRange | undefined): vscode.Range | undefined {
        if (!range) {
            return undefined;
        }
        const {startLineNumber, startColumn, endLineNumber, endColumn} = range;
        return new vscode.Range(startLineNumber - 1, startColumn - 1, endLineNumber - 1, endColumn - 1);
    }
}

export namespace Position {
    /**
     * Executes `to` to handle to.
     * @zh 执行 `to`，用于转换为。
     * @param position - position parameter (`IPosition`) / 位置参数（`IPosition`）
     * @returns Result of type `vscode.Position` / 类型为 `vscode.Position` 的返回值
     */
    export function to(position: IPosition): vscode.Position {
        return new vscode.Position(position.lineNumber - 1, position.column - 1);
    }

    /**
     * Executes `from` to handle from.
     * @zh 执行 `from`，用于从。
     * @param position - position parameter (`vscode.Position`) / 位置参数（`vscode.Position`）
     * @returns Result of type `IPosition` / 类型为 `IPosition` 的返回值
     */
    export function from(position: vscode.Position): IPosition {
        return {lineNumber: position.line + 1, column: position.character + 1};
    }
}

export namespace EndOfLine {
    /**
     * Executes `from` to handle from.
     * @zh 执行 `from`，用于从。
     * @param eol - eol parameter (`vscode.EndOfLine`) / eol参数（`vscode.EndOfLine`）
     * @returns Result of type `editor.EndOfLineSequence | undefined` / 类型为 `editor.EndOfLineSequence | undefined` 的返回值
     */
    export function from(eol: vscode.EndOfLine): editor.EndOfLineSequence | undefined {
        if (eol === vscode.EndOfLine.CRLF) {
            return editor.EndOfLineSequence.CRLF;
        } else if (eol === vscode.EndOfLine.LF) {
            return editor.EndOfLineSequence.LF;
        }
        return undefined;
    }

    /**
     * Executes `to` to handle to.
     * @zh 执行 `to`，用于转换为。
     * @param eol - eol parameter (`editor.EndOfLineSequence`) / eol参数（`editor.EndOfLineSequence`）
     * @returns Result of type `vscode.EndOfLine | undefined` / 类型为 `vscode.EndOfLine | undefined` 的返回值
     */
    export function to(eol: editor.EndOfLineSequence): vscode.EndOfLine | undefined {
        if (eol === editor.EndOfLineSequence.CRLF) {
            return vscode.EndOfLine.CRLF;
        } else if (eol === editor.EndOfLineSequence.LF) {
            return vscode.EndOfLine.LF;
        }
        return undefined;
    }
}

export namespace WorkspaceEdit {
    /**
     * Executes `from` to handle from.
     * @zh 执行 `from`，用于从。
     * @param value - value parameter (`vscode.WorkspaceEdit`) / 值参数（`vscode.WorkspaceEdit`）
     * @returns Result of type `editor.IIdentifiedSingleEditOperation[]` / 类型为 `editor.IIdentifiedSingleEditOperation[]` 的返回值
     */
    export function from(value: vscode.WorkspaceEdit): editor.IIdentifiedSingleEditOperation[] {
        let edits: editor.IIdentifiedSingleEditOperation[] = []
        for (const entry of value._allEntries()) {
            const [uri, uriOrEdits] = entry;
            if (Array.isArray(uriOrEdits)) {
                // text edits

                for (const e of uriOrEdits) {
                    edits.push({
                        range: Range.from(e.range),
                        text: e.newText,
                        forceMoveMarkers: false
                    });
                }
            } else {
                // resource edits
                throw new Error("Not implemented for " + uri)
            }
        }
        return edits;
    }
}
