/**
 * @fileoverview Module `src/ux/markdown-editor/extHostTypes.ts` providing ext host types definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/extHostTypes.ts`，提供ext宿主类型列表相关的定义与实现。
 */

/* eslint-disable no-dupe-class-members */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {illegalArgument} from "./errors";
import {Uri} from "monaco-editor";

// export function values<V = any>(set: Set<V>): V[];
// export function values<K = any, V = any>(map: Map<K, V>): V[];
/**
 * Executes `values` to handle values.
 * @zh 执行 `values`，用于值列表。
 * @param forEachable - for eachable parameter (`{ forEach(callback: { (value: V, ...more: any): any; }): void; }`) / 用于Eachable参数（`{ forEach(callback: { (value: V, ...more: any): any; }): void; }`）
 * @returns Result of type `V[]` / 类型为 `V[]` 的返回值
 */
export function values<V>(forEachable: { forEach(callback: { (value: V, ...more) }): void }): V[] {
    const result: V[] = [];
    forEachable.forEach(value => result.push(value));
    return result;
}

/**
 * Class `Position` encapsulating position data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `Position`，封装 `src/ux/markdown-editor` 中的位置数据结构与处理逻辑。
 */
export class Position {

    /**
     * Executes `Min` to handle min.
     * @zh 执行 `Min`，用于最小值。
     * @param positions - positions parameter (`Position[]`) / 位置参数（`Position[]`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    static Min(...positions: Position[]): Position {
        if (positions.length === 0) {
            throw new TypeError();
        }
        let result = positions[0];
        for (let i = 1; i < positions.length; i++) {
            const p = positions[i];
            if (p.isBefore(result!)) {
                result = p;
            }
        }
        return result;
    }

    /**
     * Executes `Max` to handle max.
     * @zh 执行 `Max`，用于最大值。
     * @param positions - positions parameter (`Position[]`) / 位置参数（`Position[]`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    static Max(...positions: Position[]): Position {
        if (positions.length === 0) {
            throw new TypeError();
        }
        let result = positions[0];
        for (let i = 1; i < positions.length; i++) {
            const p = positions[i];
            if (p.isAfter(result!)) {
                result = p;
            }
        }
        return result;
    }

    /**
     * Executes `isPosition` to handle is position.
     * @zh 执行 `isPosition`，用于是否为位置。
     * @param other - other parameter (`any`) / 其他参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    static isPosition(other): other is Position {
        if (!other) {
            return false;
        }
        if (other instanceof Position) {
            return true;
        }
        let { line, character } = <Position>other;
        if (typeof line === 'number' && typeof character === 'number') {
            return true;
        }
        return false;
    }

    /**
     * Property `_line` (`number`) storing line.
     * @zh 属性 `_line`（类型：`number`），用于存储或配置线段。
     */
    private _line: number;
    /**
     * Property `_character` (`number`) storing character.
     * @zh 属性 `_character`（类型：`number`），用于存储或配置字符。
     */
    private _character: number;

    /**
     * Gets the current line (`line: number`).
     * @zh 获取当前线段（`line: number`）。
     */
    get line(): number {
        return this._line;
    }

    /**
     * Gets the current character (`character: number`).
     * @zh 获取当前字符（`character: number`）。
     */
    get character(): number {
        return this._character;
    }

    /**
     * Creates an instance of `Position` and initializes its dependencies and internal state.
     * @zh 创建 `Position` 实例，并初始化其依赖项与内部状态。
     * @param line - Injected or initial line (`number`) / 注入或传入的线段（`number`）
     * @param character - Injected or initial character (`number`) / 注入或传入的字符（`number`）
     */
    constructor(line: number, character: number) {
        if (line < 0) {
            throw illegalArgument('line must be non-negative');
        }
        if (character < 0) {
            throw illegalArgument('character must be non-negative');
        }
        this._line = line;
        this._character = character;
    }

