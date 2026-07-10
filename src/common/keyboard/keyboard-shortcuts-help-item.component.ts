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
    styleUrls: ['./keyboard-shortcuts-help-item.component.scss']
})
export class KeyboardShortcutsHelpItemComponent  {
    public parsedKeys: string[][];

    @Input() index: number;

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

    get shortcut() {
        return this._shortcut;
    }

    private _shortcut: Shortcut;

    constructor() {
    }
}
