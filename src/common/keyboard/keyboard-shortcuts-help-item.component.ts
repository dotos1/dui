/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts-help-item.component.ts` providing keyboard shortcuts help item component definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts-help-item.component.ts`，提供键盘快捷键列表help条目组件相关的定义与实现。
 */

import {Component, Input} from '@angular/core';
import {Shortcut} from './keyboard-shortcuts.interfaces';
import {symbols} from './keys';
import {identity} from './utils';

/**
 * Renders a single {@link Shortcut} entry (key combo + label) inside the keyboard shortcuts
 * help list, translating raw key codes into display symbols.
 * @zh 在快捷键帮助列表中渲染单条 {@link Shortcut}（按键组合 + 标签），
 * 将原始按键码转换为可展示的符号。
 */
@Component({
    selector: 'keyboard-shortcuts-help-item',
    templateUrl: './keyboard-shortcuts-help-item.component.html',
    styleUrls: ['./keyboard-shortcuts-help-item.component.scss'],
    standalone: false
})
export class KeyboardShortcutsHelpItemComponent  {
    /**
     * Property `parsedKeys` (`string[][]`) storing parsed keys.
     * @zh 解析后的按键组合，按符号数组分组，便于逐个渲染按键图标。
     * @zh 解析后的按键组合，按符号数组分组，便于逐个渲染按键图标。
     */
    public parsedKeys: string[][];

    /**
     * Input property `index` (`number`) configuring index.
     * @zh 该条目在列表中的索引。
     * @zh 该条目在列表中的索引。
     */
    @Input() index: number;

    /**
     * The shortcut entry to render; setting it parses its key combo(s) into display symbols.
     * @zh 待渲染的快捷键条目；设置时会将其按键组合解析为可展示的符号。
     */
    @Input()
    set shortcut(shortcut: Shortcut) {
        const key = Array.isArray(shortcut.key) ? shortcut.key : [shortcut.key];
        this.parsedKeys = key.map(key =>
            key
                .split(' ')
                .filter(identity)
                .filter(key => key !== '+')
                .map(key => {
                    if (symbols[key]) {
                        return symbols[key];
                    }
                    return key;
                })
        );
        this._shortcut = shortcut;
    }

    /**
     * The shortcut entry currently rendered.
     * @zh 当前渲染的快捷键条目。
     */
    get shortcut() {
        return this._shortcut;
    }

    /**
     * Property `_shortcut` (`Shortcut`) storing shortcut.
     * @zh 属性 `_shortcut`（类型：`Shortcut`），用于存储或配置快捷键。
     */
    private _shortcut: Shortcut;

    /**
     * Creates an instance of `KeyboardShortcutsHelpItemComponent` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutsHelpItemComponent` 实例，并初始化其依赖项与内部状态。
     */
    constructor() {
    }
}