    /**
     * Executes `isBefore` to handle is before.
     * @zh 执行 `isBefore`，用于是否为之前。
     * @param other - other parameter (`Position`) / 其他参数（`Position`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isBefore(other: Position): boolean {
        if (this._line < other._line) {
            return true;
        }
        if (other._line < this._line) {
            return false;
        }
        return this._character < other._character;
    }

    /**
     * Executes `isBeforeOrEqual` to handle is before or equal.
     * @zh 执行 `isBeforeOrEqual`，用于是否为之前OrEqual。
     * @param other - other parameter (`Position`) / 其他参数（`Position`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isBeforeOrEqual(other: Position): boolean {
        if (this._line < other._line) {
            return true;
        }
        if (other._line < this._line) {
            return false;
        }
        return this._character <= other._character;
    }

    /**
     * Executes `isAfter` to handle is after.
     * @zh 执行 `isAfter`，用于是否为之后。
     * @param other - other parameter (`Position`) / 其他参数（`Position`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isAfter(other: Position): boolean {
        return !this.isBeforeOrEqual(other);
    }

    /**
     * Executes `isAfterOrEqual` to handle is after or equal.
     * @zh 执行 `isAfterOrEqual`，用于是否为之后OrEqual。
     * @param other - other parameter (`Position`) / 其他参数（`Position`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isAfterOrEqual(other: Position): boolean {
        return !this.isBefore(other);
    }

    /**
     * Executes `isEqual` to handle is equal.
     * @zh 执行 `isEqual`，用于是否为Equal。
     * @param other - other parameter (`Position`) / 其他参数（`Position`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isEqual(other: Position): boolean {
        return this._line === other._line && this._character === other._character;
    }

    /**
     * Executes `compareTo` to handle compare to.
     * @zh 执行 `compareTo`，用于比较转换为。
     * @param other - other parameter (`Position`) / 其他参数（`Position`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    compareTo(other: Position): number {
        if (this._line < other._line) {
            return -1;
        } else if (this._line > other.line) {
            return 1;
        } else {
            // equal line
            if (this._character < other._character) {
                return -1;
            } else if (this._character > other._character) {
                return 1;
            } else {
                // equal line and character
                return 0;
            }
        }
    }

    /**
     * Executes `translate` to handle translate.
     * @zh 执行 `translate`，用于翻译。
     * @param change - change parameter (`{ lineDelta?: number; characterDelta?: number; }`) / 变更参数（`{ lineDelta?: number; characterDelta?: number; }`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    translate(change: { lineDelta?: number; characterDelta?: number; }): Position;
    /**
     * Executes `translate` to handle translate.
     * @zh 执行 `translate`，用于翻译。
     * @param lineDelta - line delta parameter (`number`) / 线段增量参数（`number`）
     * @param characterDelta - character delta parameter (`number`) / 字符增量参数（`number`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    translate(lineDelta?: number, characterDelta?: number): Position;
    /**
     * Executes `translate` to handle translate.
     * @zh 执行 `translate`，用于翻译。
     * @param lineDeltaOrChange - line delta or change parameter (`number | { lineDelta?: number; characterDelta?: number; }`) / 线段增量Or变更参数（`number | { lineDelta?: number; characterDelta?: number; }`）
     * @param characterDelta - character delta parameter (`number`) / 字符增量参数（`number`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    translate(lineDeltaOrChange: number | undefined | { lineDelta?: number; characterDelta?: number; }, characterDelta: number = 0): Position {

        if (lineDeltaOrChange === null || characterDelta === null) {
            throw illegalArgument();
        }

        let lineDelta: number;
        if (typeof lineDeltaOrChange === 'undefined') {
            lineDelta = 0;
        } else if (typeof lineDeltaOrChange === 'number') {
            lineDelta = lineDeltaOrChange;
        } else {
            lineDelta = typeof lineDeltaOrChange.lineDelta === 'number' ? lineDeltaOrChange.lineDelta : 0;
            characterDelta = typeof lineDeltaOrChange.characterDelta === 'number' ? lineDeltaOrChange.characterDelta : 0;
        }

        if (lineDelta === 0 && characterDelta === 0) {
            return this;
        }
        return new Position(this.line + lineDelta, this.character + characterDelta);
    }

    /**
     * Executes `with` to handle with.
     * @zh 执行 `with`，用于带有。
     * @param change - change parameter (`{ line?: number; character?: number; }`) / 变更参数（`{ line?: number; character?: number; }`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    with(change: { line?: number; character?: number; }): Position;
    /**
     * Executes `with` to handle with.
     * @zh 执行 `with`，用于带有。
     * @param line - line parameter (`number`) / 线段参数（`number`）
     * @param character - character parameter (`number`) / 字符参数（`number`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    with(line?: number, character?: number): Position;
    /**
     * Executes `with` to handle with.
     * @zh 执行 `with`，用于带有。
     * @param lineOrChange - line or change parameter (`number | { line?: number; character?: number; }`) / 线段Or变更参数（`number | { line?: number; character?: number; }`）
     * @param character - character parameter (`number`) / 字符参数（`number`）
     * @returns Result of type `Position` / 类型为 `Position` 的返回值
     */
    with(lineOrChange: number | undefined | { line?: number; character?: number; }, character: number = this.character): Position {

        if (lineOrChange === null || character === null) {
            throw illegalArgument();
        }

        let line: number;
        if (typeof lineOrChange === 'undefined') {
            line = this.line;

        } else if (typeof lineOrChange === 'number') {
            line = lineOrChange;

        } else {
            line = typeof lineOrChange.line === 'number' ? lineOrChange.line : this.line;
            character = typeof lineOrChange.character === 'number' ? lineOrChange.character : this.character;
        }

        if (line === this.line && character === this.character) {
            return this;
        }
        return new Position(line, character);
    }

    /**
     * Executes `toJSON` to handle to json.
     * @zh 执行 `toJSON`，用于转换为JSON。
     * @returns Result of type `{ line: number; character: number; }` / 类型为 `{ line: number; character: number; }` 的返回值
     */
    toJSON() {
        return { line: this.line, character: this.character };
    }
}

/**
 * Class `Range` encapsulating range data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `Range`，封装 `src/ux/markdown-editor` 中的范围数据结构与处理逻辑。
 */
export class Range {

    /**
     * Executes `isRange` to handle is range.
     * @zh 执行 `isRange`，用于是否为范围。
     * @param thing - thing parameter (`any`) / thing参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    static isRange(thing): boolean {
        if (thing instanceof Range) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Position.isPosition((<Range>thing).start)
            && Position.isPosition((<Range>thing.end));
    }

    /**
     * Property `_start` (`Position`) storing start.
     * @zh 属性 `_start`（类型：`Position`），用于存储或配置开始。
     */
    protected _start: Position;
    /**
     * Property `_end` (`Position`) storing end.
     * @zh 属性 `_end`（类型：`Position`），用于存储或配置结束。
     */
    protected _end: Position;

    /**
     * Gets the current start (`start: Position`).
     * @zh 获取当前开始（`start: Position`）。
     */
    get start(): Position {
        return this._start;
    }

    /**
     * Gets the current end (`end: Position`).
     * @zh 获取当前结束（`end: Position`）。
     */
    get end(): Position {
        return this._end;
    }

