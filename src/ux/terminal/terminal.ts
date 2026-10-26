/**
 * @fileoverview Module `src/ux/terminal/terminal.ts` providing terminal definitions and implementation.
 * @zh 模块文件 `src/ux/terminal/terminal.ts`，提供终端相关的定义与实现。
 */

import { Observable } from 'rxjs';
import { ITerminalOptions, Terminal } from 'xterm';

/**
 * Interface `TerminalWrapper` defining the contract and properties for terminal wrapper.
 * @zh 接口 `TerminalWrapper`，定义终端包装器的数据结构契约与属性规范。
 */
interface TerminalWrapper{
   
    /**
     * Executes `write` to handle write.
     * @zh 执行 `write`，用于写入。
     * @param chars - chars parameter (`string`) / 字符参数（`string`）
     */
    write(chars: string)
    /**
     * @deprecated
     * It is an alias of onData() that is recommended instead of using it.
     * A observable to emit printable characters when a user typed on the div for the xterm

     * @zh 属性 `keyInput`（类型：`Observable<string>`），用于存储或配置键输入属性。
     */
    readonly keyInput: Observable<string>
    /**
     * @deprecated
     * It is an alias of onKey() that is recommended instead of using it.
     * A observable to emit keys and keyboard event when a user typed on the div for the xterm

     * @zh 属性 `keyEventInput`（类型：`Observable<{key: string; domEvent: KeyboardEvent;}>`），用于存储或配置键事件输入属性。
     */
    readonly keyEventInput: Observable<{key: string; domEvent: KeyboardEvent;}>
    /**
     * An wrapper of onData() in the Xterm Terminal
     * A observable to emit printable characters which is encoded using UTF-8 when a user typed on the terminal

     * @zh 执行 `onData`，用于当数据。
     */
    onData(): Observable<string>
    /**
     * An wrapper of onKey() in the Xterm Terminal
     * A observable to emit keys and keyboard event when a user typed on the terminal

     * @zh 执行 `onKey`，用于当键。
     */
    onKey(): Observable<{key: string; domEvent: KeyboardEvent;}>

    /**
     * Executes `setXtermOptions` to handle set xterm options.
     * @zh 执行 `setXtermOptions`，用于集合Xterm配置选项。
     * @param options - options parameter (`ITerminalOptions | {theme?: any}`) / 配置选项参数（`ITerminalOptions | {theme?: any}`）
     */
    setXtermOptions(options): void;
    /**
     * The instnace of the Xterm Terminal.

     * @zh 属性 `underlying`（类型：`Terminal`），用于存储或配置underlying。
     */
    readonly underlying: Terminal
}

/**
 * Interface `NgTerminal` defining the contract and properties for ng terminal.
 * @zh 接口 `NgTerminal`，定义Angular终端的数据结构契约与属性规范。
 */
export interface NgTerminal extends TerminalWrapper{
    /**
     * Enable or disable draggable.

     * @zh 执行 `setDraggable`，用于集合是否可拖拽。
     */
    setDraggable(draggable: boolean): void;
    /**
     * Change the row count of a terminal immediately.
     * @param rows 

     * @zh 执行 `setRows`，用于集合行列表。
     */
    setRows(rows: number): void;
    /**
     * Change the column count of a terminal immediately.
     * @param cols 

     * @zh 执行 `setCols`，用于集合列列表。
     */
    setCols(cols: number): void;
    /**
     * Set the minimum height to limit dragging.
     * @param height 

     * @zh 执行 `setMinHeight`，用于集合最小值高度。
     */
    setMinHeight(height: number): void;
    /**
     * Set the minimum width to limit dragging.
     * @param width 

     * @zh 执行 `setMinWidth`，用于集合最小值宽度。
     */
    setMinWidth(width: number): void;
    /**
     * Apply styles into an element that has .resize-box class.
     * @param styleObject 

     * @zh 执行 `setStyle`，用于集合样式。
     */
    setStyle(styleObject): void;
}
