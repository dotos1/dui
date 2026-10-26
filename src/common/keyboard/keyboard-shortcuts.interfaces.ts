/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts.interfaces.ts` providing keyboard shortcuts interfaces definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts.interfaces.ts`，提供键盘快捷键列表interfaces相关的定义与实现。
 */


/**
 * Interface `Shortcut` defining the contract and properties for shortcut.
 * @zh 接口 `Shortcut`，定义快捷键的数据结构契约与属性规范。
 */
export interface Shortcut {


    /**
     * Property `key` (`string | string[]`) storing key.
     * @zh 属性 `key`（类型：`string | string[]`），用于存储或配置键。
     */
    key: string | string[];


    /**
     * Executes `command` to handle command.
     * @zh 执行 `command`，用于命令。
     * @param event - event parameter (`ShortcutEventOutput`) / 事件参数（`ShortcutEventOutput`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    command(event: ShortcutEventOutput);

    /**
     * Property `description` (`string`) storing description.
     * @zh 属性 `description`（类型：`string`），用于存储或配置描述。
     */
    description?: string;

    /**
     * Property `throttleTime` (`number`) storing throttle time.
     * @zh 属性 `throttleTime`（类型：`number`），用于存储或配置节流时间。
     */
    throttleTime?: number;

    /**
     * Property `throttle` (`number`) storing throttle.
     * @zh 属性 `throttle`（类型：`number`），用于存储或配置节流。
     */
    throttle?: number;

    /**
     * Property `label` (`string`) storing label.
     * @zh 属性 `label`（类型：`string`），用于存储或配置标签。
     */
    label?: string;
    
    /**
     * Property `preventDefault` (`boolean`) storing prevent default.
     * @zh 属性 `preventDefault`（类型：`boolean`），用于存储或配置阻止默认默认。
     */
    preventDefault?: boolean;
}

/**
 * The shortcut input type for ng-keyboard-shortcuts component

 * @zh 接口 `ShortcutInput`，定义快捷键输入属性的数据结构契约与属性规范。
 */
export interface ShortcutInput extends Shortcut {
    /**
     * textarea, select and input are ignored by default, this is used to override
     * this behavior.
     * allow in node names, accepts: ["TEXTAREA", "SELECT", "INPUT", "CONTENTEDITABLE"]

     * @zh 属性 `allowIn`（类型：`AllowIn[]`），用于存储或配置允许在。
     */
    allowIn?: AllowIn[];
    /**
     * Only trigger the command when the target is in focus.

     * @zh 属性 `target`（类型：`HTMLElement`），用于存储或配置目标。
     */
    target?: HTMLElement;
}

/**
 * Enumeration `AllowIn` defining supported allow in constants.
 * @zh 枚举 `AllowIn`，定义支持的允许在常量集合。
 */
export enum AllowIn {
    /**
     * Enum member `AllowIn.Textarea` = 'TEXTAREA' representing textarea.
     * @zh 枚举项 `AllowIn.Textarea` = 'TEXTAREA'，表示Textarea。
     */
    Textarea = 'TEXTAREA',
    /**
     * Enum member `AllowIn.Input` = 'INPUT' representing input.
     * @zh 枚举项 `AllowIn.Input` = 'INPUT'，表示输入属性。
     */
    Input = 'INPUT',
    /**
     * Enum member `AllowIn.Select` = 'SELECT' representing select.
     * @zh 枚举项 `AllowIn.Select` = 'SELECT'，表示下拉选择。
     */
    Select = 'SELECT',
    /**
     * Enum member `AllowIn.ContentEditable` = "CONTENT-EDITABLE" representing content editable.
     * @zh 枚举项 `AllowIn.ContentEditable` = "CONTENT-EDITABLE"，表示内容是否可编辑。
     */
    ContentEditable = "CONTENT-EDITABLE"
}

/**
 * Interface `ParsedShortcut` defining the contract and properties for parsed shortcut.
 * @zh 接口 `ParsedShortcut`，定义已解析快捷键的数据结构契约与属性规范。
 */
export interface ParsedShortcut extends ShortcutInput {
    /**
     * Property `key` (`string[]`) storing key.
     * @zh 属性 `key`（类型：`string[]`），用于存储或配置键。
     */
    key: string[];
    /**
     * Property `predicates` (`Function[][]`) storing predicates.
     * @zh 属性 `predicates`（类型：`Function[][]`），用于存储或配置predicates。
     */
    predicates: Function[][];
    /**
     * Property `id` (`string`) storing id.
     * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
     */
    id: string;
    /**
     * Property `priority` (`number`) storing priority.
     * @zh 属性 `priority`（类型：`number`），用于存储或配置priority。
     */
    priority?: number;
    /**
     * Property `fullMatch` (`boolean`) storing full match.
     * @zh 属性 `fullMatch`（类型：`boolean`），用于存储或配置完整匹配。
     */
    fullMatch?: boolean;
    /**
     * Property `partialMatch` (`boolean`) storing partial match.
     * @zh 属性 `partialMatch`（类型：`boolean`），用于存储或配置partial匹配。
     */
    partialMatch?: boolean;
    /**
     * Property `isSequence` (`boolean`) storing is sequence.
     * @zh 属性 `isSequence`（类型：`boolean`），用于存储或配置是否为Sequence。
     */
    isSequence: boolean;
    /**
     * Property `sequence` (`string[][]`) storing sequence.
     * @zh 属性 `sequence`（类型：`string[][]`），用于存储或配置sequence。
     */
    sequence?: string[][];
    /**
     * Property `event` (`KeyboardEvent`) storing event.
     * @zh 属性 `event`（类型：`KeyboardEvent`），用于存储或配置事件。
     */
    event?: KeyboardEvent;
}

/**
 * The output type fired by the command when shortcut is triggered.

 * @zh 接口 `ShortcutEventOutput`，定义快捷键事件输出事件的数据结构契约与属性规范。
 */
export interface ShortcutEventOutput {
    /**
     * The browser keyboard event

     * @zh 属性 `event`（类型：`KeyboardEvent`），用于存储或配置事件。
     */
    event: KeyboardEvent;
    /**
     * The registered key that was triggered

     * @zh 属性 `key`（类型：`string[] | string`），用于存储或配置键。
     */
    key: string[] | string;
}