    /**
     * Creates an instance of `Range` and initializes its dependencies and internal state.
     * @zh 创建 `Range` 实例，并初始化其依赖项与内部状态。
     * @param start - Injected or initial start (`Position`) / 注入或传入的开始（`Position`）
     * @param end - Injected or initial end (`Position`) / 注入或传入的结束（`Position`）
     */
    constructor(start: Position, end: Position);
    /**
     * Creates an instance of `Range` and initializes its dependencies and internal state.
     * @zh 创建 `Range` 实例，并初始化其依赖项与内部状态。
     * @param startLine - Injected or initial start line (`number`) / 注入或传入的开始线段（`number`）
     * @param startColumn - Injected or initial start column (`number`) / 注入或传入的开始列（`number`）
     * @param endLine - Injected or initial end line (`number`) / 注入或传入的结束线段（`number`）
     * @param endColumn - Injected or initial end column (`number`) / 注入或传入的结束列（`number`）
     */
    constructor(startLine: number, startColumn: number, endLine: number, endColumn: number);
    /**
     * Creates an instance of `Range` and initializes its dependencies and internal state.
     * @zh 创建 `Range` 实例，并初始化其依赖项与内部状态。
     * @param startLineOrStart - Injected or initial start line or start (`number | Position`) / 注入或传入的开始线段Or开始（`number | Position`）
     * @param startColumnOrEnd - Injected or initial start column or end (`number | Position`) / 注入或传入的开始列Or结束（`number | Position`）
     * @param endLine - Injected or initial end line (`number`) / 注入或传入的结束线段（`number`）
     * @param endColumn - Injected or initial end column (`number`) / 注入或传入的结束列（`number`）
     */
    constructor(startLineOrStart: number | Position, startColumnOrEnd: number | Position, endLine?: number, endColumn?: number) {
        let start: Position | undefined;
        let end: Position | undefined;

        if (typeof startLineOrStart === 'number' && typeof startColumnOrEnd === 'number' && typeof endLine === 'number' && typeof endColumn === 'number') {
            start = new Position(startLineOrStart, startColumnOrEnd);
            end = new Position(endLine, endColumn);
        } else if (startLineOrStart instanceof Position && startColumnOrEnd instanceof Position) {
            start = startLineOrStart;
            end = startColumnOrEnd;
        }

        if (!start || !end) {
            throw new Error('Invalid arguments');
        }

        if (start.isBefore(end)) {
            this._start = start;
            this._end = end;
        } else {
            this._start = end;
            this._end = start;
        }
    }

    /**
     * Executes `contains` to handle contains.
     * @zh 执行 `contains`，用于contains。
     * @param positionOrRange - position or range parameter (`Position | Range`) / 位置Or范围参数（`Position | Range`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    contains(positionOrRange: Position | Range): boolean {
        if (positionOrRange instanceof Range) {
            return this.contains(positionOrRange._start)
                && this.contains(positionOrRange._end);

        } else if (positionOrRange instanceof Position) {
            if (positionOrRange.isBefore(this._start)) {
                return false;
            }
            if (this._end.isBefore(positionOrRange)) {
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * Executes `isEqual` to handle is equal.
     * @zh 执行 `isEqual`，用于是否为Equal。
     * @param other - other parameter (`Range`) / 其他参数（`Range`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isEqual(other: Range): boolean {
        return this._start.isEqual(other._start) && this._end.isEqual(other._end);
    }

    /**
     * Executes `intersection` to handle intersection.
     * @zh 执行 `intersection`，用于intersection。
     * @param other - other parameter (`Range`) / 其他参数（`Range`）
     * @returns Result of type `Range` / 类型为 `Range` 的返回值
     */
    intersection(other: Range): Range | undefined {
        const start = Position.Max(other.start, this._start);
        const end = Position.Min(other.end, this._end);
        if (start.isAfter(end)) {
            // this happens when there is no overlap:
            // |-----|
            //          |----|
            return undefined;
        }
        return new Range(start, end);
    }

    /**
     * Executes `union` to handle union.
     * @zh 执行 `union`，用于union。
     * @param other - other parameter (`Range`) / 其他参数（`Range`）
     * @returns Result of type `Range` / 类型为 `Range` 的返回值
     */
    union(other: Range): Range {
        if (this.contains(other)) {
            return this;
        } else if (other.contains(this)) {
            return other;
        }
        const start = Position.Min(other.start, this._start);
        const end = Position.Max(other.end, this.end);
        return new Range(start, end);
    }

    /**
     * Gets the current is empty (`isEmpty: boolean`).
     * @zh 获取当前是否为空（`isEmpty: boolean`）。
     */
    get isEmpty(): boolean {
        return this._start.isEqual(this._end);
    }

    /**
     * Gets the current is single line (`isSingleLine: boolean`).
     * @zh 获取当前是否为单个线段（`isSingleLine: boolean`）。
     */
    get isSingleLine(): boolean {
        return this._start.line === this._end.line;
    }

    /**
     * Executes `with` to handle with.
     * @zh 执行 `with`，用于带有。
     * @param change - change parameter (`{ start?: Position; end?: Position; }`) / 变更参数（`{ start?: Position; end?: Position; }`）
     * @returns Result of type `Range` / 类型为 `Range` 的返回值
     */
    with(change: { start?: Position, end?: Position }): Range;
    /**
     * Executes `with` to handle with.
     * @zh 执行 `with`，用于带有。
     * @param start - start parameter (`Position`) / 开始参数（`Position`）
     * @param end - end parameter (`Position`) / 结束参数（`Position`）
     * @returns Result of type `Range` / 类型为 `Range` 的返回值
     */
    with(start?: Position, end?: Position): Range;
    /**
     * Executes `with` to handle with.
     * @zh 执行 `with`，用于带有。
     * @param startOrChange - start or change parameter (`Position | { start?: Position; end?: Position; }`) / 开始Or变更参数（`Position | { start?: Position; end?: Position; }`）
     * @param end - end parameter (`Position`) / 结束参数（`Position`）
     * @returns Result of type `Range` / 类型为 `Range` 的返回值
     */
    with(startOrChange: Position | undefined | { start?: Position, end?: Position }, end: Position = this.end): Range {

        if (startOrChange === null || end === null) {
            throw illegalArgument();
        }

        let start: Position;
        if (!startOrChange) {
            start = this.start;

        } else if (Position.isPosition(startOrChange)) {
            start = startOrChange;

        } else {
            start = startOrChange.start || this.start;
            end = startOrChange.end || this.end;
        }

        if (start.isEqual(this._start) && end.isEqual(this.end)) {
            return this;
        }
        return new Range(start, end);
    }

    /**
     * Executes `toJSON` to handle to json.
     * @zh 执行 `toJSON`，用于转换为JSON。
     * @returns Result of type `object` / 类型为 `object` 的返回值
     */
    toJSON(): object {
        return [this.start, this.end];
    }
}

/**
 * Class `Selection` encapsulating selection data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `Selection`，封装 `src/ux/markdown-editor` 中的Selection数据结构与处理逻辑。
 */
export class Selection extends Range {

    /**
     * Executes `isSelection` to handle is selection.
     * @zh 执行 `isSelection`，用于是否为Selection。
     * @param thing - thing parameter (`any`) / thing参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    static isSelection(thing): thing is Selection {
        if (thing instanceof Selection) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Range.isRange(thing)
            && Position.isPosition((<Selection>thing).anchor)
            && Position.isPosition((<Selection>thing).active)
            && typeof (<Selection>thing).isReversed === 'boolean';
    }

    /**
     * Property `_anchor` (`Position`) storing anchor.
     * @zh 属性 `_anchor`（类型：`Position`），用于存储或配置锚点。
     */
    private _anchor: Position;

    /**
     * Gets the current anchor (`anchor: Position`).
     * @zh 获取当前锚点（`anchor: Position`）。
     */
    public get anchor(): Position {
        return this._anchor;
    }

    /**
     * Property `_active` (`Position`) storing active.
     * @zh 属性 `_active`（类型：`Position`），用于存储或配置激活。
     */
    private _active: Position;

    /**
     * Gets the current active (`active: Position`).
     * @zh 获取当前激活（`active: Position`）。
     */
    public get active(): Position {
        return this._active;
    }

    /**
     * Creates an instance of `Selection` and initializes its dependencies and internal state.
     * @zh 创建 `Selection` 实例，并初始化其依赖项与内部状态。
     * @param anchor - Injected or initial anchor (`Position`) / 注入或传入的锚点（`Position`）
     * @param active - Injected or initial active (`Position`) / 注入或传入的激活（`Position`）
     */
    constructor(anchor: Position, active: Position);
    /**
     * Creates an instance of `Selection` and initializes its dependencies and internal state.
     * @zh 创建 `Selection` 实例，并初始化其依赖项与内部状态。
     * @param anchorLine - Injected or initial anchor line (`number`) / 注入或传入的锚点线段（`number`）
     * @param anchorColumn - Injected or initial anchor column (`number`) / 注入或传入的锚点列（`number`）
     * @param activeLine - Injected or initial active line (`number`) / 注入或传入的激活线段（`number`）
     * @param activeColumn - Injected or initial active column (`number`) / 注入或传入的激活列（`number`）
     */
    constructor(anchorLine: number, anchorColumn: number, activeLine: number, activeColumn: number);
    /**
     * Creates an instance of `Selection` and initializes its dependencies and internal state.
     * @zh 创建 `Selection` 实例，并初始化其依赖项与内部状态。
     * @param anchorLineOrAnchor - Injected or initial anchor line or anchor (`number | Position`) / 注入或传入的锚点线段Or锚点（`number | Position`）
     * @param anchorColumnOrActive - Injected or initial anchor column or active (`number | Position`) / 注入或传入的锚点列Or激活（`number | Position`）
     * @param activeLine - Injected or initial active line (`number`) / 注入或传入的激活线段（`number`）
     * @param activeColumn - Injected or initial active column (`number`) / 注入或传入的激活列（`number`）
     */
    constructor(anchorLineOrAnchor: number | Position, anchorColumnOrActive: number | Position, activeLine?: number, activeColumn?: number) {
        let anchor: Position | undefined;
        let active: Position | undefined;

        if (typeof anchorLineOrAnchor === 'number' && typeof anchorColumnOrActive === 'number' && typeof activeLine === 'number' && typeof activeColumn === 'number') {
            anchor = new Position(anchorLineOrAnchor, anchorColumnOrActive);
            active = new Position(activeLine, activeColumn);
        } else if (anchorLineOrAnchor instanceof Position && anchorColumnOrActive instanceof Position) {
            anchor = anchorLineOrAnchor;
            active = anchorColumnOrActive;
        }

        if (!anchor || !active) {
            throw new Error('Invalid arguments');
        }

        super(anchor, active);

        this._anchor = anchor;
        this._active = active;
    }

    /**
     * Gets the current is reversed (`isReversed: boolean`).
     * @zh 获取当前是否为已反向（`isReversed: boolean`）。
     */
    get isReversed(): boolean {
        return this._anchor === this._end;
    }
    /**
     * Executes `toJSON` to handle to json.
     * @zh 执行 `toJSON`，用于转换为JSON。
     */
    override toJSON() {
        return {
            start: this.start,
            end: this.end,
            active: this.active,
            anchor: this.anchor
        };
    }
}


/**
 * Enumeration `EndOfLine` defining supported end of line constants.
 * @zh 枚举 `EndOfLine`，定义支持的结束的线段常量集合。
 */
export enum EndOfLine {
    /**
     * Enum member `EndOfLine.LF` = 1 representing lf.
     * @zh 枚举项 `EndOfLine.LF` = 1，表示LF。
     */
    LF = 1,
    /**
     * Enum member `EndOfLine.CRLF` = 2 representing crlf.
     * @zh 枚举项 `EndOfLine.CRLF` = 2，表示CRLF。
     */
    CRLF = 2
}

/**
 * Class `TextEdit` encapsulating text edit data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `TextEdit`，封装 `src/ux/markdown-editor` 中的文本编辑数据结构与处理逻辑。
 */
export class TextEdit {

    /**
     * Executes `isTextEdit` to handle is text edit.
     * @zh 执行 `isTextEdit`，用于是否为文本编辑。
     * @param thing - thing parameter (`any`) / thing参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    static isTextEdit(thing): thing is TextEdit {
        if (thing instanceof TextEdit) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Range.isRange((<TextEdit>thing))
            && typeof (<TextEdit>thing).newText === 'string';
    }

    /**
     * Executes `replace` to handle replace.
     * @zh 执行 `replace`，用于替换。
     * @param range - range parameter (`Range`) / 范围参数（`Range`）
     * @param newText - new text parameter (`string`) / 新文本参数（`string`）
     * @returns Result of type `TextEdit` / 类型为 `TextEdit` 的返回值
     */
    static replace(range: Range, newText: string): TextEdit {
        return new TextEdit(range, newText);
    }

    /**
     * Executes `insert` to handle insert.
     * @zh 执行 `insert`，用于插入。
     * @param position - position parameter (`Position`) / 位置参数（`Position`）
     * @param newText - new text parameter (`string`) / 新文本参数（`string`）
     * @returns Result of type `TextEdit` / 类型为 `TextEdit` 的返回值
     */
    static insert(position: Position, newText: string): TextEdit {
        return TextEdit.replace(new Range(position, position), newText);
    }

    /**
     * Executes `delete` to handle delete.
     * @zh 执行 `delete`，用于删除。
     * @param range - range parameter (`Range`) / 范围参数（`Range`）
     * @returns Result of type `TextEdit` / 类型为 `TextEdit` 的返回值
     */
    static delete(range: Range): TextEdit {
        return TextEdit.replace(range, '');
    }

    /**
     * Executes `setEndOfLine` to handle set end of line.
     * @zh 执行 `setEndOfLine`，用于集合结束的线段。
     * @param eol - eol parameter (`EndOfLine`) / eol参数（`EndOfLine`）
     * @returns Result of type `TextEdit` / 类型为 `TextEdit` 的返回值
     */
    static setEndOfLine(eol: EndOfLine): TextEdit {
        const ret = new TextEdit(new Range(new Position(0, 0), new Position(0, 0)), '');
        ret.newEol = eol;
        return ret;
    }

    /**
     * Property `_range` (`Range`) storing range.
     * @zh 属性 `_range`（类型：`Range`），用于存储或配置范围。
     */
    protected _range: Range;
    /**
     * Property `_newText` (`string`) storing new text.
     * @zh 属性 `_newText`（类型：`string`），用于存储或配置新文本。
     */
    protected _newText: string | null;
    /**
     * Property `_newEol` (`EndOfLine`) storing new eol.
     * @zh 属性 `_newEol`（类型：`EndOfLine`），用于存储或配置新Eol。
     */
    protected _newEol: EndOfLine;

    /**
     * Gets the current range (`range: Range`).
     * @zh 获取当前范围（`range: Range`）。
     */
    get range(): Range {
        return this._range;
    }

    /**
     * Sets the range (`range`).
     * @zh 设置范围（`range`）。
     * @param value - New range value (`Range`) / 新的范围值（`Range`）
     */
    set range(value: Range) {
        if (value && !Range.isRange(value)) {
            throw illegalArgument('range');
        }
        this._range = value;
    }

    /**
     * Gets the current new text (`newText: string`).
     * @zh 获取当前新文本（`newText: string`）。
     */
    get newText(): string {
        return this._newText || '';
    }

    /**
     * Sets the new text (`newText`).
     * @zh 设置新文本（`newText`）。
     * @param value - New new text value (`string`) / 新的新文本值（`string`）
     */
    set newText(value: string) {
        if (value && typeof value !== 'string') {
            throw illegalArgument('newText');
        }
        this._newText = value;
    }

    /**
     * Gets the current new eol (`newEol: EndOfLine`).
     * @zh 获取当前新Eol（`newEol: EndOfLine`）。
     */
    get newEol(): EndOfLine {
        return this._newEol;
    }

    /**
     * Sets the new eol (`newEol`).
     * @zh 设置新Eol（`newEol`）。
     * @param value - New new eol value (`EndOfLine`) / 新的新Eol值（`EndOfLine`）
     */
    set newEol(value: EndOfLine) {
        if (value && typeof value !== 'number') {
            throw illegalArgument('newEol');
        }
        this._newEol = value;
    }

    /**
     * Creates an instance of `TextEdit` and initializes its dependencies and internal state.
     * @zh 创建 `TextEdit` 实例，并初始化其依赖项与内部状态。
     * @param range - Injected or initial range (`Range`) / 注入或传入的范围（`Range`）
     * @param newText - Injected or initial new text (`string`) / 注入或传入的新文本（`string`）
     */
    constructor(range: Range, newText: string | null) {
        this.range = range;
        this._newText = newText;
    }

    /**
     * Executes `toJSON` to handle to json.
     * @zh 执行 `toJSON`，用于转换为JSON。
     * @returns Result of type `{ range: Range; newText: string; newEol: EndOfLine; }` / 类型为 `{ range: Range; newText: string; newEol: EndOfLine; }` 的返回值
     */
    toJSON() {
        return {
            range: this.range,
            newText: this.newText,
            newEol: this._newEol
        };
    }
}


/**
 * Interface `IFileOperationOptions` defining the contract and properties for i file operation options.
 * @zh 接口 `IFileOperationOptions`，定义I文件Operation配置选项的数据结构契约与属性规范。
 */
export interface IFileOperationOptions {
    /**
     * Property `overwrite` (`boolean`) storing overwrite.
     * @zh 属性 `overwrite`（类型：`boolean`），用于存储或配置overwrite。
     */
    overwrite?: boolean;
    /**
     * Property `ignoreIfExists` (`boolean`) storing ignore if exists.
     * @zh 属性 `ignoreIfExists`（类型：`boolean`），用于存储或配置忽略IfExists。
     */
    ignoreIfExists?: boolean;
    /**
     * Property `ignoreIfNotExists` (`boolean`) storing ignore if not exists.
     * @zh 属性 `ignoreIfNotExists`（类型：`boolean`），用于存储或配置忽略IfNotExists。
     */
    ignoreIfNotExists?: boolean;
    /**
     * Property `recursive` (`boolean`) storing recursive.
     * @zh 属性 `recursive`（类型：`boolean`），用于存储或配置recursive。
     */
    recursive?: boolean;
}

/**
 * Interface `IFileOperation` defining the contract and properties for i file operation.
 * @zh 接口 `IFileOperation`，定义I文件Operation的数据结构契约与属性规范。
 */
export interface IFileOperation {
    /**
     * Property `_type` (`1`) storing type.
     * @zh 属性 `_type`（类型：`1`），用于存储或配置类型。
     */
    _type: 1;
    /**
     * Property `from` (`Uri`) storing from.
     * @zh 属性 `from`（类型：`Uri`），用于存储或配置从。
     */
    from?: Uri;
    /**
     * Property `to` (`Uri`) storing to.
     * @zh 属性 `to`（类型：`Uri`），用于存储或配置转换为。
     */
    to?: Uri;
    /**
     * Property `options` (`IFileOperationOptions`) storing options.
     * @zh 属性 `options`（类型：`IFileOperationOptions`），用于存储或配置配置选项。
     */
    options?: IFileOperationOptions;
}

/**
 * Interface `IFileTextEdit` defining the contract and properties for i file text edit.
 * @zh 接口 `IFileTextEdit`，定义I文件文本编辑的数据结构契约与属性规范。
 */
export interface IFileTextEdit {
    /**
     * Property `_type` (`2`) storing type.
     * @zh 属性 `_type`（类型：`2`），用于存储或配置类型。
     */
    _type: 2;
    /**
     * Property `uri` (`Uri`) storing uri.
     * @zh 属性 `uri`（类型：`Uri`），用于存储或配置资源标识。
     */
    uri: Uri;
    /**
     * Property `edit` (`TextEdit`) storing edit.
     * @zh 属性 `edit`（类型：`TextEdit`），用于存储或配置编辑。
     */
    edit: TextEdit;
}

/**
 * Class `WorkspaceEdit` encapsulating workspace edit data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `WorkspaceEdit`，封装 `src/ux/markdown-editor` 中的Workspace编辑数据结构与处理逻辑。
 */
export class WorkspaceEdit {

    /**
     * Property `_edits` (`(IFileOperation | IFileTextEdit)[]`) storing edits.
     * @zh 属性 `_edits`（类型：`(IFileOperation | IFileTextEdit)[]`），用于存储或配置编辑。
     */
    private _edits = new Array<IFileOperation | IFileTextEdit>();

    /**
     * Executes `renameFile` to handle rename file.
     * @zh 执行 `renameFile`，用于rename文件。
     * @param from - from parameter (`Uri`) / 从参数（`Uri`）
     * @param to - to parameter (`Uri`) / 转换为参数（`Uri`）
     * @param options - options parameter (`{ overwrite?: boolean; ignoreIfExists?: boolean; }`) / 配置选项参数（`{ overwrite?: boolean; ignoreIfExists?: boolean; }`）
     */
    renameFile(from: Uri, to: Uri, options?: { overwrite?: boolean, ignoreIfExists?: boolean }): void {
        this._edits.push({ _type: 1, from, to, options });
    }

    /**
     * Executes `createFile` to handle create file.
     * @zh 执行 `createFile`，用于创建文件。
     * @param uri - uri parameter (`Uri`) / 资源标识参数（`Uri`）
     * @param options - options parameter (`{ overwrite?: boolean; ignoreIfExists?: boolean; }`) / 配置选项参数（`{ overwrite?: boolean; ignoreIfExists?: boolean; }`）
     */
    createFile(uri: Uri, options?: { overwrite?: boolean, ignoreIfExists?: boolean }): void {
        this._edits.push({ _type: 1, from: undefined, to: uri, options });
    }

    /**
     * Executes `deleteFile` to handle delete file.
     * @zh 执行 `deleteFile`，用于删除文件。
     * @param uri - uri parameter (`Uri`) / 资源标识参数（`Uri`）
     * @param options - options parameter (`{ recursive?: boolean; ignoreIfNotExists?: boolean; }`) / 配置选项参数（`{ recursive?: boolean; ignoreIfNotExists?: boolean; }`）
     */
    deleteFile(uri: Uri, options?: { recursive?: boolean, ignoreIfNotExists?: boolean }): void {
        this._edits.push({ _type: 1, from: uri, to: undefined, options });
    }

    /**
     * Executes `replace` to handle replace.
     * @zh 执行 `replace`，用于替换。
     * @param uri - uri parameter (`Uri`) / 资源标识参数（`Uri`）
     * @param range - range parameter (`Range`) / 范围参数（`Range`）
     * @param newText - new text parameter (`string`) / 新文本参数（`string`）
     */
    replace(uri: Uri, range: Range, newText: string): void {
        this._edits.push({ _type: 2, uri, edit: new TextEdit(range, newText) });
    }

    /**
     * Executes `insert` to handle insert.
     * @zh 执行 `insert`，用于插入。
     * @param resource - resource parameter (`Uri`) / 资源参数（`Uri`）
     * @param position - position parameter (`Position`) / 位置参数（`Position`）
     * @param newText - new text parameter (`string`) / 新文本参数（`string`）
     */
    insert(resource: Uri, position: Position, newText: string): void {
        this.replace(resource, new Range(position, position), newText);
    }

    /**
     * Executes `delete` to handle delete.
     * @zh 执行 `delete`，用于删除。
     * @param resource - resource parameter (`Uri`) / 资源参数（`Uri`）
     * @param range - range parameter (`Range`) / 范围参数（`Range`）
     */
    delete(resource: Uri, range: Range): void {
        this.replace(resource, range, '');
    }

    /**
     * Executes `has` to handle has.
     * @zh 执行 `has`，用于是否包含。
     * @param uri - uri parameter (`Uri`) / 资源标识参数（`Uri`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    has(uri: Uri): boolean {
        for (const edit of this._edits) {
            if (edit._type === 2 && edit.uri.toString() === uri.toString()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Executes `set` to handle set.
     * @zh 执行 `set`，用于集合。
     * @param uri - uri parameter (`Uri`) / 资源标识参数（`Uri`）
     * @param edits - edits parameter (`TextEdit[]`) / 编辑参数（`TextEdit[]`）
     */
    set(uri: Uri, edits: TextEdit[]): void {
        if (!edits) {
            // remove all text edits for `uri`
            for (let i = 0; i < this._edits.length; i++) {
                const element = this._edits[i];
                if (element._type === 2 && element.uri.toString() === uri.toString()) {
                    this._edits[i] = undefined!; // will be coalesced down below
                }
            }
            // this._edits = coalesce(this._edits); TODO
        } else {
            // append edit to the end
            for (const edit of edits) {
                if (edit) {
                    this._edits.push({ _type: 2, uri, edit });
                }
            }
        }
    }

    /**
     * Executes `get` to handle get.
     * @zh 执行 `get`，用于获取。
     * @param uri - uri parameter (`Uri`) / 资源标识参数（`Uri`）
     * @returns Result of type `TextEdit[]` / 类型为 `TextEdit[]` 的返回值
     */
    get(uri: Uri): TextEdit[] {
        const res: TextEdit[] = [];
        for (let candidate of this._edits) {
            if (candidate._type === 2 && candidate.uri.toString() === uri.toString()) {
                res.push(candidate.edit);
            }
        }
        return res;
    }

    /**
     * Executes `entries` to handle entries.
     * @zh 执行 `entries`，用于条目集合。
     * @returns Result of type `[Uri, TextEdit[]][]` / 类型为 `[Uri, TextEdit[]][]` 的返回值
     */
    entries(): [Uri, TextEdit[]][] {
        const textEdits = new Map<string, [Uri, TextEdit[]]>();
        for (let candidate of this._edits) {
            if (candidate._type === 2) {
                let textEdit = textEdits.get(candidate.uri.toString());
                if (!textEdit) {
                    textEdit = [candidate.uri, []];
                    textEdits.set(candidate.uri.toString(), textEdit);
                }
                textEdit[1].push(candidate.edit);
            }
        }
        return values(textEdits);
    }

    /**
     * Executes `_allEntries` to handle all entries.
     * @zh 执行 `_allEntries`，用于全部条目集合。
     * @returns Result of type `([Uri, TextEdit[]] | [Uri?, Uri?, IFileOperationOptions?])[]` / 类型为 `([Uri, TextEdit[]] | [Uri?, Uri?, IFileOperationOptions?])[]` 的返回值
     */
    _allEntries(): ([Uri, TextEdit[]] | [Uri?, Uri?, IFileOperationOptions?])[] {
        const res: ([Uri, TextEdit[]] | [Uri?, Uri?, IFileOperationOptions?])[] = [];
        for (let edit of this._edits) {
            if (edit._type === 1) {
                res.push([edit.from, edit.to, edit.options]);
            } else {
                res.push([edit.uri, [edit.edit]]);
            }
        }
        return res;
    }

    /**
     * Gets the current size (`size: number`).
     * @zh 获取当前尺寸（`size: number`）。
     */
    get size(): number {
        return this.entries().length;
    }

    /**
     * Executes `toJSON` to handle to json.
     * @zh 执行 `toJSON`，用于转换为JSON。
     * @returns Result of type `[Uri, TextEdit[]][]` / 类型为 `[Uri, TextEdit[]][]` 的返回值
     */
    toJSON() {
        return this.entries();
    }
}


/**
 * Enumeration `TextEditorRevealType` defining supported text editor reveal type constants.
 * @zh 枚举 `TextEditorRevealType`，定义支持的文本编辑器Reveal类型常量集合。
 */
export enum TextEditorRevealType {
    /**
     * Enum member `TextEditorRevealType.Default` = 0 representing default.
     * @zh 枚举项 `TextEditorRevealType.Default` = 0，表示默认。
     */
    Default = 0,
    /**
     * Enum member `TextEditorRevealType.InCenter` = 1 representing in center.
     * @zh 枚举项 `TextEditorRevealType.InCenter` = 1，表示在居中。
     */
    InCenter = 1,
    /**
     * Enum member `TextEditorRevealType.InCenterIfOutsideViewport` = 2 representing in center if outside viewport.
     * @zh 枚举项 `TextEditorRevealType.InCenterIfOutsideViewport` = 2，表示在居中If外部视口。
     */
    InCenterIfOutsideViewport = 2,
    /**
     * Enum member `TextEditorRevealType.AtTop` = 3 representing at top.
     * @zh 枚举项 `TextEditorRevealType.AtTop` = 3，表示位于顶部位置。
     */
    AtTop = 3
}

/**
 * Enumeration `TextEditorSelectionChangeKind` defining supported text editor selection change kind constants.
 * @zh 枚举 `TextEditorSelectionChangeKind`，定义支持的文本编辑器Selection变更种类常量集合。
 */
export enum TextEditorSelectionChangeKind {
    /**
     * Enum member `TextEditorSelectionChangeKind.Keyboard` = 1 representing keyboard.
     * @zh 枚举项 `TextEditorSelectionChangeKind.Keyboard` = 1，表示键盘。
     */
    Keyboard = 1,
    /**
     * Enum member `TextEditorSelectionChangeKind.Mouse` = 2 representing mouse.
     * @zh 枚举项 `TextEditorSelectionChangeKind.Mouse` = 2，表示鼠标。
     */
    Mouse = 2,
    /**
     * Enum member `TextEditorSelectionChangeKind.Command` = 3 representing command.
     * @zh 枚举项 `TextEditorSelectionChangeKind.Command` = 3，表示命令。
     */
    Command = 3
}

/**
 * Class `SnippetString` encapsulating snippet string data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `SnippetString`，封装 `src/ux/markdown-editor` 中的Snippet字符串数据结构与处理逻辑。
 */
export class SnippetString {

    /**
     * Executes `isSnippetString` to handle is snippet string.
     * @zh 执行 `isSnippetString`，用于是否为Snippet字符串。
     * @param thing - thing parameter (`any`) / thing参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    static isSnippetString(thing): thing is SnippetString {
        if (thing instanceof SnippetString) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return typeof (<SnippetString>thing).value === 'string';
    }

    /**
     * Executes `_escape` to handle escape.
     * @zh 执行 `_escape`，用于escape。
     * @param value - value parameter (`string`) / 值参数（`string`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    private static _escape(value: string): string {
        return value.replace(/\$|}|\\/g, '\\$&');
    }

    /**
     * Property `_tabstop` (`number`) storing tabstop (default: `1`).
     * @zh 属性 `_tabstop`（类型：`number`），用于存储或配置tabstop（默认值：`1`）。
     */
    private _tabstop: number = 1;

    /**
     * Property `value` (`string`) storing value.
     * @zh 属性 `value`（类型：`string`），用于存储或配置值。
     */
    value: string;

    /**
     * Creates an instance of `SnippetString` and initializes its dependencies and internal state.
     * @zh 创建 `SnippetString` 实例，并初始化其依赖项与内部状态。
     * @param value - Injected or initial value (`string`) / 注入或传入的值（`string`）
     */
    constructor(value?: string) {
        this.value = value || '';
    }

    /**
     * Executes `appendText` to handle append text.
     * @zh 执行 `appendText`，用于追加文本。
     * @param string - string parameter (`string`) / 字符串参数（`string`）
     * @returns Result of type `SnippetString` / 类型为 `SnippetString` 的返回值
     */
    appendText(string: string): SnippetString {
        this.value += SnippetString._escape(string);
        return this;
    }

    /**
     * Executes `appendTabstop` to handle append tabstop.
     * @zh 执行 `appendTabstop`，用于追加Tabstop。
     * @param number - number parameter (`number`) / 数字参数（`number`）
     * @returns Result of type `SnippetString` / 类型为 `SnippetString` 的返回值
     */
    appendTabstop(number: number = this._tabstop++): SnippetString {
        this.value += '$';
        this.value += number;
        return this;
    }

    /**
     * Executes `appendPlaceholder` to handle append placeholder.
     * @zh 执行 `appendPlaceholder`，用于追加占位提示。
     * @param value - value parameter (`any`) / 值参数（`any`）
     * @param number - number parameter (`number`) / 数字参数（`number`）
     * @returns Result of type `SnippetString` / 类型为 `SnippetString` 的返回值
     */
    appendPlaceholder(value, number: number = this._tabstop++): SnippetString {

        if (typeof value === 'function') {
            const nested = new SnippetString();
            nested._tabstop = this._tabstop;
            value(nested);
            this._tabstop = nested._tabstop;
            value = nested.value;
        } else {
            value = SnippetString._escape(value);
        }

        this.value += '${';
        this.value += number;
        this.value += ':';
        this.value += value;
        this.value += '}';

        return this;
    }

    /**
     * Executes `appendVariable` to handle append variable.
     * @zh 执行 `appendVariable`，用于追加Variable。
     * @param name - name parameter (`string`) / 名称参数（`string`）
     * @param defaultValue - default value parameter (`any`) / 默认值参数（`any`）
     * @returns Result of type `SnippetString` / 类型为 `SnippetString` 的返回值
     */
    appendVariable(name: string, defaultValue?): SnippetString {

        if (typeof defaultValue === 'function') {
            const nested = new SnippetString();
            nested._tabstop = this._tabstop;
            defaultValue(nested);
            this._tabstop = nested._tabstop;
            defaultValue = nested.value;

        } else if (typeof defaultValue === 'string') {
            defaultValue = defaultValue.replace(/\$|}/g, '\\$&');
        }

        this.value += '${';
        this.value += name;
        if (defaultValue) {
            this.value += ':';
            this.value += defaultValue;
        }
        this.value += '}';


        return this;
    }
}
